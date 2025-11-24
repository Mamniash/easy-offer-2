export type Question = {
  id: string;
  title: string;
  frequency: number;
  level: "Junior" | "Middle" | "Senior";
  format: "Теория" | "Практика" | "Системный дизайн";
  topic: string;
};

export type Track = {
  slug: string;
  title: string;
  description: string;
  professions: string[];
  sampleTasks: string[];
  questions: Question[];
};

export type TrackGroup = {
  title: string;
  tracks: Track[];
};

const programmingQuestions: Question[] = [
  {
    id: "tell-about-yourself",
    title: "Расскажите о себе",
    frequency: 99,
    level: "Junior",
    format: "Теория",
    topic: "Общее",
  },
  {
    id: "event-loop",
    title: "Как работает Event Loop?",
    frequency: 64,
    level: "Middle",
    format: "Теория",
    topic: "JavaScript",
  },
  {
    id: "promise",
    title: "Что такое Promise и как им пользоваться?",
    frequency: 48,
    level: "Junior",
    format: "Теория",
    topic: "JavaScript",
  },
  {
    id: "virtual-dom",
    title: "Что такое Virtual DOM?",
    frequency: 33,
    level: "Middle",
    format: "Практика",
    topic: "React",
  },
  {
    id: "hooks",
    title: "В чем разница между useEffect и useLayoutEffect?",
    frequency: 16,
    level: "Senior",
    format: "Практика",
    topic: "React",
  },
];

const backendQuestions: Question[] = [
  {
    id: "rest-vs-graphql",
    title: "REST или GraphQL — в каких случаях что выбирать?",
    frequency: 58,
    level: "Middle",
    format: "Теория",
    topic: "Архитектура",
  },
  {
    id: "db-indexes",
    title: "Как работают индексы в базе данных?",
    frequency: 44,
    level: "Middle",
    format: "Практика",
    topic: "Базы данных",
  },
  {
    id: "queues",
    title: "Когда использовать очереди сообщений?",
    frequency: 36,
    level: "Senior",
    format: "Системный дизайн",
    topic: "Инфраструктура",
  },
  {
    id: "transactions",
    title: "Какие есть уровни изоляции транзакций?",
    frequency: 28,
    level: "Middle",
    format: "Теория",
    topic: "Базы данных",
  },
  {
    id: "caching",
    title: "Как спроектировать кэширование API?",
    frequency: 21,
    level: "Senior",
    format: "Системный дизайн",
    topic: "Архитектура",
  },
];

const analyticsQuestions: Question[] = [
  {
    id: "product-metrics",
    title: "Какие продуктовые метрики вы отслеживали?",
    frequency: 52,
    level: "Middle",
    format: "Теория",
    topic: "Продукт",
  },
  {
    id: "ab-tests",
    title: "Как подготовить A/B-тест и оценить результат?",
    frequency: 41,
    level: "Middle",
    format: "Практика",
    topic: "Эксперименты",
  },
  {
    id: "sql-window",
    title: "Зачем нужны оконные функции в SQL?",
    frequency: 36,
    level: "Junior",
    format: "Практика",
    topic: "SQL",
  },
  {
    id: "dashboards",
    title: "Как выстраивали продуктовую отчётность?",
    frequency: 27,
    level: "Senior",
    format: "Теория",
    topic: "Продукт",
  },
  {
    id: "causal",
    title: "Как проверяете причинно-следственные связи в данных?",
    frequency: 18,
    level: "Senior",
    format: "Системный дизайн",
    topic: "Эксперименты",
  },
];

const managementQuestions: Question[] = [
  {
    id: "roadmap",
    title: "Как формируете дорожную карту продукта?",
    frequency: 47,
    level: "Middle",
    format: "Теория",
    topic: "Стратегия",
  },
  {
    id: "team-health",
    title: "Как отслеживаете здоровье команды?",
    frequency: 38,
    level: "Middle",
    format: "Практика",
    topic: "Управление",
  },
  {
    id: "delivery",
    title: "Как минимизируете риски срыва релизов?",
    frequency: 33,
    level: "Senior",
    format: "Системный дизайн",
    topic: "Процессы",
  },
  {
    id: "stakeholders",
    title: "Как работаете со стейкхолдерами?",
    frequency: 24,
    level: "Middle",
    format: "Теория",
    topic: "Коммуникации",
  },
  {
    id: "metrics",
    title: "На какие метрики смотрите каждую неделю?",
    frequency: 19,
    level: "Senior",
    format: "Практика",
    topic: "Продукт",
  },
];

export const trackGroups: TrackGroup[] = [
  {
    title: "Программирование",
    tracks: [
      {
        slug: "frontend",
        title: "Frontend",
        description: "HTML, CSS, JavaScript/TypeScript, React",
        professions: ["Web", "Mobile Web", "UI"],
        sampleTasks: ["Landing с таймером", "Подборка UI-компонентов"],
        questions: programmingQuestions,
      },
      {
        slug: "backend",
        title: "Backend",
        description: "Java, Python, Golang, Node.js",
        professions: ["API", "Data", "Platform"],
        sampleTasks: ["REST API", "Очереди сообщений"],
        questions: backendQuestions,
      },
      {
        slug: "mobile",
        title: "Mobile",
        description: "Kotlin, Swift, Flutter",
        professions: ["iOS", "Android", "Cross-platform"],
        sampleTasks: ["Авторизация", "Работа с API"],
        questions: programmingQuestions,
      },
      {
        slug: "devops",
        title: "DevOps",
        description: "CI/CD, Kubernetes, Observability",
        professions: ["Platform", "SRE"],
        sampleTasks: ["Готовим пайплайны", "Обновляем кластер"],
        questions: backendQuestions,
      },
    ],
  },
  {
    title: "Аналитика и Data Science",
    tracks: [
      {
        slug: "data-analytics",
        title: "Data Analytics",
        description: "Продуктовая, бизнес и системная аналитика",
        professions: ["Product", "BI", "Data"],
        sampleTasks: ["Финмодели", "Продуктовые отчёты"],
        questions: analyticsQuestions,
      },
      {
        slug: "data-engineering",
        title: "Data Engineering",
        description: "ETL, хранилища, стриминг",
        professions: ["DWH", "MLOps"],
        sampleTasks: ["ETL-пайплайн", "Качество данных"],
        questions: backendQuestions,
      },
    ],
  },
  {
    title: "Управление",
    tracks: [
      {
        slug: "product-management",
        title: "Product Management",
        description: "Приоритезация, discovery, go-to-market",
        professions: ["Product", "Growth", "Platform"],
        sampleTasks: ["Roadmap", "UX-исследования"],
        questions: managementQuestions,
      },
      {
        slug: "project-management",
        title: "Project Management",
        description: "Запуски, планирование, контроль рисков",
        professions: ["Delivery", "Ops"],
        sampleTasks: ["Коммуникации", "Финансы"],
        questions: managementQuestions,
      },
    ],
  },
];

export const trackMap = trackGroups
  .flatMap((group) => group.tracks)
  .reduce<Record<string, Track>>((acc, track) => {
    acc[track.slug] = track;
    return acc;
  }, {});
