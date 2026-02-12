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
  FileSpreadsheet,
  FileText,
} from "lucide-react";
import * as XLSX from "xlsx";

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

  // --- FIXED EXCEL LOGIC: FLATTENING THE NESTED DATA ---
  const generateExcel = () => {
    if (!data) return;

    const formatKey = (str: string) =>
      str.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

    const finalRows: any[] = [];

    // Process the data to ensure nested objects get their own rows
    Object.entries(data).forEach(([key, value]) => {
      if (typeof value === "object" && value !== null) {
        // If it's an object (like "data"), create a header row or just skip to sub-items
        finalRows.push({
          "Financial Metric": `--- ${formatKey(key)} ---`,
          Value: "",
        });

        Object.entries(value).forEach(([subKey, subValue]) => {
          finalRows.push({
            "Financial Metric": formatKey(subKey),
            Value:
              typeof subValue === "object"
                ? JSON.stringify(subValue)
                : subValue,
          });
        });
      } else {
        // Top level simple items (like "units")
        finalRows.push({
          "Financial Metric": formatKey(key),
          Value: value,
        });
      }
    });

    const worksheet = XLSX.utils.json_to_sheet(finalRows);

    // Auto-size columns roughly
    const wscols = [{ wch: 35 }, { wch: 45 }];
    worksheet["!cols"] = wscols;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Financial Analysis");

    XLSX.writeFile(workbook, `Financial_Report_${Date.now()}.xlsx`);
  };

  return (
    <main className="min-h-screen bg-[#0B0F1A] text-slate-200 font-sans pb-20">
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
        </div>
      )}

      <div className="max-w-5xl mx-auto px-6 pt-12">
        <header className="mb-12 text-center md:text-left">
          <h1 className="text-4xl font-extrabold text-white mb-2">
            Upload Report
          </h1>
          <p className="text-slate-400 text-lg">
            Parsed data ready for Excel export.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
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
                  <p className="text-white font-medium truncate max-w-[200px]">
                    {file ? file.name : "Choose PDF file"}
                  </p>
                </div>
              </div>

              <button
                onClick={handleUpload}
                disabled={!file || isLoading}
                className="w-full mt-8 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? "Processing..." : "Extract Intelligence"}
              </button>

              {data && (
                <button
                  onClick={generateExcel}
                  className="w-full mt-4 bg-gradient-to-br from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2"
                >
                  <FileSpreadsheet size={20} />
                  Download Excel Sheet
                </button>
              )}
            </div>
          </div>

          <div className="lg:col-span-7">
            {data && (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
                <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
                  <h2 className="font-bold text-white">
                    Extraction Successful
                  </h2>
                </div>
                <pre className="p-6 text-sm font-mono text-blue-400 overflow-auto max-h-[600px]">
                  {JSON.stringify(data, null, 4)}
                </pre>
              </div>
            )}
          </div>
        </div>
        <section className="mt-16 pb-20 border-t border-slate-800 pt-12">
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
