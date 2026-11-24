import { NextResponse } from "next/server";
import {
  createDispatches,
  getAllDispatches,
  markDispatchSent,
} from "@/lib/store";
import { LangCode, WARDS } from "@/lib/translations";

export async function GET() {
  return NextResponse.json({ items: getAllDispatches() });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const rawList = Array.isArray(body.entries) ? body.entries : [body];

    const validEntries = rawList
      .filter(
        (e: Record<string, unknown>) =>
          typeof e?.patientName === "string" &&
          e.patientName.trim().length > 0 &&
          typeof e?.guardianPhone === "string" &&
          e.guardianPhone.replace(/\D/g, "").length >= 10
      )
      .map((e: Record<string, unknown>) => ({
        patientName: String(e.patientName).trim(),
        guardianPhone: String(e.guardianPhone).trim(),
        ward: WARDS.includes(String(e.ward)) ? String(e.ward) : WARDS[0],
        roomNumber: e.roomNumber ? String(e.roomNumber).trim() : "",
        language: (["en", "hi", "mr"].includes(String(e.language))
          ? String(e.language)
          : "en") as LangCode,
      }));

    if (validEntries.length === 0) {
      return NextResponse.json(
        { error: "Please enter a valid patient name and 10-digit mobile number." },
        { status: 400 }
      );
    }

    const created = createDispatches(validEntries);
    return NextResponse.json({ items: created }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Invalid patient dispatch payload." },
      { status: 400 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const id = String(body.id || "");
    const channel = body.channel === "SMS" ? "SMS" : "WHATSAPP";
    const updated = markDispatchSent(id, channel);
    if (!updated) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 });
    }
    return NextResponse.json({ item: updated });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}