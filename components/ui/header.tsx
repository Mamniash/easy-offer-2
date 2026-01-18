"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { supabase } from "@/lib/supabaseClient";
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
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const { open: openAuthModal } = useAuthModal();

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        const { email, user_metadata } = session.user;
        setUser(buildUserSummary(email, user_metadata));
      }
    };

    fetchUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const { email, user_metadata } = session.user;
        setUser(buildUserSummary(email, user_metadata));
      } else {
        setUser(null);
        setMenuOpen(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        menuOpen
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setMenuOpen(false);
    router.replace("/");
  };

  const userInitial =
    user?.name?.[0] || user?.username?.[0] || user?.email?.[0] || "";
  const telegramLink = user?.username
    ? `https://t.me/${user.username}`
    : undefined;

  const isHomePage = pathname === "/";
  const positionClasses = isHomePage
    ? "fixed top-2 md:top-6"
    : "relative mt-3 md:mt-4";
  const logoHref = user ? "/tracks" : "/";

  return (
    <header className={`${positionClasses} z-30 w-full`}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="relative flex h-14 items-center justify-between gap-3 rounded-2xl bg-white/90 px-3 shadow-lg shadow-black/[0.03] backdrop-blur-xs before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-transparent before:[background:linear-gradient(var(--color-gray-100),var(--color-gray-200))_border-box] before:[mask-composite:exclude_!important] before:[mask:linear-gradient(white_0_0)_padding-box,_linear-gradient(white_0_0)]">
          {/* Site branding */}
          <div className="flex flex-1 items-center">
            <Logo href={logoHref} />
          </div>

          {/* Desktop navigation */}
          <div className="flex flex-1 items-center justify-end gap-3">
            {user ? (
              <>
                <Link
                  href="/pro"
                  className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-600 via-blue-500 to-sky-400 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-blue-500/30 transition hover:from-blue-500 hover:via-blue-400 hover:to-sky-300"
                >
                  Стать PRO
                </Link>
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setMenuOpen((prev) => !prev)}
                    className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-blue-100 to-blue-200 text-lg font-semibold text-blue-800 shadow-sm ring-1 ring-inset ring-blue-100 transition hover:shadow-md"
                    aria-label="Профиль"
                  >
                    {user?.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt={user.name || "Профиль Telegram"}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      userInitial
                    )}
                  </button>

                  {menuOpen && (
                    <div className="absolute right-0 mt-3 w-64 rounded-2xl border border-gray-100 bg-white p-4 text-sm shadow-lg shadow-black/[0.04]">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-blue-600 to-blue-500 text-base font-semibold text-white shadow-sm">
                          {user?.avatarUrl ? (
                            <img
                              src={user.avatarUrl}
                              alt={user.name || "Профиль Telegram"}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            userInitial
                          )}
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-sm font-semibold text-gray-900">
                            {user.name || "Telegram пользователь"}
                          </p>
                          {telegramLink ? (
                            <a
                              href={telegramLink}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs font-medium text-blue-500 hover:text-blue-600"
                            >
                              @{user.username}
                            </a>
                          ) : (
                            <p className="text-xs text-gray-500">
                              {user?.telegramId
                                ? `Telegram ID: ${user.telegramId}`
                                : "Аккаунт Telegram"}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="mt-4 space-y-2">
                        <Link
                          href="/profile"
                          className="flex items-center justify-between rounded-lg px-3 py-2 text-gray-700 transition hover:bg-gray-50"
                          onClick={() => setMenuOpen(false)}
                        >
                          <span className="font-medium">Профиль</span>
                          <svg
                            className="h-4 w-4 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M9 5l7 7-7 7"
                            ></path>
                          </svg>
                        </Link>
                        <button
                          onClick={handleSignOut}
                          className="flex w-full items-center justify-between rounded-lg px-3 py-2 font-medium text-red-600 transition hover:bg-red-50"
                        >
                          Выйти
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M17 16l4-4m0 0l-4-4m4 4H7"
                            ></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <button
                type="button"
                onClick={openAuthModal}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500 via-sky-500 to-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-blue-500/30 transition hover:from-blue-600 hover:via-sky-500 hover:to-blue-700"
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
              </button>
            )}
          </div>
        </div>
      </div>

    </header>
  );
}
