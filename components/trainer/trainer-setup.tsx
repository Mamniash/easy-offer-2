"use client";

import { Button, Select } from "antd";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import { getTrackSkillFilters } from "@/lib/track-skill-filters";
import { directionGroups } from "@/lib/tracks";
import { isProUser } from "@/lib/subscription";
import { supabase } from "@/lib/supabaseClient";
import { useAuthModal } from "@/components/ui/auth-modal-provider";

type Option = {
  label: string;
  value: string;
};

const INTERVIEW_TYPES: Option[] = [
  { label: "Техническое", value: "tech" },
  { label: "HR скрининг", value: "hr" },
  { label: "Финальные", value: "final" },
];

const GRADES: Option[] = [
  { label: "Все", value: "all" },
  { label: "Junior", value: "junior" },
  { label: "Middle", value: "middle" },
  { label: "Senior", value: "senior" },
];

export default function TrainerSetup() {
  const router = useRouter();
  const { open: openAuthModal } = useAuthModal();
  const [selectedDirection, setSelectedDirection] = useState<string | null>(
    null
  );
  const [selectedInterviewType, setSelectedInterviewType] =
    useState<string>("tech");
  const [selectedGrade, setSelectedGrade] = useState<string>("all");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [isPro, setIsPro] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!isMounted) return;

      const { email, user_metadata, id } = session?.user ?? {};
      const hasPro = isProUser({ email, metadata: user_metadata });

      setIsPro(hasPro);
      setUserId(id ?? null);
    };

    fetchSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return;

      const { email, user_metadata, id } = session?.user ?? {};
      const hasPro = isProUser({ email, metadata: user_metadata });

      setIsPro(hasPro);
      setUserId(id ?? null);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const directionOptions = useMemo(
    () =>
      directionGroups.map((group) => ({
        label: group.title,
        options: group.items.map((item) => ({
          label: item.name,
          value: item.slug,
        })),
      })),
    []
  );

  const skillOptions = useMemo(() => {
    if (!selectedDirection) return [];

    return getTrackSkillFilters(selectedDirection).map((filter) => ({
      label: filter.label,
      value: filter.id,
    }));
  }, [selectedDirection]);

  const isProLocked = !isPro;
  const isStartDisabled = !selectedDirection;

  const handleProGate = useCallback(() => {
    if (!isProLocked) return false;

    if (!userId) {
      openAuthModal();
    } else {
      router.push("/pro");
    }

    return true;
  }, [isProLocked, openAuthModal, router, userId]);

  const handleStart = () => {
    if (!selectedDirection) return;

    const params = new URLSearchParams({
      direction: selectedDirection,
    });

    if (selectedInterviewType) {
      params.set("interview", selectedInterviewType);
    }

    if (selectedGrade) {
      params.set("grade", selectedGrade);
    }

    if (selectedSkills.length > 0) {
      params.set("skills", selectedSkills.join(","));
    }

    router.push(`/trainer/session?${params.toString()}`);
  };

  return (
    <section className="pb-20 pt-8 md:pt-10">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-xl">
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.2em] text-blue-600">
              Тренажер вопросов
            </p>
            <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
              Настройка тренажера
            </h1>
            <p className="text-base text-gray-600">
              Выберите направление и параметры тренировки. Дополнительные фильтры
              доступны в PRO-подписке.
            </p>
          </div>

          <div className="mt-8 space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Направление
              </label>
              <Select
                placeholder="Выберите направление"
                options={directionOptions}
                value={selectedDirection}
                onChange={(value) => {
                  setSelectedDirection(value);
                  setSelectedSkills([]);
                }}
                className="w-full"
                size="large"
              />
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <label className="text-sm font-semibold text-gray-700">
                  Тип собеседования
                </label>
                {isProLocked && (
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-gray-500">
                    PRO
                  </span>
                )}
              </div>
              <Select
                placeholder="Техническое / HR / Финальные"
                options={INTERVIEW_TYPES}
                value={selectedInterviewType}
                onChange={setSelectedInterviewType}
                className="w-full"
                size="large"
                onMouseDown={(event) => {
                  if (handleProGate()) {
                    event.preventDefault();
                    event.stopPropagation();
                  }
                }}
              />
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <label className="text-sm font-semibold text-gray-700">
                  Грейд
                </label>
                {isProLocked && (
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-gray-500">
                    PRO
                  </span>
                )}
              </div>
              <Select
                placeholder="Выберите грейд"
                options={GRADES}
                value={selectedGrade}
                onChange={setSelectedGrade}
                className="w-full"
                size="large"
                onMouseDown={(event) => {
                  if (handleProGate()) {
                    event.preventDefault();
                    event.stopPropagation();
                  }
                }}
              />
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <label className="text-sm font-semibold text-gray-700">
                  Навыки
                </label>
                {isProLocked && (
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-gray-500">
                    PRO
                  </span>
                )}
              </div>
              <Select
                placeholder={
                  selectedDirection
                    ? "Выберите навыки"
                    : "Сначала выберите направление"
                }
                options={skillOptions}
                value={selectedSkills}
                onChange={setSelectedSkills}
                className="w-full"
                size="large"
                mode="multiple"
                maxTagCount="responsive"
                disabled={isPro ? !selectedDirection : false}
                onMouseDown={(event) => {
                  if (handleProGate()) {
                    event.preventDefault();
                    event.stopPropagation();
                  }
                }}
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-4">
              <p className="text-sm text-gray-500">
                Вопросы будут подбираться случайным образом по выбранному
                направлению.
              </p>
              <Button
                type="primary"
                size="large"
                disabled={isStartDisabled}
                onClick={handleStart}
                className="rounded-full px-6 font-semibold"
              >
                Начать тренировку
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
