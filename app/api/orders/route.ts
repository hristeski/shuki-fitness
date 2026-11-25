import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { getSupabaseAdmin } from "@/utils/supabaseAdmin";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabaseAdmin = getSupabaseAdmin();
    const { data, error } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase GET orders error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ orders: data || [] });
  } catch (err: any) {
    console.error("API GET /api/orders error:", err?.message || err);
    return NextResponse.json(
      { error: err?.message || "Server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const itemsRaw = formData.get("items") as string | null;
    const totalPriceRaw = formData.get("totalPrice") as string | null;
    const paymentMethod = (formData.get("paymentMethod") as string) || "bank";
    const promoCode = (formData.get("promoCode") as string) || null;

    if (!itemsRaw || !totalPriceRaw) {
      return NextResponse.json({ error: "Missing order details." }, { status: 400 });
    }

    const items = JSON.parse(itemsRaw);
    const totalPrice = Number(totalPriceRaw);

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty." }, { status: 400 });
    }

    if (!file || file.size === 0) {
      return NextResponse.json(
        { error: "Payment receipt file is required." },
        { status: 400 }
      );
    }

    const supabaseAdmin = getSupabaseAdmin();

    // Проверка на дупликат нарачки на сервер
    const { data: existingOrders } = await supabaseAdmin
      .from("orders")
      .select("items, status")
      .eq("user_id", user.id)
      .in("status", ["pending_bank", "pending_crypto", "pending_card", "completed"]);

    if (existingOrders) {
      const boughtIds = new Set<string>();
      existingOrders.forEach((order: any) => {
        const parsed =
          typeof order.items === "string" ? JSON.parse(order.items) : order.items || [];
        parsed.forEach((i: any) => boughtIds.add(i.id));
      });

      const dupes = items
        .filter((item: any) => boughtIds.has(item.id))
        .map((item: any) => item.name);

      if (dupes.length > 0) {
        return NextResponse.json(
          { error: `You already own or have a pending order for: ${dupes.join(", ")}` },
          { status: 409 }
        );
      }
    }

    // Прикачување уплатница во Supabase Storage преку service_role
    const fileExt = file.name.split(".").pop() || "jpg";
    const fileName = `${user.id}-${Date.now()}.${fileExt}`;
    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);

    const { error: uploadError } = await supabaseAdmin.storage
      .from("receipts")
      .upload(fileName, fileBuffer, {
        contentType: file.type || "application/octet-stream",
        upsert: false,
      });

    if (uploadError) {
      console.error("Storage upload error:", uploadError.message);
      return NextResponse.json(
        { error: `Receipt upload failed: ${uploadError.message}` },
        { status: 500 }
      );
    }

    const { data: publicUrlData } = supabaseAdmin.storage
      .from("receipts")
      .getPublicUrl(fileName);

    const userEmail =
      user.primaryEmailAddress?.emailAddress ||
      user.emailAddresses?.[0]?.emailAddress ||
      "no-email@clerk.com";

    const { data: insertedOrder, error: dbError } = await supabaseAdmin
      .from("orders")
      .insert([
        {
          user_id: user.id,
          user_email: userEmail,
          total_price: totalPrice,
          items,
          status: `pending_${paymentMethod}`,
          proof_url: publicUrlData.publicUrl,
          promo_code: promoCode,
        },
      ])
      .select()
      .single();

    if (dbError) {
      console.error("DB insert error:", dbError.message);
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, order: insertedOrder }, { status: 201 });
  } catch (err: any) {
    console.error("API POST /api/orders error:", err?.message || err);
    return NextResponse.json(
      { error: err?.message || "Server error" },
      { status: 500 }
    );
  }
}