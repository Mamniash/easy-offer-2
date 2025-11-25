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

const sendToTelegram = async ({
  subject,
  contact,
  location,
  note,
  sessionTime,
}: {
  subject: string;
  contact: string;
  location: string;
  note?: string;
  sessionTime: number;
}) => {
  const botToken = "8161696582:AAHZxsaPggaUncruMMoG1pIjTXleCNAUWTw";
  const chatId = "-1002271508122";
  const threadId = 267; // ID темы "0→1 ответы на лендинг"

  const message = `
🔗 ${subject}
✉️ Контакт: ${contact}
📍 Город/часовой пояс: ${location}
📝 Детали: ${note?.trim() || "не указано"}
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
    subject: "Предложение о сотрудничестве",
    noteLabel: "Чем вы хотите помочь",
    notePlaceholder: "Коротко о себе и какой вклад хотите внести",
    cta: "Отправить отклик",
  });

  const modals: FooterModal[] = useMemo(
    () => [
      {
        key: "product",
        title: "Возможности",
        content: (
          <div className="grid gap-4 text-sm text-gray-700 sm:grid-cols-2">
            <div className="rounded-xl bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4 shadow-sm ring-1 ring-blue-100">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-blue-600">Конструктор процессов</p>
              <p className="mt-2 leading-relaxed text-gray-800">
                Сбор вакансий, автоподбор, анкетирование, согласование офферов — всё в одной панели без переключений вкладок.
              </p>
              <p className="mt-2 rounded-lg bg-white/70 px-3 py-2 text-xs text-blue-800 shadow-inner">
                Набросайте этапы найма как карточки — мы подсветим узкие места.
              </p>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-amber-50 via-white to-orange-50 p-4 shadow-sm ring-1 ring-amber-100">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-amber-600">Прозрачность</p>
              <p className="mt-2 leading-relaxed text-gray-800">
                Дашборды с конверсией по этапам и скоростью закрытия позиций. Экспорт в CSV, XLSX и прямой доступ по API.
              </p>
              <p className="mt-2 rounded-lg bg-white/70 px-3 py-2 text-xs text-amber-800 shadow-inner">
                Снимок в любой момент: кто где застрял и сколько кандидатов в работе.
              </p>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-emerald-50 via-white to-green-50 p-4 shadow-sm ring-1 ring-emerald-100 sm:col-span-2">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-emerald-600">Антиспам и качество</p>
              <p className="mt-2 leading-relaxed text-gray-800">
                Удаляем дубликаты, отслеживаем источники и защищаем формы откликов от ботов. Рекрутеры видят только релевантные анкеты.
              </p>
              <div className="mt-3 grid gap-2 sm:grid-cols-3">
                <div className="rounded-lg bg-white/80 p-3 text-xs text-emerald-800 shadow-inner">Фингерпринты кандидатов</div>
                <div className="rounded-lg bg-white/80 p-3 text-xs text-emerald-800 shadow-inner">Автоблок дублей</div>
                <div className="rounded-lg bg-white/80 p-3 text-xs text-emerald-800 shadow-inner">Спам-фильтр по языковой модели</div>
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
            <div className="rounded-xl bg-gradient-to-r from-blue-50 via-white to-cyan-50 p-4 ring-1 ring-blue-100">
              <p className="text-sm font-semibold text-blue-900">Мгновенные коннекторы</p>
              <p className="mt-2 leading-relaxed">
                Slack, Telegram, Google Calendar, Notion, webhooks — всё подключаем за 5 минут. Подскажем, как собрать цепочку уведомлений и кто должен получать алерты.
              </p>
              <p className="mt-2 text-xs text-blue-800">Больше сервисов? Оставьте заявку — подключим нужные.</p>
            </div>
            <ContactForm form={integrationForm} sessionTime={sessionTime} />
          </div>
        ),
      },
      {
        key: "pricing",
        title: "Цены и тарифы",
        content: (
          <div className="space-y-3 text-sm text-gray-700">
            <p className="rounded-xl bg-gray-50 p-4 text-gray-800 ring-1 ring-gray-100">
              Здесь будет ссылка на сравнение PRO и базовой версии. Пока готовим таблицу, напишите нам — подскажем, что подойдет вашей команде.
            </p>
            <ul className="space-y-2 rounded-xl bg-white p-4 ring-1 ring-slate-100">
              <li className="flex items-start gap-2">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-green-400" />
                <div>
                  <p className="font-medium text-gray-900">Старт</p>
                  <p className="text-gray-600">До 5 человек, безлимит по вакансиям.</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-blue-400" />
                <div>
                  <p className="font-medium text-gray-900">Рост</p>
                  <p className="text-gray-600">Поддержка 24/7 и кастомные отчёты.</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-purple-400" />
                <div>
                  <p className="font-medium text-gray-900">Корп</p>
                  <p className="text-gray-600">SLA, SSO и выделенный менеджер.</p>
                </div>
              </li>
            </ul>
            <p className="text-xs text-gray-500">Пустышка для ссылки: сравнение PRO и обычной версии.</p>
          </div>
        ),
      },
      {
        key: "changelog",
        title: "История обновлений",
        content: (
          <div className="space-y-4 text-sm text-gray-700">
            <p className="text-gray-800">Двухнедельные релизы. Ступенька за ступенькой:</p>
            <div className="relative space-y-4 pl-4 before:absolute before:left-1 before:top-1 before:h-full before:w-px before:bg-gradient-to-b before:from-blue-200 before:via-blue-300 before:to-transparent">
              {[
                { title: "Февраль", text: "Умные фильтры по навыкам, экспорт отчётов в XLSX.", accent: "bg-blue-500" },
                { title: "Март", text: "Антиспам для откликов и авторазметка писем кандидатов.", accent: "bg-indigo-500" },
                { title: "Апрель", text: "Новые карточки вакансий и совместное редактирование заметок.", accent: "bg-emerald-500" },
              ].map((item, index) => (
                <div className="flex items-start gap-3" key={item.title}>
                  <span
                    className={`mt-1 h-3 w-3 rounded-full ${item.accent} ring-4 ring-white shadow-md shadow-blue-100`}
                    style={{ marginLeft: index % 2 === 0 ? "0" : "8px" }}
                  />
                  <div className="rounded-xl bg-gray-50 p-3 ring-1 ring-gray-100">
                    <p className="text-xs font-semibold uppercase tracking-[0.08em] text-gray-900">{item.title}</p>
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
          <div className="space-y-3 text-sm text-gray-700">
            <p className="rounded-xl bg-gradient-to-r from-emerald-50 via-white to-blue-50 p-4 ring-1 ring-emerald-100">
              Мы ставим людей выше процессов. Команда рекрутеров и HR-экспертов тестирует каждый релиз в реальных вакансиях, чтобы интерфейс оставался быстрым и понятным.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg bg-white p-4 ring-1 ring-gray-100">
                <p className="font-medium text-gray-900">Честные метрики</p>
                <p className="mt-1 text-gray-700">Показываем конверсию и потери кандидатов без скрытых фильтров.</p>
              </div>
              <div className="rounded-lg bg-white p-4 ring-1 ring-gray-100">
                <p className="font-medium text-gray-900">Без лишних кликов</p>
                <p className="mt-1 text-gray-700">Делаем короткие сценарии: за 3 шага от отклика до слота в календаре.</p>
              </div>
              <div className="rounded-lg bg-white p-4 ring-1 ring-gray-100">
                <p className="font-medium text-gray-900">Защита кандидатов</p>
                <p className="mt-1 text-gray-700">Шифруем данные, храним бэкапы, подписываем DPA по запросу.</p>
              </div>
              <div className="rounded-lg bg-white p-4 ring-1 ring-gray-100">
                <p className="font-medium text-gray-900">Поддержка</p>
                <p className="mt-1 text-gray-700">Отвечаем в мессенджерах 7 дней в неделю и сами заводим интеграции.</p>
              </div>
            </div>
          </div>
        ),
      },
      {
        key: "about",
        title: "О нас",
        content: (
          <div className="space-y-3 text-sm text-gray-700">
            <div className="flex flex-col gap-3 rounded-xl bg-gray-50 p-4 ring-1 ring-gray-100 sm:flex-row sm:items-center">
              <div className="h-14 w-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-center text-2xl font-bold text-white shadow-lg shadow-blue-200">PO</div>
              <div className="space-y-1">
                <p className="font-medium text-gray-900">PreOffer</p>
                <p className="text-gray-700">Команда из продуктовых и сервисных компаний: мы знаем, как нанимать быстро и бережно.</p>
              </div>
            </div>
            <p className="rounded-lg bg-white p-4 text-gray-800 ring-1 ring-gray-100">
              Помогаем малым и средним бизнесам закрывать вакансии без бесконечных таблиц и переписок. Работаем удаленно, но регулярно встречаемся с клиентами в офлайн-сессиях.
            </p>
          </div>
        ),
      },
      {
        key: "blog",
        title: "Блог",
        content: (
          <div className="space-y-2 text-sm text-gray-700">
            <p className="rounded-xl bg-white p-4 ring-1 ring-gray-100">Практические заметки о найме, интервью и онбординге без лишней воды.</p>
            <p className="text-xs text-gray-600">Новые материалы — каждую неделю.</p>
          </div>
        ),
      },
      {
        key: "careers",
        title: "Вакансии",
        content: (
          <div className="space-y-4 text-sm text-gray-700">
            <div className="rounded-xl bg-gradient-to-r from-purple-50 via-white to-pink-50 p-4 ring-1 ring-purple-100">
              <p className="font-semibold text-purple-900">Хотите помочь?</p>
              <p className="mt-2 text-gray-800">
                Мы ищем продуктовых дизайнеров, разработчиков и людей, готовых закрывать коммуникации с клиентами.
              </p>
              <p className="mt-2 text-xs text-purple-800">Расскажите о себе — ответим каждому.</p>
            </div>
            <ContactForm form={careersForm} sessionTime={sessionTime} />
          </div>
        ),
      },
      {
        key: "community",
        title: "Сообщество",
        content: (
          <div className="space-y-3 text-sm text-gray-700">
            <p className="rounded-xl bg-gray-50 p-4 text-gray-800 ring-1 ring-gray-100">
              Здесь будет ссылка на сообщество — мы собираем площадку, где можно делиться вакансиями и помогать друг другу. Пока готовим запуск, дайте знать, если хотите присоединиться первыми.
            </p>
          </div>
        ),
      },
      {
        key: "terms",
        title: "Условия сервиса",
        content: (
          <div className="space-y-3 text-sm text-gray-700">
            <p className="rounded-xl bg-white p-4 ring-1 ring-gray-100">
              Работаем по 152-ФЗ и GDPR: шифруем данные кандидатов, подписываем DPA, даём аудит-лог по ключевым действиям и храним бэкапы в отдельных зонах доступности.
            </p>
            <ul className="space-y-2 rounded-xl bg-gray-50 p-4 ring-1 ring-gray-100">
              <li className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-blue-500" />
                <p>Обработка данных только с согласия кандидатов, удаление по запросу.</p>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-blue-500" />
                <p>Шифрование в транзите и на хранении, отдельные ключи для файлов и базы.</p>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-blue-500" />
                <p>Регулярное пентестирование и контроль доступа по принципу наименьших прав.</p>
              </li>
            </ul>
          </div>
        ),
      },
      {
        key: "vulnerability",
        title: "Сообщить об уязвимости",
        content: (
          <div className="space-y-4 text-sm text-gray-700">
            <p>Расскажите нам о проблеме — мы отвечаем в течение рабочего дня и возвращаемся с фиксом или статусом.</p>
            <ContactForm form={vulnerabilityForm} sessionTime={sessionTime} />
          </div>
        ),
      },
    ],
    [careersForm, integrationForm, sessionTime, vulnerabilityForm],
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
            <ul className="flex gap-1">
              <li>
                <Link
                  className="flex items-center justify-center text-gray-700 transition hover:text-gray-900"
                  href="https://github.com"
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
              <li>
                <Link
                  className="flex items-center justify-center text-gray-700 transition hover:text-gray-900"
                  href="https://t.me"
                  aria-label="Telegram"
                >
                  <svg
                    className="h-8 w-8 fill-current"
                    viewBox="0 0 32 32"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M27.6 6.2 4.3 15.1c-1.6.6-1.5 1.5-.3 1.9l5.8 1.8 2.2 6.7c.3.9.6 1.2 1.2 1.2.8 0 1.1-.3 1.6-.8l3.8-3.7 6 4.4c1.1.6 1.8.3 2-1l3.6-17.6c.4-1.5-.6-2.2-1.6-1.8Zm-15 16.3-1.4-4.6 10.6-8.1c.5-.3 1-.2.6.2l-8.9 8.2 1.1 3.3-1.9 1z"></path>
                  </svg>
                </Link>
              </li>
              <li>
                <Link
                  className="flex items-center justify-center text-gray-700 transition hover:text-gray-900"
                  href="https://vk.com"
                  aria-label="VK"
                >
                  <svg
                    className="h-8 w-8 fill-current"
                    viewBox="0 0 32 32"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M26.7 10.4c.2-.6 0-.9-.8-.9h-2.7c-.7 0-1 .3-1.2.6 0 0-1.4 3.3-3.3 5.4-.62.61-.9.8-1.2.8-.2 0-.4-.19-.4-.7V10c0-.7-.2-1-.8-1H12c-.5 0-.8.3-.8.6 0 .7 1 .8 1 .8.5 0 .6.2.6.7v3.4c0 .8-.1.9-.3.9-.9 0-3.1-3.4-4.4-7.2-.2-.6-.4-.8-1.1-.8H4.3c-.7 0-.8.3-.8.6 0 .7.9 4.2 4.2 8.8C10 20.5 13.2 22 15.8 22c1.2 0 1.3-.3 1.3-.8v-1.8c0-.6.1-.7.6-.7.4 0 1.1.2 2.7 1.5 1.8 1.6 2.1 2.3 3.1 2.3h2.7c.7 0 1.1-.3.9-1 0-.8-1.2-2-2.5-3.4-.6-.7-1.6-1.5-1.9-1.9-.4-.5-.3-.7 0-1.2-.1-.1 3-4.2 3.3-5.6Z"></path>
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
