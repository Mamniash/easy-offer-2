"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabaseClient";

type ProfileUser = {
  email: string;
  name?: string | null;
  createdAt?: string;
  id?: string;
};

export default function ProfilePage() {
  const [user, setUser] = useState<ProfileUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        router.replace("/signin");
        return;
      }

      const { email, id, created_at, user_metadata } = session.user;

      setUser({
        email: email ?? "",
        id,
        createdAt: created_at,
        name: user_metadata?.full_name || user_metadata?.name,
      });
      setLoading(false);
    };

    fetchSession();
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.replace("/");
  };

  return (
    <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8 space-y-3">
        <p className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
          Мой кабинет
        </p>
        <h1 className="text-4xl font-bold leading-tight text-gray-900">
          Профиль пользователя
        </h1>
        <p className="text-base text-gray-600">
          Здесь собрана краткая информация о твоей учетной записи и быстрые
          действия. Всё рядом и в одном стиле.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm shadow-black/[0.03]">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-blue-500 text-xl font-semibold text-white shadow-md">
              {user?.name?.[0] || user?.email?.[0] || "?"}
            </div>
            <div className="space-y-1">
              <p className="text-lg font-semibold text-gray-900">
                {loading ? "Загружаем…" : user?.name || "Без имени"}
              </p>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                ID пользователя
              </p>
              <p className="mt-1 truncate text-sm font-medium text-gray-900">
                {user?.id}
              </p>
            </div>
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Дата регистрации
              </p>
              <p className="mt-1 text-sm font-medium text-gray-900">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString("ru-RU") : "—"}
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800"
            >
              На главную
            </Link>
            <button
              onClick={handleSignOut}
              className="inline-flex items-center justify-center rounded-lg bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100"
            >
              Выйти из аккаунта
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm shadow-black/[0.03]">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
              Контакты
            </h2>
            <p className="mt-2 text-sm text-gray-700">
              Если появятся вопросы — пиши на <span className="font-semibold text-gray-900">support@preoffer.ru</span> или в чат
              поддержки. Мы ответим максимально быстро.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm shadow-black/[0.03]">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
              Что дальше?
            </h2>
            <p className="mt-2 text-sm text-gray-700">
              Следи за прогрессом, обновляй данные профиля и продолжай тренировки.
              Новые функции появятся здесь самыми первыми.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
