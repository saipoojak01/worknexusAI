import React, { useState } from "react";
import {
  X,
  Sparkles,
  Send,
  Bot,
  User,
  Lightbulb,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useApp } from "../../context/AppContext";

interface ChatMessage {
  id: string;
  sender: "ai" | "user";
  text: string;
  timestamp: string;
}

export const AIAssistantDrawer: React.FC = () => {
  const { isAIAssistantOpen, setIsAIAssistantOpen, role, currentCandidate, candidateProfile } = useApp();
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const initialPrompts: Record<string, string[]> = {
    candidate: [
      "What skills should I learn to reach 95%+ readiness for Java Backend?",
      "Why am I matching 92% with TechCraft Solutions?",
      "How do I get my Spring Boot skill verified?",
      "Which MSMEs in Coimbatore and Chennai are hiring right now?",
    ],
    employer: [
      "How can I attract more verified Java & React developers in Tier-2 cities?",
      "What is the average MSME salary benchmark for Full Stack in Tamil Nadu?",
      "How does WorkNexus verify candidate coding skills?",
      "Suggest a structured skill weight profile for a Cloud DevOps role.",
    ],
    admin: [
      "What are the top 3 critical skill shortages in Tamil Nadu manufacturing MSMEs?",
      "How can government polytechnics align curricula with local MSME demands?",
      "Summarize current national verification throughput across southern states.",
      "What policy incentives boost MSME digital adoption fastest?",
    ],
  };

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      sender: "ai",
      text:
        role === "candidate"
          ? `Hello ${currentCandidate.name}! I am your WorkNexus AI Career Advisor. Ask me anything about improving your verified skills, closing skill gaps, or understanding your job matches.`
          : role === "employer"
          ? `Welcome! I am your WorkNexus AI Workforce Advisor. I can assist you with optimizing job skill requirements, talent market benchmarks, and candidate evaluation.`
          : `Greetings! I am the National Workforce Intelligence AI. I can provide analysis on regional skill deficits, curriculum alignment, and MSME employment trends.`,
      timestamp: "Just now",
    },
  ]);

  if (!isAIAssistantOpen) return null;

  const handleSend = async (userPrompt?: string) => {
    const textToSend = userPrompt || input.trim();
    if (!textToSend || isLoading) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!userPrompt) setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/ai/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role,
          message: textToSend,
          candidateContext: role === "candidate" ? (candidateProfile || currentCandidate) : undefined,
        }),
      });

      if (!res.ok) throw new Error("Assistant response failed");
      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          id: `msg-ai-${Date.now()}`,
          sender: "ai",
          text: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } catch (err) {
      // Fallback
      let fallback = "";
      if (role === "candidate") {
        fallback = `Based on your profile (${currentCandidate.name}, 82/100 skill score): Your Java (86%) and SQL (82%) are strong and verified. To bridge the gap toward the 95% threshold for top MSME backend roles, prioritize Week 2 & 3 of your Learning Roadmap—focusing on Spring Boot dependency injection, REST API security (JWT), and Docker containers.`;
      } else if (role === "employer") {
        fallback = `For MSME technical recruitment in Tier-2/3 regions, candidates with verified practical project experience in Java and SQL provide 40% faster onboarding than generic resume-screened applicants. Consider offering structured hybrid arrangements to broaden your talent radius.`;
      } else {
        fallback = `Regional data indicates an 18% acute talent shortage in cloud-native backend skills in automotive and textile MSME clusters across Tamil Nadu and Karnataka. Recommended policy action: Integrate practical REST API and Spring Boot modules into state polytechnic final-year electives.`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `msg-ai-${Date.now()}`,
          sender: "ai",
          text: fallback,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 md:w-[420px] bg-white shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-200">
      {/* Drawer Header */}
      <div className="p-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-900 text-white flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-amber-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm tracking-tight">WorkNexus AI Advisor</h3>
            <p className="text-[11px] text-indigo-200 capitalize">
              Role: {role} Mode
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsAIAssistantOpen(false)}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Suggestion Prompts */}
      <div className="p-3 bg-slate-50 border-b border-slate-200/80">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 mb-2">
          <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
          <span>Suggested Questions</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {initialPrompts[role]?.slice(0, 2).map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p)}
              className="text-left text-[11px] px-2.5 py-1 bg-white hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 border border-slate-200 rounded-lg text-slate-700 transition-colors line-clamp-1"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m) => {
          const isAI = m.sender === "ai";
          return (
            <div
              key={m.id}
              className={`flex gap-2.5 ${isAI ? "items-start" : "items-start flex-row-reverse"}`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 ${
                  isAI ? "bg-indigo-600 text-white" : "bg-slate-700 text-white"
                }`}
              >
                {isAI ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>
              <div
                className={`max-w-[82%] p-3 rounded-2xl text-xs leading-relaxed ${
                  isAI
                    ? "bg-slate-100 text-slate-800 rounded-tl-xs"
                    : "bg-indigo-600 text-white rounded-tr-xs"
                }`}
              >
                <p className="whitespace-pre-line">{m.text}</p>
                <div
                  className={`text-[9px] mt-1.5 text-right ${
                    isAI ? "text-slate-400" : "text-indigo-200"
                  }`}
                >
                  {m.timestamp}
                </div>
              </div>
            </div>
          );
        })}
        {isLoading && (
          <div className="flex items-center gap-2 text-slate-400 text-xs p-2">
            <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
            <span>AI Advisor is analyzing data...</span>
          </div>
        )}
      </div>

      {/* Disclaimer */}
      <div className="px-4 py-1.5 bg-amber-50/70 border-t border-amber-200/50 flex items-center gap-1.5 text-[10px] text-amber-800">
        <AlertCircle className="w-3 h-3 text-amber-600 shrink-0" />
        <span>AI-powered career & workforce guidance, not guaranteed employment.</span>
      </div>

      {/* Input Form */}
      <div className="p-3 bg-white border-t border-slate-200">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              role === "candidate"
                ? "Ask about skills, roadmaps, or jobs..."
                : role === "employer"
                ? "Ask about hiring benchmarks or skills..."
                : "Ask about regional workforce trends..."
            }
            className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50/50"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="p-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl shadow-xs transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
