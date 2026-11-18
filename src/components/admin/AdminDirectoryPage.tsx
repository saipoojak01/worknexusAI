import React, { useState, useEffect } from "react";
import {
  Users,
  Building2,
  Search,
  Filter,
  MapPin,
  Briefcase,
  ShieldCheck,
  Award,
  CheckCircle2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Download,
  RefreshCw,
  X,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import { useApp } from "../../context/AppContext";

export const AdminDirectoryPage: React.FC = () => {
  const { currentPath } = useApp();

  // URL query params initialization
  const searchParams = new URLSearchParams(window.location.search);
  const initialState = searchParams.get("state") || "All";
  const initialSector = searchParams.get("sector") || "All";

  const [entityType, setEntityType] = useState<"all" | "candidate" | "msme">("all");
  const [query, setQuery] = useState("");
  const [selectedState, setSelectedState] = useState(initialState);
  const [selectedSector, setSelectedSector] = useState(initialSector);
  const [currentPage, setCurrentPage] = useState(1);

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Selected item for modal details
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  const fetchDirectory = async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem("skillbridge_jwt_token");
    try {
      const params = new URLSearchParams();
      if (entityType !== "all") params.append("type", entityType);
      if (query.trim()) params.append("query", query.trim());
      if (selectedState !== "All") params.append("state", selectedState);
      if (selectedSector !== "All") params.append("sector", selectedSector);
      params.append("page", currentPage.toString());
      params.append("limit", "12");

      const res = await fetch(`/api/admin/directory?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (json.success && json.data) {
        setData(json.data);
      } else {
        setError(json.error || "Failed to load directory records.");
      }
    } catch (err) {
      setError("Network error connecting to directory service.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDirectory();
  }, [entityType, selectedState, selectedSector, currentPage]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchDirectory();
  };

  const handleExportCSV = () => {
    if (!data?.items?.length) return;
    let csv = "Type,Name,Identifier/Email,Location,Sector/TargetRole,Metric1,Metric2\n";
    data.items.forEach((item: any) => {
      if (item.type === "candidate") {
        csv += `"Candidate","${item.name}","${item.email}","${item.location}","${item.targetRole}",Readiness: ${item.jobReadiness}%,VerifiedSkills: ${item.verifiedSkillsCount}\n`;
      } else {
        csv += `"MSME","${item.name}","${item.udyamNumber}","${item.location}","${item.industry}",Vacancies: ${item.activeJobsCount},Hired: ${item.totalHired}\n`;
      }
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `SkillBridge_Directory_${entityType}_Export.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const { items = [], total = 0, totalPages = 1, page = 1 } = data || {};

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-950 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30 rounded-full flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-amber-400" />
                National Registry
              </span>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                Verified Udyam MSMEs & Assessed Youth
              </span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white">
              Unified National Workforce Directory
            </h1>
            <p className="text-xs text-indigo-200 max-w-2xl leading-relaxed">
              Auditable records of certified candidates, skill verification transcripts, and registered MSME enterprises.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold border border-white/20 flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
            >
              <Download className="w-4 h-4 text-indigo-300" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={fetchDirectory}
              title="Refresh directory"
              className="p-2 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/20 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4 text-indigo-300" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Tab Controller */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Entity Type Toggle Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => {
                setEntityType("all");
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                entityType === "all"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              All Records
            </button>
            <button
              onClick={() => {
                setEntityType("candidate");
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                entityType === "candidate"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Candidates</span>
            </button>
            <button
              onClick={() => {
                setEntityType("msme");
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                entityType === "msme"
                  ? "bg-sky-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>MSMEs</span>
            </button>
          </div>

          <div className="text-xs text-slate-500 font-medium">
            Total Matching: <span className="font-bold text-slate-900">{total}</span> records
          </div>
        </div>

        {/* Search & Filters */}
        <form onSubmit={handleSearchSubmit} className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by name, skill, university, Udyam ID, or company..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <select
            value={selectedState}
            onChange={(e) => {
              setSelectedState(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900 font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          >
            <option value="All">All States</option>
            <option value="Tamil Nadu">Tamil Nadu</option>
            <option value="Maharashtra">Maharashtra</option>
            <option value="Karnataka">Karnataka</option>
            <option value="Gujarat">Gujarat</option>
            <option value="Telangana">Telangana</option>
            <option value="Uttar Pradesh">Uttar Pradesh</option>
            <option value="West Bengal">West Bengal</option>
          </select>

          <button
            type="submit"
            className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs cursor-pointer"
          >
            Search
          </button>
        </form>
      </div>

      {/* Directory Grid */}
      {loading ? (
        <div className="min-h-[300px] flex flex-col items-center justify-center space-y-3">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-500">Retrieving directory records...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-500">
          <p className="text-sm font-semibold text-slate-700">No records found matching criteria.</p>
          <p className="text-xs text-slate-400 mt-1">Try broadening your search term or filter selection.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item: any) => {
            const isCandidate = item.type === "candidate";

            return (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0 font-bold text-xs ${
                          isCandidate ? "bg-indigo-600" : "bg-sky-600"
                        }`}
                      >
                        {isCandidate ? <Users className="w-4 h-4" /> : <Building2 className="w-4 h-4" />}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-xs font-bold text-slate-900 truncate">{item.name}</h3>
                        <p className="text-[11px] text-slate-500 truncate">
                          {isCandidate ? item.targetRole : item.industry}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`text-[9px] px-2 py-0.5 rounded-full font-bold shrink-0 uppercase tracking-wider border ${
                        isCandidate
                          ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                          : "bg-sky-50 text-sky-700 border-sky-200"
                      }`}
                    >
                      {item.type}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-2.5">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="truncate">{item.location}</span>
                  </p>
                </div>

                {isCandidate ? (
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">Readiness Score:</span>
                      <span className="font-bold text-emerald-600">{item.jobReadiness}%</span>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {item.skills?.slice(0, 3).map((s: any) => (
                        <span
                          key={s.name}
                          className="text-[9px] font-semibold bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded-md"
                        >
                          {s.name} ({s.score}%)
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">Active Openings:</span>
                      <span className="font-bold text-indigo-600">{item.activeJobsCount} positions</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">Total Placed:</span>
                      <span className="font-bold text-slate-700">{item.totalHired} hired</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Bar */}
      {totalPages > 1 && (
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Page <span className="font-bold text-slate-900">{page}</span> of{" "}
            <span className="font-bold text-slate-900">{totalPages}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white ${
                    selectedItem.type === "candidate" ? "bg-indigo-600" : "bg-sky-600"
                  }`}
                >
                  {selectedItem.type === "candidate" ? <Users className="w-5 h-5" /> : <Building2 className="w-5 h-5" />}
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">{selectedItem.name}</h2>
                  <p className="text-xs text-slate-500">
                    {selectedItem.type === "candidate" ? selectedItem.targetRole : selectedItem.industry}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {selectedItem.type === "candidate" ? (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl">
                  <div>
                    <span className="text-slate-400">Email:</span>
                    <p className="font-semibold text-slate-800">{selectedItem.email}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Location:</span>
                    <p className="font-semibold text-slate-800">{selectedItem.location}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Job Readiness:</span>
                    <p className="font-bold text-emerald-600">{selectedItem.jobReadiness}%</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Verified Skills:</span>
                    <p className="font-bold text-indigo-600">{selectedItem.verifiedSkillsCount} verified</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 mb-2">Verified Skill Benchmarks</h4>
                  <div className="space-y-1.5">
                    {selectedItem.skills?.map((s: any) => (
                      <div key={s.name} className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                        <span className="font-medium text-slate-800">{s.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-indigo-600">{s.score}%</span>
                          <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {s.verificationStatus}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedItem.education?.length > 0 && (
                  <div>
                    <h4 className="font-bold text-slate-900 mb-2">Education & Qualifications</h4>
                    <div className="space-y-1.5">
                      {selectedItem.education.map((edu: any, i: number) => (
                        <div key={i} className="p-2 rounded-lg bg-slate-50">
                          <p className="font-bold text-slate-800">{edu.degree}</p>
                          <p className="text-slate-500">{edu.institution}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl">
                  <div>
                    <span className="text-slate-400">Udyam Registration:</span>
                    <p className="font-mono font-semibold text-slate-800">{selectedItem.udyamNumber}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Location:</span>
                    <p className="font-semibold text-slate-800">{selectedItem.location}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Enterprise Size:</span>
                    <p className="font-semibold text-slate-800">{selectedItem.size} MSME</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Cluster:</span>
                    <p className="font-semibold text-slate-800">{selectedItem.cluster || "Regional Hub"}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 mb-2">Hiring Telemetry</h4>
                  <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 rounded-xl text-center">
                    <div>
                      <span className="text-slate-400">Active Job Openings:</span>
                      <p className="text-sm font-bold text-indigo-600">{selectedItem.activeJobsCount}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Confirmed Hires:</span>
                      <p className="text-sm font-bold text-emerald-600">{selectedItem.totalHired}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={() => setSelectedItem(null)}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-all cursor-pointer mt-3"
            >
              Close Record View
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
