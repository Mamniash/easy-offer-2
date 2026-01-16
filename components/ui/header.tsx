"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { supabase } from "@/lib/supabaseClient";

import Logo from "./logo";

type UserSummary = {
  email: string;
  name?: string | null;
};

export default function Header() {
  const [user, setUser] = useState<UserSummary | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        const { email, user_metadata } = session.user;
        setUser({
          email: email ?? "",
          name: user_metadata?.full_name || user_metadata?.name,
        });
      }
    };

    fetchUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const { email, user_metadata } = session.user;
        setUser({
          email: email ?? "",
          name: user_metadata?.full_name || user_metadata?.name,
        });
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

  const userInitial = user?.name?.[0] || user?.email?.[0] || "";

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
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-blue-200 text-lg font-semibold text-blue-800 shadow-sm ring-1 ring-inset ring-blue-100 transition hover:shadow-md"
                  aria-label="Профиль"
                >
                  {userInitial}
                </button>

                {menuOpen && (
                  <div className="absolute right-0 mt-3 w-64 rounded-2xl border border-gray-100 bg-white p-4 text-sm shadow-lg shadow-black/[0.04]">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-blue-500 text-base font-semibold text-white shadow-sm">
                        {userInitial}
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-sm font-semibold text-gray-900">
                          {user.name || "Гость"}
                        </p>
                        <p className="text-xs text-gray-500">{user.email}</p>
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
                onClick={() => setLoginOpen(true)}
                className="inline-flex items-center gap-2 rounded-full bg-blue-500 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-blue-500/30 transition hover:bg-blue-600"
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

      {loginOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6"
          role="dialog"
          aria-modal="true"
          onClick={() => setLoginOpen(false)}
        >
          <div
            className="w-full max-w-xl rounded-2xl bg-white px-6 py-8 text-center shadow-xl sm:px-10"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1" />
              <button
                type="button"
                onClick={() => setLoginOpen(false)}
                className="rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
                aria-label="Закрыть"
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 sm:text-3xl">
              Войдите в аккаунт
            </h2>
            <p className="mt-3 text-sm text-gray-600 sm:text-base">
              Для продолжения нужно авторизоваться через Telegram.
            </p>
            <Link
              href="/api/auth/telegram/start"
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-blue-500 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-blue-500/30 transition hover:bg-blue-600"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15">
                <svg
                  className="h-4 w-4 text-white"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M9.04 15.76 8.9 19.38c.39 0 .55-.17.76-.37l1.82-1.75 3.77 2.76c.69.38 1.18.18 1.36-.64l2.47-11.6c.23-1.05-.38-1.47-1.08-1.2L3.3 9.3c-1.01.4-1 1.02-.18 1.27l4.23 1.32 9.83-6.2c.46-.28.88-.13.53.2L9.04 15.76z" />
                </svg>
              </span>
              Войти через Telegram
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
