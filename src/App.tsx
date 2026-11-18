import React, { useState } from "react";
import { AppProvider, useApp } from "./context/AppContext";
import { Header } from "./components/common/Header";
import { Sidebar } from "./components/common/Sidebar";
import { DemoWalkthroughModal } from "./components/common/DemoWalkthroughModal";
import { AIAssistantDrawer } from "./components/common/AIAssistantDrawer";
import { LoginPage } from "./components/auth/LoginPage";
import { SignupPage } from "./components/auth/SignupPage";
import { ForgotPasswordPage } from "./components/auth/ForgotPasswordPage";
import { Forbidden403 } from "./components/common/Forbidden403";

// Candidate views
import { CandidateDashboard } from "./components/candidate/CandidateDashboard";
import { MySkillsPage } from "./components/candidate/MySkillsPage";
import { AssessmentPage } from "./components/candidate/AssessmentPage";
import { SkillGapPage } from "./components/candidate/SkillGapPage";
import { LearningRoadmapPage } from "./components/candidate/LearningRoadmapPage";
import { JobMatchesPage } from "./components/candidate/JobMatchesPage";
import { ApplicationsPage } from "./components/candidate/ApplicationsPage";
import { SavedJobsPage } from "./components/candidate/SavedJobsPage";
import { CandidateProfilePage } from "./components/candidate/CandidateProfilePage";

// Employer views
import { EmployerDashboard } from "./components/employer/EmployerDashboard";
import { PostJobPage } from "./components/employer/PostJobPage";
import { MyJobsPage } from "./components/employer/MyJobsPage";
import { TalentMatchPage } from "./components/employer/TalentMatchPage";
import { CandidateComparisonPage } from "./components/employer/CandidateComparisonPage";
import { HiringInsightsPage } from "./components/employer/HiringInsightsPage";

// Admin views
import { AdminDashboard } from "./components/admin/AdminDashboard";
import { RegionalAnalyticsPage } from "./components/admin/RegionalAnalyticsPage";
import { SkillDemandMatrixPage } from "./components/admin/SkillDemandMatrixPage";
import { MSMEClusterAnalyticsPage } from "./components/admin/MSMEClusterAnalyticsPage";
import { AdminDirectoryPage } from "./components/admin/AdminDirectoryPage";
import { WorkforceReportsPage } from "./components/admin/WorkforceReportsPage";

