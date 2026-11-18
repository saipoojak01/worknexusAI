import React, { useState } from "react";
import {
  Briefcase,
  Sparkles,
  MapPin,
  Building2,
  CheckCircle2,
  Bookmark,
  BookmarkCheck,
  Filter,
  Search,
  ArrowRight,
  TrendingUp,
  X,
  Award,
  AlertCircle,
  HelpCircle,
  Clock,
  Layers,
  ChevronRight,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { calculateMatchScore } from "../../utils/matching";
import { JobPosting, MatchScoreBreakdown } from "../../types";

export const JobMatchesPage: React.FC = () => {
  const {
    jobs,
    currentCandidate,
    applyToJob,
    applications,
    savedJobIds,
    toggleSaveJob,
    selectedJobId,
    setSelectedJobId,
    setActiveTab,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedWorkMode, setSelectedWorkMode] = useState<string>("All");
  const [selectedLocation, setSelectedLocation] = useState<string>("All");
  const [minMatch, setMinMatch] = useState<number>(60);
  const [activeExplainerJob, setActiveExplainerJob] = useState<JobPosting | null>(() => {
    if (selectedJobId) {
      return jobs.find((j) => j.id === selectedJobId) || null;
    }
    return null;
  });

  // Calculate matching scores for each job
  const scoredJobs = jobs.map((job) => {
    const matchBreakdown = calculateMatchScore(currentCandidate, job);
    return {
      ...job,
      matchBreakdown,
    };
  });

  // Sort descending by overall match score
  scoredJobs.sort((a, b) => b.matchBreakdown.overallScore - a.matchBreakdown.overallScore);

  // Filter
  const filteredJobs = scoredJobs.filter((j) => {
    const matchesSearch =
      j.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.requiredSkills.some((r) => r.skill.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesMode = selectedWorkMode === "All" || j.workMode === selectedWorkMode;
    const matchesLoc =
      selectedLocation === "All" ||
      j.location.toLowerCase().includes(selectedLocation.toLowerCase());
    const matchesScore = j.matchBreakdown.overallScore >= minMatch;

    return matchesSearch && matchesMode && matchesLoc && matchesScore;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              AI Job Matches
            </h1>
            <span className="px-2 py-0.5 text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-md">
              6D Explainable AI
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Intelligent opportunity recommendations ranked strictly by verified capabilities, potential, and growth fit
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Showing {filteredJobs.length} MSME Opportunities</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search title, MSME, or skill (e.g. Java)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          {/* Work Mode */}
          <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto">
            <span className="text-xs text-slate-400 mr-1 hidden sm:inline">Mode:</span>
            {["All", "On-site", "Hybrid", "Remote"].map((mode) => (
              <button
                key={mode}
                onClick={() => setSelectedWorkMode(mode)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors whitespace-nowrap ${
                  selectedWorkMode === mode
                    ? "bg-slate-900 text-white font-semibold"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          {/* Location */}
          <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto">
            <span className="text-xs text-slate-400 mr-1 hidden sm:inline">Region:</span>
            {["All", "Tamil Nadu", "Salem", "Coimbatore", "Bengaluru"].map((loc) => (
              <button
                key={loc}
                onClick={() => setSelectedLocation(loc)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors whitespace-nowrap ${
                  selectedLocation === loc
                    ? "bg-indigo-600 text-white font-semibold"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {loc}
              </button>
            ))}
          </div>
        </div>

        {/* Min Match Slider */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Minimum Compatibility Threshold:</span>
            <span className="font-extrabold text-indigo-600">{minMatch}%</span>
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

      {/* Jobs List */}
      <div className="space-y-4">
        {filteredJobs.map((job) => {
          const breakdown = job.matchBreakdown;
          const isApplied = applications.some((a) => a.jobId === job.id);
          const isSaved = savedJobIds.includes(job.id);
          const isHighMatch = breakdown.overallScore >= 85;

          return (
            <div
              key={job.id}
              className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 shadow-2xs hover:shadow-xs transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-500">{job.category}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-[10px] text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md font-semibold border border-sky-200/60">
                      Udyam MSME
                    </span>
                    <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md font-medium">
                      {job.jobType}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 hover:text-indigo-600 transition-colors">
                    {job.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 pt-0.5">
                    <span className="font-semibold text-slate-800 flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      {job.companyName}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {job.location} ({job.workMode})
                    </span>
                    <span>•</span>
                    <span className="font-bold text-slate-900">{job.salaryRange}</span>
                  </div>
                </div>

                {/* Match Score Badge */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => toggleSaveJob(job.id)}
                    className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-xl transition-colors"
                    title="Save Opportunity"
                  >
                    {isSaved ? (
                      <BookmarkCheck className="w-5 h-5 text-indigo-600" />
                    ) : (
                      <Bookmark className="w-5 h-5" />
                    )}
                  </button>

                  <div className="text-right">
                    <div
                      className={`text-xl font-extrabold px-3 py-1 rounded-xl border flex items-center gap-1 ${
                        isHighMatch
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-indigo-50 text-indigo-700 border-indigo-200"
                      }`}
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>{breakdown.overallScore}% Match</span>
                    </div>
                    <span className="text-[10px] text-slate-400 mt-0.5 block">
                      Explainable AI Score
                    </span>
                  </div>
                </div>
              </div>

              {/* Description preview */}
              <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                {job.description}
              </p>

              {/* Required Skills Chips with Match State */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Skill Requirements Match:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {job.requiredSkills.map((req, rIdx) => {
                    const isCandidateHasSkill = currentCandidate.skills.some(
                      (s) => s.name.toLowerCase() === req.skill.toLowerCase()
                    );
                    return (
                      <span
                        key={rIdx}
                        className={`text-xs px-2.5 py-1 rounded-lg flex items-center gap-1.5 font-medium ${
                          isCandidateHasSkill
                            ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                            : "bg-slate-100 text-slate-600 border border-slate-200"
                        }`}
                      >
                        {isCandidateHasSkill ? (
                          <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                        ) : (
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                        )}
                        <span>{req.skill}</span>
                        <span className="text-[10px] text-slate-400 font-normal">
                          ({req.minScore}% min)
                        </span>
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Action Bar */}
              <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    Posted {job.postedDate}
                  </span>
                  <span>•</span>
                  <span>{job.applicantsCount} Verified Applicants</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setActiveExplainerJob(job);
                      setSelectedJobId(job.id);
                    }}
                    className="px-4 py-2 text-xs font-semibold text-indigo-700 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl transition-colors flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Why this match?</span>
                  </button>

                  <button
                    disabled={isApplied}
                    onClick={() => applyToJob(job.id)}
                    className={`px-5 py-2 text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 ${
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
            </div>
          );
        })}
      </div>

      {/* ========================================================= */}
      {/* EXPLAINABLE AI MATCH MODAL ('Why this match?')            */}
      {/* ========================================================= */}
      {activeExplainerJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-amber-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base tracking-tight">
                      Explainable AI Matching Analysis
                    </h3>
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded-full">
                      {activeExplainerJob.matchBreakdown.overallScore}% Match
                    </span>
                  </div>
                  <p className="text-xs text-indigo-200 mt-0.5">
                    {activeExplainerJob.title} at {activeExplainerJob.companyName}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveExplainerJob(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-5 divide-y divide-slate-100">
              {/* Natural Language AI Insight */}
              <div className="p-4 rounded-xl bg-indigo-50/80 border border-indigo-100 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-950">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Transparent Matching Explanation:</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {activeExplainerJob.matchBreakdown.aiExplanation}
                </p>
              </div>

              {/* 6-Dimension Algorithmic Breakdown */}
              <div className="pt-4 space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  6D Algorithmic Scoring Factors
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Factor 1: Skill Compatibility */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700">Skill Compatibility (40%)</span>
                      <span className="font-bold text-indigo-600">
                        {activeExplainerJob.matchBreakdown.skillCompatibility}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-600 rounded-full"
                        style={{ width: `${activeExplainerJob.matchBreakdown.skillCompatibility}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 block">
                      Evaluates required skills vs demonstrated score
                    </span>
                  </div>

                  {/* Factor 2: Verified Skills Strength */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700">Verified Skills (20%)</span>
                      <span className="font-bold text-emerald-600">
                        {activeExplainerJob.matchBreakdown.verifiedSkillsScore}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-600 rounded-full"
                        style={{ width: `${activeExplainerJob.matchBreakdown.verifiedSkillsScore}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 block">
                      Platform assessment & project verification weighting
                    </span>
                  </div>

                  {/* Factor 3: Experience Match */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700">Experience Alignment (15%)</span>
                      <span className="font-bold text-slate-800">
                        {activeExplainerJob.matchBreakdown.experienceMatch}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-slate-800 rounded-full"
                        style={{ width: `${activeExplainerJob.matchBreakdown.experienceMatch}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 block">
                      Candidate has {currentCandidate.experienceYears}y (Required: {activeExplainerJob.minExperienceYears}y)
                    </span>
                  </div>

                  {/* Factor 4: Education */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700">Education Alignment (10%)</span>
                      <span className="font-bold text-slate-800">
                        {activeExplainerJob.matchBreakdown.educationMatch}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-slate-800 rounded-full"
                        style={{ width: `${activeExplainerJob.matchBreakdown.educationMatch}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 block">
                      B.Tech Computer Science graduate
                    </span>
                  </div>

                  {/* Factor 5: Location Match */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700">Location Match (5%)</span>
                      <span className="font-bold text-emerald-600">
                        {activeExplainerJob.matchBreakdown.locationMatch}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-600 rounded-full"
                        style={{ width: `${activeExplainerJob.matchBreakdown.locationMatch}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 block">
                      Preferred locations include Salem / Tamil Nadu
                    </span>
                  </div>

                  {/* Factor 6: Potential Growth */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700">Learning Potential (10%)</span>
                      <span className="font-bold text-indigo-600">
                        {activeExplainerJob.matchBreakdown.potentialGrowth}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-600 rounded-full"
                        style={{ width: `${activeExplainerJob.matchBreakdown.potentialGrowth}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 block">
                      Based on rapid assessment progression & roadmap milestones
                    </span>
                  </div>
                </div>
              </div>

              {/* Actionable Advice: Missing Skills & What to do next */}
              {activeExplainerJob.matchBreakdown.missingSkills.length > 0 && (
                <div className="pt-4 space-y-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Recommended Next Steps to Reach 98%+ Match
                  </h4>
                  <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-950 space-y-1.5">
                    <div className="font-bold flex items-center gap-1.5 text-amber-900">
                      <AlertCircle className="w-4 h-4 text-amber-600" />
                      <span>Missing or Unverified Competencies:</span>
                    </div>
                    <ul className="list-disc pl-5 space-y-1">
                      {activeExplainerJob.matchBreakdown.missingSkills.map((m, idx) => (
                        <li key={idx}>
                          <strong>{m.skill}</strong>: {m.reason}
                        </li>
                      ))}
                    </ul>
                    <p className="pt-1 text-[11px] text-amber-800">
                      Take the {activeExplainerJob.matchBreakdown.missingSkills[0]?.skill} assessment in the Assessment Center to boost your score immediately.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => {
                  setActiveExplainerJob(null);
                  setActiveTab("assessments");
                }}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
              >
                Verify Missing Skills in Assessment Center →
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveExplainerJob(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
                >
                  Close
                </button>
                <button
                  disabled={applications.some((a) => a.jobId === activeExplainerJob.id)}
                  onClick={() => {
                    applyToJob(activeExplainerJob.id);
                    setActiveExplainerJob(null);
                  }}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
                >
                  {applications.some((a) => a.jobId === activeExplainerJob.id)
                    ? "Applied ✓"
                    : "Apply with Verified Profile"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
