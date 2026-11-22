"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Printer, QrCode } from "lucide-react";
import { WARDS } from "@/lib/translations";

const LIVE_FALLBACK_ORIGIN = "https://fauzia-feedback-app.vercel.app";

function StandeeBrandHeader() {
  return (
    <div className="mx-auto flex max-w-sm items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-left">
      <svg
        viewBox="0 0 120 100"
        className="h-12 w-14 shrink-0"
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
        <div className="font-serif text-lg font-extrabold leading-none tracking-wide text-[#0f2942]">
          FAUZIA
        </div>
        <div className="mt-1 inline-block border-b-2 border-[#16a34a] pb-0.5 text-[8px] font-bold uppercase tracking-wider text-[#1e2952]">
          MATERNITY &amp; NURSING HOME
        </div>
        <div className="mt-1 text-[9px] font-medium leading-tight text-slate-600">
          Managed by{" "}
          <span className="font-semibold text-[#1e2952]">Elite4Ever</span>{" "}
          <span className="font-semibold text-[#0284c7]">HealthCare LLP</span>
        </div>
      </div>
    </div>
  );
}

export default function QrStandeePage() {
  const [ward, setWard] = useState<string>(WARDS[0]);
  const [room, setRoom] = useState<string>("Suite 301");
  const [origin, setOrigin] = useState<string>(LIVE_FALLBACK_ORIGIN);

  useEffect(() => {
    const currentOrigin = window.location.origin;
    if (
      currentOrigin &&
      !currentOrigin.includes("localhost") &&
      !currentOrigin.includes("127.0.0.1")
    ) {
      setOrigin(currentOrigin);
    } else {
      setOrigin(LIVE_FALLBACK_ORIGIN);
    }
  }, []);

  const targetUrl = `${origin}/?ward=${encodeURIComponent(
    ward
  )}&room=${encodeURIComponent(room)}`;

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=320x320&margin=12&data=${encodeURIComponent(
    targetUrl
  )}`;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 print:bg-white">
      <header className="border-b border-slate-200 bg-white print:hidden">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-2">
            <QrCode className="h-5 w-5 text-teal-700" />
            <h1 className="text-sm font-extrabold text-[#0b3954] sm:text-base">
              Bedside &amp; Reception QR Standee Generator
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 rounded-xl bg-teal-700 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-teal-800"
            >
              <Printer size={14} />
              Print Standee
            </button>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <ArrowLeft size={14} />
              Back
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl space-y-6 px-4 py-6 print:p-0">
        {/* Controls (Hidden when printing) */}
        <div className="grid grid-cols-1 gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs sm:grid-cols-2 print:hidden">
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              Ward / Department
            </label>
            <select
              value={ward}
              onChange={(e) => setWard(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-800 focus:border-teal-700 focus:outline-none"
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
              Room / Bed / Desk Label
            </label>
            <input
              type="text"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              placeholder="e.g. Suite 301 or Reception Desk"
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-800 focus:border-teal-700 focus:outline-none"
            />
          </div>
        </div>

        {/* Printable Standee Card */}
        <div className="mx-auto max-w-md rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm print:border-0 print:shadow-none">
          <StandeeBrandHeader />

          <h2 className="mt-5 text-lg font-extrabold text-[#0b3954]">
            FAUZIA MATERNITY &amp; NURSING HOME
          </h2>
          <p className="mt-0.5 text-xs font-medium text-slate-600">
            Managed by Elite4Ever HealthCare LLP
          </p>

          <div className="mt-4 inline-block rounded-full bg-teal-50 px-4 py-1 text-xs font-bold text-teal-900">
            {ward}
            {room ? ` • ${room}` : ""}
          </div>

          <div className="mx-auto mt-5 flex h-56 w-56 items-center justify-center rounded-2xl border-2 border-slate-100 bg-white p-3">
            <img
              src={qrImageUrl}
              alt="Scan QR Code for Patient Feedback"
              className="h-full w-full object-contain"
            />
          </div>

          <p className="mt-4 text-sm font-bold text-slate-900">
            Scan to Share Your Care Experience
          </p>
          <p className="mt-1 text-xs font-medium text-slate-600">
            English • हिंदी • मराठी • No App Download Required
          </p>
          <p className="mt-3 break-all text-[10px] text-slate-400 print:hidden">
            Encoded link: {targetUrl}
          </p>
        </div>
      </main>
    </div>
  );
}