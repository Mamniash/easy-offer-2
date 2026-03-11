import { supabase } from "@/lib/supabaseClient";

export type TaskDirection = {
  slug: string;
  name: string;
  description: string;
};

export type TaskDirectionGroup = {
  title: string;
  items: TaskDirection[];
};

export type TaskRow = {
  id: number;
  direction: string;
  company_name: string | null;
  task_text: string;
  created_at: string;
};

const TASK_DIRECTIONS: TaskDirection[] = [
  {
    slug: "datascience",
    name: "Data Science",
    description: "ML, статистика и практические кейсы по данным.",
  },
  {
    slug: "qa",
    name: "QA",
    description: "Тестовые сценарии, баги и инженерная практика качества.",
  },
  {
    slug: "devops",
    name: "DevOps",
    description: "CI/CD, контейнеризация, облака и инфраструктурные задачи.",
  },
  {
    slug: "golang",
    name: "Golang",
    description: "Конкурентность, архитектура сервисов и backend-практика.",
  },
  {
    slug: "java",
    name: "Java",
    description: "JVM, backend-разработка и задачи по проектированию.",
  },
  {
    slug: "python",
    name: "Python",
    description: "Алгоритмы, backend и работа с данными на Python.",
  },
  {
    slug: "csharp",
    name: "C#",
    description: ".NET, асинхронность и прикладные инженерные задачи.",
  },
  {
    slug: "android",
    name: "Android",
    description: "Kotlin/Java, lifecycle и мобильные практические задачи.",
  },
  {
    slug: "ios",
    name: "iOS",
    description: "Swift, архитектура приложений и mobile coding-задачи.",
  },
  {
    slug: "frontend",
    name: "Frontend",
    description: "JavaScript/TypeScript, UI и браузерные практические кейсы.",
  },
];

const TASK_SLUG_TO_DIRECTION: Record<string, string> = TASK_DIRECTIONS.reduce(
  (acc, direction) => {
    acc[direction.slug] = direction.name;
    return acc;
  },
  {} as Record<string, string>,
);

export const taskDirectionGroups: TaskDirectionGroup[] = [
  {
    title: "Практические задачи",
    items: TASK_DIRECTIONS,
  },
];

export function getTaskDirection(slug: string): TaskDirection | null {
  return TASK_DIRECTIONS.find((direction) => direction.slug === slug) ?? null;
}

export function taskSlugToDirection(slug: string): string {
  return TASK_SLUG_TO_DIRECTION[slug] ?? slug;
}

export async function getTasksTotal(): Promise<number> {
  const { count, error } = await supabase
    .from("tasks")
    .select("*", { count: "exact", head: true });

  if (error) {
    console.error("[getTasksTotal] Supabase error:", error);
    return 0;
  }

  return count ?? 0;
}

export async function getTasksByDirection(slug: string): Promise<TaskRow[]> {
  const direction = taskSlugToDirection(slug);

  const { data, error } = await supabase
    .from("tasks")
    .select("id,direction,company_name,task_text,created_at")
    .eq("direction", direction)
    .order("id", { ascending: true });

  if (error) {
    console.error("[getTasksByDirection] Supabase error:", error);
    return [];
  }

  return (data ?? []) as TaskRow[];
}
