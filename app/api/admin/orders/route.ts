import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { Resend } from "resend";
import { getSupabaseAdmin } from "@/utils/supabaseAdmin";

const ADMIN_EMAILS = ["getsurefixedgames@gmail.com", "smootyefects@gmail.com"];

async function verifyAdmin() {
  const user = await currentUser();
  if (!user) return null;

  const email =
    user.primaryEmailAddress?.emailAddress ||
    user.emailAddresses?.[0]?.emailAddress ||
    "";

  if (!ADMIN_EMAILS.includes(email)) return null;
  return user;
}

export async function GET() {
  try {
    const admin = await verifyAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const supabaseAdmin = getSupabaseAdmin();
    const { data, error } = await supabaseAdmin
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ orders: data || [] });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const admin = await verifyAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { orderId, action } = await request.json();
    if (!orderId || !["approve", "revoke"].includes(action)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const supabaseAdmin = getSupabaseAdmin();

    if (action === "approve") {
      const expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + 3);

      const { data: updatedOrder, error } = await supabaseAdmin
        .from("orders")
        .update({
          status: "completed",
          expires_at: expiresAt.toISOString(),
        })
        .eq("id", orderId)
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      // Опционално праќање мејл преку Resend ако има клуч
      if (process.env.RESEND_API_KEY && updatedOrder) {
        try {
          const resend = new Resend(process.env.RESEND_API_KEY);
          const itemsArray =
            typeof updatedOrder.items === "string"
              ? JSON.parse(updatedOrder.items)
              : updatedOrder.items || [];
          const programNames = itemsArray.map((i: any) => i.name).join(", ");

          await resend.emails.send({
            from: "onboarding@resend.dev",
            to: ["hristeski2@gmail.com"],
            subject: `✅ Evolution Body Unlocked for ${updatedOrder.user_email}`,
            html: `
              <div style="font-family: Arial, sans-serif; padding: 24px;">
                <h2 style="color: #991b1b;">EVOLUTION BODY — PROGRAM UNLOCKED</h2>
                <p>Клиентот <strong>${updatedOrder.user_email}</strong> е одобрен.</p>
                <p>Отклучени програми: <strong>${programNames}</strong></p>
              </div>
            `,
          });
        } catch (emailErr) {
          console.error("Resend email warning:", emailErr);
        }
      }

      return NextResponse.json({ success: true, order: updatedOrder });
    }

    // Revoke
    const { data: revokedOrder, error } = await supabaseAdmin
      .from("orders")
      .update({
        status: "revoked",
        expires_at: null,
      })
      .eq("id", orderId)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, order: revokedOrder });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const admin = await verifyAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("id");

    if (!orderId) {
      return NextResponse.json({ error: "Missing order id" }, { status: 400 });
    }

    const supabaseAdmin = getSupabaseAdmin();
    const { error } = await supabaseAdmin
      .from("orders")
      .delete()
      .eq("id", orderId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Server error" },
      { status: 500 }
    );
  }
}