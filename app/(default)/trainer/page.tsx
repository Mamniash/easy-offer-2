import TrainerSetupForm from "@/components/trainer/trainer-setup-form";
import { directionGroups } from "@/lib/tracks";

export const metadata = {
  title: "PreOffer — тренажер вопросов",
  description:
    "Настройте параметры тренировки и запускайте сессии с вопросами по направлениям.",
};

export default function TrainerSetupPage() {
  return (
    <section className="pb-20 pt-8 md:pt-10">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="mb-8 rounded-2xl border border-gray-200 bg-white/90 p-8 shadow-xl">
          <p className="text-sm uppercase tracking-[0.2em] text-blue-600">
            Тренажер
          </p>
          <h1 className="mt-3 text-4xl font-bold text-gray-900 md:text-5xl">
            Настройка тренажера
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-gray-700">
            Выберите направление и подготовьте параметры, чтобы запустить сессию
            случайных вопросов.
          </p>
        </div>

        <TrainerSetupForm directionGroups={directionGroups} />
      </div>
    </section>
  );
}
