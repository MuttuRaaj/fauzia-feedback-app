"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Send,
  MessageSquare,
  Smartphone,
  Copy,
  Check,
  UserPlus,
  LayoutDashboard,
  Upload,
} from "lucide-react";
import type { PatientDispatchRecord } from "@/lib/store";
import { LangCode, WARDS } from "@/lib/translations";

const LIVE_FALLBACK_ORIGIN = "https://fauzia-feedback-app.vercel.app";

function formatIndianWhatsAppNumber(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) return `91${digits}`;
  if (digits.startsWith("91") && digits.length === 12) return digits;
  return digits;
}

function buildLocalizedMessage(
  item: PatientDispatchRecord,
  personalUrl: string
): string {
  if (item.language === "hi") {
    return `नमस्ते ${item.patientName} जी,\n\nफ़ौज़िया मैटरनिटी एंड नर्सिंग होम (Fauzia Maternity & Nursing Home) में आपके उपचार एवं देखभाल के अनुभव के बारे में अपनी राय साझा करने के लिए कृपया नीचे दिए गए लिंक पर क्लिक करें (केवल 30 सेकंड):\n\n${personalUrl}\n\nआपका स्वास्थ्य हमारे लिए सर्वोपरि है। धन्यवाद!`;
  }
  if (item.language === "mr") {
    return `नमस्कार ${item.patientName},\n\nफौजिया मॅटर्निटी अँड नर्सिंग होम (Fauzia Maternity & Nursing Home) मधील तुमच्या उपचार व सेवेचा अनुभव शेअर करण्यासाठी कृपया खालील लिंकवर क्लिक करा (फक्त ३० सेकंद):\n\n${personalUrl}\n\nतुमची प्रतिक्रिया आमच्यासाठी अत्यंत महत्त्वाची आहे. धन्यवाद!`;
  }
  return `Dear ${item.patientName},\n\nThank you for trusting Fauzia Maternity & Nursing Home with your care. Please take 30 seconds to share your experience using your personal feedback link below:\n\n${personalUrl}\n\nYour feedback helps us serve every mother and family better.`;
}

