"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import type { Track } from "@/lib/tracks";

type LevelFilter = "all" | "junior" | "middle" | "senior";

const levelLabels: Record<LevelFilter, string> = {
  all: "Все уровни",
  junior: "Junior",
  middle: "Middle",
  senior: "Senior",
};

export default function TrackDetail({ track }: { track: Track }) {
  const [level, setLevel] = useState<LevelFilter>("all");
  const [search, setSearch] = useState("");

  const getFrequencyColor = (frequency: number) => {
    if (frequency > 40) return "#22c55e"; // green
    if (frequency >= 10) return "#f59e0b"; // amber
    return "#ef4444"; // red
  };

  const filteredQuestions = useMemo(
    () =>
      track.questions.filter((question) => {
        const matchesLevel = level === "all" || question.level === level;
        const matchesSearch =
          !search.trim() || question.question.toLowerCase().includes(search.trim().toLowerCase());

        return matchesLevel && matchesSearch;
      }),
    [level, search, track.questions],
  );

  return (
    <div className="mt-10 rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="flex flex-col gap-4 border-b border-gray-200 px-6 py-5 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-gray-500">Фильтры</p>
          <p className="text-lg font-semibold text-gray-900">Частые вопросы по уровням и темам</p>
        </div>
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="flex rounded-full border border-gray-200 bg-gray-50 p-1 text-sm">
            {(Object.keys(levelLabels) as LevelFilter[]).map((item) => (
              <button
                key={item}
                onClick={() => setLevel(item)}
                className={`rounded-full px-3 py-1 font-medium transition ${
                  level === item ? "bg-white text-gray-900 shadow" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {levelLabels[item]}
              </button>
            ))}
          </div>
          <label className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Найти вопрос"
              className="w-full rounded-full border border-gray-200 bg-white px-11 py-2 text-sm text-gray-900 shadow-sm outline-none placeholder:text-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 md:w-64"
            />
          </label>
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {filteredQuestions.map((question) => (
          <Link
            key={question.id}
            href={`/tracks/${track.slug}/questions/${question.id}`}
            className="group block px-6 py-5 transition hover:bg-blue-50/60"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-4 md:items-center">
                <div className="flex items-center gap-3 rounded-2xl bg-gray-900 px-5 py-4 text-white shadow-sm ring-1 ring-gray-800/60">
                  <span
                    className="inline-flex h-4 w-4 items-center justify-center rounded-full"
                    style={{ backgroundColor: getFrequencyColor(question.frequency) }}
                    aria-hidden
                  />
                  <span className="text-2xl font-semibold" style={{ color: getFrequencyColor(question.frequency) }}>
                    {question.frequency}%
                  </span>
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.16em] text-gray-500">{question.category}</p>
                  <p className="text-lg font-semibold text-gray-900 group-hover:text-blue-700">{question.question}</p>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-500">
                    <span className="rounded-full bg-white px-3 py-1 font-medium text-gray-600 shadow-sm ring-1 ring-gray-200">
                      {levelLabels[question.level as LevelFilter] ?? question.level}
                    </span>
                    {question.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-white px-3 py-1 font-medium text-gray-600 shadow-sm ring-1 ring-gray-200"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="w-full max-w-md">
                <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500">
                  <span>Частота по собеседованиям</span>
                  <span className="text-gray-800">{question.frequency}%</span>
                </div>
                <div className="mt-3 h-3 rounded-full bg-gray-100 ring-1 ring-gray-200">
                  <div
                    className="h-full rounded-full shadow-[0_0_0_1px_rgba(255,255,255,0.4)]"
                    style={{
                      width: `${question.frequency}%`,
                      backgroundColor: getFrequencyColor(question.frequency),
                    }}
                  />
                </div>
              </div>
            </div>
          </Link>
        ))}

        {filteredQuestions.length === 0 && (
          <div className="px-6 py-8 text-center text-gray-500">
            Нет вопросов по выбранным фильтрам. Попробуйте другой грейд или очистите поиск.
          </div>
        )}
      </div>
    </div>
  );
}
