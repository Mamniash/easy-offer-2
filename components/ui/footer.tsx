"use client";

import { FormEvent, ReactNode, useCallback, useEffect, useMemo, useState } from "react";

import { canSendMessage, sendToTelegram } from "@/lib/telegram";
import Logo from "./logo";

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

type FooterKey =
  | "public-offer"
  | "privacy"
  | "about"
  | "careers"
  | "vulnerability";

type FooterModal = {
  key: FooterKey;
  title: string;
  content: ReactNode;
};

const ContactForm = ({ form, sessionTime }: { form: ReturnType<typeof useContactForm>; sessionTime: number }) => {
  const controlId = form.subject.toLowerCase().replace(/[^a-z0-9]+/gi, "-");

  return (
    <form className="space-y-3" onSubmit={(event) => form.handleSubmit(event, sessionTime)}>
      <div className="space-y-1">
        <label className="text-xs font-medium text-gray-800" htmlFor={`${controlId}-contact`}>
          Контакт для связи
        </label>
        <input
          className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
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
        <input
          className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
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
        <textarea
          className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          id={`${controlId}-note`}
          name="note"
          onChange={(event) => form.setNote(event.target.value)}
          placeholder={form.notePlaceholder}
        required
        rows={3}
        value={form.note}
      />
    </div>
    <button
      className="inline-flex w-full items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-60"
      disabled={form.loading}
      type="submit"
    >
      {form.loading ? "Отправляем..." : form.cta}
    </button>
    {form.status ? <p className="text-xs text-gray-600">{form.status}</p> : null}
  </form>
  );
};

const useFooterModals = (sessionTime: number) => {
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


  const modals: FooterModal[] = useMemo(
    () => [
      {
        key: "about",
        title: "О нас",
        content: (
          <div className="space-y-3 text-sm text-gray-800">
            <p className="rounded-xl bg-white p-4 ring-1 ring-gray-100">
              PreOffer — команда, которая превращает подготовку к собеседованиям в понятную систему. Мы собираем реальные вопросы от IT-компаний и показываем, что спросится с наибольшей вероятностью.
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="rounded-lg bg-sky-50 p-3 text-xs text-sky-800 ring-1 ring-sky-100">Работаем удалённо, встречаемся с сообществом онлайн.</div>
              <div className="rounded-lg bg-amber-50 p-3 text-xs text-amber-800 ring-1 ring-amber-100">Персонализируем рекомендации под профессию, грейд и тип компании.</div>
            </div>
          </div>
        ),
      },
      {
        key: "careers",
        title: "Помочь проекту",
        content: (
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
        ),
      },
      {
        key: "public-offer",
        title: "Договор публичной оферты",
        content: (
          <div className="space-y-3 text-sm text-gray-800">
            <p className="rounded-xl bg-white p-4 ring-1 ring-gray-100">
              Настоящий договор регулирует порядок оказания сервисов PreOffer и заключается путём принятия условий оферты. Оплачивая доступ или продолжая пользоваться платформой, пользователь подтверждает согласие с документом.
            </p>
            <div className="space-y-2 rounded-xl bg-slate-50 p-4 ring-1 ring-slate-100">
              <p className="text-sm font-semibold text-gray-900">Основные положения</p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-indigo-500" />
                  <p>Исполнитель: ООО «PreOffer». Заказчик: пользователь, принявший условия и оплативший доступ.</p>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-indigo-500" />
                  <p>Предмет: предоставление доступа к платформе, обучающим материалам и сервисам подготовки к собеседованиям.</p>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-indigo-500" />
                  <p>Оплата: по выбранному тарифу на сайте. Стоимость может обновляться, при этом действующий оплаченный период сохраняется.</p>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-indigo-500" />
                  <p>Начало оказания услуг: с момента активации личного кабинета или оплаты, если требуется подписка.</p>
                </li>
              </ul>
            </div>
            <div className="space-y-2 rounded-xl bg-white p-4 ring-1 ring-gray-100">
              <p className="text-sm font-semibold text-gray-900">Права и обязанности</p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-indigo-500" />
                  <p>Мы поддерживаем доступность сервиса и уведомляем об обновлениях, можем временно приостановить работу для техподдержки.</p>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-indigo-500" />
                  <p>Пользователь обязуется соблюдать авторские права, не передавать доступ третьим лицам и не использовать сервис для противоправных целей.</p>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-indigo-500" />
                  <p>Возврат средств возможен в случаях, предусмотренных законодательством РФ и политикой возврата сервиса.</p>
                </li>
              </ul>
            </div>
            <p className="rounded-xl bg-slate-50 p-4 text-sm text-gray-700 ring-1 ring-slate-100">
              Подробные условия, сроки оказания услуг, ответственность сторон и порядок расторжения оферты доступны по запросу в службе поддержки PreOffer.
            </p>
          </div>
        ),
      },
      {
        key: "privacy",
        title: "Политика конфиденциальности",
        content: (
          <div className="space-y-3 text-sm text-gray-800">
            <p className="rounded-xl bg-white p-4 ring-1 ring-gray-100">
              Мы обрабатываем персональные данные, чтобы предоставлять доступ к платформе, улучшать сервис и выполнять требования закона. Используемые данные защищены организационными и техническими мерами.
            </p>
            <div className="space-y-2 rounded-xl bg-slate-50 p-4 ring-1 ring-slate-100">
              <p className="text-sm font-semibold text-gray-900">Что собираем</p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-indigo-500" />
                  <p>Контакты и учётные данные: имя, email, телефон, логины в мессенджерах.</p>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-indigo-500" />
                  <p>Технические данные: файлы cookie, информация об устройстве, IP-адрес и события использования сервиса.</p>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-indigo-500" />
                  <p>Данные для оплаты и активации подписки, если это требуется для доступа.</p>
                </li>
              </ul>
            </div>
            <div className="space-y-2 rounded-xl bg-white p-4 ring-1 ring-gray-100">
              <p className="text-sm font-semibold text-gray-900">Как используем</p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-indigo-500" />
                  <p>Создание и поддержка аккаунта, коммуникация по сервису и обработка запросов в поддержку.</p>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-indigo-500" />
                  <p>Улучшение платформы за счёт аналитики использования и обезличенных данных.</p>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-indigo-500" />
                  <p>Соблюдение требований законодательства, включая 152-ФЗ и GDPR, если применимо.</p>
                </li>
              </ul>
            </div>
            <p className="rounded-xl bg-slate-50 p-4 text-sm text-gray-700 ring-1 ring-slate-100">
              Пользователь может запросить доступ, исправление или удаление своих данных через поддержку. Вопросы по обработке персональных данных принимаются на почту privacy@preoffer.ru.
            </p>
          </div>
        ),
      },
      {
        key: "vulnerability",
        title: "Сообщить об уязвимости",
        content: (
          <div className="space-y-4 text-sm text-gray-800">
            <p>Сообщите о проблеме — мы вернёмся с обновлением статуса или фиксом. Благодарим за внимание к безопасности.</p>
            <ContactForm form={vulnerabilityForm} sessionTime={sessionTime} />
          </div>
        ),
      },
    ],
    [careersForm, sessionTime, vulnerabilityForm],
  );
  return { modals };
};

