// lib/tracks.ts
// Лёгкий файл: только мета по трекам и группам направлений.
// Никаких вопросов и огромных строк — всё это теперь живёт в Supabase.

export type TrackQuestion = {
  id: string;
  question: string;
  frequency: number;
  level: "junior" | "middle" | "senior";
  category: string;
  tags?: string[];
  answer?: string;
};

export type TrackStats = {
  questions: number;
  interviews: number;
  updated: string;
};

export type Track = {
  slug: string;
  title: string;
  group: string;
  description: string;
  hero: string;
  stats: TrackStats;
  roles: string[];
  questions: TrackQuestion[]; // заполняем уже на уровне страницы из БД
};

const baseTracks: Omit<Track, "questions">[] = [
  {
    slug: "frontend",
    title: "Frontend",
    group: "Программирование",
    hero: "Вопросы по интерфейсам, браузеру и работе с UI",
    description:
      "Реальные вопросы с фронтенд-собеседований: от базового JavaScript до работы с React и браузерными API.",
    stats: { questions: 0, interviews: 0, updated: "Обновлено сегодня" },
    roles: ["Junior", "Middle", "Senior"],
  },
  {
    slug: "backend",
    title: "Backend",
    group: "Программирование",
    hero: "API, очереди, базы данных и отказоустойчивость",
    description:
      "Подборка общих бэкенд-вопросов: архитектура сервисов, работа с базами, интеграции и эксплуатация.",
    stats: { questions: 0, interviews: 0, updated: "Обновлено сегодня" },
    roles: ["Junior", "Middle", "Senior"],
  },
  {
    slug: "java",
    title: "Java",
    group: "Программирование",
    hero: "Вопросы по JVM, Spring и архитектуре сервисов",
    description:
      "Сборник популярных вопросов: коллекции, транзакции, многопоточность, паттерны и микросервисы.",
    stats: { questions: 0, interviews: 0, updated: "Обновлено сегодня" },
    roles: ["Junior", "Middle", "Senior"],
  },
  {
    slug: "python",
    title: "Python",
    group: "Программирование",
    hero: "Backend на Django/FastAPI и задачи с данными",
    description:
      "Частые темы: декораторы, генераторы, GIL, типы данных, работа с БД и асинхронность.",
    stats: { questions: 0, interviews: 0, updated: "Обновлено сегодня" },
    roles: ["Junior", "Middle"],
  },
  {
    slug: "golang",
    title: "Golang",
    group: "Программирование",
    hero: "Микросервисы, конкуррентность и сети",
    description:
      "Практика по горутинам, каналам, синхронизации, работе с БД и сетевыми протоколами.",
    stats: { questions: 0, interviews: 0, updated: "Обновлено сегодня" },
    roles: ["Middle", "Senior"],
  },
  {
    slug: "php",
    title: "PHP",
    group: "Программирование",
    hero: "Symfony, Laravel и сервисы на PHP",
    description:
      "Актуальные вопросы про версии PHP, ООП, базы данных, Docker и паттерны проектирования.",
    stats: { questions: 0, interviews: 0, updated: "Обновлено сегодня" },
    roles: ["Junior", "Middle", "Senior"],
  },
  {
    slug: "csharp",
    title: "C# / .NET",
    group: "Программирование",
    hero: ".NET, сервисы и интеграции",
    description:
      "Вопросы про async/await, коллекции, многопоточность, принципы SOLID и работу с данными.",
    stats: { questions: 0, interviews: 0, updated: "Обновлено сегодня" },
    roles: ["Junior", "Middle", "Senior"],
  },
  {
    slug: "cpp",
    title: "C/C++",
    group: "Программирование",
    hero: "Системное программирование и перформанс",
    description:
      "Темы по умным указателям, памяти, STL, многопоточности и рабочему процессу в проектах.",
    stats: { questions: 0, interviews: 0, updated: "Обновлено сегодня" },
    roles: ["Junior", "Middle", "Senior"],
  },
  {
    slug: "1c",
    title: "1С разработчик",
    group: "Программирование",
    hero: "Учетные системы, конфигурации и интеграции",
    description:
      "Большой список вопросов по платформе 1С: конфигурации, запросы, индексы и процессы на проектах.",
    stats: { questions: 0, interviews: 0, updated: "Обновлено сегодня" },
    roles: ["Middle", "Senior"],
  },
  {
    slug: "nodejs",
    title: "Node.js",
    group: "Программирование",
    hero: "Node.js сервисы, очереди и JS/TS",
    description:
      "Фокус на опыт работы с Docker, БД, NestJS, очередями и организацией процессов.",
    stats: { questions: 0, interviews: 0, updated: "Обновлено сегодня" },
    roles: ["Junior", "Middle", "Senior"],
  },
  {
    slug: "ios",
    title: "iOS / Swift",
    group: "Программирование",
    hero: "Мобильная разработка под iOS",
    description:
      "Вопросы про ARC, многопоточность, жизненный цикл экранов, типы и ожидания от iOS-разработчиков.",
    stats: { questions: 0, interviews: 0, updated: "Обновлено сегодня" },
    roles: ["Junior", "Middle", "Senior"],
  },
  {
    slug: "android",
    title: "Android",
    group: "Программирование",
    hero: "Android, Kotlin и Java",
    description:
      "Практические вопросы по архитектурам, жизненному циклу, Kotlin и опыту на проектах.",
    stats: { questions: 0, interviews: 0, updated: "Обновлено сегодня" },
    roles: ["Junior", "Middle", "Senior"],
  },
  {
    slug: "flutter",
    title: "Flutter",
    group: "Программирование",
    hero: "Кросс-платформенная мобильная разработка",
    description:
      "Flutter, Dart, состояние, навигация, производительность и опыт продакшн-приложений.",
    stats: { questions: 0, interviews: 0, updated: "Обновлено сегодня" },
    roles: ["Junior", "Middle", "Senior"],
  },
  {
    slug: "unity",
    title: "Unity",
    group: "Программирование",
    hero: "Игровые проекты на Unity",
    description:
      "Вопросы о жизненном цикле, оптимизации, графике, скриптах и организационных моментах.",
    stats: { questions: 0, interviews: 0, updated: "Обновлено сегодня" },
    roles: ["Junior", "Middle"],
  },
  {
    slug: "devops",
    title: "DevOps",
    group: "Программирование",
    hero: "CI/CD, контейнеры и облачная инфраструктура",
    description:
      "Частые вопросы по Docker, Kubernetes, Linux, автоматизации, мониторингу и подходу к разворачиванию.",
    stats: { questions: 0, interviews: 0, updated: "Обновлено сегодня" },
    roles: ["Middle", "Senior"],
  },
  {
    slug: "data-engineer",
    title: "Data Engineer",
    group: "Программирование",
    hero: "ETL, хранилища и потоковые системы",
    description:
      "Темы по хранилищам, потоковой обработке, оптимизации SQL и инфраструктуре данных.",
    stats: { questions: 0, interviews: 0, updated: "Обновлено сегодня" },
    roles: ["Middle", "Senior"],
  },
  {
    slug: "qa",
    title: "QA Тестирование",
    group: "Тестирование",
    hero: "Manual QA, кейсы и баг-репорты",
    description:
      "Вопросы о тест-дизайне, техниках, артефактах и работе с HTTP/REST.",
    stats: { questions: 0, interviews: 0, updated: "Обновлено сегодня" },
    roles: ["Junior", "Middle"],
  },
  {
    slug: "qa-automation",
    title: "QA Automation",
    group: "Тестирование",
    hero: "Автотесты, фреймворки и пайплайны",
    description:
      "Что спрашивают про автотесты: REST, базы, пайплайны, ООП и инструменты автоматизации.",
    stats: { questions: 0, interviews: 0, updated: "Обновлено сегодня" },
    roles: ["Middle", "Senior"],
  },
  {
    slug: "datascience",
    title: "Data Science",
    group: "Аналитика и данные",
    hero: "ML-модели, метрики качества и продакшен пайплайны",
    description:
      "Вопросы про метрики классификации, бустинг, переобучение, SQL и организационные моменты в DS.",
    stats: { questions: 0, interviews: 0, updated: "Обновлено сегодня" },
    roles: ["Junior", "Middle", "Senior"],
  },
  {
    slug: "data-analyst",
    title: "Data Analyst",
    group: "Аналитика и данные",
    hero: "Отчеты, SQL и проверка гипотез",
    description:
      "Список вопросов по SQL, Python, A/B, источникам данных и метрикам.",
    stats: { questions: 0, interviews: 0, updated: "Обновлено сегодня" },
    roles: ["Junior", "Middle"],
  },
  {
    slug: "business-analyst",
    title: "Бизнес-аналитик",
    group: "Аналитика и данные",
    hero: "Требования, процессы и документация",
    description:
      "Подборка вопросов про требования, приоритизацию, интеграции и рабочие процессы аналитика.",
    stats: { questions: 0, interviews: 0, updated: "Обновлено сегодня" },
    roles: ["Middle", "Senior"],
  },
  {
    slug: "system-analyst",
    title: "Системный аналитик",
    group: "Аналитика и данные",
    hero: "Интеграции, схемы и API",
    description:
      "Реальные темы: требования, BPMN, REST, авторизация, архитектуры и работа с БД.",
    stats: { questions: 0, interviews: 0, updated: "Обновлено сегодня" },
    roles: ["Junior", "Middle", "Senior"],
  },
  {
    slug: "data-analytics",
    title: "Аналитик данных",
    group: "Аналитика и данные",
    hero: "Метрики, отчеты и исследования",
    description:
      "Вопросы о SQL, Python, статистике, A/B тестах и практических ситуациях аналитика данных.",
    stats: { questions: 0, interviews: 0, updated: "Обновлено сегодня" },
    roles: ["Junior", "Middle"],
  },
  {
    slug: "product-analytics",
    title: "Продуктовая аналитика",
    group: "Аналитика и данные",
    hero: "Метрики, когортный анализ и эксперименты",
    description:
      "Разбор A/B-тестов, ratio-метрик, ClickHouse, продуктовых метрик и сценариев исследований.",
    stats: { questions: 0, interviews: 0, updated: "Обновлено сегодня" },
    roles: ["Junior", "Middle"],
  },
  {
    slug: "product",
    title: "Product Management",
    group: "Управление",
    hero: "Грейдовые вопросы про стратегию, приоритизацию и метрики",
    description:
      "Реперные вопросы продуктовых собеседований: про роли, процессы, метрики, приоритизацию и работу с командой.",
    stats: { questions: 0, interviews: 0, updated: "Обновлено сегодня" },
    roles: ["Junior", "Middle", "Senior", "Lead"],
  },
  {
    slug: "pm",
    title: "Project Management",
    group: "Управление",
    hero: "Риски, сроки, коммуникация со стейкхолдерами",
    description:
      "Вопросы про управление проектами, команды, бюджеты, конфликты и процессы доставки.",
    stats: { questions: 0, interviews: 0, updated: "Обновлено сегодня" },
    roles: ["Junior", "Middle", "Senior"],
  },
  {
    slug: "lead",
    title: "Team Lead",
    group: "Управление",
    hero: "Лидерство, архитектура и найм",
    description:
      "Темы по управлению командой и техническому лиду. Дополните своим списком вопросов.",
    stats: { questions: 0, interviews: 0, updated: "Обновлено сегодня" },
    roles: ["Senior", "Lead"],
  },
];

