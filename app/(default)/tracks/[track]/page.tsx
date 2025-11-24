"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { useMemo, useState } from "react";

const trackCatalog = {
  frontend: {
    title: "Frontend",
    description: "HTML, CSS, JavaScript, React, сборка, тестирование.",
  },
  java: { title: "Java", description: "JVM, Spring, микросервисы." },
  python: { title: "Python", description: "Backend, ML, data pipelines." },
  golang: { title: "Golang", description: "Высоконагруженные сервисы." },
  php: { title: "PHP", description: "Web, Symfony/Laravel." },
  csharp: { title: "C#", description: "Backend, .NET, сервисы." },
  cpp: { title: "C/C++", description: "Системное и высокопроизводительное ПО." },
  "1c": { title: "1C", description: "Учетные системы и интеграции." },
  ios: { title: "iOS / Swift", description: "Mobile native." },
  android: { title: "Android", description: "Mobile native." },
  flutter: { title: "Flutter", description: "Cross-platform." },
  unity: { title: "Unity", description: "Игровая разработка." },
  devops: { title: "DevOps", description: "CI/CD, облака, инфраструктура." },
  "data-engineer": { title: "Data Engineer", description: "ETL, DWH." },
  qa: { title: "QA Тестировщик", description: "Manual, тест-дизайн." },
  aqa: { title: "AQA / Automation", description: "SDET, автотесты." },
  "data-science": { title: "Data Science", description: "ML, продакшен моделей." },
  ba: { title: "Бизнес Аналитик", description: "Discovery, процессы." },
  sa: { title: "Системный Аналитик", description: "Требования, архитектура." },
  "data-analyst": { title: "Аналитик данных", description: "SQL, дашборды." },
  "product-analyst": { title: "Продуктовый аналитик", description: "Продуктовые гипотезы." },
  pm: { title: "Менеджер проектов", description: "Delivery, планирование." },
  product: { title: "Продакт менеджер", description: "Стратегия, продукт." },
};

type TrackKey = keyof typeof trackCatalog;

type Question = {
  question: string;
  frequency: number;
  level: "Junior" | "Middle" | "Senior";
  tag: string;
};

const demoQuestions: Question[] = [
  { question: "Расскажите о себе", frequency: 99, level: "Junior", tag: "soft" },
  { question: "Что такое Event Loop?", frequency: 67, level: "Middle", tag: "core" },
  { question: "Как браузер выбирает место рендеринга?", frequency: 52, level: "Middle", tag: "core" },
  { question: "Как работает Promise", frequency: 48, level: "Junior", tag: "async" },
  { question: "Что такое Virtual DOM", frequency: 44, level: "Junior", tag: "react" },
  { question: "Как работает EventLoop", frequency: 43, level: "Middle", tag: "async" },
  { question: "Что такое CORS", frequency: 38, level: "Junior", tag: "network" },
  { question: "Как работает замыкание", frequency: 36, level: "Junior", tag: "js" },
  { question: "Чем отличается useEffect и useLayoutEffect", frequency: 31, level: "Middle", tag: "react" },
  { question: "Какие знаешь типы данных в JS", frequency: 30, level: "Junior", tag: "js" },
];

const levels = ["Все", "Junior", "Middle", "Senior"] as const;
const tags = [
  { code: "core", label: "База" },
  { code: "async", label: "Async" },
  { code: "react", label: "React" },
  { code: "network", label: "Сеть" },
  { code: "js", label: "JavaScript" },
  { code: "soft", label: "Софт скиллы" },
];

export default function TrackQuestionsPage({ params }: { params: { track: string } }) {
  const trackKey = params.track as TrackKey;
  const track = trackCatalog[trackKey];

  if (!track) {
    notFound();
  }

  const [selectedLevel, setSelectedLevel] = useState<(typeof levels)[number]>("Все");
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [search, setSearch] = useState("");

  const filteredQuestions = useMemo(() => {
    return demoQuestions.filter((item) => {
      const matchesLevel = selectedLevel === "Все" || item.level === selectedLevel;
      const matchesTag = activeTags.length === 0 || activeTags.includes(item.tag);
      const matchesSearch =
        search.trim().length === 0 || item.question.toLowerCase().includes(search.toLowerCase());

      return matchesLevel && matchesTag && matchesSearch;
    });
  }, [activeTags, search, selectedLevel]);

  const toggleTag = (code: string) => {
    setActiveTags((prev) =>
      prev.includes(code) ? prev.filter((item) => item !== code) : [...prev, code],
    );
  };

  return (
    <section className="relative py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="mb-8 flex items-center gap-3 text-sm text-slate-600">
          <Link href="/tracks" className="text-blue-600 hover:text-blue-500">
            ← все направления
          </Link>
          <span className="text-slate-400">/</span>
          <span className="font-medium text-slate-800">{track.title}</span>
        </div>

        <div className="mb-8 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-wide text-blue-600">Демо трек</p>
              <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">Вопросы на {track.title}</h1>
              <p className="mt-3 text-lg text-gray-600">{track.description}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 px-5 py-4 text-sm text-slate-700">
              <div className="font-semibold text-gray-900">12385 вопросов</div>
              <div className="text-slate-500">на 749 собеседованиях (демо)</div>
            </div>
          </div>
        </div>

        <div className="mb-6 grid gap-4 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm md:grid-cols-[2fr_1fr] md:p-8">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {levels.map((level) => (
                <button
                  key={level}
                  onClick={() => setSelectedLevel(level)}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                    selectedLevel === level
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-slate-200 bg-white text-slate-700 hover:border-blue-300"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag.code}
                  onClick={() => toggleTag(tag.code)}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                    activeTags.includes(tag.code)
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-slate-200 bg-white text-slate-700 hover:border-blue-300"
                  }`}
                >
                  {tag.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Поиск по вопросу
            </label>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Например, Virtual DOM"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 shadow-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
            <p className="text-xs text-slate-500">Все фильтры работают в демо-режиме.</p>
          </div>
        </div>

        <div className="space-y-3">
          {filteredQuestions.map((item) => (
            <div
              key={item.question}
              className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md md:p-5"
            >
              <div className="mb-2 flex items-center justify-between text-sm text-slate-500">
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                    {item.level}
                  </span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                    {item.tag}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="font-semibold text-gray-900">{item.frequency}%</span>
                  <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-400"
                      style={{ width: `${item.frequency}%` }}
                    />
                  </div>
                </div>
              </div>
              <div className="text-lg font-semibold text-gray-900">{item.question}</div>
              <p className="mt-2 text-sm text-slate-600">
                Заглушка для ответа. Здесь будет короткий, но ёмкий разбор и ссылки на
                подробные конспекты, когда контент будет готов.
              </p>
              <div className="mt-4 flex flex-wrap gap-3 text-sm">
                <button className="rounded-lg border border-slate-200 px-4 py-2 font-medium text-slate-700 transition hover:border-blue-300 hover:text-blue-700">
                  Открыть ответ (демо)
                </button>
                <button className="rounded-lg border border-transparent bg-blue-600 px-4 py-2 font-semibold text-white shadow-sm transition hover:bg-blue-500">
                  Добавить в план подготовки
                </button>
              </div>
            </div>
          ))}

          {filteredQuestions.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center text-slate-600">
              По выбранным фильтрам пока нет вопросов. Попробуйте сбросить фильтры или
              выбрать другой трек.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
