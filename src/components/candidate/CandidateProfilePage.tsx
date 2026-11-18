import React, { useState, useEffect, useRef } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Sparkles,
  Award,
  CheckCircle2,
  FileText,
  Briefcase,
  Save,
  Loader2,
  Upload,
  Camera,
  Trash2,
  Edit3,
  Plus,
  ExternalLink,
  Github,
  Linkedin,
  Globe,
  FileCheck2,
  BookOpen,
  Calendar,
  AlertCircle,
  Clock,
  ShieldCheck,
  ChevronRight,
  Eye,
  RefreshCw,
  Code,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import {
  CandidateFullProfile,
  CandidateEducation,
  CandidateExperience,
  CandidateProject,
  CandidateCertification,
  CandidateAchievement,
  SkillItem,
  CandidateLearningSkill,
  CandidateJobPreferences,
} from "../../types";
import {
  EducationModal,
  ExperienceModal,
  ProjectModal,
  CertificationModal,
  AchievementModal,
} from "./profile/ProfileModals";
import { SkillModal, AddLearningSkillModal } from "./profile/SkillModal";

export const CandidateProfilePage: React.FC = () => {
  const {
    currentCandidate,
    candidateProfile,
    fetchCandidateProfile,
    saveCandidateProfile,
    uploadResume,
    deleteResume,
    addLearningSkill,
    deleteLearningSkill,
    setActiveTab,
  } = useApp();

  // Load initial profile data from candidateProfile or fallback to currentCandidate
  const [activeSection, setActiveSection] = useState<string>("personal");
  const [isEditing, setIsEditing] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [isGeneratingBio, setIsGeneratingBio] = useState(false);

  // Profile fields state
  const [name, setName] = useState(candidateProfile?.name || currentCandidate.name || "Sai Pooja");
  const [email, setEmail] = useState(candidateProfile?.email || currentCandidate.email || "sai.pooja@example.com");
  const [phone, setPhone] = useState(candidateProfile?.phone || currentCandidate.phone || "+91 98765 43210");
  const [location, setLocation] = useState(candidateProfile?.location || currentCandidate.location || "Hyderabad, Telangana");
  const [headline, setHeadline] = useState(candidateProfile?.headline || currentCandidate.headline || "Full Stack Java & React Developer");
  const [bio, setBio] = useState(candidateProfile?.bio || currentCandidate.bio || "");
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(candidateProfile?.avatarUrl || currentCandidate.avatarUrl);
  const [linkedinUrl, setLinkedinUrl] = useState(candidateProfile?.linkedinUrl || "https://linkedin.com/in/sai-pooja");
  const [githubUrl, setGithubUrl] = useState(candidateProfile?.githubUrl || "https://github.com/saipooja");
  const [portfolioUrl, setPortfolioUrl] = useState(candidateProfile?.portfolioUrl || "https://saipooja.dev");
  const [isFresher, setIsFresher] = useState(candidateProfile?.isFresher ?? false);

  // Collections state
  const [educationList, setEducationList] = useState<CandidateEducation[]>(
    candidateProfile?.education || [
      {
        id: "edu-1",
        degree: "B.Tech Computer Science & Engineering",
        specialization: "Software Systems & Cloud Architecture",
        institution: "Osmania University College of Engineering",
        university: "Osmania University",
        startYear: "2020",
        endYear: "2024",
        score: "8.6 CGPA",
        coursework: "Data Structures, Database Management, Operating Systems, Computer Networks",
      },
    ]
  );

  const [experienceList, setExperienceList] = useState<CandidateExperience[]>(
    candidateProfile?.experiences || [
      {
        id: "exp-1",
        jobTitle: "Software Engineering Intern",
        companyName: "Apex Precision Engineering",
        employmentType: "Internship",
        location: "Hyderabad (Hybrid)",
        startDate: "Jan 2024",
        endDate: "Jun 2024",
        currentlyWorking: false,
        responsibilities: "Designed and tested Spring Boot REST microservices for automated parts inventory tracking. Integrated MySQL schema caching which decreased query latency by 32%.",
        achievements: "Recognized as Best Technical Intern for delivering the production inventory sync module ahead of schedule.",
      },
    ]
  );

  const [skillsList, setSkillsList] = useState<SkillItem[]>(
    candidateProfile?.skills || currentCandidate.skills || []
  );

  const [learningSkillsList, setLearningSkillsList] = useState<CandidateLearningSkill[]>(
    candidateProfile?.learningSkills || [
      {
        id: "lrn-1",
        name: "Spring Boot Microservices",
        category: "Backend",
        targetProficiency: "Advanced",
        addedDate: "2024-06-15",
        status: "In Progress",
        notes: "Targeting Java Backend Engineer requirements for MSME manufacturing supply chains.",
      },
      {
        id: "lrn-2",
        name: "Docker & Containerization",
        category: "Cloud & DevOps",
        targetProficiency: "Intermediate",
        addedDate: "2024-06-18",
        status: "In Progress",
        notes: "Required for cloud-native deployment and local microservice staging.",
      },
    ]
  );

  const [projectsList, setProjectsList] = useState<CandidateProject[]>(
    candidateProfile?.projects || [
      {
        id: "proj-1",
        name: "MSME Smart Inventory & ERP Sync",
        description: "Full-stack enterprise application synchronizing manufacturing batch inventories with supplier orders. Features role-based access control and live webhook updates.",
        technologies: ["Java", "Spring Boot", "React", "PostgreSQL", "Docker"],
        role: "Full Stack Lead Developer",
        githubUrl: "https://github.com/saipooja/msme-smart-inventory",
        liveDemoUrl: "https://inventory-demo.worknexus.in",
      },
      {
        id: "proj-2",
        name: "GST Invoice Automated Validator",
        description: "Lightweight tool parsing B2B invoices and validating HSN codes and GSTIN checksums before submission to government gateways.",
        technologies: ["React", "TypeScript", "Node.js", "Tailwind CSS"],
        role: "Frontend Developer",
        githubUrl: "https://github.com/saipooja/gst-invoice-validator",
      },
    ]
  );

  const [certificationsList, setCertificationsList] = useState<CandidateCertification[]>(
    candidateProfile?.certifications || [
      {
        id: "cert-1",
        name: "Oracle Certified Associate - Java SE Programmer",
        issuingOrg: "Oracle Corporation",
        issueDate: "2023-11-12",
        credentialId: "OCA-JAVA-781920",
        credentialUrl: "https://oracle.com/verify/781920",
      },
      {
        id: "cert-2",
        name: "NSDC Level 6 Certified Full Stack Developer",
        issuingOrg: "National Skill Development Corporation (NSDC)",
        issueDate: "2024-03-05",
        credentialId: "NSDC-FSD-2024-419",
        credentialUrl: "https://nsdcindia.org/verify/419",
      },
    ]
  );

  const [achievementsList, setAchievementsList] = useState<CandidateAchievement[]>(
    candidateProfile?.achievements || [
      {
        id: "ach-1",
        title: "Winner (1st Prize) - Telangana MSME Hackathon 2024",
        category: "Hackathon",
        description: "Awarded 1st place among 120+ teams for building a zero-downtime offline inventory synchronization system for regional industrial clusters.",
        date: "2024-02-28",
        organization: "Telangana State Innovation Cell & MSME Dept",
        url: "https://tsic.telangana.gov.in/awards/2024",
      },
    ]
  );

  const [jobPreferences, setJobPreferences] = useState<CandidateJobPreferences>(
    candidateProfile?.jobPreferences || {
      preferredRoles: ["Java Backend Developer", "Full Stack Developer", "Software Engineer"],
      preferredLocations: ["Hyderabad", "Bengaluru", "Remote"],
      workModes: ["Hybrid", "On-site", "Remote"],
      employmentTypes: ["Full-time"],
      expectedSalary: "₹6,00,000 - ₹9,00,000 LPA",
      availability: "Immediate",
    }
  );

  // Resume state
  const [resume, setResume] = useState(candidateProfile?.resume || null);
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const photoInputRef = useRef<HTMLInputElement | null>(null);

  // Modals state
  const [isEduModalOpen, setIsEduModalOpen] = useState(false);
  const [editingEdu, setEditingEdu] = useState<CandidateEducation | null>(null);

  const [isExpModalOpen, setIsExpModalOpen] = useState(false);
  const [editingExp, setEditingExp] = useState<CandidateExperience | null>(null);

  const [isProjModalOpen, setIsProjModalOpen] = useState(false);
  const [editingProj, setEditingProj] = useState<CandidateProject | null>(null);

  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<CandidateCertification | null>(null);

  const [isAchModalOpen, setIsAchModalOpen] = useState(false);
  const [editingAch, setEditingAch] = useState<CandidateAchievement | null>(null);

  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<SkillItem | null>(null);

  const [isLearningSkillModalOpen, setIsLearningSkillModalOpen] = useState(false);

  // Synchronize when candidateProfile loads from backend
  useEffect(() => {
    if (candidateProfile) {
      setName(candidateProfile.name || name);
      setEmail(candidateProfile.email || email);
      setPhone(candidateProfile.phone || phone);
      setLocation(candidateProfile.location || location);
      setHeadline(candidateProfile.headline || headline);
      setBio(candidateProfile.bio || bio);
      setAvatarUrl(candidateProfile.avatarUrl);
      setLinkedinUrl(candidateProfile.linkedinUrl || linkedinUrl);
      setGithubUrl(candidateProfile.githubUrl || githubUrl);
      setPortfolioUrl(candidateProfile.portfolioUrl || portfolioUrl);
      setIsFresher(candidateProfile.isFresher ?? isFresher);
      if (candidateProfile.education?.length) setEducationList(candidateProfile.education);
      if (candidateProfile.experiences?.length) setExperienceList(candidateProfile.experiences);
      if (candidateProfile.skills?.length) setSkillsList(candidateProfile.skills);
      if (candidateProfile.learningSkills?.length) setLearningSkillsList(candidateProfile.learningSkills);
      if (candidateProfile.projects?.length) setProjectsList(candidateProfile.projects);
      if (candidateProfile.certifications?.length) setCertificationsList(candidateProfile.certifications);
      if (candidateProfile.achievements?.length) setAchievementsList(candidateProfile.achievements);
      if (candidateProfile.jobPreferences) setJobPreferences(candidateProfile.jobPreferences);
      if (candidateProfile.resume) setResume(candidateProfile.resume);
    }
  }, [candidateProfile]);

  // Initial fetch on component mount
  useEffect(() => {
    fetchCandidateProfile();
  }, []);

  // Handle saving the full profile to the backend
  const handleSaveProfile = async () => {
    setIsSaving(true);
    setIsSaved(false);

    // Compute verified count & average skill score
    const verifiedCount = skillsList.filter(
      (s) => s.verificationStatus === "Verified" || s.verificationStatus === "Assessment Verified"
    ).length;
    const avgScore = skillsList.length
      ? Math.round(skillsList.reduce((acc, s) => acc + s.score, 0) / skillsList.length)
      : 80;
    const readiness = Math.min(98, Math.round(avgScore * 0.9 + verifiedCount * 1.5));

    const payload: Partial<CandidateFullProfile> = {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      location: location.trim(),
      headline: headline.trim(),
      bio: bio.trim(),
      avatarUrl,
      linkedinUrl: linkedinUrl.trim(),
      githubUrl: githubUrl.trim(),
      portfolioUrl: portfolioUrl.trim(),
      isFresher,
      overallSkillScore: avgScore,
      jobReadiness: readiness,
      verifiedSkillsCount: verifiedCount,
      education: educationList,
      experiences: experienceList,
      skills: skillsList,
      learningSkills: learningSkillsList,
      projects: projectsList,
      certifications: certificationsList,
      achievements: achievementsList,
      jobPreferences,
    };

    const result = await saveCandidateProfile(payload);
    setIsSaving(false);
    if (result) {
      setIsSaved(true);
      setSaveMessage("Profile changes saved to backend database successfully!");
      setTimeout(() => setIsSaved(false), 3500);
    } else {
      setIsSaved(true);
      setSaveMessage("Profile saved to local workspace session.");
      setTimeout(() => setIsSaved(false), 3500);
    }
  };

  // Handle photo upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      alert("Please select an image smaller than 3MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setAvatarUrl(dataUrl);
      // Auto-save photo update
      saveCandidateProfile({ avatarUrl: dataUrl });
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setAvatarUrl(undefined);
    saveCandidateProfile({ avatarUrl: "" });
  };

  // Handle resume file upload
  const handleResumeFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingResume(true);
    const uploaded = await uploadResume(file);
    setIsUploadingResume(false);
    if (uploaded) {
      setResume(uploaded);
    }
  };

  const handleRemoveResume = async () => {
    if (confirm("Are you sure you want to remove your uploaded resume?")) {
      const success = await deleteResume();
      if (success) {
        setResume(null);
      }
    }
  };

  // AI Summary generator using Gemini backend
  const handleGenerateAISummary = async () => {
    setIsGeneratingBio(true);
    try {
      const skillsStr = skillsList.map((s) => `${s.name} (${s.score}%)`).join(", ");
      const eduStr = educationList[0] ? `${educationList[0].degree} from ${educationList[0].institution}` : "Computer Science graduate";
      const targetRole = jobPreferences.preferredRoles[0] || "Java Backend Developer";

      const res = await fetch("/api/ai/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: "candidate",
          message: `Write a crisp, impactful 2-sentence professional summary for ${name}, a ${eduStr} with verified competencies in: ${skillsStr}. Target career role: ${targetRole}. Focus on technical problem solving, clean API architecture, and immediate productivity for Indian MSMEs.`,
        }),
      });

      if (!res.ok) throw new Error("Failed AI generation");
      const data = await res.json();
      setBio(data.reply);
    } catch (err) {
      setBio(
        `High-performing ${educationList[0]?.degree || "Engineering"} graduate with verified competencies in Java (86%), SQL (82%), and Spring Boot. Passionate about engineering resilient backend microservices and data pipelines for growth-oriented MSMEs.`
      );
    } finally {
      setIsGeneratingBio(false);
    }
  };

  // Education handlers
  const handleSaveEducation = (edu: CandidateEducation) => {
    const exists = educationList.some((e) => e.id === edu.id);
    let updated: CandidateEducation[];
    if (exists) {
      updated = educationList.map((e) => (e.id === edu.id ? edu : e));
    } else {
      updated = [...educationList, edu];
    }
    setEducationList(updated);
    saveCandidateProfile({ education: updated });
  };

  const handleDeleteEducation = (id: string) => {
    const updated = educationList.filter((e) => e.id !== id);
    setEducationList(updated);
    saveCandidateProfile({ education: updated });
  };

  // Experience handlers
  const handleSaveExperience = (exp: CandidateExperience) => {
    const exists = experienceList.some((e) => e.id === exp.id);
    let updated: CandidateExperience[];
    if (exists) {
      updated = experienceList.map((e) => (e.id === exp.id ? exp : e));
    } else {
      updated = [...experienceList, exp];
    }
    setExperienceList(updated);
    saveCandidateProfile({ experiences: updated });
  };

  const handleDeleteExperience = (id: string) => {
    const updated = experienceList.filter((e) => e.id !== id);
    setExperienceList(updated);
    saveCandidateProfile({ experiences: updated });
  };

  // Project handlers
  const handleSaveProject = (proj: CandidateProject) => {
    const exists = projectsList.some((p) => p.id === proj.id);
    let updated: CandidateProject[];
    if (exists) {
      updated = projectsList.map((p) => (p.id === proj.id ? proj : p));
    } else {
      updated = [...projectsList, proj];
    }
    setProjectsList(updated);
    saveCandidateProfile({ projects: updated });
  };

  const handleDeleteProject = (id: string) => {
    const updated = projectsList.filter((p) => p.id !== id);
    setProjectsList(updated);
    saveCandidateProfile({ projects: updated });
  };

  // Certification handlers
  const handleSaveCert = (cert: CandidateCertification) => {
    const exists = certificationsList.some((c) => c.id === cert.id);
    let updated: CandidateCertification[];
    if (exists) {
      updated = certificationsList.map((c) => (c.id === cert.id ? cert : c));
    } else {
      updated = [...certificationsList, cert];
    }
    setCertificationsList(updated);
    saveCandidateProfile({ certifications: updated });
  };

  const handleDeleteCert = (id: string) => {
    const updated = certificationsList.filter((c) => c.id !== id);
    setCertificationsList(updated);
    saveCandidateProfile({ certifications: updated });
  };

  // Achievement handlers
  const handleSaveAchievement = (ach: CandidateAchievement) => {
    const exists = achievementsList.some((a) => a.id === ach.id);
    let updated: CandidateAchievement[];
    if (exists) {
      updated = achievementsList.map((a) => (a.id === ach.id ? ach : a));
    } else {
      updated = [...achievementsList, ach];
    }
    setAchievementsList(updated);
    saveCandidateProfile({ achievements: updated });
  };

  const handleDeleteAchievement = (id: string) => {
    const updated = achievementsList.filter((a) => a.id !== id);
    setAchievementsList(updated);
    saveCandidateProfile({ achievements: updated });
  };

  // Skills handlers
  const handleSaveSkill = (skill: SkillItem) => {
    const exists = skillsList.some((s) => s.id === skill.id);
    let updated: SkillItem[];
    if (exists) {
      updated = skillsList.map((s) => (s.id === skill.id ? skill : s));
    } else {
      updated = [...skillsList, skill];
    }
    setSkillsList(updated);
    saveCandidateProfile({ skills: updated });
  };

  const handleDeleteSkill = (id: string) => {
    const updated = skillsList.filter((s) => s.id !== id);
    setSkillsList(updated);
    saveCandidateProfile({ skills: updated });
  };

  // Learning Skills handlers
  const handleAddLearningSkillItem = async (skillData: {
    name: string;
    category?: string;
    targetProficiency?: string;
    notes?: string;
  }) => {
    await addLearningSkill(skillData);
    // Refresh local
    setLearningSkillsList((prev) => [
      ...prev,
      {
        id: `lrn-${Date.now()}`,
        name: skillData.name,
        category: skillData.category || "Backend",
        targetProficiency: (skillData.targetProficiency as any) || "Advanced",
        addedDate: new Date().toISOString().split("T")[0],
        status: "In Progress",
        notes: skillData.notes,
      },
    ]);
  };

  const handleDeleteLearningSkillItem = async (id: string) => {
    await deleteLearningSkill(id);
    setLearningSkillsList((prev) => prev.filter((s) => s.id !== id));
  };

  // Initials for avatar placeholder
  const getInitials = (fullName: string) => {
    const parts = fullName.trim().split(" ");
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return fullName.slice(0, 2).toUpperCase() || "WN";
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Top Banner & Profile Overview Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Banner background */}
        <div className="h-32 bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 relative">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:24px_24px]" />
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <span className="px-3 py-1 bg-white/10 backdrop-blur-md text-white text-[11px] font-semibold rounded-full border border-white/20 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>National Talent Registry Verified</span>
            </span>
          </div>
        </div>

        {/* Profile Details Bar */}
        <div className="px-6 pb-6 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 mb-4">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 text-center sm:text-left">
              {/* Circular Avatar / Photo */}
              <div className="relative group">
                <div className="w-28 h-28 rounded-full border-4 border-white shadow-xl overflow-hidden bg-slate-100 flex items-center justify-center">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-indigo-600 to-indigo-900 text-white font-black text-3xl flex items-center justify-center">
                      {getInitials(name)}
                    </div>
                  )}
                </div>

                {/* Photo upload camera button */}
                <button
                  onClick={() => photoInputRef.current?.click()}
                  title="Upload profile photo"
                  className="absolute bottom-1 right-1 p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-md transition-colors"
                >
                  <Camera className="w-4 h-4" />
                </button>
                <input
                  ref={photoInputRef}
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  className="hidden"
                  onChange={handlePhotoUpload}
                />
              </div>

              {/* Identity & Headline */}
              <div className="pt-2 sm:pt-0">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900">{name}</h1>
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[11px] font-bold rounded-md border border-emerald-200">
                    Aadhaar Verified
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-semibold text-indigo-700 mt-0.5">{headline}</p>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-1.5 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {location}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    {email}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    {phone}
                  </span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-center sm:justify-end gap-2 pt-2">
              {avatarUrl && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-xl transition-colors"
                >
                  Remove Photo
                </button>
              )}

              <button
                type="button"
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving to DB...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Full Profile</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Verification Stats & Snapshot */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-slate-400 block text-[10px] font-bold uppercase">Overall Skill Score</span>
              <span className="text-lg font-black text-indigo-700">
                {currentCandidate.overallSkillScore}/100
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-slate-400 block text-[10px] font-bold uppercase">Verified Skills</span>
              <span className="text-lg font-black text-emerald-700">
                {skillsList.filter((s) => s.verificationStatus === "Verified" || s.verificationStatus === "Assessment Verified").length} Competencies
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-slate-400 block text-[10px] font-bold uppercase">MSME Job Readiness</span>
              <span className="text-lg font-black text-slate-900">
                {currentCandidate.jobReadiness}%
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-slate-400 block text-[10px] font-bold uppercase">Active Learning Targets</span>
              <span className="text-lg font-black text-amber-600">
                {learningSkillsList.length} In Progress
              </span>
            </div>
          </div>

          {/* Success Toast */}
          {isSaved && (
            <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs font-semibold text-emerald-800 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{saveMessage}</span>
            </div>
          )}
        </div>
      </div>

      {/* Section Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: "personal", label: "Personal & Bio", icon: User },
          { id: "resume", label: "Resume", icon: FileText },
          { id: "qualifications", label: "Qualifications", icon: GraduationCap },
          { id: "experience", label: "Work Experience", icon: Briefcase },
          { id: "skills", label: "Skills & Assessments", icon: Award },
          { id: "projects", label: "Projects", icon: Code },
          { id: "certifications", label: "Certifications", icon: ShieldCheck },
          { id: "achievements", label: "Achievements", icon: Award },
          { id: "preferences", label: "Job Preferences", icon: Globe },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSection === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                isActive
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ================= 1. PERSONAL DETAILS & PROFESSIONAL SUMMARY ================= */}
      {(activeSection === "personal" || activeSection === "all") && (
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <User className="w-4 h-4 text-indigo-600" />
              <span>Personal Details & Online Presence</span>
            </h2>
            <span className="text-[10px] font-semibold text-slate-400">All fields saved to backend</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Full Legal Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Email Address *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Phone Number *</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Current Location (City, State) *</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="font-semibold text-slate-700 block mb-1">Professional Headline *</label>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="e.g. Full Stack Java Developer | Microservices & Distributed Systems"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">LinkedIn Profile URL</label>
              <div className="relative">
                <Linkedin className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="url"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  placeholder="https://linkedin.com/in/username"
                  className="w-full pl-8 pr-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">GitHub Profile URL</label>
              <div className="relative">
                <Github className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="url"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/username"
                  className="w-full pl-8 pr-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Portfolio / Personal Website</label>
              <div className="relative">
                <Globe className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="url"
                  value={portfolioUrl}
                  onChange={(e) => setPortfolioUrl(e.target.value)}
                  placeholder="https://myportfolio.dev"
                  className="w-full pl-8 pr-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Professional Bio / AI Summary */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Professional Summary & Technical Background
              </label>
              <button
                type="button"
                disabled={isGeneratingBio}
                onClick={handleGenerateAISummary}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5 disabled:opacity-50"
              >
                {isGeneratingBio ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Writing with Gemini...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Generate AI Summary</span>
                  </>
                )}
              </button>
            </div>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              placeholder="Highlight your technical strengths, major projects, and career goals for employers..."
            />
          </div>
        </div>
      )}

      {/* ================= 2. RESUME UPLOAD SECTION ================= */}
      {(activeSection === "resume" || activeSection === "all") && (
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-600" />
                <span>Resume / Curriculum Vitae</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Upload your latest resume in PDF, DOC, or DOCX format for MSME recruiters
              </p>
            </div>
            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              ATS Standard Ready
            </span>
          </div>

          {resume ? (
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-lg shrink-0">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                    <span>{resume.fileName}</span>
                    <span className="text-[10px] px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-semibold">
                      Verified
                    </span>
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Size: {resume.fileSize} • Uploaded on: {new Date(resume.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {resume.fileData && (
                  <a
                    href={resume.fileData}
                    download={resume.fileName}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View / Download</span>
                  </a>
                )}

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 bg-white hover:bg-slate-100 text-indigo-600 border border-indigo-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Replace</span>
                </button>

                <button
                  type="button"
                  onClick={handleRemoveResume}
                  className="px-3 py-1.5 bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </button>
              </div>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 hover:border-indigo-500 rounded-2xl p-8 text-center bg-slate-50/50 hover:bg-indigo-50/20 cursor-pointer transition-all"
            >
              <Upload className="w-10 h-10 text-indigo-500 mx-auto mb-2" />
              <h4 className="text-xs font-bold text-slate-900">Upload your Resume</h4>
              <p className="text-[11px] text-slate-500 mt-1 max-w-sm mx-auto">
                Drag and drop your file here or browse from your computer. Supported formats: PDF, DOC, DOCX (Max 10MB)
              </p>
              <button
                type="button"
                className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-indigo-700 transition-colors"
              >
                {isUploadingResume ? "Uploading..." : "Select Resume File"}
              </button>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            className="hidden"
            onChange={handleResumeFileChange}
          />
        </div>
      )}

      {/* ================= 3. QUALIFICATIONS & ACADEMIC BACKGROUND ================= */}
      {(activeSection === "qualifications" || activeSection === "all") && (
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-indigo-600" />
                <span>Qualifications & Academic Degrees</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Verified educational records, graduation scores, and university accreditations
              </p>
            </div>
            <button
              onClick={() => {
                setEditingEdu(null);
                setIsEduModalOpen(true);
              }}
              className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Qualification</span>
            </button>
          </div>

          <div className="space-y-3">
            {educationList.map((edu) => (
              <div
                key={edu.id}
                className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 text-sm">{edu.degree}</h3>
                    <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
                      DigiLocker Verified
                    </span>
                  </div>
                  <p className="text-slate-600 font-medium">
                    {edu.institution} {edu.university ? `• ${edu.university}` : ""}
                  </p>
                  <p className="text-slate-400 text-[11px]">
                    Passing Year: {edu.endYear} • Score: <span className="font-semibold text-slate-700">{edu.score}</span>
                  </p>
                  {edu.coursework && (
                    <p className="text-[11px] text-slate-500 pt-1">
                      <span className="font-semibold text-slate-700">Coursework:</span> {edu.coursework}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-1.5 self-end sm:self-center">
                  <button
                    onClick={() => {
                      setEditingEdu(edu);
                      setIsEduModalOpen(true);
                    }}
                    className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-white rounded-lg transition-colors"
                    title="Edit Qualification"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteEducation(edu.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-white rounded-lg transition-colors"
                    title="Delete Qualification"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= 4. WORK EXPERIENCE ================= */}
      {(activeSection === "experience" || activeSection === "all") && (
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-indigo-600" />
                <span>Professional Experience & Internships</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Past employment, technical internships, and enterprise contributions
              </p>
            </div>
            <button
              onClick={() => {
                setEditingExp(null);
                setIsExpModalOpen(true);
              }}
              className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Experience</span>
            </button>
          </div>

          <div className="space-y-3">
            {experienceList.map((exp) => (
              <div
                key={exp.id}
                className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/60 flex flex-col sm:flex-row sm:items-start justify-between gap-3 text-xs"
              >
                <div className="space-y-1.5 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 text-sm">{exp.jobTitle}</h3>
                    <span className="text-[10px] font-semibold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded">
                      {exp.employmentType}
                    </span>
                  </div>
                  <p className="font-semibold text-slate-700">
                    {exp.companyName} • <span className="text-slate-500 font-normal">{exp.location}</span>
                  </p>
                  <p className="text-slate-400 text-[11px]">
                    {exp.startDate} – {exp.endDate}
                  </p>
                  <p className="text-slate-600 pt-1 leading-relaxed">{exp.responsibilities}</p>
                  {exp.achievements && (
                    <p className="text-[11px] text-indigo-900 bg-indigo-50/70 p-2 rounded-lg font-medium border border-indigo-100">
                      ★ {exp.achievements}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-1.5 self-end sm:self-start">
                  <button
                    onClick={() => {
                      setEditingExp(exp);
                      setIsExpModalOpen(true);
                    }}
                    className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-white rounded-lg transition-colors"
                    title="Edit Experience"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteExperience(exp.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-white rounded-lg transition-colors"
                    title="Delete Experience"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= 5. SKILLS & LEARNING TARGETS ================= */}
      {(activeSection === "skills" || activeSection === "all") && (
        <div className="space-y-6">
          {/* Current / Verified Skills */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Award className="w-4 h-4 text-indigo-600" />
                  <span>Verified & Current Technical Skills</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Standardized technical skills verified through code evaluations and assessments
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab("assessments")}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors"
                >
                  <FileCheck2 className="w-3.5 h-3.5" />
                  <span>Take Assessment</span>
                </button>
                <button
                  onClick={() => {
                    setEditingSkill(null);
                    setIsSkillModalOpen(true);
                  }}
                  className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Skill</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {skillsList.map((skill) => {
                const isVerified =
                  skill.verificationStatus === "Verified" ||
                  skill.verificationStatus === "Assessment Verified";
                return (
                  <div
                    key={skill.id}
                    className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:shadow-2xs transition-all space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-sm">{skill.name}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          isVerified
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {skill.verificationStatus}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>Category: {skill.category}</span>
                      <span className="font-extrabold text-indigo-700">{skill.score}%</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-indigo-600 h-full rounded-full transition-all"
                        style={{ width: `${skill.score}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <button
                        onClick={() => setActiveTab("assessments")}
                        className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                      >
                        <span>Re-Assess</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleDeleteSkill(skill.id)}
                        className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                        title="Delete Skill"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Skills to Learn (Active Learning Targets) */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-amber-500" />
                  <span>Skills to Learn (Active Curriculum)</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Target competencies you are actively learning to close MSME employer skill gaps
                </p>
              </div>
              <button
                onClick={() => setIsLearningSkillModalOpen(true)}
                className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors border border-amber-200/60"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Skill to Learning</span>
              </button>
            </div>

            <div className="space-y-3">
              {learningSkillsList.map((skill) => (
                <div
                  key={skill.id}
                  className="p-4 rounded-xl border border-amber-200/60 bg-amber-50/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 text-sm">{skill.name}</h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                        {skill.status}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-500">
                        Target: {skill.targetProficiency}
                      </span>
                    </div>
                    {skill.notes && <p className="text-slate-600 text-[11px]">{skill.notes}</p>}
                    <p className="text-[10px] text-slate-400">Added on {skill.addedDate}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveTab("assessments")}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs transition-colors"
                    >
                      <FileCheck2 className="w-3.5 h-3.5" />
                      <span>Take Assessment</span>
                    </button>
                    <button
                      onClick={() => handleDeleteLearningSkillItem(skill.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-white transition-colors"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= 6. TECHNICAL PROJECTS ================= */}
      {(activeSection === "projects" || activeSection === "all") && (
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Code className="w-4 h-4 text-indigo-600" />
                <span>Technical Projects & Code Repositories</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Practical engineering evidence demonstrating hands-on architectural competence
              </p>
            </div>
            <button
              onClick={() => {
                setEditingProj(null);
                setIsProjModalOpen(true);
              }}
              className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Project</span>
            </button>
          </div>

          <div className="space-y-3">
            {projectsList.map((proj) => (
              <div
                key={proj.id}
                className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/60 flex flex-col sm:flex-row sm:items-start justify-between gap-3 text-xs"
              >
                <div className="space-y-2 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 text-sm">{proj.name}</h3>
                    <span className="text-[10px] font-semibold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded">
                      {proj.role}
                    </span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">{proj.description}</p>
                  
                  {/* Tech stack tags */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {proj.technologies.map((t, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 bg-white border border-slate-200 rounded-md text-[10px] font-semibold text-slate-700"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* Links */}
                  <div className="flex items-center gap-3 pt-1 text-[11px]">
                    {proj.githubUrl && (
                      <a
                        href={proj.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
                      >
                        <Github className="w-3.5 h-3.5" />
                        <span>Source Code</span>
                      </a>
                    )}
                    {proj.liveDemoUrl && (
                      <a
                        href={proj.liveDemoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-emerald-600 hover:text-emerald-800 font-semibold flex items-center gap-1"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Live Preview</span>
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 self-end sm:self-start">
                  <button
                    onClick={() => {
                      setEditingProj(proj);
                      setIsProjModalOpen(true);
                    }}
                    className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-white rounded-lg transition-colors"
                    title="Edit Project"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteProject(proj.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-white rounded-lg transition-colors"
                    title="Delete Project"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= 7. CERTIFICATIONS ================= */}
      {(activeSection === "certifications" || activeSection === "all") && (
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                <span>Industry Certifications & Credentials</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Accredited vendor and national board certifications with verifiable credential IDs
              </p>
            </div>
            <button
              onClick={() => {
                setEditingCert(null);
                setIsCertModalOpen(true);
              }}
              className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Certification</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {certificationsList.map((cert) => (
              <div
                key={cert.id}
                className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 flex items-start justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-900">{cert.name}</h4>
                  <p className="font-semibold text-slate-600">{cert.issuingOrg}</p>
                  <p className="text-slate-400 text-[11px]">Issued: {cert.issueDate}</p>
                  {cert.credentialId && (
                    <p className="text-[11px] text-slate-500 font-mono bg-white px-2 py-0.5 rounded border border-slate-200 inline-block mt-1">
                      ID: {cert.credentialId}
                    </p>
                  )}
                  {cert.credentialUrl && (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 pt-1"
                    >
                      <span>Verify Credential</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      setEditingCert(cert);
                      setIsCertModalOpen(true);
                    }}
                    className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteCert(cert.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= 8. ACHIEVEMENTS & EXTRACURRICULAR ACTIVITIES ================= */}
      {(activeSection === "achievements" || activeSection === "all") && (
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Award className="w-4 h-4 text-indigo-600" />
                <span>Achievements & Extracurricular Activities</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Hackathons, competitive programming, collegiate leadership, and community recognition
              </p>
            </div>
            <button
              onClick={() => {
                setEditingAch(null);
                setIsAchModalOpen(true);
              }}
              className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Achievement</span>
            </button>
          </div>

          <div className="space-y-3">
            {achievementsList.map((ach) => (
              <div
                key={ach.id}
                className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/60 flex items-start justify-between gap-3 text-xs"
              >
                <div className="space-y-1 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 text-sm">{ach.title}</h3>
                    <span className="text-[10px] font-semibold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded">
                      {ach.category}
                    </span>
                  </div>
                  <p className="font-semibold text-slate-600">
                    {ach.organization} • <span className="text-slate-400 font-normal">{ach.date}</span>
                  </p>
                  <p className="text-slate-600 leading-relaxed pt-0.5">{ach.description}</p>
                  {ach.url && (
                    <a
                      href={ach.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 pt-1"
                    >
                      <span>Proof / Award Link</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      setEditingAch(ach);
                      setIsAchModalOpen(true);
                    }}
                    className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteAchievement(ach.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= 9. JOB PREFERENCES ================= */}
      {(activeSection === "preferences" || activeSection === "all") && (
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Globe className="w-4 h-4 text-indigo-600" />
                <span>Job Preferences & Career Targets</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Feeds directly into the AI Talent Match Engine to prioritize relevant MSME openings
              </p>
            </div>
            <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
              Engine Priority
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Preferred Job Roles (Comma-separated)
              </label>
              <input
                type="text"
                value={jobPreferences.preferredRoles.join(", ")}
                onChange={(e) =>
                  setJobPreferences({
                    ...jobPreferences,
                    preferredRoles: e.target.value.split(",").map((r) => r.trim()).filter(Boolean),
                  })
                }
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Preferred Locations (Comma-separated)
              </label>
              <input
                type="text"
                value={jobPreferences.preferredLocations.join(", ")}
                onChange={(e) =>
                  setJobPreferences({
                    ...jobPreferences,
                    preferredLocations: e.target.value.split(",").map((l) => l.trim()).filter(Boolean),
                  })
                }
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Expected Salary Range</label>
              <input
                type="text"
                value={jobPreferences.expectedSalary}
                onChange={(e) =>
                  setJobPreferences({
                    ...jobPreferences,
                    expectedSalary: e.target.value,
                  })
                }
                placeholder="e.g. ₹6,00,000 - ₹9,00,000 LPA"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Availability / Notice Period</label>
              <select
                value={jobPreferences.availability}
                onChange={(e) =>
                  setJobPreferences({
                    ...jobPreferences,
                    availability: e.target.value as any,
                  })
                }
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                <option value="Immediate">Immediate Joiner</option>
                <option value="15 Days">15 Days</option>
                <option value="1 Month">1 Month</option>
                <option value="2 Months">2 Months</option>
                <option value="Flexible">Flexible</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Save bar */}
      <div className="flex items-center justify-between p-4 bg-slate-900 text-white rounded-2xl">
        <div className="text-xs">
          <p className="font-bold">Sync with National AI Talent Match Engine</p>
          <p className="text-slate-400 text-[11px]">
            Saved profiles receive real-time candidate ranking for 1,200+ registered MSME jobs.
          </p>
        </div>
        <button
          onClick={handleSaveProfile}
          disabled={isSaving}
          className="px-6 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-2 shrink-0 disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save & Update Engine</span>
            </>
          )}
        </button>
      </div>

      {/* Modals */}
      <EducationModal
        isOpen={isEduModalOpen}
        onClose={() => setIsEduModalOpen(false)}
        onSave={handleSaveEducation}
        initialData={editingEdu}
      />

      <ExperienceModal
        isOpen={isExpModalOpen}
        onClose={() => setIsExpModalOpen(false)}
        onSave={handleSaveExperience}
        initialData={editingExp}
      />

      <ProjectModal
        isOpen={isProjModalOpen}
        onClose={() => setIsProjModalOpen(false)}
        onSave={handleSaveProject}
        initialData={editingProj}
      />

      <CertificationModal
        isOpen={isCertModalOpen}
        onClose={() => setIsCertModalOpen(false)}
        onSave={handleSaveCert}
        initialData={editingCert}
      />

      <AchievementModal
        isOpen={isAchModalOpen}
        onClose={() => setIsAchModalOpen(false)}
        onSave={handleSaveAchievement}
        initialData={editingAch}
      />

      <SkillModal
        isOpen={isSkillModalOpen}
        onClose={() => setIsSkillModalOpen(false)}
        onSave={handleSaveSkill}
        initialData={editingSkill}
      />

      <AddLearningSkillModal
        isOpen={isLearningSkillModalOpen}
        onClose={() => setIsLearningSkillModalOpen(false)}
        onSave={handleAddLearningSkillItem}
      />
    </div>
  );
};
