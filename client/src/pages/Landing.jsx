import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Target,
  Sparkles,
  Kanban,
  MessageCircleQuestion,
  ArrowRight,
  CheckCircle2,
  FileText,
  Shield,
  Zap,
} from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";

const features = [
  { icon: Target, title: 'ATS Match Scoring', description: 'Upload your resume and a job description — get an instant match score with matched and missing skills.' },
  { icon: Sparkles, title: 'AI Rewrite Suggestions', description: 'Section-by-section feedback powered by Gemini, so you know exactly what to improve.' },
  { icon: Kanban, title: 'Job Application Tracker', description: 'A drag-and-drop pipeline — Applied, Interview, Offer, Rejected — all in one board.' },
  { icon: MessageCircleQuestion, title: 'Interview Prep', description: "AI-generated interview questions tailored to the job description you're targeting." },
  { icon: FileText, title: 'Resume Versioning', description: 'Upload multiple resume versions and compare ATS scores side by side.' },
  { icon: Shield, title: 'Secure by Design', description: 'Google OAuth, encrypted sessions, and role-based access control built in from day one.' },
];

const steps = [
  'Upload your resume as a PDF',
  "Paste the job description you're applying to",
  'Get your ATS score, missing skills, and rewrite suggestions',
  'Track the application through your pipeline',
];

const stats = [
  { value: '100%', label: 'Free to use' },
  { value: '<10s', label: 'Average scan time' },
  { value: '4', label: 'Pipeline stages tracked' },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-[var(--color-surface)]">
      {/* Navbar */}
      <nav className="sticky top-0 z-20 bg-[var(--color-surface-card)]/90 backdrop-blur border-b border-[var(--color-border)]">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <span className="text-lg font-semibold text-primary-500">HireIQ</span>

          <div className="hidden md:flex items-center gap-6 text-sm text-[var(--color-text-secondary)]">
            <a href="#features" className="hover:text-[var(--color-text-primary)] transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-[var(--color-text-primary)] transition-colors">How it works</a>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors px-3 py-2">
              Log in
            </Link>
            <Link to="/login" className="text-sm bg-primary-500 hover:bg-primary-600 text-white font-medium px-4 py-2 rounded-lg transition-colors">
              Sign up free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-16 pb-16 text-center">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <span className="inline-flex items-center gap-1.5 text-xs text-primary-600 bg-primary-50 border border-primary-100 rounded-full px-3 py-1 mb-6">
            <Sparkles className="w-3 h-3" /> Powered by Gemini AI
          </span>

          <h1 className="text-4xl md:text-5xl font-semibold text-[var(--color-text-primary)] leading-tight mb-5">
            Land your next role with a<br />
            <span className="text-primary-500">resume that actually matches</span> the job
          </h1>

          <p className="text-[var(--color-text-secondary)] text-base max-w-xl mx-auto mb-8">
            HireIQ scores your resume against any job description, tells you exactly what's missing,
            and helps you track every application from apply to offer.
          </p>

          <div className="flex items-center justify-center gap-3">
            <Link to="/login" className="inline-flex items-center gap-2 rounded-lg bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium px-6 py-3 transition-colors">
              Get Started Free <ArrowRight className="w-4 h-4" />
            </Link>
            <a href="#how-it-works" className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-border)] text-[var(--color-text-primary)] text-sm font-medium px-6 py-3 hover:bg-[var(--color-surface)] transition-colors">
              See how it works
            </a>
          </div>
        </motion.div>
      </section>

      {/* Stats bar */}
      <section className="max-w-3xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-3 gap-4 rounded-xl bg-[var(--color-surface-card)] border border-[var(--color-border)] py-6">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-2xl font-semibold text-primary-500">{s.value}</p>
              <p className="text-xs text-[var(--color-text-secondary)] mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Feature grid */}
      <section id="features" className="max-w-5xl mx-auto px-6 pb-20 scroll-mt-20">
        <h2 className="text-2xl font-semibold text-[var(--color-text-primary)] text-center mb-10">Everything you need to job hunt smarter</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {features.map(({ icon: Icon, title, description }, i) => (
            <motion.div key={title} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
              className="rounded-xl bg-[var(--color-surface-card)] border border-[var(--color-border)] p-6 hover:border-primary-200 hover:shadow-sm transition-all">
              <div className="w-9 h-9 rounded-lg bg-primary-50 flex items-center justify-center mb-4">
                <Icon className="w-4.5 h-4.5 text-primary-500" />
              </div>
              <h3 className="text-[var(--color-text-primary)] font-medium mb-1.5">{title}</h3>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="max-w-3xl mx-auto px-6 pb-24 scroll-mt-20">
        <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-2xl font-semibold text-[var(--color-text-primary)] text-center mb-10">
          How it works
        </motion.h2>
        <div className="space-y-4">
          {steps.map((step, i) => (
            <motion.div key={step} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              className="flex items-center gap-4 rounded-xl bg-[var(--color-surface-card)] border border-[var(--color-border)] px-5 py-4">
              <div className="w-7 h-7 rounded-full bg-primary-50 text-primary-600 text-sm font-medium flex items-center justify-center shrink-0">{i + 1}</div>
              <p className="text-sm text-[var(--color-text-primary)]">{step}</p>
              <CheckCircle2 className="w-4 h-4 text-[var(--color-border)] ml-auto shrink-0" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Why HireIQ — added content */}
      <section className="max-w-4xl mx-auto px-6 pb-24">
        <div className="rounded-2xl bg-[var(--color-surface-card)] border border-[var(--color-border)] p-8 md:p-10">
          <div className="flex items-start gap-4">
            <Zap className="w-6 h-6 text-primary-500 shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">Why job seekers use HireIQ</h3>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                Most resumes get filtered out before a human ever reads them — Applicant Tracking Systems reject resumes
                that don't closely match a job's required keywords and skills. HireIQ closes that gap: it reads your resume
                the way an ATS does, tells you precisely what's missing, and helps you fix it in minutes instead of guessing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-2xl mx-auto px-6 pb-24 text-center">
        <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="rounded-2xl bg-primary-50 border border-primary-100 p-10">
          <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">Ready to optimize your job search?</h2>
          <p className="text-sm text-[var(--color-text-secondary)] mb-6">Free to start. No credit card required.</p>
          <Link to="/login" className="inline-flex items-center gap-2 rounded-lg bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium px-6 py-3 transition-colors">
            Get Started <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--color-border)] py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[var(--color-text-muted)]">Built with the MERN stack · React, Node.js, MongoDB, Gemini AI</p>
          <div className="flex items-center gap-4">
            <a href="https://github.com/Eman-Nazir" className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors">
  <FaGithub className="w-4 h-4" />
</a>

<a href="https://www.linkedin.com/in/eman-nazir-231145316/" className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors">
  <FaLinkedin className="w-4 h-4" />
</a>
          </div>
        </div>
      </footer>
    </div>
  );
}