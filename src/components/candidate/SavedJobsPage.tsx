import React from "react";
import {
  Bookmark,
  Building2,
  MapPin,
  ArrowRight,
  BookmarkX,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { useApp } from "../../context/AppContext";

export const SavedJobsPage: React.FC = () => {
  const { savedJobIds, toggleSaveJob, jobs, applyToJob, applications, setActiveTab, setSelectedJobId } = useApp();

  const savedJobs = jobs.filter((j) => savedJobIds.includes(j.id));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Saved MSME Opportunities
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Bookmarked positions for quick comparison and verified application submission
          </p>
        </div>

        <button
          onClick={() => setActiveTab("job-matches")}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
        >
          <span>Find More Opportunities</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {savedJobs.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <Bookmark className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-900">No saved opportunities</h3>
          <p className="text-xs text-slate-500 mt-1">
            Click the bookmark icon on any AI Job Match card to save it here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {savedJobs.map((job) => {
            const isApplied = applications.some((a) => a.jobId === job.id);
            return (
              <div
                key={job.id}
                className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-indigo-200 shadow-2xs transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200/60">
                        Udyam MSME
                      </span>
                      <h3 className="text-base font-bold text-slate-900 mt-1">{job.title}</h3>
                    </div>
                    <button
                      onClick={() => toggleSaveJob(job.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Remove from saved"
                    >
                      <BookmarkX className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-600 mt-1">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-semibold">{job.companyName}</span>
                    <span>•</span>
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{job.location}</span>
                  </div>

                  <div className="mt-3 text-xs font-bold text-slate-900">
                    Salary: {job.salaryRange}
                  </div>

                  <p className="text-xs text-slate-600 mt-2 line-clamp-2">
                    {job.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => {
                      setSelectedJobId(job.id);
                      setActiveTab("job-matches");
                    }}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                  >
                    View Match Analysis →
                  </button>

                  <button
                    disabled={isApplied}
                    onClick={() => applyToJob(job.id)}
                    className={`px-4 py-2 text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 ${
                      isApplied
                        ? "bg-emerald-600 text-white cursor-default"
                        : "bg-indigo-600 hover:bg-indigo-700 text-white"
                    }`}
                  >
                    {isApplied ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Applied ✓</span>
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
            );
          })}
        </div>
      )}
    </div>
  );
};
