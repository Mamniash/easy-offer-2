import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { getGolangCompanyQuestions } from "@/lib/questions";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  if (slug !== "golang") {
    return NextResponse.json({ questions: [] });
  }

  const { searchParams } = new URL(request.url);
  const company = (searchParams.get("company") ?? "").trim();

  if (!company) {
    return NextResponse.json({ questions: [] });
  }

  const questions = await getGolangCompanyQuestions(company);

  return NextResponse.json({ questions });
}
