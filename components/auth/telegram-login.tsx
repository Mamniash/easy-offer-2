"use client";

import Script from "next/script";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
  const botName = process.env.NEXT_PUBLIC_TELEGRAM_BOT_NAME;

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
          setError(payload?.error || "Не удалось авторизоваться через Telegram");
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

  if (!botName) {
    return (
      <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
        Не указан NEXT_PUBLIC_TELEGRAM_BOT_NAME. Добавь его в переменные
        окружения, чтобы показать кнопку входа.
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex min-h-[56px] items-center justify-center">
        <div
          className={`transition-opacity duration-200 ${
            loading ? "opacity-60" : "opacity-100"
          }`}
        >
          <Script
            src="https://telegram.org/js/telegram-widget.js?22"
            strategy="afterInteractive"
            data-telegram-login={botName}
            data-size="large"
            data-userpic="false"
            data-radius="12"
            data-request-access="write"
            data-onauth="onTelegramAuth(user)"
          />
        </div>
      </div>
      <div className="min-h-[24px]">
        {loading ? (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-transparent" />
            Подключаем Telegram…
          </div>
        ) : (
          <span className="invisible text-sm">Подключаем Telegram…</span>
        )}
      </div>
      {error && (
        <div className="w-full rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}
    </div>
  );
}
