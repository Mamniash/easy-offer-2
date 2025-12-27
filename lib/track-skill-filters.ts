export type TrackSkillFilter = {
  id: string;
  label: string;
  keywords: string[];
};

const FRONTEND_SKILLS: TrackSkillFilter[] = [
  { id: "javascript", label: "JavaScript", keywords: ["javascript", "js"] },
  { id: "typescript", label: "TypeScript", keywords: ["typescript", "ts"] },
  { id: "react", label: "React", keywords: ["react", "jsx"] },
  { id: "vue", label: "Vue", keywords: ["vue"] },
  { id: "html", label: "HTML", keywords: ["html"] },
  { id: "css", label: "CSS", keywords: ["css"] },
  { id: "browser-api", label: "Browser API", keywords: ["browser api", "dom"] },
  { id: "async", label: "Асинхронность", keywords: ["async", "promise"] },
  { id: "testing", label: "Тестирование", keywords: ["test", "jest"] },
  { id: "bundlers", label: "Сборка", keywords: ["webpack", "vite"] },
];

const BACKEND_SKILLS: TrackSkillFilter[] = [
  { id: "api", label: "API", keywords: ["api", "rest"] },
  { id: "db", label: "Базы данных", keywords: ["database", "sql"] },
  { id: "cache", label: "Кэш", keywords: ["cache", "redis"] },
  { id: "auth", label: "Авторизация", keywords: ["auth", "jwt", "oauth"] },
  { id: "queues", label: "Очереди", keywords: ["queue", "kafka", "rabbit"] },
  { id: "microservices", label: "Микросервисы", keywords: ["microservice"] },
  { id: "deploy", label: "Деплой", keywords: ["docker", "kubernetes"] },
];

const QA_SKILLS: TrackSkillFilter[] = [
  { id: "test-design", label: "Тест-дизайн", keywords: ["test", "case"] },
  { id: "api-testing", label: "API тестирование", keywords: ["api", "rest"] },
  { id: "bug-report", label: "Баг-репорт", keywords: ["bug"] },
  { id: "automation", label: "Автотесты", keywords: ["automation", "selenium"] },
];

const TRACK_SKILL_MAP: Record<string, TrackSkillFilter[]> = {
  frontend: FRONTEND_SKILLS,
  backend: BACKEND_SKILLS,
  qa: QA_SKILLS,
  "qa-automation": QA_SKILLS,
};

export function getTrackSkillFilters(slug: string): TrackSkillFilter[] {
  return TRACK_SKILL_MAP[slug] ?? [];
}
