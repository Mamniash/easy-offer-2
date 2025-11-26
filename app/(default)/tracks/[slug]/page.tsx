// app/(default)/tracks/[slug]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";

import TrackDetail from "@/components/tracks/track-detail";
import { getTrack } from "@/lib/tracks";
import { getQuestionsByDirection } from "@/lib/questions";

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

  // 👇 тянем первые 50 вопросов по этому направлению из Supabase
  const page = 1;
  const perPage = 50;
  const { questions, total } = await getQuestionsByDirection(
    slug,
    page,
    perPage
  );
  const totalPages = Math.max(1, Math.ceil(total / perPage));

  return (
    <section className="pb-20 pt-32 md:pt-40">
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
                {track.group}
              </p>
              <h1 className="text-4xl font-bold text-gray-900 md:text-5xl">
                {track.title}
              </h1>
              <p className="text-lg text-gray-700">{track.hero}</p>
              <p className="text-sm text-gray-500">{track.description}</p>
              <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                {track.roles.map((role) => (
                  <span
                    key={role}
                    className="rounded-full bg-blue-50 px-3 py-1 font-semibold text-blue-600 ring-1 ring-blue-100"
                  >
                    {role}
                  </span>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 rounded-xl bg-gray-900 p-6 text-gray-100 shadow-lg">
              <div>
                <p className="text-sm text-gray-400">Вопросов</p>
                <p className="text-3xl font-semibold">
                  {track.stats.questions.toLocaleString("ru-RU")}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Собеседований</p>
                <p className="text-3xl font-semibold">
                  {track.stats.interviews.toLocaleString("ru-RU")}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Обновление</p>
                <p className="text-lg font-semibold text-emerald-300">
                  {track.stats.updated}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Фокус</p>
                <p className="text-lg font-semibold">Частота × грейд</p>
              </div>
            </div>
          </div>
        </div>

        {/* старый компонент, который рисует демо-структуру */}
        <TrackDetail track={track} />

        {/* 👇 список реальных вопросов из Supabase */}
        <div className="mt-10 rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="text-2xl font-bold text-gray-900">
              Частые вопросы из базы
            </h2>
            <span className="text-sm text-gray-500">
              Показаны первые {questions.length} из {total}
            </span>
          </div>

          <ul className="divide-y divide-gray-100">
            {questions.map((q) => (
              <li key={q.id} className="py-4">
                <Link
                  href={`/tracks/${slug}/questions/${q.id}`}
                  className="flex items-start justify-between gap-4"
                >
                  <div>
                    <p className="font-medium text-gray-900">{q.question}</p>
                    {q.answer_raw && (
                      <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                        {q.answer_raw}
                      </p>
                    )}
                  </div>
                  <span className="shrink-0 rounded-full bg-gray-900 px-3 py-1 text-xs font-semibold text-white">
                    {q.chance}
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          {/* простейшая пагинация, пока без кнопок вперёд/назад, чисто инфа */}
          <div className="mt-4 text-sm text-gray-500">
            Страница {page} из {totalPages}
          </div>
        </div>
      </div>
    </section>
  );
}
