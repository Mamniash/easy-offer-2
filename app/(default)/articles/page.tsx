import ArticlesList from "@/components/articles/articles-list";
import { getArticlesPage } from "@/lib/articles";

export const metadata = {
  title: "PreOffer — статьи и полезные материалы",
  description:
    "Подборка русскоязычных статей о карьере, резюме, интервью и развитии.",
};

const ARTICLES_PER_PAGE = 12;

type ArticlesSearchParams = Promise<{
  page?: string;
}>;

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams?: ArticlesSearchParams;
}) {
  const resolvedSearchParams = await searchParams;
  const requestedPage = Number(resolvedSearchParams?.page ?? "1");
  const safePage =
    Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 1;
  const { articles, total } = await getArticlesPage(
    safePage,
    ARTICLES_PER_PAGE,
  );

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
                  {total.toLocaleString("ru-RU")}
                </p>
              </div>
            </div>
          </div>
        </div>

        <ArticlesList
          initialArticles={articles}
          total={total}
          page={safePage}
          perPage={ARTICLES_PER_PAGE}
        />
      </div>
    </section>
  );
}
