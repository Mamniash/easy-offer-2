import Link from "next/link";

const directions = [
  {
    title: "Программирование",
    tracks: [
      { title: "Frontend", slug: "frontend", hint: "HTML, CSS, JS, React" },
      { title: "Java", slug: "java", hint: "Spring, JVM" },
      { title: "Python", slug: "python", hint: "Backend, ML" },
      { title: "Golang", slug: "golang", hint: "Services, infra" },
      { title: "PHP", slug: "php", hint: "Web, frameworks" },
      { title: "C#", slug: "csharp", hint: ".NET, backend" },
      { title: "C/C++", slug: "cpp", hint: "System, perf" },
      { title: "1C", slug: "1c", hint: "Учетные системы" },
      { title: "iOS / Swift", slug: "ios", hint: "Mobile" },
      { title: "Android", slug: "android", hint: "Mobile" },
      { title: "Flutter", slug: "flutter", hint: "Cross-platform" },
      { title: "Unity", slug: "unity", hint: "Gamedev" },
      { title: "DevOps", slug: "devops", hint: "CI/CD, облака" },
      { title: "Data Engineer", slug: "data-engineer", hint: "ETL, DWH" },
    ],
  },
  {
    title: "Тестирование",
    tracks: [
      { title: "QA Тестировщик", slug: "qa", hint: "Manual / Auto" },
      { title: "AQA / Automation", slug: "aqa", hint: "Selenium, SDET" },
    ],
  },
  {
    title: "Аналитика и Data Science",
    tracks: [
      { title: "Data Science", slug: "data-science", hint: "ML, модели" },
      { title: "Бизнес Аналитик", slug: "ba", hint: "Product / бизнес" },
      { title: "Системный Аналитик", slug: "sa", hint: "Архитектура" },
      { title: "Аналитик Данных", slug: "data-analyst", hint: "SQL, дашборды" },
      { title: "Продуктовый Аналитик", slug: "product-analyst", hint: "Продукт" },
    ],
  },
  {
    title: "Управление",
    tracks: [
      { title: "Менеджер проектов", slug: "pm", hint: "Delivery" },
      { title: "Продакт менеджер", slug: "product", hint: "Discovery" },
    ],
  },
];

export default function TracksPage() {
  return (
    <section className="relative py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="mb-12 text-center">
          <p className="mb-4 inline-flex rounded-full bg-slate-100 px-4 py-1 text-sm font-medium text-slate-600">
            Следующий шаг
          </p>
          <h1 className="mb-4 text-4xl font-bold leading-tight text-gray-900 md:text-5xl">
            Выберите направление и трек
          </h1>
          <p className="text-lg text-gray-600 md:text-xl">
            Сначала определяемся с профессией, дальше будет список вопросов и карта
            подготовки в том же стиле. Пока это демо-контент, но структура уже
            готова.
          </p>
        </div>

        <div className="space-y-10">
          {directions.map((section) => (
            <div key={section.title} className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm md:p-8">
              <div className="mb-6 flex items-center justify-between gap-4">
                <h2 className="text-xl font-semibold text-gray-900 md:text-2xl">{section.title}</h2>
                <div className="text-sm text-gray-500">Выберите, чтобы углубиться</div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                {section.tracks.map((track) => (
                  <Link
                    key={track.slug}
                    href={`/tracks/${track.slug}`}
                    className="group flex flex-col justify-between rounded-2xl border border-slate-200 px-4 py-3 transition hover:-translate-y-0.5 hover:border-blue-400 hover:shadow-lg"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-base font-semibold text-gray-900">{track.title}</span>
                        <span className="text-xs font-medium text-blue-600">вперёд →</span>
                      </div>
                      <p className="mt-2 text-sm text-gray-600">{track.hint}</p>
                    </div>
                    <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                      <span className="rounded-full bg-slate-50 px-3 py-1 font-medium text-slate-700">часто спрашивают</span>
                      <span className="text-gray-400">демо</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
