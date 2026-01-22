"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "antd";

import { isProUser } from "@/lib/subscription";
import { supabase } from "@/lib/supabaseClient";

type VideoItem = {
  host: string;
  thumbnail: string | null;
  title: string;
  url: string;
};

type QuestionSourcesProps = {
  items: VideoItem[];
};

export default function QuestionSources({ items }: QuestionSourcesProps) {
  const [isPro, setIsPro] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();

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
    };

    fetchSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return;

      const { email, user_metadata } = session?.user ?? {};
      setIsAuthorized(Boolean(session?.user));
      setIsPro(isProUser({ email, metadata: user_metadata }));
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const ctaLabel = useMemo(
    () => (isAuthorized ? "Оформить PRO" : "Авторизоваться"),
    [isAuthorized]
  );

  if (items.length === 0) return null;

  return (
    <aside className="mt-6 md:mt-0 md:pl-2">
      <div className="flex items-center gap-2">
        <div className="h-5 w-1 rounded-full bg-blue-600" aria-hidden />
        <span className="text-sm font-semibold uppercase tracking-[0.08em] text-gray-800">
          Источники
        </span>
        {!isPro && (
          <span className="rounded-full bg-blue-50 px-2 py-1 text-[10px] font-semibold uppercase text-blue-700">
            PRO
          </span>
        )}
      </div>

      {!isPro && (
        <p className="mt-2 text-xs text-gray-500">
          Видео и ссылки доступны только в PRO-подписке.
        </p>
      )}

      <div className="mt-4 flex flex-col gap-3">
        {items.map((video) => {
          const cardContent = (
            <>
              <div className="relative h-20 w-28 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100 ring-1 ring-gray-200">
                {video.thumbnail ? (
                  <img
                    src={video.thumbnail}
                    alt="Превью видео"
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 text-gray-500">
                    🎬
                  </div>
                )}

                <div
                  className={`absolute inset-0 flex items-center justify-center transition ${
                    isPro
                      ? "bg-black/30 group-hover:bg-black/40"
                      : "bg-black/60"
                  }`}
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-gray-900 shadow ring-1 ring-gray-200">
                    ▶
                  </span>
                </div>
              </div>

              <div className="flex min-w-0 flex-1 flex-col">
                <p className="truncate text-sm font-semibold text-gray-900">
                  {video.title}
                </p>
                <p className="mt-1 truncate text-xs text-gray-500">
                  {video.host}
                </p>
                <span className="mt-2 inline-flex w-fit items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-[11px] font-semibold text-blue-700 ring-1 ring-blue-100">
                  {isPro ? "Смотреть" : ctaLabel}
                  <span aria-hidden className="text-xs">
                    ↗
                  </span>
                </span>
              </div>
            </>
          );

          if (isPro) {
            return (
              <Button
                key={video.url}
                href={video.url}
                target="_blank"
                rel="noreferrer"
                type="text"
                block
                className="group !h-auto !rounded-xl !border !border-gray-200 !bg-white !p-3 !text-left !text-gray-900 !shadow-sm transition hover:!-translate-y-0.5 hover:!border-blue-200 hover:!shadow-md"
              >
                <div className="flex items-center gap-3">{cardContent}</div>
              </Button>
            );
          }

          return (
            <Button
              key={video.url}
              onClick={() => router.push("/pro")}
              type="text"
              block
              className="group !h-auto !rounded-xl !border !border-dashed !border-blue-200 !bg-white !p-3 !text-left !text-gray-900 !shadow-sm transition hover:!-translate-y-0.5 hover:!border-blue-300 hover:!shadow-md"
            >
              <div className="flex items-center gap-3">{cardContent}</div>
            </Button>
          );
        })}
      </div>
    </aside>
  );
}
