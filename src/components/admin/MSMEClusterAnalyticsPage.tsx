import React, { useState, useEffect } from "react";
import {
  Building2,
  MapPin,
  Briefcase,
  Users,
  TrendingUp,
  Clock,
  Download,
  RefreshCw,
  Filter,
  CheckCircle2,
  ShieldCheck,
  ChevronRight,
  Database,
  Layers,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";
import { useApp } from "../../context/AppContext";

export const MSMEClusterAnalyticsPage: React.FC = () => {
  const { navigate } = useApp();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCluster, setSelectedCluster] = useState<string>("All");
  const [selectedSector, setSelectedSector] = useState<string>("All");
  const [isExporting, setIsExporting] = useState(false);

  const fetchClusterAnalytics = async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem("skillbridge_jwt_token");
    try {
      const queryParams = new URLSearchParams();
      if (selectedCluster !== "All") queryParams.append("cluster", selectedCluster);
      if (selectedSector !== "All") queryParams.append("sector", selectedSector);

      const res = await fetch(`/api/admin/msme-analytics?${queryParams.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (json.success) {
        setData(json);
      } else {
        setError(json.error || "Failed to load MSME cluster analytics.");
      }
    } catch (err) {
      setError("Network error connecting to MSME analytics engine.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClusterAnalytics();
  }, [selectedCluster, selectedSector]);

  const handleExportCSV = async () => {
    setIsExporting(true);
    const token = localStorage.getItem("skillbridge_jwt_token");
    try {
      const res = await fetch("/api/admin/export/msme-clusters", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "SkillBridge_MSME_Industrial_Clusters.csv";
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
          Calculating industrial cluster metrics, hiring velocity, and talent availability...
        </p>
      </div>
    );
  }

  const { clusters = [], clusterList = [], sectorList = [] } = data || {};

  const chartData = clusters.map((c: any) => ({
    name: c.clusterName.split(" ")[0],
    fullName: c.clusterName,
    TimeToFill: c.avgTimeToFillDays,
    TalentAvailability: c.talentAvailabilityIndex,
    Vacancies: c.totalVacancies,
  }));

  const totalMSMEs = clusters.reduce((acc: number, c: any) => acc + c.totalMSMEs, 0);
  const totalVacancies = clusters.reduce((acc: number, c: any) => acc + c.totalVacancies, 0);
  const totalHired = clusters.reduce((acc: number, c: any) => acc + c.totalHired, 0);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-950 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-400/30 rounded-full flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-sky-400" />
                Industrial Cluster Telemetry
              </span>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded-full flex items-center gap-1">
                <Database className="w-3 h-3 text-emerald-400" />
                Hiring Velocity & Requisitions
              </span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white">
              MSME Industrial Cluster Analytics
            </h1>
            <p className="text-xs text-indigo-200 max-w-2xl leading-relaxed">
              Tracking talent availability, time-to-hire velocity, and skill requirements across specialized Indian manufacturing, engineering, and tech clusters.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleExportCSV}
              disabled={isExporting}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold border border-white/20 flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
            >
              <Download className="w-4 h-4 text-indigo-300" />
              <span>{isExporting ? "Exporting..." : "Export Clusters CSV"}</span>
            </button>
            <button
              onClick={fetchClusterAnalytics}
              title="Refresh cluster metrics"
              className="p-2 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/20 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4 text-indigo-300" />
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="text-xs font-semibold text-slate-500">Monitored Clusters</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{clusters.length}</div>
          <p className="text-[11px] text-slate-400 mt-1">Specialized industrial hubs</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="text-xs font-semibold text-sky-600">Total Registered MSMEs</div>
          <div className="text-2xl font-black text-sky-600 mt-1">{totalMSMEs}</div>
          <p className="text-[11px] text-slate-400 mt-1">Udyam-verified enterprises</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="text-xs font-semibold text-indigo-600">Open Requisitions</div>
          <div className="text-2xl font-black text-indigo-600 mt-1">{totalVacancies}</div>
          <p className="text-[11px] text-slate-400 mt-1">Active hiring openings</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="text-xs font-semibold text-emerald-600">Confirmed Hires</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">{totalHired}</div>
          <p className="text-[11px] text-slate-400 mt-1">Logged through WorkNexus AI</p>
        </div>
      </div>

      {/* Chart: Talent Availability vs Time-To-Fill */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Cluster Hiring Friction & Talent Availability</h2>
            <p className="text-xs text-slate-500">Higher time-to-fill indicates local candidate shortages in core technical skills</p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-indigo-600" />
              <span className="text-slate-600">Talent Availability (%)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-amber-500" />
              <span className="text-slate-600">Avg Time to Fill (Days)</span>
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
              <Bar dataKey="TalentAvailability" name="Talent Availability (%)" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              <Bar dataKey="TimeToFill" name="Avg Time to Fill (Days)" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter Cluster:</span>
          </div>

          <select
            value={selectedCluster}
            onChange={(e) => setSelectedCluster(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900 font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          >
            <option value="All">All Clusters</option>
            {clusterList.map((cl: string) => (
              <option key={cl} value={cl}>
                {cl}
              </option>
            ))}
          </select>

          <select
            value={selectedSector}
            onChange={(e) => setSelectedSector(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900 font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          >
            <option value="All">All Sectors</option>
            {sectorList.map((sc: string) => (
              <option key={sc} value={sc}>
                {sc}
              </option>
            ))}
          </select>
        </div>

        <div className="text-xs text-slate-500">
          Showing <span className="font-bold text-slate-900">{clusters.length}</span> industrial clusters
        </div>
      </div>

      {/* Cluster Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {clusters.map((c: any) => (
          <div
            key={c.clusterName}
            className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4 hover:border-indigo-300 transition-all"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">{c.clusterName}</h3>
                <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                  <span>{c.state}</span>
                  <span>•</span>
                  <span>{c.sector}</span>
                </p>
              </div>

              <span
                className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold border ${
                  c.avgTimeToFillDays > 30
                    ? "bg-rose-50 text-rose-700 border-rose-200"
                    : c.avgTimeToFillDays > 25
                    ? "bg-amber-50 text-amber-700 border-amber-200"
                    : "bg-emerald-50 text-emerald-700 border-emerald-200"
                }`}
              >
                {c.avgTimeToFillDays}d to fill
              </span>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-xl text-center">
              <div>
                <div className="text-[10px] text-slate-400">MSMEs</div>
                <div className="text-sm font-bold text-slate-900">{c.totalMSMEs}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400">Vacancies</div>
                <div className="text-sm font-bold text-indigo-600">{c.totalVacancies}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400">Availability</div>
                <div className="text-sm font-bold text-emerald-600">{c.talentAvailabilityIndex}%</div>
              </div>
            </div>

            {/* Top In-Demand Skills */}
            <div className="space-y-1.5">
              <div className="text-xs font-semibold text-slate-700">Cluster Core Requirements:</div>
              <div className="flex flex-wrap gap-1.5">
                {c.topInDemandSkills.map((sk: string) => (
                  <span
                    key={sk}
                    className="text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded-md"
                  >
                    {sk}
                  </span>
                ))}
              </div>
            </div>

            {/* Hiring MSMEs */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">
                {c.hiringMSMEs.length} registered hiring units
              </span>
              <button
                onClick={() => navigate(`/admin/directory?state=${encodeURIComponent(c.state)}&sector=${encodeURIComponent(c.sector)}`)}
                className="font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
              >
                <span>View Directory</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
