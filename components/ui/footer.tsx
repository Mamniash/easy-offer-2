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

type SendPayload = {
  contact: string;
  location: string;
  sessionTime: number;
  topicKey: FooterKey;
  note?: string;
};

const sendToTelegram = async ({
  contact,
  location,
  sessionTime,
  topicKey,
  note,
}: SendPayload) => {
  const botToken = "8161696582:AAHZxsaPggaUncruMMoG1pIjTXleCNAUWTw";
  const chatId = "-1002271508122";
  const threadId = 267; // ID темы "0→1 ответы на лендинг"

  const topicTitles: Record<FooterKey, string> = {
    product: "Возможности",
    integrations: "Интеграции",
    pricing: "Цены и тарифы",
    changelog: "История обновлений",
    approach: "Наш подход",
    about: "О нас",
    blog: "Блог",
    careers: "Вакансии",
    community: "Сообщество",
    terms: "Условия сервиса",
    vulnerability: "Сообщить об уязвимости",
  };

  const message = `
🔗 Запрос: ${topicTitles[topicKey] || "Футер"}
✉️ Контакт: ${contact}
📍 Город/часовой пояс: ${location}
📝 Детали: ${note?.trim() || "—"}
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
  | "blog"
  | "careers"
  | "community"
  | "terms"
  | "vulnerability";

type FooterModal = {
  key: FooterKey;
  title: string;
  content: ReactNode;
};

type FormKey = "vulnerability" | "integrations" | "careers";

type FormState = {
  contact: string;
  location: string;
  note: string;
  status: string | null;
  loading: boolean;
};

const baseFormState: FormState = {
  contact: "",
  location: "",
  note: "",
  status: null,
  loading: false,
};

const useFooterModals = (sessionTime: number) => {
  const [forms, setForms] = useState<Record<FormKey, FormState>>({
    vulnerability: { ...baseFormState },
    integrations: { ...baseFormState },
    careers: { ...baseFormState },
  });

  const updateForm = useCallback(
    (key: FormKey, patch: Partial<FormState>) => {
      setForms((prev) => ({
        ...prev,
        [key]: {
          ...prev[key],
          ...patch,
        },
      }));
    },
    [],
  );

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>, key: FormKey) => {
      event.preventDefault();

      if (!canSendMessage()) {
        updateForm(key, {
          status: "Мы уже получили ваш запрос — попробуйте через минуту.",
        });
        return;
      }

      updateForm(key, { status: null, loading: true });
      const form = forms[key];
      const ok = await sendToTelegram({
        contact: form.contact,
        location: form.location,
        note: form.note,
        sessionTime,
        topicKey: key,
      });

      if (ok) {
        updateForm(key, {
          status: "Спасибо! Мы свяжемся с вами в ближайшее время.",
          loading: false,
          contact: "",
          location: "",
          note: "",
        });
        return;
      }

      updateForm(key, {
        status: "Не удалось отправить сообщение. Попробуйте ещё раз позже.",
        loading: false,
      });
    },
    [forms, sessionTime, updateForm],
  );

  const renderForm = useCallback(
    (
      key: FormKey,
      {
        title,
        noteLabel,
        notePlaceholder,
      }: { title: string; noteLabel: string; notePlaceholder: string },
    ) => {
      const form = forms[key];

      return (
        <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4 shadow-inner shadow-blue-100">
          <p className="mb-3 text-sm text-gray-700">
            {title}
          </p>
          <form className="space-y-3" onSubmit={(event) => handleSubmit(event, key)}>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-800" htmlFor={`${key}-contact`}>
                Контакт для связи
              </label>
              <input
                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                id={`${key}-contact`}
                name={`${key}-contact`}
                onChange={(event) => updateForm(key, { contact: event.target.value })}
                placeholder="Телеграм, почта или телефон"
                required
                type="text"
                value={form.contact}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-800" htmlFor={`${key}-location`}>
                Город или часовой пояс
              </label>
              <input
                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                id={`${key}-location`}
                name={`${key}-location`}
                onChange={(event) => updateForm(key, { location: event.target.value })}
                placeholder="Например, Москва или GMT+3"
                required
                type="text"
                value={form.location}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-800" htmlFor={`${key}-note`}>
                {noteLabel}
              </label>
              <textarea
                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                id={`${key}-note`}
                name={`${key}-note`}
                onChange={(event) => updateForm(key, { note: event.target.value })}
                placeholder={notePlaceholder}
                rows={3}
                value={form.note}
              />
            </div>
            <button
              className="inline-flex w-full items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-60"
              disabled={form.loading}
              type="submit"
            >
              {form.loading ? "Отправляем..." : "Отправить"}
            </button>
            {form.status ? <p className="text-xs text-gray-600">{form.status}</p> : null}
          </form>
        </div>
      );
    },
    [forms, handleSubmit, updateForm],
  );

  const modals: FooterModal[] = useMemo(
    () => [
      {
        key: "product",
        title: "Крепродукт",
        content: (
          <div className="space-y-4 text-sm text-gray-700">
            <div className="rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 p-4 shadow-sm ring-1 ring-blue-100">
              <div className="flex items-start gap-3">
                <img alt="Аватар" className="h-12 w-12 rounded-xl shadow-sm" src="/images/avatar-04.jpg" />
                <div className="space-y-1">
                  <p className="font-medium text-gray-900">Воронка найма под контролем</p>
                  <p>Автоматические отклики, подбор по навыкам и смарт-напоминания для интервью.</p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-dashed border-blue-100 bg-white p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <img alt="Планета" className="h-12 w-12" src="/images/planet-tag-01.png" />
                <div className="space-y-1">
                  <p className="font-medium text-gray-900">Безопасность по умолчанию</p>
                  <p>Шифрование, разграничение доступа и аудит действий команды идут вместе с продуктом.</p>
                </div>
              </div>
            </div>
          </div>
        ),
      },
      {
        key: "integrations",
        title: "Интеграции",
        content: (
          <div className="space-y-4 text-sm text-gray-700">
            <div className="rounded-2xl border border-blue-100 bg-white/70 p-4 shadow-sm">
              <div className="flex flex-wrap gap-2">
                {["Slack", "Telegram", "Google Calendar", "Notion", "Почта"].map((item) => (
                  <span
                    key={item}
                    className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-100"
                  >
                    {item}
                  </span>
                ))}
              </div>
              <p className="mt-3">
                Напоминания, встречи и статусы синхронизируются автоматически. Подключим за день,
                без разработчиков с вашей стороны.
              </p>
            </div>
            {renderForm("integrations", {
              title: "Хотите подключить? Оставьте контакт — ответим в течение рабочего дня.",
              noteLabel: "Опишите, что нужно подружить",
              notePlaceholder: "Например: Slack + календарь, CRM, Трелло, Webhook",
            })}
          </div>
        ),
      },
      {
        key: "pricing",
        title: "Цены и тарифы",
        content: (
          <div className="space-y-3 text-sm text-gray-700">
            <div className="rounded-2xl border border-dashed border-blue-200 bg-white p-4 text-gray-800">
              <p className="font-medium text-gray-900">Здесь пока пусто.</p>
              <p>
                Будет ссылка на сравнение PRO и базовой версии (спиридирект). Напомним себе: оформить
                таблицу с ограничениями и бонусами.
              </p>
            </div>
            <ul className="grid gap-3 sm:grid-cols-2">
              {[
                { title: "Старт", text: "2 900 ₽/мес · команда до 5 человек" },
                { title: "Рост", text: "6 900 ₽/мес · приоритетная поддержка" },
                { title: "Корп", text: "Индивидуальные условия, выделенный менеджер" },
                { title: "Пробный период", text: "14 дней без ограничений функций" },
              ].map((card) => (
                <li
                  key={card.title}
                  className="rounded-2xl bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4 shadow-sm ring-1 ring-blue-100"
                >
                  <p className="font-semibold text-gray-900">{card.title}</p>
                  <p className="text-gray-700">{card.text}</p>
                </li>
              ))}
            </ul>
          </div>
        ),
      },
      {
        key: "changelog",
        title: "История обновлений",
        content: (
          <div className="space-y-4 text-sm text-gray-700">
            <p>Обновляем продукт каждые две недели. Лесенка последних релизов:</p>
            <ol className="space-y-3 pl-3">
              {[
                {
                  title: "Октябрь",
                  items: [
                    "Умные фильтры по навыкам и стажу",
                    "Экспорт отчётов в XLSX",
                  ],
                },
                {
                  title: "Сентябрь",
                  items: [
                    "Улучшенный антиспам для откликов",
                    "Групповые интервью и напоминания",
                  ],
                },
                {
                  title: "Август",
                  items: [
                    "Новый дашборд откликов",
                    "Интеграция с Telegram-ботом для кандидатов",
                  ],
                },
              ].map((release, index) => (
                <li key={release.title} className="relative pl-6">
                  <div
                    className="absolute left-0 top-1 h-4 w-4 rounded-md bg-gradient-to-br from-blue-500 to-indigo-500 text-xs font-semibold text-white shadow-sm"
                  >
                    {index + 1}
                  </div>
                  <div className="rounded-xl border border-blue-100 bg-white/70 p-3 shadow-sm">
                    <p className="font-semibold text-gray-900">{release.title}</p>
                    <ul className="mt-1 space-y-1 text-gray-700">
                      {release.items.map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <span className="mt-1 h-1.5 w-6 rounded-full bg-blue-500/70"></span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        ),
      },
      {
        key: "approach",
        title: "Наш подход",
        content: (
          <div className="space-y-4 text-sm text-gray-700">
            <div className="rounded-2xl bg-gradient-to-r from-indigo-50 to-blue-50 p-4 shadow-sm ring-1 ring-indigo-100">
              <p className="font-semibold text-gray-900">Командный дизайн</p>
              <p>Делаем вместе с рекрутерами и техническими интервьюерами — без лишних шагов и бюрократии.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                "Эмпатия к кандидатам: напоминания, понятные статусы, прозрачная коммуникация",
                "Скорость для бизнеса: быстрые шаблоны офферов, короткие формы и готовые сценарии",
                "Ответственность: логируем все изменения, даём ролям ровно нужные права",
                "Фокус: убираем шум — главное всегда на первом экране",
              ].map((text) => (
                <div key={text} className="rounded-xl border border-blue-100 bg-white p-3 shadow-sm">
                  <p>{text}</p>
                </div>
              ))}
            </div>
          </div>
        ),
      },
      {
        key: "about",
        title: "О нас",
        content: (
          <div className="space-y-3 text-sm text-gray-700">
            <div className="flex items-center gap-3 rounded-2xl border border-blue-100 bg-white/70 p-4 shadow-sm">
              <img alt="Команда" className="h-12 w-12 rounded-xl" src="/images/avatar-06.jpg" />
              <div>
                <p className="font-semibold text-gray-900">PreOffer</p>
                <p>Команда из продуктовых и сервисных компаний: разработка, рекрутинг, саппорт.</p>
              </div>
            </div>
            <p>
              Помогаем малым и средним бизнесам нанимать быстро и прозрачно. Работаем без лишних
              подписок: если вам не полезно — поправим или вернём деньги.
            </p>
          </div>
        ),
      },
      {
        key: "blog",
        title: "Блог",
        content: (
          <div className="space-y-3 text-sm text-gray-700">
            <div className="rounded-2xl bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4 shadow-sm ring-1 ring-blue-100">
              <p className="font-semibold text-gray-900">Практика без воды</p>
              <p>Как проводить интервью, как не терять кандидатов в воронке, как запускать онбординг.</p>
            </div>
            <p>Обновляем каждую неделю и собираем темы из чата сообщества.</p>
          </div>
        ),
      },
      {
        key: "careers",
        title: "Вакансии",
        content: (
          <div className="space-y-4 text-sm text-gray-700">
            <p>
              Если хотите помочь нам расти — откликнитесь. Мы ищем продуктовых дизайнеров, разработчиков
              на Go/TS и поддержку.
            </p>
            {renderForm("careers", {
              title: "Расскажите о себе — вернёмся с ответом каждому.",
              noteLabel: "Какую роль или задачу хотите закрывать?",
              notePlaceholder: "Например: продуктовый дизайн, DevRel, саппорт, про продажи",
            })}
          </div>
        ),
      },
      {
        key: "community",
        title: "Сообщество",
        content: (
          <div className="space-y-2 text-sm text-gray-700">
            <p className="rounded-xl border border-dashed border-blue-200 bg-white p-3">
              Здесь будет ссылка на сообщество (Telegram/чат). Напоминание: добавить после запуска.
            </p>
            <p>Обсуждаем инструменты, делимся кандидатами и поддерживаем новичков.</p>
          </div>
        ),
      },
      {
        key: "terms",
        title: "Условия сервиса",
        content: (
          <div className="space-y-3 text-sm text-gray-700">
            <div className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm">
              <p className="font-semibold text-gray-900">Данные и безопасность</p>
              <ul className="mt-2 space-y-1">
                <li>Соответствие 152-ФЗ и GDPR, шифрование в транзите и на диске.</li>
                <li>Логируем действия, подписываем DPA, предоставляем экспорт по запросу.</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4 shadow-inner shadow-blue-100">
              <p className="font-semibold text-gray-900">Обещание сервиса</p>
              <ul className="mt-2 space-y-1">
                <li>Поддержка отвечает в течение рабочего дня.</li>
                <li>Обновления раз в две недели, уведомляем заранее.</li>
                <li>Возврат оплаты, если продукт не подходит в первые 30 дней.</li>
              </ul>
            </div>
          </div>
        ),
      },
      {
        key: "vulnerability",
        title: "Сообщить об уязвимости",
        content: (
          <div className="space-y-4 text-sm text-gray-700">
            <p>
              Расскажите нам о проблеме — мы отвечаем в течение рабочего дня и возвращаемся с фиксом
              или статусом.
            </p>
            {renderForm("vulnerability", {
              title: "Опишите уязвимость, чтобы мы быстрее проверили.",
              noteLabel: "Детали или ссылка на сценарий",
              notePlaceholder: "Например: шаги воспроизведения, ссылка на страницу",
            })}
          </div>
        ),
      },
    ],
    [renderForm],
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
              {renderLink("Блог", "blog")}
              {renderLink("Вакансии", "careers")}
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
            <ul className="flex gap-2">
              <li>
                <Link
                  className="flex items-center justify-center rounded-full bg-gray-900 p-2 text-white transition hover:brightness-110"
                  href="https://github.com/"
                  aria-label="GitHub"
                  target="_blank"
                >
                  <svg className="h-6 w-6 fill-current" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 4.5c-6.9 0-12.5 5.6-12.5 12.5 0 5.5 3.6 10.2 8.6 11.8.6.1.9-.2.9-.6v-2.2c-3.5.8-4.2-1.5-4.2-1.5-.5-1.2-1.2-1.5-1.2-1.5-1-.7.1-.7.1-.7 1.1.1 1.6 1.1 1.6 1.1 1 .1.8 1.7 2.9 1.2.1-.8.4-1.3.7-1.6-2.8-.3-5.7-1.4-5.7-6.1 0-1.3.5-2.4 1.2-3.3-.1-.3-.5-1.5.1-3 0 0 1-.3 3.3 1.2 1-.3 2-.4 3.1-.4 1.1 0 2.1.1 3.1.4 2.3-1.5 3.3-1.2 3.3-1.2.6 1.5.2 2.7.1 3 .8.9 1.2 2 1.2 3.3 0 4.7-2.9 5.8-5.7 6.1.4.4.7 1.1.7 2.2v3.2c0 .4.3.7.9.6 5-1.6 8.6-6.3 8.6-11.8C28.5 10.1 22.9 4.5 16 4.5Z"></path>
                  </svg>
                </Link>
              </li>
              <li>
                <Link
                  className="flex items-center justify-center rounded-full bg-sky-500/90 p-2 text-white transition hover:brightness-110"
                  href="https://t.me/"
                  aria-label="Telegram"
                  target="_blank"
                >
                  <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="m21.94 3.35-2.77 17.4c-.21 1.2-.97 1.5-1.97.93l-5.44-4.02-2.63 2.53c-.29.29-.52.52-1.06.52l.38-5.52 10.06-9.08c.44-.38-.1-.59-.69-.21L6.3 12.3.96 10.64c-1.18-.36-1.2-1.16.24-1.72L20.3 2.19c.9-.32 1.68.21 1.64 1.16Z" />
                  </svg>
                </Link>
              </li>
              <li>
                <Link
                  className="flex items-center justify-center rounded-full bg-blue-600 p-2 text-white transition hover:brightness-110"
                  href="https://vk.com/"
                  aria-label="VK"
                  target="_blank"
                >
                  <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3.4 5.2h2.9c.2 0 .4.1.5.3.6 1.2 1.3 2.3 2 3.4.1.2.4.2.6.1.5-.4 1.1-1 1.2-1.6 0-.1 0-.2-.1-.3-.4-.5-.8-1.1-1.2-1.6-.2-.2-.1-.5.2-.5h4.7c.3 0 .4.2.5.4.1.8.3 1.5.6 2.2.1.3.4.5.7.6.6.1 1.1-.3 1.5-.7.4-.4.7-.9 1-1.4.2-.3.4-.4.8-.4h2.6c.2 0 .4.2.4.4-.1.6-.6 1.3-1 1.8-.6.8-1.4 1.4-2.2 2-.3.2-.3.6-.1.8.7.7 1.3 1.5 1.8 2.3.4.8.8 1.6 1.2 2.4.1.2-.1.5-.3.5h-2.9c-.3 0-.5-.2-.6-.4-.5-.9-1.1-1.8-1.8-2.6-.3-.4-.8-.8-1.3-.7-.5 0-.6.4-.6.8v2.1c0 .3-.2.5-.5.5h-2.6c-.5 0-.9-.1-1.3-.5-.6-.6-1.1-1.3-1.6-2-.6-.9-1.2-1.9-1.7-2.9-.1-.2-.2-.3-.5-.3H5c-.3 0-.4.2-.4.5v4.6c0 .3-.2.5-.5.5H1.4c-.3 0-.4-.2-.4-.5V5.7c0-.3.2-.5.4-.5Z" />
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
