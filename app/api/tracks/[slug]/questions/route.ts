import { NextResponse } from "next/server";

import {
  getQuestionsByDirection,
  mapQuestionRowToTrackQuestion,
} from "@/lib/questions";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get("page") ?? "1");
  const perPage = Number(searchParams.get("perPage") ?? "50");

  const safePage = Number.isFinite(page) && page > 0 ? page : 1;
  const safePerPage = Number.isFinite(perPage) && perPage > 0 ? perPage : 50;

  const { questions, total } = await getQuestionsByDirection(
    params.slug,
    safePage,
    safePerPage
  );

  const mappedQuestions = questions.map(mapQuestionRowToTrackQuestion);

  return NextResponse.json({
    questions: mappedQuestions,
    total,
  });
}
