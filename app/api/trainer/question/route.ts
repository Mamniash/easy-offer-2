import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { getRandomQuestionByDirection } from "@/lib/questions";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const direction = searchParams.get("direction");

  if (!direction) {
    return NextResponse.json({ question: null }, { status: 400 });
  }

  const question = await getRandomQuestionByDirection(direction);

  return NextResponse.json({ question });
}
