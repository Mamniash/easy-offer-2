"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import { directionGroups } from "@/lib/tracks";

export const metadata = {
  title: "PreOffer",
  description:
    "Собрали направления и профессии, чтобы перейти к вопросам и подготовке. Выберите трек и смотрите частые вопросы.",
};

export default function TracksLandingPage() {
  const [query, setQuery] = useState("");

  const filteredGroups = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    if (!normalized) return directionGroups;

    return directionGroups
      .map((group) => ({
        ...group,
        items: group.items.filter(
          (item) =>
            item.name.toLowerCase().includes(normalized) ||
            item.description.toLowerCase().includes(normalized),
        ),
      }))
      .filter((group) => group.items.length > 0);
  }, [query]);

  return (
    <section className="pb-20 pt-32 md:pt-40">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white/90 p-10 shadow-xl backdrop-blur">
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.08),transparent_25%),radial-gradient(circle_at_80%_0%,rgba(14,165,233,0.1),transparent_26%)]" />
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-blue-600">Воронка подготовки</p>
              <h1 className="mt-3 text-4xl font-bold text-gray-900 md:text-5xl">
                Выберите направление,
                <br className="hidden md:block" /> чтобы идти дальше
              </h1>
              <p className="mt-4 max-w-2xl text-lg text-gray-700">
                Нажмите на профессию — увидите частые вопросы, фильтры по грейду и
                подсказки. Карточки ниже — это черновые списки, их можно двигать и
                дополнять под ваши команды.
              </p>
            </div>
            <div className="flex gap-4 rounded-2xl bg-gray-900 p-6 text-gray-100 shadow-lg">
              <div>
                <p className="text-sm text-gray-400">Направлений</p>
                <p className="text-4xl font-semibold">{directionGroups.flatMap((g) => g.items).length}</p>
              </div>
              <div className="h-12 w-px bg-gray-700/60" aria-hidden="true" />
              <div>
                <p className="text-sm text-gray-400">Вопросов в базе</p>
                <p className="text-4xl font-semibold">12 345</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-gray-600">
            Подберите нужное направление или найдите профессию через поиск.
          </p>
          <label className="relative w-full max-w-md">
            <span className="sr-only">Поиск по направлениям</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Найти направление или профессию"
              className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-4 pr-10 text-sm text-gray-700 shadow-sm transition focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </span>
          </label>
        </div>

        <div className="mt-10 space-y-10">
          {filteredGroups.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-10 text-center text-gray-600">
              По запросу ничего не нашли. Попробуйте сократить или изменить формулировку.
            </div>
          ) : (
            filteredGroups.map((group) => (
              <div key={group.title} className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-1 rounded-full bg-blue-500/80" aria-hidden />
                  <div>
                    <p className="text-sm uppercase tracking-[0.18em] text-gray-500">{group.title}</p>
                    <h2 className="text-2xl font-semibold text-gray-900">Выбирайте трек в пару кликов</h2>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {group.items.map((item) => (
                    <Link
                      key={item.slug}
                      href={`/tracks/${item.slug}`}
                      className="group relative flex h-full flex-col justify-between rounded-xl border border-gray-200 bg-white px-5 py-6 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg"
                    >
                      <div className="absolute right-4 top-4 flex items-center gap-2 text-xs font-medium text-blue-600 opacity-0 transition group-hover:opacity-100">
                        Перейти
                        <span aria-hidden>→</span>
                      </div>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">{item.name}</h3>
                          <p className="mt-1 text-sm text-gray-600">{item.description}</p>
                        </div>
                      </div>
                      <div className="mt-5 flex items-center gap-3 text-sm text-gray-500">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden />
                        Заглушка: покажем карту вопросов и фильтры
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
