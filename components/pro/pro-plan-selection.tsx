"use client";

import { Button, Checkbox, Input, Modal } from "antd";
import Link from "next/link";
import { useEffect, useState } from "react";
import { sendSubscriptionToTelegram } from "@/lib/telegram";

type ProPlan = {
  id: string;
  name: string;
  price: string;
  promoPrice?: string;
  period: string;
  billingCycle: string;
  badge?: string;
  perks: string[];
  emphasis?: boolean;
};

type TelegramUserInfo = {
  telegramId: number | null;
  username: string | null;
  firstName: string | null;
  lastName: string | null;
};

type ProPlanSelectionProps = {
  userInfo: TelegramUserInfo;
};

const PLANS: ProPlan[] = [
  {
    id: "week",
    name: "Неделя",
    price: "2 000 ₽",
    period: "на 7 дней",
    billingCycle: "каждые 7 дней",
    perks: [
      "Доступ к выбранному треку",
      "Индекс вопросов + подсказки",
      "План подготовки на 7 дней",
      "Прогресс по темам",
    ],
  },
  {
    id: "month",
    name: "Месяц",
    price: "4 000 ₽",
    period: "на 30 дней",
    billingCycle: "каждые 30 дней",
    badge: "Популярный",
    perks: [
      "Все из «Неделя»",
      "Больше треков и фильтров по грейду",
      "Карта приоритетов по темам",
      "Скидки/промокоды",
    ],
    emphasis: true,
  },
  {
    id: "year",
    name: "Годовой",
    price: "9 990 ₽",
    period: "на 12 месяцев",
    billingCycle: "каждые 12 месяцев",
    perks: [
      "Все из «Месяц»",
      "С промокодом: 7 990 ₽",
      "Ранний доступ к обновлениям",
      "Поддержка в чате",
    ],
    promoPrice: "7 990 ₽",
  },
];

const PLAN_LINKS: Record<string, string | undefined> = {
  week: process.env.LINK_TO_WEEK,
  month: process.env.LINK_TO_MONTH ?? process.env.LINT_TO_MONTH,
  year: process.env.LINK_TO_YEAR,
};

const PROMO_PLAN_LINKS: Record<string, string | undefined> = {
  week: process.env.LINK_TO_WEEK_PROMO,
  month: process.env.LINK_TO_MONTH_PROMO,
  year: process.env.LINK_TO_YEAR_PROMO,
};

const VALID_PROMO_CODES = new Set([
  "promo@alexgrabko",
  "promo@eugene",
  "promo@sherzod",
  "promo@@iopiopovi4",
  "promo@500",
  "promo@nedviga",
]);

