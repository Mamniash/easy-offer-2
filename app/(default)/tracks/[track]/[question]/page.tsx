import Link from "next/link";
import { notFound } from "next/navigation";
import { trackMap } from "../../tracks-data";

export default function QuestionPage({
  params,
}: {
  params: { track: string; question: string };
}) {
  const track = trackMap[params.track];
  if (!track) {
    notFound();
  }

  const question = track.questions.find((item) => item.id === params.question);

  if (!question) {
    notFound();
  }

  return (
    <section className="relative pb-16 pt-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="mb-6 flex items-center gap-2 text-sm text-blue-700">
          <Link href="/tracks" className="font-semibold hover:text-blue-800">
            Направления
          </Link>
          <span aria-hidden>→</span>
          <Link href={`/tracks/${track.slug}`} className="font-semibold hover:text-blue-800">
            {track.title}
          </Link>
          <span aria-hidden>→</span>
          <span className="text-gray-500">Вопрос</span>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100 md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-4">
            <div className="space-y-2">
              <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Вопрос из собеседований</p>
              <h1 className="text-3xl font-bold leading-tight text-gray-900 md:text-4xl">{question.title}</h1>
              <p className="text-gray-600">
                Частота появления: <span className="font-semibold text-blue-700">{question.frequency}%</span>
              </p>
            </div>
            <div className="flex flex-wrap gap-2 text-xs font-semibold text-gray-700">
              <span className="rounded-full bg-blue-50 px-3 py-1 text-blue-700 ring-1 ring-blue-100">{question.level}</span>
              <span className="rounded-full bg-gray-50 px-3 py-1 text-gray-700 ring-1 ring-gray-100">{question.format}</span>
              <span className="rounded-full bg-gray-50 px-3 py-1 text-gray-700 ring-1 ring-gray-100">{question.topic}</span>
            </div>
          </div>

          <div className="mt-6 space-y-4 text-gray-800">
            <p className="text-lg font-semibold text-gray-900">Заглушка ответа</p>
            <p>
              Здесь появится развёрнутый разбор с примерами ответа, частыми ошибками и
              подсказками, как улучшить свой вариант. Пока место занимает заглушка,
              чтобы можно было проверить, как выглядит переход по всей воронке.
            </p>
            <div className="rounded-2xl bg-gray-50 p-4 text-sm text-gray-700 ring-1 ring-gray-100">
              <p className="font-semibold">Что добавим позже</p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>Подсказки и критерии идеального ответа</li>
                <li>Примеры проектов и задач, которые стоит вспомнить</li>
                <li>Дополнительные материалы и ссылки</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3 text-sm font-semibold text-blue-700">
            <Link
              href={`/tracks/${track.slug}`}
              className="rounded-full bg-blue-50 px-4 py-2 ring-1 ring-blue-100 transition hover:bg-blue-100"
            >
              Вернуться к списку вопросов
            </Link>
            <Link
              href="/tracks"
              className="rounded-full bg-gray-50 px-4 py-2 text-gray-800 ring-1 ring-gray-200 transition hover:bg-white"
            >
              Выбрать другое направление
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
