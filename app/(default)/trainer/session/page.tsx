import Link from "next/link";

import TrainerSession from "@/components/trainer/trainer-session";
import { getRandomQuestionByDirection, slugToDirection } from "@/lib/questions";
import { getTrack } from "@/lib/tracks";

type TrainerSearchParams = Promise<{
  direction?: string;
  interview?: string;
  grade?: string;
  skills?: string;
}>;

export default async function TrainerSessionPage({
  searchParams,
}: {
  searchParams?: TrainerSearchParams;
}) {
  const resolvedSearchParams = await searchParams;
  const direction = resolvedSearchParams?.direction;

  if (!direction) {
    return (
      <section className="pb-20 pt-8 md:pt-10">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-xl">
            <h1 className="text-2xl font-bold text-gray-900">
              Сначала выберите направление
            </h1>
            <p className="mt-3 text-gray-600">
              Вернитесь в настройки тренажера и выберите тему для тренировки.
            </p>
            <Link
              href="/trainer"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-600"
            >
              <span aria-hidden>←</span> Перейти к настройкам
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const question = await getRandomQuestionByDirection(direction);

  if (!question) {
    return (
      <section className="pb-20 pt-8 md:pt-10">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-xl">
            <h1 className="text-2xl font-bold text-gray-900">
              Вопросы не найдены
            </h1>
            <p className="mt-3 text-gray-600">
              Для выбранного направления пока нет вопросов. Попробуйте другое
              направление.
            </p>
            <Link
              href="/trainer"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-600"
            >
              <span aria-hidden>←</span> Вернуться к настройкам
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const track = getTrack(direction);
  const directionLabel =
    track?.title ?? question.direction ?? slugToDirection(direction);

  return (
    <section className="pb-20 pt-8 md:pt-10">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <TrainerSession
          direction={direction}
          directionLabel={directionLabel}
          initialQuestion={question}
        />
      </div>
    </section>
  );
}
