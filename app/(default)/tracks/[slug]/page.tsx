import Link from "next/link";
import { notFound } from "next/navigation";

import TrackDetail from "@/components/tracks/track-detail";
import { getTrack } from "@/lib/tracks";

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

  return (
    <section className="pb-20 pt-32 md:pt-40">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="space-y-3">
              <Link href="/tracks" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600">
                <span aria-hidden>←</span> Назад к направлениям
              </Link>
              <p className="text-sm uppercase tracking-[0.2em] text-gray-500">{track.group}</p>
              <h1 className="text-4xl font-bold text-gray-900 md:text-5xl">{track.title}</h1>
              <p className="text-lg text-gray-700">{track.hero}</p>
              <p className="text-sm text-gray-500">{track.description}</p>
              <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                {track.roles.map((role) => (
                  <span key={role} className="rounded-full bg-blue-50 px-3 py-1 font-semibold text-blue-600 ring-1 ring-blue-100">
                    {role}
                  </span>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 rounded-xl bg-gray-900 p-6 text-gray-100 shadow-lg">
              <div>
                <p className="text-sm text-gray-400">Вопросов</p>
                <p className="text-3xl font-semibold">{track.stats.questions.toLocaleString("ru-RU")}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Собеседований</p>
                <p className="text-3xl font-semibold">{track.stats.interviews.toLocaleString("ru-RU")}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Обновление</p>
                <p className="text-lg font-semibold text-emerald-300">{track.stats.updated}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Фокус</p>
                <p className="text-lg font-semibold">Частота × грейд</p>
              </div>
            </div>
          </div>
        </div>

        <TrackDetail track={track} />
      </div>
    </section>
  );
}
