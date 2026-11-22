"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Star,
  CheckCircle2,
  AlertTriangle,
  LayoutDashboard,
  Globe,
  Heart,
  ShieldCheck,
  Sparkles,
  BedDouble,
} from "lucide-react";
import { LangCode, TRANSLATIONS, WARDS } from "@/lib/translations";

const CARE_NOTE: Record<
  LangCode,
  { title: string; body: string; reassurance: string; footerNote: string }
> = {
  en: {
    title: "With You Through Every Step of Care",
    body: "Whether you are here for maternity care, recovery, or a routine visit, your comfort and peace of mind matter deeply to our team.",
    reassurance: "Takes less than 45 seconds • Shared directly with hospital care leadership",
    footerNote: "Crafted with care for Fauzia Maternity & Nursing Home",
  },
  hi: {
    title: "देखभाल के हर कदम पर आपके साथ",
    body: "चाहे आप मैटरनिटी केयर, स्वास्थ्य लाभ या सामान्य परामर्श के लिए आए हों, आपकी सुविधा और संतोष हमारी टीम के लिए सबसे महत्वपूर्ण है।",
    reassurance: "45 सेकंड से भी कम समय • अस्पताल प्रबंधन के लिए सुरक्षित और गोपनीय",
    footerNote: "फ़ौज़िया मैटरनिटी एंड नर्सिंग होम के लिए विशेष रूप से तैयार",
  },
  mr: {
    title: "उपचार आणि काळजीच्या प्रत्येक टप्प्यावर तुमच्या सोबत",
    body: "तुम्ही मॅटर्निटी केअर, उपचारासाठी किंवा नियमित तपासणीसाठी आला असाल, तुमची सोय आणि समाधान आमच्या टीमसाठी अत्यंत महत्त्वाचे आहे.",
    reassurance: "४५ सेकंदांपेक्षा कमी वेळ • रुग्णालय व्यवस्थापनासाठी सुरक्षित आणि गोपनीय",
    footerNote: "फौझिया मॅटर्निटी अँड नर्सिंग होमसाठी आपुलकीने तयार",
  },
};

