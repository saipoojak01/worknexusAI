import React, { useState } from "react";
import {
  X,
  User,
  Building2,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Lock,
  Mail,
  CheckCircle,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { UserRole } from "../../types";

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, loginAsRole } = useApp();
  const [selectedRole, setSelectedRole] = useState<UserRole>("candidate");
  const [email, setEmail] = useState("candidate@worknexus.demo");
  const [password, setPassword] = useState("demo123");

  if (!isAuthModalOpen) return null;

  const handleRoleSelect = (r: UserRole) => {
    setSelectedRole(r);
    if (r === "candidate") {
      setEmail("candidate@worknexus.demo");
    } else if (r === "employer") {
      setEmail("employer@worknexus.demo");
    } else {
      setEmail("admin@worknexus.demo");
    }
    setPassword("demo123");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginAsRole(selectedRole);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-900 text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base tracking-tight">Sign In to WorkNexus AI</h3>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded-full">
                Hackathon Demo
              </span>
            </div>
            <p className="text-xs text-indigo-200/80 mt-0.5">
              Select a pre-configured persona or test with demo credentials
            </p>
          </div>
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1-Click Fast Role Selection */}
        <div className="p-5 space-y-4">
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Fast 1-Click Persona Login
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  handleRoleSelect("candidate");
                  loginAsRole("candidate");
                }}
                className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                  selectedRole === "candidate"
                    ? "bg-indigo-50/80 border-indigo-500 text-indigo-950 ring-2 ring-indigo-500/10"
                    : "bg-slate-50 hover:bg-slate-100/80 border-slate-200 text-slate-700"
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold leading-tight">Candidate</span>
                <span className="text-[10px] text-slate-500">Sai Pooja</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  handleRoleSelect("employer");
                  loginAsRole("employer");
                }}
                className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                  selectedRole === "employer"
                    ? "bg-sky-50/80 border-sky-500 text-sky-950 ring-2 ring-sky-500/10"
                    : "bg-slate-50 hover:bg-slate-100/80 border-slate-200 text-slate-700"
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center">
                  <Building2 className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold leading-tight">MSME Employer</span>
                <span className="text-[10px] text-slate-500">TechCraft</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  handleRoleSelect("admin");
                  loginAsRole("admin");
                }}
                className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                  selectedRole === "admin"
                    ? "bg-emerald-50/80 border-emerald-500 text-emerald-950 ring-2 ring-emerald-500/10"
                    : "bg-slate-50 hover:bg-slate-100/80 border-slate-200 text-slate-700"
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold leading-tight">Workforce Admin</span>
                <span className="text-[10px] text-slate-500">National Desk</span>
              </button>
            </div>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="grow border-t border-slate-200"></div>
            <span className="shrink mx-3 text-[11px] text-slate-400 font-medium">Or enter credentials</span>
            <div className="grow border-t border-slate-200"></div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="text-xs font-medium text-slate-700 block mb-1">Demo Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-700 block mb-1">Demo Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center justify-center gap-2 mt-2"
            >
              <span>Authenticate as {selectedRole.toUpperCase()}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-1">
            <div className="font-semibold text-slate-800 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Verified Hackathon Testing Credentials:</span>
            </div>
            <p className="text-slate-500 font-mono text-[10px]">
              Candidate: candidate@worknexus.demo / demo123<br />
              Employer: employer@worknexus.demo / demo123<br />
              Admin: admin@worknexus.demo / demo123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
