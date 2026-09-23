'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Cpu,
  Bot,
  Code2,
  Lightbulb,
  Rocket,
  Shield,
  ArrowRight,
} from 'lucide-react';

interface Slide {
  badge: string;
  title: string;
  description: string;
  metric: string;
  icon: React.ReactNode;
}

const showcaseSlides: Slide[] = [
  {
    badge: 'ROBOTICS & HARDWARE',
    title: 'Hands-On Robotics & IoT Engineering',
    description: 'Empowering students to design, program, and deploy physical autonomous systems.',
    metric: '5 Schools • 1,200+ Active Robots Built',
    icon: <Bot className="w-12 h-12 text-cyan-500" />,
  },
  {
    badge: 'ARTIFICIAL INTELLIGENCE',
    title: 'Machine Learning & Neural Networks',
    description: 'Interactive AI modules teaching computer vision, NLP, and predictive model training.',
    metric: '45+ AI Student Models Trained',
    icon: <Cpu className="w-12 h-12 text-violet-500" />,
  },
  {
    badge: 'PYTHON PROGRAMMING',
    title: 'Full-Stack Coding & Data Science',
    description: 'Real-world Python labs, algorithmic thinking, and automated code grading.',
    metric: '25,000+ Submissions Evaluated',
    icon: <Code2 className="w-12 h-12 text-primary-500" />,
  },
  {
    badge: 'INNOVATION LABS',
    title: 'STEM Innovation & Problem Solving',
    description: 'Encouraging project-based learning and sustainable technological solutions.',
    metric: '98% Student Engagement Rate',
    icon: <Lightbulb className="w-12 h-12 text-warning-500" />,
  },
  {
    badge: 'STUDENT PORTFOLIOS',
    title: 'Showcase Real Engineering Projects',
    description: 'Public and school-wide project galleries featuring student GitHub repos and live demos.',
    metric: '350+ Approved Student Projects',
    icon: <Rocket className="w-12 h-12 text-success-500" />,
  },
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [capsLockOn, setCapsLockOn] = useState(false);

  // Carousel state
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-rotate carousel
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % showcaseSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused]);

  // Detect Caps Lock
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.getModifierState && e.getModifierState('CapsLock')) {
      setCapsLockOn(true);
    } else {
      setCapsLockOn(false);
    }
  };

  const setRoleCookieAndRedirect = (role: string) => {
    document.cookie = `gclms_dev_role=${role}; path=/; max-age=86400; SameSite=Lax`;
    const targetMap: Record<string, string> = {
      FOUNDER: '/founder/dashboard',
      PRINCIPAL: '/principal/dashboard',
      TEACHER: '/teacher/dashboard',
      STUDENT: '/student/dashboard',
    };
    router.push(targetMap[role] || '/student/dashboard');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    // Map input emails to demo roles for development mode
    let targetRole = 'STUDENT';
    const lowerEmail = email.toLowerCase().trim();

    if (lowerEmail.includes('founder')) {
      targetRole = 'FOUNDER';
    } else if (lowerEmail.includes('principal')) {
      targetRole = 'PRINCIPAL';
    } else if (lowerEmail.includes('teacher')) {
      targetRole = 'TEACHER';
    } else if (lowerEmail.includes('student')) {
      targetRole = 'STUDENT';
    }

    setTimeout(() => {
      setIsLoading(false);
      setRoleCookieAndRedirect(targetRole);
    }, 400);
  };

  const handleDemoSelect = (role: string, demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('ChangeMe123!');
    setRoleCookieAndRedirect(role);
  };

  const slide = showcaseSlides[currentSlide];

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-background">
      {/* Left Visual Showcase Panel (Desktop) */}
      <div className="relative hidden md:flex md:w-[55%] bg-gradient-to-br from-[#0F172A] via-[#172554] to-[#1E3A8A] text-white p-12 flex-col justify-between overflow-hidden">
        {/* Subtle mesh background glows */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary-600/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -right-32 w-96 h-96 bg-violet-600/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-cyan-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Top Branding Header */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary-600 flex items-center justify-center text-white font-bold text-xl shadow-lg border border-primary-500/30">
              G
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl tracking-tight text-white">GCLMS</span>
              <span className="text-[11px] text-primary-200 uppercase tracking-wider font-semibold">Global Cloud Learning System</span>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-white/10 text-primary-200 border border-white/10 text-xs font-medium backdrop-blur-md">
            Enterprise Portal
          </span>
        </div>

        {/* Center Showcase Slide Content */}
        <div className="relative z-10 my-auto py-12 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-cyan-300 mb-6 backdrop-blur-md">
            {slide.badge}
          </div>

          <div className="mb-6 p-4 rounded-2xl bg-white/5 border border-white/10 inline-block backdrop-blur-md shadow-2xl">
            {slide.icon}
          </div>

          <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-white mb-4 leading-tight">
            {slide.title}
          </h2>

          <p className="text-base text-slate-300 mb-8 leading-relaxed">
            {slide.description}
          </p>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-700/60 text-xs font-medium text-primary-200 flex items-center justify-between backdrop-blur-md">
            <span>{slide.metric}</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" /> Verified System Data
            </span>
          </div>
        </div>

        {/* Bottom Slide Controls */}
        <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-6">
          <div className="flex items-center gap-2">
            {showcaseSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 transition-all rounded-full ${
                  currentSlide === idx ? 'w-8 bg-primary-400' : 'w-2 bg-white/30 hover:bg-white/50'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              title={isPaused ? 'Play' : 'Pause'}
            >
              {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setCurrentSlide((prev) => (prev === 0 ? showcaseSlides.length - 1 : prev - 1))}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="Previous slide"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentSlide((prev) => (prev + 1) % showcaseSlides.length)}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="Next slide"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Right Authentication Panel */}
      <div className="flex-1 flex flex-col justify-center p-6 sm:p-12 lg:p-16 max-w-2xl mx-auto w-full">
        {/* Mobile Header */}
        <div className="flex md:hidden items-center gap-3 mb-8">
          <div className="h-10 w-10 rounded-xl bg-primary-600 flex items-center justify-center text-white font-bold text-xl">
            G
          </div>
          <div>
            <span className="font-bold text-xl text-foreground-strong">GCLMS</span>
            <span className="block text-xs text-foreground-muted">Learning Management Portal</span>
          </div>
        </div>

        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground-strong tracking-tight">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-foreground-muted">
            Sign in to access your learning courses, assignments, and school portal.
          </p>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 rounded-md bg-danger-50 border border-danger-100 text-danger-700 text-sm font-medium">
            {errorMessage}
          </div>
        )}

        {capsLockOn && (
          <div className="mb-4 p-2.5 rounded-md bg-warning-50 border border-warning-100 text-warning-700 text-xs font-semibold">
            ⚠️ Caps Lock is ON
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-foreground-strong uppercase tracking-wider mb-2">
              Email Address / Username
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-foreground-subtle absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="user@school.gclms.local"
                className="w-full pl-10 pr-4 py-2.5 rounded-md bg-surface border border-border text-sm text-foreground-strong focus:outline-none focus:border-primary-600 focus:ring-1 focus:ring-primary-600 transition-all placeholder:text-foreground-subtle"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-foreground-strong uppercase tracking-wider">
                Password
              </label>
              <a href="/forgot-password" className="text-xs font-semibold text-primary-600 hover:text-primary-700">
                Forgot Password?
              </a>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-foreground-subtle absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-10 py-2.5 rounded-md bg-surface border border-border text-sm text-foreground-strong focus:outline-none focus:border-primary-600 focus:ring-1 focus:ring-primary-600 transition-all placeholder:text-foreground-subtle"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-foreground-subtle hover:text-foreground"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-foreground-muted cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-border text-primary-600 focus:ring-primary-600 h-4 w-4"
              />
              <span>Remember this device</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm rounded-md shadow-card focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                Sign In to Portal <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Demo Credentials Quick Switcher (Development Only) */}
        <div className="mt-8 pt-6 border-t border-border">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-foreground-muted uppercase tracking-wider flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-primary-600" /> Demo Quick Login (Development Mode)
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => handleDemoSelect('FOUNDER', 'founder@gclms.local')}
              className="p-2.5 rounded-md bg-surface-subtle hover:bg-primary-50 border border-border hover:border-primary-200 text-left transition-all"
            >
              <span className="font-semibold block text-foreground-strong">Founder</span>
              <span className="text-[11px] text-foreground-subtle">founder@gclms.local</span>
            </button>

            <button
              onClick={() => handleDemoSelect('PRINCIPAL', 'principal.chennai@gclms.local')}
              className="p-2.5 rounded-md bg-surface-subtle hover:bg-primary-50 border border-border hover:border-primary-200 text-left transition-all"
            >
              <span className="font-semibold block text-foreground-strong">Principal</span>
              <span className="text-[11px] text-foreground-subtle">principal.chennai@gclms.local</span>
            </button>

            <button
              onClick={() => handleDemoSelect('TEACHER', 'teacher.python.chennai@gclms.local')}
              className="p-2.5 rounded-md bg-surface-subtle hover:bg-primary-50 border border-border hover:border-primary-200 text-left transition-all"
            >
              <span className="font-semibold block text-foreground-strong">Teacher</span>
              <span className="text-[11px] text-foreground-subtle">teacher.python.chennai@gclms.local</span>
            </button>

            <button
              onClick={() => handleDemoSelect('STUDENT', 'student.tharun.chennai@gclms.local')}
              className="p-2.5 rounded-md bg-surface-subtle hover:bg-primary-50 border border-border hover:border-primary-200 text-left transition-all"
            >
              <span className="font-semibold block text-foreground-strong">Student</span>
              <span className="text-[11px] text-foreground-subtle">student.tharun.chennai@gclms.local</span>
            </button>
          </div>
        </div>

        <div className="mt-8 text-center text-xs text-foreground-subtle">
          Need technical assistance? <a href="mailto:support@gclms.local" className="text-primary-600 hover:underline">Contact System Administrator</a>
        </div>
      </div>
    </div>
  );
}
