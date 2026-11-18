import React, { useState } from "react";
import {
  GitFork,
  Target,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Compass,
  TrendingUp,
  Layers,
  ChevronRight,
  Info,
} from "lucide-react";
import { useApp } from "../../context/AppContext";

interface RoleRequirement {
  skill: string;
  requiredLevel: number;
  priority: "High" | "Medium" | "Low";
  industryReason: string;
}

const ROLE_PROFILES: Record<
  string,
  {
    title: string;
    description: string;
    demandLevel: string;
    requirements: RoleRequirement[];
  }
> = {
  "Java Backend Developer": {
    title: "Java Backend Developer",
    description: "Core microservice developer responsible for enterprise REST APIs, database persistence, and system performance.",
    demandLevel: "Very High (85% MSMEs)",
    requirements: [
      { skill: "Java", requiredLevel: 80, priority: "High", industryReason: "Core language foundation for enterprise systems" },
      { skill: "SQL", requiredLevel: 75, priority: "High", industryReason: "Essential for transactional integrity and queries" },
      { skill: "Spring Boot", requiredLevel: 75, priority: "High", industryReason: "Primary framework requested in 85% of MSME job descriptions" },
      { skill: "REST APIs & Security", requiredLevel: 70, priority: "High", industryReason: "Standard communication protocol for modern web/mobile backends" },
      { skill: "AWS / Cloud", requiredLevel: 60, priority: "Medium", industryReason: "Deployments and container hosting on AWS/GCP" },
      { skill: "Docker", requiredLevel: 60, priority: "Low", industryReason: "Containerization for consistent developer environments" },
    ],
  },
  "Full Stack Developer": {
    title: "Full Stack Developer",
    description: "End-to-end web developer building responsive React user interfaces paired with robust backend APIs.",
    demandLevel: "Critical Shortage",
    requirements: [
      { skill: "React", requiredLevel: 80, priority: "High", industryReason: "Primary frontend framework across Indian tech startups" },
      { skill: "Java", requiredLevel: 70, priority: "High", industryReason: "Backend processing and enterprise business logic" },
      { skill: "SQL", requiredLevel: 70, priority: "High", industryReason: "Database management and relation queries" },
      { skill: "TypeScript", requiredLevel: 65, priority: "Medium", industryReason: "Type safety and scalable frontend codebases" },
      { skill: "Tailwind CSS", requiredLevel: 75, priority: "Medium", industryReason: "Rapid modern interface styling and responsive design" },
      { skill: "Docker", requiredLevel: 55, priority: "Low", industryReason: "Local development orchestration" },
    ],
  },
  "Data Analyst": {
    title: "Data Analyst",
    description: "Business intelligence specialist transforming operational MSME data into actionable dashboards.",
    demandLevel: "High Growth",
    requirements: [
      { skill: "SQL", requiredLevel: 85, priority: "High", industryReason: "Complex querying, aggregation, and data extraction" },
      { skill: "Python", requiredLevel: 75, priority: "High", industryReason: "Data wrangling, pandas, and automation scripts" },
      { skill: "Power BI / Tableau", requiredLevel: 70, priority: "High", industryReason: "Executive KPI dashboards and report visualization" },
      { skill: "Statistical Analysis", requiredLevel: 65, priority: "Medium", industryReason: "Trend forecasting and distribution modeling" },
      { skill: "Excel Advanced", requiredLevel: 80, priority: "Low", industryReason: "Spreadsheet modeling and legacy MSME records" },
    ],
  },
  "Cloud DevOps Engineer": {
    title: "Cloud DevOps Engineer",
    description: "Automates CI/CD delivery pipelines, manages container clusters, and monitors production reliability.",
    demandLevel: "High Demand",
    requirements: [
      { skill: "AWS / Cloud", requiredLevel: 80, priority: "High", industryReason: "Core cloud infrastructure management" },
      { skill: "Docker", requiredLevel: 75, priority: "High", industryReason: "Containerizing microservices and microfrontends" },
      { skill: "Linux Shell Scripting", requiredLevel: 70, priority: "High", industryReason: "Server configuration and maintenance automation" },
      { skill: "CI/CD Pipelines", requiredLevel: 65, priority: "Medium", industryReason: "GitHub Actions / GitLab CI release automation" },
      { skill: "Kubernetes", requiredLevel: 60, priority: "Low", industryReason: "Cluster scaling and ingress management" },
    ],
  },
};

