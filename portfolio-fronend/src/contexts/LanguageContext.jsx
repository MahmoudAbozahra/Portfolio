import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const translations = {
  en: {
    languageName: 'English',
    switchLanguage: 'AR',
    loading: 'Loading...',
    loadingPortfolio: 'Loading Portfolio...',
    loadingPortfolioHint: 'Please wait while we fetch your data',
    navProfile: 'Profile',
    navExperience: 'Experience',
    navProjects: 'Projects',
    navSkills: 'Skills',
    navEducation: 'Education',
    navContact: 'Contact',
    openAdmin: 'Open Admin Panel',
    closeAdmin: 'Close Admin',
    profile: 'Profile',
    keyStrengths: 'Key strengths:',
    experience: 'Experience',
    projects: 'Projects',
    skillsTitle: 'Technical expertise and professional skills',
    educationKicker: 'Education',
    educationTitle: 'Academic background and training',
    training: 'Training',
    languages: 'Languages',
    contact: 'Contact',
    contactTitle: 'Open to backend and Django-based product roles',
    contactHeadline: 'Let’s build something dependable.',
    contactSupport: 'For backend, full-stack, ERP, and industrial systems opportunities.',
    sendEmail: 'Send an email',
    contactMe: 'Contact Me',
    viewResume: 'View Resume',
    email: 'Email',
    phone: 'Phone',
    location: 'Location',
    allRightsReserved: 'All rights reserved.',
    backToHome: 'Back to Home',
    adminLogin: 'Admin Login',
    adminLoginHint: 'Enter your credentials to access the admin panel',
    usernameOrEmail: 'Username or Email',
    usernameOrEmailPlaceholder: 'Enter username or email',
    password: 'Password',
    passwordPlaceholder: 'Enter password',
    login: 'Login',
    loggingIn: 'Logging in...',
    invalidLogin: 'Invalid username or password',
    clickToExpand: 'Click to expand',
    noImagesUploaded: 'No images uploaded',
    previousProject: 'Previous project',
    nextProject: 'Next project',
    previousImage: 'Previous image',
    nextImage: 'Next image',
    previousFullImage: 'Previous full-size image',
    nextFullImage: 'Next full-size image',
    closeModal: 'Close modal',
    projectImagePreview: 'Project image preview'
  },
  ar: {
    languageName: 'العربية',
    switchLanguage: 'EN',
    loading: 'جاري التحميل...',
    loadingPortfolio: 'جاري تحميل البورتفوليو...',
    loadingPortfolioHint: 'برجاء الانتظار أثناء تحميل البيانات',
    navProfile: 'النبذة',
    navExperience: 'الخبرة',
    navProjects: 'المشاريع',
    navSkills: 'المهارات',
    navEducation: 'التعليم',
    navContact: 'التواصل',
    openAdmin: 'فتح لوحة الإدارة',
    closeAdmin: 'إغلاق لوحة الإدارة',
    profile: 'النبذة',
    keyStrengths: 'نقاط القوة:',
    experience: 'الخبرة',
    projects: 'المشاريع',
    skillsTitle: 'الخبرات التقنية والمهارات المهنية',
    educationKicker: 'التعليم',
    educationTitle: 'الخلفية الأكاديمية والتدريب',
    training: 'التدريب',
    languages: 'اللغات',
    contact: 'التواصل',
    contactTitle: 'متاح لأدوار الباك إند والمنتجات المبنية على Django',
    contactHeadline: 'لنبنِ شيئًا يمكن الاعتماد عليه.',
    contactSupport: 'لفرص الباك إند والـ Full Stack وأنظمة ERP والأنظمة الصناعية.',
    sendEmail: 'إرسال بريد',
    contactMe: 'تواصل معي',
    viewResume: 'عرض السيرة الذاتية',
    email: 'البريد الإلكتروني',
    phone: 'الهاتف',
    location: 'الموقع',
    allRightsReserved: 'جميع الحقوق محفوظة.',
    backToHome: 'العودة للرئيسية',
    adminLogin: 'تسجيل دخول الأدمن',
    adminLoginHint: 'أدخل بياناتك للدخول إلى لوحة الإدارة',
    usernameOrEmail: 'اسم المستخدم أو البريد',
    usernameOrEmailPlaceholder: 'أدخل اسم المستخدم أو البريد',
    password: 'كلمة المرور',
    passwordPlaceholder: 'أدخل كلمة المرور',
    login: 'دخول',
    loggingIn: 'جاري الدخول...',
    invalidLogin: 'اسم المستخدم أو كلمة المرور غير صحيحة',
    clickToExpand: 'اضغط للتكبير',
    noImagesUploaded: 'لا توجد صور مرفوعة',
    previousProject: 'المشروع السابق',
    nextProject: 'المشروع التالي',
    previousImage: 'الصورة السابقة',
    nextImage: 'الصورة التالية',
    previousFullImage: 'الصورة المكبرة السابقة',
    nextFullImage: 'الصورة المكبرة التالية',
    closeModal: 'إغلاق',
    projectImagePreview: 'معاينة صورة المشروع'
  }
};

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }

  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('portfolioLanguage') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('portfolioLanguage', language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const value = useMemo(() => {
    const t = (key) => translations[language][key] || translations.en[key] || key;

    return {
      language,
      isArabic: language === 'ar',
      setLanguage,
      toggleLanguage: () => setLanguage((current) => (current === 'ar' ? 'en' : 'ar')),
      t
    };
  }, [language]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
