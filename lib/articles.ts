import { supabase } from "@/lib/supabaseClient";

export type ArticleRow = {
  id: string;
  title: string;
  summary: string;
  source_url: string;
  image_url: string | null;
  tags: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export async function getArticles(): Promise<ArticleRow[]> {
  const { data, error } = await supabase
    .from("articles")
    .select("*");

  if (error) {
    console.error("[getArticles] Supabase error:", error);
    return [];
  }

  return (data ?? []) as ArticleRow[];
}


export async function getArticlesPage(
  page: number,
  perPage: number,
): Promise<{ articles: ArticleRow[]; total: number }> {
  const safePage = Number.isFinite(page) && page > 0 ? page : 1;
  const safePerPage = Number.isFinite(perPage) && perPage > 0 ? perPage : 12;
  const from = (safePage - 1) * safePerPage;
  const to = from + safePerPage - 1;

  const { data, error, count } = await supabase
    .from("articles")
    .select("*", { count: "exact" })
    .order("published_at", { ascending: false, nullsFirst: false })
    .range(from, to);

  if (error) {
    console.error("[getArticlesPage] Supabase error:", error);
    return { articles: [], total: 0 };
  }

  return {
    articles: (data ?? []) as ArticleRow[],
    total: count ?? (data ?? []).length,
  };
}
