import { directionGroups } from "@/lib/tracks";
import TracksDirectory from "@/components/tracks-directory";

export const metadata = {
  title: "PreOffer — подготовка к собеседованиям",
  description:
    "Собрали направления и профессии, чтобы перейти к вопросам и подготовке. Выберите трек и смотрите частые вопросы.",
};

export default function TracksLandingPage() {
  return (
    <section className="pb-20 pt-32 md:pt-40">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white/90 p-10 shadow-xl backdrop-blur">
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.08),transparent_25%),radial-gradient(circle_at_80%_0%,rgba(14,165,233,0.1),transparent_26%)]" />
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-blue-600">Маршрут подготовки</p>
              <h1 className="mt-3 text-4xl font-bold text-gray-900 md:text-5xl">
                Выберите направление,
                <br className="hidden md:block" /> чтобы идти дальше
              </h1>
              <p className="mt-4 max-w-2xl text-lg text-gray-700">
                Нажмите на профессию — увидите частые вопросы, подсказки и фильтры по
                грейду. Карточки ниже — готовые подборки тем: их можно двигать и
                дополнять под задачи вашей команды.
              </p>
            </div>
            <div className="flex gap-4 rounded-2xl bg-gray-900 p-6 text-gray-100 shadow-lg">
              <div>
                <p className="text-sm text-gray-400">Направлений</p>
                <p className="text-4xl font-semibold">{directionGroups.flatMap((g) => g.items).length}</p>
              </div>
              <div className="h-12 w-px bg-gray-700/60" aria-hidden="true" />
              <div>
                <p className="text-sm text-gray-400">Вопросов в демо</p>
                <p className="text-4xl font-semibold">12 345</p>
              </div>
            </div>
          </div>
        </div>

        <TracksDirectory directionGroups={directionGroups} />
      </div>
    </section>
  );
}
