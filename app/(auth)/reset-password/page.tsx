"use client";

import Link from "next/link";

export default function ResetPassword() {
  return (
    <>
      <div className="mb-10">
        <h1 className="text-4xl font-bold">Восстановление пароля</h1>
        <p className="mt-2 text-sm text-gray-500">
          Вход теперь доступен только через Telegram, поэтому пароль не
          требуется.
        </p>
      </div>
      <div className="rounded-2xl border border-gray-100 bg-white p-6 text-sm text-gray-600 shadow-sm shadow-black/[0.03]">
        Если нужно войти в аккаунт, используй Telegram-авторизацию.
      </div>
      <div className="mt-6">
        <Link
          href="/signin"
          className="inline-flex items-center justify-center rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800"
        >
          Перейти ко входу
        </Link>
      </div>
    </>
  );
}
