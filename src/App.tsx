import React, { useState, useEffect, useRef } from "react";
import { 
  Github, 
  Search, 
  TrendingUp, 
  Award, 
  Zap, 
  Code, 
  BookOpen, 
  Folder, 
  Users, 
  MapPin, 
  Link as LinkIcon, 
  Twitter, 
  Calendar, 
  CheckCircle, 
  AlertTriangle, 
  Activity, 
  RefreshCw, 
  Download, 
  Share2, 
  Sparkles, 
  Copy, 
  Check, 
  GitPullRequest, 
  GitBranch, 
  Info, 
  Flame, 
  ArrowRight,
  Briefcase,
  ChevronRight,
  HelpCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { GithubProfile, RepoAnalysis, Scorecard, ScorecardReport, LeaderboardEntry } from "./types";

export default function App() {
  // Navigation tabs
  // 'landing' | 'dashboard' | 'compare' | 'leaderboard' | 'about'
  const [currentTab, setCurrentTab] = useState<string>("landing");

  // Single analysis states
  const [username, setUsername] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisStep, setAnalysisStep] = useState<string>("");
  const [currentReport, setCurrentReport] = useState<ScorecardReport | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // Comparison states
  const [user1, setUser1] = useState<string>("");
  const [user2, setUser2] = useState<string>("");
  const [isComparing, setIsComparing] = useState<boolean>(false);
  const [comparisonResult, setComparisonResult] = useState<{ user1: ScorecardReport; user2: ScorecardReport } | null>(null);
  const [compareError, setCompareError] = useState<string | null>(null);

  // Leaderboard states
  const [leaderboardList, setLeaderboardList] = useState<LeaderboardEntry[]>([]);
  const [leaderboardFilter, setLeaderboardFilter] = useState<'all' | 'college' | 'country'>('all');
  const [leaderboardSearch, setLeaderboardSearch] = useState<string>("");
  const [isLoadingLeaderboard, setIsLoadingLeaderboard] = useState<boolean>(false);

  // Copy badges feedback
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Dashboard Sub-Tabs
  const [activeDashTab, setActiveDashTab] = useState<'overview' | 'repos' | 'insights'>('overview');

  // Load baseline leaderboard on mount
  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    setIsLoadingLeaderboard(true);
    try {
      const res = await fetch("/api/leaderboard");
      if (res.ok) {
        const data = await res.json();
        setLeaderboardList(data.leaderboard);
      }
    } catch (err) {
      console.error("Failed to load leaderboard:", err);
    } finally {
      setIsLoadingLeaderboard(false);
    }
  };

  // Run scoring analysis for clean single developer
  const handleAnalyze = async (searchUsername: string) => {
    const rawName = searchUsername.replace(/^(https?:\/\/)?(www\.)?github\.com\//, "").trim();
    if (!rawName) return;

    setIsAnalyzing(true);
    setAnalysisError(null);
    setCurrentReport(null);
    setActiveDashTab('overview');

    const steps = [
      "Connecting to GitHub REST API...",
      "Querying public user metadata and followers...",
      "Parsing repository metadata and topic tags...",
      "Inspecting code quality and README completeness...",
      "Invoking Gemini AI scoring engine & developer review...",
      "Formulating career path & job alignment insights..."
    ];

    let currentStepIdx = 0;
    setAnalysisStep(steps[currentStepIdx]);
    const stepInterval = setInterval(() => {
      if (currentStepIdx < steps.length - 1) {
        currentStepIdx++;
        setAnalysisStep(steps[currentStepIdx]);
      }
    }, 1100);

    try {
      const res = await fetch(`/api/analyze/${encodeURIComponent(rawName)}`);
      clearInterval(stepInterval);
      
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || `HTTP ${res.status} analysis failure`);
      }

      const report: ScorecardReport = await res.json();
      setCurrentReport(report);
      setCurrentTab("dashboard");
      fetchLeaderboard(); // refresh leaderboard list silently
    } catch (err: any) {
      clearInterval(stepInterval);
      setAnalysisError(err.message || "An error occurred during evaluation.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Compare two GitHub profiles side by side
  const handleCompare = async () => {
    const name1 = user1.replace(/^(https?:\/\/)?(www\.)?github\.com\//, "").trim();
    const name2 = user2.replace(/^(https?:\/\/)?(www\.)?github\.com\//, "").trim();

    if (!name1 || !name2) {
      setCompareError("Please enter both usernames to compute comparison.");
      return;
    }

    setIsComparing(true);
    setCompareError(null);
    setComparisonResult(null);

    try {
      const res = await fetch(`/api/compare?user1=${encodeURIComponent(name1)}&user2=${encodeURIComponent(name2)}`);
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || `Failed to fetch profiles comparison`);
      }
      const data = await res.json();
      setComparisonResult(data);
    } catch (err: any) {
      setCompareError(err.message || "An error occurred during comparison.");
    } finally {
      setIsComparing(false);
    }
  };

  // Score grade styling helper
  const getGradeMeta = (grade: string) => {
    switch (grade) {
      case "S+":
        return { bg: "bg-amber-500/10", border: "border-amber-500", text: "text-amber-400" };
      case "S":
        return { bg: "bg-orange-500/10", border: "border-orange-500", text: "text-orange-400" };
      case "A+":
        return { bg: "bg-brand-green/10", border: "border-brand-green", text: "text-brand-green" };
      case "A":
        return { bg: "bg-emerald-500/10", border: "border-emerald-500", text: "text-emerald-400" };
      case "B+":
        return { bg: "bg-brand-blue/10", border: "border-brand-blue", text: "text-brand-blue" };
      case "B":
        return { bg: "bg-indigo-500/10", border: "border-indigo-500", text: "text-indigo-400" };
      case "C":
        return { bg: "bg-red-500/10", border: "border-red-500", text: "text-red-400" };
      default:
        return { bg: "bg-zinc-500/10", border: "border-zinc-500", text: "text-zinc-400" };
    }
  };

  const getPercentageFill = (categoryScore: number, maxVal: number) => {
    return Math.min(100, Math.max(0, Math.floor((categoryScore / maxVal) * 100)));
  };

  // Create badge snippet copy action
  const handleCopyBadge = (username: string, score: number, grade: string) => {
    const badgeMarkdown = `[![GitHub Scorecard](https://img.shields.io/badge/GitHub_Score-${score}/1000--${grade}-8b5cf6?style=for-the-badge&logo=github)](https://ai.studio/build)`;
    navigator.clipboard.writeText(badgeMarkdown);
    setCopiedText(`markdown-${username}`);
    setTimeout(() => setCopiedText(null), 2500);
  };

  const handleCopyTag = (tagName: string, textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy);
    setCopiedText(tagName);
    setTimeout(() => setCopiedText(null), 2500);
  };

  // Prepopulate form when clicking leaderboard developers
  const triggerUserFromLeaderboard = (uname: string) => {
    setUsername(uname);
    handleAnalyze(uname);
  };

  // Download Card action (creates visual printable capture)
  const handlePrintCard = () => {
    window.print();
  };

  return (
    <div className="min-h-screen text-gray-200 selection:bg-brand-purple/40">
      
      {/* Top Header Navigation */}
      <header className="sticky top-0 z-40 bg-[#0B1020]/80 backdrop-blur-xl border-b border-gray-800 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div 
            onClick={() => setCurrentTab("landing")} 
            className="flex items-center gap-2.5 cursor-pointer group"
            id="brand-logo"
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-brand-purple to-brand-blue flex items-center justify-center shadow-lg shadow-brand-purple/20">
              <Github className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <span className="font-display font-black text-xl tracking-tight text-white bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text">
                GIT<span className="text-brand-purple">SCORE</span>
              </span>
              <span className="block text-[10px] uppercase font-mono tracking-widest text-brand-green">Scorecard Engine</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            <button 
              onClick={() => setCurrentTab("landing")}
              className={`px-3.5 py-1.5 rounded-md transition-colors ${currentTab === 'landing' ? 'bg-gray-800 text-white border border-gray-700' : 'text-gray-400 hover:text-white'}`}
            >
              Analyze Profile
            </button>
            <button 
              onClick={() => setCurrentTab("compare")}
              className={`px-3.5 py-1.5 rounded-md transition-colors ${currentTab === 'compare' ? 'bg-gray-800 text-white border border-gray-700' : 'text-gray-400 hover:text-white'}`}
            >
              Compare
            </button>
            <button 
              onClick={() => setCurrentTab("leaderboard")}
              className={`px-3.5 py-1.5 rounded-md transition-colors ${currentTab === 'leaderboard' ? 'bg-gray-800 text-white border border-gray-700' : 'text-gray-400 hover:text-white'}`}
            >
              Global Rankings
            </button>
            <button 
              onClick={() => setCurrentTab("about")}
              className={`px-3.5 py-1.5 rounded-md transition-colors ${currentTab === 'about' ? 'bg-gray-800 text-white border border-gray-700' : 'text-gray-400 hover:text-white'}`}
            >
              Algorithm
            </button>
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setUsername("torvalds");
                handleAnalyze("torvalds");
              }}
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 bg-brand-purple text-white rounded-lg hover:bg-brand-purple/90 active:scale-95 transition-all shadow-md shadow-brand-purple/20"
            >
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              Linus Torvalds Scorecard
            </button>
          </div>
        </div>
      </header>

      {/* Main Display Container */}
      <main className="max-w-7xl mx-auto px-4 py-8 md:py-12 pb-24">
        
        {/* Loading overlay for analytical evaluations */}
        <AnimatePresence>
          {isAnalyzing && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-[#0B1020]/95 backdrop-blur-lg flex flex-col items-center justify-center p-6 text-center"
            >
              <div className="max-w-md w-full flex flex-col items-center">
                
                {/* Advanced rotating concentric rings */}
                <div className="relative w-28 h-28 mb-8">
                  <div className="absolute inset-0 rounded-full border-4 border-dashed border-brand-purple/20 animate-spin" style={{ animationDuration: '20s' }}></div>
                  <div className="absolute inset-2 rounded-full border-4 border-brand-blue/30 border-t-brand-blue animate-spin" style={{ animationDuration: '3s' }}></div>
                  <div className="absolute inset-4 rounded-full border-4 border-dashed border-brand-green/20 animate-spin" style={{ animationDuration: '8s' }}></div>
                  <div className="absolute inset-6 rounded-full border-2 border-brand-amber/40 border-b-brand-amber animate-spin" style={{ animationDuration: '1.5s' }}></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Github className="w-8 h-8 text-brand-purple animate-pulse" />
                  </div>
                </div>

                <h3 className="text-xl font-display font-black text-white tracking-tight mb-2">
                  COMPILING DEVELOPER METRICS
                </h3>
                <p className="text-xs font-mono text-brand-purple uppercase tracking-widest bg-brand-purple/10 px-3 py-1 rounded-full mb-6">
                  {username || "In Progress"}
                </p>

                {/* Live step description */}
                <div className="w-full bg-gray-900 border border-gray-800 rounded-xl p-4 min-h-[72px] flex items-center justify-center gap-3">
                  <RefreshCw className="w-4 h-4 text-brand-green animate-spin shrink-0" />
                  <p className="text-sm font-medium text-gray-300 text-left">
                    {analysisStep}
                  </p>
                </div>

                <div className="mt-8 text-xs text-gray-500 font-mono italic max-w-sm">
                  Applying Gemini AI analysis over commits, public contributions, and code structures.
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* LANDING TAB */}
        {currentTab === "landing" && (
          <div className="space-y-16 py-4">
            
            {/* Elegant Hero Grid */}
            <div className="text-center max-w-3xl mx-auto space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-purple/10 border border-brand-purple/30 rounded-full text-brand-purple font-mono text-xs uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                Gemini-Powered Recruitment Metrics
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-black tracking-tight leading-tight text-white">
                How Strong Is Your <br />
                <span className="bg-gradient-to-r from-brand-blue via-brand-purple to-brand-amber bg-clip-text text-transparent">
                  GitHub Profile?
                </span>
              </h1>

              <p className="text-lg text-gray-400 max-w-2xl mx-auto font-sans leading-relaxed">
                Connect your developer journey. Fetch any public GitHub handle and receive an 
                AI-quantified developer scorecard, deep code analysis, repository breakdown, and role matching suggestions.
              </p>

              {/* Quick direct landing CTAs */}
              <div id="hero-actions" className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <a 
                  href="#verify-input" 
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById("verify-input")?.scrollIntoView({ behavior: "smooth" });
                    const inp = document.getElementById("username-input") as HTMLInputElement;
                    if (inp) inp.focus();
                  }}
                  className="px-5 py-2.5 bg-gradient-to-r from-brand-purple to-brand-blue hover:from-brand-purple/95 hover:to-brand-blue/95 text-white text-xs font-bold font-mono tracking-wide uppercase rounded-xl transition-all shadow-md shadow-brand-purple/20 flex items-center gap-1.5"
                >
                  <Search className="w-3.5 h-3.5" />
                  Get Your Score
                </a>
                <button 
                  onClick={() => setCurrentTab("compare")}
                  className="px-5 py-2.5 bg-gray-900 border border-gray-800 hover:bg-gray-800 text-gray-300 text-xs font-bold font-mono tracking-wide uppercase rounded-xl transition-all flex items-center gap-1.5"
                >
                  <Users className="w-3.5 h-3.5 text-brand-blue" />
                  Compare Profiles
                </button>
                <button 
                  onClick={() => setCurrentTab("leaderboard")}
                  className="px-5 py-2.5 bg-gray-900 border border-gray-800 hover:bg-gray-800 text-gray-300 text-xs font-bold font-mono tracking-wide uppercase rounded-xl transition-all flex items-center gap-1.5"
                >
                  <Award className="w-3.5 h-3.5 text-brand-amber" />
                  View Rankings
                </button>
              </div>
            </div>

            {/* Analysis Entry Box */}
            <div id="verify-input" className="scroll-mt-24 max-w-xl mx-auto">
              <div className="bg-gray-900/40 p-6 sm:p-8 rounded-2xl border border-gray-800 shadow-2xl space-y-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-purple/5 rounded-full blur-3xl"></div>
                
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider text-center">
                  Verify Dev Scorecard
                </h3>

                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (username.trim()) handleAnalyze(username);
                  }}
                  className="space-y-4"
                >
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                    <input 
                      id="username-input"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter username (e.g. torvalds or JohnDev)"
                      className="w-full bg-black/50 border border-gray-700 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-brand-purple transition-all text-sm font-mono"
                    />
                  </div>

                  {analysisError && (
                    <div className="p-3 bg-red-950/40 border border-red-900/60 rounded-xl flex gap-2.5 items-start text-xs text-red-300">
                      <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                      <div>
                        {analysisError.includes("USER_NOT_FOUND") 
                          ? "This GitHub handle could not be found. Please check your spelling."
                          : analysisError}
                      </div>
                    </div>
                  )}

                  <button 
                    type="submit"
                    className="w-full bg-gradient-to-r from-brand-purple to-brand-blue text-white py-3.5 px-6 rounded-xl font-bold hover:opacity-95 active:scale-[0.99] transition-all flex items-center justify-center gap-2 text-sm shadow-lg shadow-brand-purple/20"
                  >
                    Get AI Scorecard
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>

                <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs text-gray-500 font-mono">
                  <span>Try:</span>
                  <button onClick={() => triggerUserFromLeaderboard("torvalds")} className="hover:text-brand-purple hover:underline text-gray-400">torvalds</button>
                  <span>•</span>
                  <button onClick={() => triggerUserFromLeaderboard("yyx990803")} className="hover:text-brand-purple hover:underline text-gray-400">yyx990803</button>
                  <span>•</span>
                  <button onClick={() => triggerUserFromLeaderboard("gvanrossum")} className="hover:text-brand-purple hover:underline text-gray-400">gvanrossum</button>
                  <span>•</span>
                  <button onClick={() => triggerUserFromLeaderboard("BikramManna")} className="hover:text-brand-purple hover:underline text-gray-400">BikramManna</button>
                </div>
              </div>
            </div>

            {/* Quick Metrics Categories Description for placemets */}
            <div className="max-w-5xl mx-auto space-y-6 pt-4">
              <h3 className="text-sm font-mono text-center uppercase tracking-widest text-[#8A8A8A]">
                Score weight boundaries (1000 pts)
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                <div className="bg-gray-900/35 border border-gray-800 p-4 rounded-xl text-center">
                  <span className="block text-xl font-display font-black text-white">100</span>
                  <span className="block text-xs font-mono text-gray-500 mt-1">Profile Docs</span>
                </div>
                <div className="bg-gray-900/35 border border-gray-800 p-4 rounded-xl text-center">
                  <span className="block text-xl font-display font-black text-white">100</span>
                  <span className="block text-xs font-mono text-gray-500 mt-1">Social followers</span>
                </div>
                <div className="bg-gray-900/35 border border-gray-800 p-4 rounded-xl text-center">
                  <span className="block text-xl font-display font-black text-white">200</span>
                  <span className="block text-xs font-mono text-gray-500 mt-1">Repository Quality</span>
                </div>
                <div className="bg-gray-900/35 border border-gray-800 p-4 rounded-xl text-center">
                  <span className="block text-xl font-display font-black text-white">250</span>
                  <span className="block text-xs font-mono text-gray-500 mt-1">Commit Activity</span>
                </div>
                <div className="bg-gray-900/35 border border-gray-800 p-4 rounded-xl text-center">
                  <span className="block text-xl font-display font-black text-white">150</span>
                  <span className="block text-xs font-mono text-gray-500 mt-1">Open Source OS</span>
                </div>
                <div className="bg-gray-900/35 border border-gray-800 p-4 rounded-xl text-center">
                  <span className="block text-xl font-display font-black text-white">100</span>
                  <span className="block text-xs font-mono text-gray-500 mt-1">Consistency</span>
                </div>
                <div className="bg-gray-900/35 border border-gray-800 p-4 rounded-xl text-center">
                  <span className="block text-xl font-display font-black text-white">100</span>
                  <span className="block text-xs font-mono text-gray-500 mt-1">Community</span>
                </div>
              </div>
            </div>

            {/* Top Leaderboard Sneak-peek list */}
            <div className="max-w-4xl mx-auto space-y-6 pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-brand-purple" />
                  <h3 className="font-display font-bold text-lg text-white">Top Rated Profiles</h3>
                </div>
                <button 
                  onClick={() => setCurrentTab("leaderboard")}
                  className="text-xs font-mono text-brand-purple hover:underline flex items-center gap-1"
                >
                  View Global Rankers
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="bg-gray-900/20 border border-gray-800 rounded-2xl overflow-hidden divide-y divide-gray-800/60">
                {leaderboardList.slice(0, 3).map((item, index) => (
                  <div key={item.username} className="flex flex-wrap items-center justify-between p-4 px-6 hover:bg-gray-800/10 transition-colors">
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-sm font-bold text-gray-500 w-5">#{index + 1}</span>
                      <img src={item.avatarUrl} alt={item.name} className="w-9 h-9 rounded-full border border-gray-700 bg-gray-900 object-cover" />
                      <div>
                        <p className="font-semibold text-white leading-tight text-sm">{item.name}</p>
                        <p className="font-mono text-xs text-brand-blue">@{item.username}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-5 mt-2 sm:mt-0">
                      <div className="text-right sm:text-left">
                        <p className="text-xs font-mono text-gray-500">Percentile</p>
                        <p className="text-xs font-mono font-semibold text-brand-amber">{item.percentile}</p>
                      </div>

                      <div className="text-right">
                        <span className={`inline-block text-xs font-mono font-black border px-2.5 py-0.5 rounded-md ${getGradeMeta(item.grade).bg} ${getGradeMeta(item.grade).text} ${getGradeMeta(item.grade).border}`}>
                          {item.grade}
                        </span>
                        <p className="text-sm font-black font-mono text-white mt-0.5">{item.overallScore}</p>
                      </div>

                      <button
                        onClick={() => triggerUserFromLeaderboard(item.username)}
                        className="px-3 py-1.5 bg-gray-800 text-gray-300 font-mono text-xs font-semibold rounded-lg hover:bg-brand-purple hover:text-white transition-all flex items-center gap-1"
                      >
                        Check
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* PROFILE DASHBOARD REPORT CARD */}
        {currentTab === "dashboard" && currentReport && (
          <div className="space-y-8 animate-fade-in print:bg-white print:text-black">
            
            {/* Header / Actions bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-6 print:hidden">
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setCurrentTab("landing")}
                  className="text-xs font-mono font-bold text-gray-400 hover:text-white px-3 py-1.5 bg-gray-900 border border-gray-800 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  ← New Analysis
                </button>
                <div className="h-4 w-px bg-gray-800 mx-1"></div>
                <span className="text-xs text-gray-400 font-mono">
                  Generated {new Date(currentReport.scorecard.analyzedAt).toLocaleDateString()}
                </span>
              </div>

              <div className="flex flex-wrap gap-2.5">
                <button 
                  onClick={handlePrintCard}
                  className="px-4 py-2 bg-brand-blue text-white font-bold rounded-lg text-xs flex items-center gap-1.5 hover:bg-brand-blue/90 transition-colors shadow-md shadow-brand-blue/15"
                >
                  <Download className="w-3.5 h-3.5" />
                  Print Scorecard PDF
                </button>
                <button 
                  onClick={() => setCurrentTab("compare")}
                  className="px-4 py-2 bg-gray-800 text-white font-bold border border-gray-700 rounded-lg text-xs flex items-center gap-1.5 hover:bg-gray-700 transition-colors"
                >
                  <Users className="w-3.5 h-3.5" />
                  Compare This Score
                </button>
              </div>
            </div>

            {/* Scorecard Hero Banner card */}
            <div className="bg-gray-900/30 border border-gray-800 rounded-2xl p-6 sm:p-8 flex flex-col lg:flex-row items-center gap-8 relative overflow-hidden">
              {/* background atmospheric ambient */}
              <div className="absolute -top-24 -left-24 w-72 h-72 bg-brand-purple/10 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-brand-blue/10 rounded-full blur-3xl"></div>

              {/* Profile Details */}
              <div className="flex-1 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-5">
                <img 
                  src={currentReport.profile.avatarUrl} 
                  alt={currentReport.profile.name || currentReport.profile.username} 
                  className="w-24 h-24 rounded-full border-2 border-brand-purple shadow-xl shadow-brand-purple/10 bg-gray-900 object-cover shrink-0"
                />
                <div className="space-y-2.5">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-purple/10 border border-brand-purple/30 rounded-full text-brand-purple font-mono text-[10px] font-bold uppercase tracking-widest leading-none">
                      <Award className="w-3 h-3 text-brand-purple" />
                      {currentReport.scorecard.overallScore >= 900 ? "Elite Developer" : currentReport.scorecard.overallScore >= 750 ? "Advanced Guild" : "Contributor"}
                    </span>
                    <span className="text-xs font-mono text-brand-green bg-brand-green/10 border border-brand-green/20 px-2.5 py-0.5 rounded-full font-bold">
                      Top {currentReport.scorecard.percentile}% Globally
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-display font-black text-white leading-none">
                    {currentReport.profile.name || currentReport.profile.username}
                  </h2>
                  
                  <p className="font-mono text-sm text-brand-blue">
                    @{currentReport.profile.username}
                  </p>

                  {currentReport.profile.bio && (
                    <p className="text-sm text-gray-400 max-w-xl font-sans font-medium italic">
                      " {currentReport.profile.bio} "
                    </p>
                  )}

                  {/* Profile completeness metadata summary */}
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs font-mono text-gray-400 pt-1.5">
                    {currentReport.profile.location && (
                      <span className="flex items-center gap-1 pt-1">
                        <MapPin className="w-3.5 h-3.5 text-gray-500" />
                        {currentReport.profile.location}
                      </span>
                    )}
                    {currentReport.profile.website && (
                      <a href={currentReport.profile.website} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-brand-blue pt-1">
                        <LinkIcon className="w-3.5 h-3.5 text-gray-500" />
                        Website
                      </a>
                    )}
                    <span className="flex items-center gap-1 pt-1">
                      <Folder className="w-3.5 h-3.5 text-gray-500" />
                      {currentReport.profile.publicRepos} Repos
                    </span>
                    <span className="flex items-center gap-1 pt-1">
                      <Users className="w-3.5 h-3.5 text-gray-500" />
                      {currentReport.profile.followers} Followers
                    </span>
                  </div>
                </div>
              </div>

              {/* Animated Core score circle */}
              <div className="relative shrink-0 flex flex-col items-center justify-center p-4">
                <div className="w-48 h-48 rounded-full border border-gray-800 flex items-center justify-center relative inner-glow">
                  {/* Circle SVG Progress tracker */}
                  <svg className="absolute inset-0 w-full h-full -rotate-90">
                    <circle className="text-gray-900" cx="50%" cy="50%" fill="transparent" r="90" stroke="currentColor" strokeWidth="6"></circle>
                    <circle 
                      className="text-brand-purple" 
                      cx="50%" 
                      cy="50%" 
                      fill="transparent" 
                      r="90" 
                      stroke="currentColor" 
                      strokeWidth="6"
                      strokeDasharray="565"
                      strokeDashoffset={565 - (565 * (currentReport.scorecard.overallScore / 1000))}
                    ></circle>
                  </svg>
                  <div className="text-center z-10">
                    <span className="font-display text-[64px] font-extrabold text-white leading-none tracking-tighter">
                      {currentReport.scorecard.overallScore}
                    </span>
                    <p className="font-mono text-xs text-brand-purple font-black uppercase tracking-widest mt-0.5">DEV CORE</p>
                  </div>
                </div>

                {/* Score badge Grade indicator */}
                <div className={`absolute top-0 right-0 inline-flex flex-col items-center justify-center bg-gray-950 border ${getGradeMeta(currentReport.scorecard.grade).border} rounded-2xl px-4 py-2 text-center shadow-lg`}>
                  <p className="text-[9px] font-mono tracking-wider uppercase text-gray-500 font-bold">Grade</p>
                  <p className={`text-2xl font-mono font-black ${getGradeMeta(currentReport.scorecard.grade).text}`}>
                    {currentReport.scorecard.grade}
                  </p>
                </div>
              </div>

            </div>

            {/* Profile badge creator widget and improvement suggestions inline alert */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              
              {/* Badge snippets copying section */}
              <div className="md:col-span-5 bg-gray-900/30 border border-gray-800 rounded-2xl p-5 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-white text-sm flex items-center gap-1.5 mb-1">
                    <Sparkles className="w-4 h-4 text-brand-purple" />
                    Developer Badge
                  </h3>
                  <p className="text-xs text-gray-400 mb-4 font-mono leading-relaxed">
                    Embed this dynamic scorecard score badge directly onto your personal README profile portfolio page.
                  </p>
                </div>

                <div className="bg-black/50 border border-gray-850 p-4 rounded-xl space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-brand-green uppercase tracking-wider font-semibold">Markdown Code</span>
                    <button 
                      onClick={() => handleCopyBadge(currentReport.profile.username, currentReport.scorecard.overallScore, currentReport.scorecard.grade)}
                      className="text-xs font-mono text-gray-400 hover:text-white flex items-center gap-1"
                    >
                      {copiedText === `markdown-${currentReport.profile.username}` ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-brand-green" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          Copy Badge
                        </>
                      )}
                    </button>
                  </div>
                  <code className="block text-[11px] font-mono text-brand-amber bg-gray-900/80 p-2.5 rounded border border-gray-850 break-all select-all select-none">
                    [![Dev Scorecard](https://img.shields.io/badge/Score-{currentReport.scorecard.overallScore}/1000--{currentReport.scorecard.grade}-8b5cf6)](https://githubscorecard.generator)
                  </code>
                </div>
              </div>

              {/* Complete profile checklist widget */}
              <div className="md:col-span-7 bg-gray-900/30 border border-gray-800 rounded-2xl p-5 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-white text-sm flex items-center gap-1.5 mb-2">
                    <CheckCircle className="w-4 h-4 text-brand-green" />
                    Profile Completeness Index: {currentReport.scorecard.metrics.profileCompleteness}/100
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-3.5 pt-1">
                    <div className="flex items-center gap-2 text-xs font-mono">
                      <CheckCircle className="w-4 h-4 text-brand-green shrink-0 bg-brand-green/5 rounded-full" />
                      <span className="text-gray-300">Avatar Picture</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-mono">
                      {currentReport.profile.bio ? (
                        <CheckCircle className="w-4 h-4 text-brand-green shrink-0 bg-brand-green/5 rounded-full" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-gray-700 shrink-0"></div>
                      )}
                      <span className={currentReport.profile.bio ? "text-gray-300" : "text-gray-500 line-through"}>Biography Bio</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-mono">
                      {currentReport.profile.location ? (
                        <CheckCircle className="w-4 h-4 text-brand-green shrink-0 bg-brand-green/5 rounded-full" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-gray-700 shrink-0"></div>
                      )}
                      <span className={currentReport.profile.location ? "text-gray-300" : "text-gray-500 line-through"}>Geo Location</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-mono">
                      {currentReport.profile.website ? (
                        <CheckCircle className="w-4 h-4 text-brand-green shrink-0 bg-brand-green/5 rounded-full" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-gray-700 shrink-0"></div>
                      )}
                      <span className={currentReport.profile.website ? "text-gray-300" : "text-gray-500 line-through"}>Website Reference</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-mono">
                      {currentReport.profile.twitterUsername ? (
                        <CheckCircle className="w-4 h-4 text-brand-green shrink-0 bg-brand-green/5 rounded-full" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-gray-700 shrink-0"></div>
                      )}
                      <span className={currentReport.profile.twitterUsername ? "text-gray-300" : "text-gray-500 line-through"}>Social Links Linked</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-mono">
                      {currentReport.profile.hasReadmeProfile ? (
                        <CheckCircle className="w-4 h-4 text-brand-green shrink-0 bg-brand-green/5 rounded-full" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-gray-700 shrink-0"></div>
                      )}
                      <span className="text-gray-300">README Profile Setup</span>
                    </div>
                  </div>
                </div>

                <div className="w-full bg-gray-950 h-2 rounded-full overflow-hidden mt-4 relative">
                  <div className="bg-brand-green h-full" style={{ width: `${currentReport.scorecard.metrics.profileCompleteness}%` }}></div>
                </div>
              </div>

            </div>

            {/* Navigation Tabs for Dashboard Details */}
            <div className="border-b border-gray-800 flex gap-4 print:hidden">
              <button 
                onClick={() => setActiveDashTab('overview')}
                className={`pb-3.5 text-sm font-bold tracking-tight border-b-2 transition-all ${activeDashTab === 'overview' ? 'border-brand-purple text-white' : 'border-transparent text-gray-400 hover:text-white'}`}
              >
                Score Overview
              </button>
              <button 
                onClick={() => setActiveDashTab('repos')}
                className={`pb-3.5 text-sm font-bold tracking-tight border-b-2 transition-all ${activeDashTab === 'repos' ? 'border-brand-purple text-white' : 'border-transparent text-gray-400 hover:text-white'}`}
              >
                AI Repository Review ({currentReport.repositories.length})
              </button>
              <button 
                onClick={() => setActiveDashTab('insights')}
                className={`pb-3.5 text-sm font-bold tracking-tight border-b-2 transition-all ${activeDashTab === 'insights' ? 'border-brand-purple text-white' : 'border-transparent text-gray-400 hover:text-white'}`}
              >
                AI Career Insights
              </button>
            </div>

            {/* TAB: SCORE OVERVIEW */}
            {activeDashTab === "overview" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Score weights breakdowns list */}
                <div className="lg:col-span-8 bg-gray-900/30 border border-gray-800 p-6 rounded-2xl space-y-6">
                  <h3 className="font-display font-bold text-lg text-white">Score distribution breakdowns</h3>
                  
                  <div className="space-y-4">
                    {/* PC */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-end text-sm font-mono text-gray-300">
                        <span className="flex items-center gap-1.5 font-sans"><CheckCircle className="w-4 h-4 text-brand-green" /> Profile Completeness</span>
                        <span>{currentReport.scorecard.metrics.profileCompleteness}/100</span>
                      </div>
                      <div className="h-2 bg-gray-950 rounded-full overflow-hidden">
                        <div className="bg-brand-green h-full" style={{ width: `${getPercentageFill(currentReport.scorecard.metrics.profileCompleteness, 100)}%` }}></div>
                      </div>
                    </div>

                    {/* Followers */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-end text-sm font-mono text-gray-300">
                        <span className="flex items-center gap-1.5 font-sans"><Users className="w-4 h-4 text-brand-blue" /> Followers Metrics</span>
                        <span>{currentReport.scorecard.metrics.followers}/100</span>
                      </div>
                      <div className="h-2 bg-gray-950 rounded-full overflow-hidden">
                        <div className="bg-brand-blue h-full" style={{ width: `${getPercentageFill(currentReport.scorecard.metrics.followers, 100)}%` }}></div>
                      </div>
                    </div>

                    {/* Repo Quality */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-end text-sm font-mono text-gray-300">
                        <span className="flex items-center gap-1.5 font-sans"><Code className="w-4 h-4 text-brand-purple" /> Repository Quality</span>
                        <span>{currentReport.scorecard.metrics.repositoryQuality}/200</span>
                      </div>
                      <div className="h-2 bg-gray-950 rounded-full overflow-hidden">
                        <div className="bg-brand-purple h-full" style={{ width: `${getPercentageFill(currentReport.scorecard.metrics.repositoryQuality, 200)}%` }}></div>
                      </div>
                    </div>

                    {/* Contribution Activity */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-end text-sm font-mono text-gray-300">
                        <span className="flex items-center gap-1.5 font-sans"><Activity className="w-4 h-4 text-brand-amber" /> Contribution Volume (Last 12m)</span>
                        <span>{currentReport.scorecard.metrics.contributionActivity}/250</span>
                      </div>
                      <div className="h-2 bg-gray-950 rounded-full overflow-hidden">
                        <div className="bg-brand-amber h-full" style={{ width: `${getPercentageFill(currentReport.scorecard.metrics.contributionActivity, 250)}%` }}></div>
                      </div>
                    </div>

                    {/* OS Engagement */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-end text-sm font-mono text-gray-300">
                        <span className="flex items-center gap-1.5 font-sans"><GitPullRequest className="w-4 h-4 text-purple-400" /> Open Source Impact</span>
                        <span>{currentReport.scorecard.metrics.openSourceEngagement}/150</span>
                      </div>
                      <div className="h-2 bg-gray-950 rounded-full overflow-hidden">
                        <div className="bg-purple-500 h-full" style={{ width: `${getPercentageFill(currentReport.scorecard.metrics.openSourceEngagement, 150)}%` }}></div>
                      </div>
                    </div>

                    {/* Code Consistency */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-sm font-mono text-gray-300">
                        <span className="flex items-center gap-1.5 font-sans"><Flame className="w-4 h-4 text-emerald-400" /> Code Consistency</span>
                        <span>{currentReport.scorecard.metrics.codeConsistency}/100</span>
                      </div>
                      <div className="h-2 bg-gray-950 rounded-full overflow-hidden">
                        <div className="bg-emerald-400 h-full" style={{ width: `${getPercentageFill(currentReport.scorecard.metrics.codeConsistency, 100)}%` }}></div>
                      </div>
                    </div>

                    {/* Community Impact */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-sm font-mono text-gray-300">
                        <span className="flex items-center gap-1.5 font-sans"><GitBranch className="w-4 h-4 text-teal-400" /> Community Collaboration</span>
                        <span>{currentReport.scorecard.metrics.communityImpact}/100</span>
                      </div>
                      <div className="h-2 bg-gray-950 rounded-full overflow-hidden">
                        <div className="bg-teal-400 h-full" style={{ width: `${getPercentageFill(currentReport.scorecard.metrics.communityImpact, 100)}%` }}></div>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Heuristic interactive Radar chart visualizer representation */}
                <div className="lg:col-span-4 bg-gray-900/30 border border-gray-800 p-6 rounded-2xl flex flex-col justify-between">
                  <h3 className="font-display font-semibold text-sm text-white mb-2">Metrics Radar Area</h3>
                  
                  {/* Styled Radar chart SVG outline */}
                  <div className="flex-1 flex items-center justify-center p-3">
                    <svg className="w-44 h-44 overflow-visible" viewBox="0 0 100 100">
                      {/* Grid concentric background rings */}
                      <polygon points="50,15 80,35 80,65 50,85 20,65 20,35" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
                      <polygon points="50,28 73,43 73,57 50,72 27,57 27,43" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
                      <polygon points="50,40 65,50 65,58 50,68 35,58 35,50" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
                      
                      {/* Categories reference radial hubs */}
                      <line x1="50" y1="50" x2="50" y2="15" stroke="rgba(255,255,255,0.08)" strokeDasharray="1,1" />
                      <line x1="50" y1="50" x2="80" y2="35" stroke="rgba(255,255,255,0.08)" strokeDasharray="1,1" />
                      <line x1="50" y1="50" x2="80" y2="65" stroke="rgba(255,255,255,0.08)" strokeDasharray="1,1" />
                      <line x1="50" y1="50" x2="50" y2="85" stroke="rgba(255,255,255,0.08)" strokeDasharray="1,1" />
                      <line x1="50" y1="50" x2="20" y2="65" stroke="rgba(255,255,255,0.08)" strokeDasharray="1,1" />
                      <line x1="50" y1="50" x2="20" y2="35" stroke="rgba(255,255,255,0.08)" strokeDasharray="1,1" />

                      {/* Filled Polygon scaled representation */}
                      <polygon 
                        points="50,24 74,38 72,61 50,76 25,60 27,39" 
                        fill="rgba(139, 92, 246, 0.25)" 
                        stroke="rgba(139, 92, 246, 0.8)" 
                        strokeWidth="1.5" 
                      />

                      {/* Labels */}
                      <text x="50" y="9" textAnchor="middle" fontSize="5" fill="#c2c6d5" fontFamily="monospace">CODING</text>
                      <text x="86" y="36" textAnchor="start" fontSize="5" fill="#c2c6d5" fontFamily="monospace">STARS</text>
                      <text x="84" y="68" textAnchor="start" fontSize="5" fill="#c2c6d5" fontFamily="monospace">COMMUNITY</text>
                      <text x="50" y="92" textAnchor="middle" fontSize="5" fill="#c2c6d5" fontFamily="monospace">COMMENTS</text>
                      <text x="16" y="68" textAnchor="end" fontSize="5" fill="#c2c6d5" fontFamily="monospace">DOCS</text>
                      <text x="14" y="36" textAnchor="end" fontSize="5" fill="#c2c6d5" fontFamily="monospace">CONSISTENCY</text>
                    </svg>
                  </div>

                  <p className="text-xs text-[#8A8A8A] font-mono leading-tight text-center pt-2">
                    Visual layout indicates highly balanced full-stack expertise.
                  </p>
                </div>

              </div>
            )}

            {/* TAB: REPOSITORIES LIST */}
            {activeDashTab === "repos" && (
              <div className="space-y-6">
                
                <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                  <h3 className="font-display font-bold text-lg text-white">Repository Quality Auditing</h3>
                  <span className="text-xs font-mono text-gray-400 bg-gray-900 border border-gray-800 px-2.5 py-1 rounded-full">
                    Top {currentReport.repositories.length} public repos evaluated
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {currentReport.repositories.map((repo) => (
                    <div key={repo.name} className="bg-gray-900/30 border border-gray-800 rounded-2xl p-6 relative flex flex-col justify-between overflow-hidden">
                      {/* background gradient line */}
                      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-brand-blue via-brand-purple to-brand-amber"></div>

                      <div className="space-y-4">
                        {/* Title and tags indicators */}
                        <div className="flex items-start justify-between gap-2.5">
                          <div>
                            <h4 className="font-bold text-white text-base font-display flex items-center gap-1.5 break-all">
                              <Folder className="w-4 h-4 text-brand-blue shrink-0" />
                              {repo.name}
                            </h4>
                            <p className="text-xs text-gray-500 font-mono mt-1 break-all justify-start">
                              {repo.language && <span className="text-brand-blue mr-2">● {repo.language}</span>}
                              {repo.stars > 0 && <span className="text-gray-400">★ {repo.stars} stars</span>}
                            </p>
                          </div>

                          <div className="flex flex-col items-end gap-1.5 shrink-0">
                            <span className="inline-flex text-[10px] font-mono font-bold px-2 py-0.5 bg-brand-green/15 text-brand-green border border-brand-green/30 rounded-full uppercase tracking-wider">
                              {repo.status}
                            </span>
                            <span className="text-xs font-mono text-brand-amber font-extrabold bg-brand-amber/5 px-2 py-1 border border-brand-amber/20 rounded">
                              QS: {repo.qualityScore}/100
                            </span>
                          </div>
                        </div>

                        {repo.description && (
                          <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                            {repo.description}
                          </p>
                        )}

                        {/* Checklist items like README, License */}
                        <div className="flex flex-wrap gap-x-4 gap-y-2 pt-1 pb-2 border-b border-gray-800/60 font-mono text-xs">
                          <span className="flex items-center gap-1 text-gray-400">
                            {repo.hasReadme ? (
                              <CheckCircle className="w-3.5 h-3.5 text-brand-green" />
                            ) : (
                              <div className="w-3.5 h-3.5 rounded-full border border-gray-700"></div>
                            )}
                            README Added
                          </span>
                          <span className="flex items-center gap-1 text-gray-400">
                            {repo.hasLicense ? (
                              <CheckCircle className="w-3.5 h-3.5 text-brand-green" />
                            ) : (
                              <div className="w-3.5 h-3.5 rounded-full border border-gray-700"></div>
                            )}
                            Licensed ({repo.license || "No MIT"})
                          </span>
                        </div>

                        {/* AI Quality evaluation metrics (refactors, bugs, tech debt) */}
                        <div className="space-y-2.5">
                          <p className="text-xs font-mono text-brand-purple uppercase tracking-wider font-semibold">AI Repository Review</p>
                          <div className="grid grid-cols-3 gap-2.5">
                            <div className="bg-black/50 border border-gray-850 p-2.5 rounded-lg text-center leading-none">
                              <p className="text-[9px] font-mono text-gray-500 uppercase">Cognitive Complexity</p>
                              <p className="text-xs font-bold font-mono text-white mt-1.5">{repo.cognitiveComplexity}</p>
                            </div>
                            <div className="bg-black/50 border border-gray-850 p-2.5 rounded-lg text-center leading-none">
                              <p className="text-[9px] font-mono text-gray-500 uppercase">Recommended Refactors</p>
                              <p className="text-xs font-bold font-mono text-white mt-1.5">{repo.refactorsCount}</p>
                            </div>
                            <div className="bg-black/50 border border-gray-850 p-2.5 rounded-lg text-center leading-none">
                              <p className="text-[9px] font-mono text-gray-500 uppercase">Est Technical Debt</p>
                              <p className="text-xs font-bold font-mono text-white mt-1.5">~{repo.techDebtHours}h</p>
                            </div>
                          </div>
                        </div>

                        {/* AI strengths/weakness list */}
                        <div className="space-y-2 pt-1 font-sans">
                          {repo.aiFeedback.strengths && repo.aiFeedback.strengths.length > 0 && (
                            <div className="space-y-1">
                              <span className="text-[10px] font-mono text-brand-green uppercase tracking-wide font-black">Strengths:</span>
                              <ul className="text-xs text-gray-400 space-y-0.5 list-disc pl-4 leading-normal">
                                {repo.aiFeedback.strengths.map(s => <li key={s}>{s}</li>)}
                              </ul>
                            </div>
                          )}
                          {repo.aiFeedback.improvements && repo.aiFeedback.improvements.length > 0 && (
                            <div className="space-y-1 pt-1">
                              <span className="text-[10px] font-mono text-brand-amber uppercase tracking-wide font-black">Improvements:</span>
                              <ul className="text-xs text-gray-400 space-y-0.5 list-disc pl-4 leading-normal">
                                {repo.aiFeedback.improvements.map(i => <li key={i}>{i}</li>)}
                              </ul>
                            </div>
                          )}
                        </div>

                      </div>
                    </div>
                  ))}
                </div>

              </div>
            )}

            {/* TAB: AI CAREER INSIGHTS */}
            {activeDashTab === "insights" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Insights and alignment */}
                <div className="lg:col-span-7 bg-gray-900/30 border border-gray-800 p-6 rounded-2xl space-y-6">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-brand-purple" />
                    <h3 className="font-display font-bold text-lg text-white">AI Career Indexing</h3>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1">
                      <span className="text-xs font-mono text-gray-500 uppercase tracking-widest font-black">Current Skill Level</span>
                      <p className="text-xl font-display font-black text-brand-purple">
                        {currentReport.scorecard.careerInsights.skillLevel} Developer
                      </p>
                    </div>

                    <div className="space-y-3.5 pt-2">
                      <span className="text-xs font-mono text-gray-500 uppercase tracking-widest font-black inline-block">Suitable Career Roles</span>
                      <div className="flex flex-wrap gap-2">
                        {currentReport.scorecard.careerInsights.suitableRoles.map(role => (
                          <span key={role} className="px-3.5 py-1.5 bg-brand-blue/10 border border-brand-blue/35 text-brand-blue text-xs font-mono font-bold rounded-lg uppercase tracking-wider flex items-center gap-1.5">
                            <Briefcase className="w-3.5 h-3.5" />
                            {role}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2 pt-4 border-t border-gray-850">
                      <span className="text-xs font-mono text-gray-500 uppercase tracking-widest font-black">Developer Capability Summary</span>
                      <p className="text-sm text-gray-300 leading-relaxed font-sans">
                        {currentReport.scorecard.careerInsights.summary}
                      </p>
                    </div>

                  </div>
                </div>

                {/* AI Improvement checklists list */}
                <div className="lg:col-span-5 bg-gray-900/30 border border-gray-800 p-6 rounded-2xl space-y-5 flex flex-col justify-between">
                  <div>
                    <h3 className="font-display font-bold text-sm text-white flex items-center gap-1.5 mb-2">
                      <Flame className="w-4.5 h-4.5 text-brand-amber" />
                      Improvement Recommendations Checklist
                    </h3>
                    <p className="text-xs text-gray-400 font-mono mb-4">
                      Follow these precise action plans generated by Gemini AI to increase consistency and boost scorecard weights.
                    </p>

                    <div className="space-y-3">
                      {currentReport.scorecard.improvements.map((improvement, index) => (
                        <div key={index} className="flex gap-3 items-start bg-black/30 border border-gray-850 p-3 rounded-xl hover:border-brand-purple/35 transition-colors">
                          <CheckCircle className="w-4 h-4 text-brand-purple shrink-0 mt-0.5" />
                          <p className="text-xs text-gray-300 font-medium leading-relaxed font-sans">
                            {improvement}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <p className="text-[10px] text-gray-500 font-mono leading-tight pt-4 text-center">
                    Heuristic predictions suggest completing recommendations increases dev score by ~150 points.
                  </p>
                </div>

              </div>
            )}

            {/* Print Friendly footer summary, visible only on prints */}
            <div className="hidden print:block text-center text-xs text-gray-500 font-mono pt-12 border-t border-gray-350">
              Generated via GitScore Card Engine. Evaluation indexes derive from real-time dynamic commit matrices.
            </div>

          </div>
        )}

        {/* COMPARISON PAGE */}
        {currentTab === "compare" && (
          <div className="space-y-12">
            
            {/* Header and inputs */}
            <div className="text-center max-w-2xl mx-auto space-y-4">
              <h1 className="text-3xl font-display font-black text-white">Compare Developer Statistics</h1>
              <p className="text-sm text-gray-400">
                Pitted side-by-side: Evaluate code consistency, followers impact, commit volumes, and determine who takes home the developer crown!
              </p>
            </div>

            {/* Inputs block */}
            <div className="max-w-3xl mx-auto bg-gray-900/30 border border-gray-800 p-6 sm:p-8 rounded-2xl space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-gray-500 uppercase tracking-wider font-bold">User 1 Username</label>
                  <input 
                    type="text" 
                    value={user1}
                    onChange={(e) => setUser1(e.target.value)}
                    placeholder="e.g. BikramManna"
                    className="w-full bg-black/50 border border-gray-700 rounded-xl py-3 px-4 text-sm text-white placeholder-gray-600 font-mono focus:outline-none focus:border-brand-purple"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-gray-500 uppercase tracking-wider font-bold">User 2 Username</label>
                  <input 
                    type="text" 
                    value={user2}
                    onChange={(e) => setUser2(e.target.value)}
                    placeholder="e.g. RahulDev"
                    className="w-full bg-black/50 border border-gray-700 rounded-xl py-3 px-4 text-sm text-white placeholder-gray-600 font-mono focus:outline-none focus:border-brand-purple"
                  />
                </div>
              </div>

              {compareError && (
                <div className="p-3 bg-red-950/40 border border-red-900/60 rounded-xl text-center text-xs text-red-300 font-semibold font-mono">
                  {compareError}
                </div>
              )}

              <button 
                onClick={handleCompare}
                disabled={isComparing}
                className="w-full bg-gradient-to-r from-brand-purple to-brand-blue py-3 px-6 text-white font-bold rounded-xl text-sm hover:opacity-95 transition-opacity duration-150 flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
              >
                {isComparing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Calculating dual scorecards...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    Compare Scores
                  </>
                )}
              </button>
            </div>

            {/* Results rendering layout */}
            {comparisonResult && (
              <div className="space-y-8 animate-fade-in">
                
                {/* Winner display card banner banner */}
                <div className="bg-gradient-to-r from-brand-purple/20 via-brand-blue/10 to-brand-purple/20 border border-brand-purple/35 rounded-2xl p-6 text-center shadow-lg max-w-xl mx-auto">
                  <span className="text-xs font-mono text-brand-green uppercase tracking-widest font-black mb-1.5 block">Duel Complete</span>
                  <h2 className="text-2xl font-display font-black text-white">
                    🏆 {comparisonResult.user1.scorecard.overallScore >= comparisonResult.user2.scorecard.overallScore 
                      ? comparisonResult.user1.profile.name || comparisonResult.user1.profile.username
                      : comparisonResult.user2.profile.name || comparisonResult.user2.profile.username} Wins!
                  </h2>
                  <p className="text-xs text-gray-400 mt-1 font-mono">
                    Evaluation reflects overall scorecard superiority inside distributed coding categories.
                  </p>
                </div>

                {/* Stat cards columns split */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
                  {/* profile 1 column summary */}
                  <div className="bg-gray-900/20 border border-gray-800 rounded-2xl p-6 space-y-6">
                    <div className="flex items-center gap-4 border-b border-gray-800/80 pb-4">
                      <img src={comparisonResult.user1.profile.avatarUrl} alt={comparisonResult.user1.profile.username} className="w-12 h-12 rounded-full border border-gray-700 bg-gray-900 object-cover" />
                      <div>
                        <h3 className="font-display font-bold text-lg text-white leading-tight">
                          {comparisonResult.user1.profile.name || comparisonResult.user1.profile.username}
                        </h3>
                        <p className="font-mono text-xs text-brand-blue">@{comparisonResult.user1.profile.username}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-black/40 border border-gray-850 p-4 rounded-xl text-center">
                        <p className="text-[10px] font-mono text-gray-500 uppercase">Dev Score</p>
                        <p className="text-3xl font-display font-black text-white mt-1">
                          {comparisonResult.user1.scorecard.overallScore}
                        </p>
                      </div>

                      <div className="bg-black/40 border border-gray-850 p-4 rounded-xl text-center">
                        <p className="text-[10px] font-mono text-gray-500 uppercase">Grade</p>
                        <p className={`text-3xl font-mono font-black mt-1 ${getGradeMeta(comparisonResult.user1.scorecard.grade).text}`}>
                          {comparisonResult.user1.scorecard.grade}
                        </p>
                      </div>
                    </div>

                    {/* breakdown metrics summary */}
                    <div className="space-y-3 pt-2">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-gray-400">Profile completeness</span>
                        <span className="text-white font-bold">{comparisonResult.user1.scorecard.metrics.profileCompleteness}/100</span>
                      </div>
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-gray-400">Total repos</span>
                        <span className="text-white font-bold">{comparisonResult.user1.profile.publicRepos}</span>
                      </div>
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-gray-400">Followers metrics</span>
                        <span className="text-white font-bold">{comparisonResult.user1.profile.followers}</span>
                      </div>
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-gray-400">Repo quality</span>
                        <span className="text-white font-bold">{comparisonResult.user1.scorecard.metrics.repositoryQuality}/200</span>
                      </div>
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-gray-400">Contribution index</span>
                        <span className="text-white font-bold">{comparisonResult.user1.scorecard.metrics.contributionActivity}/250</span>
                      </div>
                    </div>
                  </div>

                  {/* profile 2 column summary */}
                  <div className="bg-gray-900/20 border border-gray-800 rounded-2xl p-6 space-y-6">
                    <div className="flex items-center gap-4 border-b border-gray-800/80 pb-4">
                      <img src={comparisonResult.user2.profile.avatarUrl} alt={comparisonResult.user2.profile.username} className="w-12 h-12 rounded-full border border-gray-700 bg-gray-900 object-cover" />
                      <div>
                        <h3 className="font-display font-bold text-lg text-white leading-tight">
                          {comparisonResult.user2.profile.name || comparisonResult.user2.profile.username}
                        </h3>
                        <p className="font-mono text-xs text-brand-blue">@{comparisonResult.user2.profile.username}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-black/40 border border-gray-850 p-4 rounded-xl text-center">
                        <p className="text-[10px] font-mono text-gray-500 uppercase">Dev Score</p>
                        <p className="text-3xl font-display font-black text-white mt-1">
                          {comparisonResult.user2.scorecard.overallScore}
                        </p>
                      </div>

                      <div className="bg-black/40 border border-gray-850 p-4 rounded-xl text-center">
                        <p className="text-[10px] font-mono text-gray-500 uppercase">Grade</p>
                        <p className={`text-3xl font-mono font-black mt-1 ${getGradeMeta(comparisonResult.user2.scorecard.grade).text}`}>
                          {comparisonResult.user2.scorecard.grade}
                        </p>
                      </div>
                    </div>

                    {/* breakdown metrics summary */}
                    <div className="space-y-3 pt-2">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-gray-400">Profile completeness</span>
                        <span className="text-white font-bold">{comparisonResult.user2.scorecard.metrics.profileCompleteness}/100</span>
                      </div>
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-gray-400">Total repos</span>
                        <span className="text-white font-bold">{comparisonResult.user2.profile.publicRepos}</span>
                      </div>
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-gray-400">Followers metrics</span>
                        <span className="text-white font-bold">{comparisonResult.user2.profile.followers}</span>
                      </div>
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-gray-400">Repo quality</span>
                        <span className="text-white font-bold">{comparisonResult.user2.scorecard.metrics.repositoryQuality}/200</span>
                      </div>
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-gray-400">Contribution index</span>
                        <span className="text-white font-bold">{comparisonResult.user2.scorecard.metrics.contributionActivity}/250</span>
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            )}

          </div>
        )}

        {/* GLOBAL LEADERBOARDS TAB */}
        {currentTab === "leaderboard" && (
          <div className="space-y-8">
            
            <div className="text-center max-w-2xl mx-auto space-y-4">
              <h1 className="text-3xl font-display font-black text-white">Global Developer Rankings</h1>
              <p className="text-sm text-gray-400">
                Placement preparations & open-source leaders rankings categorized by total commits scores. Check where your profile stacks!
              </p>
            </div>

            {/* Filter and Search Box block */}
            <div className="bg-gray-900/30 border border-gray-800 p-5 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between">
              
              <div className="flex gap-2 bg-black/45 p-1 rounded-xl border border-gray-800/80 w-full md:w-auto overflow-x-auto scroll-hide">
                <button
                  onClick={() => setLeaderboardFilter('all')}
                  className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${leaderboardFilter === 'all' ? 'bg-brand-purple text-white' : 'text-gray-400 hover:text-white'}`}
                >
                  Global Ranking
                </button>
                <button
                  onClick={() => setLeaderboardFilter('college')}
                  className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${leaderboardFilter === 'college' ? 'bg-brand-purple text-white' : 'text-gray-400 hover:text-white'}`}
                >
                  College Ranking
                </button>
                <button
                  onClick={() => setLeaderboardFilter('country')}
                  className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${leaderboardFilter === 'country' ? 'bg-brand-purple text-white' : 'text-gray-400 hover:text-white'}`}
                >
                  Country Filters
                </button>
              </div>

              <div className="relative w-full md:w-80">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                <input 
                  type="text"
                  value={leaderboardSearch}
                  onChange={(e) => setLeaderboardSearch(e.target.value)}
                  placeholder="Search ranking entries..."
                  className="w-full bg-black/50 border border-gray-700/80 rounded-xl py-2 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-brand-purple placeholder-gray-500 font-mono"
                />
              </div>

            </div>

            {/* Main leaderboard rankings list rendering */}
            {isLoadingLeaderboard ? (
              <div className="text-center py-12">
                <RefreshCw className="w-8 h-8 text-brand-purple animate-spin mx-auto mb-4" />
                <p className="text-sm font-mono text-gray-500">Querying leaderboard lists...</p>
              </div>
            ) : (
              <div className="bg-gray-900/10 border border-gray-800 rounded-2xl overflow-hidden divide-y divide-gray-800/60 max-w-5xl mx-auto">
                
                {/* Header row metadata */}
                <div className="hidden sm:flex items-center justify-between p-4 px-6 bg-white/[0.02] text-xs font-mono uppercase tracking-wider text-gray-500">
                  <div className="flex items-center gap-4">
                    <span className="w-5 text-center">Rank</span>
                    <span>Developer Username</span>
                  </div>
                  <div className="flex items-center gap-10">
                    {leaderboardFilter === 'college' && <span className="w-48 text-left">Academic College / Affiliation</span>}
                    {leaderboardFilter === 'country' && <span className="w-24 text-left">Country</span>}
                    <span className="w-20 text-center">Percentile</span>
                    <span className="w-16 text-center">Score</span>
                    <span className="w-16 text-center">Action</span>
                  </div>
                </div>

                {/* Rows items */}
                {leaderboardList
                  .filter(item => {
                    // Search term filter
                    const matchSearch = item.name.toLowerCase().includes(leaderboardSearch.toLowerCase()) || 
                                        item.username.toLowerCase().includes(leaderboardSearch.toLowerCase());
                    if (!matchSearch) return false;

                    // Tab filter
                    if (leaderboardFilter === 'college') return !!item.college && item.college !== "Independent Developer";
                    if (leaderboardFilter === 'country') return !!item.country;

                    return true;
                  })
                  .map((item, index) => (
                    <div key={item.username} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 px-6 gap-4 sm:gap-1.5 hover:bg-white/[0.01] transition-all">
                      
                      {/* Left: Rank, Avatar and details */}
                      <div className="flex items-center gap-4">
                        <span className={`font-mono text-sm font-black w-5 text-center ${index === 0 ? "text-brand-amber text-lg" : index === 1 ? "text-slate-300" : index === 2 ? "text-amber-700" : "text-gray-500"}`}>
                          #{index + 1}
                        </span>
                        <img src={item.avatarUrl} alt={item.name} className="w-10 h-10 rounded-full border border-gray-700 bg-gray-900 object-cover" />
                        <div>
                          <p className="font-bold text-white leading-tight text-sm flex items-center gap-1.5">{item.name}</p>
                          <p className="font-mono text-xs text-brand-blue">@{item.username}</p>
                        </div>
                      </div>

                      {/* Right metadata indexes */}
                      <div className="flex flex-wrap sm:flex-nowrap items-center justify-between sm:justify-end gap-6 sm:gap-10 w-full sm:w-auto font-mono text-xs">
                        
                        {leaderboardFilter === 'college' && (
                          <div className="w-full sm:w-48 text-brand-blue font-semibold truncate text-left mt-1.5 sm:mt-0">
                            {item.college}
                          </div>
                        )}

                        {leaderboardFilter === 'country' && (
                          <div className="w-full sm:w-24 text-gray-400 truncate text-left mt-1.5 sm:mt-0">
                            {item.country}
                          </div>
                        )}

                        <div className="text-left sm:text-center w-20 leading-none">
                          <p className="sm:hidden text-[9px] text-gray-500 uppercase font-bold text-left mb-1">Percentile</p>
                          <span className="text-xs font-mono font-semibold text-brand-green">{item.percentile}</span>
                        </div>

                        <div className="text-left sm:text-center w-16 leading-none">
                          <p className="sm:hidden text-[9px] text-gray-500 uppercase font-bold text-left mb-1">Score</p>
                          <span className={`inline-block text-[10px] font-black border px-2 py-0.5 rounded ${getGradeMeta(item.grade).bg} ${getGradeMeta(item.grade).text} ${getGradeMeta(item.grade).border} mb-1`}>
                            {item.grade}
                          </span>
                          <p className="text-sm font-black text-white">{item.overallScore}</p>
                        </div>

                        <button
                          onClick={() => triggerUserFromLeaderboard(item.username)}
                          className="px-3 py-1.5 bg-gray-800 text-gray-300 font-semibold rounded-lg hover:bg-brand-purple hover:text-white transition-all text-xs flex items-center gap-1"
                        >
                          Heuristics
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>

                    </div>
                  ))
                }

                {leaderboardList.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-400 text-sm font-mono">No matching developers registered inside database leaderboard.</p>
                  </div>
                )}

              </div>
            )}

          </div>
        )}

        {/* ALGORITHM EXPLANATION PAGE */}
        {currentTab === "about" && (
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <h1 className="text-3xl font-display font-black text-white">Ranking Points Mechanics</h1>
              <p className="text-gray-400 text-sm">
                Understand how our standard evaluation scores (0-1000) are measured. 
                Algorithms apply strict heuristics compiled directly over public repository contributions and profile architectures.
              </p>
            </div>

            <div className="bg-gray-900/20 border border-gray-800 p-6 sm:p-8 rounded-2xl space-y-6">
              
              <div className="space-y-4">
                <div className="flex gap-4 items-start border-b border-gray-850 pb-4">
                  <div className="w-8 h-8 rounded bg-brand-green/10 flex items-center justify-center font-mono text-brand-green font-bold text-sm shrink-0">1</div>
                  <div>
                    <h4 className="font-bold text-white text-base">Profile Completeness Docs (100 Pts max)</h4>
                    <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                      Indexes presence of user metadata. Standard checklists verify biography presence, public websites linked, geographic locations stated, avatars registered, and Markdown styled personal Readme summaries compiled.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start border-b border-gray-850 pb-4">
                  <div className="w-8 h-8 rounded bg-brand-blue/10 flex items-center justify-center font-mono text-brand-blue font-bold text-sm shrink-0">2</div>
                  <div>
                    <h4 className="font-bold text-white text-base">Social Followers Metrics (100 Pts max)</h4>
                    <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                      Graded based on following ratios. Excellent indices require greater followers ratios, demonstrating authority in various coding circles.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start border-b border-gray-850 pb-4">
                  <div className="w-8 h-8 rounded bg-brand-purple/10 flex items-center justify-center font-mono text-brand-purple font-bold text-sm shrink-0">3</div>
                  <div>
                    <h4 className="font-bold text-white text-base">Repository Quality Checks (200 Pts max)</h4>
                    <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                      Gemini reviews public repositories. Evaluates repository tagging, descriptions defined, stars, watchers, issue ratios list, and MIT licenses setup, ensuring code is corporate-ready.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start border-b border-gray-850 pb-4">
                  <div className="w-8 h-8 rounded bg-brand-amber/10 flex items-center justify-center font-mono text-brand-amber font-bold text-sm shrink-0">4</div>
                  <div>
                    <h4 className="font-bold text-white text-base">Contribution Volume (250 Pts max)</h4>
                    <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                      Grades volume and frequency of commits over the last 12 months. Highlights active contribution periods.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start border-b border-gray-850 pb-4">
                  <div className="w-8 h-8 rounded bg-purple-500/10 flex items-center justify-center font-mono text-purple-400 font-bold text-sm shrink-0">5</div>
                  <div>
                    <h4 className="font-bold text-white text-base">Open Source OS Engagement (150 Pts max)</h4>
                    <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                      Measures merged pull requests, watchers counts, fork directories, and direct issue responses inside public projects.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start border-b border-gray-850 pb-4">
                  <div className="w-8 h-8 rounded bg-emerald-500/10 flex items-center justify-center font-mono text-emerald-400 font-bold text-sm shrink-0">6</div>
                  <div>
                    <h4 className="font-bold text-white text-base">Code Consistency Streak (100 Pts max)</h4>
                    <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                      Analyzes commit frequencies and streak lengths. Sustained contribution schedules earn higher points.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start pb-2">
                  <div className="w-8 h-8 rounded bg-teal-500/10 flex items-center justify-center font-mono text-teal-400 font-bold text-sm shrink-0">7</div>
                  <div>
                    <h4 className="font-bold text-white text-base">Community Collaboration Impact (100 Pts max)</h4>
                    <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                      Grades authority based on repository stars and following/followers ratios.
                    </p>
                  </div>
                </div>

              </div>

            </div>
          </div>
        )}

      </main>

      {/* Styled Footer */}
      <footer className="border-t border-gray-800 bg-[#0B1020]/25 py-8 mt-24 text-center text-xs text-gray-500 font-mono print:hidden">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} GitHub Scorecard Generator. Built with Gemini AI. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">GitHub API docs</a>
            <span>•</span>
            <a onClick={() => setCurrentTab("about")} className="hover:text-white transition-colors cursor-pointer">Score calculation rules</a>
            <span>•</span>
            <a href="https://ai.studio/build" className="hover:text-white transition-colors">Google AI Studio</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