export const tracks: Track[] = baseTracks.map((t) => ({
  ...t,
  questions: [],
}));

export const getTrack = (slug: string): Track | undefined =>
  tracks.find((track) => track.slug === slug);

// Используется на /tracks
export const directionGroups: {
  title: string;
  items: { name: string; slug: string; description: string }[];
}[] = [
  {
    title: "Программирование",
    items: [
      {
        name: "Frontend",
        slug: "frontend",
        description: "React, SPA, дизайн-системы и оптимизация UI",
      },
      {
        name: "Java",
        slug: "java",
        description: "JVM, Spring, микросервисы и профилирование",
      },
      {
        name: "Python",
        slug: "python",
        description: "Django, FastAPI, асинхронщина и работа с данными",
      },
      {
        name: "Golang",
        slug: "golang",
        description: "Микросервисы, gRPC, сети и конкурентность",
      },
      {
        name: "Backend",
        slug: "backend",
        description: "API, базы данных, очереди и архитектура",
      },
      {
        name: "PHP",
        slug: "php",
        description: "Symfony, Laravel, сервисы и highload",
      },
      {
        name: "C#",
        slug: "csharp",
        description: ".NET, микросервисы, интеграции и async/await",
      },
      {
        name: "C/C++",
        slug: "cpp",
        description: "Системное программирование, память и перформанс",
      },
      {
        name: "1С разработчик",
        slug: "1c",
        description: "Учетные системы, конфигурации и доработки",
      },
      {
        name: "Node.js",
        slug: "nodejs",
        description: "Node, Express/Nest, TypeScript и сервисы",
      },
      {
        name: "iOS / Swift",
        slug: "ios",
        description: "Swift, UIKit/SwiftUI, мобильные архитектуры",
      },
      {
        name: "Android",
        slug: "android",
        description: "Kotlin/Java, Android SDK, архитектуры и CI",
      },
      {
        name: "Flutter",
        slug: "flutter",
        description: "Flutter, Dart, кросс-платформенные приложения",
      },
      {
        name: "Unity",
        slug: "unity",
        description: "Игровые проекты, C#, рендер и физика",
      },
      {
        name: "DevOps",
        slug: "devops",
        description: "CI/CD, облака, IaC и мониторинг",
      },
      {
        name: "Data Engineer",
        slug: "data-engineer",
        description: "ETL, DWH, стриминг и оркестрация",
      },
    ],
  },
  {
    title: "Тестирование",
    items: [
      {
        name: "QA Тестирование",
        slug: "qa",
        description: "Manual QA, тест-кейсы, баг-репорты и процессы",
      },
      {
        name: "QA Automation",
        slug: "qa-automation",
        description: "Автотесты, фреймворки, CI и стабильность",
      },
    ],
  },
  {
    title: "Аналитика и данные",
    items: [
      {
        name: "Data Science",
        slug: "datascience",
        description: "ML, DS, фреймворки и эксперименты",
      },
      {
        name: "Data Analyst",
        slug: "data-analyst",
        description: "Отчеты, SQL-запросы, визуализации и метрики",
      },
      {
        name: "Бизнес-аналитик",
        slug: "business-analyst",
        description: "Требования, процессы, документация и коммуникации",
      },
      {
        name: "Системный аналитик",
        slug: "system-analyst",
        description: "Интеграции, схемы, API и архитектура",
      },
      {
        name: "Аналитик данных",
        slug: "data-analytics",
        description: "Данные, метрики, SQL и дашборды",
      },
      {
        name: "Продуктовая аналитика",
        slug: "product-analytics",
        description: "Метрики, когортный анализ и A/B тесты",
      },
    ],
  },
  {
    title: "Управление",
    items: [
      {
        name: "Project Management",
        slug: "pm",
        description: "Delivery, планы, риски и процессы",
      },
      {
        name: "Product Management",
        slug: "product",
        description: "Дискавери, гипотезы, рост и метрики",
      },
      {
        name: "Team Lead",
        slug: "lead",
        description: "Команда, архитектура, процессы и наставничество",
      },
    ],
  },
];
