import Link from "next/link";
import { trackGroups } from "./tracks-data";

export const metadata = {
  title: "Выбор направления — PreOffer",
  description: "Выберите профессию и сразу смотрите топ-вопросы собеседований.",
};

export default function TracksPage() {
  return (
    <section className="relative pb-20 pt-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-12 text-center md:mb-16">
          <p className="mb-4 inline-flex rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 ring-1 ring-blue-100">
            Шаг 1. Выберите направление
          </p>
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
            Куда хотите идти дальше по воронке?
          </h1>
          <p className="mx-auto max-w-3xl text-lg text-gray-600">
            Собрали основные направления и профессии. Кликните по карточке, чтобы
            провалиться глубже: увидеть топ-вопросы, частоту их появления и
            подготовиться по треку.
          </p>
        </div>

        <div className="space-y-10">
          {trackGroups.map((group) => (
            <div key={group.title} className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100 md:p-8">
              <div className="mb-6 flex items-center justify-between gap-4 border-b border-gray-100 pb-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                    {group.title}
                  </p>
                  <h2 className="text-2xl font-bold text-gray-900">Выберите трек</h2>
                </div>
                <div className="hidden items-center gap-2 rounded-full bg-gray-50 px-4 py-2 text-sm font-medium text-gray-500 md:inline-flex">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" aria-hidden />
                  <span>Данные из реальных собеседований</span>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {group.tracks.map((track) => (
                  <Link
                    key={track.slug}
                    href={`/tracks/${track.slug}`}
                    className="group relative flex h-full flex-col justify-between rounded-2xl border border-gray-100 bg-gray-50 px-5 py-4 shadow-xs transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-white"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                          {group.title}
                        </p>
                        <p className="mt-1 text-xl font-semibold text-gray-900">{track.title}</p>
                        <p className="mt-1 text-sm text-gray-600">{track.description}</p>
                      </div>
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                        {track.professions[0]}
                      </span>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-gray-600">
                      {track.professions.map((role) => (
                        <span
                          key={role}
                          className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-gray-700 ring-1 ring-gray-200"
                        >
                          {role}
                        </span>
                      ))}
                    </div>
                    <div className="mt-4 flex items-center justify-between text-sm font-medium text-blue-600">
                      <span>Перейти к вопросам</span>
                      <span aria-hidden className="transition-transform group-hover:translate-x-1">
                        →
                      </span>
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
