import { NextRequest, NextResponse } from "next/server";
import { updateFeedbackStatus } from "@/lib/store";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const body = await req.json();
  const updated = updateFeedbackStatus(id, body.status);
  if (!updated) {
    return NextResponse.json({ error: "Feedback not found" }, { status: 404 });
  }
  return NextResponse.json({ item: updated });
}
