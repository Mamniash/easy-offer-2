"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import type { Question } from "@/data/tracks";

type Props = {
  directionSlug: string;
  trackSlug: string;
  questions: Question[];
};

const levels: Question["level"][] = ["Junior", "Middle", "Senior"];

export default function QuestionList({ directionSlug, trackSlug, questions }: Props) {
  const [selectedLevel, setSelectedLevel] = useState<Question["level"] | "Все">(
    "Все",
  );
  const [topic, setTopic] = useState("Все");

  const topics = useMemo(() => {
    const uniqueTopics = new Set<string>();
    questions.forEach((question) => uniqueTopics.add(question.topic));
    return ["Все", ...Array.from(uniqueTopics)];
  }, [questions]);

  const filteredQuestions = useMemo(() => {
    return questions.filter((question) => {
      const byLevel = selectedLevel === "Все" || question.level === selectedLevel;
      const byTopic = topic === "Все" || question.topic === topic;
      return byLevel && byTopic;
    });
  }, [questions, selectedLevel, topic]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm shadow-black/[0.03]">
        <div className="flex flex-wrap items-center gap-2">
          {levels.map((level) => {
            const isActive = selectedLevel === level;
            return (
              <button
                key={level}
                type="button"
                onClick={() => setSelectedLevel(isActive ? "Все" : level)}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] transition ${isActive ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"}`}
              >
                {level}
              </button>
            );
          })}
        </div>
        <div className="h-6 w-px bg-gray-200" />
        <div className="flex flex-wrap items-center gap-2">
          {topics.map((currentTopic) => {
            const isActive = topic === currentTopic;
            return (
              <button
                key={currentTopic}
                type="button"
                onClick={() => setTopic(isActive ? "Все" : currentTopic)}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${isActive ? "border-gray-900 bg-gray-900 text-white" : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"}`}
              >
                {currentTopic}
              </button>
            );
          })}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm shadow-black/[0.03]">
        <div className="grid grid-cols-[80px_1fr_120px] items-center gap-4 border-b border-gray-100 px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-gray-500 sm:grid-cols-[100px_1fr_140px]">
          <span>Частота</span>
          <span>Вопрос</span>
          <span className="text-right">Грейд</span>
        </div>
        <div className="divide-y divide-gray-100">
          {filteredQuestions.map((question) => (
            <Link
              key={question.slug}
              href={`/tracks/${directionSlug}/${trackSlug}/questions/${question.slug}`}
              className="group grid grid-cols-[80px_1fr_120px] items-center gap-4 px-6 py-4 transition hover:bg-gray-50 sm:grid-cols-[100px_1fr_140px]"
            >
              <div className="flex items-center gap-3 text-sm font-semibold text-gray-900">
                <span className="min-w-[40px] text-right">{question.frequency}%</span>
                <span className="h-2 w-20 overflow-hidden rounded-full bg-gray-100">
                  <span
                    className="block h-full rounded-full bg-gray-900 transition-all group-hover:bg-blue-600"
                    style={{ width: `${Math.min(question.frequency, 100)}%` }}
                  />
                </span>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-700">
                  {question.title}
                </p>
                <p className="text-xs text-gray-500">{question.topic}</p>
              </div>
              <div className="flex items-center justify-end">
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-800">
                  {question.level}
                </span>
              </div>
            </Link>
          ))}
          {filteredQuestions.length === 0 && (
            <div className="px-6 py-10 text-center text-sm text-gray-600">
              Нет вопросов под эти фильтры. Выберите другой грейд или тему.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
