import { questionData, type RawQuestion } from "./question-data";

export type TrackQuestion = {
  id: string;
  question: string;
  frequency: number;
  level: "junior" | "middle" | "senior";
  category: string;
  tags?: string[];
  answer?: string;
};

export type Track = {
  slug: string;
  title: string;
  group: string;
  description: string;
  hero: string;
  stats: {
    questions: number;
    interviews: number;
    updated: string;
  };
  roles: string[];
  questions: TrackQuestion[];
};

export const directionGroups: {
  title: string;
  items: { name: string; slug: string; description: string }[];
}[] = [
  {
    title: "Программирование",
    items: [
      { name: "Frontend", slug: "frontend", description: "React, SPA и UI" },
      { name: "Java", slug: "java", description: "JVM, Spring, сервисы" },
      { name: "Python", slug: "python", description: "Django, FastAPI, data" },
      { name: "Golang", slug: "golang", description: "Микросервисы и сети" },
      { name: "Backend", slug: "backend", description: "API, базы, очереди" },
      { name: "PHP", slug: "php", description: "Symfony, Laravel, сервисы" },
      { name: "C#", slug: "csharp", description: ".NET, сервисы, интеграции" },
      { name: "C/C++", slug: "cpp", description: "Системное и перформанс" },
      { name: "1С разработчик", slug: "1c", description: "Учетные системы, доработки" },
      { name: "Node.js", slug: "nodejs", description: "Node, сервисы, JS/TS" },
      { name: "iOS / Swift", slug: "ios", description: "Мобильная разработка" },
      { name: "Android", slug: "android", description: "Kotlin, Java, mobile" },
      { name: "Flutter", slug: "flutter", description: "Dart, mobile" },
      { name: "Unity", slug: "unity", description: "Игровые проекты" },
      { name: "DevOps", slug: "devops", description: "CI/CD и инфраструктура" },
      { name: "Data Engineer", slug: "data-engineer", description: "ETL, DWH" },
    ],
  },
  {
    title: "Тестирование",
    items: [
      { name: "QA Тестирование", slug: "qa", description: "Manual QA, кейсы" },
      { name: "QA Automation", slug: "qa-automation", description: "Автотесты и фреймворки" },
    ],
  },
  {
    title: "Аналитика и данные",
    items: [
      { name: "Data Science", slug: "datascience", description: "ML, DS" },
      { name: "Data Analyst", slug: "data-analyst", description: "Отчеты, запросы" },
      { name: "Бизнес-аналитик", slug: "business-analyst", description: "Требования и процессы" },
      { name: "Системный аналитик", slug: "system-analyst", description: "Интеграции и схемы" },
      { name: "Аналитик данных", slug: "data-analytics", description: "Данные и метрики" },
      { name: "Продуктовая аналитика", slug: "product-analytics", description: "Метрики и A/B" },
    ],
  },
  {
    title: "Управление",
    items: [
      { name: "Project Management", slug: "pm", description: "Delivery и процессы" },
      { name: "Product Management", slug: "product", description: "Дискавери и рост" },
      { name: "Team Lead", slug: "lead", description: "Команда и архитектура" },
    ],
  },
];

const normalizeId = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9а-яё]+/gi, "-")
    .replace(/-+/g, "-")
    .replace(/(^-|-$)/g, "");

const frequencyToLevel = (frequency: number): TrackQuestion["level"] => {
  if (frequency >= 70) return "junior";
  if (frequency >= 40) return "middle";
  return "senior";
};

const buildQuestions = (
  items: RawQuestion[] | undefined,
  category = "Основное"
): TrackQuestion[] => {
  if (!items?.length) return [];

  return items.map(({ question, frequency, level, tags }) => ({
    id: normalizeId(question),
    question,
    frequency,
    level: level ?? frequencyToLevel(frequency),
    category,
    tags,
  }));
};

