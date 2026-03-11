"use client";

import { Button, Input, Modal } from "antd";
import Link from "next/link";
import { FormEvent, useCallback, useEffect, useState } from "react";

import { canSendMessage, sendToTelegram } from "@/lib/telegram";
import Logo from "./logo";
import { legalDocuments } from "./legal-documents";

const useContactForm = ({
  subject,
  noteLabel,
  notePlaceholder,
  cta = "Отправить",
}: {
  subject: string;
  noteLabel: string;
  notePlaceholder: string;
  cta?: string;
}) => {
  const [contact, setContact] = useState("");
  const [location, setLocation] = useState("");
  const [note, setNote] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>, sessionTime: number) => {
      event.preventDefault();

      if (!canSendMessage()) {
        setStatus("Мы уже получили ваш запрос — попробуйте через минуту.");
        return;
      }

      setStatus(null);
      setLoading(true);
      const ok = await sendToTelegram({ subject, contact, location, note, sessionTime });
      setLoading(false);

      if (ok) {
        setStatus("Спасибо! Мы свяжемся с вами в ближайшее время.");
        setContact("");
        setLocation("");
        setNote("");
        return;
      }

      setStatus("Не удалось отправить сообщение. Попробуйте ещё раз позже.");
    },
    [contact, location, note, subject],
  );

  return {
    cta,
    contact,
    handleSubmit,
    location,
    loading,
    note,
    noteLabel,
    notePlaceholder,
    subject,
    setContact,
    setLocation,
    setNote,
    status,
  };
};

type FooterKey = "about" | "careers" | "vulnerability";

const ContactForm = ({ form, sessionTime }: { form: ReturnType<typeof useContactForm>; sessionTime: number }) => {
  const controlId = form.subject.toLowerCase().replace(/[^a-z0-9]+/gi, "-");

  return (
    <form className="space-y-3" onSubmit={(event) => form.handleSubmit(event, sessionTime)}>
      <div className="space-y-1">
        <label className="text-xs font-medium text-gray-800" htmlFor={`${controlId}-contact`}>
          Контакт для связи
        </label>
        <Input
          className="w-full !rounded-md"
          id={`${controlId}-contact`}
          name="contact"
          onChange={(event) => form.setContact(event.target.value)}
          placeholder="Телеграм, почта или телефон"
          required
          type="text"
          value={form.contact}
        />
      </div>
      <div className="space-y-1">
        <label className="text-xs font-medium text-gray-800" htmlFor={`${controlId}-location`}>
          Город или часовой пояс
        </label>
        <Input
          className="w-full !rounded-md"
          id={`${controlId}-location`}
          name="location"
          onChange={(event) => form.setLocation(event.target.value)}
          placeholder="Например, Москва или GMT+3"
          required
          type="text"
          value={form.location}
        />
      </div>
      <div className="space-y-1">
        <label className="text-xs font-medium text-gray-800" htmlFor={`${controlId}-note`}>
          {form.noteLabel}
        </label>
        <Input.TextArea
          className="w-full !rounded-md"
          id={`${controlId}-note`}
          name="note"
          onChange={(event) => form.setNote(event.target.value)}
          placeholder={form.notePlaceholder}
          required
          rows={3}
          value={form.note}
        />
      </div>
      <Button
        className="w-full"
        disabled={form.loading}
        loading={form.loading}
        type="primary"
        htmlType="submit"
      >
        {form.cta}
      </Button>
      {form.status ? <p className="text-xs text-gray-600">{form.status}</p> : null}
    </form>
  );
};

