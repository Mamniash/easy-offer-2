import Link from "next/link";
import { notFound } from "next/navigation";

import QuestionList from "@/components/tracks/question-list";
import { getDirection, getTrack } from "@/data/tracks";

type Props = {
  params: {
    direction: string;
    track: string;
  };
};

export default function TrackPage({ params }: Props) {
  const direction = getDirection(params.direction);
  const track = getTrack(params.direction, params.track);

  if (!direction || !track) {
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
          <Link href={`/tracks/${direction.slug}`} className="hover:text-gray-900">
            {direction.title}
          </Link>
          <span>/</span>
          <span className="font-medium text-gray-800">{track.title}</span>
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-xl shadow-black/[0.05]">
          <div className="absolute inset-x-0 bottom-0 h-36 bg-linear-to-t from-gray-900/5 to-transparent" />
          <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-gray-500">
                {track.stats.updatedAt}
              </p>
              <h1 className="mt-1 text-3xl font-bold text-gray-900 md:text-4xl">
                {track.title}
              </h1>
              <p className="mt-3 max-w-3xl text-lg text-gray-700">{track.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {track.badges.map((badge) => (
                  <span
                    key={badge}
                    className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-800"
                  >
                    {badge}
                  </span>
                ))}
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                  {track.stats.interviewCount} собеседований
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white/80 p-4 text-sm text-gray-700 shadow-sm shadow-black/[0.03]">
              <div className="flex items-center justify-between">
                <span>Вопросов</span>
                <span className="text-lg font-semibold text-gray-900">
                  {track.questions.length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Направление</span>
                <span className="font-semibold text-gray-900">{direction.title}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Грейд</span>
                <span className="font-semibold text-gray-900">{track.level}</span>
              </div>
              <div className="rounded-xl bg-gray-900 px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-white">
                Фильтры и список вопросов ниже
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <QuestionList
            directionSlug={direction.slug}
            trackSlug={track.slug}
            questions={track.questions}
          />
        </div>
      </div>
    </section>
  );
}
