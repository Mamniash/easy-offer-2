import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import {
  getCompanyNamesByDirection,
  getCompanyQuestionsByDirection,
} from "@/lib/questions";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  const { searchParams } = new URL(request.url);
  const company = (searchParams.get("company") ?? "").trim();

  if (!company) {
    const companies = await getCompanyNamesByDirection(slug);
    return NextResponse.json({ questions: [], companies });
  }

  const questions = await getCompanyQuestionsByDirection(slug, company);

  return NextResponse.json({ questions });
}
