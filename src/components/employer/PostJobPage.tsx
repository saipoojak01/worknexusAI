import React, { useState } from "react";
import {
  PlusCircle,
  Sparkles,
  Layers,
  CheckCircle2,
  Trash2,
  Plus,
  ArrowRight,
  ShieldCheck,
  Building2,
  Briefcase,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { JobPosting, SkillRequirement } from "../../types";

export const PostJobPage: React.FC = () => {
  const { addJob, setActiveTab } = useApp();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Software Engineering");
  const [jobType, setJobType] = useState<"Full-time" | "Part-time" | "Contract" | "Internship" | "Apprenticeship">("Full-time");
  const [workMode, setWorkMode] = useState<"On-site" | "Hybrid" | "Remote">("Hybrid");
  const [location, setLocation] = useState("Coimbatore, Tamil Nadu");
  const [vacancies, setVacancies] = useState(2);
  const [minExp, setMinExp] = useState(0);
  const [salaryRange, setSalaryRange] = useState("₹3.5 - ₹5.5 LPA");
  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState<SkillRequirement[]>([
    { skill: "Java", minScore: 75, priority: "High", weight: 4 },
    { skill: "SQL", minScore: 70, priority: "High", weight: 3 },
    { skill: "Spring Boot", minScore: 65, priority: "Medium", weight: 2 },
  ]);

  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillMinScore, setNewSkillMinScore] = useState(70);
  const [newSkillPriority, setNewSkillPriority] = useState<"High" | "Medium" | "Low">("High");

  const handleAddSkill = () => {
    if (!newSkillName.trim()) return;
    setSkills((prev) => [
      ...prev,
      {
        skill: newSkillName.trim(),
        minScore: newSkillMinScore,
        priority: newSkillPriority,
        weight: newSkillPriority === "High" ? 4 : newSkillPriority === "Medium" ? 2 : 1,
      },
    ]);
    setNewSkillName("");
  };

  const handleRemoveSkill = (index: number) => {
    setSkills((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAutoGenerateSkills = () => {
    if (title.toLowerCase().includes("frontend") || title.toLowerCase().includes("react")) {
      setSkills([
        { skill: "React", minScore: 80, priority: "High", weight: 4 },
        { skill: "TypeScript", minScore: 70, priority: "High", weight: 3 },
        { skill: "Tailwind CSS", minScore: 75, priority: "Medium", weight: 2 },
        { skill: "Git", minScore: 65, priority: "Low", weight: 1 },
      ]);
      setDescription(
        "Seeking an agile Frontend Developer to build clean, responsive client portals for our manufacturing supply chain platform. Must be proficient in component-driven development and modern state management."
      );
    } else if (title.toLowerCase().includes("data") || title.toLowerCase().includes("analyst")) {
      setSkills([
        { skill: "SQL", minScore: 85, priority: "High", weight: 4 },
        { skill: "Python", minScore: 75, priority: "High", weight: 3 },
        { skill: "Power BI", minScore: 70, priority: "Medium", weight: 2 },
        { skill: "Excel", minScore: 80, priority: "Low", weight: 1 },
      ]);
      setDescription(
        "Looking for a Data Analyst to inspect MSME shop-floor production logs, generate executive yield dashboards, and support predictive maintenance modeling."
      );
    } else {
      setSkills([
        { skill: "Java", minScore: 80, priority: "High", weight: 4 },
        { skill: "SQL", minScore: 75, priority: "High", weight: 3 },
        { skill: "Spring Boot", minScore: 70, priority: "High", weight: 3 },
        { skill: "REST APIs", minScore: 70, priority: "Medium", weight: 2 },
        { skill: "AWS", minScore: 60, priority: "Low", weight: 1 },
      ]);
      setDescription(
        "We are looking for an ambitious Junior Java Backend Developer to build scalable REST microservices for our MSME enterprise resource platform. Hands-on coding and database proficiency required."
      );
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || skills.length === 0) return;

    addJob({
      companyId: "msme-1",
      companyName: "TechCraft Solutions Pvt Ltd",
      companyLogo: "https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=100&auto=format&fit=crop&q=80",
      title: title.trim(),
      category,
      jobType,
      workMode,
      location,
      vacancies,
      salaryRange,
      minExperienceYears: minExp,
      description: description || "Exciting opportunity for verified talent to join our growing MSME engineering team.",
      requiredSkills: skills,
      isActive: true,
      educationRequired: "B.Tech / B.E. in Computer Science, IT, or equivalent MCA/BCA",
    });

    setActiveTab("my-jobs");
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Post an MSME Vacancy
          </h1>
          <span className="px-2 py-0.5 text-[10px] font-semibold bg-sky-50 text-sky-700 border border-sky-200 rounded-md">
            AI Skill Weighted
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Specify role parameters and structured competency weights to enable precision candidate matching
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Details Card */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-sky-700" />
            <span>Job Role Information</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700">Job Title</label>
                <button
                  type="button"
                  onClick={handleAutoGenerateSkills}
                  className="text-xs font-semibold text-sky-700 hover:text-sky-900 flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Auto-Fill Standard MSME Skills</span>
                </button>
              </div>
              <input
                type="text"
                placeholder="e.g., Junior Java Backend Developer, React Frontend Engineer"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              >
                <option value="Software Engineering">Software Engineering</option>
                <option value="Data & Analytics">Data & Analytics</option>
                <option value="Cloud & DevOps">Cloud & DevOps</option>
                <option value="Product & Design">Product & Design</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Job Type</label>
              <select
                value={jobType}
                onChange={(e) => setJobType(e.target.value as any)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              >
                <option value="Full-time">Full-time</option>
                <option value="Internship">Internship</option>
                <option value="Apprenticeship">Apprenticeship</option>
                <option value="Contract">Contract</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Work Mode</label>
              <select
                value={workMode}
                onChange={(e) => setWorkMode(e.target.value as any)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              >
                <option value="On-site">On-site</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Remote">Remote</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Location / Cluster</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Salary Range</label>
              <input
                type="text"
                value={salaryRange}
                onChange={(e) => setSalaryRange(e.target.value)}
                placeholder="e.g., ₹4.0 - ₹6.0 LPA"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Minimum Experience (Years)
              </label>
              <input
                type="number"
                min="0"
                max="10"
                value={minExp}
                onChange={(e) => setMinExp(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Job Description & Responsibilities
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Outline day-to-day responsibilities, technologies used, and team culture..."
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
            />
          </div>
        </div>

        {/* Structured Skill Weighting Profile Builder */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-sky-700" />
                <span>Structured Skill Weighting Profile</span>
              </h3>
              <p className="text-xs text-slate-500">
                Skills specified here drive the 6D candidate matching algorithm
              </p>
            </div>
          </div>

          {/* Current Skills List */}
          <div className="space-y-2">
            {skills.map((s, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="font-bold text-slate-900">{s.skill}</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      s.priority === "High"
                        ? "bg-rose-50 text-rose-700 border border-rose-200"
                        : s.priority === "Medium"
                        ? "bg-amber-50 text-amber-700 border border-amber-200"
                        : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {s.priority} Priority (Weight: {s.weight}x)
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-slate-500">
                    Min Required: <strong className="text-slate-800">{s.minScore}%</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(idx)}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded-md transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add Skill Row */}
          <div className="p-3.5 rounded-xl bg-sky-50/50 border border-sky-100 flex flex-col sm:flex-row items-center gap-2">
            <input
              type="text"
              placeholder="Skill (e.g., Docker, Spring Boot)"
              value={newSkillName}
              onChange={(e) => setNewSkillName(e.target.value)}
              className="flex-1 w-full px-3 py-1.5 text-xs border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-sky-500/20"
            />
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={newSkillPriority}
                onChange={(e) => setNewSkillPriority(e.target.value as any)}
                className="px-2 py-1.5 text-xs border border-slate-200 rounded-xl bg-white"
              >
                <option value="High">High Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="Low">Low Priority</option>
              </select>

              <div className="flex items-center gap-1 text-xs text-slate-600 shrink-0">
                <span>Min:</span>
                <input
                  type="number"
                  min="40"
                  max="100"
                  value={newSkillMinScore}
                  onChange={(e) => setNewSkillMinScore(Number(e.target.value))}
                  className="w-14 px-1.5 py-1 text-xs border border-slate-200 rounded-lg bg-white"
                />
                <span>%</span>
              </div>

              <button
                type="button"
                onClick={handleAddSkill}
                className="px-3 py-1.5 bg-sky-700 hover:bg-sky-800 text-white rounded-xl text-xs font-semibold shrink-0"
              >
                + Add
              </button>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => setActiveTab("my-jobs")}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 bg-sky-700 hover:bg-sky-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-2"
          >
            <span>Publish MSME Vacancy</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
