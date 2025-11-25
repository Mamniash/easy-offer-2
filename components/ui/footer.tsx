"use client";

import Link from "next/link";
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
  | "integrations"
  | "pricing"
  | "changelog"
  | "approach"
  | "about"
  | "careers"
  | "terms"
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

  const integrationForm = useContactForm({
    subject: "Запрос на интеграцию",
    noteLabel: "Что нужно связать",
    notePlaceholder: "Например, CRM, Slack, Telegram-бот, Webhook",
    cta: "Получить интеграцию",
  });

  const careersForm = useContactForm({
    subject: "Заявка помочь проекту",
    noteLabel: "Чем вы хотите помочь",
    notePlaceholder: "Коротко о себе и какой вклад хотите внести",
    cta: "Отправить отклик",
  });


  const formatDate = useCallback((daysAgo: number) => {
    const date = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
    return date.toLocaleDateString("ru-RU", { day: "2-digit", month: "long", year: "numeric" });
  }, []);

  const modals: FooterModal[] = useMemo(
    () => [
      {
        key: "integrations",
        title: "Интеграции",
        content: (
          <div className="space-y-4 text-sm text-gray-700">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-4 ring-1 ring-blue-100">
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-blue-700">Заявки под ключ</p>
                <p className="mt-2 leading-relaxed text-gray-900">
                  Slack, Telegram, Notion, Jira, webhooks — собираем цепочку уведомлений и доступов, чтобы ни один отклик не терялся.
                </p>
                <p className="mt-2 rounded-lg bg-white/80 px-3 py-2 text-xs text-blue-800 shadow-inner">
                  Опишете стэк — соберём схему и подключим за вас.
                </p>
              </div>
              <div className="rounded-xl bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4 ring-1 ring-indigo-100">
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-indigo-700">Сотрудничество</p>
                <p className="mt-2 leading-relaxed text-gray-900">
                  Хотите партнерство или спецусловия? Расскажите, что строите, — подберём формат.
                </p>
              </div>
            </div>
            <ContactForm form={integrationForm} sessionTime={sessionTime} />
          </div>
        ),
      },
      {
        key: "pricing",
        title: "Цены и тарифы",
        content: (
          <div className="space-y-3 text-sm text-gray-800">
            <p className="rounded-xl bg-gray-50 p-4 ring-1 ring-gray-100">
              Сравнение PRO и базовой версии появится после подключения подписки. Пока что — напишите нам, подберём конфигурацию и подскажем стоимость.
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              {["Командам до 10 человек", "Продуктовым департаментам", "Предприятиям с SSO"].map((tier) => (
                <div className="rounded-lg bg-white p-3 text-center text-xs text-gray-700 ring-1 ring-gray-100" key={tier}>
                  {tier}
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500">Плейсхолдер: здесь будет ссылка на сравнение PRO и обычной версии.</p>
          </div>
        ),
      },
      {
        key: "changelog",
        title: "История обновлений",
        content: (
          <div className="space-y-4 text-sm text-gray-800">
            <p>Короткая лестница того, что уже завезли:</p>
            <div className="relative space-y-4 pl-5 before:absolute before:left-2 before:top-1 before:h-full before:w-px before:bg-gradient-to-b before:from-blue-200 before:via-indigo-200 before:to-transparent">
              {[
                { date: formatDate(2), title: "AI-симуляции собеседований", text: "Подготовка Junior и Middle: добавили тренажёры с обратной связью и примерами ответов." },
                { date: formatDate(7), title: "Экспорт вопросов", text: "Собрали выгрузку в CSV и Markdown, чтобы делиться планом подготовки." },
                { date: formatDate(14), title: "Обновлённые подборки", text: "Пересчитали топ-вопросы по профессиям и грейдам, убрали устаревшие темы." },
              ].map((item, index) => (
                <div className="flex items-start gap-3" key={item.title}>
                  <span
                    className={`mt-1 h-3 w-3 rounded-full ${index === 0 ? "bg-blue-500" : index === 1 ? "bg-indigo-500" : "bg-emerald-500"} ring-4 ring-white shadow-md shadow-blue-100`}
                    style={{ marginLeft: index % 2 === 0 ? "0" : "6px" }}
                  />
                  <div className="w-full rounded-xl bg-white p-4 ring-1 ring-gray-100">
                    <p className="text-xs font-semibold uppercase tracking-[0.08em] text-gray-500">{item.date}</p>
                    <p className="mt-1 font-semibold text-gray-900">{item.title}</p>
                    <p className="mt-1 text-gray-700">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ),
      },
      {
        key: "approach",
        title: "Наш подход",
        content: (
          <div className="space-y-3 text-sm text-gray-800">
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl bg-white p-4 ring-1 ring-gray-100">
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-blue-700">Фокус на вероятности</p>
                <p className="mt-1 leading-relaxed">Смотрим, что реально спрашивают сейчас, а не два года назад. Экономим время на повторении лишнего.</p>
              </div>
              <div className="rounded-xl bg-white p-4 ring-1 ring-gray-100">
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-emerald-700">Практика → уверенность</p>
                <p className="mt-1 leading-relaxed">Карточки с ответами, видео и симуляции, чтобы вы могли проговорить решение до собеседования.</p>
              </div>
              <div className="rounded-xl bg-white p-4 ring-1 ring-gray-100">
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-indigo-700">Без хаоса</p>
                <p className="mt-1 leading-relaxed">Единая карта подготовки: где пробелы, что повторить, и как закрыть 80% вероятных вопросов.</p>
              </div>
            </div>
            <p className="rounded-xl bg-gradient-to-r from-slate-50 via-white to-slate-100 p-4 text-gray-800 ring-1 ring-gray-100">
              Платформа построена для Junior и Middle специалистов: меньше случайных материалов, больше точечных подсказок и структурированной практики.
            </p>
          </div>
        ),
      },
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
        key: "terms",
        title: "Условия сервиса",
        content: (
          <div className="space-y-3 text-sm text-gray-800">
            <p className="rounded-xl bg-white p-4 ring-1 ring-gray-100">
              Подписываем DPA, соблюдаем 152-ФЗ и GDPR. Храним бэкапы раздельно, ведём аудит действий и отдаём экспорт данных по запросу пользователя.
            </p>
            <ul className="space-y-2 rounded-xl bg-slate-50 p-4 ring-1 ring-slate-100">
              <li className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-indigo-500" />
                <p>Удаляем данные по запросу и показываем историю входов и действий в личном кабинете.</p>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-indigo-500" />
                <p>Шифруем в транзите и на хранении, доступ по принципу наименьших прав.</p>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-indigo-500" />
                <p>Регулярно проводим проверки безопасности и реагируем на репорты в течение рабочего дня.</p>
              </li>
            </ul>
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
    [careersForm, formatDate, integrationForm, sessionTime, vulnerabilityForm],
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
            <h3 className="text-sm font-medium">Продукт</h3>
            <ul className="space-y-2 text-sm">
              {renderLink("Интеграции", "integrations")}
              {renderLink("Цены и тарифы", "pricing")}
              {renderLink("История обновлений", "changelog")}
            </ul>
          </div>

          {/* 3rd block */}
          <div className="space-y-2 sm:col-span-6 md:col-span-3 lg:col-span-2">
            <h3 className="text-sm font-medium">Подход</h3>
            <ul className="space-y-2 text-sm">
              {renderLink("Наш подход", "approach")}
              {renderLink("О нас", "about")}
              {renderLink("Помочь проекту", "careers")}
            </ul>
          </div>

          {/* 4th block */}
          <div className="space-y-2 sm:col-span-6 md:col-span-3 lg:col-span-2">
            <h3 className="text-sm font-medium">Ресурсы</h3>
            <ul className="space-y-2 text-sm">
              {renderLink("Условия сервиса", "terms")}
              {renderLink("Сообщить об уязвимости", "vulnerability")}
            </ul>
          </div>

          {/* 5th block */}
          <div className="space-y-2 sm:col-span-6 md:col-span-3 lg:col-span-2">
            <h3 className="text-sm font-medium">Соцсети</h3>
            <ul className="flex gap-3">
              {[{ label: "Github", href: "https://github.com" }, { label: "Telegram", href: "https://t.me" }, { label: "VK", href: "https://vk.com" }].map((item) => (
                <li key={item.label}>
                  <Link
                    className="group flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-700 transition hover:border-gray-300 hover:text-gray-900"
                    href={item.href}
                    aria-label={item.label}
                  >
                    {item.label === "Github" && (
                      <svg className="h-6 w-6 fill-current transition group-hover:scale-105" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16 8.2c-4.4 0-8 3.6-8 8 0 3.5 2.3 6.5 5.5 7.6.4.1.5-.2.5-.4V22c-2.2.5-2.7-1-2.7-1-.4-.9-.9-1.2-.9-1.2-.7-.5.1-.5.1-.5.8.1 1.2.8 1.2.8.7 1.3 1.9.9 2.3.7.1-.5.3-.9.5-1.1-1.8-.2-3.6-.9-3.6-4 0-.9.3-1.6.8-2.1-.1-.2-.4-1 .1-2.1 0 0 .7-.2 2.2.8.6-.2 1.3-.3 2-.3s1.4.1 2 .3c1.5-1 2.2-.8 2.2-.8.4 1.1.2 1.9.1 2.1.5.6.8 1.3.8 2.1 0 3.1-1.9 3.7-3.7 3.9.3.4.6.9.6 1.6v2.2c0 .2.1.5.6.4 3.2-1.1 5.5-4.1 5.5-7.6-.1-4.4-3.7-8-8.1-8z"></path>
                      </svg>
                    )}
                    {item.label === "Telegram" && (
                      <svg className="h-6 w-6 fill-current transition group-hover:scale-105" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                        <path d="M27.6 6.2 4.3 15.1c-1.6.6-1.5 1.5-.3 1.9l5.8 1.8 2.2 6.7c.3.9.6 1.2 1.2 1.2.8 0 1.1-.3 1.6-.8l3.8-3.7 6 4.4c1.1.6 1.8.3 2-1l3.6-17.6c.4-1.5-.6-2.2-1.6-1.8Zm-15 16.3-1.4-4.6 10.6-8.1c.5-.3 1-.2.6.2l-8.9 8.2 1.1 3.3-1.9 1z"></path>
                      </svg>
                    )}
                    {item.label === "VK" && (
                      <svg className="h-6 w-6 fill-current transition group-hover:scale-105" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                        <path d="M26.7 10.4c.2-.6 0-.9-.8-.9h-2.7c-.7 0-1 .3-1.2.6 0 0-1.4 3.3-3.3 5.4-.62.61-.9.8-1.2.8-.2 0-.4-.19-.4-.7V10c0-.7-.2-1-.8-1H12c-.5 0-.8.3-.8.6 0 .7 1 .8 1 .8.5 0 .6.2.6.7v3.4c0 .8-.1.9-.3.9-.9 0-3.1-3.4-4.4-7.2-.2-.6-.4-.8-1.1-.8H4.3c-.7 0-.8.3-.8.6 0 .7.9 4.2 4.2 8.8C10 20.5 13.2 22 15.8 22c1.2 0 1.3-.3 1.3-.8v-1.8c0-.6.1-.7.6-.7.4 0 1.1.2 2.7 1.5 1.8 1.6 2.1 2.3 3.1 2.3h2.7c.7 0 1.1-.3.9-1 0-.8-1.2-2-2.5-3.4-.6-.7-1.6-1.5-1.9-1.9-.4-.5-.3-.7 0-1.2-.1-.1 3-4.2 3.3-5.6Z"></path>
                      </svg>
                    )}
                  </Link>
                </li>
              ))}
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
