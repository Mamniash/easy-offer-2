const categories = [
  {
    title: "Программирование",
    items: [
      "Frontend",
      "Java",
      "Python",
      "Golang",
      "Node.js",
      "PHP",
      "C# / .NET",
      "C / C++",
      "1C",
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
    items: ["QA тестирование", "AQA / Automation"],
  },
  {
    title: "Аналитика и Data Science",
    items: [
      "Data Science",
      "Бизнес Аналитик",
      "Системный Аналитик",
      "Аналитик Данных",
      "Продуктовый Аналитик",
    ],
  },
  {
    title: "Управление",
    items: ["Менеджер Проектов", "Продукт Менеджер"],
  },
];

export default function BusinessCategories() {
  return (
    <section className="scroll-mt-24" id="tracks">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="pb-12 md:pb-20">
          <div className="mx-auto max-w-3xl pb-10 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
              Карта подготовки
            </p>
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Получить оффер в IT легко
            </h2>
            <p className="text-base text-gray-600">
              Выбирай направление, смотри реальные вопросы и отслеживай, что
              спрашивают именно сейчас. Кнопки ведут к списку вопросов, где можно
              добавить фильтры по грейду или компании.
            </p>
          </div>

          <div className="space-y-10">
            {categories.map((category) => (
              <div key={category.title} className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 bg-linear-to-r from-transparent via-gray-300 to-transparent" />
                  <h3 className="text-lg font-semibold text-gray-900">{category.title}</h3>
                  <div className="h-px flex-1 bg-linear-to-r from-transparent via-gray-300 to-transparent" />
                </div>
                <div className="flex flex-wrap gap-3">
                  {category.items.map((item) => (
                    <a
                      key={item}
                      href="#questions"
                      className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-800 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                    >
                      {item}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
