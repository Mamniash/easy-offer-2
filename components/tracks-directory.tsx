"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type DirectionGroup = {
  title: string;
  items: { name: string; slug: string; description: string }[];
};

type TracksDirectoryProps = {
  directionGroups: DirectionGroup[];
};

export default function TracksDirectory({ directionGroups }: TracksDirectoryProps) {
  const [query, setQuery] = useState("");

  const filteredGroups = useMemo(() => {
    const term = query.trim().toLowerCase();

    if (!term) return directionGroups;

    return directionGroups
      .map((group) => ({
        ...group,
        items: group.items.filter(
          (item) =>
            item.name.toLowerCase().includes(term) ||
            item.description.toLowerCase().includes(term),
        ),
      }))
      .filter((group) => group.items.length > 0);
  }, [directionGroups, query]);

  const totalVisible = filteredGroups.reduce((acc, group) => acc + group.items.length, 0);

  return (
    <div className="mt-14 space-y-10">
      <div className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white/80 p-6 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-gray-500">Навигация</p>
          <h2 className="text-2xl font-semibold text-gray-900">Быстрый поиск направления</h2>
        </div>
        <label className="relative w-full md:w-80">
          <span className="sr-only">Поиск направления</span>
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm text-gray-800 shadow-inner placeholder:text-gray-400 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
            placeholder="Найти профессию или стек"
          />
        </label>
      </div>

      {totalVisible === 0 && (
        <p className="rounded-xl border border-dashed border-gray-200 bg-white/70 px-5 py-6 text-center text-sm text-gray-600">
          Ничего не нашли. Попробуйте другой запрос или посмотрите все направления.
        </p>
      )}

      {filteredGroups.map((group) => (
        <div key={group.title} className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-1 rounded-full bg-blue-500/80" aria-hidden />
            <p className="text-sm uppercase tracking-[0.18em] text-gray-500">{group.title}</p>
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
                    <h4 className="text-xl font-semibold text-gray-900">{item.name}</h4>
                    <p className="mt-1 text-sm text-gray-600">{item.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
