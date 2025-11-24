import Link from "next/link";

import { directionGroups } from "@/lib/tracks";

export const metadata = {
  title: "Выбор направления | PreOffer",
  description:
    "Собрали направления и профессии, чтобы перейти к вопросам и подготовке. Выберите трек и смотрите частые вопросы.",
};

export default function TracksLandingPage() {
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
              <div className="mt-6 inline-flex items-center gap-3 rounded-full bg-gray-100 px-4 py-2 text-sm text-gray-600">
                <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                Демоданные — дальше будут реальные частоты и ответы
              </div>
            </div>
            <div className="flex gap-4 rounded-2xl bg-gray-900 p-6 text-gray-100 shadow-lg">
              <div>
                <p className="text-sm text-gray-400">Направлений</p>
                <p className="text-4xl font-semibold">{directionGroups.flatMap((g) => g.items).length}</p>
              </div>
              <div className="h-12 w-px bg-gray-700/60" aria-hidden="true" />
              <div>
                <p className="text-sm text-gray-400">Вопросов в демо</p>
                <p className="text-4xl font-semibold">12 345</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14 space-y-10">
          {directionGroups.map((group) => (
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
                      <div className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
                        Частые вопросы
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
          ))}
        </div>
      </div>
    </section>
  );
}