export default function ProPlanSelection({ userInfo }: ProPlanSelectionProps) {
  const [selectedPlan, setSelectedPlan] = useState<ProPlan | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);
  const [hasAcceptedRecurring, setHasAcceptedRecurring] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isPaymentOpen = isOpen && Boolean(selectedPlan);

  useEffect(() => {
    if (isOpen) {
      setHasAcceptedTerms(false);
      setHasAcceptedRecurring(false);
      setPromoCode("");
      setIsSubmitting(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") {
        return;
      }

      setIsOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  const openModal = (plan: ProPlan) => {
    setSelectedPlan(plan);
    setIsOpen(true);
  };

  const canPurchase = hasAcceptedTerms && hasAcceptedRecurring;

  const closePaymentModal = () => {
    setIsOpen(false);
  };

  const normalizedPromoCode = promoCode.trim().toLowerCase();
  const isPromoCodeProvided = normalizedPromoCode.length > 0;
  const isPromoCodeValid =
    isPromoCodeProvided && VALID_PROMO_CODES.has(normalizedPromoCode);
  const selectedPlanLink = selectedPlan
    ? (isPromoCodeValid ? PROMO_PLAN_LINKS : PLAN_LINKS)[selectedPlan.id]
    : null;
  const canProceed = canPurchase && Boolean(selectedPlanLink) && !isSubmitting;

  const handlePurchase = async () => {
    if (!selectedPlan || !selectedPlanLink || !canProceed) {
      return;
    }

    setIsSubmitting(true);
    await sendSubscriptionToTelegram({
      planName: selectedPlan.name,
      planPrice: selectedPlan.price,
      promoCode,
      user: userInfo,
    });
    window.location.assign(selectedPlanLink);
  };

  return (
    <div className="mt-12">
      <div className="space-y-2 text-center">
        <h2 className="text-3xl font-bold text-gray-900">
          Тарифы PreOffer PRO
        </h2>
        <p className="text-sm text-gray-600">
          Выбери доступ по времени. Годовой — спец-цена по рекомендации
          партнёра.
        </p>
      </div>

      <div className="mt-8 flex items-stretch gap-6 overflow-x-auto pb-4 lg:grid lg:grid-cols-3 lg:overflow-visible lg:pb-0">
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            className={`relative flex h-full min-w-[260px] flex-col rounded-3xl border p-6 shadow-lg transition sm:min-w-[300px] lg:min-w-0 ${
              plan.emphasis
                ? "border-blue-200/70 bg-gradient-to-br from-blue-600 via-blue-500 to-sky-400 text-white shadow-blue-500/40 ring-2 ring-white/50 ring-offset-2 ring-offset-blue-600"
                : "border-slate-800 bg-slate-900 text-white shadow-slate-900/30"
            }`}
          >
            {plan.badge && (
              <span
                className={`absolute right-6 top-5 rounded-full px-4 py-1.5 text-sm font-semibold uppercase tracking-wide ${
                  plan.emphasis
                    ? "bg-white text-blue-700 shadow-lg shadow-blue-900/20"
                    : "bg-white/10 text-white"
                }`}
              >
                {plan.badge}
              </span>
            )}

            <div className="mt-8">
              <p className="text-sm font-semibold uppercase tracking-wide text-white/70">
                {plan.name}
              </p>
              <div className="mt-3 flex items-baseline gap-2">
                <p className="text-3xl font-bold">{plan.price}</p>
              </div>
              <p className="mt-1 text-sm text-white/70">{plan.period}</p>
            </div>

            <ul className="mt-6 space-y-3 text-sm">
              {plan.perks.map((perk) => (
                <li key={perk} className="flex items-start gap-2">
                  <span
                    className={`mt-1 h-2 w-2 rounded-full ${
                      plan.emphasis ? "bg-white" : "bg-sky-300"
                    }`}
                  />
                  <span className="text-white/90">{perk}</span>
                </li>
              ))}
            </ul>

            <Button
              type="default"
              shape="round"
              onClick={() => openModal(plan)}
              className={`mt-8 px-4 py-2 text-sm font-semibold transition ${
                plan.emphasis
                  ? "!bg-white !text-blue-700 hover:!bg-blue-50"
                  : "!bg-white !text-slate-900 hover:!bg-slate-100"
              }`}
            >
              Оформить {plan.name.toLowerCase()}
            </Button>
          </div>
        ))}
      </div>

      <Modal
        open={isPaymentOpen}
        centered
        onCancel={closePaymentModal}
        footer={null}
        width={480}
        zIndex={1000}
      >
        {selectedPlan ? (
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-gray-400">
              Оплата
            </p>
            <h3 className="mt-2 text-2xl font-bold text-gray-900">
              Оплата подписки
            </h3>
            <p className="mt-3 text-sm text-gray-600">
              Вы выбрали тариф «{selectedPlan.name}». Перед оплатой можно
              указать промокод. После нажатия кнопки вы перейдёте на страницу
              оплаты.
            </p>
            <div className="mt-5 space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Промокод
              </label>
              <Input
                value={promoCode}
                onChange={(event) => setPromoCode(event.target.value)}
                placeholder="Введите промокод"
                status={
                  isPromoCodeProvided && !isPromoCodeValid ? "error" : undefined
                }
              />
              {isPromoCodeProvided && (
                <p
                  className={`text-xs ${
                    isPromoCodeValid ? "text-emerald-600" : "text-rose-500"
                  }`}
                >
                  {isPromoCodeValid
                    ? "Промокод принят. Скидка применена."
                    : "Промокод не найден. Проверьте написание."}
                </p>
              )}
              <p className="text-xs text-gray-500">
                Если промокода нет, оставьте поле пустым — можно продолжать
                оплату.
              </p>
            </div>
            <div className="mt-5 space-y-3 rounded-2xl border border-gray-100 bg-gray-50/60 p-4 text-sm text-gray-700">
              <Checkbox
                checked={hasAcceptedTerms}
                onChange={(event) => setHasAcceptedTerms(event.target.checked)}
                className="items-start"
              >
                <span>
                  Я ознакомлен с Договором публичной оферты и согласен на
                  обработку персональных данных в соответствии с Политикой
                  конфиденциальности.
                </span>
              </Checkbox>
              <div className="ml-6 flex flex-col gap-1 text-xs sm:text-sm">
                <Link
                  href="/documents/public-offer"
                  className="font-medium text-blue-600 hover:text-blue-700"
                >
                  Договор публичной оферты
                </Link>
                <Link
                  href="/documents/privacy"
                  className="font-medium text-blue-600 hover:text-blue-700"
                >
                  Политика конфиденциальности
                </Link>
              </div>
              <Checkbox
                checked={hasAcceptedRecurring}
                onChange={(event) =>
                  setHasAcceptedRecurring(event.target.checked)
                }
                className="items-start"
              >
                <span>
                  Я понимаю, что оплата подписки будет списываться автоматически{" "}
                  {selectedPlan.billingCycle} до отключения автопродления.
                </span>
              </Checkbox>
            </div>
            {!selectedPlanLink && (
              <p className="mt-3 text-xs text-rose-500">
                Ссылка на оплату временно недоступна. Попробуйте чуть позже.
              </p>
            )}
            <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
              <Button
                type="default"
                shape="round"
                onClick={closePaymentModal}
                className="px-4 py-2 text-sm font-semibold"
              >
                Закрыть
              </Button>
              <Button
                type="primary"
                shape="round"
                onClick={handlePurchase}
                disabled={!canProceed}
                loading={isSubmitting}
                className="px-4 py-2 text-sm font-semibold"
              >
                Купить подписку
              </Button>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
