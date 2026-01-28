"use client";

import { Button, Select } from "antd";
import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { getTrackSkillFilters } from "@/lib/track-skill-filters";
import { useAuthModal } from "@/components/ui/auth-modal-provider";
import { isProUser } from "@/lib/subscription";
import { supabase } from "@/lib/supabaseClient";

const interviewOptions = [
  { label: "Техническое", value: "technical" },
  { label: "HR скрининг", value: "hr" },
  { label: "Финальное", value: "final" },
];

const gradeOptions = [
  { label: "Все", value: "all" },
  { label: "Junior", value: "junior" },
  { label: "Middle", value: "middle" },
  { label: "Senior", value: "senior" },
];

type DirectionGroup = {
  title: string;
  items: { name: string; slug: string; description: string }[];
};

type TrainerSetupFormProps = {
  directionGroups: DirectionGroup[];
};

export default function TrainerSetupForm({
  directionGroups,
}: TrainerSetupFormProps) {
  const router = useRouter();
  const { open: openAuthModal } = useAuthModal();
  const [direction, setDirection] = useState<string | null>(null);
  const [interviewType, setInterviewType] = useState("technical");
  const [grade, setGrade] = useState("all");
  const [skills, setSkills] = useState<string[]>([]);
  const [isPro, setIsPro] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isStarting, setIsStarting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!isMounted) return;

      const { email, user_metadata } = session?.user ?? {};
      const hasPro = isProUser({ email, metadata: user_metadata });
      setIsPro(hasPro);
      setIsAuthorized(Boolean(session?.user));
    };

    fetchSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return;

      const { email, user_metadata } = session?.user ?? {};
      const hasPro = isProUser({ email, metadata: user_metadata });
      setIsPro(hasPro);
      setIsAuthorized(Boolean(session?.user));
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
    [directionGroups]
  );

  const skillOptions = useMemo(() => {
    if (!direction) return [];

    return getTrackSkillFilters(direction).map((skill) => ({
      label: skill.label,
      value: skill.id,
    }));
  }, [direction]);

  const proBadge = (
    <span className="ml-2 rounded-full bg-gray-200 px-2 py-0.5 text-[10px] font-semibold uppercase text-gray-600">
      PRO
    </span>
  );

  const handleProClick = () => {
    if (!isAuthorized) {
      openAuthModal();
      return;
    }

    if (!isPro) {
      router.push("/pro");
    }
  };

  const handleStart = () => {
    if (!direction) return;

    setIsStarting(true);
    const searchParams = new URLSearchParams({ direction });

    if (isPro) {
      searchParams.set("interview", interviewType);
      searchParams.set("grade", grade);
      if (skills.length > 0) {
        searchParams.set("skills", skills.join(","));
      }
    }

    router.push(`/trainer/session?${searchParams.toString()}`);
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-xl">
      <div className="flex flex-col gap-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">
            Направление
          </label>
          <Select
            placeholder="Выберите направление"
            options={directionOptions}
            value={direction}
            onChange={(value) => {
              setDirection(value);
              setSkills([]);
            }}
            size="large"
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center text-sm font-semibold text-gray-700">
            Тип собеседования
            {proBadge}
          </label>
          <div onClick={!isPro ? handleProClick : undefined}>
            <Select
              placeholder="Доступно в PRO"
              options={interviewOptions}
              value={interviewType}
              onChange={setInterviewType}
              size="large"
              disabled={!isPro}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="flex items-center text-sm font-semibold text-gray-700">
            Грейд
            {proBadge}
          </label>
          <div onClick={!isPro ? handleProClick : undefined}>
            <Select
              placeholder="Доступно в PRO"
              options={gradeOptions}
              value={grade}
              onChange={setGrade}
              size="large"
              disabled={!isPro}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="flex items-center text-sm font-semibold text-gray-700">
            Навыки
            {proBadge}
          </label>
          <div
            onClick={!isPro && direction ? handleProClick : undefined}
            onMouseDown={!isPro && direction ? handleProClick : undefined}
          >
            <Select
              placeholder={
                direction
                  ? "Выберите навыки"
                  : "Сначала выберите направление"
              }
              options={skillOptions}
              value={skills}
              onChange={setSkills}
              size="large"
              mode="multiple"
              disabled={!isPro || !direction}
            />
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <span className="text-sm text-gray-500">
          Вопросы будут подбираться случайным образом по выбранному направлению.
        </span>
        <Button
          type="primary"
          size="large"
          disabled={!direction || isStarting}
          onClick={handleStart}
          loading={isStarting}
          className="px-8"
        >
          Начать тренировку
        </Button>
      </div>
    </div>
  );
}
