import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Директно го ставаме твојот клуч само за тест
const resend = new Resend(process.env.RESEND_API_KEY);
export async function POST(request: Request) {
  try {
    const { userEmail, items } = await request.json();
    const programNames = items.map((item: any) => item.name).join(", ");

    const data = await resend.emails.send({
      from: 'onboarding@resend.dev', // Мора да остане вака за сега
      // ВНИМАНИЕ: За тест, СИТЕ мејлови ги праќаме кај тебе
      to: ['hristeski2@gmail.com'], 
      subject: `✅ TEST: Program Unlocked for ${userEmail}`,
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #000; color: #fff; padding: 30px;">
          <h1 style="color: #dc2626;">TEST EMAIL</h1>
          <p>Ова е тест. Клиентот <strong>${userEmail}</strong> е одобрен.</p>
          <p>Отклучени програми: <strong>${programNames}</strong></p>
        </div>
      `,
    });

    // Ако Resend врати некаква грешка (пр. блокиран мејл), ќе ја испринтаме во терминал
    if (data.error) {
        console.log("RESEND ERROR:", data.error);
        return NextResponse.json({ success: false, error: data.error }, { status: 400 });
    }

    console.log("RESEND УСПЕХ:", data);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Грешка при API повик:", error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
