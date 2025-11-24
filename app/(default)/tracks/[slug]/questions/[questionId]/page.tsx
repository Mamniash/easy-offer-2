import Link from "next/link";
import { notFound } from "next/navigation";

import { getQuestion } from "@/lib/tracks";

export function generateMetadata({
  params,
}: {
  params: { slug: string; questionId: string };
}) {
  const entry = getQuestion(params.slug, params.questionId);

  if (!entry) return {};

  return {
    title: `${entry.question.question} | PreOffer`,
    description: entry.question.answer ?? "Демостраница с ответом на вопрос",
  };
}

export default function QuestionPage({
  params,
}: {
  params: { slug: string; questionId: string };
}) {
  const entry = getQuestion(params.slug, params.questionId);

  if (!entry) {
    notFound();
  }

  const { track, question } = entry;

  return (
    <section className="pb-20 pt-32 md:pt-40">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
          <div className="flex items-center justify-between gap-4">
            <Link href={`/tracks/${track.slug}`} className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600">
              <span aria-hidden>←</span> Вернуться к списку
            </Link>
            <span className="rounded-full bg-gray-900 px-3 py-1 text-xs font-semibold text-white">
              {question.frequency}% встречаемость
            </span>
          </div>
          <p className="mt-3 text-sm uppercase tracking-[0.2em] text-gray-500">{track.title}</p>
          <h1 className="mt-2 text-3xl font-bold text-gray-900 md:text-4xl">{question.question}</h1>
          <p className="mt-1 text-sm text-gray-500">Категория: {question.category}</p>

          <div className="mt-6 rounded-xl bg-gray-50 p-6 ring-1 ring-gray-200">
            <p className="text-lg font-semibold text-gray-900">Заглушка ответа</p>
            <p className="mt-2 text-gray-700">
              {question.answer ??
                "Мы оставили здесь пример, чтобы понять формат. Позже появятся реальные разборы, чек-листы и ссылки на документацию."}
            </p>
            <div className="mt-4 grid gap-2 text-sm text-gray-600 md:grid-cols-2">
              <div className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-emerald-500" aria-hidden />
                <p>Покажем пример идеального ответа с шагами.</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-blue-500" aria-hidden />
                <p>Добавим подсказки, на что смотрят интервьюеры.</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-indigo-500" aria-hidden />
                <p>Сохраним ссылки на теорию и быстрые шпаргалки.</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-gray-800" aria-hidden />
                <p>Позже сюда приедут заметки и собственные конспекты.</p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3 text-sm text-gray-600">
            <span className="rounded-full bg-blue-50 px-3 py-1 font-semibold text-blue-600 ring-1 ring-blue-100">
              {question.level.toUpperCase()}
            </span>
            {question.tags?.map((tag) => (
              <span key={tag} className="rounded-full bg-white px-3 py-1 font-medium shadow-sm ring-1 ring-gray-200">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-6 py-4 text-sm text-gray-600">
          <p className="font-semibold text-gray-800">Дальше по воронке</p>
          <p className="mt-1 text-gray-600">
            Здесь появится кнопка на симуляцию интервью с AI и быстрый чек-лист на подготовку. Пока это демо, но стилистика останется единой.
          </p>
        </div>
      </div>
    </section>
  );
}