export default function Footer({ border = false }: { border?: boolean }) {
  const [activeModalKey, setActiveModalKey] = useState<FooterKey | null>(null);
  const [sessionStart, setSessionStart] = useState<number | null>(null);
  const telegramUrl = "https://t.me/preoffer1";
  const supportTelegramUrl = "https://t.me/mamniash";

  useEffect(() => {
    setSessionStart(Date.now());
  }, []);

  const vulnerabilityForm = useContactForm({
    subject: "Сообщение об уязвимости",
    noteLabel: "Опишите проблему",
    notePlaceholder: "Где нашли уязвимость, шаги воспроизведения",
  });

  const careersForm = useContactForm({
    subject: "Заявка помочь проекту",
    noteLabel: "Чем вы хотите помочь",
    notePlaceholder: "Коротко о себе и какой вклад хотите внести",
    cta: "Отправить отклик",
  });

  const sessionTime = sessionStart ? Math.round((Date.now() - sessionStart) / 1000) : 0;
  const isModalOpen = Boolean(activeModalKey);

  const openModal = (key: FooterKey) => {
    setActiveModalKey(key);
  };

  const closeModal = () => setActiveModalKey(null);

  const modalTitleByKey: Record<FooterKey, string> = {
    about: "О нас",
    careers: "Помочь проекту",
    vulnerability: "Сообщить об уязвимости",
  };

  const renderModalContent = () => {
    if (activeModalKey === "about") {
      return (
        <div className="space-y-3 text-sm text-gray-800">
          <p className="rounded-xl bg-white p-4 ring-1 ring-gray-100">
            PreOffer — команда, которая превращает подготовку к собеседованиям в понятную систему. Мы собираем реальные вопросы от IT-компаний и показываем, что спросится с наибольшей вероятностью.
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="rounded-lg bg-sky-50 p-3 text-xs text-sky-800 ring-1 ring-sky-100">Работаем удалённо, встречаемся с сообществом онлайн.</div>
            <div className="rounded-lg bg-amber-50 p-3 text-xs text-amber-800 ring-1 ring-amber-100">Персонализируем рекомендации под профессию, грейд и тип компании.</div>
          </div>
        </div>
      );
    }

    if (activeModalKey === "careers") {
      return (
        <div className="space-y-4 text-sm text-gray-800">
          <div className="rounded-xl bg-gradient-to-r from-purple-50 via-white to-pink-50 p-4 ring-1 ring-purple-100">
            <p className="font-semibold text-purple-900">Хотите поучаствовать?</p>
            <p className="mt-2 leading-relaxed">
              Откликаются разработчики, продакт-менеджеры и менторы, которые помогают сделать подготовку к собеседованиям честной и понятной.
            </p>
            <p className="mt-2 text-xs text-purple-800">Расскажите о себе — мы вернёмся с идеями, где ваш опыт будет полезен.</p>
          </div>
          <ContactForm form={careersForm} sessionTime={sessionTime} />
        </div>
      );
    }

    if (activeModalKey === "vulnerability") {
      return (
        <div className="space-y-4 text-sm text-gray-800">
          <p>Сообщите о проблеме — мы вернёмся с обновлением статуса или фиксом. Благодарим за внимание к безопасности.</p>
          <ContactForm form={vulnerabilityForm} sessionTime={sessionTime} />
        </div>
      );
    }

    return null;
  };

  const renderModalLink = (label: string, key: FooterKey) => (
    <li>
      <Button
        className="!p-0 !text-left text-gray-600 transition hover:!text-gray-900"
        onClick={() => openModal(key)}
        type="link"
      >
        {label}
      </Button>
    </li>
  );

  const renderDocumentLink = (label: string, href: string) => (
    <li>
      <Link className="text-gray-600 transition hover:text-gray-900" href={href}>
        {label}
      </Link>
    </li>
  );

  return (
    <footer>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Top area: Blocks */}
        <div
          className={`grid gap-10 py-8 sm:grid-cols-12 md:py-12 ${border ? "border-t [border-image:linear-gradient(to_right,transparent,var(--color-slate-200),transparent)1]" : ""}`}
        >
          {/* 1st block */}
          <div className="space-y-2 sm:col-span-12 lg:col-span-4">
            <div>
              <Logo />
            </div>
            <div className="text-sm text-gray-600">&copy; PreOffer — Все права защищены.</div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <span>Мы в Telegram</span>
              <a
                aria-label="PreOffer в Telegram"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition hover:border-sky-200 hover:text-sky-600"
                href={telegramUrl}
                rel="noreferrer"
                target="_blank"
              >
                <svg
                  aria-hidden="true"
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.04c-5.52 0-9.99 4.47-9.99 9.98 0 5.52 4.47 10 9.99 10s9.99-4.48 9.99-10c0-5.51-4.47-9.98-9.99-9.98Zm4.91 6.85-1.64 7.72c-.13.55-.46.69-.93.43l-2.57-1.9-1.24 1.2c-.14.14-.26.26-.52.26l.19-2.69 4.9-4.42c.21-.2-.05-.3-.33-.12l-6.06 3.81-2.61-.82c-.57-.18-.58-.57.12-.84l10.22-3.94c.48-.18.89.11.47 1.31Z" />
                </svg>
              </a>
            </div>
          </div>

          {/* 2nd block */}
          <div className="space-y-2 sm:col-span-6 md:col-span-3 lg:col-span-2">
            <h3 className="text-sm font-medium">Компания</h3>
            <ul className="space-y-2 text-sm">
              {renderModalLink("О нас", "about")}
            </ul>
          </div>

          {/* 3rd block */}
          <div className="space-y-2 sm:col-span-6 md:col-span-3 lg:col-span-2">
            <h3 className="text-sm font-medium">Поддержка</h3>
            <ul className="space-y-2 text-sm">
              {renderModalLink("Помочь проекту", "careers")}
              {renderModalLink("Сообщить об уязвимости", "vulnerability")}
              <li>
                <a
                  className="text-gray-600 transition hover:text-gray-900"
                  href={supportTelegramUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Техподдержка в Telegram
                </a>
              </li>
            </ul>
          </div>

          {/* 4th block */}
          <div className="space-y-2 sm:col-span-6 md:col-span-3 lg:col-span-2">
            <h3 className="text-sm font-medium">Документы</h3>
            <ul className="space-y-2 text-sm">
              {renderDocumentLink(legalDocuments["public-offer"].title, "/documents/public-offer")}
              {renderDocumentLink(legalDocuments.privacy.title, "/documents/privacy")}
            </ul>
          </div>
        </div>
      </div>

      {/* Big text */}
      <div className="relative -mt-16 h-60 w-full" aria-hidden="true">
        <div className="pointer-events-none absolute left-1/2 -z-10 -translate-x-1/2 text-center text-[348px] font-bold leading-none before:bg-linear-to-b before:from-gray-200 before:to-gray-100/30 before:to-80% before:bg-clip-text before:text-transparent before:content-['Просто'] after:absolute after:inset-0 after:bg-gray-300/70 after:bg-clip-text after:text-transparent after:mix-blend-darken after:content-['Просто'] after:[text-shadow:0_1px_0_white]"></div>
        {/* Glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-2/3" aria-hidden="true">
          <div className="h-56 w-56 rounded-full border-[20px] border-blue-700 blur-[80px]"></div>
        </div>
      </div>

      <Modal
        open={isModalOpen}
        centered
        onCancel={closeModal}
        footer={null}
        width={520}
        title={
          activeModalKey ? (
            <div>
              <p className="text-xs uppercase tracking-[0.08em] text-blue-600">Футер</p>
              <h3 className="text-lg font-semibold text-gray-900">{modalTitleByKey[activeModalKey]}</h3>
            </div>
          ) : null
        }
        styles={{
          body: {
            maxHeight: "60vh",
            overflowY: "auto",
            paddingRight: "0.25rem",
          },
        }}
      >
        <div className="text-left">{renderModalContent()}</div>
      </Modal>
    </footer>
  );
}
