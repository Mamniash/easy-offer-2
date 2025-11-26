"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { Track } from "@/lib/tracks";
import { supabase } from "@/lib/supabaseClient";

const QUESTIONS_PER_PAGE = 50;
const UNAUTHORIZED_QUESTIONS_LIMIT = 20;

export default function TrackDetail({ track }: { track: Track }) {
  const [search, setSearch] = useState("");
  const [questions, setQuestions] = useState(track.questions);
  const [page, setPage] = useState(1);
  const [totalQuestions, setTotalQuestions] = useState(track.stats.questions);
  const [isLoadingPage, setIsLoadingPage] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const listTopRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setQuestions(track.questions);
    setTotalQuestions(track.stats.questions);
    setPage(1);
    setSearch("");
  }, [track]);

  useEffect(() => {
    let isMounted = true;

    const fetchSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!isMounted) return;

      setIsAuthorized(Boolean(session?.user));
    };

    fetchSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return;

      setIsAuthorized(Boolean(session?.user));
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const filteredQuestions = useMemo(() => {
    const availableQuestions = isAuthorized
      ? questions
      : questions.slice(0, UNAUTHORIZED_QUESTIONS_LIMIT);
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) return availableQuestions;

    return availableQuestions.filter((question) =>
      question.question.toLowerCase().includes(normalizedSearch)
    );
  }, [isAuthorized, questions, search]);

  const totalPages = isAuthorized
    ? Math.max(
        1,
        Math.ceil(
          (totalQuestions || filteredQuestions.length || 1) / QUESTIONS_PER_PAGE
        )
      )
    : 1;

  const loadPage = useCallback(
    async (nextPage: number) => {
      if (!isAuthorized) return;
      if (nextPage === page || nextPage < 1 || nextPage > totalPages) return;

      setIsLoadingPage(true);
      listTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

      try {
        const response = await fetch(
          `/api/tracks/${track.slug}/questions?page=${nextPage}&perPage=${QUESTIONS_PER_PAGE}`,
          { cache: "no-store" }
        );

        if (!response.ok) {
          throw new Error(`Не удалось загрузить вопросы: ${response.statusText}`);
        }

        const payload = await response.json();

        setQuestions(payload.questions ?? []);
        setTotalQuestions((prev) => payload.total ?? prev);
        setPage(nextPage);
      } catch (error) {
        console.error("[TrackDetail] Ошибка загрузки страницы вопросов", error);
      } finally {
        setIsLoadingPage(false);
      }
    },
    [isAuthorized, page, totalPages, track.slug]
  );

  const paginationItems = useMemo(() => {
    if (totalPages <= 6) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    const items: (number | "ellipsis")[] = [1];

    if (page > 3) {
      items.push("ellipsis");
    }

    const start = Math.max(2, page - 1);
    const end = Math.min(totalPages - 1, page + 1);

    for (let current = start; current <= end; current += 1) {
      items.push(current);
    }

    if (page < totalPages - 2) {
      items.push("ellipsis");
    }

    items.push(totalPages);

    return items;
  }, [page, totalPages]);

  const isEmptyState = !isLoadingPage && filteredQuestions.length === 0;
  const hasPagination = isAuthorized && totalPages > 1;
  const visibleQuestionsCount = isAuthorized
    ? totalQuestions
    : Math.min(totalQuestions, UNAUTHORIZED_QUESTIONS_LIMIT);

  return (
    <div className="mt-10 rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-gray-200 px-6 py-5 md:flex-row md:items-center md:justify-between">
        <p className="text-base font-semibold text-gray-900 md:text-lg">
          {visibleQuestionsCount.toLocaleString("ru-RU")} вопросов
        </p>
        <label className="relative md:w-auto">
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

      <div ref={listTopRef} className="divide-y divide-gray-200">
        {isLoadingPage
          ? Array.from({ length: 6 }).map((_, index) => <QuestionSkeleton key={index} />)
          : filteredQuestions.map((question) => (
              <Link
                key={question.id}
                href={`/tracks/${track.slug}/questions/${question.id}`}
                className="group block px-6 py-5 transition hover:bg-blue-50/60"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 rounded-full bg-gray-900 px-3 py-1 text-sm font-semibold text-white">
                      <span className="h-2 w-2 rounded-full bg-emerald-400" aria-hidden />
                      {question.frequency}%
                    </div>
                    <div>
                      <p className="text-sm uppercase tracking-[0.16em] text-gray-500">{question.category}</p>
                      <p className="text-lg font-semibold text-gray-900 group-hover:text-blue-700">
                        {question.question}
                      </p>
                    </div>
                  </div>
                  <div className="w-full max-w-md">
                    <div className="h-2 rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-blue-600 to-blue-400"
                        style={{ width: `${question.frequency}%` }}
                      />
                    </div>
                    <p className="mt-2 text-right text-xs font-medium text-gray-500">Частота по собеседованиям</p>
                  </div>
                </div>
              </Link>
            ))}

        {isEmptyState && (
          <div className="px-6 py-8 text-center text-gray-500">
            Нет вопросов по запросу. Попробуйте изменить формулировку поиска.
          </div>
        )}
      </div>

      {hasPagination && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4">
          <div className="text-sm text-gray-700">
            Страница {page} из {totalPages}
          </div>
          <nav
            className="flex items-center gap-1 rounded-full border border-gray-200 bg-white p-1 text-sm shadow-sm"
            aria-label="Пагинация вопросов"
          >
            <button
              type="button"
              onClick={() => loadPage(page - 1)}
              disabled={page === 1 || isLoadingPage}
              className="rounded-full px-3 py-1 font-semibold text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-400"
              aria-label="Предыдущая страница"
            >
              ←
            </button>
            {paginationItems.map((item, index) =>
              item === "ellipsis" ? (
                <span key={`ellipsis-${index}`} className="px-2 text-gray-400">
                  …
                </span>
              ) : (
                <button
                  key={item}
                  type="button"
                  onClick={() => loadPage(item)}
                  disabled={isLoadingPage}
                  className={`rounded-full px-3 py-1 font-semibold transition ${
                    page === item
                      ? "bg-gray-900 text-white shadow"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  } disabled:cursor-not-allowed disabled:text-gray-400`}
                >
                  {item}
                </button>
              )
            )}
            <button
              type="button"
              onClick={() => loadPage(page + 1)}
              disabled={page === totalPages || isLoadingPage}
              className="rounded-full px-3 py-1 font-semibold text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-400"
              aria-label="Следующая страница"
            >
              →
            </button>
          </nav>
        </div>
      )}

      {!isAuthorized && (
        <div className="flex flex-col gap-2 border-t border-gray-200 bg-gray-50 px-6 py-5 text-center text-gray-800">
          <p className="text-base font-semibold">Хотите видеть больше вопросов?</p>
          <p className="text-sm text-gray-600">
            Авторизуйтесь, чтобы открыть полный список вопросов по этому направлению.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-1">
            <Link
              href="/signin"
              className="btn-sm bg-blue-600 text-white shadow-sm transition hover:bg-blue-700"
            >
              Войти
            </Link>
            <Link
              href="/signup"
              className="btn-sm bg-white text-gray-800 shadow-sm ring-1 ring-inset ring-gray-200 transition hover:bg-gray-50"
            >
              Зарегистрироваться
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

function QuestionSkeleton() {
  return (
    <div className="px-6 py-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="h-7 w-20 rounded-full bg-gray-200" />
          <div className="space-y-2">
            <div className="h-3 w-24 rounded bg-gray-200" />
            <div className="h-4 w-64 max-w-full rounded bg-gray-200" />
          </div>
        </div>
        <div className="w-full max-w-md space-y-2">
          <div className="h-2 w-full rounded-full bg-gray-200" />
          <div className="ml-auto h-3 w-24 rounded bg-gray-200" />
        </div>
      </div>
    </div>
  );
}
