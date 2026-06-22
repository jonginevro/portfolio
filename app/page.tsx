import { Github, Linkedin } from "lucide-react"


const experience = [
  {
    company: "Amazon Robotics",
    role: "Software Development Engineer I",
    period: "2025 – Present",
    description:
      "Designing and building intelligent dashboards and operational tooling that surface real-time robotics metrics to teams across Amazon's fulfillment network. Applying ML to automate the collection, analysis, and presentation of operational data, turning raw robotics telemetry into actionable insights for planning and decision-making.",
  },
  {
    company: "Amazon Robotics",
    role: "Software Development Engineer Co-op",
    period: "2023 – 2024",
    description:
      "Built and maintained AWS-based data pipelines that ingested, processed, and delivered high-volume robotics telemetry and operational metrics in real time. Developed backend services and APIs surfacing robotics insights to applications used across the fulfillment network for monitoring and decision-making.",
  },
  {
    company: "Royal Bank of Canada",
    role: "Software Developer Intern",
    period: "Summer 2022",
    description:
      "Contributed as a full-stack developer across consumer-facing digital banking platforms. Built a client verification system now live in the RBC mobile app, enabling returning customers to be automatically reconnected to their existing accounts.",
  },
]

const courses = [
  "Algorithm Design, Analysis & Complexity",
  "Artificial Intelligence",
  "Machine Learning",
  "Natural Language Computing",
  "Theory of Computation",
]

const clubs = [
  "Infrastructure Director, UTMIST",
  "Infrastructure Developer, UTMIST",
  "Partnership Associate, UofT AI",
  "Senior Ambassador, ASIP",
  "Orientation Leader, CSSU & USMC",
]

const skills = [
  "Python", "Java", "TypeScript", "JavaScript", "C / C++", "SQL",
  "React", "Next.js", "Node.js", "Spring Boot", "REST APIs", "GraphQL",
  "AWS", "Lambda", "DynamoDB", "S3", "Docker", "Terraform",
  "PyTorch", "Pandas", "NumPy", "scikit-learn",
  "PostgreSQL", "Redis", "Git", "Linux",
]

