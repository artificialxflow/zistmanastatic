/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, 
  Leaf, 
  Trash2, 
  Droplet, 
  ArrowLeft, 
  Sparkles, 
  ChevronLeft, 
  Mail, 
  Clock, 
  TreePine, 
  Globe, 
  User, 
  Menu, 
  X,
  TrendingDown,
  Activity
} from 'lucide-react';
import { BlogItem, LifestyleSimulation } from '../types';
import { initialBlogs } from '../data/mockData';

interface LandingViewProps {
  onEnterAdmin: () => void;
  triggerToast: (msg: string, type: 'success' | 'warning' | 'info') => void;
}

export default function LandingView({ onEnterAdmin, triggerToast }: LandingViewProps) {
  // Navigation states
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  // Dynamic counter metrics (simulated counters)
  const [co2SavedTotal, setCo2SavedTotal] = useState(14420);
  const [treesPlanted, setTreesPlanted] = useState(3840);
  const [waterProtected, setWaterProtected] = useState(92600);

  // Selected blog modal state
  const [selectedBlog, setSelectedBlog] = useState<BlogItem | null>(null);

  // Newsletter states
  const [newsEmail, setNewsEmail] = useState('');
  const [newsSuccess, setNewsSuccess] = useState(false);

  // Lifestyle Simulator States
  const [sim, setSim] = useState<LifestyleSimulation>({
    solarPower: true,
    recyclingLevel: 3,
    commuteMode: 'public',
    waterSavingUsage: true,
    meatConsumption: 'medium'
  });

  const [simResults, setSimResults] = useState({
    co2Saved: 0,
    waterSaved: 0,
    wastePrevented: 0,
    score: 0
  });

  // Smooth periodic increment for stats to show "live simulation" feel
  useEffect(() => {
    const timer = setInterval(() => {
      setCo2SavedTotal(prev => prev + Math.floor(Math.random() * 3) + 1);
      if (Math.random() > 0.70) {
        setTreesPlanted(prev => prev + 1);
      }
      setWaterProtected(prev => prev + Math.floor(Math.random() * 8) + 2);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  // Recalculate simulation impacts in real-time
  useEffect(() => {
    let co2 = 0; // kg CO2 saved per month
    let water = 0; // Liters of water saved per month
    let waste = 0; // kg of waste prevented per month
    let baseScore = 30; // base score out of 100

    // 1. Solar power
    if (sim.solarPower) {
      co2 += 180;
      baseScore += 20;
    }

    // 2. Recycling
    waste += sim.recyclingLevel * 6.5; // 6.5kg per level
    baseScore += sim.recyclingLevel * 5;

    // 3. Commute
    if (sim.commuteMode === 'bike') {
      co2 += 150;
      baseScore += 20;
    } else if (sim.commuteMode === 'public') {
      co2 += 100;
      baseScore += 15;
    } else if (sim.commuteMode === 'hybrid') {
      co2 += 50;
      baseScore += 8;
    }

    // 4. Meat consumption
    if (sim.meatConsumption === 'low') {
      co2 += 60;
      water += 3000;
      baseScore += 15;
    } else if (sim.meatConsumption === 'medium') {
      co2 += 25;
      water += 1200;
      baseScore += 7;
    }

    // 5. Water saving tools
    if (sim.waterSavingUsage) {
      water += 2500;
      baseScore += 10;
    }

    // Limit score to max of 100
    const finalScore = Math.min(baseScore, 100);

    setSimResults({
      co2Saved: co2,
      waterSaved: water,
      wastePrevented: Math.round(waste * 10) / 10,
      score: finalScore
    });
  }, [sim]);

  const handleNewsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsEmail || !newsEmail.includes('@')) {
      triggerToast('لطفا یک ایمیل معتبر وارد کنید.', 'warning');
      return;
    }
    setNewsSuccess(true);
    triggerToast('عضویت شما در خبرنامه زیست‌مانا با موفقیت انجام شد!', 'success');
    setNewsEmail('');
    setTimeout(() => setNewsSuccess(false), 5000);
  };

  const handleApplySimStats = () => {
    triggerToast(`امتیاز زیست‌محیطی شما (${simResults.score} از ۱۰۰) با موفقیت در پایگاه داده ثبت شد!`, 'success');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-all duration-300">
      
      {/* Dynamic Header */}
      <header className="sticky top-0 z-40 w-full transition-all duration-300 border-b border-white/20 glass-panel shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-500 to-sky-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <Activity className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="font-bold text-xl tracking-tight text-slate-900 block font-sans">
                زیست‌مانا
              </span>
              <span className="text-[10px] uppercase font-semibold text-emerald-600 tracking-wider block -mt-1 font-mono">
                SustainaPulse
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {[
              { id: 'hero', name: 'خانه' },
              { id: 'features', name: 'محورها' },
              { id: 'simulator', name: 'شبیه‌ساز هوشمند' },
              { id: 'stats', name: 'آمار زنده' },
              { id: 'blog', name: 'دانستنی‌ها' }
            ].map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={() => setActiveSection(link.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeSection === link.id
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Login/CTA buttons */}
          <div className="hidden md:flex items-center gap-3">
            <button
              id="btn-goto-admin"
              onClick={onEnterAdmin}
              className="px-5 py-2.5 rounded-xl bg-slate-950 text-white font-medium text-sm hover:bg-slate-800 transition-all flex items-center gap-2 group shadow-sm cursor-pointer"
            >
              <span>ورود به پنل مدیریت ادمین</span>
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            </button>
          </div>

          {/* Hamburger Mobile Icon */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-slate-100 bg-white/95 backdrop-blur-md overflow-hidden"
            >
              <div className="px-4 py-4 space-y-2 flex flex-col">
                {[
                  { id: 'hero', name: 'خانه' },
                  { id: 'features', name: 'محورها' },
                  { id: 'simulator', name: 'شبیه‌ساز هوشمند' },
                  { id: 'stats', name: 'آمار زنده' },
                  { id: 'blog', name: 'دانستنی‌ها' }
                ].map((link) => (
                  <a
                    key={link.id}
                    href={`#${link.id}`}
                    onClick={() => {
                      setActiveSection(link.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      activeSection === link.id
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {link.name}
                  </a>
                ))}
                <div className="pt-4 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onEnterAdmin();
                    }}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 text-white text-center text-sm font-medium hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                  >
                    <span>ورود به پنل مدیریت ادمین</span>
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section */}
      <section id="hero" className="relative py-12 md:py-24 overflow-hidden border-b border-slate-100">
        
        {/* Subtle Background Blobs */}
        <div className="absolute top-1/4 right-0 w-80 h-80 bg-emerald-200/35 rounded-full filter blur-3xl -z-10" />
        <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-sky-200/35 rounded-full filter blur-3xl -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-12 gap-12 items-center">
            
            {/* Hero Left Content */}
            <div className="md:col-span-7 space-y-6 text-right">
              
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                <span>برگزارکننده پویش‌های بزرگ کربن‌صفر و پایداری ملی</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-950 leading-tight tracking-tight">
                با هر تپش، روحی تازه به{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-l from-emerald-600 via-emerald-500 to-sky-500">
                  زمین پایدار
                </span>{' '}
                ببخشیم
              </h1>

              <p className="text-lg text-slate-600 leading-relaxed font-normal">
                پلتفرم تعاملی <strong className="font-semibold text-slate-800">زیست‌مانا (SustainaPulse)</strong> محیطی هوشمند جهت رصد لحظه‌ای منابع انرژی پاک، بهینه‌سازی الگوهای روزانه توسعه سبز و سبک زندگی پایدار فراهم ساخته است. همراه با ما گامی برای فردا بردارید.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <a
                  href="#simulator"
                  className="px-8 py-4 text-center rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white font-bold text-base shadow-lg shadow-emerald-600/20 hover:scale-[1.02] transform transition-all cursor-pointer"
                >
                  شروع شبیه‌سازی سبک زندگی
                </a>
                <button
                  onClick={onEnterAdmin}
                  className="px-6 py-4 rounded-xl border-2 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300 font-bold text-base transition-all flex items-center justify-center gap-2"
                >
                  <span>نمایش لحظه‌ای پروژه‌ها و آمار ادمین</span>
                  <ChevronLeft className="w-5 h-5" />
                </button>
              </div>

              {/* Trust Indicators / Badges */}
              <div className="grid grid-cols-3 gap-4 pt-6 text-slate-500 text-xs border-t border-slate-100">
                <div>
                  <span className="block text-slate-900 font-bold text-lg">۱۰۰٪</span>
                  <span>شفافیت و امنیت پایش</span>
                </div>
                <div>
                  <span className="block text-slate-900 font-bold text-lg">۵+ منطقه</span>
                  <span>پیاده‌سازی شهری فعال</span>
                </div>
                <div>
                  <span className="block text-slate-900 font-bold text-lg">کربن‌صفر</span>
                  <span>هدف‌گذاری نهایی ۱۴۱۰</span>
                </div>
              </div>

            </div>

            {/* Hero Right Visual Column */}
            <div className="md:col-span-5 relative flex justify-center">
              <div className="relative w-full max-w-sm aspect-square">
                
                {/* Decorative Rotating/Pulsing circles representing ecosystem */}
                <div className="absolute inset-0 bg-emerald-100/40 rounded-full animate-pulse" />
                <div className="absolute inset-10 bg-sky-50/70 border border-sky-100 rounded-full flex items-center justify-center shadow-xl">
                  
                  {/* Styled central interactive vector representing natural power */}
                  <svg viewBox="0 0 200 200" className="w-64 h-64 text-emerald-600" fill="none" stroke="currentColor">
                    {/* Eco tree outline */}
                    <path 
                      d="M100,160 L100,50 M100,80 L60,110 M100,110 L140,140 M100,60 C70,60 50,80 50,110 C50,140 100,160 100,160 C100,160 150,140 150,110 C150,80 130,60 100,60 Z" 
                      strokeWidth="5" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                    />
                    {/* Energy lightning rays */}
                    <path 
                      d="M95,25 L105,25 L98,40 L110,40 L90,65 L100,45 L90,45 Z" 
                      fill="currentColor" 
                      stroke="none"
                      className="text-amber-500 animate-bounce" 
                    />
                    {/* Water droplets around tree */}
                    <circle cx="150" cy="70" r="6" className="text-sky-500 fill-current" />
                    <circle cx="50" cy="140" r="5" className="text-sky-400 fill-current" />
                  </svg>
                </div>

                {/* Micro Floater Badges */}
                <div className="absolute top-4 right-4 p-3 bg-white rounded-xl shadow-lg border border-slate-100 flex items-center gap-2 animate-bounce [animation-duration:4s]">
                  <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-600">
                    <Leaf className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400 font-semibold">پایداری خاک</span>
                    <span className="block text-xs font-bold text-slate-900">۹۸٪ احیا شده</span>
                  </div>
                </div>

                <div className="absolute bottom-6 left-2 p-3 bg-white rounded-xl shadow-lg border border-slate-100 flex items-center gap-2 animate-bounce [animation-duration:5s]">
                  <div className="p-1.5 rounded-lg bg-amber-100 text-amber-600">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400 font-semibold">تولید خورشیدی</span>
                    <span className="block text-xs font-bold text-slate-900">۴۲.۸ مگاوات ساعت</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Features Showcase Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <h2 className="text-3xl font-black text-slate-900">سه محور طلایی زیست‌مانا در پایداری زمین</h2>
            <div className="w-20 h-1.5 bg-emerald-500 mx-auto rounded-full" />
            <p className="text-slate-600 text-base">
              رسالت پلتفرم ترویج عادلانه‌ و دقیق استانداردهای زیست‌محیطی در حوزه‌های تولید خرد، مدیریت توسعه شهری و سبک زندگی مسئولانه است.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            
            {/* Energy card */}
            <div className="p-8 rounded-2xl border border-slate-100 bg-slate-50 hover:border-emerald-300 hover:bg-emerald-50/20 hover:shadow-xl transition-all group duration-300">
              <div className="w-14 h-14 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                <span className="text-2xl">🔋</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">۱. مدیریت بهینه انرژی پاک</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                رصد بازدهی میکروپنل‌های خورشیدی خانگی، کنترل ساعات پیک بار شبکه و هوشمندسازی توزیع توان الکتریکی محلی جهت بهینه‌سازی حداکثری مصرف برق کشور.
              </p>
              <div className="mt-6 flex items-center gap-2 text-xs font-bold text-orange-600 uppercase tracking-wider">
                <span>اطلاعات فنی سیستم برق</span>
                <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              </div>
            </div>

            {/* Development card */}
            <div className="p-8 rounded-2xl border border-slate-100 bg-slate-50 hover:border-emerald-300 hover:bg-emerald-50/20 hover:shadow-xl transition-all group duration-300 font-sans">
              <div className="w-14 h-14 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                <span className="text-2xl">🌿</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">۲. توسعه یکپارچه سبز</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                سنجش فضایی بافت جنگلی بومی، تسهیل تفکیک اتوماتیک پسماند شهری و نظارت متمرکز بر عملکرد دوره‌ای تصفیه‌خانه‌ها و هدایت پساب در کشاورزی مدرن.
              </p>
              <div className="mt-6 flex items-center gap-2 text-xs font-bold text-emerald-600 uppercase tracking-wider">
                <span>نمای پروژه‌های توسعه</span>
                <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              </div>
            </div>

            {/* Lifestyle card */}
            <div className="p-8 rounded-2xl border border-slate-100 bg-slate-50 hover:border-sky-300 hover:bg-sky-50/20 hover:shadow-xl transition-all group duration-300">
              <div className="w-14 h-14 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                <span className="text-2xl">☀️</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">۳. اصلاح هوشمند سبک زندگی</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                هدایت فردی کاربران در مصرف آب، تفکیک دقیق زباله از مبدا، ترویج رژیم‌های غذایی ارگانیک و الگوهای حمل‌ونقل عمومی یا بدون سوخت فسیلی.
              </p>
              <div className="mt-6 flex items-center gap-2 text-xs font-bold text-sky-600 uppercase tracking-wider">
                <span>شبیه‌ساز گام‌های روزانه</span>
                <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Real-time Dynamic Simulation Platform */}
      <section id="simulator" className="py-20 bg-slate-100/60 border-y border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">بخش تعاملی</span>
            <h2 className="text-3xl font-black text-slate-900">شبیه‌ساز اثرات زیست‌محیطی روزانه</h2>
            <div className="w-20 h-1.5 bg-sky-500 mx-auto rounded-full" />
            <p className="text-slate-600 text-base">
              متغیرهای زیر را بر اساس عادات واقعی زندگی خود تنظیم کنید و میزان کاهش کربن دی‌اکسید، جیره‌بندی مصرف آب و پیشگیری از تولید پسماند خود را به صورت زنده رصد فرمایید.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Control Form - 7 columns */}
            <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/60 shadow-sm space-y-6">
              <h3 className="text-lg font-bold text-slate-950 border-b border-slate-100 pb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-500" />
                <span>تنظیم گزینه‌های سبک زندگی پایدار شما</span>
              </h3>

              {/* 1. Solar power switch */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div>
                  <label className="font-bold text-slate-900 text-sm block">برق خورشیدی خانگی (میکروپنل)</label>
                  <span className="text-slate-500 text-xs block">آیا از تامین انرژی خورشیدی محدود یا پنل گرمایشی آب استفاده می‌کنید؟</span>
                </div>
                <button
                  onClick={() => setSim(prev => ({ ...prev, solarPower: !prev.solarPower }))}
                  className={`w-14 h-8 rounded-full transition-all flex items-center p-1 cursor-pointer ${
                    sim.solarPower ? 'bg-emerald-500 justify-start' : 'bg-slate-300 justify-end'
                  }`}
                >
                  <motion.div layout className="w-6 h-6 rounded-full bg-white shadow-sm" />
                </button>
              </div>

              {/* 2. Recycling level slider */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="flex justify-between items-center text-sm font-bold text-slate-900">
                  <label>سطح پایبندی به تفکیک زباله و کمپوست</label>
                  <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md text-xs">درجه {sim.recyclingLevel} از ۵</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="5"
                  value={sim.recyclingLevel}
                  onChange={(e) => setSim(prev => ({ ...prev, recyclingLevel: parseInt(e.target.value) }))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>هیچ تفکیکی (صفر)</span>
                  <span>تفکیک ۱۰۰٪ و تفاله کمپوست (حداکثر)</span>
                </div>
              </div>

              {/* 3. Commute Mode */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-4">
                <label className="font-bold text-slate-900 text-sm block">الگوی جابجایی و تردد روزانه</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { id: 'car', label: 'خودرو تک‌سرنشین', emoji: '🚗' },
                    { id: 'hybrid', label: 'خودرو اشتراکی/هیبرید', emoji: '🚙' },
                    { id: 'public', label: 'اتوبوس و مترو', emoji: '🚌' },
                    { id: 'bike', label: 'پیاده یا دوچرخه', emoji: '🚲' }
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setSim(prev => ({ ...prev, commuteMode: item.id as any }))}
                      className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                        sim.commuteMode === item.id
                          ? 'border-emerald-500 bg-emerald-50/50 text-emerald-900 font-bold'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <span className="text-xl">{item.emoji}</span>
                      <span className="text-[11px] leading-tight">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Food preference & meat */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-4">
                <label className="font-bold text-slate-900 text-sm block">نقش سبد غذایی (سهم گوشت قرمز مصرفی)</label>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { id: 'high', label: 'مصرف غنی', desc: 'بیشتر وعده‌ها گوشتی' },
                    { id: 'medium', label: 'متوسط و متعادل', desc: 'وعده‌های ترکیبی' },
                    { id: 'low', label: 'سبک یا گیاه‌خواری', desc: 'حداقل فرآورده حیوانی' }
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setSim(prev => ({ ...prev, meatConsumption: item.id as any }))}
                      className={`p-2.5 rounded-xl border text-center transition-all flex flex-col justify-center gap-1 cursor-pointer ${
                        sim.meatConsumption === item.id
                          ? 'border-emerald-500 bg-emerald-50/50 text-emerald-900 font-bold'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <span className="text-xs">{item.label}</span>
                      <span className="text-[9px] text-slate-400">{item.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 5. Water saving gadgets */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div>
                  <label className="font-bold text-slate-900 text-sm block">کاهنده‌های هوشمند فشار آب</label>
                  <span className="text-slate-500 text-xs block">استفاده از سردوش‌های دوکاره، فلاش‌تانک کم‌حجم و شیرهای پدالی/چشمی</span>
                </div>
                <button
                  onClick={() => setSim(prev => ({ ...prev, waterSavingUsage: !prev.waterSavingUsage }))}
                  className={`w-14 h-8 rounded-full transition-all flex items-center p-1 cursor-pointer ${
                    sim.waterSavingUsage ? 'bg-emerald-500 justify-start' : 'bg-slate-300 justify-end'
                  }`}
                >
                  <motion.div layout className="w-6 h-6 rounded-full bg-white shadow-sm" />
                </button>
              </div>

            </div>

            {/* Simulated Live Results - 5 columns */}
            <div className="lg:col-span-5 bg-slate-900 text-white p-6 sm:p-8 rounded-3xl flex flex-col justify-between shadow-xl relative overflow-hidden dark-glass-panel border border-slate-800">
              
              <div className="absolute top-0 right-0 w-44 h-44 bg-emerald-500/10 rounded-full filter blur-3xl -z-10" />
              
              <div>
                <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider block mb-1">نتیجه شبیه‌سازی زنده</span>
                <h3 className="text-xl font-black text-slate-100 mb-6">گزارش تپش زیست‌محیطی</h3>

                {/* Score Indicator Gauge */}
                <div className="flex flex-col items-center justify-center my-6">
                  <div className="relative w-36 h-36">
                    {/* Background Circle */}
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="72"
                        cy="72"
                        r="60"
                        className="stroke-slate-800"
                        strokeWidth="12"
                        fill="transparent"
                      />
                      {/* Active Circle with strokeDasharray */}
                      <motion.circle
                        cx="72"
                        cy="72"
                        r="60"
                        className="stroke-emerald-400"
                        strokeWidth="12"
                        fill="transparent"
                        strokeDasharray={2 * Math.PI * 60}
                        strokeDashoffset={2 * Math.PI * 60 * (1 - simResults.score / 100)}
                        strokeLinecap="round"
                        transition={{ duration: 0.6 }}
                      />
                    </svg>
                    {/* Value label inside */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-4xl font-extrabold text-white font-mono">{simResults.score}</span>
                      <span className="text-[10px] text-emerald-400 font-semibold">امتیاز پایداری</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 text-center mt-3 max-w-xs font-medium">
                    {simResults.score >= 80 
                      ? '🌿 قهرمان واقعی لایه اوزون! سبک زندگی شما الگوی جامعه است.' 
                      : simResults.score >= 55 
                      ? '⚡ شرایط متوسط مایل به مطلوب؛ با تغییر جزئی به تعالی برسید.' 
                      : '⚠️ اثر کربنی شما بالاست. امکان بهینه‌سازی بسیار مطلوبی وجود دارد.'}
                  </p>
                </div>

                {/* Visualized variables cards */}
                <div className="space-y-4">
                  
                  {/* CO2 item */}
                  <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/55 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                        <TrendingDown className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-xs text-slate-300 block">صرفه‌جویی کربن دی‌اکسید (ماهانه)</span>
                        <span className="text-xs text-[10px] text-slate-400 block">معادل درختان کاشته شده جدید</span>
                      </div>
                    </div>
                    <span className="text-base font-extrabold text-emerald-400 font-mono">-{simResults.co2Saved} kg</span>
                  </div>

                  {/* Water item */}
                  <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/55 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-sky-500/15 text-sky-400 flex items-center justify-center">
                        <Droplet className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-xs text-slate-300 block">ذخیره پایدار آب با کیفیت</span>
                        <span className="text-[10px] text-slate-400 block">پیشگیری از بحران آب‌های سطحی</span>
                      </div>
                    </div>
                    <span className="text-base font-extrabold text-sky-400 font-mono">+{simResults.waterSaved} L</span>
                  </div>

                  {/* Waste prevented */}
                  <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/55 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-orange-500/15 text-orange-400 flex items-center justify-center">
                        <Trash2 className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-xs text-slate-300 block">کاهش قطعی پسماند جامد رفاهی</span>
                        <span className="text-[10px] text-slate-400 block">کاهش بار دفن زباله‌های غیرکمپوست</span>
                      </div>
                    </div>
                    <span className="text-base font-extrabold text-orange-400 font-mono">-{simResults.wastePrevented} kg</span>
                  </div>

                </div>
              </div>

              <div className="pt-6 border-t border-slate-800 mt-6 md:mt-0">
                <button
                  onClick={handleApplySimStats}
                  className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 transition-colors text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 fill-slate-950" />
                  <span>ثبت و ذخیره امتیاز در پایگاه ادمین</span>
                </button>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* Dynamic Statistics Block */}
      <section id="stats" className="py-20 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid md:grid-cols-3 gap-8 text-center">
            
            {/* Stat Box 1 */}
            <div className="p-8 rounded-2xl bg-white border border-slate-200/60 shadow-sm space-y-3 relative overflow-hidden">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2">
                <Leaf className="w-6 h-6" />
              </div>
              <span className="text-sm font-semibold text-slate-500 block">حجم کربن دی‌اکسید کاهش‌یافته کل کشور</span>
              <span className="text-4xl font-extrabold text-slate-950 block tracking-tight font-mono">
                {co2SavedTotal.toLocaleString('fa-IR')}
                <span className="text-lg font-bold text-emerald-600 mr-1.5 font-sans">کيلوگرم</span>
              </span>
              <p className="text-xs text-slate-400 font-medium w-full">تعداد روزهای متوالی کاهش نرخ آلایندگی نیروگاهی کشور</p>
            </div>

            {/* Stat Box 2 */}
            <div className="p-8 rounded-2xl bg-white border border-slate-200/60 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center mx-auto mb-2">
                <TreePine className="w-6 h-6" />
              </div>
              <span className="text-sm font-semibold text-slate-500 block">درختان غرس‌شده و نهال‌های بقایافته</span>
              <span className="text-4xl font-extrabold text-slate-950 block tracking-tight font-mono">
                {treesPlanted.toLocaleString('fa-IR')}
                <span className="text-lg font-bold text-sky-600 mr-1.5 font-sans">اصله درخت</span>
              </span>
              <p className="text-xs text-slate-400 font-medium">پایش ماهواره‌ای پوشش گیاهی و توسعه مراتع ملی</p>
            </div>

            {/* Stat Box 3 */}
            <div className="p-8 rounded-2xl bg-white border border-slate-200/60 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-2">
                <Droplet className="w-6 h-6" />
              </div>
              <span className="text-sm font-semibold text-slate-500 block">ذخیره استراتژیک آب شیرین تفکیکی</span>
              <span className="text-4xl font-extrabold text-slate-950 block tracking-tight font-mono">
                {waterProtected.toLocaleString('fa-IR')}
                <span className="text-lg font-bold text-amber-600 mr-1.5 font-sans">ليتر</span>
              </span>
              <p className="text-xs text-slate-400 font-medium">حاصل از مصرف پدالی شیرآلات خانگی ثبت شده</p>
            </div>

          </div>

        </div>
      </section>

      {/* Blog & News / دانستنی‌ها */}
      <section id="blog" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <h2 className="text-3xl font-black text-slate-900">دانش‌نامه پایداری و فناوری‌های سبز</h2>
            <div className="w-20 h-1.5 bg-emerald-500 mx-auto rounded-full" />
            <p className="text-slate-600 text-base">
              مجموعه‌ای از مقالات کاربردی و راهکارهای تایید شده توسط کارشناسان محیط زیست برای رشد و توسعه پایدار فردی و شهری.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {initialBlogs.map((blog) => (
              <motion.article 
                key={blog.id}
                whileHover={{ y: -6 }}
                className="rounded-2xl border border-slate-100 bg-slate-50 overflow-hidden flex flex-col justify-between shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedBlog(blog)}
              >
                <div>
                  <div className="aspect-video w-full overflow-hidden relative">
                    <img
                      src={blog.image}
                      alt={blog.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <span className="absolute top-3 right-3 px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-[10px] font-bold text-emerald-800 border border-slate-200">
                      {blog.category}
                    </span>
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="flex items-center gap-3 text-xs text-slate-400 font-medium bg-white px-2 py-1 rounded-md w-fit">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{blog.readTime}</span>
                      </span>
                      <span>•</span>
                      <span>{blog.date}</span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 leading-snug group-hover:text-emerald-600 transition-colors">
                      {blog.title}
                    </h3>
                    
                    <p className="text-slate-600 text-xs leading-relaxed line-clamp-3">
                      {blog.excerpt}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700">
                    <span>ادامه مطلب و راهکارها</span>
                    <ChevronLeft className="w-4 h-4" />
                  </span>
                </div>
              </motion.article>
            ))}
          </div>

        </div>
      </section>

      {/* Sustainable Newsletter Section */}
      <section className="py-16 bg-slate-900 text-white relative overflow-hidden border-t border-slate-800">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full filter blur-3xl -z-10" />
        
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/20">
            <Mail className="w-6 h-6" />
          </div>
          
          <h2 className="text-2xl md:text-3xl font-black text-slate-100">دریافت راهنمای ماهانه «زیست‌مانا»</h2>
          <p className="text-slate-300 text-sm max-w-lg mx-auto leading-relaxed">
            هیچ وبلاگ تبلیغاتی ارسال نمی‌شود! فقط چکیده‌ای از تکنولوژی‌های کاهنده عوارض قبوض آب و برق خانگی و دستاوردهای جدید اَبَرپژوژه‌های زیست‌محیطی ادمین زیست‌مانا.
          </p>

          <form onSubmit={handleNewsSubmit} className="max-w-md mx-auto flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              placeholder="نشانی ایمیل شما..."
              value={newsEmail}
              onChange={(e) => setNewsEmail(e.target.value)}
              className="flex-grow px-4 py-3.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors text-right"
              dir="ltr"
            />
            <button
              type="submit"
              className="px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 transition-colors text-slate-950 font-bold text-sm cursor-pointer"
            >
              عضویت رایگان
            </button>
          </form>

          {newsSuccess && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-emerald-400 font-bold"
            >
              تشکر! ایمیل شما ثبت شد. به زودی اولین خبرنامه برایتان صادر خواهد شد.
            </motion.p>
          )}

        </div>
      </section>

      {/* Simple Elegant Footer */}
      <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-12 border-b border-slate-900 pb-12">
            
            <div className="space-y-4">
              <div className="flex items-center gap-2.5 text-white">
                <span className="text-2xl">🌱</span>
                <span className="text-lg font-black font-sans leading-none">زیست‌مانا</span>
              </div>
              <p className="text-xs leading-relaxed text-slate-500">
                سامانه زیست‌مانا (SustainaPulse) مجموعه‌ای داوطلبانه، دانش‌بنیان و همه‌جانبه برای پایدارسازی حیات شهری و استفاده آگاهانه‌تر از منابع گرانقدر کره زمین است.
              </p>
            </div>

            <div>
              <h4 className="text-white text-sm font-bold mb-4">بخش‌های اصلی</h4>
              <ul className="space-y-2.5 text-xs">
                <li><a href="#hero" className="hover:text-emerald-400 transition-colors">صفحه اصلی خانه</a></li>
                <li><a href="#features" className="hover:text-emerald-400 transition-colors">محورهای سه‌گانه پایداری</a></li>
                <li><a href="#simulator" className="hover:text-emerald-400 transition-colors">ابزار محاسبه سبک زندگی</a></li>
                <li><a href="#stats" className="hover:text-emerald-400 transition-colors">آمار تولید توان کلیدی</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white text-sm font-bold mb-4">پشتیبانی و ارتباط</h4>
              <ul className="space-y-2.5 text-xs">
                <li className="flex items-center gap-1.5 font-mono">info@sustainapulse.ir</li>
                <li className="flex items-center gap-1.5 font-sans">تلفن راهنمای مردمی: ۰۲۱-۸۸۹۹۰۰۰</li>
                <li className="flex items-center gap-1.5">ساختمان پایداری، خیابان زرتشت غربی، تهران</li>
              </ul>
            </div>

            <div>
              <h4 className="text-white text-sm font-bold mb-4">بیانیه گرانبها</h4>
              <p className="text-xs italic text-slate-500 leading-loose">
                "زمین ارث پدری ما نیست، بلکه امانتی گرانقدر از فرزندان و بهار نسلهای آینده ماست. با مدیریت انرژی خورشیدی و اصلاح فردی عادات تفکیک پسماند دین خود را ادا نماییم."
              </p>
            </div>

          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500 font-mono">
            <span>© تمامی حقوق مادی و معنوی برای پلتفرم زیست‌مانا محفوظ است - ۲۰۲۶</span>
            <span>طراحی شده بر اساس استانداردهای وب سبز</span>
          </div>
        </div>
      </footer>

      {/* Expanded Blog Post View Modal */}
      <AnimatePresence>
        {selectedBlog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
            dir="rtl"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-100 max-h-[90vh] flex flex-col justify-between"
            >
              {/* Modal Title Bar / Header Image */}
              <div className="relative aspect-video w-full overflow-hidden flex-shrink-0">
                <img
                  src={selectedBlog.image}
                  alt={selectedBlog.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setSelectedBlog(null)}
                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-950/60 hover:bg-slate-950/80 transition-all text-white flex items-center justify-center cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
                <span className="absolute bottom-4 right-4 px-3 py-1 bg-emerald-500 text-slate-950 rounded-lg text-xs font-bold shadow">
                  {selectedBlog.category}
                </span>
              </div>

              {/* Scrollable contents */}
              <div className="p-6 overflow-y-auto flex-grow space-y-4">
                <div className="flex items-center gap-3 text-xs text-slate-400 font-medium bg-slate-100 w-fit px-2 py-1 rounded-md">
                  <span>{selectedBlog.date}</span>
                  <span>•</span>
                  <span>زمان مطالعه: {selectedBlog.readTime}</span>
                </div>

                <h2 className="text-xl sm:text-2xl font-black text-slate-950 leading-snug">
                  {selectedBlog.title}
                </h2>

                <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line text-right">
                  {selectedBlog.excerpt}
                </p>

                {/* Practical guidelines inside */}
                <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100/60 space-y-2.5">
                  <h4 className="font-extrabold text-sm text-emerald-900 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>توصیه‌های کاربردی کارشناسان زیست‌مانا برای این حوزه</span>
                  </h4>
                  <ul className="list-disc list-inside space-y-1.5 text-xs text-emerald-800 leading-relaxed pr-2">
                    <li>تا جای ممکن از بسته‌بندی‌های یک‌بارمصرف پلاستیکی دوری کنید.</li>
                    <li>دوره‌های خاموشی زمان‌های معین و پایش کنتورهای بار مصرفی در اوج مصرف.</li>
                    <li>در خریدهای تره‌بار، از همراه داشتن زنبیل یا کیسه دائمی پارچه‌ای لذت ببرید.</li>
                    <li>نصب برنامه‌های محاسبه سهم سفر با وسایل عمومی و مدیریت کربن تولیدی.</li>
                  </ul>
                </div>

                <div className="text-xs text-slate-400 flex items-center justify-end font-mono">
                  <span>تعداد پایش‌های مردمی: {selectedBlog.views + 45} بازدید</span>
                </div>
              </div>

              {/* Modal footer close */}
              <div className="p-4 sm:px-6 bg-slate-50 border-t border-slate-100 flex justify-end flex-shrink-0">
                <button
                  onClick={() => setSelectedBlog(null)}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold transition-all cursor-pointer"
                >
                  فهمیدم، بستن گفتگو
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
