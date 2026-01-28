import PlaceholderPage from "@/components/ui/placeholder-page";

export const metadata = {
  title: "PreOffer — IT менторы",
  description:
    "Скоро здесь появятся менторы и расписание личных консультаций.",
};

export default function MentorPage() {
  return (
    <PlaceholderPage
      badge="Практика"
      title="IT менторы скоро подключатся"
      description="Запускаем формат индивидуальной поддержки: подбор ментора, календарь встреч и обратная связь после сессий."
      secondaryDescription="Если хотите подготовиться заранее, можно пройти тренировки и закрепить теорию."
      primaryAction={{ href: "/trainer", label: "Перейти к тренажеру" }}
      secondaryAction={{ href: "/articles", label: "Открыть материалы" }}
    />
  );
}