export default function Home() {
  return (
    <div className="bg-[#111111] text-white">

      {/* ── Desktop ── */}
      <div className="h-screen overflow-hidden hidden md:flex">

        {/* Left — identity */}
        <aside className="w-[320px] shrink-0 h-full border-r border-white/[0.07] p-10 flex flex-col justify-between">
          <div className="space-y-5">
            <span className="text-[11px] tracking-[0.18em] uppercase text-red-500 font-medium">
              Software Developer
            </span>
            <h1 className="text-5xl font-bold tracking-tight leading-[1.08]">
              Jonathan<br />Ginevro
            </h1>
            <p className="text-neutral-400 text-sm leading-relaxed pt-1">
              SDE at Amazon, CS graduate from the University of Toronto.
            </p>
          </div>
          <div className="space-y-5">
            <div className="flex flex-col gap-3">
              <a
                href="https://github.com/jonginevro"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-neutral-500 hover:text-white transition-colors text-sm w-fit"
              >
                <Github size={15} />
                GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/jonathan-ginevro/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-neutral-500 hover:text-white transition-colors text-sm w-fit"
              >
                <Linkedin size={15} />
                LinkedIn
              </a>
            </div>
            <p className="text-neutral-700 text-xs tracking-wide">Toronto, ON</p>
          </div>

        </aside>

        {/* Right — scrollable content */}
        <section className="flex-1 h-full overflow-y-auto">
          <div className="p-10 space-y-16">

            {/* Experience */}
            <div>
              <p className="text-[11px] tracking-[0.18em] uppercase text-neutral-600 mb-10">Experience</p>
              <div className="space-y-10">
                {experience.map((job, i) => (
                  <div key={i}>
                    <div className="flex items-baseline justify-between gap-6 mb-3">
                      <div>
                        <h2 className="font-semibold text-white">{job.company}</h2>
                        <p className="text-neutral-400 text-xs mt-1">{job.role}</p>
                      </div>
                      <span className="text-xs text-neutral-600 font-mono shrink-0">{job.period}</span>
                    </div>
                    <p className="text-neutral-500 text-sm leading-relaxed">{job.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Education */}
            <div>
              <p className="text-[11px] tracking-[0.18em] uppercase text-neutral-600 mb-8">Education</p>

              <div className="flex items-baseline justify-between mb-8">
                <div>
                  <h2 className="font-semibold text-white mb-1">University of Toronto</h2>
                  <p className="text-neutral-400 text-sm">BSc Computer Science, Focus in AI</p>
                </div>
                <span className="text-xs text-neutral-600 font-mono shrink-0">2020 – 2025</span>
              </div>

              <div className="grid grid-cols-2 gap-x-12">
                <div>
                  <p className="text-[10px] tracking-[0.16em] uppercase text-neutral-700 mb-4">Courses</p>
                  <ul className="space-y-2">
                    {courses.map((c) => (
                      <li key={c} className="flex gap-3 text-sm text-neutral-500">
                        <span className="text-neutral-700 shrink-0">—</span>
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="text-[10px] tracking-[0.16em] uppercase text-neutral-700 mb-4">Activities</p>
                  <ul className="space-y-2">
                    {clubs.map((c) => (
                      <li key={c} className="flex gap-3 text-sm text-neutral-500">
                        <span className="text-neutral-700 shrink-0">—</span>
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Technologies */}
            <div className="pb-10">
              <p className="text-[11px] tracking-[0.18em] uppercase text-neutral-600 mb-7">Technologies</p>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-2.5 py-1.5 text-xs rounded border border-white/[0.08] text-neutral-500 cursor-default select-none transition-all duration-150 hover:text-white hover:border-red-500/40 hover:bg-red-500/[0.07]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

          </div>
        </section>
      </div>

      {/* ── Mobile ── */}
      <div className="md:hidden min-h-screen p-8 flex flex-col gap-14">
        <div className="space-y-4 pt-4">
          <span className="text-[11px] tracking-[0.18em] uppercase text-red-500 font-medium">
            Software Developer
          </span>
          <h1 className="text-4xl font-bold tracking-tight leading-[1.08]">
            Jonathan<br />Ginevro
          </h1>
          <p className="text-neutral-400 text-sm leading-relaxed">
              SDE at Amazon, CS graduate from the University of Toronto.
          </p>
          <div className="pt-2 flex flex-col gap-3">
            <a href="https://github.com/jonginevro" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2.5 text-neutral-500 hover:text-white transition-colors text-sm w-fit">
              <Github size={15} /> GitHub
            </a>
            <a href="https://www.linkedin.com/in/jonathan-ginevro/" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2.5 text-neutral-500 hover:text-white transition-colors text-sm w-fit">
              <Linkedin size={15} /> LinkedIn
            </a>
          </div>
          <p className="text-neutral-700 text-xs">Toronto, ON</p>
        </div>

        <div>
          <p className="text-[11px] tracking-[0.18em] uppercase text-neutral-600 mb-8">Experience</p>
          <div className="space-y-10">
            {experience.map((job, i) => (
              <div key={i}>
                <div className="flex items-baseline justify-between gap-4 mb-1">
                  <h2 className="font-semibold text-white">{job.company}</h2>
                  <span className="text-xs text-neutral-600 font-mono shrink-0">{job.period}</span>
                </div>
                <p className="text-neutral-400 text-xs mb-3">{job.role}</p>
                <p className="text-neutral-500 text-sm leading-relaxed">{job.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-[11px] tracking-[0.18em] uppercase text-neutral-600 mb-8">Education</p>
          <div className="flex items-baseline justify-between mb-6">
            <div>
              <h2 className="font-semibold text-white mb-1">University of Toronto</h2>
              <p className="text-neutral-400 text-sm">BSc Computer Science, Focus in AI</p>
            </div>
            <span className="text-xs text-neutral-600 font-mono shrink-0">2020 – 2025</span>
          </div>
          <div className="space-y-6">
            <div>
              <p className="text-[10px] tracking-[0.16em] uppercase text-neutral-700 mb-3">Courses</p>
              <ul className="space-y-2">
                {courses.map((c) => (
                  <li key={c} className="flex gap-3 text-sm text-neutral-500">
                    <span className="text-neutral-700 shrink-0">—</span>{c}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[10px] tracking-[0.16em] uppercase text-neutral-700 mb-3">Activities</p>
              <ul className="space-y-2">
                {clubs.map((c) => (
                  <li key={c} className="flex gap-3 text-sm text-neutral-500">
                    <span className="text-neutral-700 shrink-0">—</span>{c}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="pb-8">
          <p className="text-[11px] tracking-[0.18em] uppercase text-neutral-600 mb-6">Technologies</p>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span key={skill} className="px-2.5 py-1.5 text-xs rounded border border-white/[0.08] text-neutral-500">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}
