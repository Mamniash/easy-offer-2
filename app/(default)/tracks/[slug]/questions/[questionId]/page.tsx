import Link from "next/link";
import { notFound } from "next/navigation";

import { getQuestionById } from "@/lib/questions";
import { getTrack } from "@/lib/tracks";

type QuestionParams = Promise<{ slug: string; questionId: string }>;

function extractNumericId(questionIdParam: string): number | null {
  // "frontend-6" -> 6, "golang-12" -> 12, "42" -> 42
  const lastPart = questionIdParam.split("-").pop() ?? "";
  const id = Number(lastPart);
  return Number.isFinite(id) ? id : null;
}

export async function generateMetadata({ params }: { params: QuestionParams }) {
  const { slug, questionId } = await params;
  const numericId = extractNumericId(questionId);

  if (numericId == null) return {};

  const [question, track] = await Promise.all([
    getQuestionById(numericId),
    Promise.resolve(getTrack(slug)),
  ]);

  if (!question || !track) return {};

  return {
    title: `${question.question} | PreOffer`,
    description:
      question.answer_raw ?? `Вопрос из направления ${track.title} на PreOffer`,
  };
}

export default async function QuestionPage({
  params,
}: {
  params: QuestionParams;
}) {
  const { slug, questionId } = await params;
  const numericId = extractNumericId(questionId);

  if (numericId == null) {
    notFound();
  }

  const [question, track] = await Promise.all([
    getQuestionById(numericId),
    Promise.resolve(getTrack(slug)),
  ]);

  if (!question || !track) {
    notFound();
  }

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
            {track?.title ?? question.direction}
          </p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900 md:text-4xl">
            {question.question}
          </h1>

          <div className="mt-6 rounded-xl bg-gray-50 p-6 ring-1 ring-gray-200">
            <p className="text-lg font-semibold text-gray-900">
              Ответ и разбор появятся здесь
            </p>

            <p className="mt-2 text-gray-700">
              Сейчас мы подтягиваем только вопросы из базы. Дальше сюда приедут
              структурированные ответы, чек-листы и ссылки на разборы.
            </p>

            {question.answer_raw && (
              <p className="mt-4 text-sm text-gray-600">
                Черновой источник ответа:{" "}
                <span className="font-mono">{question.answer_raw}</span>
              </p>
            )}

            {question.videos && question.videos !== "EMPTY" && (
              <div className="mt-4">
                <p className="text-sm font-semibold text-gray-800">
                  Видео по теме:
                </p>
                <a
                  href={question.videos}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-blue-600 underline"
                >
                  Открыть подборку
                </a>
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
