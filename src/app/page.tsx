"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Star,
  CheckCircle2,
  AlertTriangle,
  LayoutDashboard,
  QrCode,
  ShieldCheck,
  Send,
  Smartphone,
  BarChart3,
} from "lucide-react";
import { LangCode, TRANSLATIONS, WARDS } from "@/lib/translations";

type DeptKey = "doctor" | "nursing" | "cleanliness" | "food" | "billing";

const DEMO_GUIDE: Record<
  LangCode,
  {
    badge: string;
    heading: string;
    intro: string;
    step1: string;
    step2: string;
    step3: string;
    qrBtn: string;
    anonLabel: string;
    anonName: string;
    deptTitle: string;
    depts: Record<DeptKey, { title: string; sub: string }>;
    starText: Record<number, string>;
  }
> = {
  en: {
    badge: "Client Demo Guide",
    heading: "Zero-Install Bedside Experience",
    intro:
      "Patients in rooms or at the discharge desk scan the bedside QR standee and open the form directly on their phone in their preferred language.",
    step1: "Switch between English, हिंदी, and मराठी at the top of the phone.",
    step2:
      "Test a 5-star submission for positive care or a 1–3 star submission to trigger a Priority Care Alert on the dashboard.",
    step3: "Open Live Dashboard to see the submission appear with department scores and filters.",
    qrBtn: "Open Bedside QR Standee",
    anonLabel: "Stay Anonymous",
    anonName: "Anonymous Patient",
    deptTitle: "Rate Hospital Services",
    depts: {
      doctor: { title: "Doctors", sub: "Consultation & medical care" },
      nursing: { title: "Nursing Care", sub: "Warmth, support & attentiveness" },
      cleanliness: { title: "Room Cleanliness", sub: "Hygiene, bed & washroom" },
      food: { title: "Food & Meals", sub: "Nutritious diet & timeliness" },
      billing: { title: "Discharge & Billing", sub: "Transparency & smooth process" },
    },
    starText: {
      1: "Poor",
      2: "Fair",
      3: "Good",
      4: "Very Good",
      5: "Excellent",
    },
  },
  hi: {
    badge: "क्लाइंट डेमो गाइड",
    heading: "बिना ऐप डाउनलोड के बेडसाइड अनुभव",
    intro:
      "कमरे या डिस्चार्ज डेस्क पर रखे QR कोड को स्कैन करते ही मरीज़ अपने फ़ोन पर अपनी पसंदीदा भाषा में फ़ीडबैक दे सकते हैं।",
    step1: "फ़ोन के ऊपरी हिस्से में English, हिंदी और मराठी चुनें।",
    step2:
      "अच्छे अनुभव के लिए 4–5 स्टार और सुधार की ज़रूरत होने पर 1–3 स्टार देकर डैशबोर्ड अलर्ट देखें।",
    step3: "Live Dashboard खोलकर तुरंत सबमिट हुआ फ़ीडबैक देखें।",
    qrBtn: "बेडसाइड QR स्टैंडी खोलें",
    anonLabel: "गुमनाम रहें",
    anonName: "गुमनाम मरीज़",
    deptTitle: "अस्पताल सेवाओं को रेटिंग दें",
    depts: {
      doctor: { title: "डॉक्टर", sub: "परामर्श और चिकित्सीय देखभाल" },
      nursing: { title: "नर्सिंग केयर", sub: "अपनापन, सहयोग और तत्परता" },
      cleanliness: { title: "रूम की स्वच्छता", sub: "सफाई, बिस्तर और वॉशरूम" },
      food: { title: "भोजन और आहार", sub: "पौष्टिक भोजन और समयबद्धता" },
      billing: { title: "डिस्चार्ज और बिलिंग", sub: "पारदर्शिता और आसान प्रक्रिया" },
    },
    starText: {
      1: "खराब",
      2: "ठीक-ठाक",
      3: "अच्छा",
      4: "बहुत अच्छा",
      5: "उत्कृष्ट",
    },
  },
  mr: {
    badge: "क्लायंट डेमो मार्गदर्शिका",
    heading: "कोणत्याही ॲपशिवाय बेडसाइड अनुभव",
    intro:
      "खोलीत किंवा डिस्चार्ज डेस्कवर QR स्कॅन करताच रुग्ण आपल्या मोबाइलवर पसंतीच्या भाषेत अभिप्राय देऊ शकतात.",
    step1: "मोबाइलच्या वरच्या भागात English, हिंदी आणि मराठी निवडा.",
    step2:
      "उत्तम सेवेसाठी ४–५ स्टार आणि त्वरित दुरुस्तीसाठी १–३ स्टार देऊन डॅशबोर्ड अलर्ट तपासा.",
    step3: "Live Dashboard उघडून आलेला अभिप्राय थेट पहा.",
    qrBtn: "बेडसाइड QR स्टँडी उघडा",
    anonLabel: "नाव गुप्त ठेवा",
    anonName: "अनामिक रुग्ण",
    deptTitle: "रुग्णालय सेवांना रेटिंग द्या",
    depts: {
      doctor: { title: "डॉक्टर", sub: "सल्लामसलत आणि वैद्यकीय उपचार" },
      nursing: { title: "नर्सिंग केअर", sub: "आपुलकी, मदत आणि तत्परता" },
      cleanliness: { title: "रूमची स्वच्छता", sub: "स्वच्छता, बेड आणि वॉशरूम" },
      food: { title: "जेवण आणि आहार", sub: "पौष्टिक आहार आणि वेळेवर सेवा" },
      billing: { title: "डिस्चार्ज आणि बिलिंग", sub: "स्पष्टता आणि सोपी प्रक्रिया" },
    },
    starText: {
      1: "खराब",
      2: "साधारण",
      3: "चांगले",
      4: "खूप छान",
      5: "उत्कृष्ट",
    },
  },
};

