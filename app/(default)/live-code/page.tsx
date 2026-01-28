import PlaceholderPage from "@/components/ui/placeholder-page";

export const metadata = {
  title: "PreOffer — live coding",
  description:
    "Скоро здесь появятся задания и сессии live coding для практики интервью.",
};

export default function LiveCodePage() {
  return (
    <PlaceholderPage
      badge="Практика"
      title="Live coding скоро появится"
      description="Готовим интерактивные задания и сессии, чтобы можно было тренироваться в формате реального интервью."
      secondaryDescription="А пока можно отточить теорию и пройтись по тренировочным вопросам."
      primaryAction={{ href: "/trainer", label: "Открыть тренажер" }}
      secondaryAction={{ href: "/tracks", label: "Выбрать трек" }}
    />
  );
}
