import React from "react";
import {
  LayoutDashboard,
  Award,
  FileCheck2,
  GitFork,
  MapPin,
  Compass,
  Briefcase,
  FileText,
  Bookmark,
  User,
  PlusCircle,
  Users,
  BarChart3,
  Building2,
  TrendingUp,
  Map,
  ShieldCheck,
  Settings,
  Sparkles,
  CheckCircle,
} from "lucide-react";
import { useApp } from "../../context/AppContext";

interface SidebarProps {
  onItemClick?: () => void;
}

interface NavItem {
  id: string;
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  count?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ onItemClick }) => {
  const {
    role,
    activeTab,
    setActiveTab,
    currentPath,
    navigate,
    applications,
    savedJobIds,
    shortlistedCandidateIds,
    user,
  } = useApp();

  const candidateNav: NavItem[] = [
    { id: "dashboard", path: "/candidate/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "my-skills", path: "/candidate/skills", label: "My Skills", icon: Award },
    { id: "assessments", path: "/candidate/assessments", label: "Assessments", icon: FileCheck2 },
    { id: "skill-gap", path: "/candidate/skill-gap", label: "Skill Gap Analysis", icon: GitFork },
    { id: "roadmap", path: "/candidate/roadmap", label: "Learning Roadmap", icon: Compass },
    { id: "job-matches", path: "/candidate/job-matches", label: "Job Matches", icon: Briefcase, badge: "92% Match" },
    { id: "applications", path: "/candidate/applications", label: "Applications", icon: FileText, count: applications.length },
    { id: "saved-jobs", path: "/candidate/saved-jobs", label: "Saved Jobs", icon: Bookmark, count: savedJobIds.length },
    { id: "profile", path: "/candidate/profile", label: "Professional Profile", icon: User },
  ];

  const employerNav: NavItem[] = [
    { id: "dashboard", path: "/msme/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "post-job", path: "/msme/post-job", label: "Post New Job", icon: PlusCircle },
    { id: "my-jobs", path: "/msme/my-jobs", label: "Active Jobs", icon: Briefcase },
    { id: "talent-match", path: "/msme/talent-match", label: "AI Talent Match", icon: Sparkles, badge: "AI Ranked" },
    { id: "compare", path: "/msme/compare", label: "Candidate Comparison", icon: Users },
    { id: "shortlisted", path: "/msme/shortlisted", label: "Shortlisted", icon: CheckCircle, count: shortlistedCandidateIds.length },
    { id: "applications", path: "/msme/applications", label: "Applicant Funnel", icon: FileText, count: 183 },
    { id: "insights", path: "/msme/insights", label: "Hiring Insights", icon: BarChart3 },
    { id: "profile", path: "/msme/profile", label: "Company Profile", icon: Building2 },
  ];

  const adminNav: NavItem[] = [
    { id: "admin-overview", path: "/admin/overview", label: "Executive Overview", icon: LayoutDashboard },
    { id: "regional-gaps", path: "/admin/regional-gaps", label: "Regional Skill Gaps", icon: MapPin },
    { id: "skill-demand", path: "/admin/skill-demand", label: "Skill Demand Matrix", icon: BarChart3 },
    { id: "msme-analytics", path: "/admin/msme-analytics", label: "MSME Clusters", icon: Building2 },
    { id: "admin-directory", path: "/admin/directory", label: "Unified Directory", icon: Users },
    { id: "reports", path: "/admin/reports", label: "Reports & Policy Briefs", icon: FileText },
  ];

  const navItems = role === "candidate" ? candidateNav : role === "employer" ? employerNav : adminNav;

  const handleNavClick = (item: { id: string; path: string }) => {
    setActiveTab(item.id);
    navigate(item.path);
    onItemClick?.();
  };

  return (
    <aside className="w-full bg-white border border-slate-200/80 rounded-2xl p-4 flex flex-col justify-between shadow-xs">
      <div className="space-y-5">
        {/* Role Banner */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
              Verified Session
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              Authenticated
            </span>
          </div>
          <p className="text-xs font-semibold text-slate-900 capitalize">
            {role === "candidate"
              ? (user?.name ? `${user.name} (Candidate)` : "Candidate Workspace")
              : role === "employer"
              ? (user?.name ? `${user.name} (MSME)` : "MSME Employer Suite")
              : "National Admin Intelligence"}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            {role === "candidate" ? "AI Skills & Verified Matching" : role === "employer" ? "AI Talent Ranking & Comparison" : "Workforce Gaps & Data Hub"}
          </p>
        </div>

        {/* Navigation list */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path || activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-xs font-semibold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-slate-500"}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`ml-2 px-1.5 py-0.5 text-[10px] font-semibold rounded-md uppercase tracking-wider shrink-0 ${
                      isActive ? "bg-white/20 text-white" : "bg-indigo-50 text-indigo-700"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
                {item.count !== undefined && (
                  <span
                    className={`ml-2 px-1.5 py-0.5 text-[11px] font-medium rounded-full shrink-0 ${
                      isActive ? "bg-white/20 text-white" : "bg-slate-200/70 text-slate-700"
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Info */}
      <div className="pt-4 border-t border-slate-100 space-y-2">
        <div className="flex items-center justify-between text-[11px] text-slate-500">
          <span>AI Engine</span>
          <span className="font-semibold text-indigo-600">Gemini 3.8-Flash</span>
        </div>
        <div className="flex items-center justify-between text-[11px] text-slate-500">
          <span>Algorithm</span>
          <span className="font-semibold text-slate-700">Multi-Factor 6D</span>
        </div>
        <div className="p-2.5 rounded-lg bg-indigo-50/50 border border-indigo-100/60 text-[11px] text-indigo-900 leading-snug">
          “Match people by verified skills, potential, and growth — not just resumes.”
        </div>
      </div>
    </aside>
  );
};
