import React, { useState } from "react";
import {
  Compass,
  CheckCircle2,
  Clock,
  Briefcase,
  Sparkles,
  RotateCcw,
  ArrowRight,
  Target,
  Award,
  BookOpen,
  FolderGit2,
  Loader2,
} from "lucide-react";
import { useApp } from "../../context/AppContext";

export const LearningRoadmapPage: React.FC = () => {
  const {
    currentRoadmap,
    setRoadmap,
    toggleRoadmapWeek,
    generateDynamicRoadmap,
    candidateProfile,
    currentCandidate,
    setActiveTab,
  } = useApp();

  const [isRegenerating, setIsRegenerating] = useState(false);

  if (!currentRoadmap) {
    return (
      <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-2xs">
        <Compass className="w-12 h-12 text-indigo-400 mx-auto mb-3" />
        <h3 className="text-base font-bold text-slate-900">No Active Roadmap Found</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          Generate a personalized AI learning curriculum based on your verified skills and target MSME job roles.
        </p>
        <button
          onClick={async () => {
            setIsRegenerating(true);
            await generateDynamicRoadmap(
              candidateProfile?.headline || currentCandidate.targetRole || "Java Backend Developer",
              ["Spring Boot Microservices", "PostgreSQL Optimization", "Docker Deployment"]
            );
            setIsRegenerating(false);
          }}
          disabled={isRegenerating}
          className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 mx-auto transition-colors"
        >
          {isRegenerating ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Generating AI Curriculum...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5" />
              <span>Generate Dynamic Roadmap</span>
            </>
          )}
        </button>
      </div>
    );
  }

  const completedWeeksCount = currentRoadmap.weeks.filter((w) => w.isCompleted).length;
  const progressPercent = Math.round(
    (completedWeeksCount / currentRoadmap.weeks.length) * 100
  );

  const handleRegenerateRoadmap = async () => {
    setIsRegenerating(true);
    try {
      const learningSkillNames = candidateProfile?.learningSkills?.map((s) => s.name) || [
        "Spring Boot Microservices",
        "REST API JWT Security",
        "Docker Containerization",
      ];
      const targetRole = currentRoadmap.targetRole || candidateProfile?.headline || "Java Backend Developer";
      const newRoadmap = await generateDynamicRoadmap(targetRole, learningSkillNames);
      if (!newRoadmap) {
        throw new Error("Failed to generate dynamic roadmap");
      }
    } catch (err) {
      // Keep existing with reset
      const resetWeeks = currentRoadmap.weeks.map((w) => ({ ...w, isCompleted: false }));
      setRoadmap({
        ...currentRoadmap,
        weeks: resetWeeks,
        readinessScore: 72,
        lastUpdated: new Date().toISOString().split("T")[0],
      });
    } finally {
      setIsRegenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Personalized Learning Roadmap
            </h1>
            <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md">
              AI Tailored
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Structured 4-week curriculum designed to close critical MSME job competency gaps
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            disabled={isRegenerating}
            onClick={handleRegenerateRoadmap}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold shadow-2xs transition-colors flex items-center gap-1.5 disabled:opacity-50"
          >
            {isRegenerating ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600" />
                <span>Generating Curriculum...</span>
              </>
            ) : (
              <>
                <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                <span>Regenerate with AI</span>
              </>
            )}
          </button>

          <button
            onClick={() => setActiveTab("job-matches")}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
          >
            <span>Explore Matched Jobs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Target Role & Progress Overview Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-900 text-white shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-indigo-300" />
              <span className="text-xs font-semibold text-indigo-200 uppercase tracking-wider">
                Targeted Specialization
              </span>
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight">
              {currentRoadmap.targetRole}
            </h2>
            <p className="text-xs sm:text-sm text-indigo-200/90 max-w-xl leading-relaxed">
              Mapped specifically to bridge Sai Pooja's skill profile from {currentCandidate.jobReadiness}% to 95%+ readiness for top MSME engineering opportunities.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white/10 border border-white/20 text-center min-w-[200px] shrink-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-200">
              Projected Readiness
            </span>
            <div className="text-3xl font-extrabold text-emerald-400 mt-0.5">
              {currentRoadmap.readinessScore}%
            </div>
            <p className="text-[11px] text-indigo-200 mt-1">
              {completedWeeksCount} of {currentRoadmap.weeks.length} milestones completed
            </p>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="mt-6 pt-4 border-t border-white/15 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-indigo-200 font-medium">Curriculum Progress</span>
            <span className="font-bold text-white">{progressPercent}% Completed</span>
          </div>
          <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-400 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* 4 Weeks Cards */}
      <div className="space-y-4">
        {currentRoadmap.weeks.map((week) => {
          return (
            <div
              key={week.week}
              className={`p-6 rounded-2xl border transition-all ${
                week.isCompleted
                  ? "bg-emerald-50/40 border-emerald-200 shadow-2xs"
                  : "bg-white border-slate-200 hover:border-indigo-300 shadow-2xs"
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-lg ${
                        week.isCompleted
                          ? "bg-emerald-600 text-white"
                          : "bg-indigo-600 text-white"
                      }`}
                    >
                      Week {week.week}
                    </span>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Focus: {week.skill}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium">
                      {week.difficulty}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                    {week.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    <strong className="text-slate-800">Why it matters for MSMEs: </strong>
                    {week.whyItMatters}
                  </p>

                  {/* Learning Objectives Checklist */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Core Technical Competencies:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {week.learningObjectives.map((obj, oIdx) => (
                        <div key={oIdx} className="flex items-center gap-2 text-xs text-slate-700">
                          <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${week.isCompleted ? "text-emerald-600" : "text-slate-400"}`} />
                          <span>{obj}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recommended Practical Project */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-2.5 text-xs">
                    <FolderGit2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-800 block">Practical Portfolio Project:</span>
                      <p className="text-slate-600 mt-0.5">{week.recommendedProject}</p>
                    </div>
                  </div>
                </div>

                {/* Right Action Column */}
                <div className="flex flex-col items-end justify-between gap-4 shrink-0 pt-2 md:pt-0">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>~{week.estimatedHours} Hours</span>
                  </div>

                  <button
                    onClick={() => toggleRoadmapWeek(week.week)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      week.isCompleted
                        ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200"
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{week.week <= 2 && week.isCompleted ? "Completed ✓" : week.isCompleted ? "Completed ✓" : "Mark as Completed"}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Completion Milestone Card */}
      <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">
              National MSME Preferred Candidate Fast-Track
            </h4>
            <p className="text-xs text-slate-600 mt-0.5">
              Completing all 4 modules elevates your profile directly to top-tier MSME hiring partner priority queues.
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab("job-matches")}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors shrink-0"
        >
          View Matched Jobs
        </button>
      </div>
    </div>
  );
};
