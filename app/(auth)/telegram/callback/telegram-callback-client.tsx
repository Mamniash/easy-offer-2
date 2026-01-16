"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import { supabase } from "@/lib/supabaseClient";

type TelegramAuthPayload = {
  id: string;
  auth_date: string;
  hash: string;
  first_name?: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
};

const buildPayload = (
  params: URLSearchParams
): TelegramAuthPayload | null => {
  const id = params.get("id");
  const authDate = params.get("auth_date");
  const hash = params.get("hash");

  if (!id || !authDate || !hash) {
    return null;
  }

  const payload: TelegramAuthPayload = {
    id,
    auth_date: authDate,
    hash,
  };

  const firstName = params.get("first_name");
  const lastName = params.get("last_name");
  const username = params.get("username");
  const photoUrl = params.get("photo_url");

  if (firstName) {
    payload.first_name = firstName;
  }

  if (lastName) {
    payload.last_name = lastName;
  }

  if (username) {
    payload.username = username;
  }

  if (photoUrl) {
    payload.photo_url = photoUrl;
  }

  return payload;
};

export default function TelegramCallbackClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const hasRequestedRef = useRef(false);
  const searchKey = searchParams.toString();

  const payload = useMemo(
    () => buildPayload(new URLSearchParams(searchKey)),
    [searchKey]
  );

  useEffect(() => {
    if (hasRequestedRef.current) {
      return;
    }

    hasRequestedRef.current = true;

    if (!payload) {
      setError("Данные Telegram не пришли. Попробуйте войти снова.");
      setLoading(false);
      return;
    }

    const authenticate = async () => {
      try {
        const response = await fetch("/api/auth/telegram", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const responsePayload = await response.json().catch(() => ({}));
          setError(
            responsePayload?.error || "Не удалось авторизоваться через Telegram"
          );
          setLoading(false);
          return;
        }

        const responsePayload = await response.json();
        const session = responsePayload?.session;

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
        setLoading(false);
      }
    };

    void authenticate();
  }, [payload, router]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600" />
          <p className="text-sm text-gray-500">
            Подключаем Telegram и создаем сессию…
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="w-full max-w-md rounded-2xl border border-red-100 bg-red-50 p-6 text-center shadow-sm">
          <p className="text-sm text-red-700">{error}</p>
          <button
            type="button"
            onClick={() => router.replace("/signin")}
            className="mt-4 rounded-full bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
          >
            Вернуться к входу
          </button>
        </div>
      </div>
    );
  }

  return null;
}
