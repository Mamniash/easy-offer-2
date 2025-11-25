"use client";

import Link from "next/link";
import {
  FormEvent,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import Logo from "./logo";

const RATE_LIMIT_TIMEOUT = 60 * 1000; // 60 секунд

const sendToTelegram = async (
  contact: string,
  location: string,
  sessionTime: number,
) => {
  const botToken = "8161696582:AAHZxsaPggaUncruMMoG1pIjTXleCNAUWTw";
  const chatId = "-1002271508122";
  const threadId = 267; // ID темы "0→1 ответы на лендинг"

  const message = `
🔗 Запрос гайда для новых ИП!
✉️ Контакт: ${contact}
📍 Город: ${location}
⏱ Время на сайте: ${sessionTime} сек.
  `.trim();

  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        message_thread_id: threadId,
      }),
    });

    const data = await response.json();
    return data.ok;
  } catch (error) {
    console.error("Ошибка при отправке в Telegram:", error);
    return false;
  }
};

const canSendMessage = () => {
  const now = Date.now();

  if (typeof window === "undefined") {
    return false;
  }

  const lastSent = window.localStorage.getItem("lastSent");

  if (lastSent && now - Number(lastSent) < RATE_LIMIT_TIMEOUT) {
    return false;
  }

  window.localStorage.setItem("lastSent", now.toString());
  return true;
};

type FooterKey =
  | "product"
  | "integrations"
  | "pricing"
  | "changelog"
  | "approach"
  | "about"
  | "diversity"
  | "blog"
  | "careers"
  | "finance"
  | "community"
  | "terms"
  | "vulnerability";

type FooterModal = {
  key: FooterKey;
  title: string;
  content: ReactNode;
};

