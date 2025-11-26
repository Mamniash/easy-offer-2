// lib/questions.ts
import { supabase } from "@/lib/supabaseClient";

export type QuestionRow = {
  id: number;
  question: string;
  direction: string; // "Frontend" и т.п.
  chance: string; // "22%" — как в таблице
  answer_raw: string | null;
  videos: string | null;
};

// утилита, чтобы из slug сделать значение direction в БД
// если у тебя в таблице direction уже "frontend" / "qa" и т.п. —
// можешь просто вернуть slug как есть.
function slugToDirection(slug: string): string {
  if (!slug) return slug;
  // пример: "frontend" -> "Frontend"
  return slug.charAt(0).toUpperCase() + slug.slice(1);
}

/**
 * Получить пачку вопросов по направлению.
 * page начинается с 1.
 */
export async function getQuestionsByDirection(
  slug: string,
  page = 1,
  perPage = 50
): Promise<{ questions: QuestionRow[]; total: number }> {
  const direction = slugToDirection(slug);

  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  const { data, error, count } = await supabase
    .from("questions")
    .select("*", { count: "exact" })
    .eq("direction", direction)
    .order("id", { ascending: true })
    .range(from, to);

  if (error) {
    console.error("[getQuestionsByDirection] Supabase error:", error);
    return { questions: [], total: 0 };
  }

  return {
    questions: (data ?? []) as QuestionRow[],
    total: count ?? 0,
  };
}

/**
 * Получить один вопрос по его id.
 */
export async function getQuestionById(id: number): Promise<QuestionRow | null> {
  const { data, error } = await supabase
    .from("questions")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("[getQuestionById] Supabase error:", error);
    return null;
  }

  return data as QuestionRow | null;
}