export default function Footer({ border = false }: { border?: boolean }) {
  const [activeModal, setActiveModal] = useState<FooterModal | null>(null);
  const [sessionStart, setSessionStart] = useState<number | null>(null);

  useEffect(() => {
    setSessionStart(Date.now());
  }, []);

  const sessionTime = sessionStart ? Math.round((Date.now() - sessionStart) / 1000) : 0;
  const { modals } = useFooterModals(sessionTime);

  const openModal = (key: FooterKey) => {
    const modal = modals.find((item) => item.key === key) || null;
    setActiveModal(modal);
  };

  const closeModal = () => setActiveModal(null);

  const renderLink = (label: string, key: FooterKey) => (
    <li>
      <button
        className="text-left text-gray-600 transition hover:text-gray-900"
        onClick={() => openModal(key)}
        type="button"
      >
        {label}
      </button>
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
          </div>

          {/* 2nd block */}
          <div className="space-y-2 sm:col-span-6 md:col-span-3 lg:col-span-2">
            <h3 className="text-sm font-medium">Документы</h3>
            <ul className="space-y-2 text-sm">
              {renderLink("Договор публичной оферты", "public-offer")}
              {renderLink("Политика конфиденциальности", "privacy")}
            </ul>
          </div>

          {/* 3rd block */}
          <div className="space-y-2 sm:col-span-6 md:col-span-3 lg:col-span-2">
            <h3 className="text-sm font-medium">Ресурсы</h3>
            <ul className="space-y-2 text-sm">
              {renderLink("О нас", "about")}
              {renderLink("Помочь проекту", "careers")}
              {renderLink("Сообщить об уязвимости", "vulnerability")}
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

      {activeModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.08em] text-blue-600">Футер</p>
                <h3 className="text-lg font-semibold text-gray-900">{activeModal.title}</h3>
              </div>
              <button
                aria-label="Закрыть"
                className="rounded-full p-1 text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
                onClick={closeModal}
                type="button"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M6 18 18 6m0 12L6 6"></path>
                </svg>
              </button>
            </div>
            <div className="max-h-[60vh] space-y-3 overflow-y-auto pr-1 text-left">
              {activeModal.content}
            </div>
          </div>
        </div>
      ) : null}
    </footer>
  );
}
