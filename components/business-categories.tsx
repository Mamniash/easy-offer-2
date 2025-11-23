const categories = [
  {
    title: "Программирование",
    items: [
      "Frontend",
      "Java",
      "Python",
      "Golang",
      "PHP",
      "C# / C++",
      "1C",
      "Node.js",
      "iOS / Swift",
      "Android",
      "Flutter",
      "Unity",
      "DevOps",
      "Data Engineer",
    ],
  },
  {
    title: "Тестирование",
    items: ["QA Manual", "AQA / Automation"],
  },
  {
    title: "Аналитика и Data Science",
    items: [
      "Data Science",
      "Бизнес-аналитик",
      "Системный аналитик",
      "Аналитик данных",
      "Продуктовый аналитик",
    ],
  },
  {
    title: "Управление",
    items: ["Менеджер проектов", "Продакт-менеджер"],
  },
];

function CategoryPills({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-3">
      {items.map((item) => (
        <button
          key={item}
          className="rounded-full border border-slate-200/70 bg-white px-4 py-2 text-sm font-medium text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:text-blue-700 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-300"
          type="button"
        >
          {item}
        </button>
      ))}
    </div>
  );
}

export default function BusinessCategories() {
  return (
    <section id="roles" className="relative">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.12),transparent_45%),radial-gradient(circle_at_bottom,_rgba(59,130,246,0.08),transparent_40%)]" />
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="pb-12 md:pb-20">
          <div className="mx-auto max-w-3xl pb-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">PreOffer</p>
            <h2 className="mb-4 text-3xl font-bold text-slate-900 md:text-4xl">
              Получить оффер в IT легко
            </h2>
            <p className="text-lg text-slate-600">
              Выберите направление и сразу увидите, какие вопросы чаще всего
              звучат на собеседованиях по вашей роли. Фокусируйтесь на 20%
              тем, которые дают 80% результата.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {categories.map((category) => (
              <article
                key={category.title}
                className="rounded-2xl border border-slate-100 bg-white/80 p-6 shadow-lg shadow-slate-900/5 backdrop-blur"
              >
                <div className="mb-4 flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-sm font-semibold text-blue-600">
                    {category.title.slice(0, 2)}
                  </span>
                  <h3 className="text-lg font-semibold text-slate-900">
                    {category.title}
                  </h3>
                </div>
                <CategoryPills items={category.items} />
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
