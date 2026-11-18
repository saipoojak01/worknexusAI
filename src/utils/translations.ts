import { Language } from "../types";

export interface Translations {
  platformTitle: string;
  tagline: string;
  navDashboard: string;
  navMySkills: string;
  navAssessments: string;
  navSkillGap: string;
  navLearningRoadmap: string;
  navJobMatches: string;
  navApplications: string;
  navSavedJobs: string;
  navProfile: string;
  navPostJob: string;
  navMyJobs: string;
  navTalentMatch: string;
  navCandidateComparison: string;
  navHiringInsights: string;
  navWorkforceIntel: string;
  navRegionalGaps: string;
  signIn: string;
  signOut: string;
  demoWalkthrough: string;
  takeAssessment: string;
  applyNow: string;
  viewDetails: string;
  whyThisMatch: string;
  skillScore: string;
  jobReadiness: string;
  verifiedSkills: string;
  recommendedOpportunities: string;
  switchRole: string;
}

export const TRANSLATIONS: Record<Language, Translations> = {
  en: {
    platformTitle: "WorkNexus AI",
    tagline: "Connecting Skills. Creating Opportunities.",
    navDashboard: "Dashboard",
    navMySkills: "My Skills",
    navAssessments: "Assessments",
    navSkillGap: "Skill Gap Analyzer",
    navLearningRoadmap: "Learning Roadmap",
    navJobMatches: "AI Job Matches",
    navApplications: "My Applications",
    navSavedJobs: "Saved Jobs",
    navProfile: "Profile",
    navPostJob: "Post a Job",
    navMyJobs: "My Jobs",
    navTalentMatch: "AI Talent Match",
    navCandidateComparison: "Compare Candidates",
    navHiringInsights: "Hiring Insights",
    navWorkforceIntel: "Workforce Intelligence",
    navRegionalGaps: "Regional Gaps",
    signIn: "Sign In",
    signOut: "Sign Out",
    demoWalkthrough: "Explore Demo Flow",
    takeAssessment: "Take AI Assessment",
    applyNow: "Apply Now",
    viewDetails: "View Details",
    whyThisMatch: "Why this match?",
    skillScore: "Overall Skill Score",
    jobReadiness: "Job Readiness",
    verifiedSkills: "Verified Skills",
    recommendedOpportunities: "Recommended Opportunities",
    switchRole: "Switch Role",
  },
  ta: {
    platformTitle: "ஒர்க்நெக்ஸஸ் AI",
    tagline: "திறன்களை இணைக்கிறது. வாய்ப்புகளை உருவாக்குகிறது.",
    navDashboard: "முகப்பு",
    navMySkills: "எனது திறன்கள்",
    navAssessments: "திறன் மதிப்பீடு",
    navSkillGap: "திறன் இடைவெளி பகுப்பாய்வு",
    navLearningRoadmap: "கற்றல் திட்டம்",
    navJobMatches: "AI வேலை பொருத்தங்கள்",
    navApplications: "எனது விண்ணப்பங்கள்",
    navSavedJobs: "சேமிக்கப்பட்ட வேலைகள்",
    navProfile: "சுயவிவரம்",
    navPostJob: "வேலை வெளியிடுக",
    navMyJobs: "எனது வேலைகள்",
    navTalentMatch: "திறமை பொருத்தம்",
    navCandidateComparison: "விண்ணப்பதாரர் ஒப்பீடு",
    navHiringInsights: "பணியமர்த்தல் நுண்ணறிவு",
    navWorkforceIntel: "தேசிய பணியாளர் நுண்ணறிவு",
    navRegionalGaps: "மண்டல திறன் தேவைகள்",
    signIn: "உள்நுழைக",
    signOut: "வெளியேறுக",
    demoWalkthrough: "டெமோ வழிகாட்டி",
    takeAssessment: "மதிப்பீடு தொடங்குக",
    applyNow: "விண்ணப்பிக்கவும்",
    viewDetails: "விவரங்களைக் காண்க",
    whyThisMatch: "ஏன் இந்த பொருத்தம்?",
    skillScore: "ஒட்டுமொத்த திறன் மதிப்பெண்",
    jobReadiness: "வேலைக்குத் தயார்நிலை",
    verifiedSkills: "சரிபார்க்கப்பட்ட திறன்கள்",
    recommendedOpportunities: "பரிந்துரைக்கப்பட்ட வேலைகள்",
    switchRole: "பங்கு மாற்றுக",
  },
  hi: {
    platformTitle: "वर्कनेक्सस AI",
    tagline: "कौशल को जोड़ना। अवसर बनाना।",
    navDashboard: "डैशबोर्ड",
    navMySkills: "मेरे कौशल",
    navAssessments: "कौशल मूल्यांकन",
    navSkillGap: "कौशल अंतराल विश्लेषक",
    navLearningRoadmap: "लर्निंग रोडमैप",
    navJobMatches: "AI जॉब मैच",
    navApplications: "मेरे आवेदन",
    navSavedJobs: "सहेजी गई नौकरियां",
    navProfile: "प्रोफ़ाइल",
    navPostJob: "नौकरी पोस्ट करें",
    navMyJobs: "मेरी नौकरियां",
    navTalentMatch: "AI प्रतिभा मिलान",
    navCandidateComparison: "उम्मीदवार तुलना",
    navHiringInsights: "भर्ती अंतर्दृष्टि",
    navWorkforceIntel: "राष्ट्रीय कार्यबल खुफिया",
    navRegionalGaps: "क्षेत्रीय अंतराल",
    signIn: "साइन इन करें",
    signOut: "साइन आउट",
    demoWalkthrough: "डेमो एक्सप्लोर करें",
    takeAssessment: "मूल्यांकन शुरू करें",
    applyNow: "आवेदन करें",
    viewDetails: "विवरण देखें",
    whyThisMatch: "यह मैच क्यों?",
    skillScore: "कुल कौशल स्कोर",
    jobReadiness: "कार्य तत्परता",
    verifiedSkills: "सत्यापित कौशल",
    recommendedOpportunities: "अनुशंसित अवसर",
    switchRole: "भूमिका बदलें",
  },
  te: {
    platformTitle: "వర్క్‌నెక్సస్ AI",
    tagline: "నైపుణ్యాలను అనుసంధానించడం. అవకాశాలను సృష్టించడం.",
    navDashboard: "డ్యాష్‌బోర్డ్",
    navMySkills: "నా నైపుణ్యాలు",
    navAssessments: "నైపుణ్య అంచనా",
    navSkillGap: "స్కిల్ గ్యాప్ విశ్లేషణ",
    navLearningRoadmap: "లెర్నింగ్ రోడ్‌మ్యాప్",
    navJobMatches: "AI ఉద్యోగ సరిపోలికలు",
    navApplications: "నా దరఖాస్తులు",
    navSavedJobs: "సేవ్ చేసిన ఉద్యోగాలు",
    navProfile: "ప్రొఫైల్",
    navPostJob: "ఉద్యోగాన్ని పోస్ట్ చేయండి",
    navMyJobs: "నా ఉద్యోగాలు",
    navTalentMatch: "AI ప్రతిభ సరిపోలిక",
    navCandidateComparison: "అభ్యర్థుల పోలిక",
    navHiringInsights: "హైరింగ్ సమాచారం",
    navWorkforceIntel: "జాతీయ వర్క్‌ఫోర్స్ ఇంటెలిజెన్స్",
    navRegionalGaps: "ప్రాంతీయ అంతరాలు",
    signIn: "సైన్ ఇన్",
    signOut: "సైన్ అవుట్",
    demoWalkthrough: "డెమో అన్వేషించండి",
    takeAssessment: "అంచనా ప్రారంభించండి",
    applyNow: "దరఖాస్తు చేసుకోండి",
    viewDetails: "వివరాలు చూడండి",
    whyThisMatch: "ఈ మ్యాచ్ ఎందుకు?",
    skillScore: "మొత్తం స్కిల్ స్కోర్",
    jobReadiness: "ఉద్యోగ సన్నద్ధత",
    verifiedSkills: "ధృవీకరించబడిన నైపుణ్యాలు",
    recommendedOpportunities: "సిఫార్సు చేయబడిన అవకాశాలు",
    switchRole: "పాత్ర మార్చుకోండి",
  },
  kn: {
    platformTitle: "ವರ್ಕ್‌ನೆಕ್ಸಸ್ AI",
    tagline: "ಕೌಶಲ್ಯಗಳ ಜೋಡಣೆ. ಅವಕಾಶಗಳ ಸೃಷ್ಟಿ.",
    navDashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    navMySkills: "ನನ್ನ ಕೌಶಲ್ಯಗಳು",
    navAssessments: "ಕೌಶಲ್ಯ ಮೌಲ್ಯಮಾಪನ",
    navSkillGap: "ಕೌಶಲ್ಯ ಅಂತರ ವಿಶ್ಲೇಷಣೆ",
    navLearningRoadmap: "ಕಲಿಕೆಯ ಮಾರ್ಗಸೂಚಿ",
    navJobMatches: "AI ಉದ್ಯೋಗ ಹೊಂದಾಣಿಕೆ",
    navApplications: "ನನ್ನ ಅರ್ಜಿಗಳು",
    navSavedJobs: "ಉಳಿಸಿದ ಉದ್ಯೋಗಗಳು",
    navProfile: "ಪ್ರೊಫೈಲ್",
    navPostJob: "ಉದ್ಯೋಗ ಪ್ರಕಟಿಸಿ",
    navMyJobs: "ನನ್ನ ಉದ್ಯೋಗಗಳು",
    navTalentMatch: "AI ಪ್ರತಿಭೆ ಹೊಂದಾಣಿಕೆ",
    navCandidateComparison: "ಅಭ್ಯರ್ಥಿಗಳ ಹೋಲಿಕೆ",
    navHiringInsights: "ನೇಮಕಾತಿ ಒಳನೋಟಗಳು",
    navWorkforceIntel: "ರಾಷ್ಟ್ರೀಯ ಕಾರ್ಯಪಡೆ ಬುದ್ಧಿವಂತಿಕೆ",
    navRegionalGaps: "ಪ್ರಾದೇಶಿಕ ಅಂತರಗಳು",
    signIn: "ಸೈನ್ ಇನ್",
    signOut: "ಸೈನ್ ಔಟ್",
    demoWalkthrough: "ಡೆಮೊ ವೀಕ್ಷಿಸಿ",
    takeAssessment: "ಮೌಲ್ಯಮಾಪನ ಪ್ರಾರಂಭಿಸಿ",
    applyNow: "ಈಗಲೇ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ",
    viewDetails: "ವಿವರಗಳನ್ನು ವೀಕ್ಷಿಸಿ",
    whyThisMatch: "ಈ ಹೊಂದಾಣಿಕೆ ಏಕೆ?",
    skillScore: "ಒಟ್ಟಾರೆ ಕೌಶಲ್ಯ ಸ್ಕೋರ್",
    jobReadiness: "ಉದ್ಯೋಗ ಸಿದ್ಧತೆ",
    verifiedSkills: "ದೃಢೀಕರಿಸಿದ ಕೌಶಲ್ಯಗಳು",
    recommendedOpportunities: "ಶಿಫಾರಸು ಮಾಡಲಾದ ಅವಕಾಶಗಳು",
    switchRole: "ಪಾತ್ರ ಬದಲಾಯಿಸಿ",
  },
};
