const filters = {
  type: ["Все", "Frontend", "Backend", "Data", "QA"],
  grade: ["Все", "Junior", "Middle", "Senior"],
  format: ["Любой формат", "Онлайн", "Офис"],
};

const questions = [
  { frequency: "99%", title: "Расскажите о себе" },
  { frequency: "69%", title: "Расскажите о своём опыте" },
  { frequency: "59%", title: "Что такое Event Loop" },
  { frequency: "49%", title: "Как вы организуете своё место работы" },
  { frequency: "43%", title: "Есть ли вопросы" },
  { frequency: "38%", title: "Что такое Promise" },
  { frequency: "31%", title: "Let, const и var: отличия" },
  { frequency: "25%", title: "Что такое Virtual DOM" },
  { frequency: "25%", title: "Что такое CORS" },
  { frequency: "21%", title: "В чём разница между map, let и const" },
  { frequency: "18%", title: "Как работает Event Loop" },
  { frequency: "17%", title: "Какие есть вопросы к компании" },
  { frequency: "17%", title: "Что такое React" },
  { frequency: "16%", title: "Что такое coalescing в JS" },
];

function FilterGroup({ title, options }: { title: string; options: string[] }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-sm font-semibold text-slate-400">{title}</span>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            className="rounded-full border border-slate-700/40 bg-slate-900/50 px-3 py-1.5 text-xs font-medium text-slate-100 transition hover:-translate-y-0.5 hover:border-blue-500 hover:text-blue-200 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500"
            type="button"
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function FeaturesPlanet() {
  return (
    <section id="frontend" className="relative before:absolute before:inset-0 before:-z-20 before:bg-slate-950">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="py-12 md:py-20">
          <div className="mx-auto max-w-4xl pb-10 text-center">
            <h2 className="text-3xl font-bold text-slate-50 md:text-4xl">
              Вопросы на собеседовании по Frontend
            </h2>
            <p className="mt-4 text-lg text-slate-300">
              12 385 актуальных вопросов по 749 собеседованиям. Выберите
              фильтры и смотрите, что сегодня спрашивают чаще всего — ответы и
              ссылки появятся прямо в карточке вопроса.
            </p>
          </div>

          <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/50 p-6 shadow-lg shadow-black/30">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap gap-3">
                <FilterGroup title="Тип собеседования" options={filters.type} />
                <FilterGroup title="Грейд" options={filters.grade} />
              </div>
              <FilterGroup title="Формат" options={filters.format} />
            </div>
            <div className="h-px w-full bg-linear-to-r from-transparent via-slate-800 to-transparent" />
            <div className="space-y-3">
              {questions.map((question) => (
                <div
                  key={question.title}
                  className="flex flex-col gap-2 rounded-xl border border-slate-800/70 bg-slate-950/50 px-4 py-3 text-left transition hover:-translate-y-0.5 hover:border-blue-500/60 hover:bg-slate-900/70"
                >
                  <div className="flex items-center gap-3 text-sm text-slate-400">
                    <span className="rounded-full bg-blue-500/10 px-3 py-1 font-semibold text-blue-200">
                      {question.frequency}
                    </span>
                    <span className="text-xs uppercase tracking-[0.18em] text-slate-500">
                      Частота упоминаний
                    </span>
                  </div>
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <h3 className="text-base font-semibold text-slate-50">
                      {question.title}
                    </h3>
                    <span className="text-sm text-slate-400">
                      Ответ, ссылки и заметки появятся здесь
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
