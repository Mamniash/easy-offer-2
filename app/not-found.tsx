import PlaceholderPage from "@/components/ui/placeholder-page";

export default function NotFound() {
  return (
    <PlaceholderPage
      badge="Ошибка 404"
      title="Страница не найдена"
      description="Похоже, такой страницы нет или она ещё в работе. Проверьте ссылку или выберите один из разделов сайта."
      secondaryDescription="Если вы искали новый раздел, он может быть в разработке — мы стараемся запускать обновления как можно быстрее."
      primaryAction={{ href: "/", label: "На главную" }}
      secondaryAction={{ href: "/tracks", label: "Выбрать трек" }}
    />
  );
}
