"use client";

import Link from "next/link";

export default function UpdatePasswordPage() {
  return (
    <>
      <div className="mb-10">
        <h1 className="text-4xl font-bold">Новый пароль</h1>
        <p className="mt-2 text-sm text-gray-500">
          Пароли больше не используются — вход выполняется через Telegram.
        </p>
      </div>
      <div className="rounded-2xl border border-gray-100 bg-white p-6 text-sm text-gray-600 shadow-sm shadow-black/[0.03]">
        Чтобы продолжить работу, авторизуйся через Telegram.
      </div>
      <div className="mt-6">
        <Link
          href="/signin"
          className="inline-flex items-center justify-center rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800"
        >
          Вернуться ко входу
        </Link>
      </div>
    </>
  );
}
