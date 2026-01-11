"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import ProPlanSelection from "@/components/pro/pro-plan-selection";
import { supabase } from "@/lib/supabaseClient";

type ComparisonItem = {
  title: string;
  free: string;
  pro: string;
};

const COMPARISON: ComparisonItem[] = [
  {
    title: "Кол-во вопросов",
    free: "До 50 в треке",
    pro: "Все вопросы и фильтры",
  },
  {
    title: "Источники и видео",
    free: "Скрыто",
    pro: "YouTube и полезные ссылки",
  },
  {
    title: "Навигация по темам",
    free: "Базовая",
    pro: "Карта приоритетов и подсказки",
  },
  {
    title: "Поддержка",
    free: "Почта",
    pro: "Чат + ранние обновления",
  },
];

export default function ProPage() {
  const [userName, setUserName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
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

      const { user_metadata } = session.user;
      setUserName(user_metadata?.full_name || user_metadata?.name || null);
      setIsLoading(false);
    };

    fetchSession();
  }, [router]);

  if (isLoading) {
    return (
      <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
          <div className="h-6 w-32 rounded-full bg-gray-200" />
          <div className="mt-4 h-10 w-2/3 rounded-xl bg-gray-200" />
          <div className="mt-3 h-4 w-full rounded-full bg-gray-100" />
        </div>
      </section>
    );
  }

  return (
    <section className="pb-20 pt-16 md:pt-24">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 sm:px-6">
        <div className="rounded-3xl border border-gray-100 bg-gradient-to-br from-gray-900 via-gray-900 to-blue-900 p-8 text-white shadow-lg">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-200">
            PRO-подписка
          </p>
          <h1 className="mt-4 text-3xl font-bold md:text-4xl">
            Открываем полный доступ к PreOffer
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-blue-100">
            {userName ? `${userName},` : "Привет,"} сравни свой текущий доступ с
            возможностями PRO и выбери подходящий тариф.
          </p>
        </div>

        <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold text-gray-900">
              Сравнение доступа
            </h2>
            <p className="text-sm text-gray-600">
              Посмотри, чем отличается базовый доступ от PRO-подписки.
            </p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {COMPARISON.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-gray-100 bg-gray-50 p-5"
              >
                <p className="text-sm font-semibold text-gray-900">
                  {item.title}
                </p>
                <div className="mt-3 grid gap-3 text-sm md:grid-cols-2">
                  <div className="rounded-xl bg-white p-3 text-gray-600 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Сейчас
                    </p>
                    <p className="mt-1 font-medium text-gray-800">
                      {item.free}
                    </p>
                  </div>
                  <div className="rounded-xl bg-blue-600 p-3 text-white shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-wide text-blue-100">
                      PRO
                    </p>
                    <p className="mt-1 font-medium">{item.pro}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <ProPlanSelection />
        </div>
      </div>
    </section>
  );
}
