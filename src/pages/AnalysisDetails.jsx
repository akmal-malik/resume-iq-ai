import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import { motion } from "framer-motion";

export default function AnalysisDetails() {

  const { id } = useParams();

  const [analysis, setAnalysis] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    fetch(
      `http://127.0.0.1:8000/analysis/${id}`
    )

      .then(res => res.json())

      .then(data => {

        setAnalysis(data);

        setLoading(false);
      })

      .catch(error => {

        console.error(error);

        setLoading(false);
      });

  }, [id]);

  if (loading) {

    return (

      <div className="
        min-h-screen
        flex
        items-center
        justify-center
        bg-gradient-to-br
        from-slate-900
        via-slate-800
        to-indigo-900
        text-white
        text-2xl
        font-bold
      ">

        Loading Analysis...

      </div>
    );
  }

  // SAFE ARRAY HANDLING

  const matchedKeywords =
    analysis?.addedSkills || [];

  const missingKeywords =
    analysis?.missingSkills || [];

  const aiSuggestions =
    analysis?.aiSuggestions || [];

  // PROJECT PARSING

  let projects = [];

  try {

    projects =

      typeof analysis.projects === "string"

        ? JSON.parse(analysis.projects)

        : [];

  } catch {

    projects = [];
  }

  return (

    <div className="
      min-h-screen
      bg-gradient-to-br
      from-slate-900
      via-slate-800
      to-indigo-900
      p-6
    ">

      <div className="
        max-w-6xl
        mx-auto
      ">

        {/* HERO */}

        <motion.div

          initial={{ opacity: 0, y: 20 }}

          animate={{ opacity: 1, y: 0 }}

          className="
            bg-white/10
            backdrop-blur-lg
            rounded-3xl
            border
            border-white/10
            p-8
            shadow-2xl
            mb-8
          "
        >

          <h1 className="
            text-5xl
            font-extrabold
            text-white
            mb-3
          ">

            Resume Analysis

          </h1>

          <p className="
            text-slate-300
            text-lg
          ">

            {analysis.filename}

          </p>

          <div className="
            mt-8
            flex
            items-center
            gap-6
          ">

            <div className="
              w-32
              h-32
              rounded-full
              bg-gradient-to-r
              from-emerald-400
              to-indigo-500
              flex
              items-center
              justify-center
              text-4xl
              font-bold
              text-white
              shadow-xl
            ">

              {analysis.score}%

            </div>

            <div>

              <h2 className="
                text-3xl
                font-bold
                text-white
              ">

                ATS Compatibility

              </h2>

              <p className="
                text-slate-300
                mt-2
              ">

                Resume optimized against
                the provided job description.

              </p>

            </div>

          </div>

        </motion.div>

        {/* GRID */}

        <div className="
          grid
          grid-cols-1
          lg:grid-cols-2
          gap-6
        ">

          {/* MATCHED SKILLS */}

          <motion.div

            initial={{ opacity: 0, y: 20 }}

            animate={{ opacity: 1, y: 0 }}

            className="
              bg-white/10
              backdrop-blur-lg
              rounded-3xl
              p-6
              border
              border-white/10
            "
          >

            <h2 className="
              text-2xl
              font-bold
              text-white
              mb-5
            ">

              ✅ Matched Skills

            </h2>

            <div className="
              flex
              flex-wrap
              gap-3
            ">

              {matchedKeywords.map(

                (skill, idx) => (

                  <span

                    key={idx}

                    className="
                      px-4
                      py-2
                      rounded-full
                      bg-emerald-500/20
                      text-emerald-300
                      border
                      border-emerald-400/20
                    "
                  >

                    {skill.trim()}

                  </span>
                )
              )}

            </div>

          </motion.div>

          {/* MISSING SKILLS */}

          <motion.div

            initial={{ opacity: 0, y: 20 }}

            animate={{ opacity: 1, y: 0 }}

            className="
              bg-white/10
              backdrop-blur-lg
              rounded-3xl
              p-6
              border
              border-white/10
            "
          >

            <h2 className="
              text-2xl
              font-bold
              text-white
              mb-5
            ">

              ❌ Missing Skills

            </h2>

            <div className="
              flex
              flex-wrap
              gap-3
            ">

              {missingKeywords.map(

                (skill, idx) => (

                  <span

                    key={idx}

                    className="
                      px-4
                      py-2
                      rounded-full
                      bg-rose-500/20
                      text-rose-300
                      border
                      border-rose-400/20
                    "
                  >

                    {skill.trim()}

                  </span>
                )
              )}

            </div>

          </motion.div>

        </div>

        {/* AI SUGGESTIONS */}

        <motion.div

          initial={{ opacity: 0, y: 20 }}

          animate={{ opacity: 1, y: 0 }}

          className="
            mt-6
            bg-white/10
            backdrop-blur-lg
            rounded-3xl
            p-6
            border
            border-white/10
          "
        >

          <h2 className="
            text-2xl
            font-bold
            text-white
            mb-4
          ">

            ✨ AI Suggestions

          </h2>

          <div className="
            text-slate-300
            leading-relaxed
          ">

            {aiSuggestions.length === 0 ? (

              <p>
                No suggestions available.
              </p>

            ) : (

              aiSuggestions.map(

                (item, idx) => (

                  <p
                    key={idx}
                    className="mb-2"
                  >

                    • {item}

                  </p>
                )
              )
            )}

          </div>

        </motion.div>

        {/* JOB DESCRIPTION */}

        <motion.div

          initial={{ opacity: 0, y: 20 }}

          animate={{ opacity: 1, y: 0 }}

          className="
            mt-6
            bg-white/10
            backdrop-blur-lg
            rounded-3xl
            p-6
            border
            border-white/10
          "
        >

          <h2 className="
            text-2xl
            font-bold
            text-white
            mb-4
          ">

            📄 Job Description

          </h2>

          <div className="
            max-h-[300px]
            overflow-y-auto
            text-slate-300
            whitespace-pre-wrap
            leading-relaxed
          ">

            {analysis.jobDescription}

          </div>

        </motion.div>

        {/* PROJECTS */}

        <motion.div

          initial={{ opacity: 0, y: 20 }}

          animate={{ opacity: 1, y: 0 }}

          className="
            mt-6
            bg-white/10
            backdrop-blur-lg
            rounded-3xl
            p-6
            border
            border-white/10
          "
        >

          <h2 className="
            text-2xl
            font-bold
            text-white
            mb-6
          ">

            🚀 Extracted Projects

          </h2>

          {projects.length === 0 ? (

            <p className="text-slate-400">

              No projects extracted.

            </p>

          ) : (

            <div className="
              grid
              grid-cols-1
              md:grid-cols-2
              gap-5
            ">

              {projects.map(

                (project, idx) => (

                  <div

                    key={idx}

                    className="
                      bg-white/5
                      border
                      border-white/10
                      rounded-2xl
                      p-5
                    "
                  >

                    <h3 className="
                      text-xl
                      font-bold
                      text-white
                      mb-3
                    ">

                      {project.name}

                    </h3>

                    <div className="
                      flex
                      flex-wrap
                      gap-2
                    ">

                      {project.tech?.map(

                        (tech, techIdx) => (

                          <span

                            key={techIdx}

                            className="
                              px-3
                              py-1
                              rounded-full
                              bg-indigo-500/20
                              text-indigo-300
                              text-sm
                            "
                          >

                            {tech}

                          </span>
                        )
                      )}

                    </div>

                  </div>
                )
              )}

            </div>
          )}

        </motion.div>

      </div>

    </div>
  );
}