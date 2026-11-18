import React, { useState } from "react";
import {
  X,
  Compass,
  CheckCircle2,
  ArrowRight,
  User,
  Building2,
  ShieldCheck,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { useApp } from "../../context/AppContext";

interface DemoStep {
  id: number;
  title: string;
  role: "candidate" | "employer" | "admin";
  tab: string;
  description: string;
  actionText: string;
  highlightJobId?: string;
  highlightCandidateId?: string;
}

const DEMO_STEPS: DemoStep[] = [
  {
    id: 1,
    title: "1. Candidate Login & Overview",
    role: "candidate",
    tab: "dashboard",
    description: "Login as Sai Pooja (B.Tech CSE graduate). See Overall Skill Score (82/100), Job Readiness (78%), and 8 Verified Skills.",
    actionText: "View Candidate Dashboard",
  },
  {
    id: 2,
    title: "2. View Skill Profile & Transcript",
    role: "candidate",
    tab: "my-skills",
    description: "Explore verified technical capabilities (Java 86%, SQL 82%, React 74%) with platform benchmark badges and project evidence.",
    actionText: "Open My Skills",
  },
  {
    id: 3,
    title: "3. Take AI Skill Assessment",
    role: "candidate",
    tab: "assessments",
    description: "Run an interactive multiple-choice & scenario assessment with active timer, instant scoring, and AI proficiency evaluation.",
    actionText: "Launch Assessment Center",
  },
  {
    id: 4,
    title: "4. See Skill Score & Strengths",
    role: "candidate",
    tab: "assessments",
    description: "Review automated skill diagnostics identifying strong areas (OOP, Collections) and actionable areas for improvement.",
    actionText: "Inspect Assessment Analytics",
  },
  {
    id: 5,
    title: "5. Open Skill Gap Analyzer",
    role: "candidate",
    tab: "skill-gap",
    description: "Select target role 'Java Backend Developer' and benchmark current skills against realistic Indian MSME industry demands.",
    actionText: "Launch Skill Gap Analyzer",
  },
  {
    id: 6,
    title: "6. Inspect Skill Gaps & Readiness",
    role: "candidate",
    tab: "skill-gap",
    description: "Identify high-priority missing skills (Spring Boot, REST APIs) vs low-priority gaps (AWS, Docker) with AI contextual explanation.",
    actionText: "View Readiness Breakdown",
  },
  {
    id: 7,
    title: "7. Generate Personalized Learning Roadmap",
    role: "candidate",
    tab: "roadmap",
    description: "Explore a dynamic 4-week structured curriculum with weekly projects, hour estimates, and interactive completion milestones.",
    actionText: "View 4-Week Roadmap",
  },
  {
    id: 8,
    title: "8. Open AI Job Matches",
    role: "candidate",
    tab: "job-matches",
    description: "Examine intelligent opportunity matching highlighting a 92% match with 'Junior Java Backend Developer' at TechCraft Solutions.",
    actionText: "View AI Job Matches",
    highlightJobId: "job-1",
  },
  {
    id: 9,
    title: "9. Transparent Explainable AI ('Why this match?')",
    role: "candidate",
    tab: "job-matches",
    description: "Open the 6D algorithmic breakdown: Skill Match 94%, Experience 86%, Education 90%, Verified Skills 95%, Location 100%.",
    actionText: "Inspect Match Explainer",
    highlightJobId: "job-1",
  },
  {
    id: 10,
    title: "10. One-Click Apply to MSME",
    role: "candidate",
    tab: "job-matches",
    description: "Submit application with verified credentials attached. Live applicant count updates and application enters MSME hiring funnel.",
    actionText: "Simulate Apply Flow",
    highlightJobId: "job-1",
  },
  {
    id: 11,
    title: "11. Track Status in 'My Applications'",
    role: "candidate",
    tab: "applications",
    description: "View application timeline progression (Applied → Shortlisted → Assessment → Interview → Selected).",
    actionText: "View Applications Timeline",
  },
  {
    id: 12,
    title: "12. Switch to MSME / Employer Demo",
    role: "employer",
    tab: "dashboard",
    description: "Switch to TechCraft Solutions Pvt Ltd dashboard with 4 metric cards (Active Jobs 24, Applicants 183, Shortlisted 32, Interviews 12).",
    actionText: "Open Employer Dashboard",
  },
  {
    id: 13,
    title: "13. View Posted Jobs & Vacancies",
    role: "employer",
    tab: "my-jobs",
    description: "Explore active job listings with structured skill weighting profiles generated automatically upon posting.",
    actionText: "View Posted Jobs",
  },
  {
    id: 14,
    title: "14. Open AI Candidate Ranking",
    role: "employer",
    tab: "talent-match",
    description: "View candidates ranked by verified compatibility: Sai Pooja (94%), Ramya Krishnan (89%), Arun Kumar (85%).",
    actionText: "View AI Recommended Talent",
  },
  {
    id: 15,
    title: "15. Side-by-Side Candidate Comparison",
    role: "employer",
    tab: "compare",
    description: "Inspect multi-candidate comparison matrix across verified Java, Spring Boot, SQL, Experience, and overall compatibility scores.",
    actionText: "Open Candidate Comparison",
  },
  {
    id: 16,
    title: "16. Shortlist & Invite to Assessment",
    role: "employer",
    tab: "talent-match",
    description: "Shortlist candidate with 1 click. LocalStorage state persists instantly.",
    actionText: "View Shortlisted Talent",
  },
  {
    id: 17,
    title: "17. View MSME Hiring Insights & Skill Shortages",
    role: "employer",
    tab: "insights",
    description: "Analyze most in-demand MSME skills, candidate availability curves, and time-to-shortlist charts.",
    actionText: "View MSME Hiring Insights",
  },
  {
    id: 18,
    title: "18. Switch to Admin / National Workforce Desk",
    role: "admin",
    tab: "dashboard",
    description: "Access national workforce dashboard aggregating candidates, registered MSMEs, verified skills, and regional trends.",
    actionText: "Open Admin Dashboard",
  },
  {
    id: 19,
    title: "19. Regional Skill Gap Map & Intelligence",
    role: "admin",
    tab: "regional-gaps",
    description: "Explore state-by-state intelligence (Tamil Nadu, Karnataka, Maharashtra, Telangana, Delhi NCR) with AI workforce policy recommendations.",
    actionText: "View National Regional Gaps",
  },
];

export const DemoWalkthroughModal: React.FC = () => {
  const {
    isDemoModalOpen,
    setIsDemoModalOpen,
    setRole,
    setActiveTab,
    setIsAuthenticated,
    setSelectedJobId,
  } = useApp();

  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  if (!isDemoModalOpen) return null;

  const currentStep = DEMO_STEPS[currentStepIndex];

  const jumpToStep = (index: number) => {
    const step = DEMO_STEPS[index];
    setIsAuthenticated(true);
    setRole(step.role);
    setActiveTab(step.tab);
    if (step.highlightJobId) {
      setSelectedJobId(step.highlightJobId);
    }
    setCurrentStepIndex(index);
    setIsDemoModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-indigo-300">
              <Compass className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base tracking-tight">Hackathon Complete Demo Flow</h3>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-indigo-500/30 text-indigo-200 rounded-full border border-indigo-400/30">
                  19 Sequential Steps
                </span>
              </div>
              <p className="text-xs text-indigo-200/80 mt-0.5">
                Evaluator Guide for testing the end-to-end WorkNexus AI workflow
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsDemoModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 divide-y divide-slate-100">
          {/* Active Highlight Box */}
          <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-100 mb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-indigo-600 text-white">
                  Step {currentStep.id} of 19
                </span>
                <span className="text-xs font-semibold text-slate-600 capitalize flex items-center gap-1">
                  {currentStep.role === "candidate" ? (
                    <User className="w-3.5 h-3.5 text-indigo-600" />
                  ) : currentStep.role === "employer" ? (
                    <Building2 className="w-3.5 h-3.5 text-sky-600" />
                  ) : (
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  )}
                  {currentStep.role} Mode
                </span>
              </div>
              <button
                onClick={() => jumpToStep(currentStepIndex)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
              >
                <span>Jump to this Step</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <h4 className="text-sm font-bold text-slate-900">{currentStep.title}</h4>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">{currentStep.description}</p>
          </div>

          {/* All 19 Steps List */}
          <div className="pt-4">
            <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Full End-to-End Walkthrough Sequence
            </h5>
            <div className="space-y-2">
              {DEMO_STEPS.map((step, idx) => {
                const isSelected = idx === currentStepIndex;
                return (
                  <div
                    key={step.id}
                    onClick={() => setCurrentStepIndex(idx)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? "bg-white border-indigo-500 ring-2 ring-indigo-500/10 shadow-xs"
                        : "bg-slate-50/50 hover:bg-slate-50 border-slate-200/80"
                    }`}
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                          isSelected
                            ? "bg-indigo-600 text-white"
                            : "bg-slate-200 text-slate-600"
                        }`}
                      >
                        {step.id}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-semibold text-slate-900 truncate">{step.title}</p>
                          <span
                            className={`text-[10px] px-1.5 py-0.2 rounded-md font-medium capitalize ${
                              step.role === "candidate"
                                ? "bg-indigo-50 text-indigo-700"
                                : step.role === "employer"
                                ? "bg-sky-50 text-sky-700"
                                : "bg-emerald-50 text-emerald-700"
                            }`}
                          >
                            {step.role}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{step.description}</p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        jumpToStep(idx);
                      }}
                      className="ml-3 shrink-0 px-2.5 py-1 text-xs font-medium text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-colors flex items-center gap-1"
                    >
                      <span>Jump</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Click any step to automatically transition view & role</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => jumpToStep(currentStepIndex)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
            >
              <span>Launch Step {currentStep.id}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
