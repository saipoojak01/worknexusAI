import React, { useState } from "react";
import {
  Sparkles,
  Users,
  Briefcase,
  MapPin,
  CheckCircle2,
  Filter,
  Search,
  UserCheck,
  Scale,
  Award,
  ChevronRight,
  ShieldCheck,
  Send,
  X,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { CandidateProfile, JobPosting } from "../../types";
import { calculateMatchScore } from "../../utils/matching";

export const TalentMatchPage: React.FC = () => {
  const {
    jobs,
    candidates,
    selectedJobId,
    setSelectedJobId,
    shortlistedCandidateIds,
    toggleShortlistCandidate,
    candidateComparisonIds,
    toggleCandidateComparison,
    setActiveTab,
  } = useApp();

  const [activeJobId, setActiveJobId] = useState<string>(
    selectedJobId || jobs[0]?.id || "job-1"
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [minMatch, setMinMatch] = useState(60);
  const [invitedCandidateName, setInvitedCandidateName] = useState<string | null>(null);

  const currentJob = jobs.find((j) => j.id === activeJobId) || jobs[0];

  // Calculate scores for all candidates against this job
  const rankedCandidates = candidates.map((cand) => {
    const matchBreakdown = calculateMatchScore(cand, currentJob);
    return {
      candidate: cand,
      matchBreakdown,
    };
  });

  // Sort descending by score
  rankedCandidates.sort((a, b) => b.matchBreakdown.overallScore - a.matchBreakdown.overallScore);

  const filteredCandidates = rankedCandidates.filter((item) => {
    const nameMatch = item.candidate.name.toLowerCase().includes(searchTerm.toLowerCase());
    const skillMatch = item.candidate.skills.some((s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const scoreMatch = item.matchBreakdown.overallScore >= minMatch;
    return (nameMatch || skillMatch) && scoreMatch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              AI Talent Match & Ranking
            </h1>
            <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md">
              Explainable AI Ranking
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Pre-assessed, verified candidates ranked against job requirements with 6D algorithmic transparency
          </p>
        </div>

        {candidateComparisonIds.length > 0 && (
          <button
            onClick={() => setActiveTab("compare")}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-2"
          >
            <Scale className="w-4 h-4" />
            <span>Compare Selected ({candidateComparisonIds.length})</span>
          </button>
        )}
      </div>

      {/* Target Job Selector & Filters */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Select Vacancy to Rank Candidates:
            </label>
            <select
              value={activeJobId}
              onChange={(e) => {
                setActiveJobId(e.target.value);
                setSelectedJobId(e.target.value);
              }}
              className="w-full md:w-96 px-3 py-2 text-xs font-bold text-slate-900 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-sky-500/20"
            >
              {jobs.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.title} ({j.location} • {j.vacancies} vacancies)
                </option>
              ))}
            </select>
          </div>

          {/* Search */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search candidate name or skill..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-sky-500/20"
            />
          </div>
        </div>

        {/* Min Match threshold */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Minimum Match Threshold:</span>
            <span className="font-extrabold text-sky-700">{minMatch}%</span>
          </div>
          <input
            type="range"
            min="50"
            max="95"
            value={minMatch}
            onChange={(e) => setMinMatch(Number(e.target.value))}
            className="w-48"
          />
        </div>
      </div>

      {/* Candidates List */}
      <div className="space-y-4">
        {filteredCandidates.map(({ candidate, matchBreakdown }, idx) => {
          const isShortlisted = shortlistedCandidateIds.includes(candidate.id);
          const isComparing = candidateComparisonIds.includes(candidate.id);

          return (
            <div
              key={candidate.id}
              className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-sky-300 shadow-2xs transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-slate-900 via-indigo-950 to-indigo-900 text-white font-extrabold text-base flex items-center justify-center shrink-0 shadow-xs">
                    {candidate.name.split(" ").map((n) => n[0]).join("")}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900">{candidate.name}</h3>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        Rank #{idx + 1}
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded-md">
                        {candidate.experienceYears}y Exp
                      </span>
                    </div>

                    <p className="text-xs text-slate-600">
                      {candidate.education.degree} • {candidate.education.institution} ({candidate.education.year})
                    </p>

                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{candidate.location} (Prefers: {candidate.workModePreference})</span>
                    </div>
                  </div>
                </div>

                {/* Match Score Indicator */}
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <div className="text-2xl font-extrabold text-emerald-600 flex items-center gap-1 justify-end">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <span>{matchBreakdown.overallScore}%</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-semibold block">
                      AI Compatibility Score
                    </span>
                  </div>
                </div>
              </div>

              {/* Natural Language AI Insight */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 leading-relaxed">
                <span className="font-bold text-slate-900 block mb-0.5">
                  AI Fit Assessment:
                </span>
                {matchBreakdown.aiExplanation}
              </div>

              {/* Verified Competencies */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Demonstrated Competencies ({candidate.verifiedSkillsCount} Verified):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {candidate.skills.map((s) => (
                    <span
                      key={s.id}
                      className="text-xs px-2.5 py-1 rounded-lg bg-emerald-50/70 border border-emerald-200 text-emerald-900 font-medium flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                      <span>{s.name}</span>
                      <strong className="text-emerald-950">{s.score}%</strong>
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Bar */}
              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                {/* Compare Checkbox */}
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isComparing}
                    onChange={() => toggleCandidateComparison(candidate.id)}
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Select for Side-by-Side Comparison</span>
                </label>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setInvitedCandidateName(candidate.name)}
                    className="px-3.5 py-1.5 text-xs font-semibold text-sky-700 hover:text-sky-800 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-xl transition-colors flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Invite to Interview</span>
                  </button>

                  <button
                    onClick={() => toggleShortlistCandidate(candidate.id)}
                    className={`px-4 py-1.5 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 ${
                      isShortlisted
                        ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                        : "bg-slate-900 hover:bg-slate-800 text-white"
                    }`}
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>{isShortlisted ? "Shortlisted ✓" : "Shortlist Candidate"}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Invite Modal */}
      {invitedCandidateName && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                Interview Invitation Sent!
              </h3>
              <button
                onClick={() => setInvitedCandidateName(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              An official MSME technical interview invitation has been dispatched to{" "}
              <strong>{invitedCandidateName}</strong> via verified email and SMS notifications.
              Their transcript and code assessment logs have been attached to your recruiter portal.
            </p>
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setInvitedCandidateName(null)}
                className="px-4 py-2 bg-sky-700 text-white rounded-xl text-xs font-bold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
