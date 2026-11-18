import React, { createContext, useContext, useState, useEffect } from "react";
import {
  UserRole,
  Language,
  CandidateProfile,
  CandidateFullProfile,
  CandidateResume,
  CandidateLearningSkill,
  JobPosting,
  JobApplication,
  AssessmentResult,
  LearningRoadmap,
  NotificationItem,
  AuthUser,
} from "../types";
import {
  INITIAL_CANDIDATES,
  INITIAL_JOBS,
} from "../data/initialData";
import { TRANSLATIONS } from "../utils/translations";

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (auth: boolean) => void;
  user: AuthUser | null;
  authToken: string | null;
  isAuthenticating: boolean;
  authError: string | null;
  clearAuthError: () => void;
  login: (email: string, password: string, expectedRole?: "CANDIDATE" | "MSME" | "ADMIN") => Promise<boolean>;
  signup: (params: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: "CANDIDATE" | "MSME";
    companyName?: string;
  }) => Promise<boolean>;
  logout: () => Promise<void>;
  currentPath: string;
  navigate: (path: string, options?: { replace?: boolean }) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof TRANSLATIONS.en) => string;
  
  // Data
  currentCandidate: CandidateProfile;
  updateCandidateProfile: (profile: Partial<CandidateProfile>) => void;
  candidateProfile: CandidateFullProfile | null;
  fetchCandidateProfile: () => Promise<CandidateFullProfile | null>;
  saveCandidateProfile: (profile: Partial<CandidateFullProfile>) => Promise<CandidateFullProfile | null>;
  uploadResume: (file: File) => Promise<CandidateResume | null>;
  deleteResume: () => Promise<boolean>;
  addLearningSkill: (skill: { name: string; category?: string; targetProficiency?: string; notes?: string }) => Promise<boolean>;
  deleteLearningSkill: (id: string) => Promise<boolean>;
  generateDynamicRoadmap: (targetRole?: string) => Promise<LearningRoadmap | null>;
  candidates: CandidateProfile[];
  jobs: JobPosting[];
  addJob: (job: Omit<JobPosting, "id" | "postedDate" | "applicantsCount">) => void;
  
  // Candidate actions
  applications: JobApplication[];
  applyToJob: (jobId: string, notes?: string) => boolean;
  savedJobIds: string[];
  toggleSaveJob: (jobId: string) => void;
  assessmentResults: AssessmentResult[];
  saveAssessmentResult: (result: AssessmentResult) => void;
  currentRoadmap: LearningRoadmap | null;
  setRoadmap: (roadmap: LearningRoadmap | null) => void;
  toggleRoadmapWeek: (weekNum: number) => void;

  // Employer actions
  shortlistedCandidateIds: string[];
  toggleShortlistCandidate: (candidateId: string) => void;
  selectedCandidateForComparison: string[];
  toggleCompareCandidate: (candidateId: string) => void;
  clearComparison: () => void;
  updateApplicationStatus: (appId: string, status: JobApplication["status"]) => void;

  // Notifications
  notifications: NotificationItem[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;

  // Navigation & Modals
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedJobId: string | null;
  setSelectedJobId: (id: string | null) => void;
  selectedCandidateId: string | null;
  setSelectedCandidateId: (id: string | null) => void;
  isDemoModalOpen: boolean;
  setIsDemoModalOpen: (open: boolean) => void;
  isAIAssistantOpen: boolean;
  setIsAIAssistantOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;

  // Demo switch helper
  loginAsRole: (role: UserRole) => void;
  resetAllDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = "worknexus_ai_state_v1";

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Auth state
  const [user, setUser] = useState<AuthUser | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(() => localStorage.getItem("skillbridge_jwt_token"));
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [currentPath, setCurrentPath] = useState<string>(() => window.location.pathname || "/login");

  const clearAuthError = () => setAuthError(null);

  // Load initial from local storage or defaults
  const [role, setRole] = useState<UserRole>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_role`);
    return (saved as UserRole) || "candidate";
  });

  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_lang`);
    return (saved as Language) || "en";
  });

  const [currentCandidate, setCurrentCandidate] = useState<CandidateProfile>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_profile`);
    return saved ? JSON.parse(saved) : INITIAL_CANDIDATES[0];
  });

  const [candidateProfile, setCandidateProfile] = useState<CandidateFullProfile | null>(null);

  const [candidates, setCandidates] = useState<CandidateProfile[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_candidates`);
    return saved ? JSON.parse(saved) : INITIAL_CANDIDATES;
  });

  const [jobs, setJobs] = useState<JobPosting[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_jobs`);
    return saved ? JSON.parse(saved) : INITIAL_JOBS;
  });

  const [applications, setApplications] = useState<JobApplication[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_apps`);
    if (saved) return JSON.parse(saved);
    // Seed one default application for Sai Pooja
    return [
      {
        id: "app-101",
        jobId: "job-2",
        candidateId: "cand-1",
        appliedDate: "2025-02-21",
        status: "Interview",
        matchScore: 87,
        timeline: [
          { status: "Applied", date: "2025-02-21", notes: "Application submitted with verified Java/React skills" },
          { status: "Shortlisted", date: "2025-02-22", notes: "Profile approved by MSME talent team" },
          { status: "Assessment", date: "2025-02-23", notes: "Completed practical coding evaluation (88% score)" },
          { status: "Interview", date: "2025-02-24", notes: "Technical discussion scheduled with Engineering Lead" },
        ],
      },
    ];
  });

  const [savedJobIds, setSavedJobIds] = useState<string[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_saved_jobs`);
    return saved ? JSON.parse(saved) : ["job-1", "job-4"];
  });

  const [assessmentResults, setAssessmentResults] = useState<AssessmentResult[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_assessments`);
    if (saved) return JSON.parse(saved);
    return [
      {
        id: "as-1",
        skillName: "Java",
        difficulty: "Intermediate",
        score: 91,
        totalQuestions: 4,
        correctAnswers: 4,
        dateCompleted: "2025-01-15",
        proficiencyLevel: "Advanced",
        strengths: ["OOP Architecture", "Collections Optimization", "Exception Hierarchies"],
        needsImprovement: ["High-concurrency thread pooling", "Non-blocking reactive IO"],
        recommendedNextSteps: "You have strong command of Java OOP and collections. Advance into Spring Boot microservices and REST API contracts.",
      },
      {
        id: "as-2",
        skillName: "SQL",
        difficulty: "Intermediate",
        score: 84,
        totalQuestions: 4,
        correctAnswers: 3,
        dateCompleted: "2025-01-20",
        proficiencyLevel: "Proficient",
        strengths: ["Relational joins", "Transaction Atomicity", "Composite indexing"],
        needsImprovement: ["Window partition functions under scale"],
        recommendedNextSteps: "Solid database fundamentals. Pair with JPA/Hibernate for full-stack data access.",
      },
    ];
  });

  const [currentRoadmap, setCurrentRoadmap] = useState<LearningRoadmap | null>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_roadmap`);
    if (saved) return JSON.parse(saved);
    return {
      targetRole: "Java Backend Developer",
      readinessScore: 78,
      generatedDate: "2025-02-20",
      lastUpdated: "2025-02-24",
      weeks: [
        {
          week: 1,
          title: "Spring Boot Core & Dependency Injection",
          skill: "Spring Boot",
          whyItMatters: "Standard microservice framework demanded by 85% of MSME backend positions.",
          difficulty: "Intermediate",
          estimatedHours: 12,
          recommendedProject: "Build an MSME Vendor Order Management REST API with Spring Data JPA.",
          learningObjectives: ["Inversion of Control & Spring Beans", "Application Properties & Profiles", "Spring Data Repository interfaces"],
          isCompleted: true,
        },
        {
          week: 2,
          title: "Production REST APIs & JWT Security",
          skill: "REST APIs & Security",
          whyItMatters: "Essential for secure frontend-backend communication in enterprise portals.",
          difficulty: "Intermediate",
          estimatedHours: 14,
          recommendedProject: "Implement JWT role-based access control (Admin vs Candidate vs Employer).",
          learningObjectives: ["Spring Security filter chains", "Token validation & expiration", "HTTP status code standardization"],
          isCompleted: true,
        },
        {
          week: 3,
          title: "Relational Database Performance & Caching",
          skill: "SQL & Redis Caching",
          whyItMatters: "Reduces MSME server hosting costs by speeding up catalog queries.",
          difficulty: "Advanced",
          estimatedHours: 10,
          recommendedProject: "Integrate Redis caching for product catalog lookups with cache eviction.",
          learningObjectives: ["Composite index benchmarking", "N+1 query resolution in Hibernate", "Spring Cache annotations"],
          isCompleted: false,
        },
        {
          week: 4,
          title: "Docker Containerization & AWS Elastic Beanstalk",
          skill: "AWS & Docker Deployment",
          whyItMatters: "Enables cloud-ready software release cycles for agile startups.",
          difficulty: "Intermediate",
          estimatedHours: 12,
          recommendedProject: "Dockerize the Spring Boot jar and deploy live on AWS free-tier instance.",
          learningObjectives: ["Multi-stage Dockerfile creation", "Environment variable injection", "Health check & log streaming"],
          isCompleted: false,
        },
      ],
    };
  });

  const [shortlistedCandidateIds, setShortlistedCandidateIds] = useState<string[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_shortlisted`);
    return saved ? JSON.parse(saved) : ["cand-1", "cand-2", "cand-3"];
  });

  const [selectedCandidateForComparison, setSelectedCandidateForComparison] = useState<string[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_compare`);
    return saved ? JSON.parse(saved) : ["cand-1", "cand-2", "cand-3"];
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_notifications`);
    if (saved) return JSON.parse(saved);
    return [
      {
        id: "notif-1",
        type: "match",
        title: "92% AI Job Match Detected",
        message: "Junior Java Backend Developer at TechCraft Solutions aligns with your verified Java & SQL skills.",
        timestamp: "10 mins ago",
        isRead: false,
        actionUrl: "job-matches",
      },
      {
        id: "notif-2",
        type: "verification",
        title: "Skill Verified by Platform Benchmark",
        message: "Your Java assessment (91%) has been platform-verified and added to your national skill transcript.",
        timestamp: "2 hours ago",
        isRead: false,
        actionUrl: "my-skills",
      },
      {
        id: "notif-3",
        type: "application",
        title: "Interview Scheduled!",
        message: "TechCraft Solutions invited you to a technical discussion for the Full Stack Developer role.",
        timestamp: "Yesterday",
        isRead: true,
        actionUrl: "applications",
      },
      {
        id: "notif-4",
        type: "roadmap",
        title: "Weekly Learning Milestone",
        message: "You completed Week 2 of your Java Backend Roadmap! Next up: Database Caching.",
        timestamp: "3 days ago",
        isRead: true,
        actionUrl: "roadmap",
      },
    ];
  });

  // UI state
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState<boolean>(false);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  // Persistence effects
  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_role`, role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_auth`, JSON.stringify(isAuthenticated));
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_lang`, language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_profile`, JSON.stringify(currentCandidate));
  }, [currentCandidate]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_candidates`, JSON.stringify(candidates));
  }, [candidates]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_jobs`, JSON.stringify(jobs));
  }, [jobs]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_apps`, JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_saved_jobs`, JSON.stringify(savedJobIds));
  }, [savedJobIds]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_assessments`, JSON.stringify(assessmentResults));
  }, [assessmentResults]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_roadmap`, JSON.stringify(currentRoadmap));
  }, [currentRoadmap]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_shortlisted`, JSON.stringify(shortlistedCandidateIds));
  }, [shortlistedCandidateIds]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_compare`, JSON.stringify(selectedCandidateForComparison));
  }, [selectedCandidateForComparison]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_notifications`, JSON.stringify(notifications));
  }, [notifications]);

  // Translation helper
  const t = (key: keyof typeof TRANSLATIONS.en): string => {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS.en[key] || key;
  };

  const fetchCandidateProfile = async (): Promise<CandidateFullProfile | null> => {
    const token = localStorage.getItem("skillbridge_jwt_token");
    if (!token) return null;
    try {
      const res = await fetch("/api/candidate/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.profile) {
          setCandidateProfile(data.profile);
          // Keep legacy currentCandidate synchronized
          setCurrentCandidate((prev) => ({
            ...prev,
            name: data.profile.name || prev.name,
            email: data.profile.email || prev.email,
            phone: data.profile.phone || prev.phone,
            headline: data.profile.headline || prev.headline,
            location: data.profile.location || prev.location,
            bio: data.profile.bio || prev.bio,
            avatarUrl: data.profile.avatarUrl || prev.avatarUrl,
            overallSkillScore: data.profile.overallSkillScore || prev.overallSkillScore,
            jobReadiness: data.profile.jobReadiness || prev.jobReadiness,
            verifiedSkillsCount: data.profile.verifiedSkillsCount || prev.verifiedSkillsCount,
            skills: data.profile.skills || prev.skills,
            targetRole: data.profile.jobPreferences?.preferredRoles?.[0] || prev.targetRole,
          }));
          if (data.profile.roadmap) {
            setCurrentRoadmap(data.profile.roadmap);
          }
          if (data.profile.assessments) {
            setAssessmentResults(data.profile.assessments);
          }
          return data.profile;
        }
      }
    } catch (err) {
      console.error("Failed to fetch candidate profile", err);
    }
    return null;
  };

  const saveCandidateProfile = async (updates: Partial<CandidateFullProfile>): Promise<CandidateFullProfile | null> => {
    const token = localStorage.getItem("skillbridge_jwt_token");
    if (!token) return null;
    try {
      const res = await fetch("/api/candidate/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.profile) {
          setCandidateProfile(data.profile);
          setCurrentCandidate((prev) => ({
            ...prev,
            name: data.profile.name || prev.name,
            email: data.profile.email || prev.email,
            phone: data.profile.phone || prev.phone,
            headline: data.profile.headline || prev.headline,
            location: data.profile.location || prev.location,
            bio: data.profile.bio || prev.bio,
            avatarUrl: data.profile.avatarUrl || prev.avatarUrl,
            overallSkillScore: data.profile.overallSkillScore || prev.overallSkillScore,
            jobReadiness: data.profile.jobReadiness || prev.jobReadiness,
            verifiedSkillsCount: data.profile.verifiedSkillsCount || prev.verifiedSkillsCount,
            skills: data.profile.skills || prev.skills,
          }));
          return data.profile;
        }
      }
    } catch (err) {
      console.error("Error saving candidate profile", err);
    }
    return null;
  };

  const uploadResume = async (file: File): Promise<CandidateResume | null> => {
    const token = localStorage.getItem("skillbridge_jwt_token");
    if (!token) return null;

    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const fileData = reader.result as string;
          const fileSize =
            file.size > 1024 * 1024
              ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
              : `${Math.round(file.size / 1024)} KB`;

          const res = await fetch("/api/candidate/resume", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              fileName: file.name,
              fileType: file.type || "application/pdf",
              fileSize,
              fileData,
            }),
          });
          const data = await res.json();
          if (data.success && data.resume) {
            setCandidateProfile((prev) => (prev ? { ...prev, resume: data.resume } : null));
            resolve(data.resume);
            return;
          }
        } catch (err) {
          console.error("Resume upload error", err);
        }
        resolve(null);
      };
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(file);
    });
  };

  const deleteResume = async (): Promise<boolean> => {
    const token = localStorage.getItem("skillbridge_jwt_token");
    if (!token) return false;
    try {
      const res = await fetch("/api/candidate/resume", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setCandidateProfile((prev) => (prev ? { ...prev, resume: null } : null));
        return true;
      }
    } catch (err) {
      console.error("Resume delete error", err);
    }
    return false;
  };

  const addLearningSkill = async (skillData: {
    name: string;
    category?: string;
    targetProficiency?: string;
    notes?: string;
  }): Promise<boolean> => {
    const token = localStorage.getItem("skillbridge_jwt_token");
    if (!token) return false;
    try {
      const res = await fetch("/api/candidate/learning-skills", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(skillData),
      });
      const data = await res.json();
      if (data.success && data.learningSkill) {
        setCandidateProfile((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            learningSkills: [...prev.learningSkills, data.learningSkill],
          };
        });
        return true;
      }
    } catch (err) {
      console.error("Add learning skill error", err);
    }
    return false;
  };

  const deleteLearningSkill = async (skillId: string): Promise<boolean> => {
    const token = localStorage.getItem("skillbridge_jwt_token");
    if (!token) return false;
    try {
      const res = await fetch(`/api/candidate/learning-skills/${skillId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setCandidateProfile((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            learningSkills: prev.learningSkills.filter((s) => s.id !== skillId),
          };
        });
        return true;
      }
    } catch (err) {
      console.error("Delete learning skill error", err);
    }
    return false;
  };

  const generateDynamicRoadmap = async (targetRole?: string): Promise<LearningRoadmap | null> => {
    const token = localStorage.getItem("skillbridge_jwt_token");
    if (!token) return null;
    try {
      const res = await fetch("/api/candidate/roadmap/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ targetRole }),
      });
      const data = await res.json();
      if (data.success && data.roadmap) {
        setCurrentRoadmap(data.roadmap);
        setCandidateProfile((prev) => (prev ? { ...prev, roadmap: data.roadmap } : null));
        return data.roadmap;
      }
    } catch (err) {
      console.error("Error generating roadmap", err);
    }
    return null;
  };

  const updateCandidateProfile = (profile: Partial<CandidateProfile>) => {
    setCurrentCandidate((prev) => {
      const updated = { ...prev, ...profile };
      // Also update in all candidates list
      setCandidates((all) => all.map((c) => (c.id === updated.id ? updated : c)));
      return updated;
    });
  };

  const addJob = (jobData: Omit<JobPosting, "id" | "postedDate" | "applicantsCount">) => {
    const newJob: JobPosting = {
      ...jobData,
      id: `job-${Date.now()}`,
      postedDate: new Date().toISOString().split("T")[0],
      applicantsCount: 0,
    };
    setJobs((prev) => [newJob, ...prev]);
    // Notify candidate
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        type: "match",
        title: `New Job Posted: ${newJob.title}`,
        message: `${newJob.companyName} in ${newJob.location} is actively hiring verified talent.`,
        timestamp: "Just now",
        isRead: false,
        actionUrl: "job-matches",
      },
      ...prev,
    ]);
  };

  const applyToJob = (jobId: string, notes?: string): boolean => {
    if (applications.some((a) => a.jobId === jobId && a.candidateId === currentCandidate.id)) {
      return false; // Already applied
    }
    const targetJob = jobs.find((j) => j.id === jobId);
    const newApp: JobApplication = {
      id: `app-${Date.now()}`,
      jobId,
      candidateId: currentCandidate.id,
      appliedDate: new Date().toISOString().split("T")[0],
      status: "Applied",
      matchScore: 92,
      candidateNotes: notes,
      timeline: [
        {
          status: "Applied",
          date: new Date().toISOString().split("T")[0],
          notes: "Application submitted with verified capabilities transcript",
        },
      ],
    };
    setApplications((prev) => [newApp, ...prev]);

    // Increment applicant count on job
    setJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, applicantsCount: j.applicantsCount + 1 } : j))
    );

    // Add notification
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        type: "application",
        title: "Application Submitted Successfully",
        message: `Your verified profile was sent to ${targetJob?.companyName || "Employer"}. Track status under My Applications.`,
        timestamp: "Just now",
        isRead: false,
        actionUrl: "applications",
      },
      ...prev,
    ]);

    return true;
  };

  const toggleSaveJob = (jobId: string) => {
    setSavedJobIds((prev) =>
      prev.includes(jobId) ? prev.filter((id) => id !== jobId) : [...prev, jobId]
    );
  };

  const saveAssessmentResult = async (result: AssessmentResult) => {
    const token = localStorage.getItem("skillbridge_jwt_token");
    if (token) {
      try {
        await fetch("/api/candidate/assessments", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(result),
        });
        // Refresh full candidate profile
        fetchCandidateProfile();
      } catch (err) {
        console.error("Failed to save assessment to backend", err);
      }
    }

    setAssessmentResults((prev) => [result, ...prev.filter((r) => r.skillName !== result.skillName)]);

    // Update the candidate's skill profile
    setCurrentCandidate((prev) => {
      const existing = prev.skills.find(
        (s) => s.name.toLowerCase() === result.skillName.toLowerCase()
      );
      let updatedSkills = [...prev.skills];
      if (existing) {
        updatedSkills = updatedSkills.map((s) =>
          s.name.toLowerCase() === result.skillName.toLowerCase()
            ? {
                ...s,
                score: Math.max(s.score, result.score),
                verificationStatus: result.score >= 70 ? "Verified" : "Assessment Verified",
                assessmentScore: result.score,
                verifiedDate: new Date().toISOString().split("T")[0],
              }
            : s
        );
      } else {
        updatedSkills.push({
          id: `sk-${Date.now()}`,
          name: result.skillName,
          category: "Backend",
          score: result.score,
          verificationStatus: result.score >= 70 ? "Verified" : "Assessment Verified",
          assessmentScore: result.score,
          verifiedDate: new Date().toISOString().split("T")[0],
        });
      }

      // Recalculate verified skills count
      const verifiedCount = updatedSkills.filter(
        (s) => s.verificationStatus === "Verified" || s.verificationStatus === "Assessment Verified"
      ).length;

      // Recalculate average skill score
      const avgScore = Math.round(
        updatedSkills.reduce((acc, s) => acc + s.score, 0) / updatedSkills.length
      );

      return {
        ...prev,
        skills: updatedSkills,
        overallSkillScore: avgScore,
        verifiedSkillsCount: verifiedCount,
        jobReadiness: Math.min(95, Math.round(avgScore * 0.9 + verifiedCount * 1.5)),
      };
    });

    // Notify
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        type: "assessment",
        title: `${result.skillName} Assessment Completed: ${result.score}%`,
        message: `Your skill assessment is verified. Proficiency rated as ${result.proficiencyLevel}.`,
        timestamp: "Just now",
        isRead: false,
        actionUrl: "my-skills",
      },
      ...prev,
    ]);
  };

  const setRoadmap = (roadmap: LearningRoadmap | null) => {
    setCurrentRoadmap(roadmap);
  };

  const toggleRoadmapWeek = async (weekNum: number) => {
    const token = localStorage.getItem("skillbridge_jwt_token");
    if (token) {
      try {
        const res = await fetch("/api/candidate/roadmap/toggle-week", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ weekNum }),
        });
        const data = await res.json();
        if (data.success && data.roadmap) {
          setCurrentRoadmap(data.roadmap);
          setCandidateProfile((prev) => (prev ? { ...prev, roadmap: data.roadmap } : null));
          return;
        }
      } catch (err) {
        console.error("Error toggling roadmap week on backend", err);
      }
    }

    if (!currentRoadmap) return;
    const updatedWeeks = currentRoadmap.weeks.map((w) =>
      w.week === weekNum ? { ...w, isCompleted: !w.isCompleted } : w
    );
    const completedCount = updatedWeeks.filter((w) => w.isCompleted).length;
    const newReadiness = Math.min(98, Math.round(70 + (completedCount / updatedWeeks.length) * 25));

    setCurrentRoadmap({
      ...currentRoadmap,
      weeks: updatedWeeks,
      readinessScore: newReadiness,
      lastUpdated: new Date().toISOString().split("T")[0],
    });

    // Also update candidate job readiness
    setCurrentCandidate((prev) => ({
      ...prev,
      jobReadiness: newReadiness,
    }));
  };

  const toggleShortlistCandidate = (candidateId: string) => {
    setShortlistedCandidateIds((prev) =>
      prev.includes(candidateId) ? prev.filter((id) => id !== candidateId) : [...prev, candidateId]
    );
  };

  const toggleCompareCandidate = (candidateId: string) => {
    setSelectedCandidateForComparison((prev) => {
      if (prev.includes(candidateId)) {
        return prev.filter((id) => id !== candidateId);
      }
      if (prev.length >= 4) {
        return [...prev.slice(1), candidateId];
      }
      return [...prev, candidateId];
    });
  };

  const clearComparison = () => {
    setSelectedCandidateForComparison([]);
  };

  const updateApplicationStatus = (appId: string, newStatus: JobApplication["status"]) => {
    setApplications((prev) =>
      prev.map((a) => {
        if (a.id === appId) {
          const updatedTimeline = [
            ...a.timeline,
            {
              status: newStatus,
              date: new Date().toISOString().split("T")[0],
              notes: `Status updated by employer to ${newStatus}`,
            },
          ];
          return {
            ...a,
            status: newStatus,
            timeline: updatedTimeline,
          };
        }
        return a;
      })
    );
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const navigate = (path: string, options?: { replace?: boolean }) => {
    if (options?.replace) {
      window.history.replaceState(null, "", path);
    } else {
      window.history.pushState(null, "", path);
    }
    setCurrentPath(path);

    // Synchronize activeTab based on path
    if (path.includes("/dashboard")) {
      if (path.startsWith("/msme")) setActiveTab("employer-dashboard");
      else if (path.startsWith("/admin")) setActiveTab("admin-dashboard");
      else setActiveTab("candidate-dashboard");
    } else if (path.includes("/overview")) {
      setActiveTab("admin-dashboard");
    } else if (path.includes("/skills")) {
      setActiveTab("my-skills");
    } else if (path.includes("/assessments")) {
      setActiveTab("assessments");
    } else if (path.includes("/skill-gap")) {
      setActiveTab("skill-gap");
    } else if (path.includes("/regional-gaps") || path.includes("/analytics")) {
      setActiveTab("regional-analytics");
    } else if (path.includes("/national-map")) {
      setActiveTab("national-map");
    } else if (path.includes("/roadmap")) {
      setActiveTab("roadmap");
    } else if (path.includes("/job-matches")) {
      setActiveTab("job-matches");
    } else if (path.includes("/applications")) {
      setActiveTab("applications");
    } else if (path.includes("/saved-jobs")) {
      setActiveTab("saved-jobs");
    } else if (path.includes("/post-job")) {
      setActiveTab("post-job");
    } else if (path.includes("/my-jobs")) {
      setActiveTab("my-jobs");
    } else if (path.includes("/talent-match")) {
      setActiveTab("talent-match");
    } else if (path.includes("/compare")) {
      setActiveTab("compare");
    } else if (path.includes("/insights")) {
      setActiveTab("insights");
    } else if (path.includes("/profile")) {
      setActiveTab("profile");
    } else if (path.includes("/reports")) {
      setActiveTab("workforce-reports");
    } else if (path.includes("/msme-directory") || path.includes("/msme-insights")) {
      setActiveTab("msme-directory");
    }
  };

  // Browser history listener
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Session verification and restoration from backend GET /api/auth/me
  useEffect(() => {
    const token = localStorage.getItem("skillbridge_jwt_token");
    if (!token) {
      setIsAuthenticated(false);
      setUser(null);
      const pathname = window.location.pathname;
      if (!["/login", "/signup", "/forgot-password", "/reset-password"].includes(pathname)) {
        navigate("/login", { replace: true });
      }
      return;
    }

    setIsAuthenticating(true);
    fetch("/api/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.user) {
            setUser(data.user);
            setIsAuthenticated(true);
            const mappedRole: UserRole =
              data.user.role === "CANDIDATE"
                ? "candidate"
                : data.user.role === "MSME"
                ? "employer"
                : "admin";
            setRole(mappedRole);

            const path = window.location.pathname;
            if (mappedRole === "candidate") {
              fetchCandidateProfile();
              if (["/", "/login", "/signup", "/forgot-password", "/reset-password"].includes(path)) {
                navigate("/candidate/dashboard", { replace: true });
              }
            } else if (mappedRole === "employer") {
              if (["/", "/login", "/signup", "/forgot-password", "/reset-password"].includes(path)) {
                navigate("/msme/dashboard", { replace: true });
              }
            } else {
              if (["/", "/login", "/signup", "/forgot-password", "/reset-password"].includes(path)) {
                navigate("/admin/overview", { replace: true });
              }
            }
            return;
          }
        }
        // Invalid or expired token
        localStorage.removeItem("skillbridge_jwt_token");
        setAuthToken(null);
        setIsAuthenticated(false);
        setUser(null);
        navigate("/login", { replace: true });
      })
      .catch(() => {
        setIsAuthenticated(false);
        setUser(null);
        navigate("/login", { replace: true });
      })
      .finally(() => {
        setIsAuthenticating(false);
      });
  }, []);

  // Real backend login calling POST /api/auth/login with bcrypt
  const login = async (email: string, password: string, expectedRole?: "CANDIDATE" | "MSME" | "ADMIN"): Promise<boolean> => {
    setIsAuthenticating(true);
    setAuthError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password, expectedRole }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setAuthError(data.error || "Authentication failed. Please check your credentials.");
        setIsAuthenticating(false);
        return false;
      }

      localStorage.setItem("skillbridge_jwt_token", data.token);
      setAuthToken(data.token);
      setUser(data.user);
      setIsAuthenticated(true);

      const mappedRole: UserRole =
        data.user.role === "CANDIDATE"
          ? "candidate"
          : data.user.role === "MSME"
          ? "employer"
          : "admin";
      setRole(mappedRole);

      // Role-based automatic redirect (Section 5)
      if (mappedRole === "candidate") {
        fetchCandidateProfile();
        setActiveTab("candidate-dashboard");
        navigate("/candidate/dashboard", { replace: true });
      } else if (mappedRole === "employer") {
        setActiveTab("employer-dashboard");
        navigate("/msme/dashboard", { replace: true });
      } else {
        setActiveTab("admin-dashboard");
        navigate("/admin/overview", { replace: true });
      }

      setIsAuthenticating(false);
      return true;
    } catch (err) {
      setAuthError("Failed to connect to authentication server. Please check your network.");
      setIsAuthenticating(false);
      return false;
    }
  };

  // Real backend signup calling POST /api/auth/signup with bcrypt
  const signup = async (params: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: "CANDIDATE" | "MSME";
    companyName?: string;
  }): Promise<boolean> => {
    setIsAuthenticating(true);
    setAuthError(null);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setAuthError(data.error || "Registration failed.");
        setIsAuthenticating(false);
        return false;
      }

      localStorage.setItem("skillbridge_jwt_token", data.token);
      setAuthToken(data.token);
      setUser(data.user);
      setIsAuthenticated(true);

      const mappedRole: UserRole = data.user.role === "MSME" ? "employer" : "candidate";
      setRole(mappedRole);

      if (mappedRole === "candidate") {
        setActiveTab("candidate-dashboard");
        navigate("/candidate/dashboard", { replace: true });
      } else {
        setActiveTab("employer-dashboard");
        navigate("/msme/dashboard", { replace: true });
      }

      setIsAuthenticating(false);
      return true;
    } catch (err) {
      setAuthError("Network error during registration.");
      setIsAuthenticating(false);
      return false;
    }
  };

  // Real logout clearing token and redirecting to /login with replaceState
  const logout = async (): Promise<void> => {
    try {
      if (authToken) {
        fetch("/api/auth/logout", {
          method: "POST",
          headers: { Authorization: `Bearer ${authToken}` },
        }).catch(() => {});
      }
    } finally {
      localStorage.removeItem("skillbridge_jwt_token");
      setAuthToken(null);
      setUser(null);
      setIsAuthenticated(false);
      setAuthError(null);
      navigate("/login", { replace: true });
    }
  };

  // Backwards-compatible demo login helper that executes real backend login
  const loginAsRole = async (newRole: UserRole) => {
    if (newRole === "candidate") {
      await login("candidate@skillbridge.gov.in", "Password123!");
    } else if (newRole === "employer") {
      await login("employer@skillbridge.gov.in", "Password123!");
    } else {
      await login("admin@skillbridge.gov.in", "AdminPassword123!");
    }
  };

  const resetAllDemoData = () => {
    localStorage.clear();
    setRole("candidate");
    setIsAuthenticated(false);
    setUser(null);
    setLanguage("en");
    setCurrentCandidate(INITIAL_CANDIDATES[0]);
    setCandidates(INITIAL_CANDIDATES);
    setJobs(INITIAL_JOBS);
    navigate("/login", { replace: true });
    window.location.reload();
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        isAuthenticated,
        setIsAuthenticated,
        user,
        authToken,
        isAuthenticating,
        authError,
        clearAuthError,
        login,
        signup,
        logout,
        currentPath,
        navigate,
        language,
        setLanguage,
        t,
        currentCandidate,
        updateCandidateProfile,
        candidateProfile,
        fetchCandidateProfile,
        saveCandidateProfile,
        uploadResume,
        deleteResume,
        addLearningSkill,
        deleteLearningSkill,
        generateDynamicRoadmap,
        candidates,
        jobs,
        addJob,
        applications,
        applyToJob,
        savedJobIds,
        toggleSaveJob,
        assessmentResults,
        saveAssessmentResult,
        currentRoadmap,
        setRoadmap,
        toggleRoadmapWeek,
        shortlistedCandidateIds,
        toggleShortlistCandidate,
        selectedCandidateForComparison,
        toggleCompareCandidate,
        clearComparison,
        updateApplicationStatus,
        notifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        activeTab,
        setActiveTab,
        selectedJobId,
        setSelectedJobId,
        selectedCandidateId,
        setSelectedCandidateId,
        isDemoModalOpen,
        setIsDemoModalOpen,
        isAIAssistantOpen,
        setIsAIAssistantOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        loginAsRole,
        resetAllDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
