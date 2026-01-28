"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "antd";

import { useAuthModal } from "@/components/ui/auth-modal-provider";
import { isProUser } from "@/lib/subscription";
import { supabase } from "@/lib/supabaseClient";
import type { ArticleRow } from "@/lib/articles";

type ArticlesListProps = {
  initialArticles: ArticleRow[];
  total: number;
  page: number;
  perPage: number;
};

const formatPublishedAt = (value: string | null) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

export default function ArticlesList({
  initialArticles,
  total,
  page,
  perPage,
}: ArticlesListProps) {
  const router = useRouter();
  const { open: openAuthModal } = useAuthModal();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isPro, setIsPro] = useState(false);
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!isMounted) return;

      const { email, user_metadata } = session?.user ?? {};
      setIsAuthorized(Boolean(session?.user));
      setIsPro(isProUser({ email, metadata: user_metadata }));
      setHasCheckedAuth(true);
    };

    fetchSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return;

      const { email, user_metadata } = session?.user ?? {};
      setIsAuthorized(Boolean(session?.user));
      setIsPro(isProUser({ email, metadata: user_metadata }));
      setHasCheckedAuth(true);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (hasCheckedAuth && !isPro && page > 1) {
      router.replace("/articles?page=1");
    }
  }, [hasCheckedAuth, isPro, page, router]);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(total / perPage)),
    [perPage, total],
  );

  const paginationItems = useMemo(() => {
    if (totalPages <= 6) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    const items: Array<number | "ellipsis"> = [1];

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

  const handlePageChange = (nextPage: number) => {
    if (nextPage < 1 || nextPage > totalPages || nextPage === page) return;
    router.push(`/articles?page=${nextPage}`);
  };

  if (total === 0) {
    return (
      <div className="mt-10 flex flex-col items-center gap-4 rounded-2xl border border-dashed border-gray-200 bg-white/80 p-10 text-center shadow-sm">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sky-50 text-2xl">
          📚
        </div>
        <div>
          <p className="text-lg font-semibold text-gray-800">
            Пока нет статей — скоро добавим
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Мы собираем полезные материалы. Загляните чуть позже!
          </p>
        </div>
      </div>
    );
  }

  const canShowArticles = isPro || page === 1;

  return (
    <div className="mt-10">
      {canShowArticles && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {initialArticles.map((article) => {
            const publishedAt = formatPublishedAt(article.published_at);

            return (
              <a
                key={article.id}
                href={article.source_url}
                target="_blank"
                rel="noreferrer"
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-sky-200 hover:shadow-lg"
              >
                <div className="relative h-44 w-full overflow-hidden bg-gray-100">
                  {article.image_url ? (
                    <img
                      src={article.image_url}
                      alt={article.title}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 text-3xl text-gray-400">
                      ✨
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {article.title}
                  </h2>
                  <p
                    className="mt-3 text-sm leading-relaxed text-gray-600"
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 4,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {article.summary}
                  </p>
                  <div className="mt-auto flex items-center justify-between pt-4 text-xs text-gray-500">
                    <span>{publishedAt ?? "Без даты"}</span>
                    <span className="inline-flex items-center gap-1 font-semibold text-sky-600 transition group-hover:text-sky-500">
                      Читать статью
                      <span aria-hidden>↗</span>
                    </span>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      )}

      {isAuthorized && isPro && totalPages > 1 && (
        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-6 py-4">
          <div className="text-sm text-gray-700">
            Страница {page} из {totalPages}
          </div>
          <nav
            className="flex items-center gap-1 rounded-full border border-gray-200 bg-white p-1 text-sm shadow-sm"
            aria-label="Пагинация статей"
          >
            <Button
              type="text"
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
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
                  onClick={() => handlePageChange(item)}
                  className={`rounded-full px-3 py-1 font-semibold transition ${
                    page === item
                      ? "shadow"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  {item}
                </Button>
              ),
            )}
            <Button
              type="text"
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className="rounded-full px-3 py-1 font-semibold text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-400"
              aria-label="Следующая страница"
            >
              →
            </Button>
          </nav>
        </div>
      )}

      {!isAuthorized && (
        <div className="mt-8 flex flex-col gap-2 rounded-2xl border border-gray-200 bg-gray-50 px-6 py-5 text-center text-gray-800">
          <p className="text-base font-semibold">
            Это только первые 12 материалов из базы знаний.
          </p>
          <p className="text-sm text-gray-600">
            Авторизуйтесь, чтобы продолжить чтение и открыть больше статей.
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
        <div className="mt-8 flex flex-col gap-2 rounded-2xl border border-gray-200 bg-gray-50 px-6 py-5 text-center text-gray-800">
          <p className="text-base font-semibold">
            Дальше — материалы для подготовки и роста.
          </p>
          <p className="text-sm text-gray-600">
            Оформите PRO-подписку, чтобы снять ограничение и читать все статьи.
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
