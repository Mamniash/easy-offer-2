"use client";

import { useEffect, useRef } from "react";

export default function TelegramLogin() {
  const widgetRef = useRef<HTMLDivElement | null>(null);
  const botName = process.env.NEXT_PUBLIC_TELEGRAM_BOT_NAME;
  const authUrl = process.env.NEXT_PUBLIC_TELEGRAM_AUTH_URL;
  const requestAccess =
    process.env.NEXT_PUBLIC_TELEGRAM_REQUEST_ACCESS ?? "write";
  const userpic = process.env.NEXT_PUBLIC_TELEGRAM_USERPIC ?? "false";
  const lang = process.env.NEXT_PUBLIC_TELEGRAM_LANG ?? "ru";

  useEffect(() => {
    if (!botName || !widgetRef.current) {
      return;
    }

    widgetRef.current.innerHTML = "";

    const resolvedAuthUrl = new URL(
      authUrl ?? "/auth/telegram/callback",
      window.location.origin
    ).toString();
    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.async = true;
    script.setAttribute("data-telegram-login", botName);
    script.setAttribute("data-size", "large");
    script.setAttribute("data-userpic", userpic);
    script.setAttribute("data-radius", "12");
    script.setAttribute("data-request-access", requestAccess);
    script.setAttribute("data-lang", lang);
    script.setAttribute("data-auth-url", resolvedAuthUrl);

    widgetRef.current.appendChild(script);

    return () => {
      if (widgetRef.current) {
        widgetRef.current.innerHTML = "";
      }
    };
  }, [authUrl, botName, lang, requestAccess, userpic]);

  if (!botName) {
    return (
      <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
        Не указан NEXT_PUBLIC_TELEGRAM_BOT_NAME. Добавь его в переменные
        окружения, чтобы показать кнопку входа.
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="flex justify-center">
        <div ref={widgetRef} />
      </div>
      <p className="text-center text-sm text-gray-500">
        Авторизация откроется в Telegram и вернет вас обратно на сайт.
      </p>
    </div>
  );
}
