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

const isBareStartCommand = (text: string) => /^\/start(?:@\w+)?$/i.test(text);

const sendTelegramMessage = async (
  botToken: string,
  payload: {
    chat_id: number;
    text: string;
    reply_markup?: {
      inline_keyboard: Array<
        Array<{
          text: string;
          login_url: {
            url: string;
          };
        }>
      >;
    };
  },
) =>
  fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

const resolveBaseOrigin = (request: Request) => {
  const configuredOrigin =
    process.env.NEXT_PUBLIC_SITE_URL ?? process.env.APP_BASE_URL;

  if (configuredOrigin) {
    return new URL(configuredOrigin).origin;
  }

  return new URL(request.url).origin;
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

  if (isBareStartCommand(text)) {
    const origin = resolveBaseOrigin(request);
    const response = await sendTelegramMessage(botToken, {
      chat_id: message.chat.id,
      text: [
        "Откройте бота через кнопку “Войти через Telegram” на сайте, иначе нет параметра login_…",
        `Сайт: ${origin}`,
        "Нажмите именно кнопку авторизации на сайте.",
      ].join("\n"),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: "Failed to send Telegram message", details: errorText },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true });
  }

  const state = extractLoginState(text);
  if (!state) {
    return NextResponse.json({ ok: true });
  }

  const origin = resolveBaseOrigin(request);
  const loginUrl = new URL("/api/auth/telegram/callback", origin);
  loginUrl.searchParams.set("state", state);

  const response = await sendTelegramMessage(botToken, {
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
  });

  if (!response.ok) {
    const errorText = await response.text();
    return NextResponse.json(
      { error: "Failed to send Telegram message", details: errorText },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
};
