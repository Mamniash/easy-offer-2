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
