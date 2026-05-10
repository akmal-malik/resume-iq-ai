import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { uploadAndAnalyze } from "../services/atsApi";
import ScoreCard from "../components/results/ScoreCard";
import KeywordSection from "../components/results/KeywordSection";
import FeedbackSection from "../components/results/FeedbackSection";

// ---------- Animation Variants ----------
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100, damping: 12 },
  },
};

const cardVariants = {
  hidden: { scale: 0.95, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { type: "spring", stiffness: 120, damping: 10 },
  },
};

const pulseVariants = {
  animate: {
    scale: [1, 1.02, 1],
    opacity: [0.8, 1, 0.8],
    transition: { repeat: Infinity, duration: 2 },
  },
};

// ---------- Component ----------
export default function ATSAnalyzer() {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [dragOver, setDragOver] = useState(false);

  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Fetch history on mount
  useEffect(() => {
    fetch("http://127.0.0.1:8000/analysis-history")
      .then((res) => res.json())
      .then((data) => setHistory(data))
      .catch(console.error);
  }, []);

  // Analyze resume
  const handleAnalyze = async () => {
    if (!file) {
      alert("Please upload a resume.");
      return;
    }
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("job_description", jobDescription);

      const data = await uploadAndAnalyze(formData);
      setResult(data);

      // Refresh history
      const historyRes = await fetch("http://127.0.0.1:8000/analysis-history");
      const historyData = await historyRes.json();
      setHistory(historyData);
    } catch (error) {
      console.error("Analysis failed:", error);
    } finally {
      setLoading(false);
    }
  };

  // Drag & drop handlers
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && (droppedFile.type === "application/pdf" || droppedFile.name.endsWith(".docx"))) {
      setFile(droppedFile);
    } else {
      alert("Please upload a PDF or DOCX file.");
    }
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) setFile(selectedFile);
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 flex items-center justify-center p-4 sm:p-8"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <motion.div
        className="w-full max-w-6xl bg-white/80 backdrop-blur-lg backdrop-saturate-150 rounded-3xl shadow-2xl border border-white/20 p-6 sm:p-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-10">
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            ResumeIQ AI
          </h1>
          <p className="text-lg text-slate-600 mt-2 font-medium">
            AI‑powered ATS Resume Analyzer
          </p>
        </motion.div>

        {/* File Upload – drag & drop + button */}
        <motion.div variants={itemVariants} className="mb-8">
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Upload Resume
          </label>
          <motion.div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 ${
              dragOver
                ? "border-indigo-500 bg-indigo-50/80 scale-[1.02]"
                : file
                ? "border-emerald-500 bg-emerald-50/60"
                : "border-gray-300 bg-gray-50/50 hover:border-gray-400 hover:bg-gray-100/70"
            }`}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
          >
            <input
              type="file"
              accept=".pdf,.docx"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="text-4xl mb-2"
            >
              📄
            </motion.div>
            {file ? (
              <p className="text-lg font-medium text-slate-800">{file.name}</p>
            ) : (
              <>
                <p className="text-lg font-medium text-slate-700">
                  Drag & drop your resume here
                </p>
                <p className="text-sm text-slate-500 mt-1">
                  or click to browse (PDF, DOCX)
                </p>
              </>
            )}
          </motion.div>
        </motion.div>

        {/* Job Description */}
        <motion.div variants={itemVariants} className="mb-8">
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Job Description
          </label>
          <motion.textarea
            placeholder="Paste the job description here..."
            className="w-full h-40 border-2 border-gray-300 bg-white/70 backdrop-blur-sm rounded-2xl p-5 text-slate-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow shadow-sm"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            whileFocus={{ boxShadow: "0 0 0 3px rgba(99, 102, 241, 0.3)" }}
          />
        </motion.div>

        {/* Analyze Button */}
        <motion.div variants={itemVariants} className="flex justify-center sm:justify-start">
          <motion.button
            onClick={handleAnalyze}
            disabled={loading}
            className={`relative inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-lg font-bold text-white shadow-lg transition-colors ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            }`}
            whileHover={!loading ? { scale: 1.03 } : {}}
            whileTap={!loading ? { scale: 0.97 } : {}}
          >
            {loading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
                Analyzing...
              </>
            ) : (
              "Upload & Analyze"
            )}
          </motion.button>
        </motion.div>

        {/* Results Section with AnimatePresence for enter/exit */}
        <AnimatePresence>
          {result && (
            <motion.div
              key="results"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              {/* Score Card */}
              <motion.div variants={cardVariants}>
                <ScoreCard score={result.ats_score} />
              </motion.div>

              {/* Feedback */}
              <motion.div variants={cardVariants}>
                <FeedbackSection feedback={result.feedback} />
              </motion.div>

              {/* Matched Keywords */}
              <motion.div variants={cardVariants}>
                <KeywordSection
                  title="Matched Keywords"
                  keywords={result.matched_keywords}
                  color="bg-emerald-100 text-emerald-800"
                />
              </motion.div>

              {/* Missing Keywords */}
              <motion.div variants={cardVariants}>
                <KeywordSection
                  title="Missing Keywords"
                  keywords={result.missing_keywords}
                  color="bg-rose-100 text-rose-800"
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Analysis History */}
        <motion.div variants={itemVariants} className="mt-16">
          <h2 className="text-3xl font-bold text-slate-800 mb-8">Analysis History</h2>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence>
              {history.length === 0 ? (
                <motion.p
                  variants={itemVariants}
                  className="col-span-full text-center text-slate-500 py-12"
                >
                  No analysis history yet.
                </motion.p>
              ) : (
                history.map((item) => (
                  <motion.div
                    key={item.id}
                    variants={cardVariants}
                    whileHover={{ y: -5, shadow: "0 20px 25px -5px rgba(0,0,0,0.1)" }}
                    onClick={() => navigate(`/analysis/${item.id}`)}
                    className="bg-white/70 backdrop-blur-sm border border-white/40 rounded-2xl p-6 shadow-md cursor-pointer transition-shadow"
                  >
                    <h3 className="font-semibold text-lg text-slate-800 mb-2 truncate">
                      {item.filename}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500">ATS Score</span>
                      <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        {item.ats_score}%
                      </span>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}