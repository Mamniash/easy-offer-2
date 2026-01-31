// app/(default)/tracks/page.tsx
import { getQuestionsTotal } from "@/lib/questions";
import { directionGroups } from "@/lib/tracks";
import TracksDirectory from "@/components/tracks-directory";

export const metadata = {
  title: "PreOffer — подготовка к собеседованиям",
  description:
    "Собрали направления и профессии, чтобы перейти к вопросам и подготовке. Выберите трек и смотрите частые вопросы.",
};

export default async function TracksLandingPage() {
  const totalDirections = directionGroups.flatMap((g) => g.items).length;
  const totalQuestions = await getQuestionsTotal();

  return (
    <section className="pb-20 pt-8 md:pt-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white/90 p-10 shadow-xl backdrop-blur">
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.08),transparent_25%),radial-gradient(circle_at_80%_0%,rgba(14,165,233,0.1),transparent_26%)]" />
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-blue-600">
                Маршрут подготовки
              </p>
              <h1 className="mt-3 text-4xl font-bold text-gray-900 md:text-5xl">
                Выберите направление,
                <br className="hidden md:block" /> чтобы идти дальше
              </h1>
              <p className="mt-4 max-w-2xl text-lg text-gray-700">
                Нажмите на профессию — увидите частые вопросы и подсказки.
                Карточки ниже — готовые подборки тем: их можно двигать и
                дополнять под задачи вашей команды.
              </p>
            </div>
            <div className="flex gap-6 rounded-2xl bg-gray-900 p-6 text-gray-100 shadow-lg">
              <div className="flex flex-col items-center text-center">
                <p className="text-sm text-gray-400">Направлений</p>
                <p className="text-4xl font-semibold">{totalDirections}</p>
              </div>
              <div className="h-12 w-px bg-gray-700/60" aria-hidden="true" />
              <div className="flex flex-col items-center text-center">
                <p className="text-sm text-gray-400">Вопросов</p>
                <p className="text-4xl font-semibold">
                  {totalQuestions.toLocaleString("ru-RU")}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 overflow-hidden rounded-3xl border border-blue-200/60 bg-gradient-to-br from-blue-600 via-sky-500 to-indigo-600 p-8 text-white shadow-2xl">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm uppercase tracking-[0.2em] text-white/70">
                Друзья PreOffer
              </p>
              <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
                Митша — легенда Python-бэкенда
              </h2>
              <p className="mt-4 text-base text-white/85 md:text-lg">
                Мы уже собрали контент по Python backend, и Митша — тот самый
                человек, который поможет докрутить дорожную карту. Напишите ему
                в Telegram, чтобы обсудить задачи или ревью.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="/tracks/python"
                  className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-blue-700 shadow-md transition hover:-translate-y-0.5 hover:shadow-lg"
                >
                  Смотреть Python backend
                </a>
                <a
                  href="https://t.me/nedv1ga"
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-white/70 px-5 py-2 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10"
                >
                  Написать Митше в Telegram
                </a>
              </div>
            </div>
            <div className="flex flex-col items-center gap-4 rounded-2xl bg-white/10 p-4 backdrop-blur lg:w-80">
              <img
                src="https://upload.wikimedia.org/wikipedia/en/0/0c/Patrick_Bateman.png"
                alt="Патрик Бэйман"
                className="h-48 w-full rounded-xl object-cover shadow-lg"
              />
              <p className="text-center text-xs uppercase tracking-[0.2em] text-white/70">
                Эталон уверенности
              </p>
            </div>
          </div>
        </div>

        <TracksDirectory directionGroups={directionGroups} />
      </div>
    </section>
  );
}
