import React, { useState } from "react";
import {
  AlertTriangle,
  Sparkles,
  TrendingUp,
  Layers,
  ArrowRight,
  CheckCircle2,
  ShieldAlert,
  Send,
  BookOpen,
} from "lucide-react";

interface NationalGap {
  skill: string;
  sector: string;
  demandPercentage: number;
  supplyPercentage: number;
  severity: "Critical" | "Moderate" | "Balanced";
  impactDescription: string;
  recommendedScheme: string;
}

const NATIONAL_GAPS: NationalGap[] = [
  {
    skill: "Spring Boot Microservices",
    sector: "IT & MSME SaaS Systems",
    demandPercentage: 82,
    supplyPercentage: 36,
    severity: "Critical",
    impactDescription: "46% deficit causes 3.5-week delays in MSME cloud ERP migration projects",
    recommendedScheme: "PMKVY 4.0 Advanced Java & Cloud Micro-Credential",
  },
  {
    skill: "REST API & JWT Security",
    sector: "FinTech & Payments MSMEs",
    demandPercentage: 74,
    supplyPercentage: 41,
    severity: "Critical",
    impactDescription: "Prevents MSME vendors from complying with RBI and NPCI security audits",
    recommendedScheme: "NSDC Cyber & API Security Apprenticeship",
  },
  {
    skill: "AWS / Cloud Infrastructure",
    sector: "Cloud & DevOps Engineering",
    demandPercentage: 68,
    supplyPercentage: 38,
    severity: "Critical",
    impactDescription: "Bottlenecks automated continuous delivery in Tier-2 tech enterprises",
    recommendedScheme: "National Cloud Upskilling Grant Scheme",
  },
  {
    skill: "Industrial IoT & Sensor Interfacing",
    sector: "Precision Manufacturing",
    demandPercentage: 62,
    supplyPercentage: 44,
    severity: "Moderate",
    impactDescription: "Slows Industry 4.0 adoption across auto-ancillary machining units",
    recommendedScheme: "SAMARTH Scheme for Advanced Manufacturing",
  },
  {
    skill: "SQL Query Optimization & Indexing",
    sector: "Data Analytics & Logistics",
    demandPercentage: 78,
    supplyPercentage: 65,
    severity: "Moderate",
    impactDescription: "Affects large transactional reporting throughput for manufacturing supply chains",
    recommendedScheme: "Data Literacy for MSME Workforce Initiative",
  },
];

export const SkillGapsPage: React.FC = () => {
  const [selectedSector, setSelectedSector] = useState("All");
  const [deployedScheme, setDeployedScheme] = useState<string | null>(null);

  const filteredGaps = NATIONAL_GAPS.filter(
    (g) => selectedSector === "All" || g.sector.toLowerCase().includes(selectedSector.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              National Skill Deficit & Gap Observatory
            </h1>
            <span className="px-2 py-0.5 text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200 rounded-md">
              High Deficit Alert
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time algorithmic discrepancy detection between MSME industrial demand and academic supply
          </p>
        </div>

        <div className="flex items-center gap-2">
          {["All", "IT", "Manufacturing", "Cloud"].map((sec) => (
            <button
              key={sec}
              onClick={() => setSelectedSector(sec)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                selectedSector === sec
                  ? "bg-slate-900 text-white"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {sec}
            </button>
          ))}
        </div>
      </div>

      {/* Alert Notification if Deployed */}
      {deployedScheme && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2.5 text-xs text-emerald-900">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>
              <strong>Targeted Subsidy Dispatched:</strong> Allocated ₹1.2 Cr under{" "}
              <strong>{deployedScheme}</strong> to partner colleges and polytechnics in Salem & Coimbatore!
            </span>
          </div>
          <button
            onClick={() => setDeployedScheme(null)}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-900"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Gaps List */}
      <div className="space-y-4">
        {filteredGaps.map((gap, idx) => {
          const deficit = gap.demandPercentage - gap.supplyPercentage;
          return (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        gap.severity === "Critical"
                          ? "bg-rose-50 text-rose-700 border border-rose-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}
                    >
                      {gap.severity} Deficit ({deficit}% Gap)
                    </span>
                    <span className="text-xs text-slate-500 font-medium">{gap.sector}</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900">{gap.skill}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{gap.impactDescription}</p>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xl font-extrabold text-rose-600">-{deficit}%</div>
                  <span className="text-[10px] text-slate-400">Net National Deficit</span>
                </div>
              </div>

              {/* Progress Comparison */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">
                    MSME Vacancy Demand: <strong className="text-slate-800">{gap.demandPercentage}%</strong>
                  </span>
                  <span className="text-slate-500">
                    Verified Youth Supply: <strong className="text-indigo-600">{gap.supplyPercentage}%</strong>
                  </span>
                </div>
                <div className="relative w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
                  <div
                    className="bg-indigo-600 h-full rounded-l-full"
                    style={{ width: `${gap.supplyPercentage}%` }}
                    title="Verified Supply"
                  />
                  <div
                    className="bg-rose-200 h-full rounded-r-full"
                    style={{ width: `${deficit}%` }}
                    title="Deficit Gap"
                  />
                </div>
              </div>

              {/* Action Banner: Policy Scheme Deployment */}
              <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-slate-700">
                  <BookOpen className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>
                    Aligned Government Action: <strong>{gap.recommendedScheme}</strong>
                  </span>
                </div>

                <button
                  onClick={() => setDeployedScheme(gap.recommendedScheme)}
                  className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Deploy Subsidized Curriculum</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
