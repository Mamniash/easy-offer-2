// app/(default)/tracks/[slug]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";

import TrackDetail from "@/components/tracks/track-detail";
import { getTrack, type Track, type TrackQuestion } from "@/lib/tracks";
import { getQuestionsByDirection, mapQuestionRowToTrackQuestion } from "@/lib/questions";

type TrackParams = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: TrackParams }) {
  const { slug } = await params;
  const track = getTrack(slug);

  if (!track) return {};

  return {
    title: `${track.title}: частые вопросы | PreOffer`,
    description: track.description,
  };
}

export default async function TrackPage({ params }: { params: TrackParams }) {
  const { slug } = await params;
  const track = getTrack(slug);

  if (!track) {
    notFound();
  }

  // Всегда тянем вопросы из Supabase
  const page = 1;
  const perPage = 50;
  const { questions: dbQuestions, total } = await getQuestionsByDirection(
    slug,
    page,
    perPage
  );

  const mappedQuestions: TrackQuestion[] = dbQuestions.map(
    mapQuestionRowToTrackQuestion
  );

  const questionsCount = total ?? mappedQuestions.length;
  const interviewsCount = questionsCount * 4; // условный множитель, как раньше

  const trackForRender: Track = {
    ...track,
    stats: {
      ...track.stats,
      questions: questionsCount,
      interviews: interviewsCount,
    },
    questions: mappedQuestions,
  };

  return (
    <section className="pb-20 pt-16 md:pt-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="space-y-3">
              <Link
                href="/tracks"
                className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600"
              >
                <span aria-hidden>←</span> Назад к направлениям
              </Link>
              <p className="text-sm uppercase tracking-[0.2em] text-gray-500">
                {trackForRender.group}
              </p>
              <h1 className="text-4xl font-bold text-gray-900 md:text-5xl">
                {trackForRender.title}
              </h1>
              <p className="text-lg text-gray-700">{trackForRender.hero}</p>
              <p className="text-sm text-gray-500">
                {trackForRender.description}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 rounded-xl bg-gray-900 p-6 text-gray-100 shadow-lg">
              <div>
                <p className="text-sm text-gray-400">Вопросов</p>
                <p className="text-3xl font-semibold">
                  {trackForRender.stats.questions.toLocaleString("ru-RU")}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Собеседований</p>
                <p className="text-3xl font-semibold">
                  {trackForRender.stats.interviews.toLocaleString("ru-RU")}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Обновление</p>
                <p className="text-lg font-semibold text-emerald-300">
                  {trackForRender.stats.updated}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Фокус</p>
                <p className="text-lg font-semibold">Частота × темы</p>
              </div>
            </div>
          </div>
        </div>

        {/* Старый дизайн, но теперь внутри только Supabase-вопросы */}
        <TrackDetail track={trackForRender} />
      </div>
    </section>
  );
}
