"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Track } from "../tracks-data";

type FilterState = {
  level: string;
  format: string;
};

const badgeClassName =
  "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ring-1";

export default function TrackQuestionsClient({ track }: { track: Track }) {
  const levels = Array.from(new Set(track.questions.map((question) => question.level)));
  const formats = Array.from(new Set(track.questions.map((question) => question.format)));

  const [filters, setFilters] = useState<FilterState>({ level: "Все", format: "Все" });

  const filteredQuestions = useMemo(
    () =>
      [...track.questions]
        .filter((question) =>
          filters.level === "Все" ? true : question.level === filters.level,
        )
        .filter((question) =>
          filters.format === "Все" ? true : question.format === filters.format,
        )
        .sort((a, b) => b.frequency - a.frequency),
    [track.questions, filters],
  );

  return (
    <div className="space-y-10 pb-20">
      <div className="rounded-3xl bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 px-6 py-8 text-white shadow-xl">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-100">Трек</p>
            <h1 className="text-3xl font-bold leading-tight md:text-4xl">{track.title}</h1>
            <p className="max-w-3xl text-blue-50 md:text-lg">{track.description}</p>
            <div className="flex flex-wrap gap-2 text-sm">
              {track.professions.map((role) => (
                <span
                  key={role}
                  className="rounded-full bg-white/10 px-3 py-1 text-blue-50 ring-1 ring-white/20"
                >
                  {role}
                </span>
              ))}
            </div>
          </div>
          <div className="rounded-2xl bg-white/10 p-4 text-sm text-blue-50 ring-1 ring-white/20">
            <p className="font-semibold">Что внутри</p>
            <ul className="mt-3 space-y-1 text-blue-100">
              <li>Вопросы с частотами появления</li>
              <li>Фильтры по уровню и формату</li>
              <li>Ссылки на разбор каждого вопроса</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Вопросы</p>
              <p className="text-2xl font-bold text-gray-900">{filteredQuestions.length} вопросов</p>
              <p className="text-sm text-gray-500">Сортировка по частоте встречаемости</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400" aria-hidden />
              <span>Обновлено на основе последних интервью</span>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              Уровень:
              {["Все", ...levels].map((level) => (
                <button
                  key={level}
                  onClick={() => setFilters((prev) => ({ ...prev, level }))}
                  className={`${badgeClassName} ${
                    filters.level === level
                      ? "bg-blue-50 text-blue-700 ring-blue-200"
                      : "bg-white text-gray-700 ring-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              Формат:
              {["Все", ...formats].map((format) => (
                <button
                  key={format}
                  onClick={() => setFilters((prev) => ({ ...prev, format }))}
                  className={`${badgeClassName} ${
                    filters.format === format
                      ? "bg-blue-50 text-blue-700 ring-blue-200"
                      : "bg-white text-gray-700 ring-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {format}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {filteredQuestions.map((question) => (
              <Link
                key={question.id}
                href={`/tracks/${track.slug}/${question.id}`}
                className="group block rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-white"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                      {question.topic} · {question.level} · {question.format}
                    </p>
                    <p className="mt-1 text-lg font-semibold text-gray-900 group-hover:text-blue-700">
                      {question.title}
                    </p>
                  </div>
                  <div className="text-right text-sm font-semibold text-gray-700">
                    <span className="text-blue-600">{question.frequency}%</span>
                    <p className="text-xs font-normal text-gray-500">частота</p>
                  </div>
                </div>
                <div className="mt-3 h-2 rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
                    style={{ width: `${question.frequency}%` }}
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Примеры задач</p>
            <ul className="mt-3 space-y-2 text-gray-700">
              {track.sampleTasks.map((task) => (
                <li
                  key={task}
                  className="flex items-start gap-3 rounded-xl bg-gray-50 px-3 py-2 text-sm font-medium text-gray-800"
                >
                  <span className="mt-1 h-2 w-2 rounded-full bg-emerald-400" aria-hidden />
                  {task}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-5 text-gray-100 shadow-lg">
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-100">Плейсхолдеры</p>
            <p className="mt-2 text-base text-gray-100">
              Здесь появятся реальные ответы, карточки с примерами проектов и
              советы, как закрывать пробелы в подготовке. Пока оставили заглушку,
              чтобы можно было пройти путь целиком.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
