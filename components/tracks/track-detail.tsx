"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Input, Popover, Select } from "antd";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useAuthModal } from "@/components/ui/auth-modal-provider";
import {
  defaultQuestionMarkState,
  type QuestionMarkState,
} from "@/lib/question-marks";
import { getTrackSkillFilters } from "@/lib/track-skill-filters";
import type { Track } from "@/lib/tracks";
import { isProUser } from "@/lib/subscription";
import { supabase } from "@/lib/supabaseClient";

const QUESTIONS_PER_PAGE = 50;
const UNAUTHORIZED_QUESTIONS_LIMIT = 20;
const AUTHORIZED_QUESTIONS_LIMIT = 50;
const GOLANG_COMPANIES = [
  "Ozon",
  "ВК",
  "ВсеИнструменты",
  "Wildberries",
  "XM",
  "ВкусВилл",
  "Rutube",
  "Самокат",
  "Селектел",
  "Yadro",
  "B2Broker",
  "BetBoom",
  "Bizone",
  "Burger-King",
  "CyberOk",
  "Домклик",
  "EMCD",
  "Employcity",
  "Evrone",
  "Flant",
  "Kvando-Technologies",
  "Ламода",
  "МТС",
  "Lenvendo",
  "Магнит",
  "Сбер",
  "Тинькофф",
  "Касперский",
  "ЦУМ",
  "Positive-Technologies",
  "Swoyo",
  "Telespace",
  "Uplatform",
  "MIND Software",
];

