import bcrypt from "bcryptjs";
import {
  AdminCandidateRecord,
  AdminMSMERecord,
  AdminJobRecord,
  AdminApplicationRecord,
  SEED_ADMIN_CANDIDATES,
  SEED_ADMIN_MSMES,
  SEED_ADMIN_JOBS,
  SEED_ADMIN_APPLICATIONS,
  computeAdminOverviewStats,
  computeRegionalGapData,
  computeSkillDemandMatrix,
  computeMSMEClusterAnalytics,
  queryAdminDirectory,
} from "./adminData";

export type UserRoleType = "CANDIDATE" | "MSME" | "ADMIN";

export interface CandidateEducation {
  id: string;
  degree: string;
  specialization: string;
  institution: string;
  university?: string;
  startYear: string;
  endYear: string;
  score: string; // CGPA or Percentage
  coursework?: string;
}

export interface CandidateExperience {
  id: string;
  jobTitle: string;
  companyName: string;
  employmentType: "Full-time" | "Part-time" | "Internship" | "Contract";
  location: string;
  startDate: string;
  endDate: string;
  currentlyWorking: boolean;
  responsibilities: string;
  achievements?: string;
}

export interface CandidateSkillItem {
  id: string;
  name: string;
  category: "Backend" | "Frontend" | "Cloud & DevOps" | "Database" | "Data & AI" | "Core Engineering" | "Business";
  proficiency: "Beginner" | "Intermediate" | "Advanced" | "Proficient";
  verificationStatus: "Verified" | "Assessment Verified" | "Project Verified" | "Certificate Supported" | "Not Verified";
  score: number;
  assessmentScore?: number;
  yearsExperience?: number;
  verifiedDate?: string;
  projectEvidence?: string;
  certificateUrl?: string;
}

export interface CandidateLearningSkill {
  id: string;
  name: string;
  category: string;
  targetProficiency: "Intermediate" | "Advanced" | "Proficient";
  addedDate: string;
  status: "In Progress" | "Assessment Ready" | "Verified";
  assessmentScore?: number;
  notes?: string;
}

export interface CandidateProject {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  role: string;
  githubUrl?: string;
  liveDemoUrl?: string;
}

export interface CandidateCertification {
  id: string;
  name: string;
  issuingOrg: string;
  issueDate: string;
  credentialId?: string;
  credentialUrl?: string;
}

export interface CandidateAchievement {
  id: string;
  title: string;
  category: "Hackathon" | "Award" | "Competition" | "Publication" | "Leadership" | "Other";
  description: string;
  date: string;
  organization: string;
  url?: string;
}

export interface CandidateJobPreferences {
  preferredRoles: string[];
  preferredLocations: string[];
  workModes: ("Remote" | "Hybrid" | "On-site")[];
  employmentTypes: ("Full-time" | "Part-time" | "Contract" | "Internship")[];
  expectedSalary: string;
  availability: "Immediate" | "15 Days" | "1 Month" | "2 Months" | "Flexible";
}

export interface CandidateResume {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: string;
  uploadedAt: string;
  fileData?: string; // base64 / data URL
}

export interface CandidateAssessmentRecord {
  id: string;
  skillName: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  dateCompleted: string;
  proficiencyLevel: "Beginner" | "Intermediate" | "Advanced" | "Proficient";
  strengths: string[];
  needsImprovement: string[];
  recommendedNextSteps: string;
}

export interface DynamicRoadmapWeek {
  week: number;
  title: string;
  skill: string;
  whyItMatters: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  estimatedHours: number;
  recommendedProject: string;
  learningObjectives: string[];
  isCompleted: boolean;
}

export interface CandidateRoadmapRecord {
  targetRole: string;
  readinessScore: number;
  weeks: DynamicRoadmapWeek[];
  generatedDate: string;
  lastUpdated: string;
}

export interface CandidateFullProfile {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  dob?: string;
  location: string;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  headline: string;
  bio: string;
  avatarUrl?: string;
  isFresher: boolean;
  overallSkillScore: number;
  jobReadiness: number;
  verifiedSkillsCount: number;
  education: CandidateEducation[];
  experiences: CandidateExperience[];
  skills: CandidateSkillItem[];
  learningSkills: CandidateLearningSkill[];
  projects: CandidateProject[];
  certifications: CandidateCertification[];
  achievements: CandidateAchievement[];
  jobPreferences: CandidateJobPreferences;
  resume: CandidateResume | null;
  assessments: CandidateAssessmentRecord[];
  roadmap: CandidateRoadmapRecord | null;
  createdAt: string;
  updatedAt: string;
}

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRoleType;
  createdAt: string;
  updatedAt: string;
  candidateProfile?: {
    headline: string;
    location: string;
    overallSkillScore: number;
    jobReadiness: number;
    verifiedSkillsCount: number;
    education: string;
  };
  employerProfile?: {
    companyName: string;
    udyamNumber: string;
    sector: string;
    location: string;
    activeJobOpenings: number;
  };
  adminProfile?: {
    department: string;
    jurisdiction: string;
    clearanceLevel: string;
  };
}

export interface PasswordResetRecord {
  token: string;
  email: string;
  expiresAt: number;
}

