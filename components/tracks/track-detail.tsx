"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  defaultQuestionMarkState,
  type QuestionMarkState,
} from "@/lib/question-marks";
import { getTrackSkillFilters } from "@/lib/track-skill-filters";
import type { Track } from "@/lib/tracks";
import { supabase } from "@/lib/supabaseClient";

const QUESTIONS_PER_PAGE = 50;
const UNAUTHORIZED_QUESTIONS_LIMIT = 20;
const AUTHORIZED_QUESTIONS_LIMIT = 50;
const PRO_EMAILS = ["mamniashvili2003@gmail.com", "pokrasov.04@mail.ru"];

export default function TrackDetail({ track }: { track: Track }) {
  const [search, setSearch] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [questions, setQuestions] = useState(track.questions);
  const [page, setPage] = useState(1);
  const [totalQuestions, setTotalQuestions] = useState(track.stats.questions);
  const [isLoadingPage, setIsLoadingPage] = useState(false);
  const [isFetchingFiltered, setIsFetchingFiltered] = useState(false);
  const [filteredFetchPage, setFilteredFetchPage] = useState(1);
  const [hasMoreFilteredPages, setHasMoreFilteredPages] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isPro, setIsPro] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [questionMarks, setQuestionMarks] = useState<
    Record<string, QuestionMarkState>
  >({});
  const listTopRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setQuestions(track.questions);
    setTotalQuestions(track.stats.questions);
    setPage(1);
    setSearch("");
    setSelectedSkills([]);
    setIsFetchingFiltered(false);
    setFilteredFetchPage(1);
    setHasMoreFilteredPages(true);
  }, [track]);

  useEffect(() => {
    let isMounted = true;

    const fetchSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!isMounted) return;

      const email = session?.user?.email?.toLowerCase();
      const hasPro = email ? PRO_EMAILS.includes(email) : false;

      setIsAuthorized(Boolean(session?.user));
      setUserId(session?.user?.id ?? null);
      setIsPro(hasPro);
    };

    fetchSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return;

      const email = session?.user?.email?.toLowerCase();
      const hasPro = email ? PRO_EMAILS.includes(email) : false;

      setIsAuthorized(Boolean(session?.user));
      setUserId(session?.user?.id ?? null);
      setIsPro(hasPro);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchQuestionMarks = async () => {
      if (!userId) {
        if (isMounted) {
          setQuestionMarks({});
        }
        return;
      }

      const questionIds = questions
        .map((question) => Number(question.id))
        .filter((value) => Number.isFinite(value));

      if (questionIds.length === 0) {
        setQuestionMarks({});
          return;
        }

      const { data, error } = await supabase
        .from("question_marks")
        .select("question_id,favorite,known,unknown")
        .eq("user_id", userId)
        .in("question_id", questionIds);

      if (!isMounted) return;

      if (error) {
        console.error("[TrackDetail] Failed to load question marks", error);
        return;
      }

      const nextMarks: Record<string, QuestionMarkState> = {};

      (data ?? []).forEach((mark) => {
        nextMarks[String(mark.question_id)] = {
          favorite: Boolean(mark.favorite),
          known: Boolean(mark.known),
          unknown: Boolean(mark.unknown),
        };
      });

      setQuestionMarks(nextMarks);
    };

    fetchQuestionMarks();

    return () => {
      isMounted = false;
    };
  }, [questions, userId]);

  const skillFilters = useMemo(
    () => getTrackSkillFilters(track.slug),
    [track.slug]
  );

  const normalizedSearch = search.trim().toLowerCase();
  const hasActiveFilters =
    normalizedSearch.length > 0 || selectedSkills.length > 0;

  const filteredQuestions = useMemo(() => {
    const availableQuestions = isPro
      ? questions
      : isAuthorized
        ? questions.slice(0, AUTHORIZED_QUESTIONS_LIMIT)
        : questions.slice(0, UNAUTHORIZED_QUESTIONS_LIMIT);

    const activeSkillFilters = skillFilters.filter((filter) =>
      selectedSkills.includes(filter.id)
    );

    return availableQuestions.filter((question) => {
      const normalizedQuestion = question.question.toLowerCase();
      const normalizedAnswer = question.answer?.toLowerCase() ?? "";
      const combinedText = `${normalizedQuestion} ${normalizedAnswer}`;

      if (normalizedSearch && !combinedText.includes(normalizedSearch)) {
        return false;
      }

      if (activeSkillFilters.length === 0) return true;

      return activeSkillFilters.some((filter) =>
        filter.keywords.some((keyword) => combinedText.includes(keyword))
      );
    });
  }, [
    isAuthorized,
    isPro,
    normalizedSearch,
    questions,
    selectedSkills,
    skillFilters,
  ]);

  const paginatedQuestions = useMemo(() => {
    if (!hasActiveFilters) return filteredQuestions;

    const startIndex = (page - 1) * QUESTIONS_PER_PAGE;
    const endIndex = startIndex + QUESTIONS_PER_PAGE;

    return filteredQuestions.slice(startIndex, endIndex);
  }, [filteredQuestions, hasActiveFilters, page]);

  const fetchNextFilteredPage = useCallback(async () => {
    if (!isAuthorized || !isPro) return;
    if (isFetchingFiltered || !hasMoreFilteredPages) return;

    setIsFetchingFiltered(true);

    try {
      const nextPage = filteredFetchPage + 1;
      const response = await fetch(
        `/api/tracks/${track.slug}/questions?page=${nextPage}&perPage=${QUESTIONS_PER_PAGE}`,
        { cache: "no-store" }
      );

      if (!response.ok) {
        throw new Error(
          `Не удалось загрузить вопросы: ${response.statusText}`
        );
      }

      const payload = await response.json();
      const nextPageQuestions = payload.questions ?? [];

      setQuestions((prev) => [...prev, ...nextPageQuestions]);
      setFilteredFetchPage(nextPage);
      setHasMoreFilteredPages(nextPageQuestions.length === QUESTIONS_PER_PAGE);
      setTotalQuestions((prev) => payload.total ?? prev);
    } catch (error) {
      console.error("[TrackDetail] Ошибка подгрузки вопросов", error);
    } finally {
      setIsFetchingFiltered(false);
    }
  }, [
    filteredFetchPage,
    hasMoreFilteredPages,
    isAuthorized,
    isFetchingFiltered,
    isPro,
    track.slug,
  ]);

  const ensureFilteredPageFilled = useCallback(async () => {
    if (!hasActiveFilters || !isAuthorized || !isPro) return;
    if (!hasMoreFilteredPages || isFetchingFiltered) return;

    const needed = page * QUESTIONS_PER_PAGE;

    if (filteredQuestions.length >= needed) return;

    await fetchNextFilteredPage();
  }, [
    fetchNextFilteredPage,
    filteredQuestions.length,
    hasActiveFilters,
    hasMoreFilteredPages,
    isAuthorized,
    isFetchingFiltered,
    isPro,
    page,
  ]);

  useEffect(() => {
    if (!isPro) return;

    if (hasActiveFilters) {
      setQuestions(track.questions);
      setFilteredFetchPage(1);
      setHasMoreFilteredPages(true);
      setPage(1);
      return;
    }

    setQuestions(track.questions);
    setTotalQuestions(track.stats.questions);
    setPage(1);
  }, [hasActiveFilters, isPro, track.questions, track.stats.questions]);

  useEffect(() => {
    if (!hasActiveFilters) return;
    ensureFilteredPageFilled();
  }, [ensureFilteredPageFilled, hasActiveFilters, page]);

  const totalPages = isPro
    ? Math.max(
        1,
        Math.ceil(
          (hasActiveFilters
            ? hasMoreFilteredPages
              ? Math.max(filteredQuestions.length, page * QUESTIONS_PER_PAGE)
              : filteredQuestions.length
            : totalQuestions || filteredQuestions.length || 1) /
            QUESTIONS_PER_PAGE
        )
      )
    : 1;

  const scrollToFirstQuestion = useCallback(() => {
    requestAnimationFrame(() => {
      if (!listTopRef.current) return;

      const offset = 120;
      const rect = listTopRef.current.getBoundingClientRect();
      const targetTop = window.scrollY + rect.top - offset;

      window.scrollTo({
        top: targetTop,
        behavior: "smooth",
      });
    });
  }, []);

  const loadPage = useCallback(
    async (nextPage: number) => {
      if (!isAuthorized) return;
      if (hasActiveFilters) {
        if (nextPage < 1 || nextPage > totalPages) return;
        setPage(nextPage);
        return;
      }
      if (nextPage === page || nextPage < 1 || nextPage > totalPages) return;

      setIsLoadingPage(true);
      scrollToFirstQuestion();

      try {
        const response = await fetch(
          `/api/tracks/${track.slug}/questions?page=${nextPage}&perPage=${QUESTIONS_PER_PAGE}`,
          { cache: "no-store" }
        );

        if (!response.ok) {
          throw new Error(
            `Не удалось загрузить вопросы: ${response.statusText}`
          );
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
    [
      hasActiveFilters,
      isAuthorized,
      page,
      scrollToFirstQuestion,
      totalPages,
      track.slug,
    ]
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

  const isEmptyState =
    !isLoadingPage && !isFetchingFiltered && paginatedQuestions.length === 0;
  const hasPagination = isPro && totalPages > 1;
  const visibleQuestionsCount = isPro
    ? hasActiveFilters
      ? filteredQuestions.length
      : totalQuestions
    : Math.min(
        filteredQuestions.length,
        totalQuestions,
        isAuthorized ? AUTHORIZED_QUESTIONS_LIMIT : UNAUTHORIZED_QUESTIONS_LIMIT
      );

  return (
    <div className="mt-10 rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-gray-200 px-6 py-5 md:flex-row md:items-center md:justify-between">
        <p className="text-base font-semibold text-gray-900 md:text-lg">
          {visibleQuestionsCount.toLocaleString("ru-RU")} вопросов
        </p>
        <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row md:items-center md:gap-4">
          {skillFilters.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
              <span className="font-medium text-gray-700">Навыки:</span>
              {skillFilters.map((filter) => {
                const isActive = selectedSkills.includes(filter.id);
                return (
                  <button
                    key={filter.id}
                    type="button"
                    onClick={() => {
                      setSelectedSkills((prev) =>
                        prev.includes(filter.id)
                          ? prev.filter((id) => id !== filter.id)
                          : [...prev, filter.id]
                      );
                    }}
                    className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                      isActive
                        ? "border-blue-600 bg-blue-50 text-blue-700"
                        : "border-gray-200 bg-white text-gray-600 hover:border-blue-300 hover:text-blue-600"
                    }`}
                  >
                    {filter.label}
                  </button>
                );
              })}
              {selectedSkills.length > 0 && (
                <button
                  type="button"
                  onClick={() => setSelectedSkills([])}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                >
                  Сбросить
                </button>
              )}
            </div>
          )}
          <label className="relative md:w-auto">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              🔍
            </span>
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

      <div ref={listTopRef} className="divide-y divide-gray-200">
        {isLoadingPage || (isFetchingFiltered && paginatedQuestions.length === 0)
          ? Array.from({ length: 6 }).map((_, index) => (
              <QuestionSkeleton key={index} />
            ))
          : paginatedQuestions.map((question) => (
              <QuestionRow
                key={question.id}
                question={question}
                slug={track.slug}
                markState={
                  questionMarks[question.id] ?? defaultQuestionMarkState
                }
              />
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
          <p className="text-base font-semibold">
            Хотите видеть больше вопросов?
          </p>
          <p className="text-sm text-gray-600">
            Авторизуйтесь, чтобы открыть 50 вопросов по этому направлению.
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

      {isAuthorized && !isPro && (
        <div className="flex flex-col gap-2 border-t border-gray-200 bg-gray-50 px-6 py-5 text-center text-gray-800">
          <p className="text-base font-semibold">Нужен полный доступ?</p>
          <p className="text-sm text-gray-600">
            Оформите PRO-подписку, чтобы снять ограничение и видеть все вопросы
            по направлению.
          </p>
          <p className="text-xs text-gray-500">
            PRO-доступ сейчас включен для выбранных аккаунтов. Оставьте заявку,
            и мы подключим подписку.
          </p>
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

type QuestionRowProps = {
  question: Track["questions"][number];
  slug: Track["slug"];
  markState: QuestionMarkState;
};

function QuestionRow({ question, slug, markState }: QuestionRowProps) {
  const statusDotClassName = markState.known
    ? "bg-emerald-400"
    : markState.unknown
      ? "bg-rose-400"
      : "bg-gray-300";
  const statusPillClassName = markState.known
    ? "shadow-[0_0_0_3px_rgba(16,185,129,0.2)]"
    : markState.unknown
      ? "shadow-[0_0_0_3px_rgba(244,63,94,0.2)]"
      : "";

  return (
    <Link
      href={`/tracks/${slug}/questions/${question.id}`}
      className="group block px-6 py-5 transition hover:bg-blue-50/60"
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`flex items-center gap-2 rounded-full bg-gray-900 px-3 py-1 text-sm font-semibold text-white ${statusPillClassName}`}
          >
            <span
              className={`h-2 w-2 rounded-full ${statusDotClassName}`}
              aria-hidden
            />
            {question.frequency}%
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.16em] text-gray-500">
              {question.category}
            </p>
            <p className="flex items-center gap-2 text-lg font-semibold text-gray-900 group-hover:text-blue-700">
              {question.question}
              {markState.favorite && (
                <span
                  className="text-base text-yellow-500"
                  aria-label="В избранном"
                >
                  ★
                </span>
              )}
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
          <p className="mt-2 text-right text-xs font-medium text-gray-500">
            Частота по собеседованиям
          </p>
        </div>
      </div>
    </Link>
  );
}
