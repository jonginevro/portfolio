"use client"

import { Github, Linkedin, Briefcase, GraduationCap, MapPin, Sun, Moon, ArrowUpRight } from "lucide-react"
import { useEffect, useRef, useState, useTransition } from "react"
import { useTheme } from "next-themes"

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

const projects = [
  {
    name: "Fantasy Breakout Board",
    description:
      "A live tool that ranks fantasy football players by breakout potential: combining opportunity, catalyst, efficiency, and value into a single score rather than measuring how good they already are.",
    live: "https://jonginevro.com/breakout-board/",
    source: "https://github.com/jonginevro/breakout-board",
  },
  {
    name: "Homebase",
    description:
      "MLB live scores, standings, and player stats. A fast React app that pulls real-time game data straight from the MLB Stats API.",
    live: "https://jonginevro.com/homebase/",
    source: "https://github.com/jonginevro/homebase-v2",
  },
  {
    name: "NBA Momentum Charts",
    description:
      "World-Cup-style momentum charts for every NBA game of the 2025-26 season, built from play-by-play data with a time-decayed scoring model.",
    live: "https://jonginevro.com/momentum/",
    source: "https://github.com/jonginevro/nba-momentum-charts",
  },
]

const courses = [
  "Algorithm Design & Analysis",
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

const navSections = [
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "education", label: "Education" },
  { id: "technologies", label: "Technologies" },
  { id: "contact", label: "Contact" },
]

