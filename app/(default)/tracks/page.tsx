import Link from "next/link";

import { directions } from "@/data/tracks";

export const metadata = {
  title: "Выбор направления — PreOffer",
};

const directionGrid = directions.map((direction) => ({
  ...direction,
  trackCount: direction.tracks.length,
  questionCount: direction.tracks.reduce(
    (sum, track) => sum + track.questions.length,
    0,
  ),
}));

export default function TracksLandingPage() {
  return (
    <section className="relative pb-16 pt-32 sm:pb-24 sm:pt-40">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-10 flex items-center justify-between gap-4 md:mb-16">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-blue-600">Выбор направления</p>
            <h1 className="mt-3 text-4xl font-bold md:text-5xl">
              Куда двигаемся дальше?
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-gray-700">
              Отфильтруйте вопросы под конкретную профессию и грейд. Все карточки
              ведут на страницу трека с частотными вопросами.
            </p>
          </div>
          <div className="hidden items-center gap-3 rounded-xl bg-white px-4 py-3 text-sm text-gray-600 shadow-sm shadow-black/[0.03] md:flex">
            <div className="flex flex-col">
              <span className="text-xs uppercase text-gray-400">Собеседований</span>
              <span className="text-lg font-semibold text-gray-900">12385</span>
            </div>
            <div className="h-8 w-px bg-gray-200" />
            <div className="flex flex-col">
              <span className="text-xs uppercase text-gray-400">Вопросов</span>
              <span className="text-lg font-semibold text-gray-900">746</span>
            </div>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {directionGrid.map((direction) => (
            <Link
              key={direction.slug}
              href={`/tracks/${direction.slug}`}
              className="group relative overflow-hidden rounded-2xl bg-white p-5 shadow-lg shadow-black/[0.03] transition-transform hover:-translate-y-0.5"
            >
              <div className={`absolute inset-x-0 bottom-0 h-28 bg-linear-to-t ${direction.accent} opacity-20 blur-3xl`} />
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-xl font-semibold text-gray-900">
                  {direction.title}
                </h2>
                <span className="rounded-full bg-gray-900/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-white">
                  {direction.badges[0]}
                </span>
              </div>
              <p className="mt-3 text-sm text-gray-700">{direction.summary}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {direction.badges.map((badge) => (
                  <span
                    key={badge}
                    className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700"
                  >
                    {badge}
                  </span>
                ))}
              </div>
              <div className="mt-6 flex items-center justify-between text-sm text-gray-600">
                <span>
                  Треков: <strong className="text-gray-900">{direction.trackCount}</strong>
                </span>
                <span>
                  Вопросов: <strong className="text-gray-900">{direction.questionCount}</strong>
                </span>
              </div>
              <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-blue-600">
                Провалиться в трек
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