export default function PatientFeedbackPage() {
  const [lang, setLang] = useState<LangCode>("en");
  const [ward, setWard] = useState<string>(WARDS[0]);
  const [roomNumber, setRoomNumber] = useState<string>("");
  const [patientName, setPatientName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [overallRating, setOverallRating] = useState<number>(5);
  const [doctorRating, setDoctorRating] = useState<number>(5);
  const [nursingRating, setNursingRating] = useState<number>(5);
  const [hygieneRating, setHygieneRating] = useState<number>(5);
  const [foodRating, setFoodRating] = useState<number>(4);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [comments, setComments] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submittedRating, setSubmittedRating] = useState<number | null>(null);

  const t = TRANSLATIONS[lang];
  const note = CARE_NOTE[lang];

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const qWard = params.get("ward");
    const qRoom = params.get("room");
    if (qWard && WARDS.includes(qWard)) setWard(qWard);
    if (qRoom) setRoomNumber(qRoom);
  }, []);

  const handleLanguageChange = (nextLang: LangCode) => {
    setLang(nextLang);
    setSelectedTags([]);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: lang,
          ward,
          roomNumber,
          patientName,
          phone,
          overallRating,
          doctorRating,
          nursingRating,
          hygieneRating,
          foodRating,
          tags: selectedTags,
          comments,
        }),
      });
      if (res.ok) {
        setSubmittedRating(overallRating);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setSubmittedRating(null);
    setPatientName("");
    setPhone("");
    setComments("");
    setSelectedTags([]);
    setOverallRating(5);
    setDoctorRating(5);
    setNursingRating(5);
    setHygieneRating(5);
    setFoodRating(4);
  };

  const StarRow = ({
    value,
    onChange,
    size = 28,
  }: {
    value: number;
    onChange: (n: number) => void;
    size?: number;
  }) => (
    <div className="flex items-center gap-1.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          aria-label={`Rate ${star} stars`}
          className="rounded-full p-0.5 transition-all duration-150 hover:scale-110 active:scale-95"
        >
          <Star
            size={size}
            className={
              star <= value
                ? "fill-amber-400 text-amber-400 drop-shadow-xs"
                : "text-slate-300 hover:text-amber-200"
            }
          />
        </button>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-50/90 via-slate-50 to-slate-100 text-slate-900">
      {/* Accent Top Bar */}
      <div className="h-1.5 w-full bg-gradient-to-r from-[#0b3954] via-teal-600 to-emerald-500" />

      <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-14 items-center justify-center rounded-xl border border-teal-100 bg-white p-1 shadow-2xs">
              <img
                src="/logo.png"
                alt="Fauzia Maternity & Nursing Home"
                className="h-full w-full object-contain"
              />
            </div>
            <div>
              <p className="text-xs font-extrabold tracking-wide text-[#0b3954] sm:text-sm">
                {t.hospitalName}
              </p>
              <p className="text-[11px] font-semibold text-emerald-700">{t.managedBy}</p>
            </div>
          </div>

          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 rounded-xl border border-teal-200/90 bg-teal-50/80 px-3.5 py-2 text-xs font-semibold text-[#0b3954] transition hover:bg-teal-100"
          >
            <LayoutDashboard size={14} />
            <span className="hidden sm:inline">Live Dashboard</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-5 px-4 py-6">
        {/* Language & Care Mode Pill Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white px-4 py-3 shadow-2xs">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
              <Globe size={15} />
            </span>
            <span>{t.badgeText}</span>
          </div>

          <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1">
            {(["en", "hi", "mr"] as LangCode[]).map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => handleLanguageChange(code)}
                className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition ${
                  lang === code
                    ? "bg-[#0b3954] text-white shadow-2xs"
                    : "text-slate-700 hover:bg-white"
                }`}
              >
                {TRANSLATIONS[code].langName}
              </button>
            ))}
          </div>
        </div>

        {/* Warm Welcome Banner */}
        <div className="relative overflow-hidden rounded-2xl border border-teal-200/70 bg-gradient-to-br from-white via-white to-teal-50/60 p-5 shadow-xs sm:p-6">
          <div className="flex items-start gap-3.5">
            <div className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-600 to-emerald-600 text-white shadow-xs">
              <Heart size={20} className="fill-white/20" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-[#0b3954] sm:text-xl">
                {note.title}
              </h1>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">{note.body}</p>
              <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1 text-[11px] font-semibold text-teal-900">
                <ShieldCheck size={13} className="text-teal-700" />
                <span>{note.reassurance}</span>
              </div>
            </div>
          </div>
        </div>

        {submittedRating !== null ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-7 text-center shadow-sm">
            <div
              className={`mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl ${
                submittedRating >= 4
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-amber-50 text-amber-600"
              }`}
            >
              {submittedRating >= 4 ? (
                <CheckCircle2 className="h-9 w-9" />
              ) : (
                <AlertTriangle className="h-9 w-9" />
              )}
            </div>
            <h2 className="text-xl font-bold text-[#0b3954]">{t.thankYouTitle}</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-600">
              {submittedRating >= 4 ? t.thankYouHighMsg : t.thankYouLowMsg}
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              {submittedRating >= 4 && (
                <a
                  href="https://www.google.com/maps"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-2xs transition hover:bg-emerald-700"
                >
                  <Sparkles size={15} />
                  {t.googleReviewBtn}
                </a>
              )}
              <button
                type="button"
                onClick={resetForm}
                className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                {t.submitAnotherBtn}
              </button>
              <Link
                href="/admin"
                className="rounded-xl bg-[#0b3954] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#092d42]"
              >
                {t.openDashboardLink}
              </Link>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="space-y-6 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm sm:p-7"
          >
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-lg font-bold text-[#0b3954] sm:text-xl">{t.heroTitle}</h2>
              <p className="mt-1 text-sm text-slate-600">{t.heroSubtitle}</p>
            </div>

            {/* Ward Selection Pills */}
            <div>
              <p className="mb-2.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                <BedDouble size={14} className="text-teal-700" />
                {t.wardLabel}
              </p>
              <div className="flex flex-wrap gap-2">
                {WARDS.map((w) => {
                  const active = ward === w;
                  return (
                    <button
                      key={w}
                      type="button"
                      onClick={() => setWard(w)}
                      className={`rounded-xl border px-3.5 py-2 text-xs font-semibold transition ${
                        active
                          ? "border-teal-700 bg-teal-700 text-white shadow-2xs"
                          : "border-slate-200 bg-slate-50/80 text-slate-700 hover:border-slate-300 hover:bg-slate-100"
                      }`}
                    >
                      {w}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Room & Optional Patient Details */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  {t.roomLabel}
                </label>
                <input
                  type="text"
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  placeholder="e.g. Suite 301"
                  className="w-full rounded-xl border border-slate-300 bg-slate-50/60 px-3.5 py-2.5 text-sm text-slate-800 transition focus:border-teal-700 focus:bg-white focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  {t.patientNameLabel}
                </label>
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder={t.patientNamePlaceholder}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50/60 px-3.5 py-2.5 text-sm text-slate-800 transition focus:border-teal-700 focus:bg-white focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  {t.phoneLabel}
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={t.phonePlaceholder}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50/60 px-3.5 py-2.5 text-sm text-slate-800 transition focus:border-teal-700 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            {/* Overall Experience Highlight Box */}
            <div className="rounded-2xl border border-teal-200/80 bg-gradient-to-r from-teal-50/80 to-emerald-50/50 p-4 sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-bold text-[#0b3954]">{t.overallPrompt}</p>
                <span className="rounded-full bg-white px-2.5 py-0.5 text-xs font-bold text-teal-800 shadow-2xs">
                  {overallRating} / 5
                </span>
              </div>
              <div className="mt-2.5">
                <StarRow value={overallRating} onChange={setOverallRating} size={34} />
              </div>
              <p className="mt-2.5 text-xs font-semibold text-teal-950">
                {t.ratingLabels[overallRating]}
              </p>
            </div>

            {/* Care Area Ratings */}
            <div className="space-y-3">
              <p className="text-sm font-bold text-[#0b3954]">{t.deptHeading}</p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {[
                  { label: t.doctorLabel, val: doctorRating, set: setDoctorRating },
                  { label: t.nursingLabel, val: nursingRating, set: setNursingRating },
                  { label: t.hygieneLabel, val: hygieneRating, set: setHygieneRating },
                  { label: t.foodLabel, val: foodRating, set: setFoodRating },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between rounded-xl border border-slate-200/90 bg-slate-50/50 px-3.5 py-3 transition hover:border-teal-200"
                  >
                    <span className="text-xs font-semibold text-slate-700">{item.label}</span>
                    <StarRow value={item.val} onChange={item.set} size={18} />
                  </div>
                ))}
              </div>
            </div>

            {/* Care Highlights Chips */}
            <div>
              <p className="mb-2.5 text-sm font-bold text-[#0b3954]">{t.tagsHeading}</p>
              <div className="flex flex-wrap gap-2">
                {t.tags.map((tag) => {
                  const active = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition ${
                        active
                          ? "border-[#0b3954] bg-[#0b3954] text-white shadow-2xs"
                          : "border-slate-300 bg-white text-slate-700 hover:border-teal-300 hover:bg-teal-50/40"
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Personal Note */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                {t.commentLabel}
              </label>
              <textarea
                rows={3}
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder={t.commentPlaceholder}
                className="w-full rounded-xl border border-slate-300 bg-slate-50/60 p-3.5 text-sm text-slate-800 transition focus:border-teal-700 focus:bg-white focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-gradient-to-r from-[#0b3954] to-teal-700 py-3.5 text-sm font-bold text-white shadow-sm transition hover:opacity-95 disabled:opacity-60"
            >
              {submitting ? t.submittingBtn : t.submitBtn}
            </button>
          </form>
        )}

        <p className="pb-4 text-center text-xs text-slate-500">{note.footerNote}</p>
      </main>
    </div>
  );
}