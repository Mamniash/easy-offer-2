const filters = ["Все", "Junior", "Middle", "Senior", "Lead"];

const questions = [
  { rate: "99%", title: "Расскажите о себе", status: "Прогресс" },
  { rate: "94%", title: "Event Loop: как работает и где бывает", status: "Прогресс" },
  { rate: "69%", title: "Как браузер превращает HTML в интерфейс?", status: "Нужно повторить" },
  { rate: "51%", title: "Чем отличаются var, let и const", status: "Нужно повторить" },
  { rate: "36%", title: "Что такое Promise", status: "Прогресс" },
  { rate: "31%", title: "Как работает Virtual DOM", status: "Прогресс" },
  { rate: "27%", title: "Что такое React" },
  { rate: "21%", title: "Как избежать XSS в React?" },
  { rate: "17%", title: "Что такое CORS" },
];

export default function FeaturesPlanet() {
  return (
    <section className="relative bg-gray-900" id="questions">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="py-12 md:py-20">
          <div className="mx-auto max-w-4xl space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-400">
                  Вопросы на собеседованиях
                </p>
                <h2 className="text-3xl font-bold text-white md:text-4xl">
                  Frontend · 12 385 вопросов от 749 собеседований
                </h2>
              </div>
              <div className="flex flex-wrap gap-2">
                <a
                  href="#tracks"
                  className="rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-gray-200 transition hover:border-blue-400 hover:text-white"
                >
                  Вернуться к направлениям
                </a>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {filters.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-gray-100 transition hover:-translate-y-0.5 hover:border-blue-400 hover:text-white"
                >
                  {filter}
                </button>
              ))}
              <button className="rounded-full border border-dashed border-white/15 px-4 py-2 text-sm font-medium text-gray-300">
                + Фильтр по компании
              </button>
            </div>

            <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
              <div className="grid grid-cols-[80px_1fr_140px] items-center gap-4 border-b border-white/5 px-6 py-3 text-xs uppercase tracking-[0.25em] text-gray-400 max-md:grid-cols-[70px_1fr] max-md:text-[11px]">
                <span>Стадия</span>
                <span>Частота вопроса</span>
                <span className="text-right max-md:hidden">Черновик ответа</span>
              </div>
              <div className="divide-y divide-white/5">
                {questions.map((question) => (
                  <div
                    key={question.title}
                    className="grid grid-cols-[80px_1fr_140px] items-center gap-4 px-6 py-4 text-sm text-gray-100 max-md:grid-cols-[70px_1fr]"
                  >
                    <span className="text-gray-400">{question.rate}</span>
                    <div className="space-y-1">
                      <p className="font-medium text-white">{question.title}</p>
                      <p className="text-xs text-gray-400">
                        Частота обновляется автоматически, ссылки и быстрый конспект появятся здесь.
                      </p>
                    </div>
                    <div className="max-md:col-span-2 max-md:pl-[70px]">
                      <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-[13px] text-gray-100">
                        {question.status ?? "Черновик"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-gray-100">
              <h3 className="mb-2 text-xl font-semibold text-white">Детали вопроса</h3>
              <p className="mb-4 text-sm text-gray-300">
                В каждом вопросе будет краткий ответ, разбор, полезные ссылки, а в PRO — видео и симуляция с AI-интервьюером.
                Сейчас контент находится в подготовке, но макет уже готов под подключение данных.
              </p>
              <div className="grid gap-3 md:grid-cols-3">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="flex flex-col gap-3 rounded-xl border border-white/10 bg-white/5 p-4"
                  >
                    <div className="h-3 w-20 rounded-full bg-white/10" />
                    <div className="h-3 w-32 rounded-full bg-white/10" />
                    <div className="h-16 rounded-lg bg-white/10" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
