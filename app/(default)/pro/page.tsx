"use client";

import { useEffect, useState } from "react";
import { Button } from "antd";
import ProPlanSelection from "@/components/pro/pro-plan-selection";
import { supabase } from "@/lib/supabaseClient";
import { useAuthModal } from "@/components/ui/auth-modal-provider";

type ComparisonItem = {
  title: string;
  free: string;
  pro: string;
};

type TelegramUserInfo = {
  telegramId: number | null;
  username: string | null;
  firstName: string | null;
  lastName: string | null;
};

const COMPARISON: ComparisonItem[] = [
  {
    title: "Доступ к вопросам",
    free: "До 50 вопросов на трек",
    pro: "Полный список + фильтры",
  },
  {
    title: "Тренажеры",
    free: "Нет",
    pro: "Интерактивные тренажёры",
  },
  {
    title: "Переработка вопросов",
    free: "Базовые формулировки",
    pro: "Переупаковка под реальное интервью",
  },
  {
    title: "Реальные собеседования",
    free: "Нет",
    pro: "Сборник кейсов и разборов",
  },
  {
    title: "Фильтры по компаниям",
    free: "Нет",
    pro: "Да, по компаниям и грейду",
  },
  {
    title: "База записей интервью",
    free: "Нет",
    pro: "Записи и разборы интервью",
  },
  {
    title: "Live coding",
    free: "Нет",
    pro: "Сессии и задания",
  },
  {
    title: "Источники и видео",
    free: "Скрыто",
    pro: "YouTube + полезные ссылки",
  },
];

export default function ProPage() {
  const [userName, setUserName] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<TelegramUserInfo>({
    telegramId: null,
    username: null,
    firstName: null,
    lastName: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [needsAuth, setNeedsAuth] = useState(false);
  const { open: openAuthModal } = useAuthModal();

  useEffect(() => {
    const fetchSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        setNeedsAuth(true);
        setIsLoading(false);
        return;
      }

      const { user_metadata } = session.user;
      const telegramId =
        typeof user_metadata?.telegram_id === "number"
          ? user_metadata.telegram_id
          : null;
      const username =
        typeof user_metadata?.username === "string"
          ? user_metadata.username.trim()
          : null;
      const firstName =
        typeof user_metadata?.first_name === "string"
          ? user_metadata.first_name.trim()
          : "";
      const lastName =
        typeof user_metadata?.last_name === "string"
          ? user_metadata.last_name.trim()
          : "";
      const fullName = [firstName, lastName].filter(Boolean).join(" ");
      const fallbackName =
        (typeof user_metadata?.full_name === "string"
          ? user_metadata.full_name
          : null) ||
        (typeof user_metadata?.name === "string" ? user_metadata.name : null) ||
        (typeof user_metadata?.username === "string"
          ? `@${user_metadata.username}`
          : null);
      setUserName(fullName || fallbackName || null);
      setUserInfo({
        telegramId,
        username,
        firstName: firstName || null,
        lastName: lastName || null,
      });
      setIsLoading(false);
    };

    fetchSession();
  }, []);

  if (needsAuth) {
    return (
      <section className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-gray-100 bg-white p-8 text-center shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
            PRO-доступ
          </p>
          <h1 className="mt-4 text-2xl font-bold text-gray-900">
            Войдите, чтобы оформить подписку
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Авторизация нужна, чтобы закрепить PRO на вашем аккаунте.
          </p>
          <Button
            type="primary"
            shape="round"
            onClick={openAuthModal}
            className="mt-6 px-6 py-2 text-sm font-semibold"
          >
            Войти через Telegram
          </Button>
        </div>
      </section>
    );
  }

  if (isLoading) {
    return (
      <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
          <div className="h-6 w-32 rounded-full bg-gray-200" />
          <div className="mt-4 h-10 w-2/3 rounded-xl bg-gray-200" />
          <div className="mt-3 h-4 w-full rounded-full bg-gray-100" />
        </div>
      </section>
    );
  }

  return (
    <section className="pb-20 pt-16 md:pt-24">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 sm:px-6">
        <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold text-gray-900">
              Сравнение доступа
            </h2>
            <p className="text-sm text-gray-600">
              {userName ? `${userName},` : "Привет,"} полная картина отличий
              между базовым доступом и PRO.
            </p>
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-gray-100">
            <div className="hidden grid-cols-[1.4fr_1fr_1fr] bg-gray-50 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 md:grid">
              <span>Функция</span>
              <span>Базовый</span>
              <span className="text-blue-600">PRO</span>
            </div>
            <div className="divide-y divide-gray-100">
              {COMPARISON.map((item, index) => (
                <div
                  key={item.title}
                  className={`grid gap-4 px-5 py-4 md:grid-cols-[1.4fr_1fr_1fr] ${
                    index % 2 === 0 ? "bg-white" : "bg-slate-50/70"
                  }`}
                >
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {item.title}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400 md:hidden">
                      Базовый
                    </p>
                    <p className="mt-1 text-sm font-medium text-gray-700">
                      {item.free}
                    </p>
                  </div>
                  <div className="rounded-xl border border-blue-600/20 bg-slate-900 px-3 py-2 text-white shadow-sm">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-blue-200 md:hidden">
                      PRO
                    </p>
                    <p className="mt-1 text-sm font-semibold">{item.pro}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <ProPlanSelection userInfo={userInfo} />
        </div>
      </div>
    </section>
  );
}
