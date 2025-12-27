"use client";

import type React from "react";

import type {
  QuestionMarkField,
  QuestionMarkState,
} from "@/lib/question-marks";

const BUTTON_STYLES = {
  base: "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold transition",
  active: "border-blue-200 bg-blue-50 text-blue-700",
  inactive: "border-gray-200 bg-white text-gray-600 hover:border-gray-300",
  disabled: "cursor-not-allowed opacity-60",
};

const LABELS: Record<QuestionMarkField, string> = {
  favorite: "В избранное",
  known: "Знаю",
  unknown: "Не знаю",
};

const ICONS: Record<QuestionMarkField, string> = {
  favorite: "⭐",
  known: "✅",
  unknown: "❓",
};

type QuestionMarkButtonsProps = {
  value: QuestionMarkState;
  onToggle: (field: QuestionMarkField) => void;
  disabled?: boolean;
  stopPropagation?: boolean;
  size?: "sm" | "md";
};

export default function QuestionMarkButtons({
  value,
  onToggle,
  disabled = false,
  stopPropagation = false,
  size = "sm",
}: QuestionMarkButtonsProps) {
  const textClassName = size === "md" ? "text-sm" : "text-xs";
  const paddingClassName = size === "md" ? "px-4 py-2" : "px-3 py-1";

  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    field: QuestionMarkField
  ) => {
    if (stopPropagation) {
      event.preventDefault();
      event.stopPropagation();
    }

    onToggle(field);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {(Object.keys(LABELS) as QuestionMarkField[]).map((field) => {
        const isActive = value[field];

        return (
          <button
            key={field}
            type="button"
            onClick={(event) => handleClick(event, field)}
            disabled={disabled}
            className={[
              BUTTON_STYLES.base,
              paddingClassName,
              textClassName,
              isActive ? BUTTON_STYLES.active : BUTTON_STYLES.inactive,
              disabled ? BUTTON_STYLES.disabled : "",
            ]
              .filter(Boolean)
              .join(" ")}
            aria-pressed={isActive}
          >
            <span aria-hidden>{ICONS[field]}</span>
            {LABELS[field]}
          </button>
        );
      })}
    </div>
  );
}
