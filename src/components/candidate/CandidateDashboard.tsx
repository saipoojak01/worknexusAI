import React from "react";
import {
  Award,
  Briefcase,
  Compass,
  FileCheck2,
  GitFork,
  ArrowRight,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  Clock,
  MapPin,
  ExternalLink,
  ChevronRight,
  Building2,
} from "lucide-react";
import { useApp } from "../../context/AppContext";

export const CandidateDashboard: React.FC = () => {
  const {
    currentCandidate,
    jobs,
    setActiveTab,
    setSelectedJobId,
    applyToJob,
    applications,
    currentRoadmap,
    toggleRoadmapWeek,
  } = useApp();

  const topMatchJob = jobs[0]; // Junior Java Backend Developer at TechCraft Solutions (92% match)
  const isAppliedToTopJob = applications.some((a) => a.jobId === topMatchJob.id);

  return (
    <div className="space-y-6">
      {/* Personalized Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-900 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded-full">
                Profile Verified
              </span>
              <span className="text-xs text-indigo-200">
                Salem, Tamil Nadu • Looking for Entry-Level Backend Roles
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1.5">
              Welcome back, {currentCandidate.name} 👋
            </h1>
            <p className="text-xs sm:text-sm text-indigo-200/90 mt-1 max-w-2xl leading-relaxed">
              Targeting <span className="font-semibold text-white">{currentCandidate.targetRole}</span>.
              Your verified skills in Java and SQL match 92% with active MSME positions in your region.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => setActiveTab("assessments")}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
            >
              <FileCheck2 className="w-3.5 h-3.5" />
              <span>Take AI Assessment</span>
            </button>
            <button
              onClick={() => setActiveTab("skill-gap")}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <GitFork className="w-3.5 h-3.5" />
              <span>Analyze Gaps</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Overall Skill Score */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Overall Skill Score</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {currentCandidate.overallSkillScore}
            </span>
            <span className="text-xs text-slate-400 font-medium">/ 100</span>
          </div>
          <p className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>Top 15% among Salem graduates</span>
          </p>
        </div>

        {/* Job Readiness */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Job Readiness</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {currentCandidate.jobReadiness}%
            </span>
            <span className="text-xs text-slate-400 font-medium">Target Role</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Reaches <span className="font-semibold text-indigo-600">95%</span> after Roadmap Week 3
          </p>
        </div>

        {/* Verified Skills */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Verified Skills</span>
            <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
              <FileCheck2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {currentCandidate.verifiedSkillsCount}
            </span>
            <span className="text-xs text-slate-400 font-medium">Competencies</span>
          </div>
          <p className="text-[11px] text-sky-600 font-medium mt-1">
            Tamper-evident assessment badges
          </p>
        </div>

        {/* Recommended Opportunities */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Recommended Jobs</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
              12
            </span>
            <span className="text-xs font-semibold text-indigo-600">92% Top Match</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            4 MSMEs actively interviewing today
          </p>
        </div>
      </div>

      {/* Main Grid: Skill Profile + Top Match Spotlight */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: My Skill Profile */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-sm text-slate-900">Verified Skill Competencies</h3>
                <p className="text-xs text-slate-500">
                  Evaluated via practical assessments and verified project code
                </p>
              </div>
              <button
                onClick={() => setActiveTab("my-skills")}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                <span>View Full Transcript</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Skill Bars */}
            <div className="space-y-3.5">
              {currentCandidate.skills.slice(0, 6).map((skill) => {
                const isHigh = skill.score >= 80;
                const isMedium = skill.score >= 60 && skill.score < 80;
                return (
                  <div key={skill.id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-800">{skill.name}</span>
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded-md font-medium ${
                            skill.verificationStatus === "Verified" || skill.verificationStatus === "Assessment Verified"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {skill.verificationStatus}
                        </span>
                      </div>
                      <span className="font-bold text-slate-900">{skill.score}%</span>
                    </div>

                    {/* Bar */}
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isHigh
                            ? "bg-emerald-500"
                            : isMedium
                            ? "bg-indigo-600"
                            : "bg-amber-500"
                        }`}
                        style={{ width: `${skill.score}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Benchmarked against 2,500+ Indian MSME requirements</span>
              <button
                onClick={() => setActiveTab("assessments")}
                className="font-semibold text-indigo-600 hover:text-indigo-800"
              >
                + Verify Another Skill
              </button>
            </div>
          </div>

          {/* Active Learning Roadmap Progress */}
          {currentRoadmap && (
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <Compass className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">
                      Active 4-Week Roadmap: {currentRoadmap.targetRole}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Readiness projection: {currentRoadmap.readinessScore}% (Target: 95%)
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab("roadmap")}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                >
                  View Full Roadmap
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                {currentRoadmap.weeks.slice(0, 2).map((w) => (
                  <div
                    key={w.week}
                    onClick={() => toggleRoadmapWeek(w.week)}
                    className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                      w.isCompleted
                        ? "bg-emerald-50/50 border-emerald-200"
                        : "bg-slate-50 border-slate-200 hover:border-indigo-300"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Week {w.week}
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          w.isCompleted ? "bg-emerald-100 text-emerald-800" : "bg-indigo-100 text-indigo-700"
                        }`}
                      >
                        {w.isCompleted ? "Completed" : "In Progress"}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-slate-900">{w.title}</p>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">{w.recommendedProject}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Col: Top AI Opportunity Match Spotlight */}
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-gradient-to-b from-indigo-50/70 to-white border border-indigo-200/80 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-md uppercase tracking-wider">
                <Sparkles className="w-3 h-3 text-indigo-600" />
                AI Top Recommendation
              </span>
              <span className="text-base font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200/60">
                92% Match
              </span>
            </div>

            <h4 className="text-base font-bold text-slate-900 mt-2">{topMatchJob.title}</h4>
            <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium mt-1">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              <span>{topMatchJob.companyName}</span>
              <span className="text-slate-300">•</span>
              <span className="text-[10px] text-sky-700 font-semibold bg-sky-50 px-1.5 py-0.2 rounded-md">
                Udyam MSME
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-500 mt-2">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-400" />
                {topMatchJob.location}
              </span>
              <span>•</span>
              <span className="font-semibold text-slate-700">{topMatchJob.salaryRange}</span>
            </div>

            <p className="text-xs text-slate-600 mt-3 leading-relaxed line-clamp-3">
              {topMatchJob.description}
            </p>

            {/* Why this match summary */}
            <div className="mt-3.5 p-3 rounded-xl bg-white border border-indigo-100 text-xs text-slate-700 space-y-1">
              <div className="font-bold text-indigo-950 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>Explainable AI Match Insight:</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-snug">
                Your verified Java (86%) and SQL (82%) fulfill 94% of core technical requirements. Location match is 100% (Tamil Nadu).
              </p>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <button
                onClick={() => {
                  setSelectedJobId(topMatchJob.id);
                  setActiveTab("job-matches");
                }}
                className="flex-1 py-2 text-xs font-semibold text-indigo-700 bg-white hover:bg-indigo-50 border border-indigo-200 rounded-xl transition-colors text-center"
              >
                Why this match?
              </button>

              <button
                disabled={isAppliedToTopJob}
                onClick={() => applyToJob(topMatchJob.id)}
                className={`flex-1 py-2 text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1 ${
                  isAppliedToTopJob
                    ? "bg-emerald-600 text-white cursor-default"
                    : "bg-indigo-600 hover:bg-indigo-700 text-white"
                }`}
              >
                {isAppliedToTopJob ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Applied</span>
                  </>
                ) : (
                  <>
                    <span>1-Click Apply</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick Action Cards */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Quick Shortcuts
            </h4>

            <button
              onClick={() => setActiveTab("assessments")}
              className="w-full p-2.5 rounded-xl hover:bg-slate-50 border border-slate-100 flex items-center justify-between text-left transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <FileCheck2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-800">Skill Assessments</div>
                  <div className="text-[10px] text-slate-400">Java, SQL, React, Python</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            <button
              onClick={() => setActiveTab("skill-gap")}
              className="w-full p-2.5 rounded-xl hover:bg-slate-50 border border-slate-100 flex items-center justify-between text-left transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
                  <GitFork className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-800">Skill Gap Analyzer</div>
                  <div className="text-[10px] text-slate-400">Target Role Readiness</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            <button
              onClick={() => setActiveTab("job-matches")}
              className="w-full p-2.5 rounded-xl hover:bg-slate-50 border border-slate-100 flex items-center justify-between text-left transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Briefcase className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-800">AI Job Matches</div>
                  <div className="text-[10px] text-slate-400">12 Matching MSME Vacancies</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
