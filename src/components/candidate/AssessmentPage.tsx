import React, { useState, useEffect } from "react";
import {
  FileCheck2,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Award,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { PRESET_ASSESSMENTS } from "../../data/initialData";
import { AssessmentQuestion, AssessmentResult } from "../../types";

export const AssessmentPage: React.FC = () => {
  const { saveAssessmentResult, assessmentResults, setActiveTab } = useApp();

  const [selectedSkill, setSelectedSkill] = useState<string>("Java");
  const [selectedDifficulty, setSelectedDifficulty] = useState<"Beginner" | "Intermediate" | "Advanced">("Intermediate");
  const [isTestActive, setIsTestActive] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string | number, number>>({});
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [testCompletedResult, setTestCompletedResult] = useState<AssessmentResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Available skills for assessment
  const availableSkills = [
    { name: "Java", category: "Backend", desc: "OOP, Collections, JVM Memory, Concurrency", questionsCount: 4 },
    { name: "SQL", category: "Database", desc: "Joins, Indexes, Transactions, Grouping", questionsCount: 4 },
    { name: "React", category: "Frontend", desc: "Hooks, State Management, Virtual DOM", questionsCount: 4 },
    { name: "Python", category: "Backend", desc: "Data structures, Generators, Decorators", questionsCount: 4 },
    { name: "Spring Boot", category: "Backend", desc: "Dependency Injection, REST, JPA", questionsCount: 4 },
  ];

  // Get active question set
  const questionsForSkill: AssessmentQuestion[] =
    PRESET_ASSESSMENTS[selectedSkill] || PRESET_ASSESSMENTS["Java"];

  // Timer effect
  useEffect(() => {
    let timer: any;
    if (isTestActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isTestActive && timeLeft === 0) {
      handleSubmitTest();
    }
    return () => clearInterval(timer);
  }, [isTestActive, timeLeft]);

  const startTest = () => {
    setUserAnswers({});
    setCurrentQuestionIndex(0);
    setTimeLeft(300);
    setTestCompletedResult(null);
    setIsTestActive(true);
  };

  const handleSelectOption = (questionId: string | number, optionIndex: number) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleSubmitTest = async () => {
    setIsSubmitting(true);
    setIsTestActive(false);

    // Calculate score
    let correctCount = 0;
    questionsForSkill.forEach((q) => {
      if (userAnswers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });

    const score = Math.round((correctCount / questionsForSkill.length) * 100);
    const proficiency: "Beginner" | "Intermediate" | "Advanced" | "Proficient" =
      score >= 85 ? "Advanced" : score >= 65 ? "Proficient" : "Intermediate";

    let strengths: string[] = [];
    let needsImprovement: string[] = [];
    let recommendedNextSteps = "";

    if (selectedSkill === "Java") {
      strengths = score >= 75
        ? ["OOP Architecture & Encapsulation", "Collections Framework optimization", "Exception Handling"]
        : ["Core Syntax", "Loop Constructs"];
      needsImprovement = score >= 75
        ? ["JVM Memory Garbage Collection tuning", "Multi-threaded concurrency"]
        : ["Interface inheritance", "Collections memory footprint"];
      recommendedNextSteps =
        "Your Java core fundamentals are verified. Proceed into Spring Boot dependency injection and microservice REST APIs.";
    } else if (selectedSkill === "SQL") {
      strengths = ["Relational Joins (INNER, LEFT, FULL)", "ACID Transaction Isolation", "Indexing"];
      needsImprovement = ["Window functions (PARTITION BY)", "Execution Plan Optimization"];
      recommendedNextSteps =
        "Solid database foundation. Recommended next step: combine with an ORM like Hibernate or Prisma.";
    } else {
      strengths = ["Core Architecture", "Component Modularization"];
      needsImprovement = ["Edge-case Error Handling", "Performance Optimization"];
      recommendedNextSteps =
        `Great performance on ${selectedSkill}. Complete the recommended weekly project to reinforce practical depth.`;
    }

    const result: AssessmentResult = {
      id: `as-${Date.now()}`,
      skillName: selectedSkill,
      difficulty: selectedDifficulty,
      score,
      totalQuestions: questionsForSkill.length,
      correctAnswers: correctCount,
      dateCompleted: new Date().toISOString().split("T")[0],
      proficiencyLevel: proficiency,
      strengths,
      needsImprovement,
      recommendedNextSteps,
    };

    // Save to AppContext & Candidate Profile
    saveAssessmentResult(result);
    setTestCompletedResult(result);
    setIsSubmitting(false);
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              AI Skill Assessment Center
            </h1>
            <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md">
              Proctored Benchmark
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Standardized technical evaluations that translate directly into verified credentials for MSME hiring
          </p>
        </div>

        {isTestActive && (
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-900 px-3.5 py-1.5 rounded-xl text-xs font-semibold">
            <Clock className="w-4 h-4 text-amber-600 animate-pulse" />
            <span>Time Remaining: {formatTimer(timeLeft)}</span>
          </div>
        )}
      </div>

      {/* When Test is NOT Active and No Result -> Selection Screen */}
      {!isTestActive && !testCompletedResult && (
        <div className="space-y-6">
          {/* Skill Selector Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {availableSkills.map((sk) => {
              const isSelected = selectedSkill === sk.name;
              return (
                <div
                  key={sk.name}
                  onClick={() => setSelectedSkill(sk.name)}
                  className={`p-5 rounded-2xl border text-left cursor-pointer transition-all ${
                    isSelected
                      ? "bg-white border-indigo-600 ring-2 ring-indigo-500/20 shadow-sm"
                      : "bg-slate-50/70 hover:bg-slate-50 border-slate-200/80"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {sk.category}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">
                      {sk.questionsCount} Questions
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{sk.name}</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{sk.desc}</p>
                  <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                    <span className="text-indigo-600 font-semibold">5 Minutes</span>
                    {isSelected && <span className="font-bold text-indigo-700">Selected ✓</span>}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Difficulty & Rules Box */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs">
            <h3 className="text-sm font-bold text-slate-900 mb-3">Assessment Configuration</h3>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  Difficulty Level
                </label>
                <div className="flex items-center gap-2">
                  {(["Beginner", "Intermediate", "Advanced"] as const).map((diff) => (
                    <button
                      key={diff}
                      type="button"
                      onClick={() => setSelectedDifficulty(diff)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                        selectedDifficulty === diff
                          ? "bg-slate-900 text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2">
                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  <span>Evaluation Standards & Verification Rules</span>
                </div>
                <ul className="list-disc pl-5 space-y-1 text-slate-600">
                  <li>Timed assessment: 5 minutes to solve multiple-choice and scenario-based questions.</li>
                  <li>Scoring 70% or above awards an official <strong>Platform Verified</strong> badge on your profile.</li>
                  <li>Your score and diagnostic feedback will update your <strong>Job Readiness</strong> rating in real time.</li>
                </ul>
              </div>

              <button
                onClick={startTest}
                className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                <span>Begin {selectedSkill} Assessment ({selectedDifficulty})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Recent Completed Assessments */}
          {assessmentResults.length > 0 && (
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <h3 className="text-sm font-bold text-slate-900 mb-3">Your Assessment History</h3>
              <div className="space-y-3">
                {assessmentResults.map((res) => (
                  <div
                    key={res.id}
                    className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{res.skillName}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200/60">
                          {res.proficiencyLevel}
                        </span>
                        <span className="text-slate-400">• Completed on {res.dateCompleted}</span>
                      </div>
                      <p className="text-slate-500 mt-1">{res.recommendedNextSteps}</p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <div className="text-lg font-extrabold text-emerald-600">{res.score}%</div>
                        <div className="text-[10px] text-slate-400">
                          {res.correctAnswers}/{res.totalQuestions} Correct
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Active Assessment Running View */}
      {isTestActive && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-500">
                Question {currentQuestionIndex + 1} of {questionsForSkill.length}
              </span>
              <span className="font-bold text-indigo-600">
                {Math.round(((currentQuestionIndex + 1) / questionsForSkill.length) * 100)}% Completed
              </span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                style={{
                  width: `${((currentQuestionIndex + 1) / questionsForSkill.length) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Current Question */}
          {questionsForSkill[currentQuestionIndex] && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-[10px] font-bold bg-slate-100 text-slate-700 rounded-md uppercase">
                  {questionsForSkill[currentQuestionIndex].type}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  ID: {questionsForSkill[currentQuestionIndex].id}
                </span>
              </div>

              <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                {questionsForSkill[currentQuestionIndex].question}
              </h2>

              {/* Options */}
              <div className="space-y-2.5 pt-2">
                {questionsForSkill[currentQuestionIndex].options.map((opt, optIdx) => {
                  const currentQId = questionsForSkill[currentQuestionIndex].id;
                  const isChosen = userAnswers[currentQId] === optIdx;
                  return (
                    <div
                      key={optIdx}
                      onClick={() => handleSelectOption(currentQId, optIdx)}
                      className={`p-4 rounded-xl border text-left cursor-pointer transition-all flex items-center justify-between ${
                        isChosen
                          ? "bg-indigo-50/80 border-indigo-600 text-indigo-950 ring-2 ring-indigo-500/20 font-medium"
                          : "bg-slate-50 hover:bg-slate-100/70 border-slate-200 text-slate-700"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                            isChosen ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-600"
                          }`}
                        >
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span className="text-xs sm:text-sm">{opt}</span>
                      </div>
                      {isChosen && <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Stepper Navigation */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              disabled={currentQuestionIndex === 0}
              onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 disabled:opacity-30"
            >
              Previous Question
            </button>

            {currentQuestionIndex < questionsForSkill.length - 1 ? (
              <button
                onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
              >
                <span>Next Question</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={handleSubmitTest}
                className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
              >
                <span>Submit Assessment</span>
                <CheckCircle2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Test Completed Diagnostics View */}
      {testCompletedResult && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-md space-y-6 animate-in zoom-in-95 duration-200">
          <div className="p-5 rounded-xl bg-gradient-to-r from-slate-900 to-indigo-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="px-2.5 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded-full">
                Assessment Certified
              </span>
              <h2 className="text-xl font-extrabold tracking-tight mt-1">
                {testCompletedResult.skillName} Competency Diagnostic
              </h2>
              <p className="text-xs text-indigo-200 mt-0.5">
                Evaluated level: <span className="font-bold text-white">{testCompletedResult.proficiencyLevel}</span>
              </p>
            </div>

            <div className="text-right sm:text-right">
              <div className="text-3xl font-extrabold text-emerald-400">
                {testCompletedResult.score}%
              </div>
              <p className="text-[11px] text-indigo-200">
                {testCompletedResult.correctAnswers} of {testCompletedResult.totalQuestions} questions correct
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Strengths */}
            <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200/80">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 mb-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Identified Strengths</span>
              </div>
              <ul className="space-y-1.5 text-xs text-emerald-950">
                {testCompletedResult.strengths.map((s, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Needs Improvement */}
            <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/80">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 mb-2">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span>Recommended Focus Areas</span>
              </div>
              <ul className="space-y-1.5 text-xs text-amber-950">
                {testCompletedResult.needsImprovement.map((s, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Actionable Next Steps Box */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1.5">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>AI Next Step Advisory</span>
            </div>
            <p className="leading-relaxed">{testCompletedResult.recommendedNextSteps}</p>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={() => {
                setTestCompletedResult(null);
                setIsTestActive(false);
              }}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 rounded-xl flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Take Another Skill Test</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab("my-skills")}
                className="px-4 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl"
              >
                View in My Skills
              </button>
              <button
                onClick={() => setActiveTab("skill-gap")}
                className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs flex items-center gap-1.5"
              >
                <span>Analyze Target Role Gaps</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