export const SkillGapPage: React.FC = () => {
  const { currentCandidate, setActiveTab } = useApp();
  const [selectedRoleKey, setSelectedRoleKey] = useState<string>("Java Backend Developer");

  const activeRole = ROLE_PROFILES[selectedRoleKey];

  // Compare candidate skills vs role requirements
  const analysis = activeRole.requirements.map((req) => {
    const candidateSkill = currentCandidate.skills.find(
      (s) => s.name.toLowerCase() === req.skill.toLowerCase()
    );
    const candidateLevel = candidateSkill ? candidateSkill.score : 0;
    const gap = req.requiredLevel - candidateLevel;
    const isMet = candidateLevel >= req.requiredLevel;

    return {
      skill: req.skill,
      candidateLevel,
      requiredLevel: req.requiredLevel,
      gap: isMet ? 0 : gap,
      isMet,
      priority: req.priority,
      industryReason: req.industryReason,
    };
  });

  // Calculate readiness score
  const totalRequired = activeRole.requirements.length;
  let fulfilledPoints = 0;
  analysis.forEach((a) => {
    if (a.isMet) {
      fulfilledPoints += 100;
    } else {
      fulfilledPoints += Math.max(0, (a.candidateLevel / a.requiredLevel) * 100);
    }
  });

  const readinessScore = Math.round(fulfilledPoints / totalRequired);

  const highPriorityGaps = analysis.filter((a) => !a.isMet && a.priority === "High");
  const mediumPriorityGaps = analysis.filter((a) => !a.isMet && a.priority === "Medium");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              AI Skill Gap Analyzer
            </h1>
            <span className="px-2 py-0.5 text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-md">
              Industry Aligned
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Benchmark your current verified capabilities against active Indian MSME job market expectations
          </p>
        </div>

        <button
          onClick={() => setActiveTab("roadmap")}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-2 shrink-0"
        >
          <Compass className="w-4 h-4" />
          <span>Generate 4-Week Roadmap</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Target Role Selector Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Object.keys(ROLE_PROFILES).map((roleKey) => {
          const isSelected = selectedRoleKey === roleKey;
          const roleData = ROLE_PROFILES[roleKey];
          return (
            <button
              key={roleKey}
              onClick={() => setSelectedRoleKey(roleKey)}
              className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                isSelected
                  ? "bg-white border-indigo-600 ring-2 ring-indigo-500/20 shadow-xs"
                  : "bg-slate-50/70 hover:bg-slate-50 border-slate-200/80"
              }`}
            >
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Role Option
                </span>
                <p className="text-xs font-bold text-slate-900 leading-snug">{roleKey}</p>
              </div>
              <div className="mt-3 flex items-center justify-between text-[10px]">
                <span className="text-emerald-700 font-semibold">{roleData.demandLevel}</span>
                {isSelected && <span className="text-indigo-600 font-bold">Active</span>}
              </div>
            </button>
          );
        })}
      </div>

      {/* Role Overview & Readiness Gauge */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-900 text-white shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-indigo-300" />
              <span className="text-xs font-semibold text-indigo-200">
                Target Role Benchmark
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              {activeRole.title}
            </h2>
            <p className="text-xs sm:text-sm text-indigo-200/90 leading-relaxed">
              {activeRole.description}
            </p>
          </div>

          {/* Readiness Score Box */}
          <div className="p-4 rounded-xl bg-white/10 border border-white/20 flex items-center gap-5 shrink-0">
            <div className="text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-200">
                Current Readiness
              </span>
              <div className="text-3xl font-extrabold text-white mt-0.5">
                {readinessScore}%
              </div>
              <span className="text-[10px] text-emerald-300 font-medium">
                {readinessScore >= 80 ? "Hire-Ready" : readinessScore >= 60 ? "Near Qualified" : "Upskilling Needed"}
              </span>
            </div>

            <div className="h-10 w-px bg-white/20" />

            <div className="text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-200">
                Post-Roadmap
              </span>
              <div className="text-3xl font-extrabold text-emerald-400 mt-0.5">
                95%
              </div>
              <span className="text-[10px] text-indigo-200 font-medium">In 4 Weeks</span>
            </div>
          </div>
        </div>
      </div>

      {/* Explainable AI Gap Insight */}
      <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5">
          <Sparkles className="w-4 h-4" />
        </div>
        <div className="text-xs text-slate-700 leading-relaxed space-y-1">
          <p className="font-bold text-indigo-950">
            AI Diagnostic for {currentCandidate.name} ({readinessScore}% Match):
          </p>
          <p>
            You have strong foundations in <strong>Java (86%)</strong> and <strong>SQL (82%)</strong>.
            However, 85% of Indian MSMEs hiring for this title require practical experience in{" "}
            <strong>Spring Boot microservices</strong> and <strong>REST API security</strong>.
            Closing these two high-priority gaps will increase your profile compatibility to 95%+.
          </p>
        </div>
      </div>

      {/* Skills Gap Matrix */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Competency vs. Requirement Comparison</h3>
            <p className="text-xs text-slate-500">
              Detailed breakdown of each technical competency required for this role
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1 text-emerald-600 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" /> Fulfills Requirement
            </span>
            <span className="flex items-center gap-1 text-amber-600 font-semibold">
              <AlertTriangle className="w-3.5 h-3.5" /> Skill Gap Identified
            </span>
          </div>
        </div>

        <div className="space-y-4 pt-2">
          {analysis.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2.5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="font-bold text-sm text-slate-900">{item.skill}</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      item.priority === "High"
                        ? "bg-rose-50 text-rose-700 border border-rose-200/60"
                        : item.priority === "Medium"
                        ? "bg-amber-50 text-amber-700 border border-amber-200/60"
                        : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {item.priority} Priority
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs">
                  <div>
                    <span className="text-slate-400">Your Score: </span>
                    <span className="font-extrabold text-slate-800">{item.candidateLevel}%</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Required: </span>
                    <span className="font-extrabold text-slate-800">{item.requiredLevel}%</span>
                  </div>
                  {item.isMet ? (
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Met
                    </span>
                  ) : (
                    <span className="text-[11px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                      -{item.gap}% Gap
                    </span>
                  )}
                </div>
              </div>

              {/* Progress Comparison Bar */}
              <div className="relative w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                {/* Required marker */}
                <div
                  className="absolute top-0 bottom-0 bg-slate-400/40"
                  style={{ width: `${item.requiredLevel}%` }}
                />
                {/* Candidate score */}
                <div
                  className={`relative h-full rounded-full transition-all duration-300 ${
                    item.isMet ? "bg-emerald-500" : "bg-indigo-600"
                  }`}
                  style={{ width: `${item.candidateLevel}%` }}
                />
              </div>

              {/* Why it matters */}
              <p className="text-[11px] text-slate-500 italic">
                “{item.industryReason}”
              </p>
            </div>
          ))}
        </div>

        {/* CTA to Roadmap */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-xs font-bold text-slate-900">
              Ready to eliminate these {highPriorityGaps.length} high-priority gaps?
            </h4>
            <p className="text-[11px] text-slate-500">
              Our AI curriculum generates practical weekly projects mapped to active MSME vacancies.
            </p>
          </div>

          <button
            onClick={() => setActiveTab("roadmap")}
            className="w-full sm:w-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <Compass className="w-4 h-4" />
            <span>Open Personalized Learning Roadmap</span>
          </button>
        </div>
      </div>
    </div>
  );
};
