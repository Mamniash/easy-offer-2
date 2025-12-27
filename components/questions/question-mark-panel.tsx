"use client";

import { useEffect, useMemo, useState } from "react";

import {
  defaultQuestionMarkState,
  getNextQuestionMarkState,
  type QuestionMarkField,
  type QuestionMarkState,
} from "@/lib/question-marks";
import { supabase } from "@/lib/supabaseClient";

import QuestionMarkButtons from "./question-mark-buttons";

type QuestionMarkPanelProps = {
  questionId: number;
};

export default function QuestionMarkPanel({ questionId }: QuestionMarkPanelProps) {
  const [userId, setUserId] = useState<string | null>(null);
  const [markState, setMarkState] = useState<QuestionMarkState>(
    defaultQuestionMarkState
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!isMounted) return;

      setUserId(session?.user?.id ?? null);
    };

    fetchSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return;

      setUserId(session?.user?.id ?? null);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchMark = async () => {
      if (!userId) {
        if (isMounted) {
          setMarkState(defaultQuestionMarkState);
          setIsLoading(false);
        }
        return;
      }

      setIsLoading(true);

      const { data, error } = await supabase
        .from("question_marks")
        .select("favorite,known,unknown")
        .eq("user_id", userId)
        .eq("question_id", questionId)
        .maybeSingle();

      if (!isMounted) return;

      if (error) {
        console.error("[QuestionMarkPanel] Failed to load marks", error);
        setMarkState(defaultQuestionMarkState);
      } else if (data) {
        setMarkState({
          favorite: Boolean(data.favorite),
          known: Boolean(data.known),
          unknown: Boolean(data.unknown),
        });
      } else {
        setMarkState(defaultQuestionMarkState);
      }

      setIsLoading(false);
    };

    fetchMark();

    return () => {
      isMounted = false;
    };
  }, [questionId, userId]);

  const title = useMemo(() => {
    if (!userId) {
      return "Войдите, чтобы отмечать статус вопроса";
    }

    if (markState.known) return "Отмечено как известный";
    if (markState.unknown) return "Отмечено как неизвестный";
    if (markState.favorite) return "В избранном";

    return "Поставьте статус вопросу";
  }, [markState, userId]);

  const handleToggle = async (field: QuestionMarkField) => {
    if (!userId) return;

    const previousState = markState;
    const nextState = getNextQuestionMarkState(previousState, field);
    setMarkState(nextState);

    const { error } = await supabase.from("question_marks").upsert(
      {
        user_id: userId,
        question_id: questionId,
        favorite: nextState.favorite,
        known: nextState.known,
        unknown: nextState.unknown,
      },
      {
        onConflict: "user_id,question_id",
      }
    );

    if (error) {
      console.error("[QuestionMarkPanel] Failed to save mark", error);
      setMarkState(previousState);
    }
  };

  return (
    <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
            Мой прогресс
          </p>
          <p className="mt-2 text-base font-semibold text-gray-900">{title}</p>
        </div>
        <QuestionMarkButtons
          value={markState}
          onToggle={handleToggle}
          disabled={!userId || isLoading}
          size="md"
        />
      </div>
      {!userId && (
        <p className="mt-3 text-sm text-gray-500">
          Авторизуйтесь, чтобы сохранять заметки по каждому вопросу.
        </p>
      )}
    </div>
  );
}