type GolangCompanyQuestion = {
  id: number;
  company_name: string;
  question_text: string;
};
export default function TrackDetail({ track }: { track: Track }) {
  const router = useRouter();
  const { open: openAuthModal } = useAuthModal();
  const scrollStorageKey = useMemo(
    () => `track-scroll:${track.slug}`,
    [track.slug],
  );
  const [search, setSearch] = useState("");
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [questions, setQuestions] = useState(track.questions);
  const [page, setPage] = useState(1);
  const [totalQuestions, setTotalQuestions] = useState(track.stats.questions);
  const [isLoadingPage, setIsLoadingPage] = useState(false);
  const [isFetchingFiltered, setIsFetchingFiltered] = useState(false);
  const [companyQuestions, setCompanyQuestions] = useState<GolangCompanyQuestion[]>([]);
  const [isLoadingCompanyQuestions, setIsLoadingCompanyQuestions] = useState(false);
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
    setSelectedCompany(null);
    setSelectedSkills([]);
    setCompanyQuestions([]);
    setIsFetchingFiltered(false);
  }, [track]);

  useEffect(() => {
    let isMounted = true;

    const fetchSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!isMounted) return;

      const { email, user_metadata } = session?.user ?? {};
      const hasPro = isProUser({ email, metadata: user_metadata });

      setIsAuthorized(Boolean(session?.user));
      setUserId(session?.user?.id ?? null);
      setIsPro(hasPro);
    };

    fetchSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return;

      const { email, user_metadata } = session?.user ?? {};
      const hasPro = isProUser({ email, metadata: user_metadata });

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
      if ((track.slug === "golang" && selectedCompany) || !userId) {
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
  }, [questions, selectedCompany, track.slug, userId]);

  const skillFilters = useMemo(
    () => getTrackSkillFilters(track.slug),
    [track.slug],
  );

  const normalizedSearch = search.trim().toLowerCase();
  const isGolangTrack = track.slug === "golang";
  const hasCompanyFilter = isGolangTrack && Boolean(selectedCompany);
  const hasActiveFilters =
    normalizedSearch.length > 0 || selectedSkills.length > 0 || hasCompanyFilter;
  const appliedSkillFilters = useMemo(
    () => skillFilters.filter((filter) => selectedSkills.includes(filter.id)),
    [selectedSkills, skillFilters],
  );

  useEffect(() => {
    if (!hasCompanyFilter || !selectedCompany) {
      setCompanyQuestions([]);
      setIsLoadingCompanyQuestions(false);
      return;
    }

    let isMounted = true;

    const fetchCompanyQuestions = async () => {
      setIsLoadingCompanyQuestions(true);

      try {
        const response = await fetch(
          `/api/tracks/${track.slug}/company-questions?company=${encodeURIComponent(selectedCompany)}`,
          { cache: "no-store" },
        );

        if (!response.ok) {
          throw new Error(`Не удалось загрузить вопросы компании: ${response.statusText}`);
        }

        const payload = await response.json();

        if (!isMounted) return;

        setCompanyQuestions(payload.questions ?? []);
        setPage(1);
      } catch (error) {
        console.error("[TrackDetail] Ошибка загрузки company-вопросов", error);
        if (isMounted) {
          setCompanyQuestions([]);
        }
      } finally {
        if (isMounted) {
          setIsLoadingCompanyQuestions(false);
        }
      }
    };

    fetchCompanyQuestions();

    return () => {
      isMounted = false;
    };
  }, [hasCompanyFilter, selectedCompany, track.slug]);

  const filteredQuestions = useMemo(() => {
    const baseQuestions = hasCompanyFilter
      ? companyQuestions.map((question) => ({
          id: String(question.id),
          question: question.question_text,
          frequency: 0,
          level: "middle" as const,
          category: question.company_name,
          answer: undefined,
        }))
      : questions;

    const availableQuestions = hasCompanyFilter
      ? baseQuestions
      : isPro
        ? baseQuestions
        : isAuthorized
          ? baseQuestions.slice(0, AUTHORIZED_QUESTIONS_LIMIT)
          : baseQuestions.slice(0, UNAUTHORIZED_QUESTIONS_LIMIT);

    return availableQuestions.filter((question) => {
      const normalizedQuestion = question.question.toLowerCase();
      const normalizedAnswer = question.answer?.toLowerCase() ?? "";
      const combinedText = `${normalizedQuestion} ${normalizedAnswer}`;

      if (normalizedSearch && !combinedText.includes(normalizedSearch)) {
        return false;
      }

      if (appliedSkillFilters.length === 0) return true;

      return appliedSkillFilters.some((filter) =>
        filter.keywords.some((keyword) => combinedText.includes(keyword)),
      );
    });
  }, [
    appliedSkillFilters,
    companyQuestions,
    hasCompanyFilter,
    isAuthorized,
    isPro,
    normalizedSearch,
    questions,
  ]);

  const paginatedQuestions = useMemo(() => {
    if (!hasActiveFilters) return filteredQuestions;

    const startIndex = (page - 1) * QUESTIONS_PER_PAGE;
    const endIndex = startIndex + QUESTIONS_PER_PAGE;

    return filteredQuestions.slice(startIndex, endIndex);
  }, [filteredQuestions, hasActiveFilters, page]);

  const fetchAllQuestions = useCallback(async () => {
    if (!isAuthorized || !isPro) return;
    if (isFetchingFiltered) return;

    setIsFetchingFiltered(true);

    try {
      const fetchedQuestions: Track["questions"] = [];
      let currentPage = 1;
      let hasMore = true;

      while (hasMore) {
        const response = await fetch(
          `/api/tracks/${track.slug}/questions?page=${currentPage}&perPage=${QUESTIONS_PER_PAGE}`,
          { cache: "no-store" },
        );

        if (!response.ok) {
          throw new Error(
            `Не удалось загрузить вопросы: ${response.statusText}`,
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
      setIsFetchingFiltered(false);
    }
  }, [isAuthorized, isFetchingFiltered, isPro, track.slug]);

  useEffect(() => {
    if (!isPro || hasCompanyFilter) return;

    if (hasActiveFilters) {
      fetchAllQuestions();
      return;
    }

    setQuestions(track.questions);
    setTotalQuestions(track.stats.questions);
    setPage(1);
  }, [
    hasActiveFilters,
    hasCompanyFilter,
    isPro,
    track.questions,
    track.stats.questions,
  ]);

  useEffect(() => {
    if (!hasActiveFilters) return;
  }, [hasActiveFilters]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedScroll = sessionStorage.getItem(scrollStorageKey);

    if (!storedScroll) return;

    sessionStorage.removeItem(scrollStorageKey);

    try {
      const { y } = JSON.parse(storedScroll) as { y?: number };

      if (!Number.isFinite(y)) return;

      requestAnimationFrame(() => {
        window.scrollTo({
          top: y ?? 0,
          behavior: "auto",
        });
      });
    } catch (error) {
      console.error("[TrackDetail] Failed to restore scroll", error);
    }
  }, [scrollStorageKey]);

  const totalPages = isPro && !hasCompanyFilter
    ? Math.max(
        1,
        Math.ceil(
          (hasActiveFilters
            ? filteredQuestions.length
            : totalQuestions || filteredQuestions.length || 1) /
            QUESTIONS_PER_PAGE,
        ),
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
          { cache: "no-store" },
        );

        if (!response.ok) {
          throw new Error(
            `Не удалось загрузить вопросы: ${response.statusText}`,
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
    ],
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
    !isLoadingPage &&
    !isFetchingFiltered &&
    !isLoadingCompanyQuestions &&
    paginatedQuestions.length === 0;
  const hasPagination = isPro && !hasCompanyFilter && totalPages > 1;
  const totalQuestionsCount = hasCompanyFilter
    ? companyQuestions.length
    : totalQuestions || filteredQuestions.length || questions.length;
  const visibleQuestionsCount = isPro
    ? hasActiveFilters
      ? filteredQuestions.length
      : totalQuestionsCount
    : Math.min(
        filteredQuestions.length,
        totalQuestionsCount,
        isAuthorized
          ? AUTHORIZED_QUESTIONS_LIMIT
          : UNAUTHORIZED_QUESTIONS_LIMIT,
      );
  const displayQuestionsCount = isPro
    ? `${visibleQuestionsCount.toLocaleString("ru-RU")} вопросов`
    : `${visibleQuestionsCount.toLocaleString("ru-RU")} из ${totalQuestionsCount.toLocaleString("ru-RU")} вопросов`;
  const isSkillFiltersLocked = !isPro;
  const companyOptions = useMemo(
    () => GOLANG_COMPANIES.map((company) => ({ label: company, value: company })),
    [],
  );
  const handleQuestionNavigate = useCallback(() => {
    if (typeof window === "undefined") return;

    sessionStorage.setItem(
      scrollStorageKey,
      JSON.stringify({ y: window.scrollY }),
    );
  }, [scrollStorageKey]);

  return (
    <div className="mt-10 rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-gray-200 px-6 py-5 md:flex-row md:items-center md:justify-between">
        <div className="flex w-full flex-col gap-3 md:flex-row md:items-center md:justify-between">
          {hasActiveFilters ? (
            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
              <span className="font-semibold text-gray-900">Фильтры:</span>
              {selectedCompany && (
                <span className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
                  Компания: {selectedCompany}
                </span>
              )}
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
              <Button
                type="link"
                onClick={() => {
                  setSearch("");
                  setSelectedCompany(null);
                  setSelectedSkills([]);
                }}
                className="text-xs font-semibold !p-0"
              >
                Сбросить
              </Button>
            </div>
          ) : (
            <span className="text-base font-semibold text-gray-900 md:text-lg">
              {displayQuestionsCount}
            </span>
          )}

          <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row md:items-center md:gap-4">
            {isGolangTrack && (
              <Select
                value={selectedCompany ?? undefined}
                onChange={(value) => setSelectedCompany(value ?? null)}
                allowClear
                placeholder="Компания"
                options={companyOptions}
                className="w-full md:w-56"
                size="large"
              />
            )}
            {skillFilters.length > 0 && (
              <Popover
                placement="bottomLeft"
                trigger="click"
                content={
                  <div className="w-[min(360px,90vw)] rounded-2xl p-1">
                    <div className="flex flex-wrap gap-2">
                      {skillFilters.map((filter) => {
                        const isActive = selectedSkills.includes(filter.id);
                        return (
                          <Button
                            key={filter.id}
                            type={isActive ? "primary" : "default"}
                            size="small"
                            shape="round"
                            onClick={() => {
                              if (isSkillFiltersLocked) {
                                router.push("/pro");
                                return;
                              }
                              setSelectedSkills((prev) =>
                                prev.includes(filter.id)
                                  ? prev.filter((id) => id !== filter.id)
                                  : [...prev, filter.id],
                              );
                            }}
                            className={`text-xs ${isSkillFiltersLocked ? "opacity-70" : ""}`}
                          >
                            {filter.label}
                          </Button>
                        );
                      })}
                    </div>
                    {isSkillFiltersLocked && (
                      <p className="mt-3 text-xs text-gray-500">
                        Фильтры по навыкам доступны в PRO-подписке.
                      </p>
                    )}
                    {selectedSkills.length > 0 && (
                      <div className="mt-3 flex justify-end text-xs">
                        <Button
                          type="link"
                          onClick={() => setSelectedSkills([])}
                          className="!p-0 font-semibold"
                        >
                          Сбросить
                        </Button>
                      </div>
                    )}
                  </div>
                }
              >
                <Button
                  type={selectedSkills.length > 0 ? "primary" : "default"}
                  shape="round"
                  className="flex items-center gap-2"
                >
                  Навыки
                  {isSkillFiltersLocked && (
                    <span className="rounded-full bg-gray-200 px-2 py-0.5 text-[10px] font-semibold uppercase text-gray-600">
                      PRO
                    </span>
                  )}
                  {selectedSkills.length > 0 && (
                    <span className="rounded-full bg-blue-600 px-2 py-0.5 text-xs font-semibold text-white">
                      {selectedSkills.length}
                    </span>
                  )}
                  <span className="text-gray-400">▾</span>
                </Button>
              </Popover>
            )}
            <label className="relative md:w-auto">
              <Input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Найти вопрос"
                className="w-full !rounded-full md:w-64"
                prefix={<span className="text-gray-400">🔍</span>}
                allowClear
              />
            </label>
          </div>
        </div>
      </div>
      <div ref={listTopRef} className="divide-y divide-gray-200">
        {isLoadingPage ||
        isLoadingCompanyQuestions ||
        (isFetchingFiltered && paginatedQuestions.length === 0)
          ? Array.from({ length: 6 }).map((_, index) => (
              <QuestionSkeleton key={index} />
            ))
          : paginatedQuestions.map((question) =>
              hasCompanyFilter ? (
                <CompanyQuestionRow key={question.id} question={question.question} />
              ) : (
                <QuestionRow
                  key={question.id}
                  question={question}
                  slug={track.slug}
                  markState={
                    questionMarks[question.id] ?? defaultQuestionMarkState
                  }
                  onNavigate={handleQuestionNavigate}
                />
              ),
            )}

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
            <Button
              type="text"
              onClick={() => loadPage(page - 1)}
              disabled={page === 1 || isLoadingPage}
              className="rounded-full px-3 py-1 font-semibold text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-400"
              aria-label="Предыдущая страница"
            >
              ←
            </Button>
            {paginationItems.map((item, index) =>
              item === "ellipsis" ? (
                <span key={`ellipsis-${index}`} className="px-2 text-gray-400">
                  …
                </span>
              ) : (
                <Button
                  key={item}
                  type={page === item ? "primary" : "text"}
                  onClick={() => loadPage(item)}
                  disabled={isLoadingPage}
                  className={`rounded-full px-3 py-1 font-semibold transition ${
                    page === item
                      ? "shadow"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  } disabled:cursor-not-allowed disabled:text-gray-400`}
                >
                  {item}
                </Button>
              ),
            )}
            <Button
              type="text"
              onClick={() => loadPage(page + 1)}
              disabled={page === totalPages || isLoadingPage}
              className="rounded-full px-3 py-1 font-semibold text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-400"
              aria-label="Следующая страница"
            >
              →
            </Button>
          </nav>
        </div>
      )}

      {!isAuthorized && (
        <div className="flex flex-col gap-2 border-t border-gray-200 bg-gray-50 px-6 py-5 text-center text-gray-800">
          <p className="text-base font-semibold">
            Это только 5% того, что реально спрашивают!
          </p>
          <p className="text-sm text-gray-600">
            Авторизуйтесь, чтобы открыть 50 вопросов по этому направлению.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-1">
            <Button
              type="primary"
              shape="round"
              onClick={openAuthModal}
              className="px-4 py-2 text-xs font-semibold"
            >
              Войти через Telegram
            </Button>
          </div>
        </div>
      )}

      {isAuthorized && !isPro && (
        <div className="flex flex-col gap-2 border-t border-gray-200 bg-gray-50 px-6 py-5 text-center text-gray-800">
          <p className="text-base font-semibold">
            Дальше — вопросы, на которых чаще всего валятся!
          </p>
          <p className="text-sm text-gray-600">
            Оформите PRO-подписку, чтобы снять ограничение и видеть все вопросы
            по направлению.
          </p>
          <div className="pt-2">
            <Button
              type="primary"
              shape="round"
              className="px-4 py-2 text-xs font-semibold"
              onClick={() => router.push("/pro")}
            >
              Перейти к PRO-подписке
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function CompanyQuestionRow({ question }: { question: string }) {
  return (
    <div className="px-6 py-5">
      <p className="text-lg font-semibold text-gray-900">{question}</p>
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
  onNavigate?: () => void;
};

function QuestionRow({
  question,
  slug,
  markState,
  onNavigate,
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

  return (
    <Link
      href={`/tracks/${slug}/questions/${question.id}`}
      className="group block px-6 py-5 transition hover:bg-blue-50/60"
      onClick={onNavigate}
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
            <span className="flex items-center gap-2 text-lg font-semibold text-gray-900 group-hover:text-blue-700">
              {question.question}
              {markState.favorite && (
                <span
                  className="text-base text-yellow-500"
                  aria-label="В избранном"
                >
                  ★
                </span>
              )}
            </span>
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
