import { CandidateProfile, JobPosting, MatchScoreBreakdown } from "../types";

export function calculateMatchScore(candidate: CandidateProfile, job: JobPosting): MatchScoreBreakdown {
  // 1. Skill Compatibility (40%)
  let totalWeight = 0;
  let accumulatedSkillScore = 0;
  const matchingSkills: { skill: string; candidateScore: number; requiredPriority: string }[] = [];
  const missingSkills: { skill: string; priority: string; reason: string }[] = [];

  for (const req of job.requiredSkills) {
    totalWeight += req.weight;
    const candidateSkill = candidate.skills.find(
      (s) => s.name.toLowerCase() === req.skill.toLowerCase()
    );

    if (candidateSkill) {
      // Score scaled relative to required minScore
      const ratio = Math.min(100, Math.round((candidateSkill.score / req.minScore) * 100));
      accumulatedSkillScore += ratio * req.weight;
      matchingSkills.push({
        skill: req.skill,
        candidateScore: candidateSkill.score,
        requiredPriority: req.priority,
      });
    } else {
      missingSkills.push({
        skill: req.skill,
        priority: req.priority,
        reason: `${req.priority} priority requirement (threshold: ${req.minScore}%) not found in current verified skill profile`,
      });
    }
  }

  const skillCompatibility = totalWeight > 0 
    ? Math.min(100, Math.round(accumulatedSkillScore / totalWeight))
    : 70;

  // 2. Verified Skills Strength (20%)
  // Measures what percentage of candidate's matching skills have formal platform/assessment verification
  let verifiedMatchesCount = 0;
  for (const m of matchingSkills) {
    const s = candidate.skills.find((x) => x.name.toLowerCase() === m.skill.toLowerCase());
    if (s && (s.verificationStatus === "Verified" || s.verificationStatus === "Assessment Verified")) {
      verifiedMatchesCount++;
    }
  }
  const verifiedSkillsScore = matchingSkills.length > 0
    ? Math.min(100, Math.round((verifiedMatchesCount / matchingSkills.length) * 100))
    : 50;

  // 3. Experience Match (15%)
  let experienceMatch = 80;
  if (candidate.experienceYears >= job.minExperienceYears) {
    experienceMatch = 95;
  } else {
    // Junior candidate with high skill potential
    const gap = job.minExperienceYears - candidate.experienceYears;
    experienceMatch = Math.max(50, Math.round(90 - gap * 20));
  }

  // 4. Education Match (10%)
  // Candidates with relevant tech degrees
  const eduStr = (candidate.education.degree + " " + candidate.education.institution).toLowerCase();
  let educationMatch = 88;
  if (eduStr.includes("tech") || eduStr.includes("engineering") || eduStr.includes("mca") || eduStr.includes("science")) {
    educationMatch = 94;
  }

  // 5. Location / Work Mode Preference (5%)
  let locationMatch = 70;
  const isDirectCityMatch = candidate.preferredLocations.some((loc) => 
    job.location.toLowerCase().includes(loc.toLowerCase())
  );
  if (isDirectCityMatch || job.workMode === "Remote" || candidate.workModePreference === "Flexible") {
    locationMatch = 100;
  } else if (candidate.workModePreference === job.workMode) {
    locationMatch = 85;
  }

  // 6. Potential & Growth Alignment (10%)
  // High general skill score + completed projects boosts learning agility
  const potentialGrowth = Math.min(100, Math.round(
    candidate.overallSkillScore * 0.7 + (candidate.verifiedSkillsCount >= 5 ? 30 : 15)
  ));

  // Weighted total:
  // 40% skills + 20% verified + 15% experience + 10% education + 5% location + 10% potential
  const overallScore = Math.round(
    skillCompatibility * 0.40 +
    verifiedSkillsScore * 0.20 +
    experienceMatch * 0.15 +
    educationMatch * 0.10 +
    locationMatch * 0.05 +
    potentialGrowth * 0.10
  );

  // Generate actionable AI explanation
  const highMatches = matchingSkills.filter((m) => m.candidateScore >= 75).map((m) => m.skill);
  let aiExplanation = "";
  if (overallScore >= 85) {
    aiExplanation = `You are a high-affinity match (${overallScore}%) because your verified capabilities in ${highMatches.slice(0, 3).join(", ")} align directly with the core requirements of ${job.companyName}.`;
    if (missingSkills.length > 0) {
      aiExplanation += ` Addressing your gap in ${missingSkills[0].skill} through the recommended learning roadmap can elevate your profile to 98%+ match.`;
    }
  } else if (overallScore >= 70) {
    aiExplanation = `You have strong foundational alignment (${overallScore}%) through ${highMatches.join(", ") || "core engineering competencies"}, but ${job.companyName} places high priority on ${missingSkills.map((m) => m.skill).join(", ") || "advanced production skills"}.`;
  } else {
    aiExplanation = `Moderate alignment (${overallScore}%). This role requires practical depth in ${job.requiredSkills.slice(0, 3).map((r) => r.skill).join(", ")}. Complete target assessments to verify corresponding skills.`;
  }

  return {
    overallScore,
    skillCompatibility,
    verifiedSkillsScore,
    experienceMatch,
    educationMatch,
    locationMatch,
    potentialGrowth,
    matchingSkills,
    missingSkills,
    aiExplanation,
  };
}
