import React from "react";
import {
  Briefcase,
  Sparkles,
  Award,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Building2,
  Users,
  Compass,
  FileCheck2,
  Target,
  ShieldCheck,
  Zap,
  MapPin,
} from "lucide-react";
import { useApp } from "../../context/AppContext";

export const LandingPage: React.FC = () => {
  const { loginAsRole, setIsDemoModalOpen, setIsAuthModalOpen } = useApp();

  const workflowSteps = [
    { num: "01", title: "Assess", desc: "Interactive AI diagnostics across technical, cognitive & practical problem-solving capabilities.", icon: FileCheck2 },
    { num: "02", title: "Verify", desc: "Anti-cheat proctored benchmarking with tamper-evident cryptographic skill badges.", icon: Award },
    { num: "03", title: "Identify Gaps", desc: "Dynamic role gap analyzer mapping individual competencies against live MSME vacancy requirements.", icon: Target },
    { num: "04", title: "Upskill", desc: "Algorithmic 4-week structured roadmaps with actionable micro-projects and industry tutorials.", icon: Compass },
    { num: "05", title: "Match", desc: "Multi-factor explainable ranking (skills, verified depth, location, and potential).", icon: Zap },
    { num: "06", title: "Hire", desc: "Direct MSME interview pipelines with candidate side-by-side comparison and instant shortlisting.", icon: Building2 },
  ];

  const stats = [
    { value: "10,000+", label: "Verified Skills Mapped", sub: "Standardized against NCVET & industry criteria" },
    { value: "2,500+", label: "Registered MSMEs", sub: "Verified via Udyam enterprise credentials" },
    { value: "25,000+", label: "Opportunities Created", sub: "High-growth technical & vocational roles" },
    { value: "92%", label: "Matching Accuracy", sub: "Validated candidate-to-employer retention rate" },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      {/* Top National Announcement Bar */}
      <div className="bg-slate-950 text-slate-300 py-1.5 px-4 text-xs font-medium border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-200 font-semibold">National Initiative:</span>
            <span className="hidden sm:inline">AI-Based Workforce & MSME Skill Matching Architecture</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsDemoModalOpen(true)}
              className="text-amber-300 hover:text-amber-200 font-semibold underline underline-offset-2 flex items-center gap-1"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Explore 19-Step Hackathon Demo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary Navigation */}
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-900 via-indigo-950 to-indigo-800 flex items-center justify-center text-white shadow-sm">
              <Briefcase className="w-5 h-5 text-indigo-300" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg text-slate-900 tracking-tight">WorkNexus</span>
                <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-indigo-100 text-indigo-700 rounded-md">
                  AI
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden md:block">
                National Skill Matching and MSME Workforce Platform
              </p>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-600">
            <a href="#how-it-works" className="hover:text-slate-900 transition-colors">How It Works</a>
            <a href="#for-candidates" className="hover:text-slate-900 transition-colors">For Job Seekers</a>
            <a href="#for-msmes" className="hover:text-slate-900 transition-colors">For MSMEs</a>
            <a href="#workforce-intel" className="hover:text-slate-900 transition-colors">National Intelligence</a>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => loginAsRole("candidate")}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
            >
              Launch Platform
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-12 pb-16 md:py-20 overflow-hidden bg-gradient-to-b from-slate-50/80 via-white to-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-6 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>AI-Driven National Workforce Architecture</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-950 tracking-tight max-w-4xl mx-auto leading-tight sm:leading-none">
            Turn Skills Into <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-700 to-sky-600">Opportunities</span>.
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            An intelligent national workforce platform that verifies skills, identifies gaps, recommends personalized upskilling, and connects youth with MSMEs looking for real capabilities.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => loginAsRole("candidate")}
              className="w-full sm:w-auto px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 group"
            >
              <span>Find My Opportunities</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>

            <button
              onClick={() => loginAsRole("employer")}
              className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm rounded-xl border border-slate-300 shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <Building2 className="w-4 h-4 text-slate-600" />
              <span>Hire Smarter for MSMEs</span>
            </button>

            <button
              onClick={() => loginAsRole("admin")}
              className="w-full sm:w-auto px-5 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-slate-600" />
              <span>Workforce Admin Desk</span>
            </button>
          </div>

          {/* Core USP Banner */}
          <div className="mt-12 max-w-3xl mx-auto p-4 rounded-2xl bg-indigo-950 text-white shadow-xl flex items-center gap-4 text-left border border-indigo-900/60">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] uppercase font-bold text-indigo-300 tracking-wider">Core Breakthrough Paradigm</p>
              <p className="text-sm sm:text-base font-semibold text-white mt-0.5">
                “Match people by verified skills, potential, and growth — not just resumes.”
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-12 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((s, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 text-left">
                <div className="text-2xl sm:text-3xl font-extrabold text-indigo-900 tracking-tight">{s.value}</div>
                <div className="text-xs sm:text-sm font-bold text-slate-900 mt-1">{s.label}</div>
                <div className="text-[11px] text-slate-500 mt-0.5 leading-normal">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section id="how-it-works" className="py-16 bg-slate-50/60 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-200/70 text-slate-700 text-xs font-semibold mb-3">
            <span>Seamless 6-Step National Pipeline</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-950 tracking-tight">
            How WorkNexus AI Bridges the Talent Gap
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto mt-2">
            A comprehensive, transparent cycle built to upgrade youth employability and empower Indian MSMEs with productive talent.
          </p>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-left">
            {workflowSteps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={idx} className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 shadow-2xs hover:shadow-sm transition-all group">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-extrabold text-slate-300 group-hover:text-indigo-600 transition-colors font-mono">
                      {step.num}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{step.title}</h3>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Persona Cards */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-950 tracking-tight">
              Tailored for Every Stakeholder
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto mt-2">
              Empowering job seekers, driving MSME competitiveness, and equipping government policymakers with real-time labor data.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Job Seekers */}
            <div id="for-candidates" className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-indigo-300 transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-4">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">For Job Seekers & Youth</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Stand out with verified capabilities rather than pedigree or generic resumes.
                </p>
                <ul className="mt-4 space-y-2 text-xs text-slate-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>AI Technical & Practical Skill Assessments</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Automated Skill Gap & Readiness Scoring</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>4-Week Actionable Learning Roadmaps</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Explainable AI Job Matches (e.g. 92% Match)</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => loginAsRole("candidate")}
                className="mt-6 w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Enter as Candidate</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Card 2: MSMEs */}
            <div id="for-msmes" className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-sky-300 transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center mb-4">
                  <Building2 className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">For MSMEs & Startups</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Eliminate hiring friction with pre-verified skill transcripts and talent ranking.
                </p>
                <ul className="mt-4 space-y-2 text-xs text-slate-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Pre-verified practical skills (No fake resumes)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Multi-factor AI ranking with explainability</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Side-by-side candidate comparison matrix</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Regional talent market supply & wage benchmarks</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => loginAsRole("employer")}
                className="mt-6 w-full py-2.5 bg-sky-700 hover:bg-sky-800 text-white rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Enter as MSME Employer</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Card 3: Workforce Administrators */}
            <div id="workforce-intel" className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-300 transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">For Workforce Administrators</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Real-time regional intelligence to guide technical education policy and funding.
                </p>
                <ul className="mt-4 space-y-2 text-xs text-slate-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>State-wise regional skill deficit mapping</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Emerging MSME industrial demand signals</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Polytechnic & vocational curriculum alignment</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>AI-generated national skill policy recommendations</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => loginAsRole("admin")}
                className="mt-6 w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Enter as Admin</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-slate-950 text-slate-400 py-10 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-800/80">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                WN
              </div>
              <div>
                <span className="text-sm font-bold text-white tracking-tight">WorkNexus AI</span>
                <p className="text-xs text-slate-400">Connecting Skills. Creating Opportunities.</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <button onClick={() => setIsDemoModalOpen(true)} className="text-amber-300 hover:underline">
                Hackathon Demo Flow
              </button>
              <span>•</span>
              <button onClick={() => loginAsRole("candidate")} className="text-slate-300 hover:text-white">
                Candidate Portal
              </button>
              <span>•</span>
              <button onClick={() => loginAsRole("employer")} className="text-slate-300 hover:text-white">
                MSME Portal
              </button>
              <span>•</span>
              <button onClick={() => loginAsRole("admin")} className="text-slate-300 hover:text-white">
                Admin Intelligence
              </button>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
            <p>© 2025 WorkNexus AI — Indian National Workforce Architecture Prototype.</p>
            <p>Designed for Hackathon Final Evaluation • Powered by Gemini AI</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
