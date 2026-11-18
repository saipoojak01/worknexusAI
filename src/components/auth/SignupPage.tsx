import React, { useState } from "react";
import {
  Briefcase,
  Lock,
  Mail,
  User,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  Building2,
  CheckCircle2,
  ShieldAlert,
} from "lucide-react";
import { useApp } from "../../context/AppContext";

export const SignupPage: React.FC = () => {
  const { signup, navigate, isAuthenticating, authError, clearAuthError } = useApp();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<"CANDIDATE" | "MSME">(() => {
    if (typeof window !== "undefined") {
      const search = window.location.search;
      if (search.includes("msme")) return "MSME";
      if (window.location.pathname.includes("msme")) return "MSME";
    }
    return "CANDIDATE";
  });
  const [companyName, setCompanyName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!name.trim() || !email.trim() || !password) {
      setLocalError("Please fill out all required fields.");
      return;
    }

    if (password.length < 6) {
      setLocalError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setLocalError("Passwords do not match. Please re-enter.");
      return;
    }

    await signup({
      name: name.trim(),
      email: email.trim(),
      password,
      confirmPassword,
      role,
      companyName: role === "MSME" ? companyName.trim() : undefined,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decorative Gradients */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header / Brand */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 text-white shadow-xl shadow-indigo-500/25 ring-1 ring-white/20 mb-4">
          <Briefcase className="w-7 h-7 text-white" />
        </div>

        <div className="flex items-center justify-center gap-2">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            WorkNexus
          </h1>
          <span className="px-2 py-0.5 text-xs font-bold bg-indigo-500 text-white rounded-md tracking-wider">
            AI
          </span>
        </div>

        <p className="mt-1.5 text-xs uppercase tracking-widest text-indigo-300 font-semibold">
          National Workforce Platform
        </p>
        <p className="mt-2 text-sm text-slate-300">
          Create an account to join the verified national workforce ecosystem
        </p>
      </div>

      {/* Signup Form Card */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg px-4 sm:px-0 z-10">
        <div className="bg-white/95 backdrop-blur-md py-8 px-6 sm:px-10 shadow-2xl rounded-3xl border border-slate-100/20">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-900">Create Account</h2>
            <p className="text-xs text-slate-500 mt-1">
              Select your organization type and register below
            </p>
          </div>

          {/* Error Banner */}
          {(localError || authError) && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-800 text-xs animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <p className="font-semibold">{localError || authError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role Selection (Candidate vs MSME) */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Registering As
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole("CANDIDATE")}
                  className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                    role === "CANDIDATE"
                      ? "bg-indigo-50 border-indigo-400 ring-2 ring-indigo-500/20 text-indigo-950"
                      : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      role === "CANDIDATE" ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold">Job Seeker</div>
                    <div className="text-[10px] text-slate-500">Candidate / Youth</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setRole("MSME")}
                  className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                    role === "MSME"
                      ? "bg-sky-50 border-sky-400 ring-2 ring-sky-500/20 text-sky-950"
                      : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      role === "MSME" ? "bg-sky-600 text-white" : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold">MSME Employer</div>
                    <div className="text-[10px] text-slate-500">Industry / Enterprise</div>
                  </div>
                </button>
              </div>

              {/* Admin Registration Prohibition Notice */}
              <div className="mt-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2 text-[10px] text-slate-500">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>
                  National Administrator accounts are strictly governed and cannot be created through public registration.
                </span>
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Full Name
              </label>
              <div className="relative rounded-xl shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (localError) setLocalError(null);
                  }}
                  placeholder={role === "CANDIDATE" ? "Sai Pooja" : "Rajesh Sharma"}
                  className="block w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                />
              </div>
            </div>

            {/* If MSME, Company Name */}
            {role === "MSME" && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Registered Enterprise / MSME Name
                </label>
                <div className="relative rounded-xl shadow-2xs">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Precision Tech Manufacturing Pvt Ltd"
                    className="block w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                  />
                </div>
              </div>
            )}

            {/* Email Address */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Official Email Address
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
                    if (localError) setLocalError(null);
                  }}
                  placeholder="your.email@example.com"
                  className="block w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Password (min. 6 characters)
              </label>
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
                    if (localError) setLocalError(null);
                  }}
                  placeholder="••••••••••••"
                  className="block w-full pl-10 pr-10 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-hidden"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Confirm Password
              </label>
              <div className="relative rounded-xl shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (localError) setLocalError(null);
                  }}
                  placeholder="••••••••••••"
                  className="block w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isAuthenticating}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20 transition-all cursor-pointer mt-3"
            >
              {isAuthenticating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Hashing Password with bcrypt & Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create {role === "CANDIDATE" ? "Candidate" : "MSME"} Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Return to Sign In */}
          <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-center gap-1.5 text-xs text-slate-500">
            <span>Already have an account?</span>
            <button
              type="button"
              onClick={() => navigate(role === "MSME" ? "/login/msme" : "/login/candidate")}
              className="font-bold text-indigo-600 hover:text-indigo-800 hover:underline cursor-pointer"
            >
              Sign In to {role === "MSME" ? "MSME Portal" : "Candidate Portal"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
