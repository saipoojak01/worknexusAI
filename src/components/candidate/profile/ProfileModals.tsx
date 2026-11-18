import React, { useState, useEffect } from "react";
import { X, Plus, Trash2, Save, Calendar, Building, Award, Code, BookOpen } from "lucide-react";
import {
  CandidateEducation,
  CandidateExperience,
  CandidateProject,
  CandidateCertification,
  CandidateAchievement,
  SkillItem,
  CandidateLearningSkill,
} from "../../../types";

// ================= EDUCATION MODAL =================
interface EducationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (education: CandidateEducation) => void;
  initialData?: CandidateEducation | null;
}

export const EducationModal: React.FC<EducationModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [degree, setDegree] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [institution, setInstitution] = useState("");
  const [university, setUniversity] = useState("");
  const [startYear, setStartYear] = useState("");
  const [endYear, setEndYear] = useState("");
  const [score, setScore] = useState("");
  const [coursework, setCoursework] = useState("");

  useEffect(() => {
    if (initialData) {
      setDegree(initialData.degree || "");
      setSpecialization(initialData.specialization || "");
      setInstitution(initialData.institution || "");
      setUniversity(initialData.university || "");
      setStartYear(initialData.startYear || "");
      setEndYear(initialData.endYear || "");
      setScore(initialData.score || "");
      setCoursework(initialData.coursework || "");
    } else {
      setDegree("");
      setSpecialization("");
      setInstitution("");
      setUniversity("");
      setStartYear("2020");
      setEndYear("2024");
      setScore("");
      setCoursework("");
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!degree || !institution) return;
    onSave({
      id: initialData?.id || `edu-${Date.now()}`,
      degree,
      specialization,
      institution,
      university,
      startYear,
      endYear,
      score,
      coursework,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <h3 className="text-base font-bold text-slate-900">
            {initialData ? "Edit Qualification" : "Add Education / Qualification"}
          </h3>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Degree / Qualification *</label>
              <input
                type="text"
                placeholder="e.g. B.Tech Computer Science"
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                required
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Field / Specialization</label>
              <input
                type="text"
                placeholder="e.g. Information Technology"
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">College / Institution *</label>
            <input
              type="text"
              placeholder="e.g. Osmania University College of Engineering"
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
              required
              className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Affiliated University / Board</label>
            <input
              type="text"
              placeholder="e.g. Osmania University / JNTU / AICTE"
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Start Year</label>
              <input
                type="text"
                placeholder="2020"
                value={startYear}
                onChange={(e) => setStartYear(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">End / Passing Year</label>
              <input
                type="text"
                placeholder="2024"
                value={endYear}
                onChange={(e) => setEndYear(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Score (CGPA / %)</label>
              <input
                type="text"
                placeholder="e.g. 8.4 CGPA"
                value={score}
                onChange={(e) => setScore(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Qualification</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ================= EXPERIENCE MODAL =================
interface ExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (exp: CandidateExperience) => void;
  initialData?: CandidateExperience | null;
}

export const ExperienceModal: React.FC<ExperienceModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [employmentType, setEmploymentType] = useState<CandidateExperience["employmentType"]>("Full-time");
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentlyWorking, setCurrentlyWorking] = useState(false);
  const [responsibilities, setResponsibilities] = useState("");
  const [achievements, setAchievements] = useState("");

  useEffect(() => {
    if (initialData) {
      setJobTitle(initialData.jobTitle || "");
      setCompanyName(initialData.companyName || "");
      setEmploymentType(initialData.employmentType || "Full-time");
      setLocation(initialData.location || "");
      setStartDate(initialData.startDate || "");
      setEndDate(initialData.endDate || "");
      setCurrentlyWorking(initialData.currentlyWorking || false);
      setResponsibilities(initialData.responsibilities || "");
      setAchievements(initialData.achievements || "");
    } else {
      setJobTitle("");
      setCompanyName("");
      setEmploymentType("Full-time");
      setLocation("");
      setStartDate("");
      setEndDate("");
      setCurrentlyWorking(false);
      setResponsibilities("");
      setAchievements("");
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobTitle || !companyName) return;
    onSave({
      id: initialData?.id || `exp-${Date.now()}`,
      jobTitle,
      companyName,
      employmentType,
      location,
      startDate,
      endDate: currentlyWorking ? "Present" : endDate,
      currentlyWorking,
      responsibilities,
      achievements,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <h3 className="text-base font-bold text-slate-900">
            {initialData ? "Edit Work Experience" : "Add Work Experience"}
          </h3>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Job Title *</label>
              <input
                type="text"
                placeholder="e.g. Junior Backend Developer"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                required
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Company / Organization *</label>
              <input
                type="text"
                placeholder="e.g. Apex Precision Systems"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Employment Type</label>
              <select
                value={employmentType}
                onChange={(e) => setEmploymentType(e.target.value as any)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                <option value="Full-time">Full-time</option>
                <option value="Internship">Internship</option>
                <option value="Contract">Contract</option>
                <option value="Part-time">Part-time</option>
              </select>
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Location & Work Mode</label>
              <input
                type="text"
                placeholder="e.g. Hyderabad, Telangana (Hybrid)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Start Date</label>
              <input
                type="text"
                placeholder="e.g. Jun 2023"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">End Date</label>
              <input
                type="text"
                placeholder="e.g. Dec 2023 or Present"
                disabled={currentlyWorking}
                value={currentlyWorking ? "Present" : endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 disabled:opacity-50"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="currentlyWorking"
              checked={currentlyWorking}
              onChange={(e) => setCurrentlyWorking(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="currentlyWorking" className="text-slate-700 font-medium">
              I currently work in this role
            </label>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Responsibilities & Impact</label>
            <textarea
              rows={2}
              placeholder="e.g. Developed REST microservices with Spring Boot, optimized SQL queries by 35%..."
              value={responsibilities}
              onChange={(e) => setResponsibilities(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Key Achievements</label>
            <input
              type="text"
              placeholder="e.g. Received Employee of the Quarter for 99.9% API uptime"
              value={achievements}
              onChange={(e) => setAchievements(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Experience</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ================= PROJECT MODAL =================
interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (project: CandidateProject) => void;
  initialData?: CandidateProject | null;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [techInput, setTechInput] = useState("");
  const [role, setRole] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [liveDemoUrl, setLiveDemoUrl] = useState("");

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setDescription(initialData.description || "");
      setTechInput(initialData.technologies?.join(", ") || "");
      setRole(initialData.role || "");
      setGithubUrl(initialData.githubUrl || "");
      setLiveDemoUrl(initialData.liveDemoUrl || "");
    } else {
      setName("");
      setDescription("");
      setTechInput("");
      setRole("Lead Developer");
      setGithubUrl("");
      setLiveDemoUrl("");
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description) return;
    const technologies = techInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    onSave({
      id: initialData?.id || `proj-${Date.now()}`,
      name,
      description,
      technologies: technologies.length ? technologies : ["Java", "Spring Boot", "React"],
      role,
      githubUrl,
      liveDemoUrl,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <h3 className="text-base font-bold text-slate-900">
            {initialData ? "Edit Project" : "Add Technical Project"}
          </h3>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Project Title *</label>
            <input
              type="text"
              placeholder="e.g. Distributed Warehouse Inventory Engine"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Role / Contribution</label>
            <input
              type="text"
              placeholder="e.g. Backend Lead / Full Stack Developer"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Description & Problem Solved *</label>
            <textarea
              rows={3}
              placeholder="Built microservices processing 10,000 requests/sec with Redis caching..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Tech Stack (Comma-separated)
            </label>
            <input
              type="text"
              placeholder="e.g. Java, Spring Boot, PostgreSQL, Docker, Redis"
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">GitHub Repo URL</label>
              <input
                type="url"
                placeholder="https://github.com/username/project"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Live Demo / Deployment URL</label>
              <input
                type="url"
                placeholder="https://myproject.app"
                value={liveDemoUrl}
                onChange={(e) => setLiveDemoUrl(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Project</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ================= CERTIFICATION MODAL =================
interface CertificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (cert: CandidateCertification) => void;
  initialData?: CandidateCertification | null;
}

export const CertificationModal: React.FC<CertificationModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [name, setName] = useState("");
  const [issuingOrg, setIssuingOrg] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [credentialId, setCredentialId] = useState("");
  const [credentialUrl, setCredentialUrl] = useState("");

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setIssuingOrg(initialData.issuingOrg || "");
      setIssueDate(initialData.issueDate || "");
      setCredentialId(initialData.credentialId || "");
      setCredentialUrl(initialData.credentialUrl || "");
    } else {
      setName("");
      setIssuingOrg("");
      setIssueDate("");
      setCredentialId("");
      setCredentialUrl("");
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !issuingOrg) return;
    onSave({
      id: initialData?.id || `cert-${Date.now()}`,
      name,
      issuingOrg,
      issueDate: issueDate || new Date().toISOString().split("T")[0],
      credentialId,
      credentialUrl,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <h3 className="text-base font-bold text-slate-900">
            {initialData ? "Edit Certification" : "Add Certification"}
          </h3>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Certification Name *</label>
            <input
              type="text"
              placeholder="e.g. AWS Certified Cloud Practitioner / Oracle Java SE Certified"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Issuing Organization *</label>
            <input
              type="text"
              placeholder="e.g. Amazon Web Services / Oracle / NSDC / NPTEL"
              value={issuingOrg}
              onChange={(e) => setIssuingOrg(e.target.value)}
              required
              className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Issue Date</label>
              <input
                type="text"
                placeholder="e.g. May 2023"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Credential ID</label>
              <input
                type="text"
                placeholder="e.g. AWS-CCP-92841"
                value={credentialId}
                onChange={(e) => setCredentialId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Verification URL</label>
            <input
              type="url"
              placeholder="https://credly.com/your-badge"
              value={credentialUrl}
              onChange={(e) => setCredentialUrl(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Certification</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ================= ACHIEVEMENT MODAL =================
interface AchievementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (achieve: CandidateAchievement) => void;
  initialData?: CandidateAchievement | null;
}

export const AchievementModal: React.FC<AchievementModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<CandidateAchievement["category"]>("Hackathon");
  const [organization, setOrganization] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setCategory(initialData.category || "Hackathon");
      setOrganization(initialData.organization || "");
      setDate(initialData.date || "");
      setDescription(initialData.description || "");
      setUrl(initialData.url || "");
    } else {
      setTitle("");
      setCategory("Hackathon");
      setOrganization("");
      setDate("");
      setDescription("");
      setUrl("");
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !organization) return;
    onSave({
      id: initialData?.id || `ach-${Date.now()}`,
      title,
      category,
      organization,
      date: date || new Date().toISOString().split("T")[0],
      description,
      url,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <h3 className="text-base font-bold text-slate-900">
            {initialData ? "Edit Achievement" : "Add Achievement & Activity"}
          </h3>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Achievement Title *</label>
            <input
              type="text"
              placeholder="e.g. 1st Place - Smart India Hackathon State Finals"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                <option value="Hackathon">Hackathon</option>
                <option value="Award">Award</option>
                <option value="Competition">Competition</option>
                <option value="Publication">Publication / Research</option>
                <option value="Leadership">Leadership & Clubs</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Organizing Entity *</label>
              <input
                type="text"
                placeholder="e.g. Ministry of Education / IEEE"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                required
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Date</label>
              <input
                type="text"
                placeholder="e.g. Nov 2023"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Verification / Certificate URL</label>
              <input
                type="url"
                placeholder="https://drive.google.com/..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Description & Key Highlights</label>
            <textarea
              rows={2}
              placeholder="Built an automated GST audit tool for rural MSMEs chosen from over 150 college teams..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Achievement</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
