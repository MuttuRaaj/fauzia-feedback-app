import { NextRequest, NextResponse } from "next/server";
import { createFeedback, getAllFeedback } from "@/lib/store";

export async function GET() {
  const items = getAllFeedback();
  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const overallRating = Number(body.overallRating || 5);

    const created = createFeedback({
      patientName: body.patientName?.trim() || undefined,
      phone: body.phone?.trim() || undefined,
      ward: body.ward || "Maternity Suite",
      roomNumber: body.roomNumber?.trim() || undefined,
      language: body.language || "en",
      overallRating,
      doctorRating: Number(body.doctorRating || overallRating),
      nursingRating: Number(body.nursingRating || overallRating),
      hygieneRating: Number(body.hygieneRating || overallRating),
      foodRating: Number(body.foodRating || overallRating),
      tags: Array.isArray(body.tags) ? body.tags : [],
      comments: body.comments?.trim() || undefined,
    });

    return NextResponse.json({ item: created }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid feedback payload" }, { status: 400 });
  }
}
