import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import {
  getQuestionsByDirection,
  mapQuestionRowToTrackQuestion,
} from "@/lib/questions";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get("page") ?? "1");
  const perPage = Number(searchParams.get("perPage") ?? "50");

  const safePage = Number.isFinite(page) && page > 0 ? page : 1;
  const safePerPage = Number.isFinite(perPage) && perPage > 0 ? perPage : 50;

  const { questions, total } = await getQuestionsByDirection(
    slug,
    safePage,
    safePerPage
  );

  const mappedQuestions = questions.map(mapQuestionRowToTrackQuestion);

  return NextResponse.json({
    questions: mappedQuestions,
    total,
  });
}
