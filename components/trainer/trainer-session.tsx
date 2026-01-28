"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "antd";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import TrainerQuestionActions from "@/components/trainer/trainer-question-actions";
import { directionGroups, type TrackQuestion } from "@/lib/tracks";

type TrainerQuestion = TrackQuestion;

type TotalResponse = {
  total: number;
  questions: TrainerQuestion[];
};

const MAX_RANDOM_PAGE = 1000;

export default function TrainerSession() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const direction = searchParams.get("direction") ?? "";
  const [question, setQuestion] = useState<TrainerQuestion | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const requestIdRef = useRef(0);

  const directionLabel = useMemo(() => {
    const allDirections = directionGroups.flatMap((group) => group.items);
    return allDirections.find((item) => item.slug === direction)?.name;
  }, [direction]);

  const fetchQuestionPage = useCallback(async (page: number) => {
    const response = await fetch(
      `/api/tracks/${direction}/questions?page=${page}&perPage=1`,
      { cache: "no-store" }
    );

    if (!response.ok) {
      throw new Error("Не удалось загрузить вопрос");
    }

    const payload = (await response.json()) as TotalResponse;
    return payload.questions?.[0] ?? null;
  }, [direction]);

  const fetchRandomQuestion = useCallback(async () => {
    if (!direction) return;

    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;

    setIsLoading(true);
    setError(null);

    try {
      const randomPage = Math.floor(Math.random() * MAX_RANDOM_PAGE) + 1;
      let nextQuestion = await fetchQuestionPage(randomPage);

      if (!nextQuestion) {
        nextQuestion = await fetchQuestionPage(1);
      }

      if (!nextQuestion) {
        if (requestIdRef.current === requestId) {
          setQuestion(null);
          setError("По выбранному направлению пока нет вопросов.");
        }
        return;
      }

      if (requestIdRef.current === requestId) {
        setQuestion(nextQuestion);
      }
    } catch (err) {
      if (requestIdRef.current !== requestId) return;
      console.error("[TrainerSession] Failed to load question", err);
      setError("Не удалось получить вопрос. Попробуйте еще раз.");
      setQuestion(null);
    } finally {
      if (requestIdRef.current === requestId) {
        setIsLoading(false);
      }
    }
  }, [direction, fetchQuestionPage]);

  useEffect(() => {
    setQuestion(null);
    setError(null);

    if (!direction) return;

    fetchRandomQuestion();
  }, [direction, fetchRandomQuestion]);

  const chanceLabel = Number.isFinite(question?.frequency)
    ? `Шанс ${question?.frequency}%`
    : "Шанс —";

  const questionId = Number(question?.id ?? NaN);
  const hasValidQuestionId = Number.isFinite(questionId);

  if (!direction) {
    return (
      <section className="pb-20 pt-8 md:pt-10">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-xl">
            <h1 className="text-2xl font-bold text-gray-900">
              Не выбрано направление
            </h1>
            <p className="mt-3 text-base text-gray-600">
              Вернитесь к настройке тренажера и выберите тему тренировки.
            </p>
            <Button
              type="primary"
              size="large"
              className="mt-6 rounded-full px-6 font-semibold"
              onClick={() => router.push("/trainer")}
            >
              Перейти к настройке
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="pb-20 pt-8 md:pt-10">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="space-y-2">
              <Link
                href="/trainer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600"
              >
                <span aria-hidden>←</span> Вернуться к настройке
              </Link>
              <p className="text-sm uppercase tracking-[0.2em] text-gray-500">
                {directionLabel ?? direction}
              </p>
              <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
                Тренировка вопросов
              </h1>
            </div>
            <span className="self-start rounded-full bg-gray-900 px-3 py-1 text-xs font-semibold text-white">
              {chanceLabel}
            </span>
          </div>

          <div className="mt-6 rounded-2xl bg-gray-50 p-6 ring-1 ring-gray-200">
            {isLoading ? (
              <p className="text-base font-medium text-gray-500">
                Загружаем вопрос…
              </p>
            ) : error ? (
              <div className="space-y-2">
                <p className="text-base font-semibold text-gray-700">{error}</p>
                <Button onClick={fetchRandomQuestion} disabled={isLoading}>
                  Попробовать еще раз
                </Button>
              </div>
            ) : (
              <p className="text-xl font-semibold text-gray-900">
                {question?.question}
              </p>
            )}
          </div>

          <div className="mt-6 space-y-4">
            {hasValidQuestionId && (
              <TrainerQuestionActions questionId={questionId} />
            )}

            <div className="flex flex-wrap items-center gap-3">
              <Button
                type="default"
                size="large"
                disabled={!hasValidQuestionId || isLoading}
                onClick={() => {
                  if (!hasValidQuestionId) return;
                  router.push(`/tracks/${direction}/questions/${questionId}`);
                }}
                className="rounded-full font-semibold"
              >
                Посмотреть ответ
              </Button>
              <Button
                type="primary"
                size="large"
                onClick={fetchRandomQuestion}
                loading={isLoading}
                className="rounded-full px-6 font-semibold"
              >
                Следующий вопрос
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
