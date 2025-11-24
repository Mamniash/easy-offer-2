"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";

import { supabase } from "@/lib/supabaseClient";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;

    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (error || !data.user) {
        router.replace("/signin");
        return;
      }

      if (!mounted) return;
      setUser(data.user);
      setLoading(false);
    };

    fetchUser();

    return () => {
      mounted = false;
    };
  }, [router]);

  const formattedDate = useMemo(() => {
    if (!user?.created_at) return null;
    return new Date(user.created_at).toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }, [user?.created_at]);

  const displayName =
    user?.user_metadata?.name ||
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "Твой профиль";

  if (loading) {
    return (
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="h-32 animate-pulse rounded-2xl bg-white shadow-lg shadow-black/5" />
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.08em] text-blue-600">Личный кабинет</p>
            <h1 className="mt-1 text-3xl font-semibold sm:text-4xl">{displayName}</h1>
            <p className="mt-2 text-sm text-gray-500">
              Контакты и базовые данные аккаунта — без лишнего шума.
            </p>
          </div>
          <Link
            href="/update-password"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-gray-800 shadow-sm ring-1 ring-gray-200 transition hover:-translate-y-0.5 hover:shadow-md hover:ring-gray-300"
          >
            Обновить пароль
            <span className="text-xs font-medium text-gray-500">защита</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-2xl bg-white p-6 shadow-lg shadow-black/5 ring-1 ring-gray-100">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">Профиль</p>
                  <h2 className="mt-1 text-xl font-semibold text-gray-900">Основная информация</h2>
                  <p className="mt-2 text-sm text-gray-500">
                    Эти данные подтягиваются из Supabase и обновляются автоматически.
                  </p>
                </div>
              </div>

              <dl className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-gray-100 px-4 py-3">
                  <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">Email</dt>
                  <dd className="mt-1 text-base font-medium text-gray-900">{user?.email}</dd>
                </div>
                <div className="rounded-xl border border-gray-100 px-4 py-3">
                  <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">UID</dt>
                  <dd className="mt-1 truncate text-base font-medium text-gray-900">{user?.id}</dd>
                </div>
                {formattedDate && (
                  <div className="rounded-xl border border-gray-100 px-4 py-3">
                    <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">С нами с</dt>
                    <dd className="mt-1 text-base font-medium text-gray-900">{formattedDate}</dd>
                  </div>
                )}
                <div className="rounded-xl border border-gray-100 px-4 py-3">
                  <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">Текущий статус</dt>
                  <dd className="mt-1 text-base font-medium text-gray-900">
                    Готовимся к новым предложениям 🚀
                  </dd>
                </div>
              </dl>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-lg shadow-black/5 ring-1 ring-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">Контакт для связи</h3>
              <p className="mt-2 text-sm text-gray-500">
                Мы оперативно ответим на вопросы по прогрессу или по твоим трекам.
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <div className="rounded-xl bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-800">
                  {user?.email}
                </div>
                <p className="text-sm text-gray-500">Можно писать прямо на эту почту — она привязана к аккаунту.</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-blue-500 p-[1px] shadow-lg shadow-blue-500/20">
              <div className="h-full rounded-[15px] bg-white p-5">
                <p className="text-xs uppercase tracking-[0.18em] text-blue-600">Быстрые действия</p>
                <div className="mt-3 space-y-3">
                  <Link
                    href="/tracks"
                    className="flex items-center justify-between rounded-xl bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-800 transition hover:bg-blue-100"
                  >
                    Твои треки
                    <span className="text-xs font-medium text-blue-600">продолжить</span>
                  </Link>
                  <Link
                    href="/"
                    className="flex items-center justify-between rounded-xl border border-gray-100 px-4 py-3 text-sm font-semibold text-gray-800 transition hover:-translate-y-0.5 hover:shadow-sm"
                  >
                    На главную
                    <span className="text-xs font-medium text-gray-500">обзор</span>
                  </Link>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-5 shadow-lg shadow-black/5 ring-1 ring-gray-100">
              <h4 className="text-base font-semibold text-gray-900">Нужна помощь?</h4>
              <p className="mt-2 text-sm text-gray-500">
                Если что-то пошло не так — отпишись, мы поправим доступ и восстановим прогресс.
              </p>
              <a
                href="mailto:help@preoffer.app"
                className="mt-3 inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                Написать в поддержку
                <span className="text-xs font-medium text-gray-300">help@preoffer.app</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
