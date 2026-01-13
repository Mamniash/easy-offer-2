"use client";

import TelegramLogin from "@/components/auth/telegram-login";

export default function SignIn() {
  return (
    <>
      <div className="mb-10">
        <h1 className="text-4xl font-bold">Вход в аккаунт</h1>
        <p className="mt-2 text-sm text-gray-500">
          Вход происходит через Telegram — это быстро и безопасно.
        </p>
      </div>

      <TelegramLogin />
    </>
  );
}
