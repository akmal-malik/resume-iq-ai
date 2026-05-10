import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  ComposedChart,
  BarChart,
  Bar,
} from "recharts";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [trendData, setTrendData] = useState([]);
  const [keywordAnalytics, setKeywordAnalytics] = useState(null);
  const [aiInsights, setAiInsights] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [scoreFilter, setScoreFilter] = useState("all");
  const [sortOption, setSortOption] = useState("newest");
  const [lastUpdated, setLastUpdated] = useState(null);

  // Modal state
  const [selectedResume, setSelectedResume] = useState(null);
  const [resumeDetails, setResumeDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/dashboard-stats")
      .then((r) => r.json())
      .then((data) => {
        setStats(data);
        setLastUpdated(new Date().toLocaleTimeString());
      })
      .catch(console.error);

    fetch("http://127.0.0.1:8000/score-trends")
      .then((r) => r.json())
      .then((data) => setTrendData(Array.isArray(data) ? data : []))
      .catch(console.error);

    fetch("http://127.0.0.1:8000/keyword-analytics")
      .then((r) => r.json())
      .then((data) => setKeywordAnalytics(data))
      .catch(console.error);

    fetch("http://127.0.0.1:8000/ai-insights")
      .then((r) => r.json())
      .then((data) => setAiInsights(data.insights || []))
      .catch(console.error);
  }, []);

  const fetchResumeDetails = async (resumeId) => {
    try {
      setLoadingDetails(true);
      const response = await fetch(`http://127.0.0.1:8000/analysis/${resumeId}`);
      const data = await response.json();
      setResumeDetails(data);
    } catch (error) {
      console.error("Error fetching resume details:", error);
    } finally {
      setLoadingDetails(false);
    }
  };

  const getProjectInsight = (techStack = []) => {
    const techs = techStack.map((t) => t.toLowerCase());
    if (techs.includes("react") || techs.includes("fastapi") || techs.includes("node") || techs.includes("express")) {
      return { level: "Highly Relevant", color: "emerald", insight: "Strong alignment with modern full stack engineering requirements." };
    }
    if (techs.includes("python") || techs.includes("tableau") || techs.includes("pandas") || techs.includes("sql")) {
      return { level: "Moderately Relevant", color: "amber", insight: "Demonstrates analytical and data-driven problem-solving capabilities." };
    }
    return { level: "Partially Relevant", color: "slate", insight: "Shows practical project-building and development experience." };
  };

  if (!stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto mb-6"></div>
          <p className="text-white text-xl font-medium">Loading Analytics Dashboard...</p>
          <p className="text-slate-200 text-sm mt-2">Fetching latest insights</p>
        </div>
      </div>
    );
  }

  const formatScore = (score) => (typeof score === "number" ? score.toFixed(1) : score);

  const filteredTrendData = [...trendData]
    .filter((item) => {
      const matchesSearch = item.filename.toLowerCase().includes(searchQuery.toLowerCase());
      let matchesScore = true;
      if (scoreFilter === "70+") matchesScore = item.score >= 70;
      else if (scoreFilter === "80+") matchesScore = item.score >= 80;
      else if (scoreFilter === "90+") matchesScore = item.score >= 90;
      return matchesSearch && matchesScore;
    })
    .sort((a, b) => {
      if (sortOption === "highest") return b.score - a.score;
      if (sortOption === "lowest") return a.score - b.score;
      return 0;
    });

  const topResumes = [...filteredTrendData].sort((a, b) => b.score - a.score).slice(0, 2);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800/95 backdrop-blur-md rounded-xl shadow-xl p-4 border border-slate-700">
          <p className="font-semibold text-white mb-1">{label}</p>
          <p className="text-blue-400 text-2xl font-bold">
            {payload[0].value}
            <span className="text-sm font-normal text-slate-200 ml-1">/100</span>
          </p>
          <p className="text-xs text-slate-300 mt-1">ATS Score</p>
        </div>
      );
    }
    return null;
  };

  const formatXAxis = (tick) => (tick.length > 20 ? tick.slice(0, 17) + "..." : tick);

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };
  const staggerContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12 } },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* HEADER */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-500/20 rounded-full px-4 py-1.5 mb-4 backdrop-blur-sm border border-blue-500/30">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                </span>
                <span className="text-blue-200 text-sm font-medium">Live Analytics</span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold text-white tracking-tight">
                Analytics Dashboard
              </h1>
              <p className="text-slate-200 text-lg mt-3 max-w-2xl">
                ResumeIQ AI — Comprehensive insights into your resume performance and ATS compatibility metrics.
              </p>
            </div>
            {lastUpdated && (
              <div className="bg-slate-800/80 backdrop-blur rounded-2xl px-5 py-3 shadow-xl border border-slate-700">
                <p className="text-xs text-slate-200 uppercase tracking-wider">Last Update</p>
                <p className="text-sm font-medium text-white">{lastUpdated}</p>
              </div>
            )}
          </div>
        </div>

        {/* STATS GRID */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-12"
        >
          {[
            {
              label: "Total Analyses",
              value: stats.total_analyses.toLocaleString(),
              icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              ),
              color: "blue",
              badge: "All time",
            },
            {
              label: "Average ATS Score",
              value: formatScore(stats.average_score),
              icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              ),
              color: "emerald",
              badge: "Trending",
            },
            {
              label: "Highest Score",
              value: formatScore(stats.highest_score),
              icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ),
              color: "amber",
              badge: "Top performer",
            },
            {
              label: "Lowest Score",
              value: formatScore(stats.lowest_score),
              icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ),
              color: "rose",
              badge: "Needs review",
            },
          ].map((card, idx) => (
            <motion.div
              key={idx}
              variants={fadeUp}
              whileHover={{ y: -6 }}
              className={`group bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-700/60`}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2.5 rounded-xl bg-${card.color}-500/20 text-${card.color}-400`}>
                    {card.icon}
                  </div>
                  <span className={`text-xs font-medium text-${card.color}-300 bg-${card.color}-500/15 px-2.5 py-1 rounded-full border border-${card.color}-500/30`}>
                    {card.badge}
                  </span>
                </div>
                <p className="text-slate-200 text-sm font-medium mb-1">{card.label}</p>
                <p className="text-4xl lg:text-5xl font-bold text-white tracking-tight">{card.value}</p>
                <div className={`mt-4 h-1 w-12 bg-${card.color}-500/30 rounded-full group-hover:w-20 transition-all duration-300`}></div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* SEARCH + FILTER + SORT */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Search resumes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-800/70 backdrop-blur border border-slate-600 rounded-2xl px-5 py-3 text-white placeholder-slate-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-300 pointer-events-none">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          <select
            value={scoreFilter}
            onChange={(e) => setScoreFilter(e.target.value)}
            className="bg-slate-800/70 backdrop-blur border border-slate-600 rounded-2xl px-5 py-3 text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
          >
            <option value="all">All Scores</option>
            <option value="70+">70+</option>
            <option value="80+">80+</option>
            <option value="90+">90+</option>
          </select>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="bg-slate-800/70 backdrop-blur border border-slate-600 rounded-2xl px-5 py-3 text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
          >
            <option value="newest">Newest</option>
            <option value="highest">Highest Score</option>
            <option value="lowest">Lowest Score</option>
          </select>
        </div>

        {/* SCORE TREND CHART */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="bg-slate-800/70 backdrop-blur-md rounded-3xl shadow-xl border border-slate-700 p-6 lg:p-8 transition-all duration-300 hover:shadow-2xl"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">ATS Score Trends</h2>
              <p className="text-slate-200 mt-1">Historical performance across analyzed resumes</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full shadow-sm"></div>
                <span className="text-sm text-slate-200">ATS Score (0-100)</span>
              </div>
              <div className="h-6 w-px bg-slate-600"></div>
              <div className="text-xs text-slate-200 bg-slate-700/50 px-3 py-1.5 rounded-full border border-slate-600">
                {filteredTrendData.length} analyses tracked
              </div>
            </div>
          </div>

          {filteredTrendData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-slate-800/50 rounded-2xl border border-slate-700">
              <svg className="w-16 h-16 text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <p className="text-slate-200 font-medium">No matching resumes found</p>
              <p className="text-slate-300 text-sm mt-1">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={420}>
              <ComposedChart data={filteredTrendData} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
                <defs>
                  <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                  <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
                    <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#3b82f6" floodOpacity="0.25" />
                  </filter>
                </defs>
                <CartesianGrid strokeDasharray="4 4" stroke="#334155" vertical={false} />
                {/* XAxis - brighter tick labels */}
                <XAxis
                  dataKey="filename"
                  tick={{ fontSize: 11, fill: "#cbd5e1" }}
                  tickLine={false}
                  axisLine={{ stroke: "#475569", strokeWidth: 1 }}
                  tickFormatter={formatXAxis}
                  interval={0}
                  angle={filteredTrendData.length > 6 ? -20 : 0}
                  textAnchor={filteredTrendData.length > 6 ? "end" : "middle"}
                  height={60}
                />
                {/* YAxis - brighter tick labels */}
                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 12, fill: "#cbd5e1" }}
                  tickLine={false}
                  axisLine={false}
                  ticks={[0, 25, 50, 75, 100]}
                  label={{ value: "Score", angle: -90, position: "insideLeft", style: { fill: "#cbd5e1", fontSize: 12 }, dx: -10 }}
                  allowDecimals={false}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#64748b", strokeWidth: 1, strokeDasharray: "4 4" }} />
                <Area type="monotone" dataKey="score" stroke="none" fill="url(#scoreGradient)" />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="url(#lineGradient)"
                  strokeWidth={3}
                  dot={{ fill: "#1e293b", stroke: "#3b82f6", strokeWidth: 2.5, r: 5, activeDot: { r: 7, strokeWidth: 3, fill: "#3b82f6" } }}
                  activeDot={{ r: 8, strokeWidth: 2, stroke: "#93c5fd", fill: "#2563eb" }}
                  filter="url(#shadow)"
                />
              </ComposedChart>
            </ResponsiveContainer>
          )}

          <div className="mt-6 pt-4 border-t border-slate-700 flex flex-wrap justify-between items-center gap-3 text-xs text-slate-200">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-blue-500"></span>
              <span>Each dot represents an individual resume analysis</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Higher scores indicate better ATS compatibility</span>
            </div>
          </div>
        </motion.div>

        {/* TOP PERFORMING RESUMES */}
        <div className="mt-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-white">Top Performing Resumes</h2>
              <p className="text-slate-200 mt-1">Highest ATS scoring resumes (click for detailed analysis)</p>
            </div>
            <div className="bg-amber-500/20 text-amber-300 px-4 py-2 rounded-full text-sm font-semibold border border-amber-500/30">
              Top 2 Rankings
            </div>
          </div>

          {topResumes.length === 0 ? (
            <div className="bg-slate-800/70 backdrop-blur rounded-3xl border border-slate-700 shadow-xl p-12 text-center">
              <p className="text-slate-200 text-lg">No resume data available</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {topResumes.map((resume, index) => {
                const badge =
                  resume.score >= 85 ? "Excellent" : resume.score >= 70 ? "Strong" : "Needs Work";
                const badgeColor =
                  resume.score >= 85
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                    : resume.score >= 70
                    ? "bg-blue-500/20 text-blue-300 border-blue-500/30"
                    : "bg-rose-500/20 text-rose-300 border-rose-500/30";

                return (
                  <div
                    key={index}
                    onClick={() => {
                      setSelectedResume(resume);
                      fetchResumeDetails(resume.id);
                    }}
                    className="bg-slate-800/70 backdrop-blur rounded-3xl border border-slate-700 shadow-xl p-8 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center text-xl font-bold shadow-lg">
                          #{index + 1}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white break-all">{resume.filename}</h3>
                          <p className="text-slate-200 text-sm mt-1">ATS Optimized Resume</p>
                        </div>
                      </div>
                      <div className={`px-4 py-2 rounded-full border text-sm font-semibold ${badgeColor}`}>
                        {badge}
                      </div>
                    </div>
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-200 font-medium">ATS Score</span>
                        <span className="text-2xl font-bold text-white">{resume.score}/100</span>
                      </div>
                      <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                          style={{ width: `${resume.score}%` }}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-900/60 rounded-2xl p-4 border border-slate-600">
                        <p className="text-slate-200 text-sm mb-1">Performance</p>
                        <p className="text-lg font-bold text-white">Top {index + 1}</p>
                      </div>
                      <div className="bg-slate-900/60 rounded-2xl p-4 border border-slate-600">
                        <p className="text-slate-200 text-sm mb-1">Ranking Score</p>
                        <p className="text-lg font-bold text-white">{resume.score}%</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* DETAIL MODAL */}
        {selectedResume && (
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedResume(null)}
          >
            <div
              className="bg-slate-900/95 backdrop-blur-xl rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-700"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-slate-900/95 backdrop-blur border-b border-slate-700 p-6 flex justify-between items-center z-10">
                <div>
                  <h2 className="text-2xl font-bold text-white">Detailed Resume Analysis</h2>
                  <p className="text-slate-200 text-sm">{selectedResume.filename}</p>
                </div>
                <button
                  onClick={() => setSelectedResume(null)}
                  className="p-2 hover:bg-slate-800 rounded-full transition-colors"
                >
                  <svg className="w-6 h-6 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              {loadingDetails ? (
                <div className="p-12 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500 mx-auto mb-4"></div>
                  <p className="text-slate-200">Fetching resume insights...</p>
                </div>
              ) : resumeDetails ? (
                <div className="p-6 space-y-8">
                  <div className="bg-blue-500/10 rounded-2xl p-5 border border-blue-500/30">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-slate-200 font-medium">ATS Score</span>
                      <span className="text-3xl font-bold text-blue-400">{resumeDetails.score}/100</span>
                    </div>
                    <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full" style={{ width: `${resumeDetails.score}%` }} />
                    </div>
                    <p className="text-blue-300 text-sm mt-3 font-medium">
                      {resumeDetails.score >= 85 ? "🏆 Excellent ATS compatibility" : resumeDetails.score >= 70 ? "👍 Good overall, minor improvements needed" : "⚠️ Needs significant improvement"}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                      <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">✓</span>
                      Added / Matched Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {resumeDetails.addedSkills?.map((skill, i) => (
                        <span key={i} className="px-3 py-1.5 bg-emerald-500/10 text-emerald-300 rounded-full text-sm font-medium border border-emerald-500/30">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                      <span className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400">!</span>
                      Missing Skills (to improve ATS)
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {resumeDetails.missingSkills?.map((skill, i) => (
                        <span key={i} className="px-3 py-1.5 bg-rose-500/10 text-rose-300 rounded-full text-sm font-medium border border-rose-500/30">
                          {skill}
                        </span>
                      ))}
                    </div>
                    <p className="text-slate-200 text-sm mt-2">Add these keywords to increase your match rate.</p>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                      <span className="p-1.5 rounded-lg bg-slate-600 text-slate-200">📄</span>
                      Job Description (Analyzed)
                    </h3>
                    <div className="bg-slate-800/80 rounded-xl p-5 border border-slate-600 text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">
                      {resumeDetails.jobDescription}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                      <span className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400">✨</span>
                      AI Improvement Suggestions
                    </h3>
                    <div className="bg-gradient-to-r from-blue-500/10 to-transparent rounded-xl p-5 border border-blue-500/30">
                      <ul className="space-y-2 text-slate-200">
                        {resumeDetails.aiSuggestions?.map((suggestion, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-blue-400 font-bold">→</span>
                            <span>{suggestion}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">🚀</span>
                      Extracted Projects
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                      {(() => {
                        try {
                          const parsedProjects = JSON.parse(resumeDetails?.projects || "[]");
                          if (!Array.isArray(parsedProjects)) return <p className="text-slate-200">No project data found.</p>;
                          return parsedProjects.map((project, idx) => {
                            const ai = getProjectInsight(project?.tech || []);
                            return (
                              <div key={idx} className="bg-slate-800/80 border border-slate-600 rounded-2xl p-5 shadow-sm">
                                <h4 className="text-lg font-bold text-white mb-3">{project?.name || "Untitled Project"}</h4>
                                <div className="flex flex-wrap gap-2 mb-4">
                                  {(project?.tech || []).map((tech, i) => (
                                    <span key={i} className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/30 text-xs font-medium">
                                      {tech}
                                    </span>
                                  ))}
                                </div>
                                <div className="bg-slate-900/70 border border-slate-600 rounded-xl p-4">
                                  <p className="text-sm font-semibold text-slate-200 mb-1">AI Relevance: {ai.level}</p>
                                  <p className="text-sm text-slate-200 leading-relaxed">{ai.insight}</p>
                                </div>
                              </div>
                            );
                          });
                        } catch {
                          return <p className="text-rose-400">Failed to load project data.</p>;
                        }
                      })()}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-12 text-center text-slate-200">Unable to load resume details.</div>
              )}
              <div className="sticky bottom-0 bg-slate-900/95 backdrop-blur border-t border-slate-700 p-4 text-right">
                <button
                  onClick={() => setSelectedResume(null)}
                  className="px-5 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-md"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* KEYWORD ANALYTICS */}
        {keywordAnalytics && (
          <div className="mt-10 grid grid-cols-1 xl:grid-cols-2 gap-8">
            <div className="bg-slate-800/70 backdrop-blur rounded-3xl shadow-xl border border-slate-700 p-6 lg:p-8 transition-all duration-300 hover:shadow-2xl">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-white">Top Matched Skills</h2>
                  <p className="text-slate-200 mt-1">Most recognized ATS keywords</p>
                </div>
                <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={keywordAnalytics.top_matched.map((item) => ({ keyword: item[0], count: item[1] }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="keyword" tick={{ fill: "#cbd5e1", fontSize: 12 }} />
                  <YAxis tick={{ fill: "#cbd5e1", fontSize: 12 }} />
                  <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "none", borderRadius: "10px", color: "#e2e8f0" }} />
                  <Bar dataKey="count" fill="#10b981" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-slate-800/70 backdrop-blur rounded-3xl shadow-xl border border-slate-700 p-6 lg:p-8 transition-all duration-300 hover:shadow-2xl">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-white">Top Missing Skills</h2>
                  <p className="text-slate-200 mt-1">Frequently absent ATS keywords</p>
                </div>
                <div className="p-3 rounded-2xl bg-rose-500/20 text-rose-400">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01" />
                  </svg>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={keywordAnalytics.top_missing.map((item) => ({ keyword: item[0], count: item[1] }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="keyword" tick={{ fill: "#cbd5e1", fontSize: 12 }} />
                  <YAxis tick={{ fill: "#cbd5e1", fontSize: 12 }} />
                  <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "none", borderRadius: "10px", color: "#e2e8f0" }} />
                  <Bar dataKey="count" fill="#f43f5e" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* AI INSIGHTS */}
        {aiInsights.length > 0 && (
          <div className="mt-10">
            <div className="bg-slate-800/70 backdrop-blur rounded-3xl shadow-xl border border-slate-700 p-6 lg:p-8 transition-all duration-300 hover:shadow-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h2 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">AI Insights</h2>
                  </div>
                  <p className="text-slate-200 ml-11">
                    Smart analytics generated from your resume data — actionable recommendations to improve ATS scores.
                  </p>
                </div>
                <div className="bg-blue-500/20 rounded-full px-4 py-2 text-sm text-blue-300 font-medium border border-blue-500/30">
                  {aiInsights.length} key insights
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {aiInsights.map((insight, index) => (
                  <div
                    key={index}
                    className="group relative bg-slate-900/80 rounded-2xl p-5 border border-slate-700 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
                  >
                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 to-purple-600 rounded-l-2xl transition-all duration-300 group-hover:w-1.5"></div>
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 p-2.5 rounded-xl bg-blue-500/20 text-blue-400 group-hover:bg-blue-500/30 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L15 12l-5.25-5" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-slate-200 leading-relaxed font-medium text-base">{insight}</p>
                      </div>
                    </div>
                    <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-20 transition-opacity duration-300">
                      <svg className="w-12 h-12 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="2" fill="currentColor" />
                        <circle cx="18" cy="12" r="2" fill="currentColor" />
                        <circle cx="6" cy="12" r="2" fill="currentColor" />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-4 text-center text-xs text-slate-300 border-t border-slate-700">
                Powered by advanced NLP models — insights refresh with each new analysis
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 text-center">
          <p className="text-xs text-slate-300">ResumeIQ AI • Real-time analytics from your resume</p>
        </div>
      </div>
    </div>
  );
}