import { NextResponse } from "next/server";
import { createFeedback, getAllFeedback } from "@/lib/store";
import { LangCode, WARDS } from "@/lib/translations";

export async function GET() {
  return NextResponse.json({ items: getAllFeedback() });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const overallRating = Number(body.overallRating);
    if (!Number.isFinite(overallRating) || overallRating < 1 || overallRating > 5) {
      return NextResponse.json(
        { error: "Please select an overall rating between 1 and 5." },
        { status: 400 }
      );
    }

    const clampRating = (val: unknown) => {
      const n = Number(val);
      return Number.isFinite(n) && n >= 1 && n <= 5 ? n : overallRating;
    };

    const ward = WARDS.includes(String(body.ward))
      ? String(body.ward)
      : WARDS[0];

    const language: LangCode = ["en", "hi", "mr"].includes(String(body.language))
      ? (String(body.language) as LangCode)
      : "en";

    const record = createFeedback({
      dispatchId: body.dispatchId ? String(body.dispatchId).trim() : undefined,
      patientName: body.patientName ? String(body.patientName).trim() : undefined,
      phone: body.phone ? String(body.phone).trim() : undefined,
      ward,
      roomNumber: body.roomNumber ? String(body.roomNumber).trim() : undefined,
      language,
      overallRating,
      doctorRating: clampRating(body.doctorRating),
      nursingRating: clampRating(body.nursingRating),
      hygieneRating: clampRating(body.hygieneRating),
      foodRating: clampRating(body.foodRating),
      tags: Array.isArray(body.tags) ? body.tags.map(String) : [],
      comments: body.comments ? String(body.comments).trim() : undefined,
    });

    return NextResponse.json({ item: record }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : "Failed to save patient feedback.",
      },
      { status: 500 }
    );
  }
}