import React from "react";
import {
  TrendingUp,
  BarChart3,
  Clock,
  MapPin,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Users,
  Award,
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
} from "recharts";

const SKILLS_DEMAND_DATA = [
  { skill: "Java", demand: 88, supply: 64 },
  { skill: "SQL", demand: 82, supply: 71 },
  { skill: "Spring Boot", demand: 78, supply: 42 },
  { skill: "React", demand: 75, supply: 68 },
  { skill: "AWS/Cloud", demand: 62, supply: 34 },
  { skill: "Docker", demand: 54, supply: 29 },
];

const FUNNEL_DATA = [
  { stage: "Applied", candidates: 183, fill: "#3b82f6" },
  { stage: "Screened", candidates: 84, fill: "#6366f1" },
  { stage: "Shortlisted", candidates: 32, fill: "#0ea5e9" },
  { stage: "Interview", candidates: 12, fill: "#f59e0b" },
  { stage: "Selected", candidates: 6, fill: "#10b981" },
];

const SPEED_BENCHMARK = [
  { metric: "Resume Screening", traditional: 7.0, skillbridge: 0.1 },
  { metric: "Skill Verification", traditional: 5.5, skillbridge: 0.5 },
  { metric: "Interview Prep", traditional: 3.5, skillbridge: 1.0 },
  { metric: "Offer Release", traditional: 2.5, skillbridge: 0.5 },
];

const REGIONAL_SUPPLY = [
  { name: "Coimbatore", value: 38, color: "#4f46e5" },
  { name: "Salem", value: 27, color: "#0ea5e9" },
  { name: "Tiruchirappalli", value: 18, color: "#10b981" },
  { name: "Madurai", value: 17, color: "#f59e0b" },
];

export const HiringInsightsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              MSME Hiring Intelligence & Analytics
            </h1>
            <span className="px-2 py-0.5 text-[10px] font-semibold bg-sky-50 text-sky-700 border border-sky-200 rounded-md">
              Live Indian Cluster Data
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time supply vs demand analytics, hiring velocity benchmarks, and verified talent density
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            Efficiency Gain: +8.8x Faster Hiring
          </span>
        </div>
      </div>

      {/* KPI Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Average Time-to-Shortlist</span>
            <Clock className="w-4 h-4 text-sky-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">2.1 Days</span>
            <span className="text-xs font-bold text-emerald-600">vs 18.5d industry avg</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Directly reduces MSME idle recruiter cost</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Technical Assessment Accuracy</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">92.4%</span>
            <span className="text-xs font-bold text-emerald-600">zero fake resume fraud</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Anti-cheat proctored platform scores</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Verified Talent Density</span>
            <Users className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">84%</span>
            <span className="text-xs font-bold text-slate-500">Tier-2/3 technical graduates</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">High retention in MSME engineering hubs</p>
        </div>
      </div>

      {/* Chart 1: Skill Supply vs Demand Gap */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              MSME Technical Skill Demand vs Regional Verified Supply (%)
            </h3>
            <p className="text-xs text-slate-500">
              Notice the 36% shortage in Spring Boot and 28% shortage in AWS Cloud competencies
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={SKILLS_DEMAND_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="skill" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="demand" name="MSME Demand %" fill="#0284c7" radius={[4, 4, 0, 0]} />
                <Bar dataKey="supply" name="Verified Supply %" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center gap-6 text-xs pt-1">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-sky-600" />
              <span className="text-slate-600">MSME Industry Demand</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-slate-300" />
              <span className="text-slate-600">Verified Regional Supply</span>
            </div>
          </div>
        </div>

        {/* Chart 2: Hiring Funnel Velocity */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              TechCraft Active Recruitment Funnel
            </h3>
            <p className="text-xs text-slate-500">
              Candidates filtered at each milestone with automated verification
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={FUNNEL_DATA}
                margin={{ top: 10, right: 20, left: 10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis dataKey="stage" type="category" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="candidates" name="Candidates" radius={[0, 4, 4, 0]}>
                  {FUNNEL_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-1 flex items-center justify-between text-xs text-slate-500">
            <span>Pre-screening reduces interview drop-off by 68%</span>
            <span className="font-bold text-emerald-600">Offer Acceptance: 100%</span>
          </div>
        </div>
      </div>

      {/* Row 3: Speed Benchmark & Regional Talent Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Speed Comparison */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Time-to-Hire: Traditional Job Portals vs WorkNexus AI (Days)
            </h3>
            <p className="text-xs text-slate-500">
              Comparing turn-around days across each step of the recruitment cycle
            </p>
          </div>

          <div className="space-y-3">
            {SPEED_BENCHMARK.map((b, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">{b.metric}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400">Traditional: {b.traditional}d</span>
                    <span className="font-extrabold text-emerald-600">
                      WorkNexus: {b.skillbridge}d
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden flex">
                    <div
                      className="bg-emerald-500 h-full rounded-l-full"
                      style={{ width: `${(b.skillbridge / (b.traditional + b.skillbridge)) * 100}%` }}
                    />
                    <div
                      className="bg-slate-300 h-full rounded-r-full"
                      style={{ width: `${(b.traditional / (b.traditional + b.skillbridge)) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Regional Distribution */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Talent Pool Geography</h3>
            <p className="text-xs text-slate-500">Verified graduate pool across Tamil Nadu</p>
          </div>

          <div className="h-44 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={REGIONAL_SUPPLY}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={35}
                  outerRadius={65}
                  paddingAngle={4}
                >
                  {REGIONAL_SUPPLY.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {REGIONAL_SUPPLY.map((r) => (
              <div key={r.name} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: r.color }} />
                <span className="text-slate-600">
                  {r.name} ({r.value}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
