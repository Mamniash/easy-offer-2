import { NextResponse } from "next/server";

type TelegramUpdate = {
  message?: {
    message_id: number;
    text?: string;
    chat: {
      id: number;
      type: string;
    };
  };
};

const extractLoginState = (text: string) => {
  const match = text.match(/^\/start(?:@\w+)?\s+login_(\S+)/i);
  return match?.[1] ?? null;
};

export const POST = async (request: Request) => {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;

  if (!botToken) {
    return NextResponse.json(
      { error: "Missing TELEGRAM_BOT_TOKEN" },
      { status: 500 },
    );
  }

  const update = (await request.json()) as TelegramUpdate;
  const message = update.message;
  const text = message?.text?.trim();

  if (!message || !text) {
    return NextResponse.json({ ok: true });
  }

  const state = extractLoginState(text);
  if (!state) {
    return NextResponse.json({ ok: true });
  }

  const origin = new URL(request.url).origin;
  const loginUrl = new URL("/api/auth/telegram/callback", origin);
  loginUrl.searchParams.set("state", state);

  const response = await fetch(
    `https://api.telegram.org/bot${botToken}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: message.chat.id,
        text: "Нажмите кнопку ниже, чтобы войти через Telegram.",
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Войти на сайт",
                login_url: {
                  url: loginUrl.toString(),
                },
              },
            ],
          ],
        },
      }),
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    return NextResponse.json(
      { error: "Failed to send Telegram message", details: errorText },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
};
