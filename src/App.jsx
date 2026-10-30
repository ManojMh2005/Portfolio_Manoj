import React, { useEffect, useRef, useState } from "react";
import {
  Github, Linkedin, Mail, Phone, MapPin, ArrowUpRight, Download,
  Smartphone, Server, Sparkles, Rocket, ShieldCheck, Database, GraduationCap,
  FileSpreadsheet, Terminal, Gauge, TrendingUp, Workflow, BookOpen,
  Users, Layers, RefreshCw, LayoutDashboard,
} from "lucide-react";
import { submitContactMessage, sendContactEmail, sendAutoReply, logResumeDownload } from "./firebase.js";

const useReveal = () => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
};

const Reveal = ({ children, delay = 0, className = "" }) => {
  const [ref, visible] = useReveal();
  return (
    <div ref={ref} className={`reveal ${visible ? "reveal-in" : ""} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
};

function NetworkBackground() {
  return (
    <div className="bg-network" aria-hidden="true">
      <svg viewBox="0 0 800 600" fill="none">
        <g stroke="#3aa8ff" strokeOpacity="0.5">
          <line x1="50" y1="80" x2="300" y2="200" />
          <line x1="300" y1="200" x2="550" y2="100" />
          <line x1="300" y1="200" x2="250" y2="420" />
          <line x1="250" y1="420" x2="500" y2="480" />
          <line x1="550" y1="100" x2="720" y2="260" />
          <line x1="720" y1="260" x2="500" y2="480" />
        </g>
        <g fill="#3aa8ff">
          <circle cx="50" cy="80" r="4" />
          <circle cx="300" cy="200" r="5" />
          <circle cx="550" cy="100" r="4" />
          <circle cx="250" cy="420" r="4" />
          <circle cx="500" cy="480" r="5" />
          <circle cx="720" cy="260" r="4" />
        </g>
      </svg>
    </div>
  );
}

const skillGroups = [
  { title: "SQL", icon: Database, items: ["MySQL", "Joins", "CTEs", "Window Functions"] },
  { title: "Power BI", icon: Gauge, items: ["DAX", "Power Query", "Drill-through Dashboards"] },
  { title: "Advanced Excel", icon: FileSpreadsheet, items: ["Pivot Tables", "XLOOKUP", "INDEX-MATCH", "Power Query"] },
  { title: "Python", icon: Terminal, items: ["Pandas", "NumPy", "Matplotlib", "EDA"] },
  { title: "Analysis Methods", icon: TrendingUp, items: ["KPI Reporting", "RFM Segmentation", "Pareto Analysis"] },
  { title: "Data Engineering Basics", icon: Workflow, items: ["ETL", "REST APIs", "Git / GitHub","CI/CD Automation"] },
  { title: "AI & Cloud", icon: Sparkles, items: ["Generative AI", "Google AI Studio", "Gemini API", "AWS EC2"] },
  // { title: "Engineering Background", icon: Smartphone, items: ["Kotlin", "Jetpack Compose", "Java", "Node.js", "Firebase"] },
  { title: "Currently Learning", icon: BookOpen, items: ["Snowflake", "Statistics","PySpark", "Machine Learning"] },
];

const services = [
  { icon: Gauge, title: "Dashboards & BI Reporting", desc: "Interactive Power BI dashboards with KPI cards, trends and drill-through, built on your sales, finance or operations data." },
  { icon: Database, title: "SQL & Excel Data Analysis", desc: "Data cleaning and analysis in SQL (joins, CTEs, window functions), plus Pivot Tables, XLOOKUP and Power Query reports in Excel." },
  { icon: TrendingUp, title: "Business Analysis & KPIs", desc: "Revenue, AOV, growth and repeat-purchase tracking, RFM customer segmentation and Pareto analysis, with clear recommendations." },
  { icon: Workflow, title: "Data Pipelines & ETL", desc: "Python and SQL pipelines that load raw files or API data into a database, with layered tables, quality checks and scheduled refresh." },
];
const projectLinks = {
  ecommerce: "https://github.com/ManojMh2005/Blinkit_Dashboard.git",
  upi: "https://github.com/ManojMh2005/UPI-Pipelines.git",
  
};

const RepoLink = ({ href }) =>
  href ? (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 20 }}>
      <a href={href} target="_blank" rel="noreferrer" className="btn btn-ghost">
        <Github size={15} /> View on GitHub <ArrowUpRight size={14} />
      </a>
    </div>
  ) : null;
export default function App() {
  const [navSolid, setNavSolid] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState({ state: "idle", note: "" });

  useEffect(() => {
    const onScroll = () => setNavSolid(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleResumeClick = async () => {
    try { await logResumeDownload(); } catch (e) { /* tracking is best-effort, never block the download */ }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ state: "sending", note: "" });
    try {
      await submitContactMessage(form);
      setStatus({ state: "ok", note: "Message sent — I reply within a day." });
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      console.error("Contact form error:", err);
      setStatus({ state: "err", note: "Couldn't send right now — email mhmanojmanu92@gmail.com directly instead." });
      return;
    }
    // Email notifications are best-effort — the message is already saved above,
    // so a failure here should never undo the "sent" confirmation the visitor sees.
    try {
      await sendContactEmail(form);
    } catch (err) {
      console.warn("Notification email not sent (message was still saved):", err);
    }
    try {
      await sendAutoReply(form);
    } catch (err) {
      console.warn("Auto-reply not sent (message was still saved):", err);
    }
  };

  return (
    <div>
      <div className="bg-glow" />
      <NetworkBackground />

      <nav className={navSolid ? "solid" : ""}>
        <div className="logo"><span className="logo-mark">M</span>Manoj Manjappa Halammanavar</div>
        <div className="nav-links">
          <a href="#about">About</a>
          <a href="#skills">Skills</a>
          <a href="#projects">Projects</a>
          <a href="#internship">Internship</a>
          <a href="#services">Services</a>
          <a href="#contact" className="nav-cta">Contact</a>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="pill"><span className="dot" />Available for freelance projects &amp; full-time roles</div>

        <div className="hero-heading-row">
          <h1>I turn raw data into <span className="accent">dashboards &amp; decisions.</span></h1>
          <div className="hero-photo-wrap">
            <img src="/profile.jpg" alt="Manoj Manjappa Halammanavar" className="hero-photo" />
          </div>
        </div>

        <p className="hero-sub">
          I'm Manoj — a Data Analyst with an engineering background in Python and SQL.
        </p>
        <div className="hero-ctas">
          <a href="#projects" className="btn btn-primary">View my work <ArrowUpRight size={16} /></a>
          <a href="#contact" className="btn btn-dark">Hire me</a>
          <a href="/Manoj_DA1 1.pdf" download onClick={handleResumeClick} className="btn btn-ghost">Resume <Download size={15} /></a>
        </div>
        <div className="stats-row"></div>
      </section>

      {/* ABOUT */}
      <section id="about">
        <Reveal><div className="eyebrow">About</div></Reveal>
        <div className="about-grid">
          <Reveal className="about-text">
            <h2 className="section-title">Engineering Scalable Solutions. Delivering Measurable Impact.</h2>
            <p style={{ marginTop: 20 }}>
              Data Analyst with a Computer Science degree (B.E., CGPA 8.4, 2026). Skilled in SQL, Python (Pandas, NumPy),
              Power BI and Advanced Excel for data cleaning, exploratory analysis, KPI reporting and dashboards. Built end-to-end analytics
              projects on real Indian datasets. Strong engineering foundation with growing focus on ETL, data modeling and Snowflake.
            </p>
            <p><p>
  I'm building data pipelines in Python and SQL that move raw data into layered tables (RAW, STAGING, MART), add data-quality checks and refresh on a schedule with GitHub Actions, so Power BI dashboards always run on clean data. Available for freelance collaborations and full-time opportunities.
</p>.</p>
          </Reveal>
          <Reveal delay={100}>
            <div className="education-card">
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <GraduationCap size={18} color="var(--accent)" />
                <span className="eyebrow" style={{ margin: 0 }}>Education</span>
              </div>
              <h3>B.E - Computer Science</h3>
              <div className="sub">Jawaharlal Nehru New College of Engineering</div>
              <div className="edu-row"><span className="l">2022 – 2026</span><span className="r">CGPA 8.4 / 10</span></div>
              <div className="edu-row"><span className="l">Base</span><span className="r">Bengaluru, Karnataka</span></div>
              <div className="edu-row"><span className="l">Focus</span><span className="r">Data Analyst with GenAI</span></div>
              <div className="edu-row"><span className="l">Status</span><span className="r">Open to full-time Roles &amp; Freelance work</span></div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* SKILLS */}
      <section id="skills">
        <Reveal><div className="eyebrow">Skills</div></Reveal>
        <Reveal><h2 className="section-title">The Tech-Stack I ship with</h2></Reveal>
        <Reveal><p className="section-lead">&nbsp;</p></Reveal>
        <div className="skills-grid">
          {skillGroups.map((g, i) => (
            <Reveal key={g.title} delay={i * 90}>
              <div className="skill-card">
                <div className="skill-card-head">
                  <div className="skill-icon"><g.icon /></div>
                  <h3>{g.title}</h3>
                </div>
                <div>{g.items.map((it) => <span className="chip" key={it}>{it}</span>)}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects">
        <Reveal><div className="eyebrow">Hands-On Projects</div></Reveal>
        <Reveal><h2 className="section-title">Three builds that show how I work with data end-to-end.</h2></Reveal>

        <Reveal>
          <div className="project-featured">
            <div>
              <div className="project-tag">Data Analytics · In progress</div>
              <h3>E-commerce Sales Performance &amp; Customer Analytics</h3>
              <p className="lede">
                Analysing 100K+ orders across customers, sellers, products, payments and reviews.
              </p>
              <div className="feature-list">
                <div className="feature-row"><Database /><div><div className="t">SQL Analysis</div><div className="d">Multi-table joins, CTEs and window functions.</div></div></div>
                <div className="feature-row"><TrendingUp /><div><div className="t">Core Metrics</div><div className="d">Revenue, AOV, growth and repeat-purchase rate.</div></div></div>
                <div className="feature-row"><Gauge /><div><div className="t">Power BI Dashboard</div><div className="d">Multi-page, with KPI cards, YoY/MoM trends and drill-through.</div></div></div>
                <div className="feature-row"><Users /><div><div className="t">Customer Insights</div><div className="d">RFM segmentation, Pareto analysis, delivery-vs-review impact and business recommendations.</div></div></div>
              </div>
              <div>{["MySQL", "Advanced Excel", "Power BI", "DAX", "Statistics"].map((t) => <span className="chip" key={t}>{t}</span>)}</div>
            </div>
            <div className="project-visual">
              <Gauge size={64} color="var(--accent)" strokeWidth={1.2} />
            </div>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div className="project-featured">
            <div className="project-visual" style={{ order: 2 }}>
              <Layers size={64} color="var(--accent)" strokeWidth={1.2} />
            </div>
            <div style={{ order: 1 }}>
              <div className="project-tag">Data Engineering · In progress</div>
              <h3>UPI Digital Payments Analytics Pipeline</h3>
              <p className="lede">An ETL pipeline that takes NPCI monthly UPI transaction data from raw files to a Power BI dashboard.</p>
              <div className="feature-list">
                <div className="feature-row"><Database /><div><div className="t">ETL into Snowflake</div><div className="d">Python pipeline loading NPCI monthly UPI data into RAW, STAGING and MART (star schema) layers.</div></div></div>
                <div className="feature-row"><ShieldCheck /><div><div className="t">SQL Transformations &amp; Quality Checks</div><div className="d">CTEs, window functions and data-quality checks.</div></div></div>
                <div className="feature-row"><RefreshCw /><div><div className="t">Scheduled Refresh</div><div className="d">Automated runs with GitHub Actions.</div></div></div>
                <div className="feature-row"><Gauge /><div><div className="t">Power BI Dashboard</div><div className="d">Volume, value and growth trends.</div></div></div>
              </div>
              <div>{["Python", "Pandas", "Requests", "Snowflake", "SQL", "GitHub Actions", "Power BI"].map((t) => <span className="chip" key={t}>{t}</span>)}</div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={200}>
          <div className="project-featured">
            <div className="project-visual">
              <Sparkles size={64} color="var(--accent)" strokeWidth={1.2} />
            </div>
            <div>
              <div className="project-tag">Analytics + GenAI · In progress</div>
              <h3>AI-Narrated Sales Dashboard</h3>
              <p className="lede">An interactive sales dashboard that explains its own numbers in plain English.</p>
              <div className="feature-list">
                <div className="feature-row"><LayoutDashboard /><div><div className="t">Interactive Dashboard</div><div className="d">KPIs, trends and segment drill-downs.</div></div></div>
                <div className="feature-row"><Sparkles /><div><div className="t">AI Insights Panel</div><div className="d">Gemini API writes plain-English insights from the filtered data.</div></div></div>
                <div className="feature-row"><ShieldCheck /><div><div className="t">Number Verification</div><div className="d">Every figure in the AI summary is checked against computed values before display.</div></div></div>
              </div>
              <div>{["Python", "SQL", "Streamlit", "Gemini API", "Power BI", "Advanced Excel"].map((t) => <span className="chip" key={t}>{t}</span>)}</div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* INTERNSHIP */}
      <section id="internship">
        <Reveal><div className="eyebrow">Internship Experience</div></Reveal>
        <Reveal><h2 className="section-title">Hands-on experience in data science and GenAI.</h2></Reveal>
        <Reveal><p className="section-lead">Applying Python and Generative AI tools to data science tasks.</p></Reveal>

        <Reveal delay={150}>
          <div className="other-work-grid">
            <div className="other-work-card">
              <span className="tag">Internship — Palle Technologies (AUG 2026 – In Progress)</span>
              <h3>Data Science Intern (Gen AI)</h3>
              {/* TODO: replace this line with what you actually worked on and built */}
              <p>Data science and Generative AI work using Python and Google AI Studio.</p>
              <div>{["Python", "Generative AI", "Google AI Studio"].map((t) => <span className="chip" key={t}>{t}</span>)}</div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* SERVICES */}
      <section id="services">
        <Reveal><div className="eyebrow">Services</div></Reveal>
        <Reveal><h2 className="section-title">What I take on for freelance clients.</h2></Reveal>
        <Reveal><p className="section-lead">&nbsp;</p></Reveal>
        <div className="services-grid">
          {services.map((s, i) => (
            <Reveal key={s.title} delay={i * 90}>
              <div className="service-card">
                <div className="service-icon"><s.icon /></div>
                <div><h3>{s.title}</h3><p>{s.desc}</p></div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact">
        <div className="contact-grid">
          <Reveal>
            <div className="eyebrow">Contact</div>
            <h2 className="section-title">Have a project in mind? Let's build it.</h2>
            <p className="section-lead">I reply within a day. Share your idea, timeline, and rough scope — I'll come back with an honest read on how to ship it.</p>
            <div className="contact-links">
              <a className="contact-link" href="mailto:mhmanojmanu92@gmail.com"><Mail />mhmanojmanu92@gmail.com</a>
              <a className="contact-link" href="tel:+918431858148"><Phone />+91 84318 58148</a>
              <a className="contact-link" href="https://github.com/ManojMh2005" target="_blank" rel="noreferrer"><Github />github.com/ManojMh2005</a>
              <a className="contact-link" href="https://linkedin.com/in/manoj-m-h-4600aa310" target="_blank" rel="noreferrer"><Linkedin />linkedin.com/in/manoj-m-h-4600aa310</a>
              <a className="contact-link" href="#"><MapPin />Bengaluru, Karnataka</a>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <form onSubmit={handleSubmit}>
              <div className="field">
                <label>Your name</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Jane Founder" required />
              </div>
              <div className="field">
                <label>Email</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@company.com" required />
              </div>
              <div className="field">
                <label>Project brief</label>
                <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="What are you building, and where do you need help?" required />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }} disabled={status.state === "sending"}>
                {status.state === "sending" ? "Sending..." : <>Send message <ArrowUpRight size={15} /></>}
              </button>
              {status.note && <div className={`form-status ${status.state === "ok" ? "ok" : "err"}`}>{status.note}</div>}
            </form>
          </Reveal>
        </div>
      </section>

      <footer>
        <span className="mono">© 2026 Manoj M H · The Engineer, from idea to Business Insights.</span>
        <div className="footer-socials">
          <a href="https://github.com/ManojMh2005" target="_blank" rel="noreferrer"><Github size={18} /></a>
          <a href="https://linkedin.com/in/manoj-m-h-4600aa310" target="_blank" rel="noreferrer"><Linkedin size={18} /></a>
          <a href="mailto:mhmanojmanu92@gmail.com"><Mail size={18} /></a>
        </div>
      </footer>
    </div>
  );
}