const MainLayout: React.FC = () => {
  const {
    role,
    isAuthenticated,
    isAuthenticating,
    currentPath,
    activeTab,
    isDemoModalOpen,
    setIsDemoModalOpen,
    isAIAssistantOpen,
    setIsAIAssistantOpen,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Loading indicator during initial session token verification
  if (isAuthenticating) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-white text-center">
        <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center animate-pulse mb-4 shadow-lg shadow-indigo-500/30">
          <span className="font-black text-xl">WN</span>
        </div>
        <h1 className="text-lg font-bold text-white tracking-tight">WorkNexus AI</h1>
        <p className="text-xs text-slate-400 mt-1">Authenticating National Workforce Portal Session...</p>
      </div>
    );
  }

  // Unauthenticated routes: Show login, signup, or forgot password
  if (!isAuthenticated) {
    if (currentPath === "/signup" || currentPath.startsWith("/signup")) {
      return <SignupPage />;
    }
    if (currentPath === "/forgot-password" || currentPath === "/reset-password") {
      return <ForgotPasswordPage />;
    }
    if (currentPath.startsWith("/login/msme") || currentPath.startsWith("/login/employer")) {
      return <LoginPage defaultPortal="msme" />;
    }
    if (currentPath.startsWith("/login/admin")) {
      return <LoginPage defaultPortal="admin" />;
    }
    if (currentPath.startsWith("/login/candidate")) {
      return <LoginPage defaultPortal="candidate" />;
    }
    return <LoginPage />;
  }

  // Authenticated route guards (RBAC verification)
  if (role === "candidate") {
    if (currentPath.startsWith("/msme")) {
      return (
        <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans antialiased">
          <Header />
          <Forbidden403 attemptedPath={currentPath} requiredRole="MSME EMPLOYER" />
        </div>
      );
    }
    if (currentPath.startsWith("/admin")) {
      return (
        <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans antialiased">
          <Header />
          <Forbidden403 attemptedPath={currentPath} requiredRole="NATIONAL ADMIN" />
        </div>
      );
    }
  } else if (role === "employer") {
    if (currentPath.startsWith("/candidate")) {
      return (
        <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans antialiased">
          <Header />
          <Forbidden403 attemptedPath={currentPath} requiredRole="CANDIDATE" />
        </div>
      );
    }
    if (currentPath.startsWith("/admin")) {
      return (
        <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans antialiased">
          <Header />
          <Forbidden403 attemptedPath={currentPath} requiredRole="NATIONAL ADMIN" />
        </div>
      );
    }
  } else if (role === "admin") {
    if (currentPath.startsWith("/candidate")) {
      return (
        <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans antialiased">
          <Header />
          <Forbidden403 attemptedPath={currentPath} requiredRole="CANDIDATE" />
        </div>
      );
    }
    if (currentPath.startsWith("/msme")) {
      return (
        <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans antialiased">
          <Header />
          <Forbidden403 attemptedPath={currentPath} requiredRole="MSME EMPLOYER" />
        </div>
      );
    }
  }

  // Active view renderer based on role and path/activeTab
  const renderActiveView = () => {
    if (role === "candidate") {
      if (currentPath.includes("/skills") || activeTab === "my-skills") {
        return <MySkillsPage />;
      }
      if (currentPath.includes("/assessments") || activeTab === "assessments") {
        return <AssessmentPage />;
      }
      if (currentPath.includes("/skill-gap") || activeTab === "skill-gap") {
        return <SkillGapPage />;
      }
      if (currentPath.includes("/roadmap") || activeTab === "roadmap") {
        return <LearningRoadmapPage />;
      }
      if (currentPath.includes("/job-matches") || activeTab === "job-matches") {
        return <JobMatchesPage />;
      }
      if (currentPath.includes("/applications") || activeTab === "applications") {
        return <ApplicationsPage />;
      }
      if (currentPath.includes("/saved-jobs") || activeTab === "saved-jobs") {
        return <SavedJobsPage />;
      }
      if (currentPath.includes("/profile") || activeTab === "profile") {
        return <CandidateProfilePage />;
      }
      return <CandidateDashboard />;
    }

    if (role === "employer") {
      if (currentPath.includes("/post-job") || activeTab === "post-job") {
        return <PostJobPage />;
      }
      if (
        currentPath.includes("/my-jobs") ||
        activeTab === "my-jobs" ||
        currentPath.includes("/applications") ||
        activeTab === "applications"
      ) {
        return <MyJobsPage />;
      }
      if (
        currentPath.includes("/talent-match") ||
        activeTab === "talent-match" ||
        currentPath.includes("/shortlisted") ||
        activeTab === "shortlisted"
      ) {
        return <TalentMatchPage />;
      }
      if (currentPath.includes("/compare") || activeTab === "compare") {
        return <CandidateComparisonPage />;
      }
      if (currentPath.includes("/insights") || activeTab === "insights") {
        return <HiringInsightsPage />;
      }
      return <EmployerDashboard />;
    }

    // Admin role
    if (
      currentPath.startsWith("/admin/regional-gaps") ||
      currentPath.includes("/skill-gaps") ||
      activeTab === "regional-gaps" ||
      activeTab === "regional-analytics"
    ) {
      return <RegionalAnalyticsPage />;
    }
    if (
      currentPath.startsWith("/admin/skill-demand") ||
      activeTab === "skill-demand"
    ) {
      return <SkillDemandMatrixPage />;
    }
    if (
      currentPath.startsWith("/admin/msme-analytics") ||
      activeTab === "msme-analytics"
    ) {
      return <MSMEClusterAnalyticsPage />;
    }
    if (
      currentPath.startsWith("/admin/directory") ||
      currentPath.includes("/msme-directory") ||
      activeTab === "admin-directory" ||
      activeTab === "msme-directory"
    ) {
      return <AdminDirectoryPage />;
    }
    if (
      currentPath.startsWith("/admin/reports") ||
      activeTab === "reports" ||
      activeTab === "workforce-reports"
    ) {
      return <WorkforceReportsPage />;
    }
    return <AdminDashboard />;
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans antialiased">
      {/* Header */}
      <Header />

      <div className="flex-1 flex max-w-7xl w-full mx-auto px-3 sm:px-4 lg:px-6 py-5 gap-6">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-20">
            <Sidebar />
          </div>
        </div>

        {/* Mobile Sidebar Overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <div
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="relative w-72 max-w-[80vw] bg-white h-full shadow-2xl p-4 flex flex-col z-10 overflow-y-auto">
              <Sidebar onItemClick={() => setMobileMenuOpen(false)} />
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 pb-12">
          {renderActiveView()}
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-800">SkillBridge AI</span>
            <span>•</span>
            <span>National Skill Matching & MSME Workforce Platform</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Compliant with NSDC, Udyam Aadhaar & Digilocker Verification Protocols
          </p>
        </div>
      </footer>

      {/* Global Modals & Drawers */}
      {isDemoModalOpen && (
        <DemoWalkthroughModal onClose={() => setIsDemoModalOpen(false)} />
      )}
      <AIAssistantDrawer
        isOpen={isAIAssistantOpen}
        onClose={() => setIsAIAssistantOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
