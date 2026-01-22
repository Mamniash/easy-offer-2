import Link from "next/link";
import { notFound } from "next/navigation";

import QuestionMarkPanel from "@/components/questions/question-mark-panel";
import QuestionSources from "@/components/questions/question-sources";
import AnswerContent from "@/components/questions/answer-content";
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

  const videoItems = videos.map((url, index) => {
    try {
      const parsedUrl = new URL(url);
      const host = parsedUrl.hostname.replace(/^www\./, "");

      const pathSegments = parsedUrl.pathname.split("/").filter(Boolean);
      const youtubeIdFromPath = host.includes("youtu.be")
        ? pathSegments[0]
        : null;
      const youtubeIdFromParams = parsedUrl.searchParams.get("v");
      const youtubeId = youtubeIdFromParams || youtubeIdFromPath;

      const thumbnail = youtubeId
        ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`
        : null;

      const titleCandidate = parsedUrl.searchParams.get("title");
      const readableFromPath = pathSegments[pathSegments.length - 1];
      const fallbackTitle = titleCandidate
        ? titleCandidate
        : readableFromPath && readableFromPath.length > 6
          ? decodeURIComponent(readableFromPath).replace(/[-_]+/g, " ")
          : `Видео ${index + 1}`;

      return {
        host,
        thumbnail,
        title: fallbackTitle,
        url,
      };
    } catch (error) {
      console.error("[question-page] Failed to parse video URL", url, error);

      return {
        host: "Источник",
        thumbnail: null,
        title: `Видео ${index + 1}`,
        url,
      };
    }
  });

  return (
    <section className="pb-20 pt-16 md:pt-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
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

          <QuestionMarkPanel questionId={question.id} />

          <div
            className={`mt-6 ${
              videoItems.length > 0
                ? "md:grid md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] md:gap-8"
                : ""
            }`}
          >
            <div className="rounded-xl bg-gray-50 p-6 ring-1 ring-gray-200">
              <p className="text-lg font-semibold text-gray-900">
                Ответ и разбор
              </p>

              {question.answer_raw &&
              question.answer_raw !== "EMPTY" &&
              question.answer_raw !== "error" ? (
                <AnswerContent text={question.answer_raw} />
              ) : (
                <p className="mt-2 text-gray-700">
                  Пока здесь только формулировка вопроса. Мы не стали
                  придумывать ответ наугад — разбор появится, когда подготовим
                  нормальный материал.
                </p>
              )}
            </div>

            <QuestionSources items={videoItems} />
          </div>
        </div>
      </div>
    </section>
  );
}