const useFooterModals = (sessionTime: number) => {
  const [contact, setContact] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!canSendMessage()) {
        setStatus("Мы уже получили ваш запрос — попробуйте через минуту.");
        return;
      }

      setStatus(null);
      setLoading(true);
      const ok = await sendToTelegram(contact, location, sessionTime);
      setLoading(false);

      if (ok) {
        setStatus("Спасибо! Мы свяжемся с вами в ближайшее время.");
        setContact("");
        setLocation("");
        return;
      }

      setStatus("Не удалось отправить сообщение. Попробуйте ещё раз позже.");
    },
    [contact, location, sessionTime],
  );

  const modals: FooterModal[] = useMemo(
    () => [
      {
        key: "product",
        title: "Крепродукт",
        content: (
          <div className="space-y-2 text-sm text-gray-700">
            <p>
              Простое управление наймом: автоматические отклики, подбор и координация интервью
              в одном месте.
            </p>
            <p>
              Данные кандидатов защищены, а статусы синхронизируются между всеми участниками
              процесса.
            </p>
          </div>
        ),
      },
      {
        key: "integrations",
        title: "Интеграции",
        content: (
          <div className="space-y-2 text-sm text-gray-700">
            <p>Подключаем Slack, Telegram и Google Calendar без сложных настроек.</p>
            <p>
              Все уведомления о кандидатах приходят в привычные каналы, а встречи создаются
              автоматически.
            </p>
          </div>
        ),
      },
      {
        key: "pricing",
        title: "Цены и тарифы",
        content: (
          <div className="space-y-2 text-sm text-gray-700">
            <p>Пробный период 14 дней без ограничений.</p>
            <ul className="list-disc space-y-1 pl-4">
              <li>Старт: 2 900 ₽/мес за команду до 5 человек.</li>
              <li>Рост: 6 900 ₽/мес + приоритетная поддержка.</li>
              <li>Корп: индивидуальные условия и выделенный менеджер.</li>
            </ul>
          </div>
        ),
      },
      {
        key: "changelog",
        title: "История обновлений",
        content: (
          <div className="space-y-2 text-sm text-gray-700">
            <p>Обновляем продукт каждые две недели.</p>
            <p>
              Последнее: умные фильтры по навыкам, экспорт отчётов в XLSX и улучшенный антиспам
              для откликов.
            </p>
          </div>
        ),
      },
      {
        key: "approach",
        title: "Наш подход",
        content: (
          <div className="space-y-2 text-sm text-gray-700">
            <p>Мы ставим людей выше процессов.</p>
            <p>
              Продукт создаётся рекрутерами и HR-экспертами, поэтому в интерфейсе нет лишних шагов
              и шансов потерять кандидата.
            </p>
          </div>
        ),
      },
      {
        key: "about",
        title: "О нас",
        content: (
          <div className="space-y-2 text-sm text-gray-700">
            <p>PreOffer — команда специалистов из продуктовых и сервисных компаний.</p>
            <p>Наш фокус — быстрый и прозрачный найм для малых и средних бизнесов.</p>
          </div>
        ),
      },
      {
        key: "diversity",
        title: "Разнообразие и инклюзивность",
        content: (
          <div className="space-y-2 text-sm text-gray-700">
            <p>
              Поддерживаем команды любой конфигурации: интерфейс адаптивен и доступен, а тексты в
              продукте нейтральны и уважительны.
            </p>
          </div>
        ),
      },
      {
        key: "blog",
        title: "Блог",
        content: (
          <div className="space-y-2 text-sm text-gray-700">
            <p>Практические заметки о найме, интервью и онбординге без лишней воды.</p>
            <p>Мы публикуем новые материалы каждую неделю.</p>
          </div>
        ),
      },
      {
        key: "careers",
        title: "Вакансии",
        content: (
          <div className="space-y-2 text-sm text-gray-700">
            <p>Присоединяйтесь: продуктовые дизайнеры, Go/TS-разработчики и саппорт.</p>
            <p>Пишите на hiring@preoffer.ru — отвечаем каждому.</p>
          </div>
        ),
      },
      {
        key: "finance",
        title: "Финансовая отчётность",
        content: (
          <div className="space-y-2 text-sm text-gray-700">
            <p>Доступны MRR, churn и NPS по запросу для партнёров и инвесторов.</p>
            <p>Прозрачность — часть нашей культуры.</p>
          </div>
        ),
      },
      {
        key: "community",
        title: "Сообщество",
        content: (
          <div className="space-y-2 text-sm text-gray-700">
            <p>Чат в Telegram для HR-специалистов и основателей.</p>
            <p>Обсуждаем инструменты, делимся кандидатами и поддерживаем новичков.</p>
          </div>
        ),
      },
      {
        key: "terms",
        title: "Условия сервиса",
        content: (
          <div className="space-y-2 text-sm text-gray-700">
            <p>Вся обработка данных соответствует 152-ФЗ и требованиям GDPR.</p>
            <p>Подписываем DPA и обеспечиваем шифрование на всём пути.</p>
          </div>
        ),
      },
      {
        key: "vulnerability",
        title: "Сообщить об уязвимости",
        content: (
          <div className="space-y-4 text-sm text-gray-700">
            <p>
              Расскажите нам о проблеме — мы отвечаем в течение рабочего дня и возвращаемся с
              фиксом или статусом.
            </p>
            <form className="space-y-3" onSubmit={handleSubmit}>
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-800" htmlFor="contact">
                  Контакт для связи
                </label>
                <input
                  className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  id="contact"
                  name="contact"
                  onChange={(event) => setContact(event.target.value)}
                  placeholder="Телеграм, почта или телефон"
                  required
                  type="text"
                  value={contact}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-800" htmlFor="location">
                  Город или часовой пояс
                </label>
                <input
                  className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  id="location"
                  name="location"
                  onChange={(event) => setLocation(event.target.value)}
                  placeholder="Например, Москва или GMT+3"
                  required
                  type="text"
                  value={location}
                />
              </div>
              <button
                className="inline-flex w-full items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-60"
                disabled={loading}
                type="submit"
              >
                {loading ? "Отправляем..." : "Отправить"}
              </button>
              {status ? <p className="text-xs text-gray-600">{status}</p> : null}
            </form>
          </div>
        ),
      },
    ],
    [contact, handleSubmit, loading, location, status],
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
              {renderLink("Возможности", "product")}
              {renderLink("Интеграции", "integrations")}
              {renderLink("Цены и тарифы", "pricing")}
              {renderLink("История обновлений", "changelog")}
              {renderLink("Наш подход", "approach")}
            </ul>
          </div>

          {/* 3rd block */}
          <div className="space-y-2 sm:col-span-6 md:col-span-3 lg:col-span-2">
            <h3 className="text-sm font-medium">Компания</h3>
            <ul className="space-y-2 text-sm">
              {renderLink("О нас", "about")}
              {renderLink("Разнообразие и инклюзивность", "diversity")}
              {renderLink("Блог", "blog")}
              {renderLink("Вакансии", "careers")}
              {renderLink("Финансовая отчетность", "finance")}
            </ul>
          </div>

          {/* 4th block */}
          <div className="space-y-2 sm:col-span-6 md:col-span-3 lg:col-span-2">
            <h3 className="text-sm font-medium">Ресурсы</h3>
            <ul className="space-y-2 text-sm">
              {renderLink("Сообщество", "community")}
              {renderLink("Условия сервиса", "terms")}
              {renderLink("Сообщить об уязвимости", "vulnerability")}
            </ul>
          </div>

          {/* 5th block */}
          <div className="space-y-2 sm:col-span-6 md:col-span-3 lg:col-span-2">
            <h3 className="text-sm font-medium">Соцсети</h3>
            <ul className="flex gap-1">
              <li>
                <Link
                  className="flex items-center justify-center text-blue-500 transition hover:text-blue-600"
                  href="#0"
                  aria-label="Twitter"
                >
                  <svg
                    className="h-8 w-8 fill-current"
                    viewBox="0 0 32 32"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="m13.063 9 3.495 4.475L20.601 9h2.454l-5.359 5.931L24 23h-4.938l-3.866-4.893L10.771 23H8.316l5.735-6.342L8 9h5.063Zm-.74 1.347h-1.457l8.875 11.232h1.36l-8.778-11.232Z"></path>
                  </svg>
                </Link>
              </li>
              <li>
                <Link
                  className="flex items-center justify-center text-blue-500 transition hover:text-blue-600"
                  href="#0"
                  aria-label="Medium"
                >
                  <svg
                    className="h-8 w-8 fill-current"
                    viewBox="0 0 32 32"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M23 8H9a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1Zm-1.708 3.791-.858.823a.251.251 0 0 0-.1.241V18.9a.251.251 0 0 0 .1.241l.838.823v.181h-4.215v-.181l.868-.843c.085-.085.085-.11.085-.241v-4.887l-2.41 6.131h-.329l-2.81-6.13V18.1a.567.567 0 0 0 .156.472l1.129 1.37v.181h-3.2v-.181l1.129-1.37a.547.547 0 0 0 .146-.472v-4.749a.416.416 0 0 0-.138-.351l-1-1.209v-.181H13.8l2.4 5.283 2.122-5.283h2.971l-.001.181Z"></path>
                  </svg>
                </Link>
              </li>
              <li>
                <Link
                  className="flex items-center justify-center text-blue-500 transition hover:text-blue-600"
                  href="#0"
                  aria-label="Github"
                >
                  <svg
                    className="h-8 w-8 fill-current"
                    viewBox="0 0 32 32"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M16 8.2c-4.4 0-8 3.6-8 8 0 3.5 2.3 6.5 5.5 7.6.4.1.5-.2.5-.4V22c-2.2.5-2.7-1-2.7-1-.4-.9-.9-1.2-.9-1.2-.7-.5.1-.5.1-.5.8.1 1.2.8 1.2.8.7 1.3 1.9.9 2.3.7.1-.5.3-.9.5-1.1-1.8-.2-3.6-.9-3.6-4 0-.9.3-1.6.8-2.1-.1-.2-.4-1 .1-2.1 0 0 .7-.2 2.2.8.6-.2 1.3-.3 2-.3s1.4.1 2 .3c1.5-1 2.2-.8 2.2-.8.4 1.1.2 1.9.1 2.1.5.6.8 1.3.8 2.1 0 3.1-1.9 3.7-3.7 3.9.3.4.6.9.6 1.6v2.2c0 .2.1.5.6.4 3.2-1.1 5.5-4.1 5.5-7.6-.1-4.4-3.7-8-8.1-8z"></path>
                  </svg>
                </Link>
              </li>
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
