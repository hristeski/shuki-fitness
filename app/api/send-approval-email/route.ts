import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(request: Request) {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: "RESEND_API_KEY is not configured" },
        { status: 500 }
      );
    }

    const resend = new Resend(apiKey);
    const { userEmail, items } = await request.json();
    const programNames = items.map((item: any) => item.name).join(", ");

    const data = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: ['hristeski2@gmail.com'],
      subject: `✅ Program Unlocked for ${userEmail}`,
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #ffffff; color: #0a0a0a; padding: 30px; border: 1px solid #e4e4e7;">
          <h1 style="color: #b91c1c;">PROGRAM UNLOCKED</h1>
          <p>Клиентот <strong>${userEmail}</strong> е одобрен.</p>
          <p>Отклучени програми: <strong>${programNames}</strong></p>
        </div>
      `,
    });

    if (data.error) {
      return NextResponse.json({ success: false, error: data.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Грешка при API повик:", error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}