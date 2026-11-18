import React, { useState, useEffect } from "react";
import {
  MapPin,
  Building2,
  Users,
  Briefcase,
  AlertTriangle,
  Download,
  Filter,
  RefreshCw,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  Database,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { useApp } from "../../context/AppContext";

export const RegionalAnalyticsPage: React.FC = () => {
  const { navigate } = useApp();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<string>("All");
  const [selectedSector, setSelectedSector] = useState<string>("All");
  const [isExporting, setIsExporting] = useState(false);

  const fetchRegionalGaps = async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem("skillbridge_jwt_token");
    try {
      const queryParams = new URLSearchParams();
      if (selectedState !== "All") queryParams.append("state", selectedState);
      if (selectedSector !== "All") queryParams.append("sector", selectedSector);

      const res = await fetch(`/api/admin/regional-gaps?${queryParams.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (json.success) {
        setData(json);
      } else {
        setError(json.error || "Failed to load regional gap analytics.");
      }
    } catch (err) {
      setError("Network error connecting to regional gap engine.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegionalGaps();
  }, [selectedState, selectedSector]);

  const handleExportCSV = async () => {
    setIsExporting(true);
    const token = localStorage.getItem("skillbridge_jwt_token");
    try {
      const res = await fetch("/api/admin/export/regional-gaps", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "SkillBridge_Regional_Skill_Gaps.csv";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error("Export failed", err);
    } finally {
      setIsExporting(false);
    }
  };

  if (loading && !data) {
    return (
      <div className="min-h-[450px] flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-semibold text-slate-600">
          Analyzing regional MSME requisitions and youth skill transcripts...
        </p>
      </div>
    );
  }

  const { regionalGaps = [], stateList = [], sectorList = [] } = data || {};

  const chartData = regionalGaps.map((item: any) => ({
    name: item.state.length > 12 ? item.state.substring(0, 10) + "..." : item.state,
    fullState: item.state,
    Candidates: item.registeredCandidates,
    Vacancies: item.openJobVacancies,
    MSMEs: item.activeMSMEs,
  }));

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-950 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 rounded-full flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                State-Level Workforce Observatory
              </span>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded-full flex items-center gap-1">
                <Database className="w-3 h-3 text-emerald-400" />
                Real-Time Deficit Ratios
              </span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white">
              Regional Skill Deficit & Industrial Alignment
            </h1>
            <p className="text-xs text-indigo-200 max-w-2xl leading-relaxed">
              Geographic breakdown of local MSME job demand against certified candidate supply across Indian states and union territories.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleExportCSV}
              disabled={isExporting}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold border border-white/20 flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
            >
              <Download className="w-4 h-4 text-indigo-300" />
              <span>{isExporting ? "Exporting..." : "Export Regional CSV"}</span>
            </button>
            <button
              onClick={fetchRegionalGaps}
              title="Refresh regional metrics"
              className="p-2 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/20 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4 text-indigo-300" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter Region:</span>
          </div>
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900 font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          >
            <option value="All">All States (National View)</option>
            {stateList.map((st: string) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>

          <select
            value={selectedSector}
            onChange={(e) => setSelectedSector(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900 font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          >
            <option value="All">All Industrial Sectors</option>
            {sectorList.map((sec: string) => (
              <option key={sec} value={sec}>
                {sec}
              </option>
            ))}
          </select>
        </div>

        <div className="text-xs text-slate-500">
          Showing <span className="font-bold text-slate-900">{regionalGaps.length}</span> monitored states
        </div>
      </div>

      {/* State Demand vs Supply Comparison Chart */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Regional Demand vs Talent Supply Comparison</h2>
            <p className="text-xs text-slate-500">Active MSME vacancies compared with registered qualified candidate pool</p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-indigo-600" />
              <span className="text-slate-600">Open Vacancies</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-sky-400" />
              <span className="text-slate-600">Candidate Pool</span>
            </span>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#64748b" }} />
              <YAxis tick={{ fontSize: 11, fill: "#64748b" }} />
              <Tooltip
                contentStyle={{ backgroundColor: "#0f172a", borderRadius: "10px", border: "none", color: "#fff", fontSize: "11px" }}
              />
              <Bar dataKey="Vacancies" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Candidates" fill="#38bdf8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed State-by-State Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {regionalGaps.map((reg: any) => (
          <div
            key={reg.state}
            className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4 hover:border-indigo-300 transition-all"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>{reg.state}</span>
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {reg.activeMSMEs} MSMEs active in portal
                </p>
              </div>

              <span
                className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold border ${
                  reg.priorityLevel === "Critical Deficit"
                    ? "bg-rose-50 text-rose-700 border-rose-200"
                    : reg.priorityLevel === "High Demand"
                    ? "bg-amber-50 text-amber-700 border-amber-200"
                    : "bg-emerald-50 text-emerald-700 border-emerald-200"
                }`}
              >
                {reg.priorityLevel}
              </span>
            </div>

            {/* Metrics grid */}
            <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-xl text-center">
              <div>
                <div className="text-xs text-slate-400">Candidates</div>
                <div className="text-sm font-bold text-slate-900">{reg.registeredCandidates}</div>
              </div>
              <div>
                <div className="text-xs text-slate-400">Vacancies</div>
                <div className="text-sm font-bold text-indigo-600">{reg.openJobVacancies}</div>
              </div>
              <div>
                <div className="text-xs text-slate-400">Avg Readiness</div>
                <div className="text-sm font-bold text-emerald-600">{reg.candidateReadinessAvg}%</div>
              </div>
            </div>

            {/* Critical Skill Gaps */}
            <div className="space-y-1.5">
              <div className="text-xs font-semibold text-slate-700">Top Skill Shortages:</div>
              <div className="flex flex-wrap gap-1.5">
                {reg.topCriticalGaps.map((skill: string) => (
                  <span
                    key={skill}
                    className="text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded-md"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Direct Action Link */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">
                {reg.criticalGapsCount} skill gap categories
              </span>
              <button
                onClick={() => navigate(`/admin/directory?state=${encodeURIComponent(reg.state)}`)}
                className="font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
              >
                <span>View State Directory</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
