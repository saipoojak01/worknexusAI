import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  Users,
  Building2,
  Briefcase,
  TrendingUp,
  MapPin,
  Sparkles,
  Download,
  AlertTriangle,
  Award,
  ChevronRight,
  RefreshCw,
  Send,
  CheckCircle2,
  Database,
  BarChart3,
  ArrowUpRight,
  Layers,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";
import { useApp } from "../../context/AppContext";

export const AdminDashboard: React.FC = () => {
  const { navigate } = useApp();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  // AI Advisor State
  const [aiQuery, setAiQuery] = useState("");
  const [focusArea, setFocusArea] = useState("National Strategic Intervention");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiAdvisory, setAiAdvisory] = useState<string | null>(null);
  const [aiSource, setAiSource] = useState<string | null>(null);

  const fetchOverviewData = async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem("skillbridge_jwt_token");
    try {
      const res = await fetch("/api/admin/overview-stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (json.success && json.stats) {
        setData(json.stats);
      } else {
        setError(json.error || "Failed to load national workforce metrics.");
      }
    } catch (err: any) {
      setError("Network error connecting to national analytics engine.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverviewData();
  }, []);

  const handleExportSummary = async () => {
    setIsExporting(true);
    const token = localStorage.getItem("skillbridge_jwt_token");
    try {
      const res = await fetch("/api/admin/export/overview", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "SkillBridge_National_Workforce_Overview.csv";
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

  const handleAskAIAdvisor = async (customPrompt?: string) => {
    const promptToSend = customPrompt || aiQuery;
    if (!promptToSend.trim()) return;

    setAiLoading(true);
    setAiAdvisory(null);
    const token = localStorage.getItem("skillbridge_jwt_token");
    try {
      const res = await fetch("/api/admin/ai-advisor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          query: promptToSend,
          focusArea,
        }),
      });
      const json = await res.json();
      if (json.success && json.advisory) {
        setAiAdvisory(json.advisory);
        setAiSource(json.source);
      } else {
        setAiAdvisory("Unable to generate advisory at this moment. Please check server connectivity.");
      }
    } catch (err) {
      setAiAdvisory("Failed to connect to AI Advisor service.");
    } finally {
      setAiLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[450px] flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-semibold text-slate-600">
          Aggregating live national candidate and MSME database telemetry...
        </p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-8 rounded-2xl bg-rose-50 border border-rose-200 text-center max-w-lg mx-auto my-12">
        <AlertTriangle className="w-10 h-10 text-rose-600 mx-auto mb-3" />
        <h3 className="text-base font-bold text-rose-900">Analytics Error</h3>
        <p className="text-xs text-rose-700 mt-1 mb-4">{error}</p>
        <button
          onClick={fetchOverviewData}
          className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  const { summaryCards, topSkillGaps, topIndustrialClusters, sectorDistribution, placementTrend } = data;

  return (
    <div className="space-y-6">
      {/* Government Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                Ministry of MSME & NSDC Authorized Portal
              </span>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded-full flex items-center gap-1">
                <Database className="w-3 h-3 text-emerald-400" />
                Live PostgreSQL/DB Aggregation
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              National Workforce Intelligence & Skill Observatory 🇮🇳
            </h1>
            <p className="text-xs sm:text-sm text-indigo-200/90 max-w-2xl leading-relaxed">
              Real-time executive oversight across regional youth skill transcripts, industrial cluster deficits, and verified MSME hiring telemetry.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleExportSummary}
              disabled={isExporting}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold border border-white/20 flex items-center gap-1.5 transition-all cursor-pointer shadow-xs disabled:opacity-50"
            >
              <Download className="w-4 h-4 text-indigo-300" />
              <span>{isExporting ? "Exporting..." : "Export CSV Brief"}</span>
            </button>
            <button
              onClick={fetchOverviewData}
              title="Refresh database telemetry"
              className="p-2 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/20 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4 text-indigo-300" />
            </button>
          </div>
        </div>
      </div>

      {/* Primary Key Performance Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Registered Candidates</span>
            <Users className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            {summaryCards.totalCandidates}
          </div>
          <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <span className="text-emerald-600 font-bold">{summaryCards.totalVerifiedSkills}</span>
            <span>platform-verified skill assessments</span>
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Registered MSMEs</span>
            <Building2 className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            {summaryCards.totalMSMEs}
          </div>
          <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <span className="text-sky-600 font-bold">{summaryCards.activeHiringMSMEs}</span>
            <span>actively issuing hiring requisitions</span>
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Active Open Vacancies</span>
            <Briefcase className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            {summaryCards.totalVacancies}
          </div>
          <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <span className="text-emerald-600 font-bold">{summaryCards.totalSelectedPlacements}</span>
            <span>confirmed placements logged</span>
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Job Readiness Index</span>
            <Award className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            {summaryCards.averageJobReadiness}%
          </div>
          <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <span>Avg Match:</span>
            <span className="text-indigo-600 font-bold">{summaryCards.averageMatchScore}%</span>
          </p>
        </div>
      </div>

      {/* Charts Section: Placement Trajectory & Sector Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Placement Trajectory */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">National Placement & Verified Talent Trajectory</h2>
              <p className="text-xs text-slate-500">Monthly progression of candidate verification and MSME job matches</p>
            </div>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              +48% YoY Growth
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={placementTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748b" }} />
                <YAxis tick={{ fontSize: 11, fill: "#64748b" }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0f172a", borderRadius: "10px", border: "none", color: "#fff", fontSize: "11px" }}
                />
                <Bar dataKey="placements" name="Confirmed Placements" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                <Bar dataKey="target" name="National Milestone Target" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sector Distribution */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900">MSME Sector Composition</h2>
            <p className="text-xs text-slate-500">Distribution of registered industrial clusters</p>
          </div>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sectorDistribution}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={65}
                  innerRadius={35}
                >
                  {sectorDistribution.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: "#0f172a", borderRadius: "10px", border: "none", color: "#fff", fontSize: "11px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1.5 text-xs">
            {sectorDistribution.map((sec: any) => (
              <div key={sec.name} className="flex items-center justify-between text-slate-600">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: sec.color }} />
                  <span className="truncate max-w-[170px]">{sec.name}</span>
                </span>
                <span className="font-semibold text-slate-900">{sec.count} MSMEs</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Critical Skill Deficits & High Priority Industrial Clusters */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Critical Skill Gaps */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Top National Skill Deficits</h2>
              <p className="text-xs text-slate-500">Empirical vacancy demand vs platform-verified talent supply</p>
            </div>
            <button
              onClick={() => navigate("/admin/skill-demand")}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
            >
              <span>Full Matrix</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {topSkillGaps.map((item: any) => (
              <div key={item.skill} className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{item.skill}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-md font-semibold bg-indigo-100 text-indigo-700">
                      {item.category}
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                    Deficit: {item.deficit} openings
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>Demand: {item.demand} vacancies</span>
                  <span>Verified Supply: {item.supply} candidates</span>
                  <span>Gap: {item.ratio}%</span>
                </div>
                {/* Progress bar */}
                <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${item.ratio > 50 ? "bg-rose-500" : "bg-amber-500"}`}
                    style={{ width: `${Math.min(item.ratio, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Priority MSME Industrial Clusters */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Priority MSME Industrial Clusters</h2>
              <p className="text-xs text-slate-500">Regional employment hubs ranked by talent requisitions</p>
            </div>
            <button
              onClick={() => navigate("/admin/msme-analytics")}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
            >
              <span>Cluster Deep Dive</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {topIndustrialClusters.map((cluster: any) => (
              <div key={cluster.name} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{cluster.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-md font-semibold bg-slate-200 text-slate-700">
                      {cluster.state}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {cluster.msmes} MSMEs • {cluster.vacancies} open requisitions
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-indigo-700">
                    {cluster.availabilityIndex}%
                  </div>
                  <div className="text-[10px] text-slate-400">Talent Availability</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* National Workforce AI Policy & Strategic Advisor */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 text-white shadow-xl space-y-5 border border-indigo-800/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400/30 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                National Workforce AI Policy & Strategic Advisor
              </h2>
              <p className="text-xs text-indigo-200">
                Grounded directly in live platform telemetry (Never invents numerical figures)
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={focusArea}
              onChange={(e) => setFocusArea(e.target.value)}
              className="bg-indigo-950/80 border border-indigo-700/60 rounded-xl text-xs text-indigo-100 py-1.5 px-3 focus:outline-hidden"
            >
              <option value="National Strategic Intervention">National Strategic Intervention</option>
              <option value="Polytechnic & ITI Curriculum Reform">Polytechnic & ITI Curriculum Reform</option>
              <option value="MSME Apprenticeship Subsidies">MSME Apprenticeship Subsidies</option>
              <option value="Tier-2 Cluster Placement Acceleration">Tier-2 Cluster Placement Acceleration</option>
            </select>
          </div>
        </div>

        {/* Quick query chips */}
        <div className="flex flex-wrap gap-2">
          {[
            "Where should Ministry apprenticeship subsidies be allocated first?",
            "What polytechnic courses should be updated based on Coimbatore & Pune deficits?",
            "How can we accelerate verified hiring for Java & Spring Boot openings?",
          ].map((prompt, i) => (
            <button
              key={i}
              onClick={() => {
                setAiQuery(prompt);
                handleAskAIAdvisor(prompt);
              }}
              className="text-[11px] bg-white/10 hover:bg-white/15 text-indigo-200 border border-white/10 px-3 py-1.5 rounded-lg transition-all text-left cursor-pointer"
            >
              "{prompt}"
            </button>
          ))}
        </div>

        {/* Input box */}
        <div className="flex gap-2">
          <input
            type="text"
            value={aiQuery}
            onChange={(e) => setAiQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAskAIAdvisor()}
            placeholder="Ask AI Advisor a policy, curriculum, or regional talent intervention question..."
            className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-indigo-300/60 focus:bg-white/15 focus:outline-hidden focus:ring-1 focus:ring-amber-400 transition-all"
          />
          <button
            onClick={() => handleAskAIAdvisor()}
            disabled={aiLoading || !aiQuery.trim()}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20 transition-all cursor-pointer disabled:opacity-50"
          >
            {aiLoading ? (
              <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
            ) : (
              <>
                <span>Consult Advisor</span>
                <Send className="w-3.5 h-3.5 text-slate-950" />
              </>
            )}
          </button>
        </div>

        {/* Advisory Output */}
        {aiAdvisory && (
          <div className="p-4 rounded-xl bg-slate-900/90 border border-amber-500/30 text-xs text-indigo-100 space-y-2 animate-in fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-indigo-800/40">
              <span className="font-bold text-amber-300 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                Executive Policy Brief ({focusArea})
              </span>
              <span className="text-[10px] text-indigo-300 font-mono">
                Source: {aiSource === "gemini-grounded" ? "Gemini AI (Factual Grounding)" : "Data-Grounded Strategic Engine"}
              </span>
            </div>
            <div className="prose prose-invert prose-xs max-w-none whitespace-pre-wrap leading-relaxed">
              {aiAdvisory}
            </div>
          </div>
        )}
      </div>

      {/* Fast Navigation Shortcut Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <button
          onClick={() => navigate("/admin/regional-gaps")}
          className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-indigo-400 hover:shadow-md transition-all text-left group cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <MapPin className="w-5 h-5 text-indigo-600" />
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
          </div>
          <h3 className="text-xs font-bold text-slate-900">Regional Skill Gaps</h3>
          <p className="text-[11px] text-slate-500 mt-1">State-by-state heatmaps & deficit priorities</p>
        </button>

        <button
          onClick={() => navigate("/admin/skill-demand")}
          className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-indigo-400 hover:shadow-md transition-all text-left group cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <BarChart3 className="w-5 h-5 text-sky-600" />
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-sky-600 transition-colors" />
          </div>
          <h3 className="text-xs font-bold text-slate-900">Skill Demand Matrix</h3>
          <p className="text-[11px] text-slate-500 mt-1">Demand vacancies vs verified talent supply</p>
        </button>

        <button
          onClick={() => navigate("/admin/msme-analytics")}
          className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-indigo-400 hover:shadow-md transition-all text-left group cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <Building2 className="w-5 h-5 text-emerald-600" />
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors" />
          </div>
          <h3 className="text-xs font-bold text-slate-900">MSME Cluster Analytics</h3>
          <p className="text-[11px] text-slate-500 mt-1">Industrial cluster hiring velocity & requisitions</p>
        </button>

        <button
          onClick={() => navigate("/admin/directory")}
          className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-indigo-400 hover:shadow-md transition-all text-left group cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <Users className="w-5 h-5 text-amber-600" />
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 transition-colors" />
          </div>
          <h3 className="text-xs font-bold text-slate-900">Unified Directory</h3>
          <p className="text-[11px] text-slate-500 mt-1">Search & filter all candidates & MSMEs</p>
        </button>
      </div>
    </div>
  );
};
