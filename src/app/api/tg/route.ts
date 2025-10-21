import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    const botToken = process.env.TG_BOT_TOKEN; // свій токен
    const chatId = process.env.TG_CHAT_ID;     // свій chat id

    if (!botToken || !chatId) {
      return NextResponse.json({ ok: false, error: "Missing bot token or chat id" });
    }

    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: message }),
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false, error: String(err) });
  }
}