export default function Home() {
  const [active, setActive] = useState("experience")
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const [pending, startTransition] = useTransition()
  const [mounted, setMounted] = useState(false)
  const scrollRef = useRef<HTMLElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const isProgrammaticScroll = useRef(false)
  const scrollEndTimer = useRef<ReturnType<typeof setTimeout>>()
  const { theme, setTheme } = useTheme()

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    const adjust = () => {
      const vh = window.innerHeight
      const size = Math.min(Math.max((vh / 900) * 16, 12), 20)
      document.documentElement.style.fontSize = `${size}px`
    }
    adjust()
    window.addEventListener("resize", adjust)
    return () => {
      window.removeEventListener("resize", adjust)
      document.documentElement.style.fontSize = ""
    }
  }, [])

  useEffect(() => {
    const container = scrollRef.current
    if (!container) return

    const handleScroll = () => {
      if (isProgrammaticScroll.current) return
      const containerRect = container.getBoundingClientRect()
      const { scrollTop, scrollHeight, clientHeight } = container
      const offset = parseFloat(getComputedStyle(container).paddingTop) || 40
      const scrollProgress = scrollHeight > clientHeight ? scrollTop / (scrollHeight - clientHeight) : 0
      const triggerOffset = offset + (clientHeight * 0.7 - offset) * scrollProgress
      const triggerY = containerRect.top + triggerOffset
      let current = navSections[0].id
      for (const { id } of navSections) {
        const el = container.querySelector(`#${id}`) as HTMLElement
        if (el && el.getBoundingClientRect().top <= triggerY + 1) {
          current = id
        }
      }
      setActive(current)
    }

    container.addEventListener("scroll", handleScroll, { passive: true })
    return () => container.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (id: string) => {
    const container = scrollRef.current
    const el = container?.querySelector(`#${id}`) as HTMLElement
    if (!container || !el) return
    setActive(id)
    isProgrammaticScroll.current = true
    clearTimeout(scrollEndTimer.current)
    const offset = parseFloat(getComputedStyle(container).paddingTop) || 40
    container.scrollTo({
      top: container.scrollTop + el.getBoundingClientRect().top - container.getBoundingClientRect().top - offset,
      behavior: "smooth",
    })
    scrollEndTimer.current = setTimeout(() => {
      isProgrammaticScroll.current = false
    }, 800)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      try {
        const res = await fetch("https://formspree.io/f/xqaewgkv", {
          method: "POST",
          body: formData,
          headers: { Accept: "application/json" },
        })
        if (res.ok) {
          setStatus("success")
          formRef.current?.reset()
        } else {
          setStatus("error")
        }
      } catch {
        setStatus("error")
      }
    })
  }

  const inputClass =
    "w-full bg-transparent border border-black/[0.08] dark:border-white/[0.08] rounded px-3 py-2.5 text-sm text-neutral-600 dark:text-neutral-400 placeholder:text-neutral-400 dark:placeholder:text-neutral-700 focus:outline-none focus:border-red-500/30 focus:text-neutral-900 dark:focus:text-white transition-colors duration-150"

  return (
    <div className="bg-white dark:bg-[#111111] text-neutral-900 dark:text-white">

      {/* ── Desktop ── */}
      <div className="h-screen overflow-hidden hidden md:flex max-w-[1400px] mx-auto border-x border-black/[0.07] dark:border-white/[0.07]">

        {/* Left — identity */}
        <aside className="w-[320px] shrink-0 h-full border-r border-black/[0.07] dark:border-white/[0.07] p-10 flex flex-col justify-between">
          <div className="space-y-5">
            <span className="text-[11px] tracking-[0.18em] uppercase text-red-500 font-medium">
              Software Developer
            </span>
            <h1 className="text-[2.5rem] font-bold tracking-tight leading-[1.08]">
              Jonathan<br />Ginevro
            </h1>
            <div className="flex flex-col gap-2.5 pt-1">
              <span className="flex items-center gap-2.5 text-neutral-500 dark:text-neutral-400 text-sm">
                <Briefcase size={13} className="text-neutral-400 dark:text-neutral-600 shrink-0" />
                SDE at Amazon
              </span>
              <span className="flex items-center gap-2.5 text-neutral-500 dark:text-neutral-400 text-sm">
                <GraduationCap size={13} className="text-neutral-400 dark:text-neutral-600 shrink-0" />
                UofT CS Graduate
              </span>
              <span className="flex items-center gap-2.5 text-neutral-500 dark:text-neutral-400 text-sm">
                <MapPin size={13} className="text-neutral-400 dark:text-neutral-600 shrink-0" />
                Toronto, ON
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <a
              href="https://github.com/jonginevro"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 text-neutral-400 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors text-sm w-fit"
            >
              <Github size={15} />
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/jonathan-ginevro/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 text-neutral-400 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors text-sm w-fit"
            >
              <Linkedin size={15} />
              LinkedIn
            </a>
          </div>
        </aside>

        {/* Center — scrollable content */}
        <section ref={scrollRef} className="flex-1 h-full overflow-y-auto min-w-0 scrollbar-hide">
          <div className="max-w-[700px] p-10 space-y-16">

            {/* Experience */}
            <div id="experience">
              <p className="text-[11px] tracking-[0.18em] uppercase text-neutral-400 dark:text-neutral-600 mb-10">Experience</p>
              <div className="space-y-10">
                {experience.map((job, i) => (
                  <div key={i}>
                    <div className="flex items-baseline justify-between gap-6 mb-3">
                      <div>
                        <h2 className="font-semibold">{job.company}</h2>
                        <p className="text-neutral-500 dark:text-neutral-400 text-xs mt-1">{job.role}</p>
                      </div>
                      <span className="text-xs text-neutral-400 dark:text-neutral-600 font-mono shrink-0">{job.period}</span>
                    </div>
                    <p className="text-neutral-500 text-sm leading-relaxed">{job.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Projects */}
            <div id="projects">
              <p className="text-[11px] tracking-[0.18em] uppercase text-neutral-400 dark:text-neutral-600 mb-10">Projects</p>
              <div className="space-y-10">
                {projects.map((p) => (
                  <div key={p.name}>
                    <div className="flex items-baseline justify-between gap-6 mb-3">
                      <h2 className="font-semibold">{p.name}</h2>
                      <div className="flex items-center gap-4 shrink-0">
                        <a href={p.live} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-neutral-400 dark:text-neutral-500 hover:text-red-500 dark:hover:text-red-400 transition-colors">
                          <ArrowUpRight size={13} /> Live
                        </a>
                        <a href={p.source} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-neutral-400 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors">
                          <Github size={13} /> Source
                        </a>
                      </div>
                    </div>
                    <p className="text-neutral-500 text-sm leading-relaxed">{p.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Education */}
            <div id="education">
              <p className="text-[11px] tracking-[0.18em] uppercase text-neutral-400 dark:text-neutral-600 mb-8">Education</p>
              <div className="flex items-baseline justify-between mb-8">
                <div>
                  <h2 className="font-semibold mb-1">University of Toronto</h2>
                  <p className="text-neutral-500 dark:text-neutral-400 text-sm">HBSc Computer Science, Focus in AI</p>
                </div>
                <span className="text-xs text-neutral-400 dark:text-neutral-600 font-mono shrink-0">2020 – 2025</span>
              </div>
              <div className="grid grid-cols-2 gap-x-12">
                <div>
                  <p className="text-[10px] tracking-[0.16em] uppercase text-neutral-300 dark:text-neutral-700 mb-4">Courses</p>
                  <ul className="space-y-2">
                    {courses.map((c) => (
                      <li key={c} className="flex gap-3 text-sm text-neutral-500">
                        <span className="text-neutral-300 dark:text-neutral-700 shrink-0">—</span>
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-[10px] tracking-[0.16em] uppercase text-neutral-300 dark:text-neutral-700 mb-4">Activities</p>
                  <ul className="space-y-2">
                    {clubs.map((c) => (
                      <li key={c} className="flex gap-3 text-sm text-neutral-500">
                        <span className="text-neutral-300 dark:text-neutral-700 shrink-0">—</span>
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Technologies */}
            <div id="technologies">
              <p className="text-[11px] tracking-[0.18em] uppercase text-neutral-400 dark:text-neutral-600 mb-7">Technologies</p>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-2.5 py-1.5 text-xs rounded border border-black/[0.08] dark:border-white/[0.08] text-neutral-500 cursor-default select-none transition-all duration-150 hover:text-neutral-900 dark:hover:text-white hover:border-red-500/40 hover:bg-red-500/[0.07]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div id="contact" className="pb-10">
              <p className="text-[11px] tracking-[0.18em] uppercase text-neutral-400 dark:text-neutral-600 mb-8">Contact</p>
              <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] tracking-[0.16em] uppercase text-neutral-300 dark:text-neutral-700 block mb-2">Name</label>
                      <input name="name" type="text" required placeholder="Your name" className={inputClass} />
                    </div>
                    <div>
                      <label className="text-[10px] tracking-[0.16em] uppercase text-neutral-300 dark:text-neutral-700 block mb-2">Email</label>
                      <input name="email" type="email" required placeholder="your@email.com" className={inputClass} />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] tracking-[0.16em] uppercase text-neutral-300 dark:text-neutral-700 block mb-2">Message</label>
                    <textarea name="message" required rows={9} placeholder="What's on your mind?" className={`${inputClass} resize-none`} />
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      type="submit"
                      disabled={pending || status === "success"}
                      className="px-4 py-2 text-xs tracking-[0.12em] uppercase border border-black/[0.08] dark:border-white/[0.08] text-neutral-500 rounded hover:text-neutral-900 dark:hover:text-white hover:border-red-500/40 hover:bg-red-500/[0.07] transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {pending ? "Sending…" : "Send"}
                    </button>
                    {status === "success" && (
                      <p className="text-xs text-neutral-500">Message sent. I&apos;ll get back to you soon.</p>
                    )}
                    {status === "error" && (
                      <p className="text-xs text-red-500/70">Something went wrong. Please try again.</p>
                    )}
                  </div>
                </form>
            </div>

          </div>
        </section>

        {/* Right — scrollspy nav + toggle */}
        <nav className="w-40 shrink-0 h-full flex flex-col pr-10">
          <div className="pt-10 flex justify-end">
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="text-neutral-400 dark:text-neutral-600 hover:text-neutral-900 dark:hover:text-white transition-colors duration-150"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
              </button>
            )}
          </div>
          <div className="flex-1 flex flex-col justify-center gap-5">
            {navSections.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => scrollToSection(id)}
                className="group flex items-center justify-end gap-3"
              >
                <span className={`text-[10px] tracking-[0.16em] uppercase transition-colors duration-200 ${
                  active === id
                    ? "text-neutral-900 dark:text-white"
                    : "text-neutral-300 dark:text-neutral-700 group-hover:text-neutral-500 dark:group-hover:text-neutral-500"
                }`}>
                  {label}
                </span>
                <span className={`h-px transition-all duration-300 ${
                  active === id
                    ? "w-5 bg-red-500"
                    : "w-3 bg-neutral-300 dark:bg-neutral-700 group-hover:bg-neutral-400 dark:group-hover:bg-neutral-500"
                }`} />
              </button>
            ))}
          </div>
        </nav>

      </div>

      {/* ── Mobile ── */}
      <div className="md:hidden min-h-screen p-8 flex flex-col gap-14">
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] tracking-[0.18em] uppercase text-red-500 font-medium">
              Software Developer
            </span>
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="text-neutral-400 dark:text-neutral-600 hover:text-neutral-900 dark:hover:text-white transition-colors duration-150"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
              </button>
            )}
          </div>
          <h1 className="text-4xl font-bold tracking-tight leading-[1.08]">
            Jonathan<br />Ginevro
          </h1>
          <div className="flex flex-col gap-2.5">
            <span className="flex items-center gap-2.5 text-neutral-500 dark:text-neutral-400 text-sm">
              <Briefcase size={13} className="text-neutral-400 dark:text-neutral-600 shrink-0" />
              SDE at Amazon
            </span>
            <span className="flex items-center gap-2.5 text-neutral-500 dark:text-neutral-400 text-sm">
              <GraduationCap size={13} className="text-neutral-400 dark:text-neutral-600 shrink-0" />
              UofT CS Graduate
            </span>
            <span className="flex items-center gap-2.5 text-neutral-500 dark:text-neutral-400 text-sm">
              <MapPin size={13} className="text-neutral-400 dark:text-neutral-600 shrink-0" />
              Toronto, ON
            </span>
          </div>
          <div className="pt-2 flex flex-col gap-3">
            <a href="https://github.com/jonginevro" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2.5 text-neutral-400 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors text-sm w-fit">
              <Github size={15} /> GitHub
            </a>
            <a href="https://www.linkedin.com/in/jonathan-ginevro/" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2.5 text-neutral-400 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors text-sm w-fit">
              <Linkedin size={15} /> LinkedIn
            </a>
          </div>
        </div>

        <div>
          <p className="text-[11px] tracking-[0.18em] uppercase text-neutral-400 dark:text-neutral-600 mb-8">Experience</p>
          <div className="space-y-10">
            {experience.map((job, i) => (
              <div key={i}>
                <div className="flex items-baseline justify-between gap-4 mb-1">
                  <h2 className="font-semibold">{job.company}</h2>
                  <span className="text-xs text-neutral-400 dark:text-neutral-600 font-mono shrink-0">{job.period}</span>
                </div>
                <p className="text-neutral-500 dark:text-neutral-400 text-xs mb-3">{job.role}</p>
                <p className="text-neutral-500 text-sm leading-relaxed">{job.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-[11px] tracking-[0.18em] uppercase text-neutral-400 dark:text-neutral-600 mb-8">Projects</p>
          <div className="space-y-10">
            {projects.map((p) => (
              <div key={p.name}>
                <div className="flex items-center justify-between gap-4 mb-1">
                  <h2 className="font-semibold">{p.name}</h2>
                  <div className="flex items-center gap-4 shrink-0">
                    <a href={p.live} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-neutral-400 dark:text-neutral-500 hover:text-red-500 dark:hover:text-red-400 transition-colors">
                      <ArrowUpRight size={13} /> Live
                    </a>
                    <a href={p.source} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-neutral-400 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors">
                      <Github size={13} /> Source
                    </a>
                  </div>
                </div>
                <p className="text-neutral-500 text-sm leading-relaxed mt-2">{p.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-[11px] tracking-[0.18em] uppercase text-neutral-400 dark:text-neutral-600 mb-8">Education</p>
          <div className="flex items-baseline justify-between mb-6">
            <div>
              <h2 className="font-semibold mb-1">University of Toronto</h2>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm">HBSc Computer Science, Focus in AI</p>
            </div>
            <span className="text-xs text-neutral-400 dark:text-neutral-600 font-mono shrink-0">2020 – 2025</span>
          </div>
          <div className="space-y-6">
            <div>
              <p className="text-[10px] tracking-[0.16em] uppercase text-neutral-300 dark:text-neutral-700 mb-3">Courses</p>
              <ul className="space-y-2">
                {courses.map((c) => (
                  <li key={c} className="flex gap-3 text-sm text-neutral-500">
                    <span className="text-neutral-300 dark:text-neutral-700 shrink-0">—</span>{c}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[10px] tracking-[0.16em] uppercase text-neutral-300 dark:text-neutral-700 mb-3">Activities</p>
              <ul className="space-y-2">
                {clubs.map((c) => (
                  <li key={c} className="flex gap-3 text-sm text-neutral-500">
                    <span className="text-neutral-300 dark:text-neutral-700 shrink-0">—</span>{c}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div>
          <p className="text-[11px] tracking-[0.18em] uppercase text-neutral-400 dark:text-neutral-600 mb-6">Technologies</p>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span key={skill} className="px-2.5 py-1.5 text-xs rounded border border-black/[0.08] dark:border-white/[0.08] text-neutral-500">
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="pb-8">
          <p className="text-[11px] tracking-[0.18em] uppercase text-neutral-400 dark:text-neutral-600 mb-8">Contact</p>
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[10px] tracking-[0.16em] uppercase text-neutral-300 dark:text-neutral-700 block mb-2">Name</label>
              <input name="name" type="text" required placeholder="Your name" className={inputClass} />
            </div>
            <div>
              <label className="text-[10px] tracking-[0.16em] uppercase text-neutral-300 dark:text-neutral-700 block mb-2">Email</label>
              <input name="email" type="email" required placeholder="your@email.com" className={inputClass} />
            </div>
            <div>
              <label className="text-[10px] tracking-[0.16em] uppercase text-neutral-300 dark:text-neutral-700 block mb-2">Message</label>
              <textarea name="message" required rows={9} placeholder="What's on your mind?" className={`${inputClass} resize-none`} />
            </div>
            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={pending || status === "success"}
                className="px-4 py-2 text-xs tracking-[0.12em] uppercase border border-black/[0.08] dark:border-white/[0.08] text-neutral-500 rounded hover:text-neutral-900 dark:hover:text-white hover:border-red-500/40 hover:bg-red-500/[0.07] transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {pending ? "Sending…" : "Send"}
              </button>
              {status === "success" && (
                <p className="text-xs text-neutral-500">Message sent. I&apos;ll get back to you soon.</p>
              )}
              {status === "error" && (
                <p className="text-xs text-red-500/70">Something went wrong. Please try again.</p>
              )}
            </div>
          </form>
        </div>

      </div>

    </div>
  )
}
