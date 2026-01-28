"use client";

import Link from "next/link";
import { Button } from "antd";
import { useCallback, useMemo, useState } from "react";

import TrainerQuestionActions from "@/components/trainer/trainer-question-actions";
import type { QuestionRow } from "@/lib/questions";

const formatChance = (chance?: string | null) =>
  chance && chance.trim().length > 0 ? `Шанс ${chance}` : "Шанс —";

type TrainerSessionProps = {
  direction: string;
  directionLabel: string;
  initialQuestion: QuestionRow;
};

export default function TrainerSession({
  direction,
  directionLabel,
  initialQuestion,
}: TrainerSessionProps) {
  const [question, setQuestion] = useState<QuestionRow>(initialQuestion);
  const [isLoading, setIsLoading] = useState(false);

  const chanceLabel = useMemo(
    () => formatChance(question.chance),
    [question.chance]
  );

  const handleNext = useCallback(async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const response = await fetch(
        `/api/trainer/question?direction=${encodeURIComponent(direction)}`,
        {
          cache: "no-store",
        }
      );

      if (!response.ok) {
        console.error("[TrainerSession] Failed to load question", response);
        return;
      }

      const data: { question: QuestionRow | null } = await response.json();

      if (data.question) {
        setQuestion(data.question);
      }
    } catch (error) {
      console.error("[TrainerSession] Failed to fetch question", error);
    } finally {
      setIsLoading(false);
    }
  }, [direction, isLoading]);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/trainer"
          className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600"
        >
          <span aria-hidden>←</span> Назад к настройкам
        </Link>
        <span className="rounded-full bg-gray-900 px-3 py-1 text-xs font-semibold text-white">
          {chanceLabel}
        </span>
      </div>

      <p className="mt-4 text-sm uppercase tracking-[0.2em] text-gray-500">
        {directionLabel}
      </p>
      <h1 className="mt-2 text-3xl font-bold text-gray-900 md:text-4xl">
        {question.question}
      </h1>

      <TrainerQuestionActions questionId={question.id} />

      <div className="mt-6 flex flex-wrap gap-3">
        <Link href={`/tracks/${direction}/questions/${question.id}`}>
          <Button size="large">Посмотреть ответ</Button>
        </Link>
        <Button
          type="primary"
          size="large"
          onClick={handleNext}
          loading={isLoading}
        >
          Следующий вопрос
        </Button>
      </div>
    </div>
  );
}
