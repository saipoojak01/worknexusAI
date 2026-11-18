import React from "react";
import { ShieldAlert, ArrowLeft, LogOut, Lock } from "lucide-react";
import { useApp } from "../../context/AppContext";

interface Forbidden403Props {
  attemptedPath: string;
  requiredRole?: string;
}

export const Forbidden403: React.FC<Forbidden403Props> = ({ attemptedPath, requiredRole }) => {
  const { user, role, logout, navigate } = useApp();

  const handleReturnToDashboard = () => {
    if (role === "candidate") {
      navigate("/candidate/dashboard");
    } else if (role === "employer") {
      navigate("/msme/dashboard");
    } else {
      navigate("/admin/overview");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-6">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shadow-inner">
          <ShieldAlert className="w-9 h-9" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-rose-100 text-rose-800 tracking-wider">
            <Lock className="w-3 h-3" />
            <span>403 FORBIDDEN</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Access Restricted</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            You do not have administrative authorization to access{" "}
            <code className="px-1.5 py-0.5 rounded-md bg-slate-100 text-rose-600 font-mono text-[11px]">
              {attemptedPath}
            </code>
            .
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span>Authenticated User:</span>
            <span className="font-semibold text-slate-800">{user?.name || "Verified Session"}</span>
          </div>
          <div className="flex items-center justify-between text-slate-500">
            <span>Current Verified Role:</span>
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-indigo-100 text-indigo-700 uppercase">
              {user?.role || role}
            </span>
          </div>
          {requiredRole && (
            <div className="flex items-center justify-between text-slate-500">
              <span>Required Role:</span>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-rose-100 text-rose-700 uppercase">
                {requiredRole}
              </span>
            </div>
          )}
          <div className="pt-2 border-t border-slate-200/80 text-[11px] text-slate-500 leading-normal">
            National Data Governance protocols enforce strict role-based separation between Candidates, MSME Employers, and Executive Administrators.
          </div>
        </div>

        <div className="space-y-2.5">
          <button
            type="button"
            onClick={handleReturnToDashboard}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-md shadow-indigo-500/20 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to My Authorized Dashboard</span>
          </button>

          <button
            type="button"
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out & Switch Account</span>
          </button>
        </div>
      </div>
    </div>
  );
};
