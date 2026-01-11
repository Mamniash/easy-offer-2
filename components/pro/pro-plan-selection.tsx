"use client";

import { useEffect, useState } from "react";

type ProPlan = {
  id: string;
  name: string;
  price: string;
  period: string;
  badge?: string;
  perks: string[];
  emphasis?: boolean;
};

const PLANS: ProPlan[] = [
  {
    id: "week",
    name: "Неделя",
    price: "1 500 ₽",
    period: "на 7 дней",
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
    price: "3 500 ₽",
    period: "на 30 дней",
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
    price: "5 000 ₽",
    period: "на 12 месяцев",
    perks: [
      "Все из «Месяц»",
      "Спец-цена по партнерскому коду",
      "Ранний доступ к обновлениям",
      "Поддержка в чате",
    ],
  },
];

export default function ProPlanSelection() {
  const [selectedPlan, setSelectedPlan] = useState<ProPlan | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", onKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  const openModal = (plan: ProPlan) => {
    setSelectedPlan(plan);
    setIsOpen(true);
  };

  return (
    <div className="mt-12">
      <div className="space-y-2 text-center">
        <h2 className="text-3xl font-bold text-gray-900">
          Тарифы PreOffer PRO
        </h2>
        <p className="text-sm text-gray-600">
          Выбери доступ по времени. Годовой — спец-цена по рекомендации партнёра.
        </p>
      </div>

      <div className="mt-8 flex gap-6 overflow-x-auto pb-4 lg:grid lg:grid-cols-3 lg:overflow-visible lg:pb-0">
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            className={`relative flex h-full min-w-[260px] flex-col rounded-3xl border p-6 shadow-lg transition sm:min-w-[300px] lg:min-w-0 ${
              plan.emphasis
                ? "border-blue-400 bg-gradient-to-br from-blue-600 via-blue-500 to-sky-400 text-white shadow-blue-500/30"
                : "border-slate-800 bg-slate-900 text-white shadow-slate-900/30"
            }`}
          >
            {plan.badge && (
              <span
                className={`absolute left-6 top-6 rounded-full px-3 py-1 text-xs font-semibold ${
                  plan.emphasis
                    ? "bg-white/20 text-white"
                    : "bg-white/10 text-white"
                }`}
              >
                {plan.badge}
              </span>
            )}

            <div className="mt-6">
              <p className="text-sm font-semibold uppercase tracking-wide text-white/70">
                {plan.name}
              </p>
              <p className="mt-3 text-3xl font-bold">{plan.price}</p>
              <p className="mt-1 text-sm text-white/70">
                {plan.period}
              </p>
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

            <button
              type="button"
              onClick={() => openModal(plan)}
              className={`mt-8 inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition ${
                plan.emphasis
                  ? "bg-white text-blue-700 hover:bg-blue-50"
                  : "bg-white text-slate-900 hover:bg-slate-100"
              }`}
            >
              Оформить {plan.name.toLowerCase()}
            </button>
          </div>
        ))}
      </div>

      {isOpen && selectedPlan && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-8"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-gray-400">
              Оплата
            </p>
            <h3 className="mt-2 text-2xl font-bold text-gray-900">
              Подключаем онлайн-кассы
            </h3>
            <p className="mt-3 text-sm text-gray-600">
              Вы выбрали тариф «{selectedPlan.name}». Оплата скоро появится —
              сейчас мы подключаем онлайн-кассы для оформления подписки.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Закрыть
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Хорошо
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
