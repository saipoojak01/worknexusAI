import React, { useState, useEffect } from "react";
import { X, Save, Sparkles, BookOpen } from "lucide-react";
import { SkillItem, CandidateLearningSkill } from "../../../types";

interface SkillModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (skill: SkillItem) => void;
  initialData?: SkillItem | null;
}

export const SkillModal: React.FC<SkillModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<SkillItem["category"]>("Backend");
  const [score, setScore] = useState(75);
  const [verificationStatus, setVerificationStatus] = useState<SkillItem["verificationStatus"]>("Not Verified");
  const [projectEvidence, setProjectEvidence] = useState("");

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setCategory(initialData.category || "Backend");
      setScore(initialData.score || 75);
      setVerificationStatus(initialData.verificationStatus || "Not Verified");
      setProjectEvidence(initialData.projectEvidence || "");
    } else {
      setName("");
      setCategory("Backend");
      setScore(75);
      setVerificationStatus("Not Verified");
      setProjectEvidence("");
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({
      id: initialData?.id || `sk-${Date.now()}`,
      name: name.trim(),
      category,
      score,
      verificationStatus,
      projectEvidence: projectEvidence.trim() || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <h3 className="text-base font-bold text-slate-900">
            {initialData ? "Edit Skill" : "Add Technical Skill"}
          </h3>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Skill Name *</label>
            <input
              type="text"
              placeholder="e.g. Java, Docker, React, PostgreSQL"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            >
              <option value="Backend">Backend</option>
              <option value="Frontend">Frontend</option>
              <option value="Database">Database</option>
              <option value="Cloud & DevOps">Cloud & DevOps</option>
              <option value="Data & AI">Data & AI</option>
              <option value="Core Engineering">Core Engineering</option>
              <option value="Business">Business</option>
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="font-semibold text-slate-700">Self-Assessed Score: {score}%</label>
              <span className="text-[10px] text-slate-400">Can be verified via AI Assessment</span>
            </div>
            <input
              type="range"
              min={30}
              max={100}
              value={score}
              onChange={(e) => setScore(Number(e.target.value))}
              className="w-full accent-indigo-600"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Project Evidence / Repo Link (Optional)</label>
            <input
              type="text"
              placeholder="e.g. github.com/user/project-repo"
              value={projectEvidence}
              onChange={(e) => setProjectEvidence(e.target.value)}
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
              <span>Save Skill</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ================= LEARNING SKILL MODAL =================
interface AddLearningSkillModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (skill: { name: string; category?: string; targetProficiency?: string; notes?: string }) => void;
}

export const AddLearningSkillModal: React.FC<AddLearningSkillModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Backend");
  const [targetProficiency, setTargetProficiency] = useState("Advanced");
  const [notes, setNotes] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({
      name: name.trim(),
      category,
      targetProficiency,
      notes: notes.trim() || undefined,
    });
    setName("");
    setNotes("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-bold text-slate-900">Add Skill to Learning</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Target Skill Name *</label>
            <input
              type="text"
              placeholder="e.g. Spring Boot Microservices, Kubernetes, Redis"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                <option value="Backend">Backend</option>
                <option value="Frontend">Frontend</option>
                <option value="Cloud & DevOps">Cloud & DevOps</option>
                <option value="Database">Database</option>
                <option value="Data & AI">Data & AI</option>
              </select>
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Target Proficiency</label>
              <select
                value={targetProficiency}
                onChange={(e) => setTargetProficiency(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Proficient">Proficient</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Learning Notes / Goal</label>
            <textarea
              rows={2}
              placeholder="e.g. Targeting Java Backend Developer requirements at precision engineering MSMEs"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
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
              <Sparkles className="w-3.5 h-3.5" />
              <span>Add to Learning List</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
