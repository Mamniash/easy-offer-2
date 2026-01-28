"use client";

import { useEffect, useState } from "react";

import { useAuthModal } from "@/components/ui/auth-modal-provider";
import QuestionMarkButtons from "@/components/questions/question-mark-buttons";
import {
  defaultQuestionMarkState,
  getNextQuestionMarkState,
  type QuestionMarkField,
  type QuestionMarkState,
} from "@/lib/question-marks";
import { supabase } from "@/lib/supabaseClient";

type TrainerQuestionActionsProps = {
  questionId: number;
};

export default function TrainerQuestionActions({
  questionId,
}: TrainerQuestionActionsProps) {
  const { open: openAuthModal } = useAuthModal();
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
        console.error("[TrainerQuestionActions] Failed to load marks", error);
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

  const handleToggle = async (field: QuestionMarkField) => {
    if (!userId) {
      openAuthModal();
      return;
    }

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
      console.error("[TrainerQuestionActions] Failed to save mark", error);
      setMarkState(previousState);
    }
  };

  return (
    <div className="mt-6 rounded-2xl border border-gray-200 bg-white/70 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
        Статус вопроса
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <QuestionMarkButtons
          value={markState}
          onToggle={handleToggle}
          disabled={isLoading}
          size="md"
        />
        {!userId && (
          <span className="text-xs text-gray-500">
            Войдите, чтобы сохранять прогресс.
          </span>
        )}
      </div>
    </div>
  );
}
