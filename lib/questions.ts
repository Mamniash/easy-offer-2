// lib/questions.ts
import { supabase } from "@/lib/supabaseClient";
import type { TrackQuestion } from "@/lib/tracks";

export type QuestionRow = {
  id: number;
  question: string;
  direction: string; // "Frontend", "Java", "QA Manual" и т.д.
  chance: string; // "99%"
  answer_raw: string | null;
  videos: string | null;
};

/**
 * Преобразуем строку из БД в объект, который удобно показывать на фронте.
 */
export function mapQuestionRowToTrackQuestion(row: QuestionRow): TrackQuestion {
  const match = row.chance.match(/(\d+)/);
  const frequency = match ? Number(match[1]) : 0;

  let level: "junior" | "middle" | "senior";
  if (frequency >= 70) level = "junior";
  else if (frequency >= 40) level = "middle";
  else level = "senior";

  return {
    id: String(row.id),
    question: row.question,
    frequency,
    level,
    category: row.direction,
    answer: row.answer_raw ?? undefined,
  };
}

// Маппинг slug (из URL) -> direction (строка в колонке direction в БД)
const SLUG_TO_DIRECTION: Record<string, string> = {
  // разработка
  frontend: "Frontend",
  "frontend-developer": "Frontend",

  java: "Java",
  "java-developer": "Java",

  python: "Python",
  "python-developer": "Python",

  golang: "Golang",
  "golang-developer": "Golang",

  php: "PHP",
  "php-developer": "PHP",

  csharp: "C#",
  "c-sharp-developer": "C#",

  cpp: "C++",
  "c-plus-developer": "C++",

  "1c": "1C",
  "1c-developer": "1C",

  nodejs: "Node.js",
  "nodejs-developer": "Node.js",

  ios: "iOS",
  "ios-developer": "iOS",

  android: "Android",
  "android-developer": "Android",

  flutter: "Flutter",
  "flutter-developer": "Flutter",

  unity: "Unity",
  "unity-developer": "Unity",

  devops: "DevOps",

  "data-engineer": "Data Engineer",

  // тестирование
  qa: "QA Manual",
  "qa-testirovshik": "QA Manual",

  "qa-automation": "QA Automation",

  // DS / аналитика
  datascience: "Data Scientist",
  "data-scientist": "Data Scientist",

  "business-analyst": "Business Analyst",
  "system-analyst": "System Analyst",

  "data-analyst": "Data Analyst",
  "data-analytics": "Data Analyst",

  "product-analytics": "Product Analyst",

  // менеджмент — тут маппим на те названия, которые у тебя в таблице
  pm: "IT Project Manager",
  "it-project-manager": "IT Project Manager",

  product: "IT Product Manager",
  "it-product-manger": "IT Product Manager",
};

export function slugToDirection(slug: string): string {
  return SLUG_TO_DIRECTION[slug] ?? slug;
}

// videos: "url1 | url2 | url3" -> ["url1", "url2", "url3"]
export function parseVideosField(videos: string | null): string[] {
  if (!videos) return [];
  if (videos === "EMPTY" || videos === "error") return [];

  return videos
    .split("|")
    .map((s) => s.trim())
    .filter(Boolean);
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

export async function getQuestionsTotal(): Promise<number> {
  const { count, error } = await supabase
    .from("questions")
    .select("*", { count: "exact", head: true });

  if (error) {
    console.error("[getQuestionsTotal] Supabase error:", error);
    return 0;
  }

  return count ?? 0;
}

/**
 * Получить один вопрос по id.
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
