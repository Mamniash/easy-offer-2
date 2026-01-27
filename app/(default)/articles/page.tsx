import { getArticles } from "@/lib/articles";

export const metadata = {
  title: "PreOffer — статьи и полезные материалы",
  description:
    "Подборка русскоязычных статей о карьере, резюме, интервью и развитии.",
};

const fallbackTags = [
  "Резюме",
  "Интервью",
  "GitHub",
  "Портфолио",
  "Soft skills",
  "Карьера",
];

const formatPublishedAt = (value: string | null) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

export default async function ArticlesPage() {
  const articles = await getArticles();
  const tags = Array.from(
    new Set(
      articles
        .map((article) => article.tags?.trim())
        .filter((tag): tag is string => Boolean(tag))
    )
  );
  const displayTags = tags.length > 0 ? tags : fallbackTags;

  return (
    <section className="pb-20 pt-8 md:pt-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white/90 p-10 shadow-xl backdrop-blur">
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_0%_0%,rgba(14,165,233,0.12),transparent_35%),radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.12),transparent_40%)]" />
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-sky-500">
                База знаний
              </p>
              <h1 className="mt-3 text-4xl font-bold text-gray-900 md:text-5xl">
                Статьи и полезные материалы
              </h1>
              <p className="mt-4 max-w-2xl text-lg text-gray-700">
                Собрали русскоязычные статьи о карьере, развитии и подготовке к
                собеседованиям. Спокойный фон для тех, кто любит читать и
                погружаться в детали.
              </p>
            </div>
            <div className="flex items-center justify-center rounded-2xl bg-gray-900/95 px-10 py-6 text-center text-gray-100 shadow-lg">
              <div className="flex flex-col items-center gap-2">
                <p className="text-sm text-gray-400">Материалов</p>
                <p className="text-4xl font-semibold">
                  {articles.length.toLocaleString("ru-RU")}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="flex flex-wrap gap-2">
            {displayTags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-semibold text-gray-600 shadow-sm"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="relative">
            <input
              className="w-full rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 shadow-sm transition placeholder:text-gray-400 focus:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-100"
              placeholder="Поиск по статьям"
              type="search"
            />
          </div>
        </div>

        <div className="mt-10">
          {articles.length === 0 ? (
            <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-gray-200 bg-white/80 p-10 text-center shadow-sm">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sky-50 text-2xl">
                📚
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-800">
                  Пока нет статей — скоро добавим
                </p>
                <p className="mt-2 text-sm text-gray-500">
                  Мы собираем полезные материалы. Загляните чуть позже!
                </p>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => {
                const publishedAt = formatPublishedAt(article.published_at);

                return (
                  <a
                    key={article.id}
                    href={article.source_url}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-sky-200 hover:shadow-lg"
                  >
                    <div className="relative h-44 w-full overflow-hidden bg-gray-100">
                      {article.image_url ? (
                        <img
                          src={article.image_url}
                          alt={article.title}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 text-3xl text-gray-400">
                          ✨
                        </div>
                      )}
                      {article.tags ? (
                        <span className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-gray-700 shadow">
                          #{article.tags}
                        </span>
                      ) : null}
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <h2 className="text-lg font-semibold text-gray-900">
                        {article.title}
                      </h2>
                      <p
                        className="mt-3 text-sm leading-relaxed text-gray-600"
                        style={{
                          display: "-webkit-box",
                          WebkitLineClamp: 4,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {article.summary}
                      </p>
                      <div className="mt-auto flex items-center justify-between pt-4 text-xs text-gray-500">
                        <span>{publishedAt ?? "Без даты"}</span>
                        <span className="inline-flex items-center gap-1 font-semibold text-sky-600 transition group-hover:text-sky-500">
                          Читать статью
                          <span aria-hidden>↗</span>
                        </span>
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
