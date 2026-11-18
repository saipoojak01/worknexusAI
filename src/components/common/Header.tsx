import React, { useState } from "react";
import {
  Briefcase,
  Bell,
  Sparkles,
  Compass,
  LogOut,
  ChevronDown,
  User,
  Building2,
  ShieldCheck,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { UserRole } from "../../types";

export const Header: React.FC = () => {
  const {
    role,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    setIsDemoModalOpen,
    setIsAIAssistantOpen,
    isAuthenticated,
    user,
    logout,
    navigate,
    setActiveTab,
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const roleMeta: Record<UserRole, { title: string; subtitle: string; icon: any; profileLabel: string; profilePath: string }> = {
    candidate: {
      title: user?.name || "Sai Pooja",
      subtitle: "Verified Candidate",
      icon: User,
      profileLabel: "Candidate Profile",
      profilePath: "/candidate/profile",
    },
    employer: {
      title: user?.name || "TechCraft MSME",
      subtitle: "MSME Employer",
      icon: Building2,
      profileLabel: "Company Profile",
      profilePath: "/msme/profile",
    },
    admin: {
      title: user?.name || "Dr. Rameshwar Rao",
      subtitle: "National Admin",
      icon: ShieldCheck,
      profileLabel: "Admin Profile",
      profilePath: "/admin/settings",
    },
  };

  const handleLogoClick = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (role === "candidate") navigate("/candidate/dashboard");
    else if (role === "employer") navigate("/msme/dashboard");
    else navigate("/admin/overview");
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleLogoClick}
              className="flex items-center gap-2.5 focus:outline-hidden text-left group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-900 via-indigo-900 to-indigo-700 flex items-center justify-center text-white shadow-sm ring-1 ring-indigo-500/20 group-hover:scale-105 transition-transform">
                <div className="relative">
                  <Briefcase className="w-5 h-5 text-indigo-200" />
                  <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-slate-900" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-lg text-slate-900 tracking-tight">WorkNexus</span>
                  <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-indigo-100 text-indigo-700 rounded-md tracking-wide">
                    AI
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                  National Skill Matching & MSME Platform
                </p>
              </div>
            </button>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Hackathon Demo Walkthrough Button */}
            <button
              onClick={() => setIsDemoModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors shadow-2xs"
              title="Click to view the step-by-step hackathon demo flow"
            >
              <Compass className="w-3.5 h-3.5 text-indigo-600 animate-spin-slow" />
              <span className="hidden md:inline">Hackathon Demo Flow</span>
              <span className="md:hidden">Demo</span>
            </button>

            {/* AI Assistant Button */}
            <button
              onClick={() => setIsAIAssistantOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden sm:inline">AI Advisor</span>
            </button>

            {/* Notifications */}
            {isAuthenticated && (
              <div className="relative">
                <button
                  onClick={() => setIsNotifOpen(!isNotifOpen)}
                  className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                  aria-label="Notifications"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
                  )}
                </button>

                {isNotifOpen && (
                  <div className="absolute right-0 mt-1.5 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-2.5 border-b border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-slate-900">Notifications</span>
                        {unreadCount > 0 && (
                          <span className="px-1.5 py-0.2 text-[10px] font-semibold bg-indigo-100 text-indigo-700 rounded-full">
                            {unreadCount} new
                          </span>
                        )}
                      </div>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllNotificationsAsRead}
                          className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>
                    <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                      {notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => {
                            markNotificationAsRead(n.id);
                            if (n.actionUrl) {
                              setActiveTab(n.actionUrl);
                              setIsNotifOpen(false);
                            }
                          }}
                          className={`p-3.5 text-left hover:bg-slate-50 cursor-pointer transition-colors ${
                            !n.isRead ? "bg-indigo-50/30" : ""
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-xs font-semibold text-slate-800">{n.title}</span>
                            <span className="text-[10px] text-slate-400 whitespace-nowrap flex items-center gap-1">
                              <Clock className="w-2.5 h-2.5" />
                              {n.timestamp}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">{n.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Authenticated User Profile & Logout (No Role Switcher) */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 pl-2 pr-2.5 py-1 text-left bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors"
                >
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                    {role === "candidate" ? "CP" : role === "employer" ? "TC" : "NA"}
                  </div>
                  <div className="hidden lg:block text-left leading-tight">
                    <p className="text-xs font-semibold text-slate-900">{roleMeta[role].title}</p>
                    <p className="text-[10px] text-slate-500 font-medium">{roleMeta[role].subtitle}</p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-1.5 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-2.5 border-b border-slate-100 bg-slate-50/50">
                      <p className="text-xs font-semibold text-slate-900">{roleMeta[role].title}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user?.email || (role === "candidate" ? "candidate@skillbridge.gov.in" : role === "employer" ? "employer@skillbridge.gov.in" : "admin@skillbridge.gov.in")}</p>
                      <div className="mt-1.5">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                          <CheckCircle2 className="w-2.5 h-2.5 text-indigo-600" />
                          {user?.role || (role === "candidate" ? "CANDIDATE" : role === "employer" ? "MSME EMPLOYER" : "NATIONAL ADMIN")}
                        </span>
                      </div>
                    </div>

                    <div className="p-1 space-y-0.5">
                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          navigate(roleMeta[role].profilePath);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs flex items-center gap-2.5 text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                      >
                        {role === "candidate" ? (
                          <User className="w-4 h-4 text-indigo-600" />
                        ) : role === "employer" ? (
                          <Building2 className="w-4 h-4 text-sky-600" />
                        ) : (
                          <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        )}
                        <div>
                          <div className="font-medium">{roleMeta[role].profileLabel}</div>
                          <div className="text-[10px] text-slate-400">View and update account settings</div>
                        </div>
                      </button>
                    </div>

                    <div className="border-t border-slate-100 mt-1 pt-1 px-1">
                      <button
                        onClick={async () => {
                          setIsProfileOpen(false);
                          await logout();
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-medium transition-colors"
                      >
                        <LogOut className="w-4 h-4 text-rose-500" />
                        <span>Sign Out (Logout)</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-xs"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
