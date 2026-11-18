import React from "react";
import {
  Briefcase,
  Users,
  MapPin,
  Clock,
  CheckCircle2,
  PlusCircle,
  Sparkles,
  ArrowRight,
  Eye,
} from "lucide-react";
import { useApp } from "../../context/AppContext";

export const MyJobsPage: React.FC = () => {
  const { jobs, setActiveTab, setSelectedJobId } = useApp();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              My Job Openings
            </h1>
            <span className="px-2 py-0.5 text-[10px] font-semibold bg-sky-50 text-sky-700 border border-sky-200 rounded-md">
              TechCraft Solutions
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage your active vacancies, inspect AI match pipelines, and review pre-screened talent
          </p>
        </div>

        <button
          onClick={() => setActiveTab("post-job")}
          className="px-4 py-2.5 bg-sky-700 hover:bg-sky-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-2 shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post New Vacancy</span>
        </button>
      </div>

      {/* Jobs Table / Cards */}
      <div className="space-y-4">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-sky-300 shadow-2xs transition-all space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                    Active Opening
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    Posted on {job.postedDate}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900">{job.title}</h3>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {job.location} ({job.workMode})
                  </span>
                  <span>•</span>
                  <span>{job.jobType}</span>
                  <span>•</span>
                  <span className="font-bold text-slate-800">{job.salaryRange}</span>
                  <span>•</span>
                  <span>{job.vacancies} Open Vacancies</span>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right">
                  <div className="text-lg font-extrabold text-indigo-900">
                    {job.applicantsCount} Applicants
                  </div>
                  <span className="text-[10px] text-emerald-600 font-semibold block">
                    100% Pre-Verified
                  </span>
                </div>
              </div>
            </div>

            {/* Skills Profile */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {job.requiredSkills.map((req, rIdx) => (
                <span
                  key={rIdx}
                  className="text-xs px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 font-medium text-slate-700"
                >
                  {req.skill} ({req.minScore}% {req.priority})
                </span>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-xs text-slate-500">
                AI Algorithm dynamically matches candidates from Salem, Coimbatore & Chennai
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setSelectedJobId(job.id);
                    setActiveTab("talent-match");
                  }}
                  className="px-4 py-2 bg-sky-700 hover:bg-sky-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>View AI Ranked Candidates ({job.applicantsCount})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
