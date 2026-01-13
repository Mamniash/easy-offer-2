"use client";

import TelegramLogin from "@/components/auth/telegram-login";

export default function SignUp() {
  return (
    <>
      <div className="mb-10">
        <h1 className="text-4xl font-bold">Создать аккаунт</h1>
        <p className="mt-2 text-sm text-gray-500">
          Регистрация теперь происходит через Telegram.
        </p>
      </div>
      <TelegramLogin />
    </>
  );
}
