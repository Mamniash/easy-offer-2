"use client";

import TelegramLogin from "@/components/auth/telegram-login";

export default function SignIn() {
  return (
    <>
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold">Вход в аккаунт</h1>
        <p className="mt-3 text-sm text-gray-500">
          Используйте аккаунт Telegram, чтобы войти в приложение. Мы не просим
          почту и пароль.
        </p>
      </div>

      <TelegramLogin />
    </>
  );
}
