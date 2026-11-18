import React from "react";
import {
  Scale,
  Sparkles,
  CheckCircle2,
  Users,
  Award,
  ArrowRight,
  UserCheck,
  Building2,
  X,
} from "lucide-react";
import { useApp } from "../../context/AppContext";

export const CandidateComparisonPage: React.FC = () => {
  const {
    candidates,
    candidateComparisonIds,
    toggleCandidateComparison,
    shortlistedCandidateIds,
    toggleShortlistCandidate,
    setActiveTab,
  } = useApp();

  // If no candidates selected for comparison, pick first 3 by default
  const selectedCandidates =
    candidateComparisonIds.length > 0
      ? candidates.filter((c) => candidateComparisonIds.includes(c.id))
      : candidates.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Candidate Comparison Matrix
            </h1>
            <span className="px-2 py-0.5 text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-md">
              Side-by-Side Evaluator
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Compare verified technical capabilities, assessment metrics, and role readiness across top applicants
          </p>
        </div>

        <button
          onClick={() => setActiveTab("talent-match")}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors"
        >
          Select More Candidates
        </button>
      </div>

      {/* AI Recommendation Verdict Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-900 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 mt-0.5">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 block">
              AI Comparative Hiring Verdict
            </span>
            <p className="text-xs sm:text-sm text-indigo-100 font-medium leading-relaxed mt-0.5">
              <strong>Sai Pooja</strong> offers the highest verified technical depth in Core Java (86%) & SQL (82%) with fastest onboarding readiness. <strong>Ramya Krishnan</strong> provides complementary React & full-stack versatility for web-facing services.
            </p>
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/70">
              <th className="p-4 font-bold text-slate-400 uppercase tracking-wider w-48">
                Evaluation Factor
              </th>
              {selectedCandidates.map((cand) => {
                const isShortlisted = shortlistedCandidateIds.includes(cand.id);
                return (
                  <th key={cand.id} className="p-4 font-bold text-slate-900 min-w-[220px]">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-base font-extrabold text-slate-900">{cand.name}</div>
                        <span className="text-[11px] font-medium text-slate-500 block">
                          {cand.targetRole}
                        </span>
                      </div>
                      {candidateComparisonIds.length > 0 && (
                        <button
                          onClick={() => toggleCandidateComparison(cand.id)}
                          className="p-1 text-slate-400 hover:text-slate-600 rounded"
                          title="Remove from comparison"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {/* Overall Match */}
            <tr>
              <td className="p-4 font-bold text-slate-700 bg-slate-50/50">Overall AI Match Score</td>
              {selectedCandidates.map((cand, idx) => {
                const scores = [94, 89, 85, 81];
                const score = scores[idx] || 78;
                return (
                  <td key={cand.id} className="p-4">
                    <span className="text-xl font-extrabold text-emerald-600 flex items-center gap-1">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      {score}%
                    </span>
                    <span className="text-[10px] text-slate-400">Ranked fit</span>
                  </td>
                );
              })}
            </tr>

            {/* Verified Java */}
            <tr>
              <td className="p-4 font-semibold text-slate-700 bg-slate-50/50">Core Java Assessment</td>
              {selectedCandidates.map((cand) => {
                const javaSkill = cand.skills.find((s) => s.name.toLowerCase().includes("java"));
                return (
                  <td key={cand.id} className="p-4">
                    {javaSkill ? (
                      <span className="font-extrabold text-slate-900">
                        {javaSkill.score}% ({javaSkill.verificationStatus})
                      </span>
                    ) : (
                      <span className="text-slate-400">Not verified</span>
                    )}
                  </td>
                );
              })}
            </tr>

            {/* SQL */}
            <tr>
              <td className="p-4 font-semibold text-slate-700 bg-slate-50/50">SQL & Database Logic</td>
              {selectedCandidates.map((cand) => {
                const sqlSkill = cand.skills.find((s) => s.name.toLowerCase().includes("sql"));
                return (
                  <td key={cand.id} className="p-4">
                    {sqlSkill ? (
                      <span className="font-extrabold text-slate-900">
                        {sqlSkill.score}% ({sqlSkill.verificationStatus})
                      </span>
                    ) : (
                      <span className="text-slate-400">Not verified</span>
                    )}
                  </td>
                );
              })}
            </tr>

            {/* Spring Boot */}
            <tr>
              <td className="p-4 font-semibold text-slate-700 bg-slate-50/50">Spring Boot Microservices</td>
              {selectedCandidates.map((cand) => {
                const springSkill = cand.skills.find((s) =>
                  s.name.toLowerCase().includes("spring")
                );
                return (
                  <td key={cand.id} className="p-4">
                    {springSkill ? (
                      <span className="font-extrabold text-slate-900">
                        {springSkill.score}% ({springSkill.verificationStatus})
                      </span>
                    ) : (
                      <span className="text-amber-600 font-medium">In 4-week roadmap</span>
                    )}
                  </td>
                );
              })}
            </tr>

            {/* Education & Academic Merit */}
            <tr>
              <td className="p-4 font-semibold text-slate-700 bg-slate-50/50">Academic Qualification</td>
              {selectedCandidates.map((cand) => (
                <td key={cand.id} className="p-4">
                  <div className="font-bold text-slate-900">{cand.education.degree}</div>
                  <div className="text-[11px] text-slate-500">
                    {cand.education.institution} ({cand.education.year})
                  </div>
                  <div className="text-[10px] text-emerald-600 font-semibold">
                    CGPA: {cand.education.score}
                  </div>
                </td>
              ))}
            </tr>

            {/* Location & Relocation */}
            <tr>
              <td className="p-4 font-semibold text-slate-700 bg-slate-50/50">Location & Work Mode</td>
              {selectedCandidates.map((cand) => (
                <td key={cand.id} className="p-4 text-slate-700">
                  <div className="font-bold text-slate-900">{cand.location}</div>
                  <div className="text-[11px] text-slate-500">Prefers {cand.workModePreference}</div>
                </td>
              ))}
            </tr>

            {/* Job Readiness Index */}
            <tr>
              <td className="p-4 font-semibold text-slate-700 bg-slate-50/50">Production Readiness</td>
              {selectedCandidates.map((cand) => (
                <td key={cand.id} className="p-4">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 font-extrabold text-xs border border-emerald-200">
                    {cand.jobReadiness}% Hire Ready
                  </span>
                </td>
              ))}
            </tr>

            {/* Shortlist / Action */}
            <tr>
              <td className="p-4 font-bold text-slate-700 bg-slate-50/50">Action</td>
              {selectedCandidates.map((cand) => {
                const isShortlisted = shortlistedCandidateIds.includes(cand.id);
                return (
                  <td key={cand.id} className="p-4">
                    <button
                      onClick={() => toggleShortlistCandidate(cand.id)}
                      className={`w-full py-2 rounded-xl text-xs font-bold transition-all ${
                        isShortlisted
                          ? "bg-emerald-600 text-white"
                          : "bg-sky-700 hover:bg-sky-800 text-white"
                      }`}
                    >
                      {isShortlisted ? "Shortlisted ✓" : "Shortlist Candidate"}
                    </button>
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
