"use client";

import { Fragment, useEffect, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User } from "@supabase/supabase-js";

import { supabase } from "@/lib/supabaseClient";

import Logo from "./logo";

function classNames(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function AvatarCircle({ label }: { label: string }) {
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold uppercase text-white shadow-sm">
      {label}
    </div>
  );
}

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;

    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      setUser(data.session?.user ?? null);
      setLoading(false);
    };

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!mounted) return;
        setUser(session?.user ?? null);
      },
    );

    getSession();

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const displayName =
    user?.user_metadata?.name ||
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "Гость";

  const userInitial = displayName.slice(0, 1).toUpperCase();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push("/");
  };

  return (
    <header className="fixed top-2 z-30 w-full md:top-6">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="relative flex h-14 items-center justify-between gap-3 rounded-2xl bg-white/90 px-3 shadow-lg shadow-black/[0.03] backdrop-blur-xs before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-transparent before:[background:linear-gradient(var(--color-gray-100),var(--color-gray-200))_border-box] before:[mask-composite:exclude_!important] before:[mask:linear-gradient(white_0_0)_padding-box,_linear-gradient(white_0_0)]">
          {/* Site branding */}
          <div className="flex flex-1 items-center">
            <Logo />
          </div>

          <div className="flex flex-1 items-center justify-end">
            {loading ? (
              <div className="h-10 w-24 rounded-xl bg-gray-200/80 shadow-inner animate-pulse" />
            ) : user ? (
              <Menu as="div" className="relative inline-block text-left">
                <div className="flex items-center gap-2">
                  <p className="hidden text-sm text-gray-600 sm:block">Привет, {displayName}</p>
                  <Menu.Button className="flex items-center gap-2 rounded-xl bg-white px-2 py-1 shadow-sm ring-1 ring-gray-200 transition hover:ring-gray-300">
                    <AvatarCircle label={userInitial} />
                  </Menu.Button>
                </div>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 mt-3 w-72 origin-top-right divide-y divide-gray-100 rounded-2xl bg-white p-2 shadow-xl ring-1 ring-black/5 focus:outline-none">
                    <div className="rounded-xl bg-gray-50 px-3 py-3">
                      <p className="text-sm font-semibold text-gray-900">{displayName}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                      <p className="mt-1 text-xs text-gray-500">Личный кабинет всегда под рукой.</p>
                    </div>
                    <div className="py-2">
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            href="/profile"
                            className={classNames(
                              "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium",
                              active
                                ? "bg-blue-50 text-blue-700"
                                : "text-gray-800 hover:bg-gray-50",
                            )}
                          >
                            Профиль
                            <span className="text-xs text-gray-500">Детали аккаунта</span>
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            type="button"
                            onClick={handleSignOut}
                            className={classNames(
                              "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium",
                              active
                                ? "bg-red-50 text-red-700"
                                : "text-gray-800 hover:bg-gray-50",
                            )}
                          >
                            Выйти
                            <span className="text-xs text-gray-500">Завершить сессию</span>
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            ) : (
              <ul className="flex items-center gap-3">
                <li>
                  <Link
                    href="/signin"
                    className="btn-sm bg-white text-gray-800 shadow-sm hover:bg-gray-50"
                  >
                    Войти
                  </Link>
                </li>
                <li>
                  <Link
                    href="/signup"
                    className="btn-sm bg-gray-800 text-gray-200 shadow-sm hover:bg-gray-900"
                  >
                    Зарегистрироваться
                  </Link>
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
