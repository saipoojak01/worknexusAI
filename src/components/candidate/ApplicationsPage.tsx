import React from "react";
import {
  FileText,
  Building2,
  MapPin,
  Clock,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Calendar,
  Sparkles,
} from "lucide-react";
import { useApp } from "../../context/AppContext";

export const ApplicationsPage: React.FC = () => {
  const { applications, jobs, setActiveTab, setSelectedJobId } = useApp();

  const statuses = ["Applied", "Shortlisted", "Assessment", "Interview", "Selected"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              My Job Applications
            </h1>
            <span className="px-2 py-0.5 text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-md">
              Live MSME Pipeline
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Track real-time hiring progress across registered Indian MSMEs with verified skill transcripts
          </p>
        </div>

        <button
          onClick={() => setActiveTab("job-matches")}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
        >
          <span>Find More Opportunities</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {applications.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-900">No active applications yet</h3>
          <p className="text-xs text-slate-500 mt-1">
            Explore your AI job matches and apply with 1 click using your verified profile.
          </p>
          <button
            onClick={() => setActiveTab("job-matches")}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold"
          >
            Explore AI Job Matches
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => {
            const job = jobs.find((j) => j.id === app.jobId);
            if (!job) return null;

            const currentStatusIndex = statuses.indexOf(app.status);

            return (
              <div
                key={app.id}
                className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-5"
              >
                {/* Job Header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md font-semibold border border-sky-200/60">
                        Udyam MSME
                      </span>
                      <span className="text-xs text-slate-400 font-medium">
                        Applied on {app.appliedDate}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900">{job.title}</h3>

                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-semibold">{job.companyName}</span>
                      <span>•</span>
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{job.location}</span>
                      <span>•</span>
                      <span className="font-bold text-slate-800">{job.salaryRange}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 text-xs font-extrabold rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {app.matchScore}% Match Score
                    </span>
                    <span
                      className={`px-3 py-1 text-xs font-bold rounded-full ${
                        app.status === "Interview"
                          ? "bg-amber-100 text-amber-800 border border-amber-300"
                          : app.status === "Selected"
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      Status: {app.status}
                    </span>
                  </div>
                </div>

                {/* Interactive Status Stepper */}
                <div className="pt-2">
                  <div className="relative flex items-center justify-between">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-100 -z-0" />
                    <div
                      className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-indigo-600 -z-0 transition-all duration-500"
                      style={{
                        width: `${(Math.max(0, currentStatusIndex) / (statuses.length - 1)) * 100}%`,
                      }}
                    />

                    {statuses.map((s, idx) => {
                      const isPast = idx < currentStatusIndex;
                      const isCurrent = idx === currentStatusIndex;
                      return (
                        <div key={s} className="relative z-10 flex flex-col items-center">
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                              isCurrent
                                ? "bg-indigo-600 text-white ring-4 ring-indigo-100 shadow-xs"
                                : isPast
                                ? "bg-emerald-600 text-white"
                                : "bg-slate-200 text-slate-500"
                            }`}
                          >
                            {isPast ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                          </div>
                          <span
                            className={`text-[10px] mt-1.5 font-semibold whitespace-nowrap ${
                              isCurrent
                                ? "text-indigo-900 font-bold"
                                : isPast
                                ? "text-slate-700"
                                : "text-slate-400"
                            }`}
                          >
                            {s}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Timeline activity log */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Recruitment Activity Log
                  </span>
                  {app.timeline.map((event, eIdx) => (
                    <div key={eIdx} className="flex items-start justify-between gap-3 text-slate-700">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 shrink-0" />
                        <span className="font-semibold text-slate-900">{event.status}:</span>
                        <span>{event.notes}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 whitespace-nowrap">{event.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
