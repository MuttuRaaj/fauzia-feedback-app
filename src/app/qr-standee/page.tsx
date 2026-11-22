"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Printer, QrCode } from "lucide-react";
import { WARDS } from "@/lib/translations";

export default function QrStandeePage() {
  const [selectedWard, setSelectedWard] = useState<string>(WARDS[0]);
  const [roomNumber, setRoomNumber] = useState<string>("Suite 301");

  const targetUrl = useMemo(() => {
    const base = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
    const params = new URLSearchParams({ ward: selectedWard });
    if (roomNumber.trim()) params.set("room", roomNumber.trim());
    return `${base}/?${params.toString()}`;
  }, [selectedWard, roomNumber]);

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=10&data=${encodeURIComponent(
    targetUrl
  )}`;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 print:bg-white">
      <div className="border-b border-slate-200 bg-white print:hidden">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-2">
            <QrCode size={18} className="text-teal-700" />
            <h1 className="text-sm font-bold text-[#0b3954]">Bedside QR Standee Generator</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 rounded-xl bg-teal-700 px-3.5 py-2 text-xs font-semibold text-white hover:bg-teal-800"
            >
              <Printer size={14} />
              Print Standee
            </button>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#0b3954] px-3.5 py-2 text-xs font-semibold text-white"
            >
              <ArrowLeft size={14} />
              Back to Form
            </Link>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-4xl space-y-6 px-4 py-6 print:p-0">
        <div className="grid grid-cols-1 gap-4 rounded-2xl border border-slate-200 bg-white p-5 print:hidden sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700">
              Ward / Department
            </label>
            <select
              value={selectedWard}
              onChange={(e) => setSelectedWard(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-800"
            >
              {WARDS.map((w) => (
                <option key={w} value={w}>
                  {w}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700">
              Room / Bed Label
            </label>
            <input
              type="text"
              value={roomNumber}
              onChange={(e) => setRoomNumber(e.target.value)}
              placeholder="e.g. Suite 301"
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800"
            />
          </div>
        </div>

        <div className="mx-auto max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm print:max-w-sm print:shadow-none">
          <div className="h-2 w-full bg-gradient-to-r from-[#0b3954] via-teal-600 to-emerald-500" />
          <div className="space-y-4 p-6 text-center">
            <img
              src="/logo.png"
              alt="Fauzia Maternity & Nursing Home"
              className="mx-auto h-16 w-auto object-contain"
            />
            <div>
              <h2 className="text-base font-extrabold text-[#0b3954]">
                FAUZIA MATERNITY & NURSING HOME
              </h2>
              <p className="text-xs font-semibold text-emerald-700">
                Managed by Elite4Ever HealthCare LLP
              </p>
            </div>

            <div className="inline-block rounded-full bg-teal-50 px-4 py-1 text-xs font-bold text-teal-900">
              {selectedWard}
              {roomNumber.trim() ? ` • ${roomNumber.trim()}` : ""}
            </div>

            <div className="mx-auto w-fit rounded-2xl border border-slate-200 bg-white p-3">
              <img src={qrImageUrl} alt="Bedside Feedback QR Code" className="h-48 w-48" />
            </div>

            <div className="space-y-1">
              <p className="text-sm font-bold text-slate-900">
                Scan to Share Your Care Experience
              </p>
              <p className="text-xs text-slate-600">
                English • हिंदी • मराठी • No App Download Required
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}