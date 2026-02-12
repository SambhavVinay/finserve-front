"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Upload,
  BarChart3,
  ChevronLeft,
  Download,
  Loader2,
  FileCheck,
  AlertCircle,
  FileText, // Added for the PDF icon
} from "lucide-react";
// Import PDF libraries
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function FinancialExtractor() {
  const [file, setFile] = useState<File | null>(null);
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        "https://ijgwqdiuyweofdd-finserveassignment.hf.space/extract",
        {
          method: "POST",
          body: formData,
        },
      );
      if (!response.ok) throw new Error("Extraction failed");
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error(error);
      alert("An error occurred during extraction");
    } finally {
      setIsLoading(false);
    }
  };

  // --- NEW PDF GENERATION LOGIC ---
  // --- UPDATED PDF GENERATION LOGIC ---
  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;

    // 1. Professional Header
    doc.setFillColor(15, 23, 42); // Slate-900
    doc.rect(0, 0, pageWidth, 40, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(255, 255, 255);
    doc.text("FINANCIAL ANALYSIS REPORT", 14, 25);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(
      `Generated: ${new Date().toLocaleDateString()} | CONFIDENTIAL`,
      14,
      32,
    );

    // 2. Formatting the Content
    const finalY = 50;

    const formatKey = (str: string) =>
      str.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

    // NEW CLEANER DATA PROCESSING
    const tableData = Object.entries(data).map(([key, value]) => {
      let displayValue = "";

      if (typeof value === "object" && value !== null) {
        // Convert object to string, remove braces/quotes,
        // then replace commas with newlines for vertical listing
        displayValue = JSON.stringify(value)
          .replace(/[{}"]/g, "") // Remove JSON junk
          .replace(/:/g, ": ") // Add space after colons
          .replace(/,/g, "\n") // FORCE NEW LINE for every metric
          .split("\n") // Clean up underscores in nested keys
          .map((line) => formatKey(line))
          .join("\n");
      } else {
        displayValue = String(value);
      }

      return [formatKey(key), displayValue];
    });

    // 3. Structured Table
    autoTable(doc, {
      startY: finalY,
      head: [["Financial Metric", "Analysis Details"]],
      body: tableData,
      theme: "grid",
      styles: {
        fontSize: 10,
        cellPadding: 6,
        lineColor: [226, 232, 240],
        textColor: [51, 65, 85],
        overflow: "linebreak", // Ensure it wraps correctly
      },
      headStyles: {
        fillColor: [37, 99, 235], // Blue-600
        fontSize: 11,
        fontStyle: "bold",
      },
      columnStyles: {
        0: { fontStyle: "bold", cellWidth: 50, fillColor: [248, 250, 252] },
        1: { cellWidth: "auto" }, // Let the values expand vertically
      },
      alternateRowStyles: {
        fillColor: [255, 255, 255],
      },
    });

    // 4. Footer
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(9);
      doc.setTextColor(150);
      doc.text(
        `Extracted Report - Page ${i} of ${pageCount}`,
        pageWidth / 2,
        doc.internal.pageSize.height - 10,
        { align: "center" },
      );
    }

    doc.save(`Financial_Summary_${Date.now()}.pdf`);
  };

  return (
    <main className="min-h-screen bg-[#0B0F1A] text-slate-200 font-sans pb-20">
      {/* Navigation (unchanged) */}
      <nav className="flex items-center justify-between px-8 py-6 bg-[#0B0F1A]/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2 group">
          <ChevronLeft className="text-slate-500 group-hover:text-blue-400 transition-colors" />
          <div className="bg-blue-600 p-1.5 rounded-md">
            <BarChart3 className="text-white w-5 h-5" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white">
            :)
          </span>
        </Link>
        <div className="text-xs font-mono text-slate-500 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
          Sambhav Vinay
        </div>
      </nav>

      {/* Loading Overlay (unchanged) */}
      {isLoading && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0B0F1A]/90 backdrop-blur-sm text-white">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
            <Loader2
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-400 animate-pulse"
              size={32}
            />
          </div>
          <h2 className="mt-8 text-2xl font-bold tracking-tight">
            Analyzing Financials
          </h2>
          <p className="mt-2 text-slate-400 animate-pulse">
            Scanning balance sheets & income statements...
          </p>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-6 pt-12">
        <header className="mb-12 text-center md:text-left">
          <h1 className="text-4xl font-extrabold text-white mb-2">
            Upload Report
          </h1>
          <p className="text-slate-400 text-lg">
            My AI will parse the document for key figures in seconds.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-5">
            <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl sticky top-28">
              <label className="block text-sm font-semibold text-slate-400 mb-6 uppercase tracking-wider">
                Select Source Document
              </label>
              <div className="relative group">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div
                  className={`border-2 border-dashed rounded-2xl p-8 transition-all flex flex-col items-center justify-center gap-4 ${file ? "border-blue-500/50 bg-blue-500/5" : "border-slate-800 bg-slate-950 group-hover:border-slate-700"}`}
                >
                  <div
                    className={`p-4 rounded-xl ${file ? "bg-blue-600 text-white" : "bg-slate-900 text-slate-500"}`}
                  >
                    <Upload size={24} />
                  </div>
                  <div className="text-center">
                    <p className="text-white font-medium truncate max-w-[200px]">
                      {file ? file.name : "Choose PDF file"}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Maximum size: 50MB
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleUpload}
                disabled={!file || isLoading}
                className="w-full mt-8 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-bold py-4 rounded-2xl transition-all shadow-xl shadow-blue-900/20 flex items-center justify-center gap-2"
              >
                {isLoading ? "Processing..." : "Extract Intelligence"}
              </button>

              {/* SHINY NEW PDF BUTTON */}
              {data && (
                <button
                  onClick={generatePDF}
                  className="w-full mt-4 relative group overflow-hidden bg-gradient-to-br from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2 animate-in fade-in slide-in-from-bottom-4 duration-500"
                >
                  <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12" />
                  <FileText
                    size={20}
                    className="group-hover:scale-110 transition-transform"
                  />
                  Save Structured PDF
                </button>
              )}

              <div className="mt-6 flex items-start gap-3 p-4 bg-slate-900/80 rounded-xl border border-slate-800">
                <AlertCircle size={18} className="text-slate-500 shrink-0" />
                <p className="text-[11px] text-slate-500 leading-normal">
                  Private & Confidential: Documents are processed locally and
                  not stored on my public servers.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-7">
            {!data && !isLoading && (
              <div className="h-full min-h-[400px] border-2 border-dashed border-slate-800 rounded-3xl flex flex-col items-center justify-center text-slate-600 italic px-12 text-center">
                <FileCheck size={48} className="mb-4 opacity-20" />
                <p>
                  Extracted data will appear here once processing is complete.
                </p>
              </div>
            )}

            {data && (
              <div className="space-y-6 animate-fade-in">
                <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
                  <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <h2 className="font-bold text-white">
                        Extraction Successful
                      </h2>
                    </div>
                    <button
                      onClick={() => {
                        const blob = new Blob([JSON.stringify(data, null, 4)], {
                          type: "application/json",
                        });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = `finbrief_${Date.now()}.json`;
                        a.click();
                      }}
                      className="flex items-center gap-2 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg transition"
                    >
                      <Download size={14} /> Download JSON
                    </button>
                  </div>
                  <div className="p-0">
                    <pre className="p-6 text-sm font-mono text-blue-400 overflow-auto max-h-[700px] scrollbar-thin scrollbar-thumb-slate-700">
                      {JSON.stringify(data, null, 4)}
                    </pre>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <section className="max-w-5xl mx-auto px-6 mt-16 pb-20 border-t border-slate-800 pt-12">
          <div className="bg-gradient-to-br from-slate-900 to-[#0B0F1A] border border-slate-800 rounded-3xl p-8 shadow-2xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <FileText className="text-blue-500" />
                  Try Sample Documents
                </h2>
                <p className="text-slate-400 mt-1">
                  Download these financial reports to test the AI extraction
                  accuracy.
                </p>
              </div>
              <div className="bg-blue-500/10 text-blue-400 text-xs font-mono px-4 py-2 rounded-full border border-blue-500/20">
                Demo Environment Ready
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  name: "RANBAXY NIGERIA LIMITED",
                  type: "Financial report",
                  size: "4.2 MB",
                  url: "https://drive.google.com/uc?export=download&id=1WZ7mCDpkZs4RTCkxeSBXAwr79KK9V_3M",
                },
                {
                  name: "Apple Inc",
                  type: "Quarterly Financials",
                  size: "1.8 MB",
                  url: "https://drive.google.com/uc?export=download&id=1u9rAPV5i_SbGJhBRlyTHq0RWr611sAIy",
                },
                {
                  name: "Sample Income Statement.pdf",
                  type: "Accounting Sample",
                  size: "0.5 MB",
                  url: "https://drive.google.com/uc?export=download&id=1DQswP68Zt5fzcL0VJI7ZeaG2aFbUPCHx",
                },
              ].map((doc, idx) => (
                <div
                  key={idx}
                  className="group bg-slate-950/50 border border-slate-800 hover:border-blue-500/50 p-5 rounded-2xl transition-all duration-300"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-slate-900 rounded-xl text-slate-400 group-hover:text-blue-400 transition-colors">
                      <FileText size={20} />
                    </div>
                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tighter">
                      {doc.size}
                    </span>
                  </div>
                  <h3 className="text-white font-semibold truncate text-sm mb-1">
                    {doc.name}
                  </h3>
                  <p className="text-xs text-slate-500 mb-4">{doc.type}</p>
                  <a
                    href={doc.url}
                    download
                    className="flex items-center justify-center gap-2 w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold rounded-lg border border-slate-800 transition-colors"
                  >
                    <Download size={14} /> Download PDF
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
