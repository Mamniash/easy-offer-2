import Link from "next/link";
import { notFound } from "next/navigation";

import { getDirection, getQuestion, getTrack } from "@/data/tracks";

type Props = {
  params: {
    direction: string;
    track: string;
    question: string;
  };
};

export default function QuestionPage({ params }: Props) {
  const direction = getDirection(params.direction);
  const track = getTrack(params.direction, params.track);
  const question = getQuestion(params.direction, params.track, params.question);

  if (!direction || !track || !question) {
    return notFound();
  }

  return (
    <section className="relative pb-16 pt-32 sm:pb-24 sm:pt-40">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
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
          <Link href={`/tracks/${direction.slug}/${track.slug}`} className="hover:text-gray-900">
            {track.title}
          </Link>
          <span>/</span>
          <span className="font-medium text-gray-800">{question.title}</span>
        </div>

        <div className="overflow-hidden rounded-2xl bg-white shadow-xl shadow-black/[0.05]">
          <div className="border-b border-gray-100 bg-gray-900 px-6 py-5 text-white">
            <p className="text-xs uppercase tracking-[0.18em] text-gray-300">
              Ответ на вопрос
            </p>
            <h1 className="mt-2 text-2xl font-bold md:text-3xl">{question.title}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-gray-200">
              <span className="rounded-full bg-white/10 px-3 py-1 text-white">{question.level}</span>
              <span className="rounded-full bg-white/10 px-3 py-1 text-white">{question.topic}</span>
              <span className="rounded-full bg-white/10 px-3 py-1 text-white">Частота {question.frequency}%</span>
            </div>
          </div>

          <div className="space-y-6 p-6 text-gray-800">
            <p className="text-lg leading-relaxed text-gray-800">{question.answer}</p>
            <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700">
              Это заглушка — сюда поставим реальные развёрнутые ответы, карты подготовки и ссылки на материалы.
            </div>
            {question.hint && (
              <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-800">
                {question.hint}
              </div>
            )}
            <div className="grid gap-4 sm:grid-cols-2">
              <button className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-left text-sm font-semibold text-gray-800 shadow-sm shadow-black/[0.02] transition hover:-translate-y-0.5">
                Добавить заметку
              </button>
              <button className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-left text-sm font-semibold text-gray-800 shadow-sm shadow-black/[0.02] transition hover:-translate-y-0.5">
                Запланировать повторение
              </button>
              <button className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-left text-sm font-semibold text-gray-800 shadow-sm shadow-black/[0.02] transition hover:-translate-y-0.5">
                Показать похожие вопросы
              </button>
              <button className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-left text-sm font-semibold text-gray-800 shadow-sm shadow-black/[0.02] transition hover:-translate-y-0.5">
                Посмотреть варианты ответов
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