const fallbackQuestions: TrackQuestion[] = [
  {
    id: "about",
    question: "Расскажи о себе и ключевых результатах",
    frequency: 48,
    level: "junior",
    category: "Общее",
  },
  {
    id: "project",
    question: "Какой вклад внес в последний проект?",
    frequency: 37,
    level: "middle",
    category: "Практика",
  },
  {
    id: "priority",
    question: "Как приоритизируешь задачи в сжатые сроки?",
    frequency: 26,
    level: "senior",
    category: "Процессы",
  },
];

const getQuestions = (slug: string, category?: string) => {
  const data = buildQuestions(questionData[slug], category ?? "Основное");

  return data.length ? data : fallbackQuestions;
};

const questionsByTrack = Object.fromEntries(
  [
    ["frontend", "Frontend"],
    ["java", "Java"],
    ["python", "Python"],
    ["golang", "Golang"],
    ["backend", "Backend"],
    ["php", "PHP"],
    ["csharp", "C#"],
    ["cpp", "C/C++"],
    ["1c", "1С"],
    ["nodejs", "Node.js"],
    ["ios", "iOS / Swift"],
    ["android", "Android"],
    ["flutter", "Flutter"],
    ["unity", "Unity"],
    ["devops", "DevOps"],
    ["data-engineer", "Data Engineer"],
    ["qa", "QA"],
    ["qa-automation", "QA Automation"],
    ["datascience", "Data Science"],
    ["data-analyst", "Data Analyst"],
    ["business-analyst", "Бизнес-анализ"],
    ["system-analyst", "Системная аналитика"],
    ["data-analytics", "Аналитика данных"],
    ["product-analytics", "Продуктовая аналитика"],
    ["product", "Product Management"],
    ["pm", "Project Management"],
    ["lead", "Team Lead"],
  ].map(([slug, category]) => [slug, getQuestions(slug, category)])
) as Record<string, TrackQuestion[]>;

