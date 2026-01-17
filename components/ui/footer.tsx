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

type FooterKey = "about" | "careers" | "vulnerability" | "public-offer" | "privacy";

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
        key: "vulnerability",
        title: "Сообщить об уязвимости",
        content: (
          <div className="space-y-4 text-sm text-gray-800">
            <p>Сообщите о проблеме — мы вернёмся с обновлением статуса или фиксом. Благодарим за внимание к безопасности.</p>
            <ContactForm form={vulnerabilityForm} sessionTime={sessionTime} />
          </div>
        ),
      },
      {
        key: "public-offer",
        title: "Договор публичной оферты",
        content: (
          <div className="space-y-4 text-sm text-gray-800">
            <section className="rounded-xl bg-white p-4 leading-relaxed ring-1 ring-gray-100">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">Редакция от</p>
              <p className="mt-1 text-base font-semibold text-gray-900">15 января 2026 г.</p>
              <div className="mt-3 space-y-1 text-sm">
                <p className="font-semibold text-gray-900">Исполнитель</p>
                <p>Индивидуальный предприниматель Покрасов Даниил Денисович</p>
                <p>ОГРНИ 325762700037505</p>
                <p>ИНН: 760308458432</p>
                <p>Email: pokrasov.04@yandex.ru</p>
                <p>Сайт: https://preoffer.vercel.app</p>
              </div>
            </section>

            <section className="space-y-3 rounded-xl bg-slate-50 p-4 leading-relaxed ring-1 ring-slate-100">
              <h4 className="text-sm font-semibold text-gray-900">1. Общие положения</h4>
              <p>
                1.1. Настоящий документ является официальным предложением Индивидуального предпринимателя ПОКРАСОВ ДАНИИЛ ДЕНИСОВИЧ
                (далее — «Исполнитель») любому физическому лицу (далее — «Пользователь»), заключить договор на условиях, изложенных ниже.
              </p>
              <p>
                1.2. Настоящая оферта является публичной офертой в соответствии со статьей 437 Гражданского кодекса РФ. Полным и безоговорочным
                акцептом настоящей оферты признаётся факт оплаты Пользователем услуги на сайте https://preoffer.vercel.app.
              </p>
            </section>

            <section className="space-y-3 rounded-xl bg-white p-4 leading-relaxed ring-1 ring-gray-100">
              <h4 className="text-sm font-semibold text-gray-900">2. Предмет договора</h4>
              <p>
                2.1. Исполнитель предоставляет Пользователю платный доступ к онлайн-сервису preoffer, включающему информационные материалы,
                инструменты и цифровые ресурсы для подготовки к собеседованиям в сфере IT.
              </p>
              <p>
                2.2. Услуги оказываются в виде предоставления онлайн-доступа к базе вопросов, ответов, тренажёров и других обучающих материалов.
              </p>
            </section>

            <section className="space-y-3 rounded-xl bg-slate-50 p-4 leading-relaxed ring-1 ring-slate-100">
              <h4 className="text-sm font-semibold text-gray-900">3. Порядок предоставления услуг</h4>
              <p>3.1. Доступ к материалам предоставляется после оплаты подписки. Вид, объём и продолжительность подписки указываются на сайте в момент оплаты.</p>
              <p>
                3.2. Может быть предоставлен бесплатный пробный период (например, 3 дня), после чего активируется платная подписка, если она не была отменена заранее.
              </p>
              <p>
                3.3. Исполнитель оставляет за собой право ограничить или заблокировать доступ к сервису в случае, если действия Пользователя наносят вред работе сайта,
                нарушают правила использования, включают попытки копирования контента, массового извлечения данных с использованием программных средств, либо иным образом
                нарушают нормальную работу сервиса. В случае выявления нарушений, денежные средства за оплаченный период возврату не подлежат.
              </p>
            </section>

            <section className="space-y-3 rounded-xl bg-white p-4 leading-relaxed ring-1 ring-gray-100">
              <h4 className="text-sm font-semibold text-gray-900">4. Стоимость и порядок оплаты</h4>
              <p>4.1. Актуальные тарифы публикуются на сайте https://preoffer.vercel.app и могут изменяться Исполнителем в одностороннем порядке.</p>
              <p>4.2. Оплата производится онлайн через доступные платёжные системы. После успешной оплаты договор считается заключённым.</p>
            </section>

            <section className="space-y-3 rounded-xl bg-slate-50 p-4 leading-relaxed ring-1 ring-slate-100">
              <h4 className="text-sm font-semibold text-gray-900">5. Возврат денежных средств</h4>
              <p>
                5.1. В соответствии с п. 13 ст. 32 Закона РФ «О защите прав потребителей» возврат средств за оказанные услуги, связанные с предоставлением доступа
                к цифровому контенту, не осуществляется.
              </p>
              <p>
                5.2. Возврат может быть осуществлён только в случае полной технической невозможности использования сервиса по вине Исполнителя, продолжающейся не менее
                72 (семидесяти двух) часов подряд.
              </p>
              <p>
                Возврат производится в денежной форме в размере, пропорциональном количеству календарных дней, в течение которых доступ к сервису фактически не предоставлялся.
                Пользователь не вправе требовать возврат денежных средств за весь оплаченный период, если сервис был доступен частично — возврат возможен только за период
                недоступности.
              </p>
              <p>Для получения возврата Пользователь обязан обратиться с соответствующим запросом на почту pokrasov.04@yandex.ru.</p>
              <p>
                Кратковременные сбои в работе сайта, связанные с техническим обслуживанием, обновлением сервиса или неполадками у третьих лиц (платёжных систем, хостинга,
                интернет-провайдеров и пр.), не являются основанием для возврата денежных средств.
              </p>
              <p>
                Пользователь также не вправе требовать возврат денежных средств, если списание произошло автоматически в рамках продления подписки, и он не отключил
                автопродление до момента следующего платежа. Ответственность за контроль за продлением подписки лежит на Пользователе.
              </p>
              <p>
                5.3. Исполнитель оставляет за собой право изменять, дополнять или удалять элементы функционала сервиса без предварительного уведомления. Изменение состава,
                структуры или содержания предоставляемых материалов и инструментов не является основанием для возврата денежных средств.
              </p>
            </section>

            <section className="space-y-3 rounded-xl bg-white p-4 leading-relaxed ring-1 ring-gray-100">
              <h4 className="text-sm font-semibold text-gray-900">6. Ответственность сторон</h4>
              <p>6.1. Исполнитель не несёт ответственности за невозможность использования услуг по причинам, зависящим от Пользователя (например, отсутствие доступа в интернет, блокировка сайта по месту жительства и т.д.).</p>
              <p>6.2. Ответственность Исполнителя ограничивается суммой последнего оплаченного периода.</p>
            </section>

            <section className="space-y-3 rounded-xl bg-slate-50 p-4 leading-relaxed ring-1 ring-slate-100">
              <h4 className="text-sm font-semibold text-gray-900">7. Персональные данные</h4>
              <p>7.1. Пользователь соглашается на обработку своих персональных данных в соответствии с Политикой конфиденциальности, размещённой на сайте https://preoffer.vercel.app.</p>
            </section>

            <section className="space-y-3 rounded-xl bg-white p-4 leading-relaxed ring-1 ring-gray-100">
              <h4 className="text-sm font-semibold text-gray-900">8. Заключительные положения</h4>
              <p>8.1. Оферта вступает в силу с момента её публикации и действует бессрочно.</p>
              <p>8.2. Исполнитель вправе в любое время внести изменения в оферту, опубликовав новую редакцию на сайте.</p>
              <p>8.3. На отношения сторон по настоящему договору применяется законодательство Российской Федерации.</p>
              <p>
                8.4. Все споры и разногласия, возникающие в связи с исполнением настоящего договора, решаются сторонами в досудебном порядке. Пользователь обязан направить
                претензию Исполнителю по адресу электронной почты, указанному в реквизитах, с описанием сути спора. Срок рассмотрения претензии — до 30 (тридцати) рабочих
                дней с момента получения.
              </p>
              <p>
                В случае невозможности урегулирования спора в досудебном порядке, он подлежит рассмотрению в соответствии с действующим законодательством Российской Федерации
                по месту регистрации Исполнителя.
              </p>
            </section>
          </div>
        ),
      },
      {
        key: "privacy",
        title: "Политика конфиденциальности",
        content: (
          <div className="space-y-4 text-sm text-gray-800">
            <section className="rounded-xl bg-white p-4 leading-relaxed ring-1 ring-gray-100">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">Редакция от</p>
              <p className="mt-1 text-base font-semibold text-gray-900">15 января 2026 г.</p>
              <p className="mt-3">
                Настоящая Политика конфиденциальности (далее — «Политика») определяет порядок обработки и защиты персональных данных пользователей сайта
                https://preoffer.vercel.app, а также порядок использования cookie и других технологий отслеживания.
              </p>
              <p>Используя сайт и его сервисы, Пользователь выражает своё согласие с данной Политикой.</p>
            </section>

            <section className="space-y-3 rounded-xl bg-slate-50 p-4 leading-relaxed ring-1 ring-slate-100">
              <h4 className="text-sm font-semibold text-gray-900">1. Общие положения</h4>
              <p>
                1.1. Обработка персональных данных осуществляется в соответствии с Конституцией РФ, Федеральным законом №152-ФЗ «О персональных данных», а также иными
                применимыми нормативно-правовыми актами.
              </p>
              <div className="space-y-1">
                <p className="font-semibold text-gray-900">1.2. Оператором персональных данных является:</p>
                <p>ИП Покрасов Даниил Денисович</p>
                <p>ОГРНИП: 3325762700037505</p>
                <p>ИНН: 760308458432</p>
                <p>Email: pokrasov.04@yandex.ru</p>
              </div>
            </section>

            <section className="space-y-3 rounded-xl bg-white p-4 leading-relaxed ring-1 ring-gray-100">
              <h4 className="text-sm font-semibold text-gray-900">2. Какие данные мы собираем</h4>
              <p>При использовании сайта мы можем собирать следующие категории персональных данных:</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>ФИО (если указано при оплате)</li>
                <li>Email</li>
                <li>Телефон (при наличии)</li>
                <li>Идентификаторы Telegram (если пользователь авторизуется через Telegram)</li>
                <li>Информация о действиях на сайте (журнал посещений, клик, время)</li>
                <li>Платёжные данные (через сторонние платёжные системы — без хранения у нас)</li>
                <li>Cookie-файлы и технические данные браузера/устройства</li>
              </ul>
            </section>

            <section className="space-y-3 rounded-xl bg-slate-50 p-4 leading-relaxed ring-1 ring-slate-100">
              <h4 className="text-sm font-semibold text-gray-900">3. Цели обработки персональных данных</h4>
              <p>Мы собираем данные для следующих целей:</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>Предоставление доступа к сервису EasyOffer</li>
                <li>Регистрация и аутентификация Пользователя</li>
                <li>Обработка платежей и продление подписки</li>
                <li>Поддержка работы сервиса и устранение технических неполадок</li>
                <li>Маркетинг (рассылки, push-уведомления, Telegram-боты)</li>
                <li>Выполнение требований законодательства</li>
              </ul>
            </section>

            <section className="space-y-3 rounded-xl bg-white p-4 leading-relaxed ring-1 ring-gray-100">
              <h4 className="text-sm font-semibold text-gray-900">4. Передача данных третьим лицам</h4>
              <p>4.1. Персональные данные могут быть переданы:</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>платёжным системам (например, ЮKassa, CloudPayments)</li>
                <li>сервисам аналитики (например, Google Analytics, Яндекс.Метрика)</li>
                <li>мессенджерам/ботам (если пользователь авторизуется через Telegram)</li>
                <li>по запросу государственных органов в рамках закона</li>
              </ul>
              <p>4.2. Мы не передаём, не продаём и не раскрываем персональные данные третьим лицам, кроме указанных выше случаев.</p>
            </section>

            <section className="space-y-3 rounded-xl bg-slate-50 p-4 leading-relaxed ring-1 ring-slate-100">
              <h4 className="text-sm font-semibold text-gray-900">5. Cookie и технологии аналитики</h4>
              <p>5.1. Мы используем cookie для:</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>авторизации Пользователя</li>
                <li>запоминания настроек</li>
                <li>аналитики и улучшения работы сервиса</li>
              </ul>
              <p>5.2. Пользователь может отключить cookie в настройках браузера, но это может повлиять на функциональность сайта.</p>
            </section>

            <section className="space-y-3 rounded-xl bg-white p-4 leading-relaxed ring-1 ring-gray-100">
              <h4 className="text-sm font-semibold text-gray-900">6. Хранение и защита данных</h4>
              <p>6.1. Мы применяем административные, организационные и технические меры для защиты данных.</p>
              <p>6.2. Срок хранения данных: до достижения целей обработки или по запросу Пользователя.</p>
              <p>
                6.3. Данные могут храниться на серверах, расположенных на территории Российской Федерации или иных стран с адекватной защитой данных (например, ЕС), если используется зарубежный хостинг.
              </p>
            </section>

            <section className="space-y-3 rounded-xl bg-slate-50 p-4 leading-relaxed ring-1 ring-slate-100">
              <h4 className="text-sm font-semibold text-gray-900">7. Права пользователя</h4>
              <p>Пользователь имеет право:</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>Запросить перечень своих персональных данных</li>
                <li>Потребовать их уточнения, блокировки или удаления</li>
                <li>Отозвать согласие на обработку данных</li>
                <li>Ограничить использование своих данных в маркетинговых целях</li>
                <li>Подать жалобу в Роскомнадзор</li>
              </ul>
            </section>

            <section className="space-y-3 rounded-xl bg-white p-4 leading-relaxed ring-1 ring-gray-100">
              <h4 className="text-sm font-semibold text-gray-900">8. Отзыв согласия и удаление данных</h4>
              <p>Пользователь может отозвать согласие, написав на email: pokrasov.04@yandex.ru.</p>
              <p>Удаление данных производится в течение 10 рабочих дней после подтверждения личности.</p>
            </section>

            <section className="space-y-3 rounded-xl bg-slate-50 p-4 leading-relaxed ring-1 ring-slate-100">
              <h4 className="text-sm font-semibold text-gray-900">9. Изменения в Политике</h4>
              <p>Мы оставляем за собой право вносить изменения в настоящую Политику.</p>
              <p>Актуальная версия всегда доступна по адресу: https://easyoffer.ru/documents/politika-konfidencia.</p>
              <p>Дата последнего обновления указывается в начале документа.</p>
            </section>
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
            <h3 className="text-sm font-medium">Компания</h3>
            <ul className="space-y-2 text-sm">
              {renderLink("О нас", "about")}
            </ul>
          </div>

          {/* 3rd block */}
          <div className="space-y-2 sm:col-span-6 md:col-span-3 lg:col-span-2">
            <h3 className="text-sm font-medium">Поддержка</h3>
            <ul className="space-y-2 text-sm">
              {renderLink("Помочь проекту", "careers")}
              {renderLink("Сообщить об уязвимости", "vulnerability")}
            </ul>
          </div>

          {/* 4th block */}
          <div className="space-y-2 sm:col-span-6 md:col-span-3 lg:col-span-2">
            <h3 className="text-sm font-medium">Документы</h3>
            <ul className="space-y-2 text-sm">
              {renderLink("Договор публичной оферты", "public-offer")}
              {renderLink("Политика конфиденциальности", "privacy")}
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
