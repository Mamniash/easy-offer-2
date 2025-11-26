import Link from "next/link";
import { notFound } from "next/navigation";

import {
  getQuestionById,
  parseVideosField,
  slugToDirection,
} from "@/lib/questions";
import { getTrack } from "@/lib/tracks";

type QuestionParams = Promise<{ slug: string; questionId: string }>;

export async function generateMetadata({ params }: { params: QuestionParams }) {
  const { slug, questionId } = await params;
  const id = Number(questionId);

  if (!Number.isFinite(id)) {
    return {};
  }

  const [question, track] = await Promise.all([
    getQuestionById(id),
    Promise.resolve(getTrack(slug)),
  ]);

  if (!question) return {};

  const directionLabel =
    track?.title ?? question.direction ?? slugToDirection(slug);

  return {
    title: `${question.question} | PreOffer`,
    description:
      question.answer_raw ??
      `Вопрос из направления ${directionLabel} на PreOffer`,
  };
}

export default async function QuestionPage({
  params,
}: {
  params: QuestionParams;
}) {
  const { slug, questionId } = await params;
  const id = Number(questionId);

  if (!Number.isFinite(id)) {
    notFound();
  }

  const [question, track] = await Promise.all([
    getQuestionById(id),
    Promise.resolve(getTrack(slug)),
  ]);

  if (!question) {
    notFound();
  }

  const directionLabel =
    track?.title ?? question.direction ?? slugToDirection(slug);
  const videos = parseVideosField(question.videos);

  return (
    <section className="pb-20 pt-32 md:pt-40">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
          <div className="flex items-center justify-between gap-4">
            <Link
              href={`/tracks/${slug}`}
              className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600"
            >
              <span aria-hidden>←</span> Вернуться к списку
            </Link>

            <span className="rounded-full bg-gray-900 px-3 py-1 text-xs font-semibold text-white">
              {question.chance || "—"} частота
            </span>
          </div>

          <p className="mt-3 text-sm uppercase tracking-[0.2em] text-gray-500">
            {directionLabel}
          </p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900 md:text-4xl">
            {question.question}
          </h1>

          <div className="mt-6 rounded-xl bg-gray-50 p-6 ring-1 ring-gray-200">
            <p className="text-lg font-semibold text-gray-900">
              Ответ и разбор
            </p>

            {question.answer_raw &&
            question.answer_raw !== "EMPTY" &&
            question.answer_raw !== "error" ? (
              <p className="mt-3 whitespace-pre-line text-gray-700">
                {question.answer_raw}
              </p>
            ) : (
              <p className="mt-2 text-gray-700">
                Сейчас мы подтягиваем только текст вопроса из базы. Позже здесь
                появится структурированный разбор, чек-листы и ссылки на
                материалы.
              </p>
            )}

            {videos.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-semibold text-gray-800">
                  Видео по теме:
                </p>
                <ul className="mt-2 space-y-1 text-sm">
                  {videos.map((url, index) => (
                    <li key={url}>
                      <a
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 underline"
                      >
                        Видео {index + 1}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-6 py-4 text-sm text-gray-600">
          <p className="font-semibold text-gray-800">Что будет дальше</p>
          <p className="mt-1 text-gray-600">
            На этой странице потом появится симуляция интервью, заметки,
            собственные конспекты и кнопка «добавить в мой план подготовки».
          </p>
        </div>
      </div>
    </section>
  );
}