function FauziaBrandLockup({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2.5 select-none text-left">
      <svg
        viewBox="0 0 120 100"
        className={compact ? "h-9 w-11 shrink-0" : "h-12 w-14 shrink-0"}
        aria-hidden="true"
      >
        <path
          d="M56 10 C32 14, 14 34, 16 58 C18 40, 34 25, 55 21 Z"
          fill="#1e2952"
        />
        <path
          d="M58 16 C38 20, 23 36, 22 56 C27 40, 40 28, 57 24 Z"
          fill="#0d9488"
        />
        <path
          d="M10 54 L36 54 L43 40 L51 74 L60 28 L68 64 L75 51 L108 51"
          fill="none"
          stroke="#0284c7"
          strokeWidth="4.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M24 68 C36 84, 62 90, 96 66 C74 77, 48 77, 29 63 Z"
          fill="#16a34a"
        />
        <path
          d="M28 73 C42 90, 72 93, 102 68 C78 82, 50 83, 32 68 Z"
          fill="#1e2952"
        />
      </svg>
      <div className="min-w-0">
        <div
          className={`font-serif font-extrabold leading-none tracking-wide text-[#0f2942] ${
            compact ? "text-base" : "text-lg"
          }`}
        >
          FAUZIA
        </div>
        <div
          className={`mt-0.5 inline-block whitespace-nowrap border-b-2 border-[#16a34a] pb-0.5 font-bold uppercase tracking-wider text-[#1e2952] ${
            compact ? "text-[7px]" : "text-[8px]"
          }`}
        >
          MATERNITY &amp; NURSING HOME
        </div>
        <div
          className={`mt-0.5 whitespace-nowrap font-medium leading-tight text-slate-600 ${
            compact ? "text-[8px]" : "text-[9px]"
          }`}
        >
          Managed by{" "}
          <span className="font-semibold text-[#1e2952]">Elite4Ever</span>{" "}
          <span className="font-semibold text-[#0284c7]">HealthCare LLP</span>
        </div>
      </div>
    </div>
  );
}

