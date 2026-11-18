import React, { useState, useEffect } from "react";
import {
  Briefcase,
  Lock,
  Mail,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  User,
  Building2,
  ShieldCheck,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import { useApp } from "../../context/AppContext";

export type PortalType = "candidate" | "msme" | "admin";

interface LoginPageProps {
  defaultPortal?: PortalType;
}

export const LoginPage: React.FC<LoginPageProps> = ({ defaultPortal }) => {
  const { login, navigate, currentPath, isAuthenticating, authError, clearAuthError } = useApp();

  // Determine active portal from path or default prop
  const getPortalFromPath = (): PortalType => {
    if (currentPath.includes("admin")) return "admin";
    if (currentPath.includes("msme") || currentPath.includes("employer")) return "msme";
    if (currentPath.includes("candidate")) return "candidate";
    return defaultPortal || "candidate";
  };

  const [activePortal, setActivePortal] = useState<PortalType>(getPortalFromPath());
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Sync state when URL path changes
  useEffect(() => {
    const portal = getPortalFromPath();
    setActivePortal(portal);
    clearAuthError();
  }, [currentPath]);

  const switchPortal = (portal: PortalType) => {
    setActivePortal(portal);
    clearAuthError();
    setEmail("");
    setPassword("");
    if (portal === "candidate") {
      navigate("/login/candidate");
    } else if (portal === "msme") {
      navigate("/login/msme");
    } else {
      navigate("/login/admin");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return;

    const expectedRoleMap: Record<PortalType, "CANDIDATE" | "MSME" | "ADMIN"> = {
      candidate: "CANDIDATE",
      msme: "MSME",
      admin: "ADMIN",
    };

    await login(email.trim(), password, expectedRoleMap[activePortal]);
  };

  // Portal-specific visual and contextual configurations
  const portalConfig = {
    candidate: {
      name: "Candidate Portal",
      badge: "Job Seeker & Student Portal",
      badgeClass: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
      accentBg: "from-indigo-600 to-blue-600",
      accentBtn: "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/25 focus:ring-indigo-500",
      accentRing: "focus:ring-indigo-500 focus:border-indigo-500",
      icon: GraduationCap,
      heading: "Candidate Sign In",
      subheading: "Access verified skill assessments, AI job matches, and personalized career roadmaps",
      emailLabel: "Candidate Registered Email",
      emailPlaceholder: "candidate@email.com or student@institution.ac.in",
      btnText: "Sign In as Candidate",
      signupPrompt: "Looking for verified job openings?",
      signupLinkText: "Create Candidate Profile",
      signupPath: "/signup?role=candidate",
    },
    msme: {
      name: "MSME Employer Portal",
      badge: "Enterprise & Hiring Suite",
      badgeClass: "bg-sky-500/20 text-sky-300 border-sky-500/30",
      accentBg: "from-sky-600 to-cyan-600",
      accentBtn: "bg-sky-600 hover:bg-sky-700 shadow-sky-500/25 focus:ring-sky-500",
      accentRing: "focus:ring-sky-500 focus:border-sky-500",
      icon: Building2,
      heading: "MSME Employer Sign In",
      subheading: "Manage job requisitions, view AI-ranked candidate comparisons, and hire verified talent",
      emailLabel: "Company Work Email",
      emailPlaceholder: "recruiter@company.in or hr@msme-unit.org",
      btnText: "Sign In as MSME Employer",
      signupPrompt: "New enterprise hiring on WorkNexus?",
      signupLinkText: "Register MSME Account",
      signupPath: "/signup?role=msme",
    },
    admin: {
      name: "National Admin Portal",
      badge: "Ministry & National Intelligence Desk",
      badgeClass: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
      accentBg: "from-emerald-600 to-teal-700",
      accentBtn: "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/25 focus:ring-emerald-500",
      accentRing: "focus:ring-emerald-500 focus:border-emerald-500",
      icon: ShieldCheck,
      heading: "National Admin Desk Sign In",
      subheading: "Authorized access for government workforce analysts, regional nodal officers, and NSDC coordinators",
      emailLabel: "Official Government Email / Officer ID",
      emailPlaceholder: "admin@skillbridge.gov.in or officer@msme.gov.in",
      btnText: "Sign In to Admin Intelligence Desk",
      signupPrompt: null,
      signupLinkText: null,
      signupPath: null,
    },
  }[activePortal];

  const CurrentIcon = portalConfig.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex flex-col justify-center py-10 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decorative Gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10 mb-4">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 text-white shadow-xl shadow-indigo-500/25 ring-1 ring-white/20 mb-3">
          <Briefcase className="w-6 h-6 text-white" />
        </div>

        <div className="flex items-center justify-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            WorkNexus
          </h1>
          <span className="px-2 py-0.5 text-xs font-bold bg-indigo-500 text-white rounded-md tracking-wider">
            AI
          </span>
        </div>

        <p className="mt-1 text-[11px] uppercase tracking-widest text-indigo-300 font-semibold">
          National Workforce Platform
        </p>
      </div>

      {/* Separate Portal Selector Tabs */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0 z-10 mb-4">
        <div className="bg-slate-800/90 backdrop-blur-md p-1.5 rounded-2xl border border-white/10 shadow-xl flex items-center gap-1">
          <button
            type="button"
            onClick={() => switchPortal("candidate")}
            className={`flex-1 py-2 px-2 sm:px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activePortal === "candidate"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
            }`}
          >
            <User className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Candidate</span>
          </button>

          <button
            type="button"
            onClick={() => switchPortal("msme")}
            className={`flex-1 py-2 px-2 sm:px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activePortal === "msme"
                ? "bg-sky-600 text-white shadow-md shadow-sky-600/30"
                : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
            }`}
          >
            <Building2 className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">MSME Employer</span>
          </button>

          <button
            type="button"
            onClick={() => switchPortal("admin")}
            className={`flex-1 py-2 px-2 sm:px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activePortal === "admin"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">National Admin</span>
          </button>
        </div>
      </div>

      {/* Main Login Card for Active Portal */}
      <div className="sm:mx-auto sm:w-full sm:max-w-lg px-4 sm:px-0 z-10">
        <div className="bg-white/95 backdrop-blur-md py-7 px-6 sm:px-10 shadow-2xl rounded-3xl border border-slate-100/20 transition-all">
          {/* Active Portal Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${portalConfig.badgeClass}`}>
                <CurrentIcon className="w-3 h-3" />
                <span>{portalConfig.badge}</span>
              </span>

              <span className="text-[11px] text-slate-400 font-mono">
                {activePortal === "candidate" ? "/login/candidate" : activePortal === "msme" ? "/login/msme" : "/login/admin"}
              </span>
            </div>

            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              {portalConfig.heading}
            </h2>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              {portalConfig.subheading}
            </p>

            {activePortal === "admin" && (
              <div className="mt-3 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200/80 text-[11px] text-emerald-800 flex items-center justify-between gap-2">
                <span className="font-medium">
                  ⚖️ <strong>Judge Evaluation Mode:</strong> Enter any email &amp; any password to access the full National Admin Portal.
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setEmail("judge.admin@worknexus.gov.in");
                    setPassword("demoAdmin2025");
                  }}
                  className="px-2 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold text-[10px] shrink-0 cursor-pointer shadow-xs"
                >
                  Fill Demo Admin
                </button>
              </div>
            )}
          </div>

          {/* Error Alert */}
          {authError && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-rose-800 text-xs animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold">{authError}</p>
                {authError.includes("MSME Employer") && activePortal !== "msme" && (
                  <button
                    type="button"
                    onClick={() => switchPortal("msme")}
                    className="mt-1.5 text-xs font-bold text-sky-700 underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Switch to MSME Employer Login</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
                {authError.includes("Candidate") && activePortal !== "candidate" && (
                  <button
                    type="button"
                    onClick={() => switchPortal("candidate")}
                    className="mt-1.5 text-xs font-bold text-indigo-700 underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Switch to Candidate Login</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
                {authError.includes("National Administrator") && activePortal !== "admin" && (
                  <button
                    type="button"
                    onClick={() => switchPortal("admin")}
                    className="mt-1.5 text-xs font-bold text-emerald-700 underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Switch to National Admin Login</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                {portalConfig.emailLabel}
              </label>
              <div className="relative rounded-xl shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (authError) clearAuthError();
                  }}
                  placeholder={portalConfig.emailPlaceholder}
                  className={`block w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:ring-2 ${portalConfig.accentRing} transition-all`}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative rounded-xl shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (authError) clearAuthError();
                  }}
                  placeholder="••••••••••••"
                  className={`block w-full pl-10 pr-10 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:ring-2 ${portalConfig.accentRing} transition-all`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-hidden cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isAuthenticating}
              className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white ${portalConfig.accentBtn} focus:outline-hidden focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transition-all cursor-pointer mt-2`}
            >
              {isAuthenticating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Authenticating Session...</span>
                </>
              ) : (
                <>
                  <span>{portalConfig.btnText}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Registration link or Admin restricted notice */}
          {portalConfig.signupPrompt ? (
            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-center gap-1.5 text-xs text-slate-500">
              <span>{portalConfig.signupPrompt}</span>
              <button
                type="button"
                onClick={() => navigate(portalConfig.signupPath || "/signup")}
                className="font-bold text-indigo-600 hover:text-indigo-800 hover:underline cursor-pointer"
              >
                {portalConfig.signupLinkText}
              </button>
            </div>
          ) : (
            <div className="mt-5 pt-4 border-t border-slate-100 text-center text-[11px] text-slate-400 flex items-center justify-center gap-1">
              <Lock className="w-3 h-3 text-emerald-600" />
              <span>Restricted access for authorized National Nodal Officers only</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Standalone dedicated page wrappers for direct importing or route isolation
export const CandidateLoginPage: React.FC = () => <LoginPage defaultPortal="candidate" />;
export const MSMELoginPage: React.FC = () => <LoginPage defaultPortal="msme" />;
export const AdminLoginPage: React.FC = () => <LoginPage defaultPortal="admin" />;
