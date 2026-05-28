/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BlogItem, EcoProject, ChartDataPoint } from '../types';

export const initialBlogs: BlogItem[] = [
  {
    id: 'blog-1',
    title: 'چگونه مصرف برق خانگی خود را ۵۰٪ کاهش دهیم؟',
    excerpt: 'با چند راهکار ساده مانند استفاده از پریزهای هوشمند، بازبینی عایق‌بندی درب و پنجره‌ها و مدیریت ساعات پیک مصرف، نقش بزرگی در پایداری زمین ایفا کنیم.',
    image: 'https://images.unsplash.com/photo-1548549443-bf4bbafd6d4d?auto=format&fit=crop&q=80&w=800',
    category: 'انرژی پاک',
    readTime: '۴ دقیقه مطالعه',
    date: '۷ خرداد ۱۴۰۵',
    views: 312
  },
  {
    id: 'blog-2',
    title: 'توسعه پایدار شهری: الگوهای موفق جهانی',
    excerpt: 'بررسی شهرهایی که با اولویت‌دهی به حمل‌ونقل عمومی الکتریکی، ایجاد سقف‌های سبز و استفاده از منابع متمرکز خورشیدی به اهداف کربن‌صفر رسیده‌اند.',
    image: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&q=80&w=800',
    category: 'توسعه سبز',
    readTime: '۶ دقیقه مطالعه',
    date: '۲ خرداد ۱۴۰۵',
    views: 245
  },
  {
    id: 'blog-3',
    title: 'راهنمای گام‌به‌گام زندگی بدون پسماند (Zero Waste)',
    excerpt: 'چگونه خریدهای آگاهانه، تفکیک زباله از مبدأ، تهیه کود کمپوست از پسماند تر و جایگزینی کیسه‌های پارچه‌ای می‌تواند تولید پسماند شما را به حداقل برساند.',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800',
    category: 'سبک زندگی',
    readTime: '۵ دقیقه مطالعه',
    date: '۲۸ اردیبهشت ۱۴۰۵',
    views: 418
  }
];

export const initialProjects: EcoProject[] = [
  {
    id: 'p-1',
    title: 'سایه‌بان‌های خورشیدی پارکینگ مرکزی',
    category: 'energy',
    status: 'active',
    progress: 75,
    budget: 450000000, // Rial / monetary unit
    impactFactor: 88, // 88% effective CO2 reduction
    location: 'پردیس فناوری تهران',
    startDate: '۱۴۰۴/۱۰/۱۵',
    supervisor: 'مهندس سهرابی'
  },
  {
    id: 'p-2',
    title: 'توسعه ناوگان دوچرخه‌های اشتراکی برقی',
    category: 'lifestyle',
    status: 'active',
    progress: 40,
    budget: 280000000,
    impactFactor: 64,
    location: 'منطقه ۶ شهرداری',
    startDate: '۱۴۰۵/۰۱/۲۰',
    supervisor: 'دکتر علوی'
  },
  {
    id: 'p-3',
    title: 'سیستم هوشمند بازیافت و تفکیک خودکار پسماند',
    category: 'development',
    status: 'completed',
    progress: 100,
    budget: 620000000,
    impactFactor: 92,
    location: 'فاز ۳ شهرک صنعتی',
    startDate: '۱۴۰۴/۰۴/۰۵',
    supervisor: 'خانم مهندس راد'
  },
  {
    id: 'p-4',
    title: 'پویش کاشت ۵۰۰۰ نهال بومی ماندگار',
    category: 'lifestyle',
    status: 'completed',
    progress: 100,
    budget: 85000000,
    impactFactor: 78,
    location: 'کمربند سبز باختر',
    startDate: '۱۴۰۴/۱۱/۱۲',
    supervisor: 'مهندس علیزاده'
  },
  {
    id: 'p-5',
    title: 'ممیزی انرژی برج‌های اداری تجاری شمال شهر',
    category: 'energy',
    status: 'pending',
    progress: 5,
    budget: 150000000,
    impactFactor: 42,
    location: 'برج صبا',
    startDate: '۱۴۰۵/۰۳/۰۱',
    supervisor: 'دکتر اکبری'
  }
];

export const chartPerformanceData: ChartDataPoint[] = [
  { label: 'فروردین', energySaved: 1200, wasteReduced: 320, waterSaved: 4500 },
  { label: 'اردیبهشت', energySaved: 1650, wasteReduced: 460, waterSaved: 5900 },
  { label: 'خرداد', energySaved: 2100, wasteReduced: 580, waterSaved: 7800 },
  { label: 'تیر', energySaved: 2800, wasteReduced: 720, waterSaved: 9500 },
  { label: 'مرداد', energySaved: 3200, wasteReduced: 860, waterSaved: 12100 },
  { label: 'شهریور', energySaved: 2900, wasteReduced: 790, waterSaved: 10200 }
];
