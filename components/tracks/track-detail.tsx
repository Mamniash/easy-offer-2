"use client";

import Link from "next/link";
import { Popover } from "@headlessui/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  defaultQuestionMarkState,
  type QuestionMarkState,
} from "@/lib/question-marks";
import { getTrackSkillFilters } from "@/lib/track-skill-filters";
import type { Track } from "@/lib/tracks";
import { isProEmail } from "@/lib/subscription";
import { supabase } from "@/lib/supabaseClient";

const QUESTIONS_PER_PAGE = 50;
const UNAUTHORIZED_QUESTIONS_LIMIT = 20;
const AUTHORIZED_QUESTIONS_LIMIT = 50;
export default function TrackDetail({ track }: { track: Track }) {
  const [search, setSearch] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [questions, setQuestions] = useState(track.questions);
  const [page, setPage] = useState(1);
  const [totalQuestions, setTotalQuestions] = useState(track.stats.questions);
  const [isLoadingPage, setIsLoadingPage] = useState(false);
  const [isFetchingAll, setIsFetchingAll] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isPro, setIsPro] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLimitModalOpen, setIsLimitModalOpen] = useState(false);
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
    setIsFetchingAll(false);
  }, [track]);

  useEffect(() => {
    let isMounted = true;

    const fetchSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!isMounted) return;

      const email = session?.user?.email;
      const hasPro = isProEmail(email);

      setIsAuthorized(Boolean(session?.user));
      setUserId(session?.user?.id ?? null);
      setIsPro(hasPro);
    };

    fetchSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return;

      const email = session?.user?.email;
      const hasPro = isProEmail(email);

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
      if (!userId || !isPro) {
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
  }, [isPro, questions, userId]);

  const skillFilters = useMemo(
    () => getTrackSkillFilters(track.slug),
    [track.slug]
  );

  const normalizedSearch = search.trim().toLowerCase();
  const hasActiveFilters =
    normalizedSearch.length > 0 || selectedSkills.length > 0;
  const appliedSkillFilters = useMemo(
    () => skillFilters.filter((filter) => selectedSkills.includes(filter.id)),
    [selectedSkills, skillFilters]
  );

  const filteredQuestions = useMemo(() => {
    return questions.filter((question) => {
      const normalizedQuestion = question.question.toLowerCase();
      const normalizedAnswer = question.answer?.toLowerCase() ?? "";
      const combinedText = `${normalizedQuestion} ${normalizedAnswer}`;

      if (normalizedSearch && !combinedText.includes(normalizedSearch)) {
        return false;
      }

      if (appliedSkillFilters.length === 0) return true;

      return appliedSkillFilters.some((filter) =>
        filter.keywords.some((keyword) => combinedText.includes(keyword))
      );
    });
  }, [normalizedSearch, questions, appliedSkillFilters]);

  const totalPages = Math.max(
    1,
    Math.ceil(
      (hasActiveFilters
        ? filteredQuestions.length
        : totalQuestions || filteredQuestions.length || 1) / QUESTIONS_PER_PAGE
    )
  );
  const shouldPaginate = totalPages > 1;

  const paginatedQuestions = useMemo(() => {
    if (!shouldPaginate) return filteredQuestions;

    const startIndex = (page - 1) * QUESTIONS_PER_PAGE;
    const endIndex = startIndex + QUESTIONS_PER_PAGE;

    return filteredQuestions.slice(startIndex, endIndex);
  }, [filteredQuestions, page, shouldPaginate]);

  const fetchAllQuestions = useCallback(async () => {
    if (isFetchingAll) return;

    setIsFetchingAll(true);

    try {
      const fetchedQuestions: Track["questions"] = [];
      let currentPage = 1;
      let hasMore = true;

      while (hasMore) {
        const response = await fetch(
          `/api/tracks/${track.slug}/questions?page=${currentPage}&perPage=${QUESTIONS_PER_PAGE}`,
          { cache: "no-store" }
        );

        if (!response.ok) {
          throw new Error(
            `Не удалось загрузить вопросы: ${response.statusText}`
          );
        }

        const payload = await response.json();
        const nextPageQuestions = payload.questions ?? [];

        fetchedQuestions.push(...nextPageQuestions);

        hasMore = nextPageQuestions.length === QUESTIONS_PER_PAGE;
        currentPage += 1;

        if (!hasMore) {
          setTotalQuestions((prev) => payload.total ?? prev);
        }
      }

      setQuestions(fetchedQuestions);
      setPage(1);
    } catch (error) {
      console.error("[TrackDetail] Ошибка загрузки всех вопросов", error);
    } finally {
      setIsFetchingAll(false);
    }
  }, [isFetchingAll, track.slug]);

  useEffect(() => {
    if (isPro && hasActiveFilters) {
      fetchAllQuestions();
      return;
    }

    if (!isPro && track.stats.questions > track.questions.length) {
      fetchAllQuestions();
      return;
    }

    setQuestions(track.questions);
    setTotalQuestions(track.stats.questions);
    setPage(1);
  }, [
    fetchAllQuestions,
    hasActiveFilters,
    isPro,
    track.questions,
    track.stats.questions,
  ]);

  useEffect(() => {
    if (!hasActiveFilters) return;
  }, [hasActiveFilters]);

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
    !isLoadingPage && !isFetchingAll && paginatedQuestions.length === 0;
  const hasPagination = totalPages > 1;
  const questionLimit = isAuthorized
    ? AUTHORIZED_QUESTIONS_LIMIT
    : UNAUTHORIZED_QUESTIONS_LIMIT;
  const totalAvailableQuestions = totalQuestions || filteredQuestions.length;
  const visibleQuestionsCount = isPro
    ? hasActiveFilters
      ? filteredQuestions.length
      : totalQuestions
    : Math.min(
        filteredQuestions.length,
        totalQuestions,
        questionLimit
      );
  const questionsCountLabel =
    !isPro && !hasActiveFilters
      ? `${visibleQuestionsCount.toLocaleString("ru-RU")} из ${totalAvailableQuestions.toLocaleString("ru-RU")} вопросов`
      : `${visibleQuestionsCount.toLocaleString("ru-RU")} вопросов`;
  const shouldLockQuestions = !isPro;

  return (
    <div className="mt-10 rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-gray-200 px-6 py-5 md:flex-row md:items-center md:justify-between">
        <div className="flex w-full flex-col gap-3 md:flex-row md:items-center md:justify-between">
          {hasActiveFilters ? (
            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
              <span className="font-semibold text-gray-900">Фильтры:</span>
              {normalizedSearch && (
                <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                  Поиск: “{search}”
                </span>
              )}
              {appliedSkillFilters.map((filter) => (
                <span
                  key={filter.id}
                  className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-700"
                >
                  {filter.label}
                </span>
              ))}
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setSelectedSkills([]);
                }}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700"
              >
                Сбросить
              </button>
            </div>
          ) : (
            <p className="text-base font-semibold text-gray-900 md:text-lg">
              {questionsCountLabel}
            </p>
          )}

          <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row md:items-center md:gap-4">
            {skillFilters.length > 0 && (
              <Popover className="relative text-sm text-gray-600">
                <Popover.Button
                  className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${
                    selectedSkills.length > 0
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-gray-200 bg-white text-gray-700 hover:border-blue-300"
                  }`}
                >
                  Навыки
                  {selectedSkills.length > 0 && (
                    <span className="rounded-full bg-blue-600 px-2 py-0.5 text-xs font-semibold text-white">
                      {selectedSkills.length}
                    </span>
                  )}
                  <span className="text-gray-400">▾</span>
                </Popover.Button>
                <Popover.Panel className="absolute left-0 top-full z-10 mt-2 w-[min(360px,90vw)] rounded-2xl border border-gray-200 bg-white p-4 shadow-xl">
                  <div className="flex flex-wrap gap-2">
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
                  </div>
                  {selectedSkills.length > 0 && (
                    <div className="mt-3 flex justify-end text-xs">
                      <button
                        type="button"
                        onClick={() => setSelectedSkills([])}
                        className="font-semibold text-blue-600 hover:text-blue-700"
                      >
                        Сбросить
                      </button>
                    </div>
                  )}
                </Popover.Panel>
              </Popover>
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
      </div>
      <div ref={listTopRef} className="divide-y divide-gray-200">
        {isLoadingPage || (isFetchingAll && paginatedQuestions.length === 0)
          ? Array.from({ length: 6 }).map((_, index) => (
              <QuestionSkeleton key={index} />
            ))
          : paginatedQuestions.map((question, index) => {
              const globalIndex = shouldPaginate
                ? (page - 1) * QUESTIONS_PER_PAGE + index
                : index;
              const isLocked =
                shouldLockQuestions && globalIndex >= questionLimit;
              return (
                <QuestionRow
                  key={question.id}
                  question={question}
                  slug={track.slug}
                  markState={
                    questionMarks[question.id] ?? defaultQuestionMarkState
                  }
                  isLocked={isLocked}
                  onLockedClick={() => setIsLimitModalOpen(true)}
                />
              );
            })}

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

      {isLimitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 px-4 py-6">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-400">
                  Доступ ограничен
                </p>
                <p className="mt-2 text-xl font-semibold text-gray-900">
                  {isAuthorized
                    ? "Дальше — вопросы, на которых чаще всего валятся!"
                    : "Это только 5% того, что реально спрашивают!"}
                </p>
                <p className="mt-2 text-sm text-gray-600">
                  {isAuthorized
                    ? "Оформите PRO-подписку, чтобы снять ограничение и видеть все вопросы по направлению."
                    : "Авторизуйтесь, чтобы открыть 50 вопросов по этому направлению."}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsLimitModalOpen(false)}
                className="rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
                aria-label="Закрыть"
              >
                ✕
              </button>
            </div>
            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsLimitModalOpen(false)}
                className="btn-sm bg-white text-gray-800 shadow-sm ring-1 ring-inset ring-gray-200 transition hover:bg-gray-50"
              >
                Понятно
              </button>
              {isAuthorized ? (
                <Link
                  href="/pro"
                  className="btn-sm bg-gray-900 text-white shadow-sm transition hover:bg-gray-800"
                >
                  Перейти к PRO
                </Link>
              ) : (
                <>
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
                </>
              )}
            </div>
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

type QuestionRowProps = {
  question: Track["questions"][number];
  slug: Track["slug"];
  markState: QuestionMarkState;
  isLocked?: boolean;
  onLockedClick?: () => void;
};

function QuestionRow({
  question,
  slug,
  markState,
  isLocked = false,
  onLockedClick,
}: QuestionRowProps) {
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

  const content = (
    <div className="relative">
      <div
        className={`flex flex-col gap-3 md:flex-row md:items-center md:justify-between ${
          isLocked ? "select-none opacity-50" : ""
        }`}
      >
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
              {isLocked && (
                <span className="rounded-full border border-gray-200 bg-white/80 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-500">
                  PRO
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
      {isLocked && (
        <div className="pointer-events-none absolute inset-0 bg-gray-900/10" />
      )}
    </div>
  );

  if (isLocked) {
    return (
      <button
        type="button"
        onClick={onLockedClick}
        className="group block w-full px-6 py-5 text-left transition hover:bg-blue-50/60"
      >
        {content}
      </button>
    );
  }

  return (
    <Link
      href={`/tracks/${slug}/questions/${question.id}`}
      className="group block px-6 py-5 transition hover:bg-blue-50/60"
    >
      {content}
    </Link>
  );
}
