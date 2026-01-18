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
        <p className="mt-3 text-sm text-gray-600 sm:text-base">
          Для продолжения нужно авторизоваться через Telegram.
        </p>
        <Button
          type="primary"
          loading={isSubmitting}
          disabled={isSubmitting}
          onClick={handleTelegramClick}
          className="!mt-6 !inline-flex !h-auto !items-center !justify-center !gap-2 !rounded-full !bg-blue-500 !px-6 !py-3 !text-sm !font-semibold !text-white !shadow-md !shadow-blue-500/30 hover:!bg-blue-600"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15">
            <img
              src="/images/tgLogo.svg"
              alt="Telegram"
              className="h-4 w-4"
            />
          </span>
          Войти через Telegram
        </Button>
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
