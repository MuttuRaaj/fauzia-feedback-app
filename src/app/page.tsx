"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Star, CheckCircle2, Send, ShieldCheck } from "lucide-react";
import { LangCode, TRANSLATIONS, WARDS } from "@/lib/translations";

function StarRow({
  value,
  onChange,
  size = 26,
}: {
  value: number;
  onChange: (val: number) => void;
  size?: number;
}) {
  return (
    <div className="flex items-center gap-1.5" role="group">
      {[1, 2, 3, 4, 5].map((star) => {
        const active = star <= value;
        return (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="rounded-lg p-1 transition hover:scale-105 focus:outline-none"
            aria-label={`${star} star`}
          >
            <Star
              size={size}
              className={
                active
                  ? "fill-amber-400 text-amber-400"
                  : "fill-slate-100 text-slate-300"
              }
            />
          </button>
        );
      })}
    </div>
  );
}

function FeedbackFormContent() {
  const searchParams = useSearchParams();

  const [lang, setLang] = useState<LangCode>("en");
  const [dispatchId, setDispatchId] = useState<string | undefined>(undefined);
  const [ward, setWard] = useState<string>(WARDS[0]);
  const [roomNumber, setRoomNumber] = useState<string>("");
  const [patientName, setPatientName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");

  const [overallRating, setOverallRating] = useState<number>(5);
  const [ratings, setRatings] = useState({
    doctor: 5,
    nursing: 5,
    hygiene: 5,
    food: 4,
  });
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [comments, setComments] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submittedAvg, setSubmittedAvg] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const qLang = searchParams.get("lang");
    if (qLang === "en" || qLang === "hi" || qLang === "mr") {
      setLang(qLang);
    }

    const qDid = searchParams.get("did");
    if (qDid) setDispatchId(qDid);

    const qName = searchParams.get("name");
    if (qName) setPatientName(qName);

    const qPhone = searchParams.get("phone");
    if (qPhone) setPhone(qPhone);

    const qWard = searchParams.get("ward");
    if (qWard && WARDS.includes(qWard)) {
      setWard(qWard);
    }

    const qRoom = searchParams.get("room");
    if (qRoom) setRoomNumber(qRoom);
  }, [searchParams]);

  const t = TRANSLATIONS[lang];

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dispatchId,
          language: lang,
          ward,
          roomNumber,
          patientName: patientName.trim() || undefined,
          phone: phone.trim() || undefined,
          overallRating,
          doctorRating: ratings.doctor,
          nursingRating: ratings.nursing,
          hygieneRating: ratings.hygiene,
          foodRating: ratings.food,
          tags: selectedTags,
          comments,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErrorMsg(
          data?.error || `Could not submit feedback (HTTP ${res.status}).`
        );
        return;
      }

      setSubmittedAvg(overallRating);
    } catch (err) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "Network error while submitting feedback. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (submittedAvg !== null) {
    const isHigh = submittedAvg >= 4;
    return (
      <div className="min-h-screen bg-slate-100 px-4 py-10">
        <div className="mx-auto max-w-lg rounded-3xl border border-emerald-100 bg-white p-7 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <CheckCircle2 size={32} />
          </div>
          <h2 className="mt-4 text-xl font-extrabold text-[#0b3954]">
            {t.thankYouTitle}
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            {isHigh ? t.thankYouHighMsg : t.thankYouLowMsg}
          </p>
          <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-4 py-1.5 text-xs font-bold text-amber-800">
            <span>{t.overallPrompt}:</span>
            <span>{submittedAvg} / 5 ★</span>
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                setSubmittedAvg(null);
                setComments("");
                setSelectedTags([]);
                setErrorMsg(null);
              }}
              className="rounded-xl bg-[#0b3954] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#092d42]"
            >
              {t.submitAnotherBtn}
            </button>
            <Link
              href="/admin"
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
            >
              {t.openDashboardLink}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="h-1.5 w-full bg-gradient-to-r from-[#0b3954] via-teal-600 to-emerald-500" />

      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt={t.hospitalName}
              className="h-11 w-11 rounded-xl border border-slate-200 object-contain p-1"
            />
            <div>
              <h1 className="text-sm font-extrabold text-[#0b3954] sm:text-base">
                {t.hospitalName}
              </h1>
              <p className="text-[11px] font-medium text-slate-500">
                {t.managedBy} • {t.badgeText}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {(["en", "hi", "mr"] as const).map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => setLang(code)}
                className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                  lang === code
                    ? "bg-teal-700 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {TRANSLATIONS[code].langName}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-6">
        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-2xs"
        >
          <div>
            <h2 className="text-lg font-extrabold text-[#0b3954]">
              {t.heroTitle}
            </h2>
            <p className="mt-1 text-xs text-slate-600">{t.heroSubtitle}</p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-bold text-slate-700">
                {t.wardLabel}
              </label>
              <select
                value={ward}
                onChange={(e) => setWard(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-xs font-medium text-slate-800"
              >
                {WARDS.map((w) => (
                  <option key={w} value={w}>
                    {w}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold text-slate-700">
                {t.roomLabel}
              </label>
              <input
                type="text"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                placeholder="e.g. Suite 301"
                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-xs font-medium text-slate-800"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold text-slate-700">
                {t.patientNameLabel}
              </label>
              <input
                type="text"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder={t.patientNamePlaceholder}
                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-xs font-medium text-slate-800"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold text-slate-700">
                {t.phoneLabel}
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t.phonePlaceholder}
                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-xs font-medium text-slate-800"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <p className="text-xs font-extrabold text-[#0b3954]">
              {t.overallPrompt} *
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <StarRow
                value={overallRating}
                onChange={setOverallRating}
                size={30}
              />
              <span className="text-xs font-semibold text-teal-800">
                {t.ratingLabels[overallRating]}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {t.deptHeading}
            </h3>

            {(
              [
                ["doctor", t.doctorLabel],
                ["nursing", t.nursingLabel],
                ["hygiene", t.hygieneLabel],
                ["food", t.foodLabel],
              ] as const
            ).map(([key, label]) => (
              <div
                key={key}
                className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-slate-100 px-4 py-2.5"
              >
                <span className="text-xs font-bold text-slate-700">
                  {label}
                </span>
                <StarRow
                  value={ratings[key]}
                  onChange={(val) =>
                    setRatings((prev) => ({ ...prev, [key]: val }))
                  }
                  size={22}
                />
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {t.tagsHeading}
            </h3>
            <div className="flex flex-wrap gap-2">
              {t.tags.map((tag) => {
                const active = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                      active
                        ? "bg-teal-700 text-white"
                        : "border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold text-slate-700">
              {t.commentLabel}
            </label>
            <textarea
              rows={3}
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder={t.commentPlaceholder}
              className="w-full rounded-xl border border-slate-300 p-3 text-xs font-medium text-slate-800"
            />
          </div>

          {errorMsg && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs font-semibold text-rose-700">
              {errorMsg}
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
              <ShieldCheck size={14} className="text-teal-700" />
              <span>{t.managedBy}</span>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-xl bg-teal-700 px-6 py-3 text-xs font-extrabold text-white transition hover:bg-teal-800 disabled:opacity-60"
            >
              <Send size={14} />
              {submitting ? t.submittingBtn : t.submitBtn}
            </button>
          </div>
        </form>

        <div className="mt-4 flex justify-center gap-4 text-xs font-semibold text-slate-500">
          <Link href="/dispatch" className="hover:text-teal-700">
            Reception WhatsApp Dispatch
          </Link>
          <span>•</span>
          <Link href="/admin" className="hover:text-teal-700">
            {t.openDashboardLink}
          </Link>
        </div>
      </main>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-slate-100 text-xs font-semibold text-slate-600">
          Loading...
        </div>
      }
    >
      <FeedbackFormContent />
    </Suspense>
  );
}