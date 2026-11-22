"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AlertTriangle, CheckCircle2, Star, ArrowLeft, RefreshCw } from "lucide-react";
import type { FeedbackRecord } from "@/lib/store";
import { WARDS } from "@/lib/translations";

export default function HospitalAdminDashboard() {
  const [items, setItems] = useState<FeedbackRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"ALL" | "ALERT_OPEN">("ALL");
  const [wardFilter, setWardFilter] = useState<string>("ALL");

  const loadFeedback = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/feedback", { cache: "no-store" });
      const data = await res.json();
      setItems(data.items || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeedback();
  }, []);

  const markResolved = async (id: string) => {
    const res = await fetch(`/api/feedback/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "RESOLVED" }),
    });
    if (res.ok) {
      await loadFeedback();
    }
  };

  const totalCount = items.length;
  const avgNum = (pick: (r: FeedbackRecord) => number) =>
    totalCount > 0 ? items.reduce((sum, r) => sum + pick(r), 0) / totalCount : 0;

  const avgRating = avgNum((r) => r.overallRating).toFixed(1);
  const avgDoctor = avgNum((r) => r.doctorRating);
  const avgNursing = avgNum((r) => r.nursingRating);
  const avgHygiene = avgNum((r) => r.hygieneRating);
  const openAlerts = items.filter((r) => r.status === "ALERT_OPEN").length;

  const visibleItems = items.filter((r) => {
    if (filter === "ALERT_OPEN" && r.status !== "ALERT_OPEN") return false;
    if (wardFilter !== "ALL" && r.ward !== wardFilter) return false;
    return true;
  });

  const ScoreBar = ({ label, score, barColor }: { label: string; score: number; barColor: string }) => {
    const pct = Math.min(100, Math.max(0, (score / 5) * 100));
    return (
      <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
          <span>{label}</span>
          <span className="font-bold text-[#0b3954]">{score.toFixed(1)} / 5.0</span>
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200">
          <div className={`h-full rounded-full ${barColor}`} style={{ width: `${pct}%` }} />
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="h-1.5 w-full bg-gradient-to-r from-[#0b3954] via-teal-600 to-emerald-500" />

      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-14 items-center justify-center rounded-xl border border-slate-100 bg-white p-1">
              <img
                src="/logo.png"
                alt="Fauzia Logo"
                className="h-full w-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-sm font-extrabold text-[#0b3954] sm:text-base">
                Fauzia Maternity & Nursing Home — Care & Feedback Dashboard
              </h1>
              <p className="text-xs font-medium text-emerald-700">
                Managed by Elite4Ever HealthCare LLP
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={loadFeedback}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#0b3954] px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-[#092d42]"
            >
              <ArrowLeft size={14} />
              Patient Form
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-6 px-4 py-6">
        {/* Top KPI Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Patient Responses
            </p>
            <p className="mt-1.5 text-3xl font-extrabold text-[#0b3954]">{totalCount}</p>
          </div>
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Overall Care Score
            </p>
            <p className="mt-1.5 flex items-center gap-1.5 text-3xl font-extrabold text-emerald-700">
              {avgRating} <Star className="h-6 w-6 fill-amber-400 text-amber-400" />
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Open Care Alerts
            </p>
            <p className="mt-1.5 text-3xl font-extrabold text-rose-600">{openAlerts}</p>
          </div>
        </div>

        {/* Department Progress Bars */}
        <div className="grid grid-cols-1 gap-3 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs sm:grid-cols-3">
          <ScoreBar label="Doctors & Consultation" score={avgDoctor} barColor="bg-[#0b3954]" />
          <ScoreBar label="Nursing & Maternity Care" score={avgNursing} barColor="bg-teal-600" />
          <ScoreBar label="Room Cleanliness & Hygiene" score={avgHygiene} barColor="bg-emerald-600" />
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setFilter("ALL")}
              className={`rounded-xl px-4 py-2 text-xs font-semibold transition ${
                filter === "ALL"
                  ? "bg-[#0b3954] text-white shadow-2xs"
                  : "bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              All Feedback ({totalCount})
            </button>
            <button
              type="button"
              onClick={() => setFilter("ALERT_OPEN")}
              className={`rounded-xl px-4 py-2 text-xs font-semibold transition ${
                filter === "ALERT_OPEN"
                  ? "bg-rose-600 text-white shadow-2xs"
                  : "bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              Action Needed ({openAlerts})
            </button>
          </div>

          <select
            value={wardFilter}
            onChange={(e) => setWardFilter(e.target.value)}
            className="rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 focus:border-teal-700 focus:outline-none"
          >
            <option value="ALL">All Wards & Rooms</option>
            {WARDS.map((w) => (
              <option key={w} value={w}>
                {w}
              </option>
            ))}
          </select>
        </div>

        {/* Feedback Cards */}
        <div className="space-y-3">
          {visibleItems.map((item) => (
            <div
              key={item.id}
              className={`rounded-2xl border bg-white p-5 shadow-2xs transition ${
                item.status === "ALERT_OPEN" ? "border-rose-300" : "border-slate-200/90"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">
                      {item.patientName || "Anonymous Patient"}
                    </span>
                    <span className="rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-semibold text-teal-900">
                      {item.ward}
                      {item.roomNumber ? ` • ${item.roomNumber}` : ""}
                    </span>
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700 uppercase">
                      {item.language}
                    </span>
                    {item.status === "ALERT_OPEN" && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-bold text-rose-700">
                        <AlertTriangle size={12} /> Priority Care Alert
                      </span>
                    )}
                    {item.status === "RESOLVED" && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
                        <CheckCircle2 size={12} /> Resolved
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    {item.id} • {new Date(item.createdAt).toLocaleString()}
                    {item.phone ? ` • ${item.phone}` : ""}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1 rounded-xl bg-amber-50 px-3 py-1.5 text-sm font-bold text-amber-900">
                    {item.overallRating}.0 <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  </span>
                  {item.status === "ALERT_OPEN" && (
                    <button
                      type="button"
                      onClick={() => markResolved(item.id)}
                      className="rounded-xl bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-700"
                    >
                      Mark Resolved
                    </button>
                  )}
                </div>
              </div>

              {item.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {item.comments && (
                <p className="mt-3 rounded-xl border border-slate-100 bg-slate-50 p-3 text-sm text-slate-700">
                  &ldquo;{item.comments}&rdquo;
                </p>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}