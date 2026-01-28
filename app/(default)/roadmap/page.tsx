import PlaceholderPage from "@/components/ui/placeholder-page";

export const metadata = {
  title: "PreOffer — роадмапы",
  description:
    "Скоро здесь появятся роадмапы по подготовке к собеседованиям и развитию карьеры.",
};

export default function RoadmapPage() {
  return (
    <PlaceholderPage
      badge="Обучение"
      title="Роадмапы в разработке"
      description="Собираем понятные пути развития по направлениям и уровням. Здесь будут пошаговые планы, которые помогут системно готовиться к собеседованиям."
      secondaryDescription="Пока можно пройтись по вопросам и материалам, чтобы не терять темп подготовки."
      primaryAction={{ href: "/tracks", label: "Перейти к вопросам" }}
      secondaryAction={{ href: "/articles", label: "Читать статьи" }}
    />
  );
}
