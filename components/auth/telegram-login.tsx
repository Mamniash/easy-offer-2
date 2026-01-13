"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { supabase } from "@/lib/supabaseClient";

type TelegramAuthPayload = {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
};

declare global {
  interface Window {
    onTelegramAuth?: (user: TelegramAuthPayload) => void;
  }
}

export default function TelegramLogin() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const widgetRef = useRef<HTMLDivElement | null>(null);
  const botName = process.env.NEXT_PUBLIC_TELEGRAM_BOT_NAME;
  const authUrl = process.env.NEXT_PUBLIC_TELEGRAM_AUTH_URL;
  const requestAccess =
    process.env.NEXT_PUBLIC_TELEGRAM_REQUEST_ACCESS ?? "write";
  const userpic = process.env.NEXT_PUBLIC_TELEGRAM_USERPIC ?? "false";
  const lang = process.env.NEXT_PUBLIC_TELEGRAM_LANG ?? "ru";

  useEffect(() => {
    if (!botName) {
      return;
    }

    window.onTelegramAuth = async (user: TelegramAuthPayload) => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/auth/telegram", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(user),
        });

        if (!response.ok) {
          const payload = await response.json().catch(() => ({}));
          setError(
            payload?.error || "Не удалось авторизоваться через Telegram"
          );
          setLoading(false);
          return;
        }

        const payload = await response.json();
        const session = payload?.session;

        if (!session?.access_token || !session?.refresh_token) {
          setError("Не удалось получить сессию Supabase");
          setLoading(false);
          return;
        }

        const { error: sessionError } = await supabase.auth.setSession({
          access_token: session.access_token,
          refresh_token: session.refresh_token,
        });

        if (sessionError) {
          setError("Не удалось сохранить сессию");
          setLoading(false);
          return;
        }

        router.replace("/tracks");
      } catch (err) {
        console.error(err);
        setError("Ошибка соединения. Попробуйте еще раз.");
      } finally {
        setLoading(false);
      }
    };

    return () => {
      delete window.onTelegramAuth;
    };
  }, [botName, router]);

  useEffect(() => {
    if (!botName || !widgetRef.current) {
      return;
    }

    widgetRef.current.innerHTML = "";

    const resolvedAuthUrl = authUrl
      ? new URL(authUrl, window.location.origin).toString()
      : null;
    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.async = true;
    script.setAttribute("data-telegram-login", botName);
    script.setAttribute("data-size", "large");
    script.setAttribute("data-userpic", userpic);
    script.setAttribute("data-radius", "12");
    script.setAttribute("data-request-access", requestAccess);
    script.setAttribute("data-lang", lang);
    if (resolvedAuthUrl) {
      script.setAttribute("data-auth-url", resolvedAuthUrl);
    } else {
      script.setAttribute("data-onauth", "onTelegramAuth(user)");
    }

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
      <div
        className={`flex justify-center ${loading ? "pointer-events-none opacity-70" : ""}`}
      >
        <div ref={widgetRef} />
      </div>
      {loading && (
        <div className="w-full max-w-xs rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-sm">
          <div className="flex items-center gap-3">
            <span
              className="inline-flex h-8 w-8 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600"
              aria-hidden="true"
            />
            <div className="flex-1 space-y-2">
              <div className="h-2 w-4/5 rounded-full bg-gray-200 animate-pulse" />
              <div className="h-2 w-2/3 rounded-full bg-gray-100 animate-pulse" />
            </div>
          </div>
          <p className="mt-3 text-sm text-gray-500">Подключаем Telegram…</p>
        </div>
      )}
      {error && (
        <div className="w-full rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}
    </div>
  );
}
