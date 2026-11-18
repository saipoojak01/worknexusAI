import React, { useState, useEffect } from "react";
import {
  BarChart3,
  Layers,
  Filter,
  Download,
  RefreshCw,
  Search,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Database,
  ArrowRight,
  ShieldCheck,
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

export const SkillDemandMatrixPage: React.FC = () => {
  const { navigate } = useApp();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedUrgency, setSelectedUrgency] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isExporting, setIsExporting] = useState(false);

  const fetchSkillMatrix = async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem("skillbridge_jwt_token");
    try {
      const queryParams = new URLSearchParams();
      if (selectedCategory !== "All") queryParams.append("category", selectedCategory);

      const res = await fetch(`/api/admin/skill-demand-matrix?${queryParams.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (json.success) {
        setData(json);
      } else {
        setError(json.error || "Failed to load skill demand matrix.");
      }
    } catch (err) {
      setError("Network error connecting to skill demand engine.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkillMatrix();
  }, [selectedCategory]);

  const handleExportCSV = async () => {
    setIsExporting(true);
    const token = localStorage.getItem("skillbridge_jwt_token");
    try {
      const res = await fetch("/api/admin/export/skill-demand", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "SkillBridge_Skill_Demand_Matrix.csv";
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
          Calculating empirical skill demand vacancies vs certified talent supply...
        </p>
      </div>
    );
  }

  const { skills = [], categories = [] } = data || {};

  // Filter skills by search and urgency
  const filteredSkills = skills.filter((item: any) => {
    const matchesSearch =
      item.skill.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesUrgency = selectedUrgency === "All" || item.urgency === selectedUrgency;
    return matchesSearch && matchesUrgency;
  });

  const chartData = skills.slice(0, 8).map((s: any) => ({
    name: s.skill,
    Demand: s.demandCount,
    VerifiedSupply: s.verifiedSupplyCount,
    NetDeficit: s.netDeficit,
  }));

  const criticalCount = skills.filter((s: any) => s.urgency === "Critical Shortage").length;
  const highDemandCount = skills.filter((s: any) => s.urgency === "High Demand").length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-950 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30 rounded-full flex items-center gap-1">
                <BarChart3 className="w-3.5 h-3.5 text-amber-400" />
                National Competency Index
              </span>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded-full flex items-center gap-1">
                <Database className="w-3 h-3 text-emerald-400" />
                Live Demand vs Verified Supply
              </span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white">
              National Skill Demand vs Supply Matrix
            </h1>
            <p className="text-xs text-indigo-200 max-w-2xl leading-relaxed">
              Empirical calibration of industrial requisition requirements against validated candidate proficiency benchmarks.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleExportCSV}
              disabled={isExporting}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold border border-white/20 flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
            >
              <Download className="w-4 h-4 text-indigo-300" />
              <span>{isExporting ? "Exporting..." : "Export Matrix CSV"}</span>
            </button>
            <button
              onClick={fetchSkillMatrix}
              title="Refresh skill matrix"
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
          <div className="text-xs font-semibold text-slate-500">Tracked Skills</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{skills.length}</div>
          <p className="text-[11px] text-slate-400 mt-1">Across {categories.length} technical domains</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="text-xs font-semibold text-rose-600">Critical Shortages</div>
          <div className="text-2xl font-black text-rose-600 mt-1">{criticalCount}</div>
          <p className="text-[11px] text-slate-400 mt-1">Deficit ratio &gt; 50%</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="text-xs font-semibold text-amber-600">High Demand Skills</div>
          <div className="text-2xl font-black text-amber-600 mt-1">{highDemandCount}</div>
          <p className="text-[11px] text-slate-400 mt-1">Deficit ratio 25% - 50%</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="text-xs font-semibold text-indigo-600">Avg Benchmark Demanded</div>
          <div className="text-2xl font-black text-indigo-600 mt-1">75.8%</div>
          <p className="text-[11px] text-slate-400 mt-1">Required score in verified test</p>
        </div>
      </div>

      {/* Top Deficits Chart */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Highest Deficit Skill Competencies</h2>
            <p className="text-xs text-slate-500">Comparing active vacancy requisitions with certified candidate supply</p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-indigo-600" />
              <span className="text-slate-600">Demand (Vacancies)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-emerald-500" />
              <span className="text-slate-600">Verified Supply</span>
            </span>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#64748b" }} interval={0} />
              <YAxis tick={{ fontSize: 11, fill: "#64748b" }} />
              <Tooltip
                contentStyle={{ backgroundColor: "#0f172a", borderRadius: "10px", border: "none", color: "#fff", fontSize: "11px" }}
              />
              <Bar dataKey="Demand" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              <Bar dataKey="VerifiedSupply" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search skill by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900 font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          >
            <option value="All">All Categories</option>
            {categories.map((c: string) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={selectedUrgency}
            onChange={(e) => setSelectedUrgency(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900 font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          >
            <option value="All">All Urgency Statuses</option>
            <option value="Critical Shortage">Critical Shortage</option>
            <option value="High Demand">High Demand</option>
            <option value="Balanced">Balanced</option>
            <option value="Adequate Supply">Adequate Supply</option>
          </select>
        </div>

        <div className="text-xs text-slate-500">
          Showing <span className="font-bold text-slate-900">{filteredSkills.length}</span> skill benchmarks
        </div>
      </div>

      {/* Full Skill Matrix Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <th className="py-3 px-4">Skill & Domain</th>
                <th className="py-3 px-4 text-center">Demand Vacancies</th>
                <th className="py-3 px-4 text-center">Verified Supply</th>
                <th className="py-3 px-4 text-center">Net Deficit</th>
                <th className="py-3 px-4 text-center">Min Req Score</th>
                <th className="py-3 px-4 text-center">Urgency</th>
                <th className="py-3 px-4">Policy Recommendation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-800">
              {filteredSkills.map((s: any) => (
                <tr key={s.skill} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-semibold">
                    <div className="text-slate-900 font-bold">{s.skill}</div>
                    <span className="text-[10px] px-2 py-0.5 rounded-md font-semibold bg-slate-100 text-slate-600">
                      {s.category}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-center font-bold text-indigo-700">
                    {s.demandCount}
                  </td>

                  <td className="py-3.5 px-4 text-center font-bold text-emerald-600">
                    {s.verifiedSupplyCount}
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`font-bold ${
                        s.netDeficit > 10 ? "text-rose-600" : s.netDeficit > 5 ? "text-amber-600" : "text-slate-700"
                      }`}
                    >
                      {s.netDeficit > 0 ? `-${s.netDeficit}` : `+${Math.abs(s.netDeficit)}`}
                    </span>
                    <div className="text-[10px] text-slate-400 font-mono">{s.gapRatio}% gap</div>
                  </td>

                  <td className="py-3.5 px-4 text-center font-mono font-semibold text-slate-700">
                    {s.minScoreRequired}%
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`inline-block text-[10px] px-2.5 py-0.5 rounded-full font-bold border ${
                        s.urgency === "Critical Shortage"
                          ? "bg-rose-50 text-rose-700 border-rose-200"
                          : s.urgency === "High Demand"
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : s.urgency === "Balanced"
                          ? "bg-sky-50 text-sky-700 border-sky-200"
                          : "bg-emerald-50 text-emerald-700 border-emerald-200"
                      }`}
                    >
                      {s.urgency}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-slate-600 max-w-xs text-[11px] leading-relaxed">
                    {s.urgency === "Critical Shortage" ? (
                      <span className="text-rose-800 font-medium">
                        Fast-track 4-week state polytechnic micro-credential & MSME stipend.
                      </span>
                    ) : s.urgency === "High Demand" ? (
                      <span className="text-amber-800 font-medium">
                        Incentivize candidates to take assessment to verify existing knowledge.
                      </span>
                    ) : (
                      <span className="text-slate-500">
                        Maintain baseline curriculum standards; monitor cluster intake.
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
