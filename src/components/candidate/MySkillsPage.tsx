import React, { useState } from "react";
import {
  Award,
  Plus,
  CheckCircle2,
  FileCheck2,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Search,
  Filter,
  Layers,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { CandidateSkill } from "../../types";

export const MySkillsPage: React.FC = () => {
  const { currentCandidate, updateCandidateProfile, setActiveTab } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New skill form state
  const [newSkillName, setNewSkillName] = useState("");
  const [newCategory, setNewCategory] = useState<"Frontend" | "Backend" | "Database" | "Cloud" | "Tools">("Backend");
  const [newScore, setNewScore] = useState(75);
  const [newEvidence, setNewEvidence] = useState("");

  const categories = ["All", "Frontend", "Backend", "Database", "Cloud", "Tools"];

  const filteredSkills = currentCandidate.skills.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === "All" || s.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    const newSkill: CandidateSkill = {
      id: `sk-${Date.now()}`,
      name: newSkillName.trim(),
      category: newCategory,
      score: newScore,
      verificationStatus: newEvidence ? "Project Verified" : "Not Verified",
      projectEvidence: newEvidence.trim() || undefined,
    };

    const updatedSkills = [...currentCandidate.skills, newSkill];
    const avgScore = Math.round(
      updatedSkills.reduce((acc, s) => acc + s.score, 0) / updatedSkills.length
    );
    const verifiedCount = updatedSkills.filter(
      (s) => s.verificationStatus === "Verified" || s.verificationStatus === "Assessment Verified"
    ).length;

    updateCandidateProfile({
      skills: updatedSkills,
      overallSkillScore: avgScore,
      verifiedSkillsCount: verifiedCount,
    });

    setNewSkillName("");
    setNewEvidence("");
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Verified Skill Transcript
            </h1>
            <span className="px-2 py-0.5 text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-md">
              National Standard
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Standardized technical competencies certified through assessments and practical code evaluation
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("assessments")}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
          >
            <FileCheck2 className="w-4 h-4" />
            <span>Take Skill Assessment</span>
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold shadow-2xs transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Skill / Evidence</span>
          </button>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium">Total Competencies Mapped</span>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">
            {currentCandidate.skills.length}
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">Categorized across 5 technical disciplines</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium">Platform & Assessment Verified</span>
          <div className="text-2xl font-extrabold text-emerald-600 mt-1">
            {currentCandidate.verifiedSkillsCount}
          </div>
          <p className="text-[11px] text-emerald-700 mt-0.5">High credibility score for MSME recruiters</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium">Weighted Competency Average</span>
          <div className="text-2xl font-extrabold text-indigo-600 mt-1">
            {currentCandidate.overallSkillScore}%
          </div>
          <p className="text-[11px] text-indigo-700 mt-0.5">Qualifies for Junior Backend & Full Stack</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search skill (e.g., Java, SQL)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors whitespace-nowrap ${
                selectedCategory === cat
                  ? "bg-slate-900 text-white font-semibold"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSkills.map((skill) => {
          const isVerified =
            skill.verificationStatus === "Verified" ||
            skill.verificationStatus === "Assessment Verified";
          return (
            <div
              key={skill.id}
              className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-indigo-200 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {skill.category}
                    </span>
                    <h3 className="text-base font-bold text-slate-900">{skill.name}</h3>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      isVerified
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : skill.verificationStatus === "Project Verified"
                        ? "bg-sky-50 text-sky-700 border-sky-200"
                        : "bg-slate-100 text-slate-600 border-slate-200"
                    }`}
                  >
                    {skill.verificationStatus}
                  </span>
                </div>

                {/* Score Meter */}
                <div className="mt-4 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Demonstrated Proficiency</span>
                    <span className="font-extrabold text-slate-900">{skill.score}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        skill.score >= 80
                          ? "bg-emerald-500"
                          : skill.score >= 65
                          ? "bg-indigo-600"
                          : "bg-amber-500"
                      }`}
                      style={{ width: `${skill.score}%` }}
                    />
                  </div>
                </div>

                {/* Details */}
                <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                  {skill.assessmentScore && (
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">Benchmark Score:</span>
                      <span className="font-semibold text-slate-800">{skill.assessmentScore}%</span>
                    </div>
                  )}
                  {skill.verifiedDate && (
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">Verification Date:</span>
                      <span className="font-medium text-slate-700">{skill.verifiedDate}</span>
                    </div>
                  )}
                  {skill.projectEvidence && skill.projectEvidence.length > 0 && (
                    <div className="mt-2 text-[11px]">
                      <span className="text-slate-400 block mb-0.5">Project Evidence:</span>
                      <span className="font-medium text-slate-700 bg-slate-50 p-1.5 rounded-md block border border-slate-200/60 line-clamp-1">
                        {skill.projectEvidence[0]}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                {!isVerified ? (
                  <button
                    onClick={() => setActiveTab("assessments")}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                  >
                    <span>Take Assessment to Verify</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                ) : (
                  <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Verified for MSME Matching</span>
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Skill Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6 animate-in zoom-in-95 duration-150">
            <h3 className="font-bold text-base text-slate-900">Add Skill or Project Evidence</h3>
            <p className="text-xs text-slate-500 mt-1">
              Add a new skill to your profile. You can verify it immediately through an assessment.
            </p>

            <form onSubmit={handleAddSkill} className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">Skill Name</label>
                <input
                  type="text"
                  placeholder="e.g., Redis, Next.js, Kubernetes"
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50"
                >
                  <option value="Backend">Backend</option>
                  <option value="Frontend">Frontend</option>
                  <option value="Database">Database</option>
                  <option value="Cloud">Cloud</option>
                  <option value="Tools">Tools</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-medium text-slate-700 mb-1">
                  <span>Self-Assessed Score</span>
                  <span className="font-bold text-indigo-600">{newScore}%</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="100"
                  value={newScore}
                  onChange={(e) => setNewScore(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">
                  Project Evidence / Repository Link (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g., github.com/saipooja/order-api or Project Title"
                  value={newEvidence}
                  onChange={(e) => setNewEvidence(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition-colors"
                >
                  Save Skill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