// In-memory persistent database store (survives server lifecycle)
class DatabaseService {
  private users: Map<string, UserRecord> = new Map();
  private emailIndex: Map<string, string> = new Map(); // lowercase email -> user id
  private resetTokens: Map<string, PasswordResetRecord> = new Map();
  private candidateProfiles: Map<string, CandidateFullProfile> = new Map(); // userId -> CandidateFullProfile
  private adminCandidates: AdminCandidateRecord[] = [...SEED_ADMIN_CANDIDATES];
  private adminMsmes: AdminMSMERecord[] = [...SEED_ADMIN_MSMES];
  private adminJobs: AdminJobRecord[] = [...SEED_ADMIN_JOBS];
  private adminApplications: AdminApplicationRecord[] = [...SEED_ADMIN_APPLICATIONS];

  constructor() {
    this.seedInitialUsers();
    this.seedInitialCandidateProfiles();
  }

  private seedInitialCandidateProfiles() {
    console.log("[Auth DB] Seeding full candidate profiles with qualifications, experience, skills, projects, and certifications...");

    const saiPoojaProfile: CandidateFullProfile = {
      id: "prof-cand-001",
      userId: "usr-cand-001",
      name: "Sai Pooja",
      email: "candidate@skillbridge.gov.in",
      phone: "+91 98401 23456",
      dob: "2002-05-14",
      location: "Chennai, Tamil Nadu",
      linkedinUrl: "https://linkedin.com/in/saipooja-demo",
      githubUrl: "https://github.com/saipooja-demo",
      portfolioUrl: "https://saipooja.dev.demo",
      headline: "Aspiring Backend & Cloud Engineer | Java, SQL, Spring Boot",
      bio: "Results-driven computer engineering graduate with platform-verified competencies in Java (86%) and SQL (82%). Passionate about architecting scalable microservices, resilient APIs, and enterprise cloud systems for high-growth Indian MSMEs.",
      avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=250&auto=format&fit=crop&q=80",
      isFresher: false,
      overallSkillScore: 82,
      jobReadiness: 78,
      verifiedSkillsCount: 8,
      education: [
        {
          id: "edu-1",
          degree: "Bachelor of Technology (B.Tech)",
          specialization: "Computer Science and Engineering",
          institution: "College of Engineering, Guindy, Anna University",
          university: "Anna University",
          startYear: "2020",
          endYear: "2024",
          score: "8.4 CGPA",
          coursework: "Data Structures & Algorithms, Database Management Systems, Operating Systems, Distributed Systems, Cloud Computing",
        },
        {
          id: "edu-2",
          degree: "Higher Secondary Certificate (HSC - 12th)",
          specialization: "Physics, Chemistry, Mathematics & Computer Science",
          institution: "Kendriya Vidyalaya, IIT Madras Campus",
          university: "CBSE",
          startYear: "2018",
          endYear: "2020",
          score: "94.2%",
          coursework: "Computer Science, Mathematics, Physics",
        }
      ],
      experiences: [
        {
          id: "exp-1",
          jobTitle: "Software Engineering Intern",
          companyName: "TVS Digital & Logistics Solutions",
          employmentType: "Internship",
          location: "Chennai, Tamil Nadu",
          startDate: "2023-06-01",
          endDate: "2023-12-15",
          currentlyWorking: false,
          responsibilities: "Developed RESTful microservice APIs in Java Spring Boot for supply chain shipment tracking. Optimized PostgreSQL database queries reducing API response times by 32%.",
          achievements: "Built an automated webhook verification handler for real-time truck telematics notifications.",
        },
        {
          id: "exp-2",
          jobTitle: "Junior Backend Developer (Project Associate)",
          companyName: "Zenith MSME Industrial Automation",
          employmentType: "Full-time",
          location: "Chennai, Tamil Nadu",
          startDate: "2024-01-10",
          endDate: "2024-11-30",
          currentlyWorking: false,
          responsibilities: "Designed and maintained inventory management database schemas and background worker queues for small-scale manufacturer order portals.",
          achievements: "Integrated JWT authentication and role-based access control across 14 MSME vendor endpoints.",
        }
      ],
      skills: [
        { id: "sk-1", name: "Java", category: "Backend", proficiency: "Advanced", score: 86, verificationStatus: "Verified", verifiedDate: "2025-01-15", assessmentScore: 91, yearsExperience: 2, projectEvidence: "E-Commerce Inventory Service (GitHub Repo + Live Deployment)" },
        { id: "sk-2", name: "SQL", category: "Database", proficiency: "Advanced", score: 82, verificationStatus: "Verified", verifiedDate: "2025-01-20", assessmentScore: 84, yearsExperience: 2, projectEvidence: "PostgreSQL Schema & Query Optimization Benchmarks" },
        { id: "sk-3", name: "React", category: "Frontend", proficiency: "Intermediate", score: 74, verificationStatus: "Assessment Verified", verifiedDate: "2025-02-01", assessmentScore: 76, yearsExperience: 1 },
        { id: "sk-4", name: "Spring Boot", category: "Backend", proficiency: "Intermediate", score: 68, verificationStatus: "Project Verified", verifiedDate: "2025-02-10", yearsExperience: 1, projectEvidence: "Order Processing REST API with JWT Auth" },
        { id: "sk-5", name: "Git", category: "Core Engineering", proficiency: "Advanced", score: 88, verificationStatus: "Verified", verifiedDate: "2025-01-10", assessmentScore: 92, yearsExperience: 3 },
        { id: "sk-6", name: "REST APIs", category: "Backend", proficiency: "Advanced", score: 79, verificationStatus: "Assessment Verified", verifiedDate: "2025-02-05", assessmentScore: 80, yearsExperience: 2 },
        { id: "sk-7", name: "Docker", category: "Cloud & DevOps", proficiency: "Intermediate", score: 62, verificationStatus: "Assessment Verified", verifiedDate: "2025-02-18", assessmentScore: 65, yearsExperience: 1 },
        { id: "sk-8", name: "Data Structures", category: "Core Engineering", proficiency: "Advanced", score: 80, verificationStatus: "Assessment Verified", verifiedDate: "2025-01-25", assessmentScore: 83, yearsExperience: 3 },
      ],
      learningSkills: [
        { id: "lsk-1", name: "AWS Cloud Architecture", category: "Cloud & DevOps", targetProficiency: "Intermediate", addedDate: "2025-02-10", status: "Assessment Ready", assessmentScore: 54 },
        { id: "lsk-2", name: "Kubernetes & Microservices", category: "Cloud & DevOps", targetProficiency: "Advanced", addedDate: "2025-02-15", status: "In Progress" },
        { id: "lsk-3", name: "Redis Caching", category: "Database", targetProficiency: "Intermediate", addedDate: "2025-02-22", status: "In Progress" }
      ],
      projects: [
        {
          id: "proj-1",
          name: "MSME Vendor Order Management System",
          description: "A production-grade backend service built with Java Spring Boot and PostgreSQL handling purchase orders, invoice generation, and status tracking for manufacturing suppliers.",
          technologies: ["Java", "Spring Boot", "PostgreSQL", "Docker", "JWT", "REST APIs"],
          role: "Lead Backend Architect",
          githubUrl: "https://github.com/saipooja-demo/msme-order-system",
          liveDemoUrl: "https://msme-orders.saipooja.demo",
        },
        {
          id: "proj-2",
          name: "Industrial IoT Telemetry Sensor Ingestion",
          description: "High-throughput data ingestion pipeline processing machine vibration and temperature telemetry data with timeseries database indexing and alerting.",
          technologies: ["Node.js", "Redis", "TimescaleDB", "React", "Tailwind CSS"],
          role: "Full Stack Developer",
          githubUrl: "https://github.com/saipooja-demo/iot-telemetry-engine",
        }
      ],
      certifications: [
        {
          id: "cert-1",
          name: "Oracle Certified Professional: Java SE 11 Developer",
          issuingOrg: "Oracle University",
          issueDate: "2024-03-15",
          credentialId: "OCP-JAVA-894210",
          credentialUrl: "https://catalog-education.oracle.com/ords/certview/sharebadge?id=demo",
        },
        {
          id: "cert-2",
          name: "AWS Certified Cloud Practitioner",
          issuingOrg: "Amazon Web Services (AWS)",
          issueDate: "2024-07-20",
          credentialId: "AWS-CCP-773194",
          credentialUrl: "https://aws.amazon.com/verification/demo",
        }
      ],
      achievements: [
        {
          id: "ach-1",
          title: "1st Place Winner - Tamil Nadu Smart MSME Hackathon 2024",
          category: "Hackathon",
          description: "Engineered an AI-driven invoice reconciliation microservice that automates GST compliance for rural textile manufacturers.",
          date: "2024-08-25",
          organization: "Tamil Nadu Guidance Bureau & TNeGA",
        },
        {
          id: "ach-2",
          title: "Academic Excellence Award in Computer Science",
          category: "Award",
          description: "Awarded top 5% rank in Anna University Department of Computer Technology for final year capstone thesis.",
          date: "2024-05-10",
          organization: "Anna University",
        }
      ],
      jobPreferences: {
        preferredRoles: ["Java Backend Developer", "Full Stack Developer", "Software Engineer", "Cloud Backend Associate"],
        preferredLocations: ["Chennai", "Bengaluru", "Hyderabad", "Coimbatore"],
        workModes: ["Hybrid", "On-site", "Remote"],
        employmentTypes: ["Full-time", "Internship"],
        expectedSalary: "₹6,00,000 - ₹9,50,000 LPA",
        availability: "Immediate",
      },
      resume: {
        id: "res-1",
        fileName: "Sai_Pooja_Java_Backend_Engineer_Resume.pdf",
        fileType: "application/pdf",
        fileSize: "248 KB",
        uploadedAt: "2025-02-15T14:30:00Z",
        fileData: "data:application/pdf;base64,JVBERi0xLjQKJcTl8uXr...",
      },
      assessments: [
        {
          id: "as-1",
          skillName: "Java",
          difficulty: "Intermediate",
          score: 86,
          totalQuestions: 4,
          correctAnswers: 4,
          dateCompleted: "2025-01-15",
          proficiencyLevel: "Advanced",
          strengths: ["OOP Architecture & Encapsulation", "Collections Framework optimization", "Exception Handling"],
          needsImprovement: ["JVM Memory Garbage Collection tuning", "Multi-threaded concurrency"],
          recommendedNextSteps: "Your Java core fundamentals are verified. Proceed into Spring Boot dependency injection and microservice REST APIs.",
        },
        {
          id: "as-2",
          skillName: "SQL",
          difficulty: "Intermediate",
          score: 82,
          totalQuestions: 4,
          correctAnswers: 3,
          dateCompleted: "2025-01-20",
          proficiencyLevel: "Advanced",
          strengths: ["Relational Joins (INNER, LEFT, FULL)", "ACID Transaction Isolation", "Indexing"],
          needsImprovement: ["Window functions (PARTITION BY)", "Execution Plan Optimization"],
          recommendedNextSteps: "Solid database foundation. Recommended next step: combine with an ORM like Hibernate or Prisma.",
        },
      ],
      roadmap: null, // Will be generated dynamically based on candidate data!
      createdAt: new Date("2025-01-15T09:00:00Z").toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.candidateProfiles.set("usr-cand-001", saiPoojaProfile);

    // Also mirror to usr-cand-002 alias
    this.candidateProfiles.set("usr-cand-002", {
      ...saiPoojaProfile,
      id: "prof-cand-002",
      userId: "usr-cand-002",
      email: "candidate@skillbridge.demo",
    });
  }

  private seedInitialUsers() {
    console.log("[Auth DB] Seeding verified national workforce demo accounts with bcrypt password hashes...");

    const demoPasswordHash = bcrypt.hashSync("Password123!", 10);
    const adminPasswordHash = bcrypt.hashSync("AdminPassword123!", 10);

    // 1. Candidate Demo Account
    const candidateUser: UserRecord = {
      id: "usr-cand-001",
      name: "Sai Pooja",
      email: "candidate@skillbridge.gov.in",
      passwordHash: demoPasswordHash,
      role: "CANDIDATE",
      createdAt: new Date("2025-01-15T09:00:00Z").toISOString(),
      updatedAt: new Date().toISOString(),
      candidateProfile: {
        headline: "Aspiring Backend & Cloud Engineer | Java, SQL, Spring Boot",
        location: "Chennai, Tamil Nadu",
        overallSkillScore: 82,
        jobReadiness: 78,
        verifiedSkillsCount: 8,
        education: "B.Tech CSE - Anna University",
      },
    };
    this.saveUser(candidateUser);

    // Candidate alias for demo compatibility
    const candidateUserAlias: UserRecord = {
      ...candidateUser,
      id: "usr-cand-002",
      email: "candidate@skillbridge.demo",
    };
    this.saveUser(candidateUserAlias);

    // 2. MSME Employer Demo Account
    const employerUser: UserRecord = {
      id: "usr-msme-001",
      name: "TechCraft Precision Engineering MSME",
      email: "employer@skillbridge.gov.in",
      passwordHash: demoPasswordHash,
      role: "MSME",
      createdAt: new Date("2025-01-20T10:30:00Z").toISOString(),
      updatedAt: new Date().toISOString(),
      employerProfile: {
        companyName: "TechCraft Solutions Pvt Ltd",
        udyamNumber: "UDYAM-TN-03-0048291",
        sector: "Industrial Automation & Software Services",
        location: "Coimbatore, Tamil Nadu",
        activeJobOpenings: 4,
      },
    };
    this.saveUser(employerUser);

    // MSME alias for demo compatibility
    const employerUserAlias: UserRecord = {
      ...employerUser,
      id: "usr-msme-002",
      email: "employer@skillbridge.demo",
    };
    this.saveUser(employerUserAlias);

    // 3. National Administrator Demo Account
    const adminUser: UserRecord = {
      id: "usr-adm-001",
      name: "Dr. Rameshwar Rao",
      email: "admin@skillbridge.gov.in",
      passwordHash: adminPasswordHash,
      role: "ADMIN",
      createdAt: new Date("2025-01-01T08:00:00Z").toISOString(),
      updatedAt: new Date().toISOString(),
      adminProfile: {
        department: "National Skill Development & MSME Workforce Cell",
        jurisdiction: "All Indian States & Union Territories",
        clearanceLevel: "Level-5 National Executive Analyst",
      },
    };
    this.saveUser(adminUser);

    // Admin alias for demo compatibility
    const adminUserAlias: UserRecord = {
      ...adminUser,
      id: "usr-adm-002",
      email: "admin@skillbridge.demo",
    };
    this.saveUser(adminUserAlias);

    console.log(`[Auth DB] Seeded ${this.users.size} accounts with bcrypt security.`);
  }

  private saveUser(user: UserRecord) {
    this.users.set(user.id, user);
    this.emailIndex.set(user.email.toLowerCase(), user.id);
  }

  public findByEmail(email: string): UserRecord | null {
    if (!email) return null;
    const userId = this.emailIndex.get(email.trim().toLowerCase());
    if (!userId) return null;
    return this.users.get(userId) || null;
  }

  // Demo Admin Generator for Hackathon Evaluation Access
  public getOrCreateDemoAdmin(email: string): UserRecord {
    const cleanEmail = (email || "").trim().toLowerCase();
    const existing = this.findByEmail(cleanEmail);
    if (existing && existing.role === "ADMIN") {
      return existing;
    }

    const adminId = `usr-adm-demo-${Date.now()}`;
    const demoAdmin: UserRecord = {
      id: adminId,
      name: "National Workforce Administrator",
      email: cleanEmail || "admin.evaluator@skillbridge.gov.in",
      passwordHash: bcrypt.hashSync("demo", 10),
      role: "ADMIN",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      adminProfile: {
        department: "National Skill Development & MSME Workforce Cell",
        jurisdiction: "All Indian States & Union Territories",
        clearanceLevel: "Level-5 National Executive Analyst",
      },
    };

    this.saveUser(demoAdmin);
    return demoAdmin;
  }

  public findById(id: string): UserRecord | null {
    if (!id) return null;
    return this.users.get(id) || null;
  }

  public createUser(params: {
    name: string;
    email: string;
    password: string;
    role: "CANDIDATE" | "MSME";
    companyName?: string;
  }): { user?: UserRecord; error?: string } {
    const cleanEmail = params.email.trim().toLowerCase();

    if (!params.name || params.name.trim().length < 2) {
      return { error: "Full name is required (minimum 2 characters)." };
    }

    if (!cleanEmail || !cleanEmail.includes("@")) {
      return { error: "A valid email address is required." };
    }

    if (this.emailIndex.has(cleanEmail)) {
      return { error: "An account with this email address already exists." };
    }

    if (!params.password || params.password.length < 6) {
      return { error: "Password must be at least 6 characters long." };
    }

    // Explicit security check: Prevent privilege escalation to ADMIN via public registration
    if (params.role !== "CANDIDATE" && params.role !== "MSME") {
      return { error: "Invalid registration role. Administrator accounts cannot be created publicly." };
    }

    const passwordHash = bcrypt.hashSync(params.password, 10);
    const userId = `usr-${params.role.toLowerCase()}-${Date.now()}`;

    const newUser: UserRecord = {
      id: userId,
      name: params.name.trim(),
      email: cleanEmail,
      passwordHash,
      role: params.role,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      candidateProfile:
        params.role === "CANDIDATE"
          ? {
              headline: "Newly Registered Candidate",
              location: "India",
              overallSkillScore: 70,
              jobReadiness: 65,
              verifiedSkillsCount: 0,
              education: "Undergraduate / Diploma",
            }
          : undefined,
      employerProfile:
        params.role === "MSME"
          ? {
              companyName: params.companyName?.trim() || `${params.name}'s Enterprise`,
              udyamNumber: `UDYAM-REG-${Math.floor(100000 + Math.random() * 900000)}`,
              sector: "General MSME Services & Manufacturing",
              location: "India",
              activeJobOpenings: 0,
            }
          : undefined,
    };

    this.saveUser(newUser);

    // If candidate, initialize their full persistent profile record
    if (params.role === "CANDIDATE") {
      const initialCandidateProfile: CandidateFullProfile = {
        id: `prof-${userId}`,
        userId: userId,
        name: params.name.trim(),
        email: cleanEmail,
        phone: "",
        location: "India",
        headline: "Aspiring Professional",
        bio: `Eager to apply academic knowledge and develop industry skills in high-growth MSME environments.`,
        isFresher: true,
        overallSkillScore: 70,
        jobReadiness: 65,
        verifiedSkillsCount: 0,
        education: [],
        experiences: [],
        skills: [],
        learningSkills: [],
        projects: [],
        certifications: [],
        achievements: [],
        jobPreferences: {
          preferredRoles: ["Software Engineer", "Junior Developer"],
          preferredLocations: ["Flexible"],
          workModes: ["Hybrid", "On-site"],
          employmentTypes: ["Full-time"],
          expectedSalary: "Competitive",
          availability: "Immediate",
        },
        resume: null,
        assessments: [],
        roadmap: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      this.candidateProfiles.set(userId, initialCandidateProfile);
    }

    return { user: newUser };
  }

  public createPasswordReset(email: string): string | null {
    const user = this.findByEmail(email);
    if (!user) return null;

    const token = `reset_${Math.random().toString(36).substring(2, 15)}_${Date.now()}`;
    const expiresAt = Date.now() + 1000 * 60 * 60; // 1 hour expiry
    this.resetTokens.set(token, { token, email: user.email, expiresAt });
    return token;
  }

  public verifyAndResetPassword(token: string, newPassword: string): { success: boolean; error?: string } {
    const record = this.resetTokens.get(token);
    if (!record) {
      return { success: false, error: "Invalid or expired password reset token." };
    }

    if (Date.now() > record.expiresAt) {
      this.resetTokens.delete(token);
      return { success: false, error: "Password reset token has expired. Please request a new one." };
    }

    if (!newPassword || newPassword.length < 6) {
      return { success: false, error: "New password must be at least 6 characters long." };
    }

    const user = this.findByEmail(record.email);
    if (!user) {
      return { success: false, error: "Associated user account was not found." };
    }

    user.passwordHash = bcrypt.hashSync(newPassword, 10);
    user.updatedAt = new Date().toISOString();
    this.resetTokens.delete(token);

    return { success: true };
  }

  // ==========================================
  // CANDIDATE PROFILE PERSISTENCE & CRUD
  // ==========================================

  public getCandidateProfile(userId: string): CandidateFullProfile | null {
    // If not existing, try creating one for existing candidate user
    let profile = this.candidateProfiles.get(userId);
    if (!profile) {
      const user = this.findById(userId);
      if (user && user.role === "CANDIDATE") {
        profile = {
          id: `prof-${userId}`,
          userId: user.id,
          name: user.name,
          email: user.email,
          phone: "+91 98400 00000",
          location: user.candidateProfile?.location || "India",
          headline: user.candidateProfile?.headline || "Software Candidate",
          bio: "Passionate engineer eager to contribute to high-impact Indian MSME projects.",
          isFresher: false,
          overallSkillScore: user.candidateProfile?.overallSkillScore || 75,
          jobReadiness: user.candidateProfile?.jobReadiness || 70,
          verifiedSkillsCount: user.candidateProfile?.verifiedSkillsCount || 0,
          education: [],
          experiences: [],
          skills: [],
          learningSkills: [],
          projects: [],
          certifications: [],
          achievements: [],
          jobPreferences: {
            preferredRoles: ["Developer"],
            preferredLocations: ["Bengaluru", "Chennai"],
            workModes: ["Hybrid"],
            employmentTypes: ["Full-time"],
            expectedSalary: "As per industry standards",
            availability: "Immediate",
          },
          resume: null,
          assessments: [],
          roadmap: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        this.candidateProfiles.set(userId, profile);
      }
    }
    return profile || null;
  }

  public updateCandidateProfile(userId: string, updates: Partial<CandidateFullProfile>): CandidateFullProfile | null {
    const profile = this.getCandidateProfile(userId);
    if (!profile) return null;

    Object.assign(profile, updates, { updatedAt: new Date().toISOString() });
    
    // Also sync user record name if updated
    if (updates.name) {
      const user = this.findById(userId);
      if (user) {
        user.name = updates.name;
        user.updatedAt = new Date().toISOString();
      }
    }

    return profile;
  }

  // Qualifications
  public addQualification(userId: string, qual: Omit<CandidateEducation, "id">): CandidateEducation | null {
    const profile = this.getCandidateProfile(userId);
    if (!profile) return null;
    const newQual: CandidateEducation = {
      ...qual,
      id: `edu-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    };
    profile.education.unshift(newQual);
    profile.updatedAt = new Date().toISOString();
    return newQual;
  }

  public updateQualification(userId: string, id: string, qual: Partial<CandidateEducation>): CandidateEducation | null {
    const profile = this.getCandidateProfile(userId);
    if (!profile) return null;
    const idx = profile.education.findIndex((e) => e.id === id);
    if (idx === -1) return null;
    profile.education[idx] = { ...profile.education[idx], ...qual };
    profile.updatedAt = new Date().toISOString();
    return profile.education[idx];
  }

  public deleteQualification(userId: string, id: string): boolean {
    const profile = this.getCandidateProfile(userId);
    if (!profile) return false;
    const initialLen = profile.education.length;
    profile.education = profile.education.filter((e) => e.id !== id);
    profile.updatedAt = new Date().toISOString();
    return profile.education.length < initialLen;
  }

  // Experience
  public addExperience(userId: string, exp: Omit<CandidateExperience, "id">): CandidateExperience | null {
    const profile = this.getCandidateProfile(userId);
    if (!profile) return null;
    const newExp: CandidateExperience = {
      ...exp,
      id: `exp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    };
    profile.experiences.unshift(newExp);
    profile.isFresher = false;
    profile.updatedAt = new Date().toISOString();
    return newExp;
  }

  public updateExperience(userId: string, id: string, exp: Partial<CandidateExperience>): CandidateExperience | null {
    const profile = this.getCandidateProfile(userId);
    if (!profile) return null;
    const idx = profile.experiences.findIndex((e) => e.id === id);
    if (idx === -1) return null;
    profile.experiences[idx] = { ...profile.experiences[idx], ...exp };
    profile.updatedAt = new Date().toISOString();
    return profile.experiences[idx];
  }

  public deleteExperience(userId: string, id: string): boolean {
    const profile = this.getCandidateProfile(userId);
    if (!profile) return false;
    const initialLen = profile.experiences.length;
    profile.experiences = profile.experiences.filter((e) => e.id !== id);
    profile.updatedAt = new Date().toISOString();
    return profile.experiences.length < initialLen;
  }

  // Skills
  public addSkill(userId: string, skill: Omit<CandidateSkillItem, "id">): CandidateSkillItem | null {
    const profile = this.getCandidateProfile(userId);
    if (!profile) return null;
    const newSkill: CandidateSkillItem = {
      ...skill,
      id: `sk-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    };
    profile.skills.push(newSkill);
    this.recalculateSkillStats(profile);
    profile.updatedAt = new Date().toISOString();
    return newSkill;
  }

  public updateSkill(userId: string, id: string, skill: Partial<CandidateSkillItem>): CandidateSkillItem | null {
    const profile = this.getCandidateProfile(userId);
    if (!profile) return null;
    const idx = profile.skills.findIndex((s) => s.id === id);
    if (idx === -1) return null;
    profile.skills[idx] = { ...profile.skills[idx], ...skill };
    this.recalculateSkillStats(profile);
    profile.updatedAt = new Date().toISOString();
    return profile.skills[idx];
  }

  public deleteSkill(userId: string, id: string): boolean {
    const profile = this.getCandidateProfile(userId);
    if (!profile) return false;
    const initialLen = profile.skills.length;
    profile.skills = profile.skills.filter((s) => s.id !== id);
    this.recalculateSkillStats(profile);
    profile.updatedAt = new Date().toISOString();
    return profile.skills.length < initialLen;
  }

  private recalculateSkillStats(profile: CandidateFullProfile) {
    if (profile.skills.length === 0) {
      profile.overallSkillScore = 60;
      profile.verifiedSkillsCount = 0;
      return;
    }
    const total = profile.skills.reduce((acc, s) => acc + (s.score || 70), 0);
    profile.overallSkillScore = Math.round(total / profile.skills.length);
    profile.verifiedSkillsCount = profile.skills.filter(
      (s) => s.verificationStatus === "Verified" || s.verificationStatus === "Assessment Verified"
    ).length;
    profile.jobReadiness = Math.min(100, Math.round(profile.overallSkillScore * 0.8 + profile.verifiedSkillsCount * 2.5));
  }

  // Learning Skills
  public addLearningSkill(userId: string, skill: { name: string; category?: string; targetProficiency?: any; notes?: string }): CandidateLearningSkill | null {
    const profile = this.getCandidateProfile(userId);
    if (!profile) return null;
    
    // Check if already in learning
    const exists = profile.learningSkills.find((s) => s.name.toLowerCase() === skill.name.toLowerCase());
    if (exists) return exists;

    const newLearning: CandidateLearningSkill = {
      id: `lsk-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: skill.name.trim(),
      category: skill.category || "Backend",
      targetProficiency: skill.targetProficiency || "Intermediate",
      addedDate: new Date().toISOString().split("T")[0],
      status: "Assessment Ready",
      notes: skill.notes,
    };
    profile.learningSkills.push(newLearning);
    profile.updatedAt = new Date().toISOString();
    return newLearning;
  }

  public deleteLearningSkill(userId: string, id: string): boolean {
    const profile = this.getCandidateProfile(userId);
    if (!profile) return false;
    const initialLen = profile.learningSkills.length;
    profile.learningSkills = profile.learningSkills.filter((s) => s.id !== id && s.name !== id);
    profile.updatedAt = new Date().toISOString();
    return profile.learningSkills.length < initialLen;
  }

  // Projects
  public addProject(userId: string, project: Omit<CandidateProject, "id">): CandidateProject | null {
    const profile = this.getCandidateProfile(userId);
    if (!profile) return null;
    const newProj: CandidateProject = {
      ...project,
      id: `proj-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    };
    profile.projects.unshift(newProj);
    profile.updatedAt = new Date().toISOString();
    return newProj;
  }

  public updateProject(userId: string, id: string, project: Partial<CandidateProject>): CandidateProject | null {
    const profile = this.getCandidateProfile(userId);
    if (!profile) return null;
    const idx = profile.projects.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    profile.projects[idx] = { ...profile.projects[idx], ...project };
    profile.updatedAt = new Date().toISOString();
    return profile.projects[idx];
  }

  public deleteProject(userId: string, id: string): boolean {
    const profile = this.getCandidateProfile(userId);
    if (!profile) return false;
    const initialLen = profile.projects.length;
    profile.projects = profile.projects.filter((p) => p.id !== id);
    profile.updatedAt = new Date().toISOString();
    return profile.projects.length < initialLen;
  }

  // Certifications
  public addCertification(userId: string, cert: Omit<CandidateCertification, "id">): CandidateCertification | null {
    const profile = this.getCandidateProfile(userId);
    if (!profile) return null;
    const newCert: CandidateCertification = {
      ...cert,
      id: `cert-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    };
    profile.certifications.unshift(newCert);
    profile.updatedAt = new Date().toISOString();
    return newCert;
  }

  public updateCertification(userId: string, id: string, cert: Partial<CandidateCertification>): CandidateCertification | null {
    const profile = this.getCandidateProfile(userId);
    if (!profile) return null;
    const idx = profile.certifications.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    profile.certifications[idx] = { ...profile.certifications[idx], ...cert };
    profile.updatedAt = new Date().toISOString();
    return profile.certifications[idx];
  }

  public deleteCertification(userId: string, id: string): boolean {
    const profile = this.getCandidateProfile(userId);
    if (!profile) return false;
    const initialLen = profile.certifications.length;
    profile.certifications = profile.certifications.filter((c) => c.id !== id);
    profile.updatedAt = new Date().toISOString();
    return profile.certifications.length < initialLen;
  }

  // Achievements
  public addAchievement(userId: string, ach: Omit<CandidateAchievement, "id">): CandidateAchievement | null {
    const profile = this.getCandidateProfile(userId);
    if (!profile) return null;
    const newAch: CandidateAchievement = {
      ...ach,
      id: `ach-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    };
    profile.achievements.unshift(newAch);
    profile.updatedAt = new Date().toISOString();
    return newAch;
  }

  public updateAchievement(userId: string, id: string, ach: Partial<CandidateAchievement>): CandidateAchievement | null {
    const profile = this.getCandidateProfile(userId);
    if (!profile) return null;
    const idx = profile.achievements.findIndex((a) => a.id === id);
    if (idx === -1) return null;
    profile.achievements[idx] = { ...profile.achievements[idx], ...ach };
    profile.updatedAt = new Date().toISOString();
    return profile.achievements[idx];
  }

  public deleteAchievement(userId: string, id: string): boolean {
    const profile = this.getCandidateProfile(userId);
    if (!profile) return false;
    const initialLen = profile.achievements.length;
    profile.achievements = profile.achievements.filter((a) => a.id !== id);
    profile.updatedAt = new Date().toISOString();
    return profile.achievements.length < initialLen;
  }

  // Job Preferences
  public updateJobPreferences(userId: string, prefs: CandidateJobPreferences): CandidateJobPreferences | null {
    const profile = this.getCandidateProfile(userId);
    if (!profile) return null;
    profile.jobPreferences = prefs;
    profile.updatedAt = new Date().toISOString();
    return profile.jobPreferences;
  }

  // Resume
  public saveResume(userId: string, resume: { fileName: string; fileType: string; fileSize: string; fileData?: string }): CandidateResume | null {
    const profile = this.getCandidateProfile(userId);
    if (!profile) return null;
    const newResume: CandidateResume = {
      id: `res-${Date.now()}`,
      fileName: resume.fileName,
      fileType: resume.fileType,
      fileSize: resume.fileSize,
      fileData: resume.fileData,
      uploadedAt: new Date().toISOString(),
    };
    profile.resume = newResume;
    profile.updatedAt = new Date().toISOString();
    return newResume;
  }

  public deleteResume(userId: string): boolean {
    const profile = this.getCandidateProfile(userId);
    if (!profile) return false;
    profile.resume = null;
    profile.updatedAt = new Date().toISOString();
    return true;
  }

  // Assessments
  public saveAssessment(userId: string, result: Omit<CandidateAssessmentRecord, "id">): CandidateAssessmentRecord | null {
    const profile = this.getCandidateProfile(userId);
    if (!profile) return null;
    const newAssessment: CandidateAssessmentRecord = {
      ...result,
      id: `as-${Date.now()}`,
    };
    profile.assessments.unshift(newAssessment);

    // If candidate has this in learning skills, update learning status & score
    const learningIdx = profile.learningSkills.findIndex(
      (l) => l.name.toLowerCase() === result.skillName.toLowerCase()
    );
    if (learningIdx !== -1) {
      profile.learningSkills[learningIdx].status = result.score >= 65 ? "Verified" : "In Progress";
      profile.learningSkills[learningIdx].assessmentScore = result.score;
    }

    // Also update or add to candidate skills transcript
    const existingSkill = profile.skills.find(
      (s) => s.name.toLowerCase() === result.skillName.toLowerCase()
    );
    if (existingSkill) {
      existingSkill.score = Math.max(existingSkill.score, result.score);
      existingSkill.assessmentScore = result.score;
      existingSkill.verificationStatus = "Assessment Verified";
      existingSkill.verifiedDate = result.dateCompleted;
      existingSkill.proficiency = result.proficiencyLevel;
    } else {
      profile.skills.push({
        id: `sk-${Date.now()}`,
        name: result.skillName,
        category: "Backend",
        score: result.score,
        assessmentScore: result.score,
        verificationStatus: "Assessment Verified",
        verifiedDate: result.dateCompleted,
        proficiency: result.proficiencyLevel,
      });
    }

    this.recalculateSkillStats(profile);
    profile.updatedAt = new Date().toISOString();
    return newAssessment;
  }

  // Roadmap
  public saveRoadmap(userId: string, roadmap: CandidateRoadmapRecord | null): CandidateRoadmapRecord | null {
    const profile = this.getCandidateProfile(userId);
    if (!profile) return null;
    profile.roadmap = roadmap;
    profile.updatedAt = new Date().toISOString();
    return profile.roadmap;
  }

  // ==========================================
  // NATIONAL WORKFORCE ADMIN ANALYTICS ENGINE
  // ==========================================

  public getAdminOverviewStats() {
    return computeAdminOverviewStats(
      this.adminCandidates,
      this.adminMsmes,
      this.adminJobs,
      this.adminApplications
    );
  }

  public getRegionalGapData(filterState?: string, filterSector?: string) {
    return computeRegionalGapData(
      this.adminCandidates,
      this.adminMsmes,
      this.adminJobs,
      filterState,
      filterSector
    );
  }

  public getSkillDemandMatrix(params?: { category?: string; region?: string }) {
    return computeSkillDemandMatrix(
      this.adminCandidates,
      this.adminJobs,
      params?.category,
      params?.region
    );
  }

  public getMSMEClusterAnalytics(params?: { cluster?: string; sector?: string }) {
    return computeMSMEClusterAnalytics(
      this.adminMsmes,
      this.adminJobs,
      this.adminCandidates,
      params?.cluster,
      params?.sector
    );
  }

  public getAdminDirectory(params: {
    type?: "candidate" | "msme" | "all";
    query?: string;
    state?: string;
    sector?: string;
    status?: string;
    page?: number;
    limit?: number;
  }) {
    return queryAdminDirectory(
      this.adminCandidates,
      this.adminMsmes,
      this.adminJobs,
      params
    );
  }

  public getAllAdminDataForAI() {
    const overview = this.getAdminOverviewStats();
    const regional = this.getRegionalGapData();
    const skills = this.getSkillDemandMatrix();
    const clusters = this.getMSMEClusterAnalytics();
    return {
      overview,
      regionalGaps: regional.regionalGaps.slice(0, 6),
      topSkillShortages: skills.skills.filter((s) => s.urgency === "Critical Shortage" || s.urgency === "High Demand").slice(0, 8),
      priorityClusters: clusters.clusters.slice(0, 5),
    };
  }
}

export const db = new DatabaseService();

