import React, { useEffect, useRef, useState } from "react";
import {
  Github, Linkedin, Mail, Phone, MapPin, ArrowUpRight, Download,
  Smartphone, Server, Sparkles, Rocket, ShieldCheck, Bell, Navigation,
  Lock, ShoppingCart, Database, Send, GraduationCap,
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

const skillGroups = [ { title: "Mobile", icon: Smartphone, items: ["Android", "Kotlin", "Jetpack Compose", "Firebase", "FCM"] }, 
//{title: "Programming", icon: Languages, items: ["Java","Python","C","Kotlin"]}, 
{ title: "Backend", icon: Server, items: ["Java", "Node.js", "Express", "REST APIs", "MySQL", "JWT Auth"] },
 { title: "AI & Cloud", icon: Sparkles, items: ["Generative AI", "Google AI Studio", "Firebase Studio", "AWS EC2"] }, 
 { title: "Tooling", icon: Rocket, items: ["Git / GitHub", "Firestore", "Google Maps API", "JIRA"] }, ];
  const services = [
    { icon: Smartphone, title: "Android App Development", desc: "Native Kotlin apps with Jetpack Compose and Firebase — from MVP to Play Store." },
    { icon: Server, title: "Backend & API Development", desc: "Node.js and Java REST APIs, MySQL schema design, auth, and clean integration contracts." },
    { icon: Sparkles, title: "AI-Integrated Features", desc: "Ship chatbots, smart assistants, and GenAI workflows inside your existing product." },
    { icon: Rocket, title: "MVP Development for Startups", desc: "Idea to working prototype — mobile + backend + AI, delivered end-to-end." },
  ];

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
    <h1>I build Android apps and <span className="accent">backends that ship.</span></h1>
    <div className="hero-photo-wrap">
      <img src="/profile.jpg" alt="Manoj Manjappa Halammanavar" className="hero-photo" />
    </div>
  </div>

  <p className="hero-sub">
    I'm Manoj — a Computer Science engineer turning ideas into working mobile and web products.
  </p>
  <div className="hero-ctas">
    <a href="#work" className="btn btn-primary">View my work <ArrowUpRight size={16} /></a>
    <a href="#contact" className="btn btn-dark">Hire me</a>
    <a href="/resume.pdf" download onClick={handleResumeClick} className="btn btn-ghost">Resume <Download size={15} /></a>
  </div>
  <div className="stats-row">

  </div>
</section>

      {/* ABOUT */}
      <section id="about">
        <Reveal><div className="eyebrow">About</div></Reveal>
        <div className="about-grid">
          <Reveal className="about-text">
            <h2 className="section-title">Engineering Scalable Solutions. Delivering Measurable Impact.</h2>
            <p style={{ marginTop: 20 }}>
               I'm Software Engineer focused on Java Backend Development, Android, and Generative AI, 
               with hands-on experience delivering scalable,secure, and user-centric applications. 
              Committed to transforming complex ideas into reliable digital products that create real business impact.
            </p>
            <p>Turning innovative ideas into reliable, production-ready software with precision and quality. Available for freelance collaborations and full-time opportunities.</p>
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
              <div className="edu-row"><span className="l">Base</span><span className="r">Shivamogga, Karnataka</span></div>
              <div className="edu-row"><span className="l">Focus</span><span className="r">Android · Backend · GenAI</span></div>
              <div className="edu-row"><span className="l">Status</span><span className="r">Open to full-time Roles &amp; Freelance work </span></div>
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

      {/* WORK */}
      <section id="work">
        <Reveal><div className="eyebrow">Hands_On Projects</div></Reveal>
        <Reveal><h2 className="section-title">Two builds that show how I ship end-to-end.</h2></Reveal>
        <Reveal><p className="section-lead">Crafting production-ready mobile and backend applications with modern architecture, scalable APIs, and seamless user experiences.</p></Reveal>

        <Reveal>
          <div className="project-featured">
            <div>
              <div className="project-tag">Android Application </div>
              <h3>Suraksha-Setu</h3>
              <p className="lede">A hyper-local safety network for rural India.</p>
              <p className="lede">Shake-to-trigger SOS Android app that connects users to a 500m Circle of Trust during emergencies.</p>
              <div className="feature-list">
                <div className="feature-row"><Navigation /><div><div className="t">Live GPS Sharing</div><div className="d">Real-time location beamed to your Safe Circle the moment an emergency triggers.</div></div></div>
                <div className="feature-row"><Bell /><div><div className="t">Shake-to-SOS</div><div className="d">Physical shake detection fires the alert instantly — no unlocking, no tapping.</div></div></div>
                <div className="feature-row"><Send /><div><div className="t">FCM + SMS Fallback</div><div className="d">Push notifications reach contacts first; SMS backs it up when data drops.</div></div></div>
                <div className="feature-row"><ShieldCheck /><div><div className="t">Geofencing &amp; Siren</div><div className="d">500m radius geofence with an audible siren to attract nearby help.</div></div></div>
              </div>
              <div>{["Android Studio", "Kotlin", "Jetpack Compose", "Firebase", "FCM", "Cloud Architect",  "Google Maps API"].map((t) => <span className="chip" key={t}>{t}</span>)}</div>
            </div>
            <div className="project-visual">
              <ShieldCheck size={64} color="var(--accent)" strokeWidth={1.2} />
            </div>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div className="project-featured">
            <div className="project-visual" style={{ order: 2 }}>
              <Database size={64} color="var(--accent)" strokeWidth={1.2} />
            </div>
            <div style={{ order: 1 }}>
              <div className="project-tag">Full Stack Application </div>
              <h3>E-Commerce Web System</h3>
              <p className="lede">A production-style online store, owned end-to-end.</p>
              <p className="lede">Production-ready e-commerce backend engineered with secure authentication, scalable architecture, and high-performance RESTful APIs.</p>
              <div className="feature-list">
                <div className="feature-row"><Lock /><div><div className="t">JWT Auth</div><div className="d">Signup, login, and refresh flow with hashed passwords and role claims.</div></div></div>
                <div className="feature-row"><ShieldCheck /><div><div className="t">Role-Based Access</div><div className="d">Middleware keeps customers and admins in separate lanes at the API layer.</div></div></div>
                <div className="feature-row"><ShoppingCart /><div><div className="t">Cart &amp; Checkout</div><div className="d">Server-side cart, prices recomputed at checkout, orders written in a single transaction.</div></div></div>
              </div>
              <div>{["Java","Web-Design","Node.js", "Express", "MySQL", "JWT Auth", "REST APIs", "Postman"].map((t) => <span className="chip" key={t}>{t}</span>)}</div>
            </div>
          </div>
        </Reveal>
        </section>

        {/* INTERNSHIP */}
      <section id="internship">
        <Reveal><div className="eyebrow">Internship Experience</div></Reveal>
        <Reveal><h2 className="section-title">Engineering Excellence Through Professional Internships.</h2></Reveal>
        <Reveal><p className="section-lead">Strengthened expertise in backend development, Android applications, and cloud technologies by delivering practical solutions in a professional engineering environment.</p></Reveal>

        <Reveal delay={150}>
          <div className="other-work-grid">
            <div className="other-work-card">
              <span className="tag">INternship — MindMatrix   (Feb 2026 - June 2026)</span>
              <h3>Android App Developer Intern using Gen-AI</h3>
              <p>Delivered production-ready Android solutions by combining real-time cloud services, scalable API architecture, and Generative AI capabilities. Focused on building secure, maintainable, and high-performance applications that deliver exceptional user experiences.</p>
              <div>{["Kotlin", "Android Studio","Firebase","Jetpack Compose","UI/UX","Google AI Studio"].map((t) => <span className="chip" key={t}>{t}</span>)}</div>
            </div>
            <div className="other-work-card">
              <span className="tag">Internship — The Developers Arena  (Dec 2025 - Jan 2026)</span>
              <h3>Java  Full-Stack Developer Intern</h3>
              <p>Designed and implemented scalable backend architectures with Java, SQL, and RESTful APIs, enabling secure and reliable application functionality. Contributed to performance optimization, cross-functional integration, debugging, and collaborative development using Git-based workflows and modern engineering standards.
</p>
              <div>{["Java","HTML/CSS","JavaScript","Node.Js","Spring Boot","Rest API","MySQL"].map((t) => <span className="chip" key={t}>{t}</span>)}</div>
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
              <a className="contact-link" href="https://linkedin.com/in/manoj-m-h-4600aa310" target="_blank" rel="noreferrer"><Linkedin />linkedin.com/in/manoj-m-h</a>
              <a className="contact-link" href="#"><MapPin />Ranebennur, Karnataka</a>
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
        <span className="mono">© 2026 Manoj M H · The Developer,from idea to deployment.</span>
        <div className="footer-socials">
          <a href="https://github.com/ManojMh2005" target="_blank" rel="noreferrer"><Github size={18} /></a>
          <a href="https://linkedin.com/in/manoj-m-h-4600aa310" target="_blank" rel="noreferrer"><Linkedin size={18} /></a>
          <a href="mailto:mhmanojmanu92@gmail.com"><Mail size={18} /></a>
        </div>
      </footer>
    </div>
  );
}
