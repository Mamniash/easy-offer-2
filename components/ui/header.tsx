"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Button, Dropdown } from "antd";
import type { MenuProps } from "antd";

import { supabase } from "@/lib/supabaseClient";
import { isProUser } from "@/lib/subscription";
import { useAuthModal } from "@/components/ui/auth-modal-provider";

import Logo from "./logo";

type UserSummary = {
  email?: string;
  name?: string | null;
  username?: string | null;
  avatarUrl?: string | null;
  telegramId?: number | null;
};

const buildUserSummary = (
  email: string | null | undefined,
  metadata: Record<string, unknown> | null | undefined,
): UserSummary => {
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

  return {
    email: email ?? undefined,
    name:
      fullName ||
      (typeof metadata?.full_name === "string" ? metadata.full_name : null) ||
      (typeof metadata?.name === "string" ? metadata.name : null) ||
      (username ? `@${username}` : null),
    username,
    avatarUrl,
    telegramId,
  };
};

export default function Header() {
  const [user, setUser] = useState<UserSummary | null>(null);
  const [isPro, setIsPro] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isTabLoading, setIsTabLoading] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { open: openAuthModal } = useAuthModal();

  useEffect(() => {
    setIsTabLoading(false);
  }, [pathname]);

  const startTabLoading = (href: string) => {
    if (pathname === href) {
      return;
    }

    setIsTabLoading(true);
  };

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        const { email, user_metadata } = session.user;
        setUser(buildUserSummary(email, user_metadata));
        setIsPro(isProUser({ email, metadata: user_metadata }));
      }
    };

    fetchUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const { email, user_metadata } = session.user;
        setUser(buildUserSummary(email, user_metadata));
        setIsPro(isProUser({ email, metadata: user_metadata }));
      } else {
        setUser(null);
        setIsPro(false);
        setMenuOpen(false);
        setMobileMenuOpen(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsPro(false);
    setMenuOpen(false);
    setMobileMenuOpen(false);
    router.replace("/");
  };

  const fallbackAvatarSrc = "/images/avatar-placeholder.svg";

  const isHomePage = pathname === "/";
  const positionClasses = isHomePage
    ? "fixed top-2 md:top-6"
    : "relative mt-3 md:mt-4";
  const logoHref = user ? "/tracks" : "/";

  const userMenuItems = useMemo<MenuProps["items"]>(
    () => [
      {
        key: "profile",
        label: (
          <Link
            href="/profile"
            className="flex w-full items-center gap-3 rounded-xl border border-gray-100 px-3 py-2 text-sm font-medium text-gray-700 transition hover:border-gray-200 hover:bg-gray-50 hover:text-gray-900"
          >
            <svg
              className="h-4 w-4 text-gray-500"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z" />
              <path d="M4 20a8 8 0 0 1 16 0" />
            </svg>
            Профиль
          </Link>
        ),
      },
      {
        key: "logout",
        label: (
          <span className="flex w-full items-center gap-3 rounded-xl border border-red-100 px-3 py-2 text-sm font-medium text-red-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700">
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M16 17l5-5-5-5" />
              <path d="M21 12H9" />
              <path d="M12 19H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h7" />
            </svg>
            Выйти
          </span>
        ),
      },
    ],
    []
  );

  const learningMenuItems = useMemo<MenuProps["items"]>(
    () => [
      {
        key: "tracks",
        label: (
          <Link
            href="/tracks"
            onClick={() => startTabLoading("/tracks")}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:text-gray-900"
          >
            Вопросы собеседований
          </Link>
        ),
      },
      {
        key: "roadmap",
        label: (
          <Link
            href="/roadmap"
            onClick={() => startTabLoading("/roadmap")}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:text-gray-900"
          >
            Роадмапы
          </Link>
        ),
      },
      {
        key: "articles",
        label: (
          <Link
            href="/articles"
            onClick={() => startTabLoading("/articles")}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:text-gray-900"
          >
            Статьи
          </Link>
        ),
      },
    ],
    []
  );

  const practiceMenuItems = useMemo<MenuProps["items"]>(
    () => [
      {
        key: "trainer",
        label: (
          <Link
            href="/trainer"
            onClick={() => startTabLoading("/trainer")}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:text-gray-900"
          >
            Тренажер вопросов
          </Link>
        ),
      },
      {
        key: "live-coding",
        label: (
          <Link
            href="/live-code"
            onClick={() => startTabLoading("/live-code")}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:text-gray-900"
          >
            Live coding
          </Link>
        ),
      },
      {
        key: "mentors",
        label: (
          <Link
            href="/mentor"
            onClick={() => startTabLoading("/mentor")}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:text-gray-900"
          >
            IT Менторы
          </Link>
        ),
      },
    ],
    []
  );

  const handleMenuClick: MenuProps["onClick"] = ({ key }) => {
    if (key === "logout") {
      handleSignOut();
    } else {
      setMenuOpen(false);
    }
  };

  const mobileNavItems = useMemo<MenuProps["items"]>(
    () => [
      {
        key: "tracks",
        label: (
          <Link
            href="/tracks"
            onClick={() => startTabLoading("/tracks")}
            className="flex w-full items-center rounded-xl px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:text-gray-900"
          >
            Вопросы собеседований
          </Link>
        ),
      },
      {
        key: "roadmap",
        label: (
          <Link
            href="/roadmap"
            onClick={() => startTabLoading("/roadmap")}
            className="flex w-full items-center rounded-xl px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:text-gray-900"
          >
            Роадмапы
          </Link>
        ),
      },
      {
        key: "articles",
        label: (
          <Link
            href="/articles"
            onClick={() => startTabLoading("/articles")}
            className="flex w-full items-center rounded-xl px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:text-gray-900"
          >
            Статьи
          </Link>
        ),
      },
      {
        key: "trainer",
        label: (
          <Link
            href="/trainer"
            onClick={() => startTabLoading("/trainer")}
            className="flex w-full items-center rounded-xl px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:text-gray-900"
          >
            Тренажер вопросов
          </Link>
        ),
      },
      {
        key: "live-coding",
        label: (
          <Link
            href="/live-code"
            onClick={() => startTabLoading("/live-code")}
            className="flex w-full items-center rounded-xl px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:text-gray-900"
          >
            Live coding
          </Link>
        ),
      },
      {
        key: "mentors",
        label: (
          <Link
            href="/mentor"
            onClick={() => startTabLoading("/mentor")}
            className="flex w-full items-center rounded-xl px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:text-gray-900"
          >
            IT Менторы
          </Link>
        ),
      },
    ],
    []
  );

  const handleMobileMenuClick: MenuProps["onClick"] = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className={`${positionClasses} z-30 w-full`}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="relative flex h-14 items-center justify-between gap-3 rounded-2xl bg-white/90 px-3 shadow-lg shadow-black/[0.03] backdrop-blur-xs before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-transparent before:[background:linear-gradient(var(--color-gray-100),var(--color-gray-200))_border-box] before:[mask-composite:exclude_!important] before:[mask:linear-gradient(white_0_0)_padding-box,_linear-gradient(white_0_0)]">
          {/* Site branding */}
          <div className="flex flex-1 items-center gap-3">
            <Dropdown
              open={mobileMenuOpen}
              onOpenChange={setMobileMenuOpen}
              menu={{
                items: mobileNavItems,
                onClick: handleMobileMenuClick,
                className:
                  "rounded-2xl border border-gray-100 bg-white p-2 text-sm shadow-2xl shadow-black/[0.08] [&>li+li]:!mt-1",
              }}
              trigger={["click"]}
              placement="bottomLeft"
            >
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full px-1 py-2 text-gray-800 md:hidden"
                aria-label="Открыть меню навигации"
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M3 6h18" />
                  <path d="M3 12h18" />
                  <path d="M3 18h18" />
                </svg>
                <span className="text-lg font-semibold leading-none">PreOffer</span>
              </button>
            </Dropdown>
            <div className="hidden md:block">
              <Logo href={logoHref} />
            </div>
            <Dropdown
              menu={{
                items: learningMenuItems,
                className:
                  "rounded-2xl border border-gray-100 bg-white p-2 text-sm shadow-2xl shadow-black/[0.08] [&>li+li]:!mt-1",
              }}
              trigger={["click"]}
              placement="bottomLeft"
            >
              <button
                type="button"
                className="hidden items-center gap-2 rounded-full bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 hover:text-gray-900 md:inline-flex"
              >
                Обучение
                <svg
                  className="h-3 w-3 text-gray-400"
                  viewBox="0 0 12 12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="m3 4.5 3 3 3-3" />
                </svg>
              </button>
            </Dropdown>
            <Dropdown
              menu={{
                items: practiceMenuItems,
                className:
                  "rounded-2xl border border-gray-100 bg-white p-2 text-sm shadow-2xl shadow-black/[0.08] [&>li+li]:!mt-1",
              }}
              trigger={["click"]}
              placement="bottomLeft"
            >
              <button
                type="button"
                className="hidden items-center gap-2 rounded-full bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 hover:text-gray-900 md:inline-flex"
              >
                Практика
                <svg
                  className="h-3 w-3 text-gray-400"
                  viewBox="0 0 12 12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="m3 4.5 3 3 3-3" />
                </svg>
              </button>
            </Dropdown>
          </div>

          {/* Desktop navigation */}
          <div className="flex flex-1 items-center justify-end gap-3">
            {isTabLoading && (
              <div
                className="hidden items-center rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700 md:inline-flex"
                aria-label="Раздел загружается"
              >
                <span className="h-2 w-2 animate-pulse rounded-full bg-sky-500" />
              </div>
            )}
            {user ? (
              <>
                {isPro ? (
                  <span className="hidden items-center justify-center rounded-full bg-gradient-to-r from-amber-300 via-yellow-300 to-orange-300 px-4 py-2 text-xs font-semibold text-amber-900 shadow-md shadow-amber-300/40 md:inline-flex">
                    PRO
                  </span>
                ) : (
                  <Link
                    href="/pro"
                    className="hidden items-center justify-center rounded-full bg-gradient-to-r from-blue-600 via-blue-500 to-sky-400 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-blue-500/30 transition hover:from-blue-500 hover:via-blue-400 hover:to-sky-300 md:inline-flex"
                  >
                    Стать PRO
                  </Link>
                )}
                <Dropdown
                  open={menuOpen}
                  onOpenChange={setMenuOpen}
                  menu={{
                    items: userMenuItems,
                    onClick: handleMenuClick,
                    className: "rounded-2xl border-0 bg-transparent p-0",
                  }}
                  trigger={["click"]}
                  dropdownRender={(menu) => (
                    <div className="w-72 rounded-3xl border border-gray-100 bg-white p-4 text-sm shadow-2xl shadow-black/[0.08]">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 rounded-2xl bg-gray-50 px-3 py-2">
                          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-white">
                            <img
                              src={user?.avatarUrl || fallbackAvatarSrc}
                              alt={user.name || "Профиль Telegram"}
                              className="h-full w-full rounded-full object-cover"
                              onError={(event) => {
                                const target = event.currentTarget;
                                if (target.src !== fallbackAvatarSrc) {
                                  target.src = fallbackAvatarSrc;
                                }
                              }}
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-gray-900">
                              {user.name || "Telegram пользователь"}
                            </p>
                            {user.username && (
                              <p className="truncate text-xs text-gray-500">
                                @{user.username}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="space-y-2 [&>ul]:space-y-2 [&>ul]:!bg-transparent [&>ul]:!p-0">
                          {menu}
                        </div>
                      </div>
                    </div>
                  )}
                >
                  <Button
                    type="text"
                    shape="circle"
                    className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-blue-100 to-blue-200 text-lg font-semibold text-blue-800 shadow-sm ring-1 ring-inset ring-blue-100 transition hover:shadow-md hover:ring-2 hover:ring-blue-200 focus-visible:ring-2 focus-visible:ring-blue-300 !p-0"
                    aria-label="Профиль"
                  >
                    <img
                      src={user?.avatarUrl || fallbackAvatarSrc}
                      alt={user.name || "Профиль Telegram"}
                      className="h-full w-full rounded-full object-cover object-center"
                      onError={(event) => {
                        const target = event.currentTarget;
                        if (target.src !== fallbackAvatarSrc) {
                          target.src = fallbackAvatarSrc;
                        }
                      }}
                    />
                  </Button>
                </Dropdown>
              </>
            ) : (
              <Button
                type="primary"
                shape="round"
                onClick={openAuthModal}
                className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold shadow-md shadow-blue-500/30"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/15">
                  <svg
                    className="h-4 w-4 text-white"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M9.04 15.76 8.9 19.38c.39 0 .55-.17.76-.37l1.82-1.75 3.77 2.76c.69.38 1.18.18 1.36-.64l2.47-11.6c.23-1.05-.38-1.47-1.08-1.2L3.3 9.3c-1.01.4-1 1.02-.18 1.27l4.23 1.32 9.83-6.2c.46-.28.88-.13.53.2L9.04 15.76z" />
                  </svg>
                </span>
                Войти
              </Button>
            )}
          </div>
        </div>
      </div>

    </header>
  );
}