export default function ReceptionDispatchPage() {
  const [items, setItems] = useState<PatientDispatchRecord[]>([]);
  const [origin, setOrigin] = useState(LIVE_FALLBACK_ORIGIN);
  const [patientName, setPatientName] = useState("");
  const [guardianPhone, setGuardianPhone] = useState("");
  const [ward, setWard] = useState<string>(WARDS[0]);
  const [roomNumber, setRoomNumber] = useState("");
  const [language, setLanguage] = useState<LangCode>("en");
  const [bulkText, setBulkText] = useState("");
  const [showBulk, setShowBulk] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const currentOrigin = window.location.origin;
    if (
      currentOrigin &&
      !currentOrigin.includes("localhost") &&
      !currentOrigin.includes("127.0.0.1")
    ) {
      setOrigin(currentOrigin);
    }
    loadDispatches();
  }, []);

  const loadDispatches = async () => {
    const res = await fetch("/api/dispatch", { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      setItems(data.items || []);
    }
  };

  const buildPersonalUrl = (item: PatientDispatchRecord) => {
    const params = new URLSearchParams({
      did: item.id,
      name: item.patientName,
      phone: item.guardianPhone,
      ward: item.ward,
      lang: item.language,
    });
    if (item.roomNumber) params.set("room", item.roomNumber);
    return `${origin}/?${params.toString()}`;
  };

  const handleAddSingle = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);
    try {
      const res = await fetch("/api/dispatch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientName,
          guardianPhone,
          ward,
          roomNumber,
          language,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Could not add patient.");
        return;
      }
      setPatientName("");
      setGuardianPhone("");
      setRoomNumber("");
      await loadDispatches();
    } finally {
      setSaving(false);
    }
  };

  const handleBulkImport = async () => {
    setSaving(true);
    setErrorMsg(null);
    try {
      const lines = bulkText
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter(Boolean);
      const entries = lines.map((line) => {
        const parts = line.split(/[,\t|]+/).map((p) => p.trim());
        return {
          patientName: parts[0] || "",
          guardianPhone: parts[1] || "",
          ward: parts[2] || ward,
          roomNumber: parts[3] || "",
          language,
        };
      });

      const res = await fetch("/api/dispatch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entries }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(
          data.error ||
            "Format each line as: Patient Name, Mobile Number, Ward, Room"
        );
        return;
      }
      setBulkText("");
      setShowBulk(false);
      await loadDispatches();
    } finally {
      setSaving(false);
    }
  };

  const triggerSend = async (
    item: PatientDispatchRecord,
    channel: "WHATSAPP" | "SMS"
  ) => {
    const url = buildPersonalUrl(item);
    const message = buildLocalizedMessage(item, url);

    await fetch("/api/dispatch", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: item.id, channel }),
    });
    await loadDispatches();

    if (channel === "WHATSAPP") {
      const waPhone = formatIndianWhatsAppNumber(item.guardianPhone);
      window.open(
        `https://wa.me/${waPhone}?text=${encodeURIComponent(message)}`,
        "_blank",
        "noopener,noreferrer"
      );
    } else {
      const cleanPhone = item.guardianPhone.replace(/\s+/g, "");
      window.location.href = `sms:${cleanPhone}?body=${encodeURIComponent(
        message
      )}`;
    }
  };

  const copyLink = async (item: PatientDispatchRecord) => {
    const url = buildPersonalUrl(item);
    await navigator.clipboard.writeText(url);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="h-1.5 w-full bg-gradient-to-r from-[#0b3954] via-teal-600 to-emerald-500" />

      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div>
            <h1 className="text-sm font-extrabold text-[#0b3954] sm:text-base">
              Fauzia Maternity &amp; Nursing Home — Reception Feedback Dispatch
            </h1>
            <p className="text-xs font-medium text-emerald-700">
              Send Personalized Feedback Links to Registered Patient / Guardian Numbers via WhatsApp &amp; SMS
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#0b3954] px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-[#092d42]"
            >
              <LayoutDashboard size={14} />
              Care Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-6 px-4 py-6">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h2 className="flex items-center gap-2 text-sm font-extrabold text-[#0b3954]">
              <UserPlus size={16} className="text-teal-700" />
              Add Admitted / Discharged Patient Number
            </h2>
            <button
              type="button"
              onClick={() => setShowBulk(!showBulk)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
            >
              <Upload size={13} />
              {showBulk ? "Single Patient Entry" : "Paste Multiple from Register"}
            </button>
          </div>

          {errorMsg && (
            <div className="mb-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">
              {errorMsg}
            </div>
          )}

          {!showBulk ? (
            <form
              onSubmit={handleAddSingle}
              className="grid grid-cols-1 gap-3 sm:grid-cols-6"
            >
              <input
                type="text"
                required
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="Patient Name *"
                className="rounded-xl border border-slate-300 px-3 py-2 text-xs font-medium sm:col-span-2"
              />
              <input
                type="tel"
                required
                value={guardianPhone}
                onChange={(e) => setGuardianPhone(e.target.value)}
                placeholder="Patient / Guardian Mobile *"
                className="rounded-xl border border-slate-300 px-3 py-2 text-xs font-medium"
              />
              <select
                value={ward}
                onChange={(e) => setWard(e.target.value)}
                className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-medium"
              >
                {WARDS.map((w) => (
                  <option key={w} value={w}>
                    {w}
                  </option>
                ))}
              </select>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  placeholder="Room/Bed"
                  className="w-1/2 rounded-xl border border-slate-300 px-2.5 py-2 text-xs font-medium"
                />
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as LangCode)}
                  className="w-1/2 rounded-xl border border-slate-300 bg-white px-2 py-2 text-xs font-semibold"
                >
                  <option value="en">EN</option>
                  <option value="hi">हिंदी</option>
                  <option value="mr">मराठी</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-teal-700 px-4 py-2 text-xs font-bold text-white transition hover:bg-teal-800 disabled:opacity-60"
              >
                <Send size={13} />
                Create Link
              </button>
            </form>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-slate-600">
                Paste one patient per line from Excel/register:{" "}
                <code className="rounded bg-slate-100 px-1.5 py-0.5 font-semibold">
                  Patient Name, Mobile Number, Ward, Room
                </code>
              </p>
              <textarea
                rows={4}
                value={bulkText}
                onChange={(e) => setBulkText(e.target.value)}
                placeholder={
                  "Sana Farooqui, 9823011223, Maternity Suite, Suite 301\nPriya Deshmukh, 9765409812, Private Room, Room 202"
                }
                className="w-full rounded-xl border border-slate-300 p-3 text-xs font-medium"
              />
              <div className="flex items-center justify-between">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as LangCode)}
                  className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold"
                >
                  <option value="en">Message Language: English</option>
                  <option value="hi">Message Language: हिंदी</option>
                  <option value="mr">Message Language: मराठी</option>
                </select>
                <button
                  type="button"
                  onClick={handleBulkImport}
                  disabled={saving}
                  className="rounded-xl bg-teal-700 px-4 py-2 text-xs font-bold text-white hover:bg-teal-800"
                >
                  Generate Links for All
                </button>
              </div>
            </div>
          )}
        </section>

        <section className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Registered Patient / Guardian Dispatch List ({items.length})
          </h2>

          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs"
            >
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-bold text-slate-900">
                    {item.patientName}
                  </span>
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700">
                    +91 {item.guardianPhone}
                  </span>
                  <span className="rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-semibold text-teal-900">
                    {item.ward}
                    {item.roomNumber ? ` • ${item.roomNumber}` : ""}
                  </span>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-bold uppercase text-slate-600">
                    {item.language}
                  </span>
                  {item.status === "SUBMITTED" && (
                    <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                      ✓ Feedback Submitted ({item.submittedRating}★)
                    </span>
                  )}
                  {item.status === "SENT" && (
                    <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-800">
                      Link Sent via {item.sentVia}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-[11px] text-slate-500">
                  Reg ID: {item.id} • Added{" "}
                  {new Date(item.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => triggerSend(item, "WHATSAPP")}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white transition hover:bg-emerald-700"
                >
                  <MessageSquare size={14} />
                  Send WhatsApp
                </button>
                <button
                  type="button"
                  onClick={() => triggerSend(item, "SMS")}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#0b3954] px-3.5 py-2 text-xs font-bold text-white transition hover:bg-[#092d42]"
                >
                  <Smartphone size={14} />
                  Send SMS
                </button>
                <button
                  type="button"
                  onClick={() => copyLink(item)}
                  className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                >
                  {copiedId === item.id ? (
                    <>
                      <Check size={13} className="text-emerald-600" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy size={13} />
                      Copy Link
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}