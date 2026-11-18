export type UserRole = "candidate" | "employer" | "admin";
export type BackendRole = "CANDIDATE" | "MSME" | "ADMIN";

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
  skills: SkillItem[];
  learningSkills: CandidateLearningSkill[];
  projects: CandidateProject[];
  certifications: CandidateCertification[];
  achievements: CandidateAchievement[];
  jobPreferences: CandidateJobPreferences;
  resume: CandidateResume | null;
  assessments: AssessmentResult[];
  roadmap: LearningRoadmap | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: BackendRole;
  createdAt?: string;
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

export type Language = "en" | "ta" | "hi" | "te" | "kn";

export type VerificationStatus = 
  | "Verified" 
  | "Assessment Verified" 
  | "Project Verified" 
  | "Certificate Supported" 
  | "Not Verified";

export interface SkillItem {
  id: string;
  name: string;
  category: "Backend" | "Frontend" | "Cloud & DevOps" | "Database" | "Data & AI" | "Core Engineering" | "Business";
  score: number; // 0-100
  verificationStatus: VerificationStatus;
  verifiedDate?: string;
  assessmentScore?: number;
  projectEvidence?: string;
  certificateUrl?: string;
}

export type CandidateSkill = SkillItem;

export interface CandidateProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  headline: string;
  location: string;
  preferredLocations: string[];
  education: {
    degree: string;
    institution: string;
    year: string;
    score: string;
  };
  experienceYears: number;
  experienceSummary: string;
  overallSkillScore: number;
  jobReadiness: number;
  verifiedSkillsCount: number;
  skills: SkillItem[];
  preferredRoles: string[];
  workModePreference: "Remote" | "Hybrid" | "On-site" | "Flexible";
  languages: string[];
  bio: string;
  portfolioUrl?: string;
  githubUrl?: string;
  avatarUrl?: string;
}

export interface JobRequirementSkill {
  skill: string;
  priority: "High" | "Medium" | "Low";
  minScore: number;
  weight: number;
}

export type SkillRequirement = JobRequirementSkill;

export interface JobPosting {
  id: string;
  title: string;
  companyId: string;
  companyName: string;
  companyLogo?: string;
  location: string;
  workMode: "On-site" | "Hybrid" | "Remote";
  salaryRange: string;
  experienceRequired: string;
  minExperienceYears: number;
  requiredSkills: JobRequirementSkill[];
  preferredSkills: string[];
  education: string;
  description: string;
  postedDate: string;
  vacancies: number;
  applicantsCount: number;
  status: "Active" | "Closed" | "Draft";
  msmeCategory: "Micro" | "Small" | "Medium" | "Startup";
}

export interface MatchScoreBreakdown {
  overallScore: number;
  skillCompatibility: number; // 40% weight
  verifiedSkillsScore: number; // 20% weight
  experienceMatch: number; // 15% weight
  educationMatch: number; // 10% weight
  locationMatch: number; // 5% weight
  potentialGrowth: number; // 10% weight
  matchingSkills: { skill: string; candidateScore: number; requiredPriority: string }[];
  missingSkills: { skill: string; priority: string; reason: string }[];
  aiExplanation: string;
}

export type ApplicationStatus = 
  | "Applied" 
  | "Shortlisted" 
  | "Assessment" 
  | "Interview" 
  | "Selected" 
  | "Rejected";

export interface JobApplication {
  id: string;
  jobId: string;
  candidateId: string;
  appliedDate: string;
  status: ApplicationStatus;
  timeline: {
    status: ApplicationStatus;
    date: string;
    notes?: string;
  }[];
  matchScore: number;
  candidateNotes?: string;
  employerNotes?: string;
}

export interface AssessmentQuestion {
  id: number;
  question: string;
  type: "mcq" | "scenario" | "practical" | "conceptual";
  options: string[];
  correctAnswer: number;
  explanation: string;
  topic: string;
}

export interface AssessmentResult {
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

export interface RoadmapWeek {
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

export interface LearningRoadmap {
  targetRole: string;
  readinessScore: number;
  weeks: RoadmapWeek[];
  generatedDate: string;
  lastUpdated: string;
}

export interface NotificationItem {
  id: string;
  type: "match" | "assessment" | "verification" | "application" | "roadmap" | "system";
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
}

export interface MSMECompany {
  id: string;
  name: string;
  sector?: string;
  category?: "Micro" | "Small" | "Medium" | "Startup";
  location: string;
  employeeCount?: string;
  udyamRegistration?: string;
  verifiedGovtMSME?: boolean;
  description?: string;
  activeJobsCount: number;
  industry?: string;
  size?: string;
  udyamNumber?: string;
  totalHired?: number;
  isVerified?: boolean;
}

export interface RegionalSkillInsight {
  region: string;
  stateCode: string;
  activeMSMEs: number;
  registeredCandidates: number;
  topDemandedSkills: { name: string; demandGrowth: number; openPositions: number }[];
  skillShortages: { name: string; gapSeverity: "Critical" | "Moderate" | "Balanced"; deficitPercent: number }[];
  candidateReadinessAvg: number;
  keyIndustries: string[];
}
