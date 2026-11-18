import React from "react";
import {
  Building2,
  Briefcase,
  Users,
  CheckCircle2,
  Calendar,
  Sparkles,
  TrendingUp,
  ArrowRight,
  PlusCircle,
  Clock,
  ShieldCheck,
  ChevronRight,
  UserCheck,
  BarChart3,
} from "lucide-react";
import { useApp } from "../../context/AppContext";

export const EmployerDashboard: React.FC = () => {
  const {
    jobs,
    candidates,
    applications,
    shortlistedCandidateIds,
    toggleShortlistCandidate,
    setActiveTab,
    setSelectedJobId,
  } = useApp();

  // Top candidates matching the primary job
  const topCandidates = candidates.slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-sky-950 to-indigo-950 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 text-[10px] font-semibold bg-sky-500/20 text-sky-300 border border-sky-400/30 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-sky-400" />
                Udyam Verified MSME • TN-24-0019284
              </span>
              <span className="text-xs text-sky-200">
                Coimbatore / Salem Engineering Cluster
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1.5">
              Good morning, TechCraft Solutions MSME Team 🏭
            </h1>
            <p className="text-xs sm:text-sm text-sky-200/90 mt-1 max-w-2xl leading-relaxed">
              Your active postings have attracted <span className="font-bold text-white">183 verified applicants</span>.
              AI has pre-filtered 3 top candidates with 90%+ skill compatibility for your backend engineering vacancies.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => setActiveTab("post-job")}
              className="px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Post New Vacancy</span>
            </button>
            <button
              onClick={() => setActiveTab("talent-match")}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>AI Talent Match</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Jobs */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Active MSME Jobs</span>
            <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">24</span>
            <span className="text-xs text-slate-400 font-medium">Openings</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">across 6 Indian technical clusters</p>
        </div>

        {/* Total Applicants */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Verified Applicants</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">183</span>
            <span className="text-xs text-emerald-600 font-semibold">+18 this week</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">100% platform-verified skills</p>
        </div>

        {/* Shortlisted */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Shortlisted Talent</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {shortlistedCandidateIds.length + 29}
            </span>
            <span className="text-xs text-slate-400 font-medium">Candidates</span>
          </div>
          <p className="text-[11px] text-emerald-600 font-medium mt-1">
            Ready for interview scheduling
          </p>
        </div>

        {/* Technical Interviews */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Scheduled Interviews</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">12</span>
            <span className="text-xs text-slate-400 font-medium">This Week</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Average time-to-hire: 2.1 days</p>
        </div>
      </div>

      {/* Main Grid: AI Ranked Candidates + Quick Job Management */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: AI Recommended Candidates for Primary Job */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-slate-900">
                    AI-Ranked Candidates for Junior Java Backend Developer
                  </h3>
                  <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md border border-emerald-200/60">
                    Auto-Ranked
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Ranked by verified technical compatibility, skill assessment score, and regional fit
                </p>
              </div>

              <button
                onClick={() => setActiveTab("talent-match")}
                className="text-xs font-semibold text-sky-700 hover:text-sky-800 flex items-center gap-1"
              >
                <span>View All Candidates</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Candidates List */}
            <div className="space-y-3">
              {topCandidates.map((cand, idx) => {
                const matchScores = [94, 89, 85, 81];
                const score = matchScores[idx] || 78;
                const isShortlisted = shortlistedCandidateIds.includes(cand.id);

                return (
                  <div
                    key={cand.id}
                    className="p-4 rounded-xl bg-slate-50/70 hover:bg-slate-50 border border-slate-200/80 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-slate-900 to-indigo-900 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                        {cand.name.split(" ").map((n) => n[0]).join("")}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-sm">{cand.name}</span>
                          <span className="text-slate-400">•</span>
                          <span className="text-slate-500 font-medium">{cand.location}</span>
                          <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-md font-semibold">
                            {cand.verifiedSkillsCount} Verified Skills
                          </span>
                        </div>

                        <p className="text-slate-500 text-[11px] line-clamp-1">
                          {cand.education.degree} • {cand.education.institution}
                        </p>

                        <div className="flex flex-wrap gap-1.5 pt-0.5">
                          {cand.skills.slice(0, 3).map((s) => (
                            <span
                              key={s.id}
                              className="text-[10px] px-2 py-0.5 rounded-md bg-white border border-slate-200 font-medium text-slate-700"
                            >
                              {s.name} ({s.score}%)
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 pt-2 sm:pt-0">
                      <div className="text-right">
                        <div className="text-base font-extrabold text-emerald-600 flex items-center gap-1 justify-end">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>{score}% Match</span>
                        </div>
                        <span className="text-[10px] text-slate-400">Explainable Fit</span>
                      </div>

                      <button
                        onClick={() => toggleShortlistCandidate(cand.id)}
                        className={`px-3 py-1.5 rounded-xl font-semibold transition-colors text-xs ${
                          isShortlisted
                            ? "bg-emerald-600 text-white"
                            : "bg-white hover:bg-slate-100 text-slate-700 border border-slate-200"
                        }`}
                      >
                        {isShortlisted ? "Shortlisted ✓" : "Shortlist"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Comparing candidates? Use the side-by-side comparison matrix</span>
              <button
                onClick={() => setActiveTab("compare")}
                className="font-bold text-sky-700 hover:text-sky-900 flex items-center gap-1"
              >
                <span>Compare Candidates</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Hiring Funnel Overview */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900">Active Hiring Funnel Metrics</h3>
              <button
                onClick={() => setActiveTab("insights")}
                className="text-xs font-semibold text-sky-700 hover:text-sky-800"
              >
                Detailed Analytics →
              </button>
            </div>

            <div className="grid grid-cols-4 gap-2 pt-2 text-center text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Applicants</span>
                <span className="text-xl font-extrabold text-slate-900 mt-1 block">183</span>
                <span className="text-[10px] text-slate-500">100%</span>
              </div>
              <div className="p-3 rounded-xl bg-indigo-50/60 border border-indigo-100">
                <span className="text-indigo-600 block text-[10px] uppercase font-bold">Screened</span>
                <span className="text-xl font-extrabold text-indigo-900 mt-1 block">84</span>
                <span className="text-[10px] text-indigo-700">46% passed</span>
              </div>
              <div className="p-3 rounded-xl bg-sky-50/60 border border-sky-100">
                <span className="text-sky-600 block text-[10px] uppercase font-bold">Shortlisted</span>
                <span className="text-xl font-extrabold text-sky-900 mt-1 block">32</span>
                <span className="text-[10px] text-sky-700">17% rate</span>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-100">
                <span className="text-emerald-600 block text-[10px] uppercase font-bold">Interviewed</span>
                <span className="text-xl font-extrabold text-emerald-900 mt-1 block">12</span>
                <span className="text-[10px] text-emerald-700">6.5% offer target</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Active Jobs Quick Management */}
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900">Active Job Postings</h3>
              <button
                onClick={() => setActiveTab("my-jobs")}
                className="text-xs font-semibold text-sky-700 hover:text-sky-800"
              >
                View All ({jobs.length})
              </button>
            </div>

            <div className="space-y-2.5">
              {jobs.slice(0, 3).map((job) => (
                <div
                  key={job.id}
                  className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition-colors space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs font-bold text-slate-900">{job.title}</p>
                      <p className="text-[11px] text-slate-500">
                        {job.location} • {job.jobType}
                      </p>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                      Active
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200/60">
                    <span>{job.applicantsCount} Applicants</span>
                    <button
                      onClick={() => {
                        setSelectedJobId(job.id);
                        setActiveTab("talent-match");
                      }}
                      className="font-semibold text-sky-700 hover:text-sky-900"
                    >
                      View Matches →
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setActiveTab("post-job")}
              className="w-full py-2.5 bg-sky-700 hover:bg-sky-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create New Vacancy</span>
            </button>
          </div>

          {/* Regional Talent Market Benchmark Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50/70 to-sky-50/70 border border-indigo-100 shadow-2xs space-y-2 text-xs">
            <div className="flex items-center gap-2 font-bold text-indigo-950">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>MSME Talent Market Signal</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              In Tamil Nadu and Karnataka, junior backend developers with verified <strong>Java & SQL</strong> skills onboard <strong>40% faster</strong> into MSME production environments than unverified candidates.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setActiveTab("insights")}
                className="font-bold text-indigo-700 hover:text-indigo-900 flex items-center gap-1"
              >
                <span>Inspect Hiring Intelligence</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
