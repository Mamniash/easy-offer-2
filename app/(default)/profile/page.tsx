"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "antd";

import { supabase } from "@/lib/supabaseClient";
import { isProUser } from "@/lib/subscription";
import { useAuthModal } from "@/components/ui/auth-modal-provider";

type ProfileUser = {
  email?: string;
  name?: string | null;
  createdAt?: string;
  id?: string;
  username?: string | null;
  avatarUrl?: string | null;
  telegramId?: number | null;
  isPro?: boolean;
};

const buildProfileUser = (
  email: string | null | undefined,
  metadata: Record<string, unknown> | null | undefined,
  id?: string,
  createdAt?: string,
): ProfileUser => {
  const firstName =
    typeof metadata?.first_name === "string" ? metadata.first_name.trim() : "";
  const lastName =
    typeof metadata?.last_name === "string" ? metadata.last_name.trim() : "";
  const fullName = [firstName, lastName].filter(Boolean).join(" ");
  const username =
    typeof metadata?.username === "string" ? metadata.username.trim() : null;
  const avatarUrl =
    typeof metadata?.avatar_url === "string" ? metadata.avatar_url : null;
  const telegramId =
    typeof metadata?.telegram_id === "number" ? metadata.telegram_id : null;
  const isPro =
    metadata?.is_pro === true ||
    metadata?.pro === true ||
    metadata?.subscription_status === "active" ||
    isProUser({ email, metadata });

  return {
    email: email ?? undefined,
    id,
    createdAt,
    name:
      fullName ||
      (typeof metadata?.full_name === "string" ? metadata.full_name : null) ||
      (typeof metadata?.name === "string" ? metadata.name : null) ||
      (username ? `@${username}` : null),
    username,
    avatarUrl,
    telegramId,
    isPro,
  };
};

export default function ProfilePage() {
  const [user, setUser] = useState<ProfileUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [needsAuth, setNeedsAuth] = useState(false);
  const { open: openAuthModal } = useAuthModal();
  const router = useRouter();

  useEffect(() => {
    const fetchSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        setNeedsAuth(true);
        setLoading(false);
        openAuthModal();
        return;
      }

      const { email, id, created_at, user_metadata } = session.user;

      setUser(buildProfileUser(email, user_metadata, id, created_at));
      setLoading(false);
    };

    fetchSession();
  }, [openAuthModal, router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.replace("/");
  };

  if (needsAuth) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm shadow-black/[0.03]">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-400">
            Профиль
          </p>
          <h1 className="mt-3 text-2xl font-bold text-gray-900">
            Войдите, чтобы увидеть профиль
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Авторизация нужна, чтобы показать ваши данные и историю.
          </p>
          <Button
            type="primary"
            shape="round"
            onClick={openAuthModal}
            className="mt-6 px-5 py-2 text-sm font-semibold"
          >
            Войти через Telegram
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8 mt-10 space-y-3">
        <h1 className="text-4xl font-bold leading-tight text-gray-900">
          Профиль пользователя
        </h1>
        <p className="text-base text-gray-600">
          Здесь собрана краткая информация о твоей учетной записи и быстрые
          действия.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm shadow-black/[0.03]">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-blue-600 to-blue-500 text-xl font-semibold text-white shadow-md">
              {user?.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name || "Профиль Telegram"}
                  className="h-full w-full object-cover"
                />
              ) : (
                user?.name?.[0] || user?.username?.[0] || user?.email?.[0] || "?"
              )}
            </div>
            <div className="flex flex-col justify-center">
              <p className="text-lg font-semibold text-gray-900">
                {loading ? "Загружаем…" : user?.name || "Без имени"}
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Telegram
              </p>
              {user?.username ? (
                <a
                  className="mt-1 inline-flex text-sm font-semibold text-blue-600 hover:text-blue-700"
                  href={`https://t.me/${user.username}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  @{user.username}
                </a>
              ) : (
                <p className="mt-1 text-sm font-medium text-gray-900">
                  {user?.telegramId
                    ? `Telegram ID: ${user.telegramId}`
                    : "Аккаунт Telegram"}
                </p>
              )}
            </div>
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Дата регистрации
              </p>
              <p className="mt-1 text-sm font-medium text-gray-900">
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString("ru-RU")
                  : "—"}
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button
              type="primary"
              className="px-4 py-2 text-sm font-semibold"
              onClick={() => router.push("/")}
            >
              На главную
            </Button>
            <Button
              danger
              type="default"
              onClick={handleSignOut}
              className="px-4 py-2 text-sm font-semibold"
            >
              Выйти из аккаунта
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-gray-100 bg-gradient-to-br from-blue-50 via-white to-white p-5 shadow-sm shadow-black/[0.03]">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                Pro подписка
              </h2>
              {user?.isPro ? (
                <p className="mt-2 text-sm text-gray-700">
                  Подписка активна до: без ограничений.
                </p>
              ) : (
                <p className="mt-2 text-sm text-gray-700">
                  Оформи Pro подписку, чтобы открыть все функции и ускорить прогресс.
                </p>
              )}
            </div>
            {!user?.isPro && (
              <Button
                type="primary"
                className="mt-4 px-4 py-2 text-sm font-semibold"
                onClick={() => router.push("/pro")}
              >
                Стать Pro
              </Button>
            )}
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm shadow-black/[0.03]">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
              Контакты
            </h2>
            <p className="mt-2 text-sm text-gray-700">
              Если появятся вопросы — пиши на{" "}
              <span className="font-semibold text-gray-900">
                support@preoffer.ru
              </span>{" "}
              или в чат поддержки. Мы ответим максимально быстро.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
