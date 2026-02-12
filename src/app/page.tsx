import React from "react";
import Link from "next/link";
import {
  Upload,
  ShieldCheck,
  Zap,
  BarChart3,
  FileText,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0B0F1A] text-slate-200 font-sans selection:bg-blue-500/30">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 bg-[#0B0F1A]/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-lg shadow-lg shadow-blue-900/20">
            <BarChart3 className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            :)
          </span>
        </div>
        <div className="hidden md:flex gap-8 text-sm font-medium text-slate-400">
          <a href="#features" className="hover:text-blue-400 transition-colors">
            Features
          </a>
        </div>
        <button className="bg-white text-slate-950 px-5 py-2 rounded-full text-sm font-bold hover:bg-slate-200 transition-all active:scale-95">
          Sign In
        </button>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="max-w-6xl mx-auto px-8 pt-24 pb-20 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 px-4 py-1.5 rounded-full text-sm font-medium mb-8 animate-fade-in">
            <Zap size={14} className="fill-current" />
            <span>Analysis in an average of 20 seconds</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight leading-[1.1]">
            Financial Intelligence <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
              at the speed of thought.
            </span>
          </h1>

          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            Upload any 10-K, annual report, or fiscal statement. My AI extracts
            key figures, EBITDA, and risk factors into a structured dashboard
            almost eveytime.
          </p>

          {/* Upload Zone Link */}
          <Link href="/upload" className="block max-w-2xl mx-auto group">
            <div className="relative p-12 border-2 border-dashed border-slate-800 rounded-3xl bg-slate-900/50 hover:bg-slate-900 hover:border-blue-500/50 transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-blue-500/10">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-blue-600/10 text-blue-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                  <Upload size={32} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Drop your report here
                </h3>
                <p className="text-slate-500 text-sm mb-8">
                  PDF, XLSX, or DOCX up to 50MB
                </p>
                <div className="flex items-center gap-2 bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold group-hover:bg-blue-500 transition-colors shadow-xl shadow-blue-900/40">
                  Get Started <ArrowRight size={20} />
                </div>
              </div>
            </div>
          </Link>
        </section>

        {/* Features Section */}
        <section
          id="features"
          className="py-24 bg-slate-950/50 border-y border-slate-900"
        >
          <div className="max-w-6xl mx-auto px-8">
            <div className="grid md:grid-cols-3 gap-16">
              {[
                {
                  icon: <Zap size={28} />,
                  title: "Sub-20s Processing",
                  desc: "Optimized LLM pipeline designed for instant extraction without sacrificing accuracy.",
                },
                {
                  icon: <TrendingUp size={28} />,
                  title: "Structured Figures",
                  desc: "Key metrics like Revenue, EBITDA, and Debt-to-Equity formatted for immediate review.",
                },
                {
                  icon: <ShieldCheck size={28} />,
                  title: "Bank-Grade Privacy",
                  desc: "Your data is never used for training. AES-256 encryption at rest and in transit.",
                },
              ].map((feature, i) => (
                <div key={i} className="space-y-4 group">
                  <div className="text-blue-500 group-hover:text-blue-400 transition-colors">
                    {feature.icon}
                  </div>
                  <h4 className="text-xl font-bold text-white">
                    {feature.title}
                  </h4>
                  <p className="text-slate-400 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Dashboard Preview */}
        <section className="max-w-6xl mx-auto px-8 py-32">
          <div className="bg-gradient-to-br from-slate-900 to-[#0B0F1A] rounded-[2.5rem] p-8 md:p-16 border border-slate-800 relative overflow-hidden">
            {/* Ambient Glow */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] -z-0" />

            <div className="relative z-10 grid md:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl font-bold text-white mb-8 leading-tight">
                  Stop hunting through <br />
                  <span className="text-slate-500">100-page PDFs.</span>
                </h2>
                <ul className="space-y-5">
                  {[
                    "Automated Cash Flow analysis",
                    "Segment-wise revenue breakdown",
                    "YoY & QoQ growth metrics",
                    "One-click Export to Excel",
                  ].map((item, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-4 text-slate-300"
                    >
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/10 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Mockup Dashboard UI */}
              <div className="bg-[#0B0F1A] rounded-2xl p-6 border border-slate-800 shadow-3xl">
                <div className="flex justify-between items-center mb-6">
                  <div className="h-4 w-32 bg-slate-800 rounded-full" />
                  <div className="h-4 w-12 bg-blue-500/20 rounded-full" />
                </div>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="h-24 bg-slate-900 rounded-xl border border-slate-800 p-4">
                    <div className="h-2 w-12 bg-slate-800 rounded mb-2" />
                    <div className="h-6 w-20 bg-blue-500/40 rounded" />
                  </div>
                  <div className="h-24 bg-slate-900 rounded-xl border border-slate-800 p-4">
                    <div className="h-2 w-12 bg-slate-800 rounded mb-2" />
                    <div className="h-6 w-20 bg-emerald-500/40 rounded" />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="h-3 w-full bg-slate-900 rounded" />
                  <div className="h-3 w-full bg-slate-900 rounded" />
                  <div className="h-3 w-4/5 bg-slate-900 rounded" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-900 py-10 px-8 text-center bg-[#080B14]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2 opacity-50">
            <BarChart3 size={20} />
            <span className="font-bold">Financial Reports Analyzer</span>
          </div>
          <p className="text-slate-600 text-sm">
            {" "}
            <button className="border-2 border-radius-2 p-2 flex flex-row items-center gap-3">
              <img
                src="/sambhav.jpg"
                className="rounded-full h-5 w-5 object-cover"
                alt="Dev profile"
              />
              <a
                href="https://www.linkedin.com/in/sambhavvinay/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                Dev :)
              </a>
            </button>
          </p>
          <div className="flex gap-6 text-slate-500 text-sm">
            <a href="#" className="hover:text-white transition">
              Privacy
            </a>
            <a href="#" className="hover:text-white transition">
              Terms
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
