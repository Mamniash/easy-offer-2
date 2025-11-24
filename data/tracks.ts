export type Question = {
  slug: string;
  title: string;
  frequency: number;
  level: "Junior" | "Middle" | "Senior";
  topic: string;
  answer: string;
  hint?: string;
};

export type Track = {
  slug: string;
  title: string;
  description: string;
  level: string;
  badges: string[];
  questions: Question[];
  stats: {
    interviewCount: number;
    updatedAt: string;
  };
};

export type Direction = {
  slug: string;
  title: string;
  summary: string;
  accent: string;
  badges: string[];
  tracks: Track[];
};

export const directions: Direction[] = [
  {
    slug: "frontend",
    title: "Frontend",
    summary:
      "Интерфейсы на React и TypeScript, архитектура UI и работа с браузером.",
    accent: "from-sky-500 to-blue-500",
    badges: ["Web", "React", "TypeScript"],
    tracks: [
      {
        slug: "react-middle",
        title: "React разработчик",
        description:
          "Динамичные интерфейсы, управление состоянием и продакшн-паттерны.",
        level: "Middle",
        badges: ["React", "SPA", "Team"],
        stats: {
          interviewCount: 742,
          updatedAt: "обновлено 3 дня назад",
        },
        questions: [
          {
            slug: "tell-about-yourself",
            title: "Расскажите о себе",
            frequency: 99,
            level: "Junior",
            topic: "Soft Skills",
            answer:
              "Короткий питч о вашем опыте и стекe с акцентом на проекты и задачи, которые совпадают с вакансией.",
            hint: "1-2 минуты, выделите 2–3 достижения",
          },
          {
            slug: "event-loop",
            title: "Что такое Event Loop?",
            frequency: 77,
            level: "Middle",
            topic: "JavaScript",
            answer:
              "Механизм управления очередями microtasks и macrotasks, который обеспечивает неблокирующее выполнение кода в браузере.",
          },
          {
            slug: "virtual-dom",
            title: "Как работает Virtual DOM?",
            frequency: 64,
            level: "Middle",
            topic: "React",
            answer:
              "Легковесное дерево, синхронизирующееся с реальным DOM через diffing и batching обновлений.",
          },
          {
            slug: "useeffect-vs-uselayouteffect",
            title: "В чем разница между useEffect и useLayoutEffect?",
            frequency: 31,
            level: "Middle",
            topic: "React",
            answer:
              "useEffect запускается после пейнта, а useLayoutEffect — синхронно перед отображением, когда нужен точный доступ к DOM.",
          },
          {
            slug: "cors",
            title: "Что такое CORS?",
            frequency: 26,
            level: "Middle",
            topic: "Web",
            answer:
              "Набор заголовков, разрешающих браузеру делать запросы между источниками согласно политике same-origin.",
          },
          {
            slug: "frontend-architecture",
            title: "Как построить архитектуру крупного фронтенда?",
            frequency: 22,
            level: "Senior",
            topic: "Architecture",
            answer:
              "Модули и контексты, feature-sliced подход, дизайн системы и договоренности по состоянию и API.",
          },
        ],
      },
      {
        slug: "frontend-mobile-web",
        title: "Mobile Web фронтенд",
        description:
          "Оптимизация под мобильные устройства, WebView и перформанс в слабых сетях.",
        level: "Middle",
        badges: ["Performance", "PWA", "UX"],
        stats: {
          interviewCount: 318,
          updatedAt: "обновлено на этой неделе",
        },
        questions: [
          {
            slug: "bundle-optimizations",
            title: "Как уменьшить размер бандла?",
            frequency: 58,
            level: "Middle",
            topic: "Performance",
            answer:
              "Code splitting, динамический импорт, tree shaking и анализ зависимостей в бандлере.",
          },
          {
            slug: "pwa-capabilities",
            title: "Что умеет PWA?",
            frequency: 41,
            level: "Junior",
            topic: "Web",
            answer:
              "Service Worker, офлайн-кэш, web app manifest и push-уведомления для обхода ограничений мобильного браузера.",
          },
          {
            slug: "critical-rendering-path",
            title: "Что такое critical rendering path?",
            frequency: 36,
            level: "Middle",
            topic: "Performance",
            answer:
              "Последовательность разбора HTML/CSS/JS до первого пейна; оптимизируется через минимизацию блокирующих ресурсов.",
          },
        ],
      },
    ],
  },
  {
    slug: "backend",
    title: "Backend",
    summary: "Сервисы, API и устойчивые инфраструктуры для нагруженных систем.",
    accent: "from-indigo-500 to-purple-500",
    badges: ["Golang", "Java", "Microservices"],
    tracks: [
      {
        slug: "java-api",
        title: "Java / Spring API",
        description: "REST и event-driven сервисы на Spring, стабильные SLA и наблюдаемость.",
        level: "Middle",
        badges: ["Spring", "Microservices", "Cloud"],
        stats: {
          interviewCount: 615,
          updatedAt: "обновлено вчера",
        },
        questions: [
          {
            slug: "http-idempotency",
            title: "Что такое идемпотентность HTTP-запросов?",
            frequency: 52,
            level: "Middle",
            topic: "API",
            answer:
              "Свойство метода возвращать одинаковый результат при повторе без побочных эффектов; важно для retry и очередей.",
          },
          {
            slug: "eventual-consistency",
            title: "Когда выбирать eventual consistency?",
            frequency: 37,
            level: "Senior",
            topic: "Architecture",
            answer:
              "Для распределённых систем с высокой доступностью, когда временные расхождения приемлемы, а задержки блокируют бизнес.",
          },
        ],
      },
      {
        slug: "go-observability",
        title: "Go / Observability",
        description: "Метрики, трейсинг и профилирование Go-сервисов в k8s.",
        level: "Senior",
        badges: ["Golang", "Tracing", "SRE"],
        stats: {
          interviewCount: 241,
          updatedAt: "обновлено на прошлой неделе",
        },
        questions: [
          {
            slug: "pprof",
            title: "Как читать pprof?",
            frequency: 44,
            level: "Senior",
            topic: "Performance",
            answer:
              "Снимите profile/heap/trace, определите горячие функции, проверьте блокировки и оптимизируйте аллокации.",
          },
          {
            slug: "golden-signals",
            title: "Что такое Golden Signals?",
            frequency: 31,
            level: "Middle",
            topic: "Monitoring",
            answer: "Latency, Traffic, Errors, Saturation — базовые метрики SRE для оценки состояния сервиса.",
          },
        ],
      },
    ],
  },
  {
    slug: "data",
    title: "Data & Analytics",
    summary: "ML, продакт-аналитика и надежные пайплайны данных.",
    accent: "from-emerald-500 to-teal-500",
    badges: ["Python", "SQL", "ML"],
    tracks: [
      {
        slug: "data-analyst",
        title: "Продакт-аналитик",
        description: "Метрики продукта, юнит-экономика и эксперименты.",
        level: "Middle",
        badges: ["A/B", "SQL", "Metrics"],
        stats: {
          interviewCount: 402,
          updatedAt: "обновлено 5 дней назад",
        },
        questions: [
          {
            slug: "north-star",
            title: "Как определить North Star Metric?",
            frequency: 48,
            level: "Middle",
            topic: "Product",
            answer:
              "Метрика, отражающая ценность для пользователя и рост бизнеса; строится от ключевого сценария продукта.",
          },
          {
            slug: "sql-window",
            title: "Когда использовать оконные функции в SQL?",
            frequency: 33,
            level: "Junior",
            topic: "SQL",
            answer:
              "Для вычислений по окнам без группировки: ранжирование, кумулятивные суммы, сравнение со сдвигом.",
          },
        ],
      },
    ],
  },
  {
    slug: "mobile",
    title: "Мобильная разработка",
    summary: "iOS, Android и кроссплатформенные решения с сильным UX.",
    accent: "from-orange-500 to-amber-500",
    badges: ["iOS", "Android", "Flutter"],
    tracks: [
      {
        slug: "ios-architecture",
        title: "iOS архитектура",
        description: "Swift, UIKit/SwiftUI и подходы к разделению слоёв.",
        level: "Middle",
        badges: ["Swift", "UIKit", "Patterns"],
        stats: {
          interviewCount: 288,
          updatedAt: "обновлено 2 дня назад",
        },
        questions: [
          {
            slug: "mvvm",
            title: "Чем MVVM отличается от MVC?",
            frequency: 46,
            level: "Junior",
            topic: "Architecture",
            answer:
              "ViewModel отделяет бизнес-логику от отображения, упрощая тестирование и переиспользование.",
          },
          {
            slug: "swift-concurrency",
            title: "Как работает Swift Concurrency?",
            frequency: 39,
            level: "Middle",
            topic: "Concurrency",
            answer:
              "async/await, structured concurrency, Task и Actor изолируют состояние и упрощают работу с потоками.",
          },
        ],
      },
    ],
  },
  {
    slug: "management",
    title: "Управление",
    summary: "Продукт, проекты и тимлидство с акцентом на процессы.",
    accent: "from-fuchsia-500 to-rose-500",
    badges: ["Product", "Project", "People"],
    tracks: [
      {
        slug: "product-management",
        title: "Продуктовый менеджмент",
        description: "Discovery, приоритизация и управление roadmap.",
        level: "Middle",
        badges: ["Discovery", "Stakeholders", "Metrics"],
        stats: {
          interviewCount: 537,
          updatedAt: "обновлено 4 дня назад",
        },
        questions: [
          {
            slug: "ice-framework",
            title: "Как работает ICE-фреймворк приоритизации?",
            frequency: 42,
            level: "Middle",
            topic: "Prioritization",
            answer:
              "Impact, Confidence, Effort — оцениваем ценность, уверенность и сложность, чтобы ранжировать инициативы.",
          },
          {
            slug: "user-interview",
            title: "Как готовить пользовательское интервью?",
            frequency: 36,
            level: "Junior",
            topic: "Research",
            answer:
              "Цели, сценарий, скрининг респондентов, нейтральные вопросы и фиксация инсайтов для последующей синтезации.",
          },
        ],
      },
    ],
  },
];

export function getDirection(slug: string) {
  return directions.find((direction) => direction.slug === slug);
}

export function getTrack(directionSlug: string, trackSlug: string) {
  const direction = getDirection(directionSlug);

  if (!direction) return undefined;

  return direction.tracks.find((track) => track.slug === trackSlug);
}

export function getQuestion(
  directionSlug: string,
  trackSlug: string,
  questionSlug: string,
) {
  const track = getTrack(directionSlug, trackSlug);

  if (!track) return undefined;

  return track.questions.find((question) => question.slug === questionSlug);
}
