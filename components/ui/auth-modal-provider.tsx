"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button, Modal } from "antd";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

type AuthModalContextValue = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

const AuthModalContext = createContext<AuthModalContextValue | null>(null);

const buildReturnTo = (pathname: string, searchParams: URLSearchParams) => {
  const params = new URLSearchParams(searchParams.toString());
  params.delete("login");
  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
};

const AuthModal = ({ returnTo, onClose }: { returnTo: string; onClose: () => void }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const startHref = useMemo(() => {
    const params = new URLSearchParams();
    if (returnTo) {
      params.set("returnTo", returnTo);
    }
    const query = params.toString();
    return query ? `/api/auth/telegram/start?${query}` : "/api/auth/telegram/start";
  }, [returnTo]);

  const handleTelegramClick = useCallback(() => {
    if (isSubmitting) {
      return;
    }
    setIsSubmitting(true);
    window.location.href = startHref;
  }, [isSubmitting, startHref]);

  return (
    <Modal
      open
      centered
      onCancel={onClose}
      footer={null}
      width={600}
      className="auth-modal"
    >
      <div className="px-2 py-2 text-center sm:px-6">
        <h2 className="text-2xl font-semibold text-gray-900 sm:text-3xl">
          Войдите в аккаунт
        </h2>
        <p className="mt-3 text-sm text-gray-500">
          Рекомендуем включить VPN, если вход не открывается с первого раза.
        </p>
        <Button
          type="primary"
          loading={isSubmitting}
          disabled={isSubmitting}
          onClick={handleTelegramClick}
          className="!mt-6 !inline-flex !h-auto !items-center !justify-center !gap-2 !rounded-full !bg-blue-500 !px-6 !py-3 !text-sm !font-semibold !text-white !shadow-md !shadow-blue-500/30 hover:!bg-blue-600"
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
        </Button>
        <p className="mt-6 text-xs text-gray-500">
          Не получилось войти? Напишите в&nbsp;
          <a
            className="font-medium text-blue-600 hover:text-blue-700"
            href="https://t.me/mamniash"
            target="_blank"
            rel="noreferrer"
          >
            техподдержку в Telegram
          </a>
          .
        </p>
      </div>
    </Modal>
  );
};

export const AuthModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (searchParams.get("login") === "1") {
      setIsOpen(true);
    }
  }, [searchParams]);

  const close = useCallback(() => {
    setIsOpen(false);
    if (searchParams.get("login") === "1") {
      const returnTo = buildReturnTo(pathname, searchParams);
      router.replace(returnTo, { scroll: false });
    }
  }, [pathname, router, searchParams]);

  const value = useMemo(() => ({ isOpen, open: () => setIsOpen(true), close }), [isOpen, close]);

  const returnTo = useMemo(
    () => buildReturnTo(pathname, searchParams),
    [pathname, searchParams]
  );

  return (
    <AuthModalContext.Provider value={value}>
      {children}
      {isOpen && <AuthModal returnTo={returnTo} onClose={close} />}
    </AuthModalContext.Provider>
  );
};

export const useAuthModal = () => {
  const context = useContext(AuthModalContext);
  if (!context) {
    throw new Error("useAuthModal must be used within AuthModalProvider");
  }
  return context;
};