export const tracks: Track[] = [
  {
    slug: "frontend",
    title: "Frontend",
    group: "Программирование",
    hero: "Вопросы по интерфейсам, браузеру и работе с UI",
    description:
      "Вопросы по JavaScript, браузеру и фреймворкам на основе реальных собеседований. Частоты помогают понять, что спрашивают чаще всего.",
    stats: {
      questions: questionsByTrack.frontend.length,
      interviews: 749,
      updated: "Обновлено 2 недели назад",
    },
    roles: ["Junior", "Middle", "Senior"],
    questions: questionsByTrack.frontend,
  },
  {
    slug: "backend",
    title: "Backend",
    group: "Программирование",
    hero: "API, очереди, базы данных и отказоустойчивость",
    description:
      "Собрали популярные вопросы про проектирование API, очереди и работу с базами, чтобы можно было готовиться по свежим темам.",
    stats: {
      questions: questionsByTrack.backend.length,
      interviews: 540,
      updated: "Обновлено по последним интервью",
    },
    roles: ["Junior", "Middle", "Senior"],
    questions: questionsByTrack.backend,
  },
  {
    slug: "python",
    title: "Python",
    group: "Программирование",
    hero: "Backend на Django/FastAPI и задачи с данными",
    description:
      "Частотные вопросы про Python: синтаксис, асинхронность, базы данных и практику применения языка.",
    stats: {
      questions: questionsByTrack.python.length,
      interviews: 410,
      updated: "Обновлено по демо-набору",
    },
    roles: ["Junior", "Middle"],
    questions: questionsByTrack.python,
  },
  {
    slug: "golang",
    title: "Golang",
    group: "Программирование",
    hero: "Микросервисы, конкуррентность и сети",
    description:
      "Список вопросов по Go: конкурентность, каналы, работа с памятью и практический опыт в сервисах.",
    stats: {
      questions: questionsByTrack.golang.length,
      interviews: 300,
      updated: "Обновлено по демо-набору",
    },
    roles: ["Middle", "Senior"],
    questions: questionsByTrack.golang,
  },
  {
    slug: "php",
    title: "PHP",
    group: "Программирование",
    hero: "Symfony, Laravel и сервисы на PHP",
    description:
      "Вопросы по PHP, фреймворкам, базам и архитектуре сервисов на основе реальных интервью.",
    stats: {
      questions: questionsByTrack.php.length,
      interviews: 290,
      updated: "Обновлено по демо-набору",
    },
    roles: ["Junior", "Middle", "Senior"],
    questions: questionsByTrack.php,
  },
  {
    slug: "csharp",
    title: "C# / .NET",
    group: "Программирование",
    hero: ".NET, сервисы и интеграции",
    description:
      "Часто задаваемые вопросы по C#: CLR, многопоточность, паттерны и работа с базами.",
    stats: {
      questions: questionsByTrack.csharp.length,
      interviews: 360,
      updated: "Обновлено по демо-набору",
    },
    roles: ["Junior", "Middle", "Senior"],
    questions: questionsByTrack.csharp,
  },
  {
    slug: "cpp",
    title: "C/C++",
    group: "Программирование",
    hero: "Системное программирование и перформанс",
    description:
      "Реальные вопросы по C/C++: память, STL, многопоточность и опыт системной разработки.",
    stats: {
      questions: questionsByTrack.cpp.length,
      interviews: 250,
      updated: "Обновлено по демо-набору",
    },
    roles: ["Junior", "Middle", "Senior"],
    questions: questionsByTrack.cpp,
  },
  {
    slug: "1c",
    title: "1С разработчик",
    group: "Программирование",
    hero: "Учетные системы, конфигурации и интеграции",
    description:
      "Частые вопросы по 1С: платформа, конфигурации, индексы, обмены и администрирование.",
    stats: {
      questions: questionsByTrack["1c"].length,
      interviews: 190,
      updated: "Обновлено по демо-набору",
    },
    roles: ["Middle", "Senior"],
    questions: questionsByTrack["1c"],
  },
  {
    slug: "nodejs",
    title: "Node.js",
    group: "Программирование",
    hero: "Node.js сервисы, очереди и JS/TS",
    description:
      "Список вопросов по Node.js: event loop, очереди, базы данных и работа с TypeScript.",
    stats: {
      questions: questionsByTrack.nodejs.length,
      interviews: 310,
      updated: "Обновлено по демо-набору",
    },
    roles: ["Junior", "Middle", "Senior"],
    questions: questionsByTrack.nodejs,
  },
  {
    slug: "ios",
    title: "iOS / Swift",
    group: "Программирование",
    hero: "Мобильная разработка под iOS",
    description:
      "Вопросы по Swift, жизненному циклу, архитектурам и работе с сетью на iOS собеседованиях.",
    stats: {
      questions: questionsByTrack.ios.length,
      interviews: 230,
      updated: "Обновлено по демо-набору",
    },
    roles: ["Junior", "Middle", "Senior"],
    questions: questionsByTrack.ios,
  },
  {
    slug: "android",
    title: "Android",
    group: "Программирование",
    hero: "Android, Kotlin и Java",
    description:
      "Подборка вопросов по Android: жизненный цикл, архитектуры, корутины и тестирование приложений.",
    stats: {
      questions: questionsByTrack.android.length,
      interviews: 240,
      updated: "Обновлено по демо-набору",
    },
    roles: ["Junior", "Middle", "Senior"],
    questions: questionsByTrack.android,
  },
  {
    slug: "flutter",
    title: "Flutter",
    group: "Программирование",
    hero: "Flutter, Dart и создание кроссплатформенных приложений",
    description:
      "Частые вопросы по Flutter: виджеты, изоляты, null safety, менеджмент состояния и опыт проектов.",
    stats: {
      questions: questionsByTrack.flutter.length,
      interviews: 180,
      updated: "Обновлено по демо-набору",
    },
    roles: ["Junior", "Middle", "Senior"],
    questions: questionsByTrack.flutter,
  },
  {
    slug: "unity",
    title: "Unity",
    group: "Программирование",
    hero: "Игровые проекты на Unity",
    description:
      "Вопросы по Unity: жизненный цикл, оптимизация, графика, паттерны и организация командной работы.",
    stats: {
      questions: questionsByTrack.unity.length,
      interviews: 170,
      updated: "Обновлено по демо-набору",
    },
    roles: ["Junior", "Middle"],
    questions: questionsByTrack.unity,
  },
  {
    slug: "devops",
    title: "DevOps",
    group: "Программирование",
    hero: "CI/CD, контейнеры и облачная инфраструктура",
    description:
      "Вопросы по DevOps: Docker, Kubernetes, CI/CD, мониторинг и практика автоматизации.",
    stats: {
      questions: questionsByTrack.devops.length,
      interviews: 380,
      updated: "Обновлено по демо-набору",
    },
    roles: ["Middle", "Senior"],
    questions: questionsByTrack.devops,
  },
  {
    slug: "java",
    title: "Java",
    group: "Программирование",
    hero: "Вопросы по JVM, Spring и архитектуре сервисов",
    description:
      "Полный список частых вопросов по Java, Spring, коллекциям, многопоточности и архитектуре сервисов.",
    stats: {
      questions: questionsByTrack.java.length,
      interviews: 610,
      updated: "Обновлено 5 дней назад",
    },
    roles: ["Junior", "Middle", "Senior"],
    questions: questionsByTrack.java,
  },
  {
    slug: "qa",
    title: "QA Тестирование",
    group: "Тестирование",
    hero: "Manual QA, кейсы и баг-репорты",
    description:
      "Полный список вопросов для QA: тест-дизайн, документация, процессы и работа с багами.",
    stats: {
      questions: questionsByTrack.qa.length,
      interviews: 210,
      updated: "Обновлено по демо-набору",
    },
    roles: ["Junior", "Middle"],
    questions: questionsByTrack.qa,
  },
  {
    slug: "qa-automation",
    title: "QA Automation",
    group: "Тестирование",
    hero: "Автотесты, фреймворки и пайплайны",
    description:
      "Вопросы для AQA: фреймворки, REST, БД, подходы к тест-дизайну и интеграции в CI/CD.",
    stats: {
      questions: questionsByTrack["qa-automation"].length,
      interviews: 230,
      updated: "Обновлено по демо-набору",
    },
    roles: ["Middle", "Senior"],
    questions: questionsByTrack["qa-automation"],
  },
  {
    slug: "datascience",
    title: "Data Science",
    group: "Аналитика и данные",
    hero: "ML-модели, метрики качества и продакшен пайплайны",
    description:
      "Вопросы по Data Science: метрики, модели, эксперименты и вывод в прод.",
    stats: {
      questions: questionsByTrack.datascience.length,
      interviews: 320,
      updated: "Обновлено по демо-набору",
    },
    roles: ["Junior", "Middle", "Senior"],
    questions: questionsByTrack.datascience,
  },
  {
    slug: "data-analyst",
    title: "Data Analyst",
    group: "Аналитика и данные",
    hero: "Отчеты, SQL и проверка гипотез",
    description:
      "Вопросы по аналитике данных: SQL, визуализации, метрики и проверка гипотез.",
    stats: {
      questions: questionsByTrack["data-analyst"].length,
      interviews: 310,
      updated: "Обновлено по демо-набору",
    },
    roles: ["Junior", "Middle"],
    questions: questionsByTrack["data-analyst"],
  },
  {
    slug: "business-analyst",
    title: "Бизнес-аналитик",
    group: "Аналитика и данные",
    hero: "Требования, процессы и документация",
    description:
      "Вопросы по бизнес-анализу: требования, процессы, коммуникации со стейкхолдерами и документация.",
    stats: {
      questions: questionsByTrack["business-analyst"].length,
      interviews: 220,
      updated: "Обновлено по демо-набору",
    },
    roles: ["Middle", "Senior"],
    questions: questionsByTrack["business-analyst"],
  },
  {
    slug: "system-analyst",
    title: "Системный аналитик",
    group: "Аналитика и данные",
    hero: "Интеграции, схемы и API",
    description:
      "Вопросы по системному анализу: интеграции, требования, архитектуры и работа с командами.",
    stats: {
      questions: questionsByTrack["system-analyst"].length,
      interviews: 240,
      updated: "Обновлено по демо-набору",
    },
    roles: ["Junior", "Middle", "Senior"],
    questions: questionsByTrack["system-analyst"],
  },
  {
    slug: "data-analytics",
    title: "Аналитик данных",
    group: "Аналитика и данные",
    hero: "Метрики, отчеты и исследования",
    description:
      "Вопросы по аналитике данных: метрики, отчеты, статистика и подготовка данных.",
    stats: {
      questions: questionsByTrack["data-analytics"].length,
      interviews: 230,
      updated: "Обновлено по демо-набору",
    },
    roles: ["Junior", "Middle"],
    questions: questionsByTrack["data-analytics"],
  },
  {
    slug: "data-engineer",
    title: "Data Engineer",
    group: "Программирование",
    hero: "ETL, хранилища и потоковые системы",
    description:
      "Вопросы для дата-инженеров: DWH, очереди, индексы, стриминг и архитектура данных.",
    stats: {
      questions: questionsByTrack["data-engineer"].length,
      interviews: 350,
      updated: "Обновлено по демо-набору",
    },
    roles: ["Middle", "Senior"],
    questions: questionsByTrack["data-engineer"],
  },
  {
    slug: "product-analytics",
    title: "Продуктовая аналитика",
    group: "Аналитика и данные",
    hero: "Метрики, когортный анализ и эксперименты",
    description:
      "Вопросы по продуктовой аналитике: A/B тесты, метрики, интерпретация результатов и SQL.",
    stats: {
      questions: questionsByTrack["product-analytics"].length,
      interviews: 300,
      updated: "Обновлено по демо-набору",
    },
    roles: ["Junior", "Middle"],
    questions: questionsByTrack["product-analytics"],
  },
  {
    slug: "product",
    title: "Product Management",
    group: "Управление",
    hero: "Грейдовые вопросы про стратегию, приоритизацию и метрики",
    description:
      "Вопросы для продуктовых менеджеров: стратегия, приоритизация, исследования и работа с командами.",
    stats: {
      questions: questionsByTrack.product.length,
      interviews: 260,
      updated: "Обновлено 3 дня назад",
    },
    roles: ["Junior", "Middle", "Senior", "Lead"],
    questions: questionsByTrack.product,
  },
  {
    slug: "pm",
    title: "Project Management",
    group: "Управление",
    hero: "Риски, сроки, коммуникация со стейкхолдерами",
    description:
      "Вопросы для проектных менеджеров: планирование, риски, коммуникации и работа с командой.",
    stats: {
      questions: questionsByTrack.pm.length,
      interviews: 180,
      updated: "Обновлено по демо-набору",
    },
    roles: ["Junior", "Middle", "Senior"],
    questions: questionsByTrack.pm,
  },
  {
    slug: "lead",
    title: "Team Lead",
    group: "Управление",
    hero: "Лидерство, архитектура и найм",
    description:
      "Ключевые вопросы для тимлидов: процессы, управление, архитектурные решения и рост команды.",
    stats: {
      questions: questionsByTrack.lead.length,
      interviews: 200,
      updated: "Обновлено по демо-набору",
    },
    roles: ["Senior", "Lead"],
    questions: questionsByTrack.lead,
  },
];

export const getTrack = (slug: string) => tracks.find((track) => track.slug === slug);

export const getQuestion = (slug: string, questionId: string) => {
  const track = getTrack(slug);

  if (!track) return null;

  const question = track.questions.find((item) => item.id === questionId);

  if (!question) return null;

  return { track, question };
};
