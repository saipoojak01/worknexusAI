import React, { useState } from "react";
import {
  FileText,
  Download,
  CheckCircle2,
  Printer,
  ShieldCheck,
  Building2,
  Users,
  Award,
  Calendar,
} from "lucide-react";

export const WorkforceReportsPage: React.FC = () => {
  const [downloading, setDownloading] = useState<string | null>(null);

  const handleDownload = (reportName: string) => {
    setDownloading(reportName);
    setTimeout(() => {
      // Create text file and trigger download
      const content = `========================================================================
WORKNEXUS AI - NATIONAL WORKFORCE & MSME EMPLOYMENT AUDIT REPORT
Published: September 2026 | Ministry of MSME & NSDC Authorized
========================================================================

1. EXECUTIVE SUMMARY
------------------------------------------------------------------------
- Total Registered Youth: 1,428,500
- Verified Skilled Candidates: 984,200 (68.9% Platform Verification)
- Certified Udyam MSMEs: 48,200
- Verified Placements: 312,400
- Average Starting Salary: Rs 4.8 LPA
- Placement Velocity Improvement: +8.8x faster time-to-hire (2.1 days avg)

2. INDUSTRIAL CLUSTER PERFORMANCE
------------------------------------------------------------------------
- Tamil Nadu (Salem & Coimbatore): 72,400 placements (Primary deficit: Spring Boot)
- Maharashtra (Pune & Nashik): 84,100 placements (Primary deficit: Cloud DevOps)
- Karnataka (Bengaluru & Mysuru): 68,900 placements (Primary deficit: React & Microservices)
- Gujarat (Ahmedabad & Surat): 48,500 placements (Primary deficit: Industrial Automation)

3. ALGORITHMIC INTEGRITY & PROCTORING AUDIT
------------------------------------------------------------------------
- Proctored Assessments Completed: 1,142,900
- Anti-Cheating Invalidation Rate: 1.4%
- Zero Fake Resume Incidents Reported across participating MSMEs

Report generated digitally by WorkNexus AI Audit Service.
`;
      const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${reportName.replace(/\s+/g, "_")}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setDownloading(null);
    }, 800);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Workforce Intelligence Reports & Policy Briefs
            </h1>
            <span className="px-2 py-0.5 text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-md">
              Audit Ready
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Formal documentation, state performance reviews, and verifiable compliance exports
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print Official Document</span>
        </button>
      </div>

      {/* Available Reports List */}
      <div className="space-y-4">
        {[
          {
            title: "Q3 2026 National Skill Matching & Placement Audit",
            description: "Quarterly comprehensive report detailing state-wise youth registration, assessment validity, and MSME retention rates.",
            tag: "Ministry Compliance",
            pages: "18 Pages",
            date: "September 2026",
          },
          {
            title: "Tamil Nadu & Karnataka Technical Deficit Diagnostic",
            description: "Targeted analysis of Spring Boot, SQL, and Cloud deficits across Salem, Coimbatore, and Bengaluru manufacturing corridors.",
            tag: "Curriculum Policy",
            pages: "12 Pages",
            date: "August 2026",
          },
          {
            title: "MSME Time-to-Hire & Economic Velocity Whitepaper",
            description: "Demonstrating the reduction in recruitment turnaround from 18.5 days to 2.1 days using verified skills transcripts.",
            tag: "Economic Impact",
            pages: "14 Pages",
            date: "July 2026",
          },
        ].map((report, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0 mt-0.5">
                <FileText className="w-5 h-5" />
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                    {report.tag}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    {report.pages} • {report.date}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900">{report.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
                  {report.description}
                </p>
              </div>
            </div>

            <button
              disabled={downloading === report.title}
              onClick={() => handleDownload(report.title)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5 shrink-0 disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{downloading === report.title ? "Exporting..." : "Download Report"}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