export default function PatientFeedbackPage() {
  const [lang, setLang] = useState<LangCode>("en");
  const [ward, setWard] = useState<string>(WARDS[0]);
  const [roomNumber, setRoomNumber] = useState<string>("Room 204");
  const [patientName, setPatientName] = useState<string>("");
  const [anonymous, setAnonymous] = useState<boolean>(false);
  const [phone, setPhone] = useState<string>("");
  const [ratings, setRatings] = useState<Record<DeptKey, number>>({
    doctor: 5,
    nursing: 5,
    cleanliness: 5,
    food: 5,
    billing: 5,
  });
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [comments, setComments] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submittedAvg, setSubmittedAvg] = useState<number | null>(null);

  const t = TRANSLATIONS[lang];
  const guide = DEMO_GUIDE[lang];

  const overallRating = Math.max(
    1,
    Math.min(
      5,
      Math.round(
        (ratings.doctor +
          ratings.nursing +
          ratings.cleanliness +
          ratings.food +
          ratings.billing) /
          5
      )
    )
  );

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
    if (anonymous) {
      setPatientName(DEMO_GUIDE[nextLang].anonName);
    }
  };

  const handleToggleAnonymous = (checked: boolean) => {
    setAnonymous(checked);
    if (checked) {
      setPatientName(guide.anonName);
    } else {
      setPatientName("");
    }
  };

  const setDeptRating = (key: DeptKey, value: number) => {
    setRatings((prev) => ({ ...prev, [key]: value }));
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
      const finalName = anonymous
        ? guide.anonName
        : patientName.trim() || guide.anonName;
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: lang,
          ward,
          roomNumber,
          patientName: finalName,
          phone,
          overallRating,
          doctorRating: ratings.doctor,
          nursingRating: ratings.nursing,
          hygieneRating: ratings.cleanliness,
          foodRating: ratings.food,
          tags:
            ratings.billing < 5
              ? [...selectedTags, `Billing: ${ratings.billing}★`]
              : selectedTags,
          comments,
        }),
      });
      if (res.ok) {
        setSubmittedAvg(overallRating);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setSubmittedAvg(null);
    setAnonymous(false);
    setPatientName("");
    setPhone("");
    setComments("");
    setSelectedTags([]);
    setRatings({
      doctor: 5,
      nursing: 5,
      cleanliness: 5,
      food: 5,
      billing: 5,
    });
  };

  const DeptStars = ({ deptKey }: { deptKey: DeptKey }) => {
    const val = ratings[deptKey];
    return (
      <div className="flex flex-col items-end gap-0.5">
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setDeptRating(deptKey, star)}
              aria-label={`${guide.depts[deptKey].title} ${star} stars`}
              className="p-0.5 transition-transform hover:scale-110 active:scale-95"
            >
              <Star
                size={15}
                className={
                  star <= val
                    ? "fill-amber-400 text-amber-400"
                    : "text-slate-200 hover:text-amber-200"
                }
              />
            </button>
          ))}
        </div>
        <span className="text-[10px] font-semibold text-teal-700">
          {val}★ • {guide.starText[val]}
        </span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Top Presenter & Navigation Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex flex-wrap items-center gap-3">
            <FauziaBrandLockup compact />
            <span className="hidden rounded-full border border-rose-200 bg-rose-50 px-2.5 py-0.5 text-[11px] font-semibold text-rose-600 sm:inline-flex">
              CarePulse Live
            </span>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-100 p-1">
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-teal-700 shadow-2xs">
              <Smartphone size={14} />
              <span>1. Patient Bedside App</span>
            </span>
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:text-slate-900"
            >
              <BarChart3 size={14} />
              <span>2. Hospital Dashboard</span>
            </Link>
          </div>

          <Link
            href="/qr-standee"
            className="inline-flex items-center gap-1.5 rounded-xl border border-teal-200 bg-teal-50 px-3.5 py-2 text-xs font-semibold text-teal-800 transition hover:bg-teal-100"
          >
            <QrCode size={14} />
            <span>Bedside QR Standee</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <div className="flex flex-col items-start justify-center gap-8 lg:flex-row">
          {/* Left Demo Guide Card (Hidden on small mobile screens for clean bedside view) */}
          <aside className="order-2 hidden w-full max-w-xs space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs lg:order-1 lg:block">
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-700">
              <ShieldCheck size={14} />
              {guide.badge}
            </span>
            <h1 className="text-base font-bold text-slate-900">{guide.heading}</h1>
            <p className="text-xs leading-relaxed text-slate-600">{guide.intro}</p>

            <div className="space-y-2.5 pt-1 text-xs text-slate-700">
              <div className="flex items-start gap-2.5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-100 text-[11px] font-bold text-rose-600">
                  1
                </span>
                <span>{guide.step1}</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-100 text-[11px] font-bold text-rose-600">
                  2
                </span>
                <span>{guide.step2}</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-100 text-[11px] font-bold text-rose-600">
                  3
                </span>
                <span>{guide.step3}</span>
              </div>
            </div>

            <div className="space-y-2 border-t border-slate-100 pt-3">
              <Link
                href="/qr-standee"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-slate-800"
              >
                <QrCode size={14} />
                <span>{guide.qrBtn}</span>
              </Link>
              <Link
                href="/admin"
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                <LayoutDashboard size={14} />
                <span>{t.openDashboardLink}</span>
              </Link>
            </div>
          </aside>

          {/* Mobile App Frame (Full width on phone, framed showcase on desktop) */}
          <div className="order-1 mx-auto w-full max-w-[410px] overflow-hidden rounded-[2.25rem] border border-slate-200 bg-white shadow-xl lg:order-2">
            {/* Top Teal Gradient Brand Banner */}
            <div className="relative overflow-hidden bg-gradient-to-br from-teal-700 via-teal-800 to-slate-900 p-5 text-white">
              <div className="mb-3 flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-0.5 text-[10px] font-medium text-teal-100">
                  {t.badgeText}
                </span>

                {/* Language Switcher: English / हिंदी / मराठी */}
                <div className="flex items-center rounded-lg border border-white/15 bg-slate-950/50 p-0.5 text-[11px] font-semibold">
                  {(["en", "hi", "mr"] as LangCode[]).map((code) => (
                    <button
                      key={code}
                      type="button"
                      onClick={() => handleLanguageChange(code)}
                      className={`rounded-md px-2.5 py-1 transition ${
                        lang === code
                          ? "bg-white text-teal-800 shadow-2xs"
                          : "text-white/85 hover:text-white"
                      }`}
                    >
                      {TRANSLATIONS[code].langName}
                    </button>
                  ))}
                </div>
              </div>

              {/* Crisp Fauzia + Elite4Ever HealthCare LLP Brand Card */}
              <div className="mb-2.5 rounded-2xl bg-white p-3 text-slate-900 shadow-md">
                <FauziaBrandLockup />
              </div>

              <p className="text-xs text-teal-100">{t.heroSubtitle}</p>
            </div>

            {submittedAvg !== null ? (
              <div className="space-y-4 bg-white p-6 text-center">
                {submittedAvg >= 4 ? (
                  <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-600" />
                ) : (
                  <AlertTriangle className="mx-auto h-14 w-14 text-rose-500" />
                )}
                <h2 className="text-xl font-bold text-slate-900">
                  {submittedAvg >= 4 ? t.thankYouTitle : guide.badge}
                </h2>
                <p className="mx-auto max-w-xs text-xs leading-relaxed text-slate-600">
                  {submittedAvg >= 4 ? t.thankYouHighMsg : t.thankYouLowMsg}
                </p>

                <div className="flex flex-col gap-2 pt-2">
                  {submittedAvg >= 4 && (
                    <a
                      href="https://www.google.com/maps"
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-blue-700"
                    >
                      {t.googleReviewBtn}
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={resetForm}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    {t.submitAnotherBtn}
                  </button>
                  <Link
                    href="/admin"
                    className="rounded-xl bg-teal-700 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-teal-800"
                  >
                    {t.openDashboardLink}
                  </Link>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="space-y-3.5 bg-slate-50/70 p-4"
              >
                {/* Patient Name + Anonymous Toggle */}
                <div className="space-y-2 rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-700">
                      {t.patientNameLabel}
                    </label>
                    <label className="inline-flex cursor-pointer items-center gap-1.5 text-[11px] font-medium text-slate-500">
                      <input
                        type="checkbox"
                        checked={anonymous}
                        onChange={(e) => handleToggleAnonymous(e.target.checked)}
                        className="rounded text-teal-600"
                      />
                      <span>{guide.anonLabel}</span>
                    </label>
                  </div>
                  <input
                    type="text"
                    disabled={anonymous}
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder={t.patientNamePlaceholder}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-teal-500 focus:outline-none disabled:bg-slate-100 disabled:text-slate-400"
                  />
                </div>

                {/* Ward + Room + Mobile */}
                <div className="grid grid-cols-2 gap-2.5 rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-2xs">
                  <div className="col-span-2">
                    <label className="mb-1 block text-xs font-semibold text-slate-700">
                      {t.wardLabel}
                    </label>
                    <select
                      value={ward}
                      onChange={(e) => setWard(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-2.5 py-2 text-xs font-medium text-slate-800 focus:border-teal-500 focus:outline-none"
                    >
                      {WARDS.map((w) => (
                        <option key={w} value={w}>
                          {w}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-700">
                      {t.roomLabel}
                    </label>
                    <input
                      type="text"
                      value={roomNumber}
                      onChange={(e) => setRoomNumber(e.target.value)}
                      placeholder="Room 204"
                      className="w-full rounded-xl border border-slate-200 bg-white px-2.5 py-2 text-xs text-slate-800 focus:border-teal-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-700">
                      {t.phoneLabel}
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder={t.phonePlaceholder}
                      className="w-full rounded-xl border border-slate-200 bg-white px-2.5 py-2 text-xs text-slate-800 focus:border-teal-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* 5 Department Star Ratings */}
                <div className="space-y-2.5 rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <p className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                      <Star size={14} className="fill-amber-400 text-amber-400" />
                      <span>{guide.deptTitle}</span>
                    </p>
                    <span className="rounded-full bg-teal-50 px-2.5 py-0.5 text-[10px] font-bold text-teal-800">
                      Avg {overallRating}★
                    </span>
                  </div>

                  {(Object.keys(guide.depts) as DeptKey[]).map((key, idx) => (
                    <div
                      key={key}
                      className={`flex items-center justify-between py-1.5 ${
                        idx < 4 ? "border-b border-slate-100" : ""
                      }`}
                    >
                      <div className="pr-2">
                        <p className="text-xs font-semibold text-slate-700">
                          {guide.depts[key].title}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {guide.depts[key].sub}
                        </p>
                      </div>
                      <DeptStars deptKey={key} />
                    </div>
                  ))}
                </div>

                {/* Quick Highlight Chips */}
                <div className="space-y-2 rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-2xs">
                  <p className="text-xs font-semibold text-slate-700">
                    {t.tagsHeading}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {t.tags.map((tag) => {
                      const active = selectedTags.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => toggleTag(tag)}
                          className={`rounded-full border px-2.5 py-1 text-[11px] font-medium transition ${
                            active
                              ? "border-teal-600 bg-teal-600 text-white"
                              : "border-slate-200 bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}
                        >
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Comments */}
                <div className="space-y-1.5 rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-2xs">
                  <label className="block text-xs font-semibold text-slate-700">
                    {t.commentLabel}
                  </label>
                  <textarea
                    rows={2}
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    placeholder={t.commentPlaceholder}
                    className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-teal-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-teal-600 to-teal-700 px-5 py-3 text-xs font-bold text-white shadow-md transition hover:from-teal-700 hover:to-teal-800 disabled:opacity-60"
                >
                  <span>{submitting ? t.submittingBtn : t.submitBtn}</span>
                  <Send size={13} />
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}