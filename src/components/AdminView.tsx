/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  FolderKanban, 
  UserCog, 
  Power, 
  Plus, 
  Edit3, 
  Trash2, 
  Bell, 
  Calendar, 
  ChevronRight, 
  ChevronLeft, 
  Search, 
  Menu, 
  X, 
  Activity, 
  TrendingUp, 
  Coins,
  Sparkles,
  Award
} from 'lucide-react';
import { EcoProject, ChartDataPoint, LifestyleSimulation } from '../types';
import { chartPerformanceData } from '../data/mockData';

interface AdminViewProps {
  projects: EcoProject[];
  onAddProject: (p: Omit<EcoProject, 'id'>) => void;
  onUpdateProject: (p: EcoProject) => void;
  onDeleteProject: (id: string) => void;
  onExitAdmin: () => void;
  triggerToast: (msg: string, type: 'success' | 'warning' | 'info') => void;
}

export default function AdminView({ 
  projects, 
  onAddProject, 
  onUpdateProject, 
  onDeleteProject, 
  onExitAdmin,
  triggerToast
}: AdminViewProps) {
  // Navigation
  const [activeTab, setActiveTab] = useState<'dashboard' | 'projects' | 'settings'>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Search and filter inside tables
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'pending' | 'completed'>('all');

  // Chart state (active metric)
  const [activeMetric, setActiveMetric] = useState<'energySaved' | 'wasteReduced' | 'waterSaved'>('energySaved');

  // Modals for Create/Edit
  const [projectToEdit, setProjectToEdit] = useState<EcoProject | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form states for new project or edited project
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<'energy' | 'development' | 'lifestyle'>('energy');
  const [formProgress, setFormProgress] = useState(50);
  const [formBudget, setFormBudget] = useState(120000000);
  const [formImpact, setFormImpact] = useState(70);
  const [formLocation, setFormLocation] = useState('');
  const [formSupervisor, setFormSupervisor] = useState('');
  const [formStatus, setFormStatus] = useState<'active' | 'pending' | 'completed'>('active');

  // Admin personal profile states
  const [adminName, setAdminName] = useState('مهندس امین احمدی');
  const [adminEmail, setAdminEmail] = useState('a.ahmadi@sustainapulse.ir');
  const [adminRole, setAdminRole] = useState('مدیریت ارشد دایره پایداری');
  const [targetCarbonOffset, setTargetCarbonOffset] = useState(15000);
  const [alertsEnabled, setAlertsEnabled] = useState(true);

  // Notification states
  const [notifCount, setNotifCount] = useState(3);
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, text: 'پویش «۵۰۰۰ نهال بومی» به پیشرفت ۱۰۰٪ رسید و تکمیل گردید.', date: 'امروز - ۱۰:۱۵' },
    { id: 2, text: 'یک کاربر امتیاز فراتر از ۹۰ زنده ثبت کرد. بررسی عادات پایدار.', date: 'امروز - ۹:۲۰' },
    { id: 3, text: 'درخواست همکاری شهرداری منطقه ۶ برای ناوگان دوچرخه برقی.', date: 'دیروز' }
  ];

  // Open creation modal
  const openAddModal = () => {
    setFormTitle('');
    setFormCategory('energy');
    setFormProgress(0);
    setFormBudget(100000000);
    setFormImpact(50);
    setFormLocation('تهران');
    setFormSupervisor(adminName);
    setFormStatus('pending');
    setProjectToEdit(null);
    setIsAddModalOpen(true);
  };

  // Open edit modal
  const openEditModal = (p: EcoProject) => {
    setProjectToEdit(p);
    setFormTitle(p.title);
    setFormCategory(p.category);
    setFormProgress(p.progress);
    setFormBudget(p.budget);
    setFormImpact(p.impactFactor);
    setFormLocation(p.location);
    setFormSupervisor(p.supervisor);
    setFormStatus(p.status);
    setIsAddModalOpen(true);
  };

  // Handle modal submit
  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formLocation.trim() || !formSupervisor.trim()) {
      triggerToast('لطفا تمامی فیلدهای الزامی را تکمیل کنید.', 'warning');
      return;
    }

    if (projectToEdit) {
      // Editing
      onUpdateProject({
        id: projectToEdit.id,
        title: formTitle,
        category: formCategory,
        progress: Number(formProgress),
        budget: Number(formBudget),
        impactFactor: Number(formImpact),
        location: formLocation,
        supervisor: formSupervisor,
        status: formStatus,
        startDate: projectToEdit.startDate
      });
      triggerToast('پروژه زیست‌محیطی با موفقیت ویرایش گردید.', 'success');
    } else {
      // Creating
      const today = new Date();
      const formatPersianDate = `${today.getFullYear() - 581}/${today.getMonth() + 1}/${today.getDate()}`;
      onAddProject({
        title: formTitle,
        category: formCategory,
        progress: Number(formProgress),
        budget: Number(formBudget),
        impactFactor: Number(formImpact),
        location: formLocation,
        supervisor: formSupervisor,
        status: formStatus,
        startDate: formatPersianDate
      });
      triggerToast('پروژه زیست‌محیطی با موفقیت افزوده شد.', 'success');
    }

    setIsAddModalOpen(false);
  };

  // Handle delete click
  const handleDeleteClick = (id: string, title: string) => {
    if (confirm(`آیا از حذف پروژه پایداری «${title}» مطمئن هستید؟`)) {
      onDeleteProject(id);
      triggerToast('پروژه از لیست پایش ادمین با موفقیت حذف گردید.', 'success');
    }
  };

  // Filter projects depending on search query and status filter selection
  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.supervisor.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' ? true : p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Simple math for dynamic dashboard summary metrics
  const totalBudgetSpent = projects.reduce((acc, cr) => acc + cr.budget, 0);
  const averageImpactRating = Math.round(projects.reduce((acc, cr) => acc + cr.impactFactor, 0) / projects.length);
  const activeCount = projects.filter(p => p.status === 'active').length;
  const completedCount = projects.filter(p => p.status === 'completed').length;

  const currentDayName = 'پنجشنبه، ۸ خرداد ۱۴۰۵'; // Consistent with future time meta block

  // Determine standard metric name for chart labels
  const getMetricName = () => {
    if (activeMetric === 'energySaved') return 'انرژی پاک ذخیره شده (kWh)';
    if (activeMetric === 'wasteReduced') return 'پسماند بیولوژیک مهار شده (kg)';
    return 'آب شهری دوره‌ای محافظت شده (L)';
  };

  const getMetricColor = () => {
    if (activeMetric === 'energySaved') return '#f59e0b'; // amber
    if (activeMetric === 'wasteReduced') return '#10b981'; // emerald
    return '#0ea5e9'; // sky
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col md:flex-row font-sans" dir="rtl">
      
      {/* Drawer Overlay for Mobile */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-slate-950/40 md:hidden backdrop-blur-xs"
          />
        )}
      </AnimatePresence>

      {/* Sidebar - Collapsible & Right aligned */}
      <aside
        className={`fixed md:sticky top-0 right-0 h-screen z-50 transition-all duration-305 flex flex-col justify-between border-l border-slate-200/70 bg-white text-slate-800 ${
          sidebarCollapsed ? 'w-20' : 'w-72'
        } ${mobileSidebarOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'} `}
      >
        <div>
          {/* Sidebar Brand Header */}
          <div className="h-20 border-b border-slate-100 flex items-center justify-between px-5">
            <div className={`flex items-center gap-3 ${sidebarCollapsed ? 'hidden' : 'flex'}`}>
              <div className="w-9 h-9 rounded-lg bg-emerald-500 text-white flex items-center justify-center font-bold">
                🌱
              </div>
              <div>
                <span className="font-extrabold text-sm block tracking-wide">زیست‌مانا ادمین</span>
                <span className="text-[9px] text-slate-400 block -mt-1 font-mono uppercase">Control Engine</span>
              </div>
            </div>
            {/* Show only icon if collapsed */}
            {sidebarCollapsed && (
              <div className="w-9 h-9 rounded-lg bg-emerald-500 text-white flex items-center justify-center font-bold mx-auto transition-all">
                🌱
              </div>
            )}
            
            {/* Collapse Toggle Arrow (Desktop) */}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden md:flex p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
            >
              {sidebarCollapsed ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
            
            {/* Close Toggle for Mobile side drawer */}
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="md:hidden p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Administrator Details */}
          <div className={`p-4 mx-4 mt-4 bg-slate-50 rounded-2xl border border-slate-100 items-center gap-3 ${
            sidebarCollapsed ? 'hidden' : 'flex'
          }`}>
            <div className="w-10 h-10 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-700 flex items-center justify-center font-bold text-sm">
              AA
            </div>
            <div>
              <span className="font-bold text-xs text-slate-800 block">{adminName}</span>
              <span className="text-[10px] text-slate-400 block">{adminRole}</span>
            </div>
          </div>

          {/* Sidebar Nav links */}
          <nav className="p-4 space-y-1">
            {[
              { id: 'dashboard', name: 'پیشخوان و تحلیل‌ها', icon: <LayoutDashboard className="w-5 h-5" /> },
              { id: 'projects', name: 'مدیریت و پایش پروژه‌ها', icon: <FolderKanban className="w-5 h-5" /> },
              { id: 'settings', name: 'پیکربندی اهداف سالانه', icon: <UserCog className="w-5 h-5" /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  setMobileSidebarOpen(false);
                }}
                className={`w-full p-3 rounded-xl flex items-center gap-3 text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-emerald-500 text-slate-950 font-black shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <div className="flex-shrink-0">{tab.icon}</div>
                <span className={`${sidebarCollapsed ? 'invisible opacity-0 w-0' : 'visible opacity-100'} transition-all`}>
                  {tab.name}
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer logout */}
        <div className="p-4 border-t border-slate-100">
          <button
            onClick={onExitAdmin}
            className="w-full p-3 rounded-xl border border-slate-200/60 hover:bg-slate-100 text-slate-700 hover:text-slate-950 flex items-center gap-3 text-sm font-bold cursor-pointer"
          >
            <Power className="w-5 h-5 text-rose-500" />
            <span className={`${sidebarCollapsed ? 'hidden' : 'block'}`}>خروج / بازگشت به خانه</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Contents Layout */}
      <main className="flex-grow min-h-screen flex flex-col overflow-x-hidden md:max-w-[calc(100%-18rem)]">
        
        {/* Admin Header / Top bar */}
        <header className="h-20 border-b border-white glass-panel sticky top-0 z-30 flex items-center justify-between px-6 sm:px-8 shadow-sm">
          
          <div className="flex items-center gap-4">
            {/* Mobile Sidebar Trigger hamburger */}
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
            >
              <Menu className="w-6 h-6" />
            </button>
            
            {/* Header left text and date */}
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 bg-white border border-slate-200 px-3 py-1.5 rounded-full select-none">
              <Calendar className="w-3.5 h-3.5 text-emerald-500" />
              <span className="font-semibold text-slate-600">{currentDayName}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            
            {/* Quick exit to landing button on head */}
            <button
              onClick={onExitAdmin}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-dashed border-emerald-500 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors cursor-pointer"
            >
              نمایش لندینگ پیج اصلی
            </button>

            {/* Notification alert Bell */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setNotifCount(0); // Mark as read
                }}
                className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 transition-colors relative cursor-pointer"
              >
                <Bell className="w-5 h-5" />
                {notifCount > 0 && (
                  <span className="absolute top-1 right-1 w-4.5 h-4.5 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                    {notifCount}
                  </span>
                )}
              </button>

              {/* Notification dropdown menu */}
              <AnimatePresence>
                {showNotifications && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute left-0 mt-2 w-80 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 p-4"
                    >
                      <h4 className="font-bold text-sm text-slate-950 border-b border-slate-100 pb-2 mb-2 flex items-center justify-between">
                        <span>اعلان‌های پایش سبز</span>
                        <span className="text-[10px] font-normal text-slate-400">۳ مورد خوانده نشده</span>
                      </h4>
                      <div className="space-y-3">
                        {notifications.map(notif => (
                          <div key={notif.id} className="text-xs p-2.5 rounded-lg bg-slate-50 border border-slate-100/50 hover:bg-slate-100 transition-colors text-right">
                            <p className="text-slate-700 font-medium">{notif.text}</p>
                            <span className="text-[10px] text-slate-400 block mt-1">{notif.date}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Admin Profile Icon display */}
            <div className="w-10 h-10 rounded-xl bg-slate-950 text-white flex items-center justify-center font-mono">
              ★
            </div>

          </div>

        </header>

        {/* Dynamic Inner Tab View Router */}
        <div className="p-6 sm:p-8 flex-grow space-y-8">
          
          {/* TAB 1: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              
              {/* Informational intro banner */}
              <div className="p-6 rounded-3xl bg-slate-950 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full filter blur-3xl -z-10" />
                <div className="space-y-2 max-w-xl text-right">
                  <span className="bg-emerald-500 text-slate-950 px-2.5 py-1 rounded-md text-[10px] font-black uppercase">ناظر ارشد زیست‌مانا</span>
                  <h2 className="text-xl sm:text-2xl font-black">پنل کنترل هوشمند و پایش آنلاین مصرف سبز</h2>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    به بخش کنترل خوش آمدید ثانیه شمار زنده لندینگ پیج و اصلاحات انتخابی سبک زندگی کاربران محلی بر روی این بستر انباشت می‌شود. شما قادر هستید پروژه‌های انرژی پاک را مدیریت نموده یا سقف‌های اهداف کاهش آلایندگی را ارزیابی فرمایید.
                  </p>
                </div>
                <div className="flex-shrink-0 flex items-center gap-3 bg-white/5 border border-white/10 p-4 rounded-2xl">
                  <div className="text-center">
                    <span className="block text-[10px] text-slate-400">مجموع پروژه‌ها</span>
                    <span className="block text-xl font-bold text-white font-mono">{projects.length} فقره</span>
                  </div>
                  <div className="w-[1px] h-10 bg-white/10" />
                  <div className="text-center">
                    <span className="block text-[10px] text-emerald-400">تکمیل شده</span>
                    <span className="block text-xl font-bold text-emerald-400 font-mono">{completedCount} مورد</span>
                  </div>
                </div>
              </div>

              {/* Status Resource Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* Energy Spent */}
                <div className="p-6 bg-white rounded-2xl border border-slate-200/60 shadow-sm flex items-center justify-between">
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase">بودجه کل پروژه‌های پایداری</span>
                    <h3 className="text-xl font-extrabold text-slate-900 font-mono">
                      {totalBudgetSpent.toLocaleString('fa-IR')}
                      <span className="text-xs font-bold text-slate-400 mr-1 font-sans">ریال</span>
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <span>تخصیص‌یافته کل کشور</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center">
                    <Coins className="w-6 h-6" />
                  </div>
                </div>

                {/* Avg Impact scale */}
                <div className="p-6 bg-white rounded-2xl border border-slate-200/60 shadow-sm flex items-center justify-between">
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase">شاخص بهبود موثر (CO2)</span>
                    <h3 className="text-xl font-extrabold text-slate-900 font-mono">
                      {averageImpactRating}%
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full w-fit">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>۸.۴٪ رشد ماهانه</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
                    <Activity className="w-6 h-6" />
                  </div>
                </div>

                {/* Active Projects */}
                <div className="p-6 bg-white rounded-2xl border border-slate-200/60 shadow-sm flex items-center justify-between">
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase">پروژه‌های در دست اجرا</span>
                    <h3 className="text-xl font-extrabold text-slate-900 font-mono">
                      {activeCount} <span className="text-xs font-bold text-slate-400 font-sans">کمپین فعال</span>
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-slate-400">
                      <span>{projects.filter(p => p.status === 'pending').length} پروژه در صف تایید</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-500 flex items-center justify-center">
                    <FolderKanban className="w-6 h-6" />
                  </div>
                </div>

                {/* Target progress scale */}
                <div className="p-6 bg-white rounded-2xl border border-slate-200/60 shadow-sm flex items-center justify-between">
                  <div className="space-y-2 w-full">
                    <span className="text-[11px] font-bold text-slate-400 uppercase block">تحقق هدف کربن‌صفر سالانه</span>
                    <div className="flex items-baseline gap-1">
                      <h3 className="text-xl font-extrabold text-slate-900 font-mono">۹۶.۲٪</h3>
                      <span className="text-[10px] text-slate-400">۱۲,۱۰۰ از {targetCarbonOffset} کیلو</span>
                    </div>
                    {/* Progress Bar container */}
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mt-1.5">
                      <div className="h-full bg-gradient-to-l from-emerald-500 to-sky-400" style={{ width: '81%' }} />
                    </div>
                  </div>
                </div>

              </div>

              {/* STYLISH INTERACTIVE SVG GRAPHICS PERFORMANCE CHART */}
              <div className="p-6 sm:p-8 bg-white rounded-3xl border border-slate-200/60 shadow-sm space-y-6">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="font-extrabold text-base text-slate-950 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-emerald-500" />
                      <span>نمودار روندهای پایداری بر اساس پایش فصلی (نیمسال اول)</span>
                    </h3>
                    <p className="text-xs text-slate-400 font-medium">ذخیره تجمعی حاصل از عادات تفکیک و سیستم میکرو پنل‌ها</p>
                  </div>
                  {/* Selector Tabs */}
                  <div className="flex gap-2.5">
                    {[
                      { id: 'energySaved', label: 'انرژی (kWh)', color: 'bg-orange-100 text-orange-700 hover:bg-orange-200' },
                      { id: 'wasteReduced', label: 'پسماند (kg)', color: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' },
                      { id: 'waterSaved', label: 'آب (Liters)', color: 'bg-sky-100 text-sky-700 hover:bg-sky-200' }
                    ].map(metric => (
                      <button
                        key={metric.id}
                        onClick={() => {
                          setActiveMetric(metric.id as any);
                          triggerToast(`نمودار به متریک ${metric.label} تغییر یافت.`, 'info');
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                          activeMetric === metric.id 
                            ? 'bg-slate-900 text-white hover:bg-slate-950' 
                            : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {metric.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* SVG Line/Area Chart Construction */}
                <div className="relative pt-4">
                  
                  {/* Metric label */}
                  <div className="absolute top-2 right-2 flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getMetricColor() }} />
                    <span className="text-xs font-bold text-slate-700">{getMetricName()}</span>
                  </div>

                  {/* Responsive SVG Container */}
                  <div className="w-full aspect-[21/9] min-h-[220px]">
                    <svg viewBox="0 0 1000 320" className="w-full h-full overflow-visible">
                      {/* Grid Lines */}
                      <line x1="50" y1="20" x2="950" y2="20" stroke="#f1f5f9" strokeWidth="2" strokeDasharray="4" />
                      <line x1="50" y1="80" x2="950" y2="80" stroke="#f1f5f9" strokeWidth="2" strokeDasharray="4" />
                      <line x1="50" y1="140" x2="950" y2="140" stroke="#f1f5f9" strokeWidth="2" strokeDasharray="4" />
                      <line x1="50" y1="200" x2="950" y2="200" stroke="#f1f5f9" strokeWidth="2" strokeDasharray="4" />
                      <line x1="50" y1="260" x2="950" y2="260" stroke="#f8fafc" strokeWidth="3" />

                      {/* X and Y labels */}
                      <text x="35" y="25" className="fill-slate-400 text-[10px] font-bold font-mono text-left">Max</text>
                      <text x="35" y="145" className="fill-slate-400 text-[10px] font-bold font-mono text-left">50%</text>
                      <text x="35" y="265" className="fill-slate-400 text-[10px] font-bold font-mono text-left">0</text>

                      {/* Data Points and Areas */}
                      {(() => {
                        // Extract points depending on active tab
                        const dataPoints = chartPerformanceData.map(pt => pt[activeMetric]);
                        const maxVal = Math.max(...dataPoints) * 1.15;
                        
                        // Map 6 points to coordinate ranges
                        const pointsCoord = chartPerformanceData.map((pt, index) => {
                          const x = 50 + index * 180;
                          // Height scale range is 20 to 260
                          const relativeHeight = pt[activeMetric] / maxVal;
                          const y = 260 - relativeHeight * 240;
                          return { x, y, value: pt[activeMetric], name: pt.label };
                        });

                        // Make svg path sequence
                        const pathD = pointsCoord.reduce((path, pt, idx) => {
                          return path + `${idx === 0 ? 'M' : 'L'} ${pt.x} ${pt.y} `;
                        }, '');

                        // Area sequence closes to bottom axis
                        const areaD = pathD + `L 950 260 L 50 260 Z`;

                        return (
                          <>
                            {/* Area Gradient with Metric specific color */}
                            <path 
                              d={areaD} 
                              fill={`url(#areaGrad-${activeMetric})`} 
                              className="opacity-25 transition-all duration-500" 
                            />
                            
                            {/* Line path */}
                            <path
                              d={pathD}
                              className="transition-all duration-500"
                              fill="none"
                              stroke={getMetricColor()}
                              strokeWidth="5"
                              strokeLinecap="round"
                            />

                            {/* Node circles and text tags */}
                            {pointsCoord.map((pt, index) => (
                              <g key={index} className="group">
                                <circle
                                  cx={pt.x}
                                  cy={pt.y}
                                  r="7"
                                  fill="#ffffff"
                                  stroke={getMetricColor()}
                                  strokeWidth="3.5"
                                  className="transition-all hover:r-10 cursor-pointer shadow-md"
                                />
                                {/* Value popup text inside chart node */}
                                <text
                                  x={pt.x}
                                  y={pt.y - 15}
                                  textAnchor="middle"
                                  className="fill-slate-800 text-xs font-black font-mono select-none"
                                >
                                  {pt.value.toLocaleString('fa-IR')}
                                </text>
                                {/* X-axis Month names */}
                                <text
                                  x={pt.x}
                                  y="290"
                                  textAnchor="middle"
                                  className="fill-slate-600 text-xs font-bold font-sans"
                                >
                                  {pt.name}
                                </text>
                              </g>
                            ))}

                            {/* Define Gradients */}
                            <defs>
                              <linearGradient id={`areaGrad-${activeMetric}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor={getMetricColor()} stopOpacity="0.8" />
                                <stop offset="100%" stopColor={getMetricColor()} stopOpacity="0.0" />
                              </linearGradient>
                            </defs>
                          </>
                        );
                      })()}
                    </svg>
                  </div>
                </div>

                {/* Additional chart insight */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100/50 flex flex-col sm:flex-row gap-3 justify-between items-center">
                  <span className="text-xs text-slate-500 max-w-lg text-right">
                    💡 <strong>پیشنهاد سیستم ممیزی:</strong> نرخ بهینه‌سازی بر اساس شتاب اردیبهشت الی تیر به اوج رسیده که ناشی از ترغیب محلی به کولرهای استاندارد گرید A و روشنایی خورشیدی معابر بوده است.
                  </span>
                  <div className="flex-shrink-0 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
                    شاخص تراز شبکه: کامپوزیت سبز مطلوب
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 2: PROJECTS MANAGEMENT TABLE */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              
              <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">مدیریت پروژه‌های توسعه و انرژی</h2>
                  <p className="text-xs text-slate-400 font-medium">ایجاد، اصلاح پیشرفت و ابطال پروژه‌های فعال پلتفرم زیست‌مانا</p>
                </div>
                
                <button
                  onClick={openAddModal}
                  className="px-5 py-3 rounded-xl bg-emerald-500 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-500/10 hover:bg-emerald-600 transition-colors cursor-pointer"
                >
                  <Plus className="w-5 h-5 stroke-[2.5]" />
                  <span>ثبت همکار و پروژه جدید</span>
                </button>
              </div>

              {/* Filtering Controls */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm items-center">
                
                {/* Search query box */}
                <div className="relative md:col-span-6">
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-400">
                    <Search className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    placeholder="جستجو در عنوان پروژه، ناظر یا موقعیت جغرافیایی..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-emerald-500 text-right"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="absolute inset-y-0 left-3 flex items-center text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Status select filter */}
                <div className="md:col-span-4 flex items-center gap-2">
                  <span className="text-xs text-slate-400 whitespace-nowrap font-medium">وضعیت پایش:</span>
                  <div className="grid grid-cols-4 gap-1 bg-slate-100 p-1 rounded-xl w-full">
                    {[
                      { id: 'all', label: 'همه' },
                      { id: 'active', label: 'فعال' },
                      { id: 'pending', label: 'صف تایید' },
                      { id: 'completed', label: 'تکمیل' }
                    ].map(st => (
                      <button
                        key={st.id}
                        onClick={() => setStatusFilter(st.id as any)}
                        className={`py-1 px-1 text-[11px] font-bold rounded-lg text-center cursor-pointer transition-colors ${
                          statusFilter === st.id 
                            ? 'bg-white text-slate-950 shadow-sm' 
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Reset filters */}
                <div className="md:col-span-2 flex justify-end">
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setStatusFilter('all');
                      triggerToast('فیلترها بازنشانی شدند.', 'info');
                    }}
                    className="w-full md:w-auto text-xs font-semibold text-slate-500 hover:text-slate-900 border border-slate-200 hover:bg-slate-50 px-4 py-2.5 rounded-xl text-center cursor-pointer"
                  >
                    حذف فیلترها
                  </button>
                </div>

              </div>

              {/* Projects List Database Table */}
              <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-right border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100 text-xs text-slate-400 font-bold uppercase tracking-wider">
                        <th className="py-4.5 px-6 font-bold">بخش و عنوان پروژه</th>
                        <th className="py-4.5 px-6 font-bold">مکان جغرافیایی</th>
                        <th className="py-4.5 px-6 font-bold">پیشرفت فیزیکی</th>
                        <th className="py-4.5 px-6 font-bold">بودجه (ریال)</th>
                        <th className="py-4.5 px-6 font-bold">ناظر علمی</th>
                        <th className="py-4.5 px-6 font-bold">کاهش آند (CO2)</th>
                        <th className="py-4.5 px-6 font-bold text-center">عملیات ادمین</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      {filteredProjects.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-12 text-center text-slate-400 font-medium">
                            هیچ پروژه پایداری متناظر با فیلتر یافته نشد. اصلاح تحقیق بفرستید.
                          </td>
                        </tr>
                      ) : (
                        filteredProjects.map((p) => {
                          
                          // Badge styling
                          const categoryIcons = {
                            energy: '🔋',
                            development: '🌿',
                            lifestyle: '☀️'
                          };

                          const statusStyles = {
                            active: 'bg-emerald-50 border-emerald-100 text-emerald-800',
                            pending: 'bg-amber-50 border-amber-100 text-amber-800',
                            completed: 'bg-sky-50 border-sky-100 text-sky-800'
                          };

                          const statusNames = {
                            active: 'فعال در دست پایش',
                            pending: 'منتظر پایش مالی',
                            completed: 'تکمیل و ارزیابی‌شده'
                          };

                          return (
                            <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                              
                              {/* Title / Info card */}
                              <td className="py-4 px-6">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-base select-none">{categoryIcons[p.category]}</span>
                                    <span className="font-extrabold text-slate-950">{p.title}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className={`px-2 py-0.5 rounded-md border text-[10px] font-bold ${statusStyles[p.status]}`}>
                                      {statusNames[p.status]}
                                    </span>
                                    <span className="text-[10px] text-slate-400 font-mono">شروع: {p.startDate}</span>
                                  </div>
                                </div>
                              </td>

                              {/* Location */}
                              <td className="py-4 px-6 font-medium text-slate-600">
                                {p.location}
                              </td>

                              {/* Progress bar and numeric rate */}
                              <td className="py-4 px-6">
                                <div className="w-36 space-y-1.5">
                                  <div className="flex justify-between items-center text-xs font-semibold text-slate-700">
                                    <span className="font-mono">{p.progress}%</span>
                                  </div>
                                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                    <div 
                                      className={`h-full rounded-full transition-all duration-300 ${
                                        p.progress === 100 
                                          ? 'bg-sky-500' 
                                          : p.progress > 50 
                                          ? 'bg-emerald-500' 
                                          : 'bg-amber-500'
                                      }`} 
                                      style={{ width: `${p.progress}%` }} 
                                    />
                                  </div>
                                </div>
                              </td>

                              {/* Budget */}
                              <td className="py-4 px-6 font-bold text-slate-800 font-mono">
                                {p.budget.toLocaleString('fa-IR')}
                              </td>

                              {/* Supervisor */}
                              <td className="py-4 px-6 text-xs text-slate-500 font-bold">
                                {p.supervisor}
                              </td>

                              {/* Impact factor rating */}
                              <td className="py-4 px-6 font-mono font-extrabold text-emerald-600">
                                {p.impactFactor}% CO2
                              </td>

                              {/* Tool Actions */}
                              <td className="py-4 px-6">
                                <div className="flex items-center justify-center gap-2">
                                  <button
                                    onClick={() => openEditModal(p)}
                                    className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:text-emerald-700 hover:border-emerald-300 hover:bg-emerald-50/50 transition-colors cursor-pointer"
                                    title="ویرایش پروژه"
                                  >
                                    <Edit3 className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteClick(p.id, p.title)}
                                    className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:text-rose-700 hover:border-rose-300 hover:bg-rose-50/50 transition-colors cursor-pointer"
                                    title="حذف پروژه"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>

                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Table meta info bottom */}
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-400 gap-3">
                  <span>نمایش {filteredProjects.length} از {projects.length} پروژه پایش شده</span>
                  <span>پایگاه داده زیست‌مانا فعال و کلاسه شده بر اساس استانداردهای کربن‌صفر</span>
                </div>

              </div>

            </div>
          )}

          {/* TAB 3: SETTINGS / TARGET CO2 OBJECTIVES */}
          {activeTab === 'settings' && (
            <div className="grid md:grid-cols-12 gap-8 items-stretch">
              
              {/* Form profile - 7 columns */}
              <div className="md:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/60 shadow-sm space-y-6">
                <div>
                  <h3 className="font-extrabold text-lg text-slate-950">پیکربندی اهداف سالانه و هویت کاربری ادمین</h3>
                  <p className="text-xs text-slate-400">به‌روزرسانی آستانه هشدارها، اهداف پسماند و مشخصات ارشد پایش</p>
                </div>

                <form onSubmit={(e) => {
                  e.preventDefault();
                  triggerToast('تنظیمات و اهداف سالانه پایداری با موفقیت ذخیره شدند.', 'success');
                }} className="space-y-4">
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-500 block mb-1.5">نام و نام‌خانوادگی مدیر پایش</label>
                      <input
                        type="text"
                        value={adminName}
                        onChange={(e) => setAdminName(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-emerald-500 text-right"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 block mb-1.5">عنوان مسئولیت علمی</label>
                      <input
                        type="text"
                        value={adminRole}
                        onChange={(e) => setAdminRole(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-emerald-500 text-right"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-500 block mb-1.5">نشانی ایمیل اداری ادمین</label>
                    <input
                      type="email"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-emerald-500 text-left font-mono"
                      dir="ltr"
                    />
                  </div>

                  {/* Objective metric slider */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-3">
                    <div className="flex justify-between items-center text-xs font-bold text-slate-800">
                      <label>هدف نهایی جذب سالانه کربن دی‌اکسید (کیلوگرم) </label>
                      <span className="text-emerald-700 font-mono text-xs">{targetCarbonOffset.toLocaleString('fa-IR')} kg</span>
                    </div>
                    <input
                      type="range"
                      min="5000"
                      max="30000"
                      step="500"
                      value={targetCarbonOffset}
                      onChange={(e) => setTargetCarbonOffset(parseInt(e.target.value))}
                      className="w-full accent-emerald-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 font-serif">
                      <span>حداقل ۵۰۰۰ کیلو</span>
                      <span>تولید توان بالا ۳۰۰۰۰ کیلو</span>
                    </div>
                  </div>

                  {/* Notification toggle */}
                  <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
                    <div>
                      <span className="text-sm font-bold text-slate-800 block">ارسال هشدار به ایمیل در رویدادهای بحرانی آلایندگی</span>
                      <span className="text-xs text-slate-400 block">هنگامی که سهم برق تولیدی فسیلی شهر فراتر از محدوده‌های ایمن مجاز رود</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAlertsEnabled(!alertsEnabled)}
                      className={`w-12 h-7 rounded-full flex items-center p-0.5 transition-all cursor-pointer ${
                        alertsEnabled ? 'bg-emerald-500 justify-start' : 'bg-slate-300 justify-end'
                      }`}
                    >
                      <div className="w-6 h-6 rounded-full bg-white shadow" />
                    </button>
                  </div>

                  <div className="pt-4 border-t border-slate-100">
                    <button
                      type="submit"
                      className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors cursor-pointer"
                    >
                      ثبت نهایی تنظیمات و اهداف
                    </button>
                  </div>

                </form>

              </div>

              {/* Info Column - 5 columns */}
              <div className="md:col-span-4 bg-slate-900 text-white p-6 sm:p-8 rounded-3xl dark-glass-panel border border-slate-850 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20 mb-6">
                    <Award className="w-5 h-5" />
                  </div>
                  
                  <h4 className="font-bold text-slate-100 text-base mb-3">بیانیه استاندارد کربن‌صفر ملی</h4>
                  <p className="text-xs leading-relaxed text-slate-400 text-justify">
                    پلتفرم زیست‌مانا به عنوان بدنه پایش هوشمند با هدف‌گذاری نهایی برای سال ۱۴۱۰، همسو با پروتکل‌های حفاظت از اوزون و محیط‌های فشرده جنگلی بومی تلاش می‌نماید. 
                    <br /><br />
                    هرگاه شما آستانه‌های اهداف کربن دی‌اکسید را تغییر دهید، سیستم محاسباتی لندینگ برای نمایش راندمان عمومی کاربران، ملاک‌های ارزیابی را با این متغیر تطبیق خواهد داد.
                  </p>
                </div>

                <div className="pt-6 border-t border-slate-800/80 mt-6 md:mt-0">
                  <span className="text-[10px] text-slate-500 block font-mono">آخرین امضای دیجیتال ناظر:</span>
                  <span className="text-xs text-emerald-400 font-bold font-sans mt-1 block">دروازه پایش سبز - امین احمدی</span>
                </div>
              </div>

            </div>
          )}

        </div>

      </main>

      {/* CREATE / EDIT ECO PROJECT MODAL */}
      <AnimatePresence>
        {isAddModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
            dir="rtl"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden"
            >
              <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-extrabold text-slate-950 text-base flex items-center gap-1.5">
                  <Sparkles className="w-5 h-5 text-emerald-500" />
                  <span>{projectToEdit ? 'ویرایش پروژه زیست‌محیطی' : 'ثبت پروژه پایدار جدید'}</span>
                </h3>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-1 px-2.5 bg-slate-200/50 hover:bg-slate-200 text-slate-700 rounded-lg text-xs"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleModalSubmit} className="p-6 space-y-4">
                
                {/* 1. Title */}
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">عنوان پروژه پایداری *</label>
                  <input
                    type="text"
                    required
                    placeholder="طراحی سایه‌بان‌های خورشیدی یا ممیزی..."
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-emerald-500 text-right"
                  />
                </div>

                {/* 2. Category & Status */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 block mb-1">دسته‌بندی موضوعی</label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value as any)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-emerald-500 bg-white"
                    >
                      <option value="energy">🔋 مدیریت انرژی پاک</option>
                      <option value="development">🌿 توسعه پایدار سبز</option>
                      <option value="lifestyle">☀️ اصلاح سبک زندگی</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 block mb-1">وضعیت کنونی اجرا</label>
                    <select
                      value={formStatus}
                      onChange={(e) => setFormStatus(e.target.value as any)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-emerald-500 bg-white"
                    >
                      <option value="pending">⏳ منتظر تایید ادمین</option>
                      <option value="active">⚡ در دست پایش مستقل</option>
                      <option value="completed">✅ تکمیل و نتیجه‌گیری شده</option>
                    </select>
                  </div>
                </div>

                {/* 3. Progress and Carbon Impact */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 block mb-1">میزان پیشرفت فیزیکی ({formProgress}%)</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={formProgress}
                      onChange={(e) => setFormProgress(Number(e.target.value))}
                      className="w-full accent-emerald-500 mt-2 cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 block mb-1">نرخ مهار کربن ({formImpact}%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formImpact}
                      onChange={(e) => setFormImpact(Number(e.target.value))}
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-emerald-500 text-right font-mono"
                    />
                  </div>
                </div>

                {/* 4. Budget */}
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">بودجه تخصیصی (دولتی یا خصوصی - ریال) *</label>
                  <input
                    type="number"
                    required
                    value={formBudget}
                    onChange={(e) => setFormBudget(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-emerald-500 text-right font-mono"
                  />
                </div>

                {/* 5. Location and Supervisor */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 block mb-1">محل جغرافیایی اجرای پروژه *</label>
                    <input
                      type="text"
                      required
                      placeholder="پارکینگ مرکزی، شهرک باختر..."
                      value={formLocation}
                      onChange={(e) => setFormLocation(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-emerald-500 text-right"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 block mb-1">ناظر علمی ارشد پایش *</label>
                    <input
                      type="text"
                      required
                      value={formSupervisor}
                      onChange={(e) => setFormSupervisor(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-emerald-500 text-right"
                    />
                  </div>
                </div>

                {/* Submitting buttons */}
                <div className="pt-4 border-t border-slate-100 flex justify-end gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500 transition-colors font-bold cursor-pointer"
                  >
                    انصراف
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>ذخیره پروژه پایداری</span>
                  </button>
                </div>

              </form>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
