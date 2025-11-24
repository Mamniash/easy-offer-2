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

const genericQuestions: TrackQuestion[] = [
  {
    id: "intro",
    question: "Расскажите про последний проект и вклад",
    frequency: 72,
    level: "junior",
    category: "Общее",
    tags: ["софт", "продукт"],
    answer:
      "Дайте 3-4 предложения: контекст, ваша роль, ключевой результат, метрика. Закончите тем, что хотите развивать дальше.",
  },
  {
    id: "risk",
    question: "Как решали самый сложный инцидент за год?",
    frequency: 41,
    level: "middle",
    category: "Практика",
    tags: ["инциденты", "решения"],
    answer:
      "Опишите что случилось, как диагностировали, кого привлекали и какой ранбук обновили. Укажите, что улучшили, чтобы не повторилось.",
  },
  {
    id: "roadmap",
    question: "Как приоритизируете задачи, когда всё горит?",
    frequency: 28,
    level: "senior",
    category: "Процессы",
    tags: ["приоритизация"],
    answer:
      "Скажите про критерии: влияние, риск, дедлайны, зависимости. Покажите, как синхронизируете стейкхолдеров и фиксируете решения.",
  },
];

export const tracks: Track[] = [
  {
    slug: "frontend",
    title: "Frontend",
    group: "Программирование",
    hero: "Вопросы по интерфейсам, браузеру и работе с UI",
    description:
      "Подборка реальных вопросов с фронтенд-собеседований. Частоты основаны на последних интервью, чтобы было понятно, что спрашивают чаще всего.",
    stats: {
      questions: 1235,
      interviews: 749,
      updated: "Обновлено 2 недели назад",
    },
    roles: ["Junior", "Middle", "Senior"],
    questions: [
      {
        id: "about-yourself",
        question: "Расскажи о себе и недавнем проекте",
        frequency: 99,
        level: "junior",
        category: "Soft",
        tags: ["общие", "софт-скиллы"],
        answer:
          "Держите фокус на кратком фоне, доменной экспертизе, зоне ответственности и конкретном результате. Завершите связкой с тем, что ищете дальше.",
      },
      {
        id: "event-loop",
        question: "Как работает Event Loop в браузере?",
        frequency: 67,
        level: "middle",
        category: "JS",
        tags: ["javascript", "runtime"],
        answer:
          "Опишите стек вызовов, очередь макро- и микрозадач, приоритет промисов и влияние рендеринга. Упомяните различия Node.js и браузеров, если их спрашивают.",
      },
      {
        id: "cors",
        question: "Что такое CORS и как его настроить?",
        frequency: 38,
        level: "middle",
        category: "Network",
        tags: ["http", "security"],
        answer:
          "CORS — механизм контроля междоменных запросов. Расскажите про заголовки Origin, Access-Control-Allow-*, preflight для методов, а также риски открытого wildcard.",
      },
      {
        id: "react-hooks",
        question: "В чем разница между useEffect и useLayoutEffect?",
        frequency: 16,
        level: "senior",
        category: "React",
        tags: ["react", "hooks"],
        answer:
          "useEffect срабатывает после рендера и отрисовки, useLayoutEffect блокирует отрисовку до выполнения, подходит для измерений DOM. Добавьте про риски мерцания и серверный рендеринг.",
      },
    ],
  },
  {
    slug: "backend",
    title: "Backend",
    group: "Программирование",
    hero: "API, очереди, базы данных и отказоустойчивость",
    description:
      "Заглушка: здесь будут свежие вопросы по бэкенду с частотами. Пока сохранили структуру и карточки, чтобы можно было пройтись по воронке.",
    stats: {
      questions: 860,
      interviews: 540,
      updated: "Обновление в работе",
    },
    roles: ["Junior", "Middle", "Senior"],
    questions: genericQuestions,
  },
  {
    slug: "python",
    title: "Python",
    group: "Программирование",
    hero: "Backend на Django/FastAPI и задачи с данными",
    description:
      "Демо-страница для питона: покажем вопросы по асинхронности, ORM и пайплайнам данных.",
    stats: {
      questions: 730,
      interviews: 410,
      updated: "Скоро обновим частоты",
    },
    roles: ["Junior", "Middle"],
    questions: genericQuestions,
  },
  {
    slug: "golang",
    title: "Golang",
    group: "Программирование",
    hero: "Микросервисы, конкуррентность и сети",
    description:
      "Плейсхолдер для Go — дизайн API, профилирование и подходы к написанию сервисов.",
    stats: {
      questions: 520,
      interviews: 300,
      updated: "В разработке",
    },
    roles: ["Middle", "Senior"],
    questions: genericQuestions,
  },
  {
    slug: "php",
    title: "PHP",
    group: "Программирование",
    hero: "Symfony, Laravel и сервисы на PHP",
    description:
      "Заглушка: здесь будут вопросы по фреймворкам, работе с БД и сервисной архитектуре на PHP.",
    stats: {
      questions: 510,
      interviews: 290,
      updated: "Обновляем демоданные",
    },
    roles: ["Junior", "Middle", "Senior"],
    questions: genericQuestions,
  },
  {
    slug: "csharp",
    title: "C# / .NET",
    group: "Программирование",
    hero: ".NET, сервисы и интеграции",
    description:
      "Плейсхолдер для C#: вопросы про CLR, ASP.NET, очереди и паттерны в корпоративных сервисах.",
    stats: {
      questions: 640,
      interviews: 360,
      updated: "Скоро появятся частоты",
    },
    roles: ["Junior", "Middle", "Senior"],
    questions: genericQuestions,
  },
  {
    slug: "cpp",
    title: "C/C++",
    group: "Программирование",
    hero: "Системное программирование и перформанс",
    description:
      "Демо-страница: вопросы про память, многопоточность, STL и работу с системными библиотеками.",
    stats: {
      questions: 430,
      interviews: 250,
      updated: "В подготовке",
    },
    roles: ["Junior", "Middle", "Senior"],
    questions: genericQuestions,
  },
  {
    slug: "1c",
    title: "1С разработчик",
    group: "Программирование",
    hero: "Учетные системы, конфигурации и интеграции",
    description:
      "Плейсхолдер под 1С: вопросы по платформе, доработкам, обмену данными и поддержке пользователей.",
    stats: {
      questions: 300,
      interviews: 190,
      updated: "Подгружаем свежие вопросы",
    },
    roles: ["Middle", "Senior"],
    questions: genericQuestions,
  },
  {
    slug: "nodejs",
    title: "Node.js",
    group: "Программирование",
    hero: "Node.js сервисы, очереди и JS/TS",
    description:
      "Демо: вопросы про event loop, работу с БД, очередями и построение API на Node.js.",
    stats: {
      questions: 520,
      interviews: 310,
      updated: "Скоро обновим",
    },
    roles: ["Junior", "Middle", "Senior"],
    questions: genericQuestions,
  },
  {
    slug: "ios",
    title: "iOS / Swift",
    group: "Программирование",
    hero: "Мобильная разработка под iOS",
    description:
      "Плейсхолдер: вопросы про Swift, жизненный цикл, архитектуры и работу с сетью.",
    stats: {
      questions: 410,
      interviews: 230,
      updated: "Готовим частоты",
    },
    roles: ["Junior", "Middle", "Senior"],
    questions: genericQuestions,
  },
  {
    slug: "android",
    title: "Android",
    group: "Программирование",
    hero: "Android, Kotlin и Java",
    description:
      "Демо-страница: вопросы по жизненному циклу, архитектурам, потокам и тестированию Android-приложений.",
    stats: {
      questions: 430,
      interviews: 240,
      updated: "Обновление в пути",
    },
    roles: ["Junior", "Middle", "Senior"],
    questions: genericQuestions,
  },
  {
    slug: "unity",
    title: "Unity",
    group: "Программирование",
    hero: "Игровые проекты на Unity",
    description:
      "Заглушка для Unity: вопросы про сцены, оптимизацию, физику и работу с ассетами.",
    stats: {
      questions: 320,
      interviews: 170,
      updated: "Скоро дополним",
    },
    roles: ["Junior", "Middle"],
    questions: genericQuestions,
  },
  {
    slug: "devops",
    title: "DevOps",
    group: "Программирование",
    hero: "CI/CD, контейнеры и облачная инфраструктура",
    description:
      "Пока демо: здесь будет список вопросов про Kubernetes, observability и автоматизацию поставки.",
    stats: {
      questions: 640,
      interviews: 380,
      updated: "Готовим данные",
    },
    roles: ["Middle", "Senior"],
    questions: genericQuestions,
  },
  {
    slug: "java",
    title: "Java",
    group: "Программирование",
    hero: "Вопросы по JVM, Spring и архитектуре сервисов",
    description:
      "Сборник сеньорских и мидл вопросов: от сборки мусора до проектирования модулей. Частоты основаны на реальных технических интервью.",
    stats: {
      questions: 980,
      interviews: 610,
      updated: "Обновлено 5 дней назад",
    },
    roles: ["Junior", "Middle", "Senior"],
    questions: [
      {
        id: "jvm-memory",
        question: "Как устроена память JVM и когда случается GC pause?",
        frequency: 58,
        level: "middle",
        category: "JVM",
        tags: ["gc", "performance"],
        answer:
          "Опишите кучи, стеки потоков, метаспейс. Расскажите про young/old generation, stop-the-world, популярные сборщики (G1, ZGC) и какие метрики смотреть в профайлере.",
      },
      {
        id: "spring-beans",
        question: "Какие есть скоупы бинов в Spring и когда какой выбрать?",
        frequency: 42,
        level: "junior",
        category: "Spring",
        tags: ["spring", "di"],
        answer:
          "singleton, prototype, request, session и custom. Укажите, что веб-скоупы работают только в web-контексте, и приведите пример, зачем нужен prototype (например, stateful компонент).",
      },
      {
        id: "transactions",
        question: "Как работает @Transactional и что такое propagation?",
        frequency: 34,
        level: "middle",
        category: "Spring",
        tags: ["transactions", "spring"],
        answer:
          "Расскажите про прокси, checked/unchecked исключения, isolation levels и сценарии REQUIRES_NEW/REQUIRED. Добавьте, почему аннотации на private методах не сработают.",
      },
      {
        id: "microservices",
        question: "Какие плюсы и минусы у микросервисной архитектуры?",
        frequency: 27,
        level: "senior",
        category: "Architecture",
        tags: ["architecture", "design"],
        answer:
          "Отметьте независимые релизы, масштабирование по домену, но усложнение наблюдаемости и контрактов. Упомяните монорепы, сервис-меш и тестирование контрактов.",
      },
    ],
  },
  {
    slug: "qa",
    title: "QA Тестирование",
    group: "Тестирование",
    hero: "Manual QA, кейсы и баг-репорты",
    description:
      "Демо-страница: вопросы про тест-дизайн, артефакты, приоритеты и работу с багами.",
    stats: {
      questions: 380,
      interviews: 210,
      updated: "Готовим частоты",
    },
    roles: ["Junior", "Middle"],
    questions: genericQuestions,
  },
  {
    slug: "qa-automation",
    title: "QA Automation",
    group: "Тестирование",
    hero: "Автотесты, фреймворки и пайплайны",
    description:
      "Плейсхолдер: вопросы про выбор инструментов, структуру тестов, стабов и интеграцию в CI.",
    stats: {
      questions: 420,
      interviews: 230,
      updated: "Скоро дополнение",
    },
    roles: ["Middle", "Senior"],
    questions: genericQuestions,
  },
  {
    slug: "datascience",
    title: "Data Science",
    group: "Аналитика и данные",
    hero: "ML-модели, метрики качества и продакшен пайплайны",
    description:
      "Плейсхолдер: выведем сюда топовые вопросы по ML, метрикам и экспериментам.",
    stats: {
      questions: 560,
      interviews: 320,
      updated: "Запланировано обновление",
    },
    roles: ["Junior", "Middle", "Senior"],
    questions: genericQuestions,
  },
  {
    slug: "data-analyst",
    title: "Data Analyst",
    group: "Аналитика и данные",
    hero: "Отчеты, SQL и проверка гипотез",
    description:
      "Демо-карточка: вопросы про SQL, дашборды, метрики и исследования данных.",
    stats: {
      questions: 520,
      interviews: 310,
      updated: "Частоты обновляются",
    },
    roles: ["Junior", "Middle"],
    questions: genericQuestions,
  },
  {
    slug: "business-analyst",
    title: "Бизнес-аналитик",
    group: "Аналитика и данные",
    hero: "Требования, процессы и документация",
    description:
      "Плейсхолдер: вопросы про сбор требований, BPMN, интеграции и согласование со стейкхолдерами.",
    stats: {
      questions: 400,
      interviews: 220,
      updated: "Скоро", 
    },
    roles: ["Middle", "Senior"],
    questions: genericQuestions,
  },
  {
    slug: "system-analyst",
    title: "Системный аналитик",
    group: "Аналитика и данные",
    hero: "Интеграции, схемы и API",
    description:
      "Демо: вопросы по диаграммам, контрактам, последовательностям и требованиям к системам.",
    stats: {
      questions: 430,
      interviews: 240,
      updated: "Готовим обновление",
    },
    roles: ["Junior", "Middle", "Senior"],
    questions: genericQuestions,
  },
  {
    slug: "data-analytics",
    title: "Аналитик данных",
    group: "Аналитика и данные",
    hero: "Метрики, отчеты и исследования",
    description:
      "Заглушка: вопросы про построение метрик, исследование данных и визуализацию.",
    stats: {
      questions: 410,
      interviews: 230,
      updated: "Добавим частоты",
    },
    roles: ["Junior", "Middle"],
    questions: genericQuestions,
  },
  {
    slug: "data-engineer",
    title: "Data Engineer",
    group: "Программирование",
    hero: "ETL, хранилища и потоковые системы",
    description:
      "Демо-страница для data engineering: вопросы про архитектуру данных, очереди и оптимизацию запросов.",
    stats: {
      questions: 610,
      interviews: 350,
      updated: "Частоты обновляются",
    },
    roles: ["Middle", "Senior"],
    questions: genericQuestions,
  },
  {
    slug: "product-analytics",
    title: "Продуктовая аналитика",
    group: "Аналитика и данные",
    hero: "Метрики, когортный анализ и эксперименты",
    description:
      "Плейсхолдер для продуктовых аналитиков: будем показывать популярные кейсы, формулы и разборы результативности.",
    stats: {
      questions: 480,
      interviews: 300,
      updated: "Демо обновления",
    },
    roles: ["Junior", "Middle"],
    questions: genericQuestions,
  },
  {
    slug: "product",
    title: "Product Management",
    group: "Управление",
    hero: "Грейдовые вопросы про стратегию, приоритизацию и метрики",
    description:
      "Набор продуктовых вопросов с отсортированной частотой. Подойдет, чтобы быстро вспомнить фреймворки и собрать структуру ответов перед интервью.",
    stats: {
      questions: 420,
      interviews: 260,
      updated: "Обновлено 3 дня назад",
    },
    roles: ["Junior", "Middle", "Senior", "Lead"],
    questions: [
      {
        id: "north-star",
        question: "Как выбрать North Star Metric для продукта?",
        frequency: 52,
        level: "middle",
        category: "Metrics",
        tags: ["metrica", "product"],
        answer:
          "Оттолкнитесь от value moment и повторяемости. Укажите роль input/output метрик, связь с ретеншном и why-not метрики, которые защищают продукт от перформанс-скривлений.",
      },
      {
        id: "prioritization",
        question: "Какими фреймворками приоритизации пользуетесь?",
        frequency: 45,
        level: "junior",
        category: "Process",
        tags: ["prioritization"],
        answer:
          "ICE, RICE, MoSCoW, Kano — приведите примеры, почему выбираете конкретный. Добавьте caveats: субъективность скоринга, необходимость калибровки и проверки гипотез на данных.",
      },
      {
        id: "experiments",
        question: "Как ставите A/B эксперименты и интерпретируете результаты?",
        frequency: 33,
        level: "middle",
        category: "Experiments",
        tags: ["a/b", "analytics"],
        answer:
          "Опишите гипотезу, выбор метрик, минимальный эффект, размер выборки, период, сегментацию и guardrail метрики. Укажите, что делать при остановке и как раскатывать победителя.",
      },
      {
        id: "team",
        question: "Как строите работу с командой разработки и дизайна?",
        frequency: 24,
        level: "senior",
        category: "Leadership",
        tags: ["team", "process"],
        answer:
          "Пройдитесь по ритуалам, синкам, roadmap, триажу задач и как принимаете продуктовые решения. Отдельно — как снимаете риски, помогаете росту и договариваетесь о критериях качества.",
      },
    ],
  },
  {
    slug: "pm",
    title: "Project Management",
    group: "Управление",
    hero: "Риски, сроки, коммуникация со стейкхолдерами",
    description:
      "Демо-карточка: здесь соберем вопросы про планирование, ресурсы и управление ожиданиями.",
    stats: {
      questions: 300,
      interviews: 180,
      updated: "Обновление в процессе",
    },
    roles: ["Junior", "Middle", "Senior"],
    questions: genericQuestions,
  },
  {
    slug: "lead",
    title: "Team Lead",
    group: "Управление",
    hero: "Лидерство, архитектура и найм",
    description:
      "Плейсхолдер странички тимлида: вопросы по управлению командой, техническим решениям и планированию.",
    stats: {
      questions: 350,
      interviews: 200,
      updated: "Скоро добавим частоты",
    },
    roles: ["Senior", "Lead"],
    questions: genericQuestions,
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
