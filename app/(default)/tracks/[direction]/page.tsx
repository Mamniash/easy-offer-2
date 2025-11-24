import Link from "next/link";
import { notFound } from "next/navigation";

import TrackCatalog from "@/components/tracks/track-catalog";
import { getDirection } from "@/data/tracks";

type Props = {
  params: {
    direction: string;
  };
};

export default function DirectionPage({ params }: Props) {
  const direction = getDirection(params.direction);

  if (!direction) {
    return notFound();
  }

  return (
    <section className="relative pb-16 pt-32 sm:pb-24 sm:pt-40">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-8 flex flex-wrap items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-gray-900">
            Главная
          </Link>
          <span>/</span>
          <Link href="/tracks" className="hover:text-gray-900">
            Направления
          </Link>
          <span>/</span>
          <span className="font-medium text-gray-800">{direction.title}</span>
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-xl shadow-black/[0.05]">
          <div className={`absolute inset-x-0 bottom-0 h-40 bg-linear-to-t ${direction.accent} opacity-20 blur-3xl`} />
          <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs uppercase tracking-[0.24em] text-gray-500">
                Трек {direction.title}
              </p>
              <h1 className="mt-2 text-3xl font-bold text-gray-900 md:text-4xl">
                Выберите профессию и грейд
              </h1>
              <p className="mt-3 text-lg text-gray-700">
                Карточки ниже ведут на конкретные вопросы. Мы сохраняем стиль платформы —
                только нужные фильтры и понятная навигация.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {direction.badges.map((badge) => (
                  <span
                    key={badge}
                    className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-800"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>
            <div className="relative flex h-full min-w-[260px] flex-col gap-3 rounded-2xl border border-gray-200 bg-white/80 p-4 shadow-sm shadow-black/[0.03]">
              <div className="flex items-center justify-between text-sm text-gray-700">
                <span>Вопросов в пуле</span>
                <span className="text-lg font-semibold text-gray-900">
                  {direction.tracks.reduce(
                    (sum, track) => sum + track.questions.length,
                    0,
                  )}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-700">
                <span>Интервью в выборке</span>
                <span className="text-lg font-semibold text-gray-900">
                  {direction.tracks.reduce(
                    (sum, track) => sum + track.stats.interviewCount,
                    0,
                  )}
                </span>
              </div>
              <div className="rounded-xl bg-gray-900 px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-white">
                Подбираем вопросы под роль
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <TrackCatalog directionSlug={direction.slug} tracks={direction.tracks} />
        </div>
      </div>
    </section>
  );
}
