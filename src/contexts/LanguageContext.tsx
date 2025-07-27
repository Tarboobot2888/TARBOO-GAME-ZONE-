"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type Language = "ar" | "en"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
  dir: "rtl" | "ltr"
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}

interface LanguageProviderProps {
  children: ReactNode
}

// Translation dictionary
const translations = {
  ar: {
    // Navigation
    home: "الرئيسية",
    recharge: "شحن الألعاب",
    buyAccounts: "شراء حسابات",
    login: "تسجيل الدخول",
    register: "إنشاء حساب",
    logout: "تسجيل الخروج",
    dashboard: "لوحة التحكم",
    profile: "الملف الشخصي",
    cart: "السلة",
    support: "الدعم الفني",

    // Common
    loading: "جاري التحميل...",
    error: "خطأ",
    success: "نجح",
    warning: "تحذير",
    info: "معلومات",
    save: "حفظ",
    cancel: "إلغاء",
    delete: "حذف",
    edit: "تعديل",
    add: "إضافة",
    search: "بحث",
    filter: "فلترة",
    sort: "ترتيب",

    // Games
    fifa: "فيفا موبايل",
    pubg: "ببجي موبايل",
    freefire: "فري فاير",
    cod: "كول أوف ديوتي",
    pes: "بيس موبايل",

    // Currency
    egp: "جنيه مصري",
    price: "السعر",
    total: "الإجمالي",

    // Auth
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    confirmPassword: "تأكيد كلمة المرور",
    displayName: "الاسم",
    rememberMe: "تذكرني",
    forgotPassword: "نسيت كلمة المرور؟",

    // Messages
    welcomeMessage: "مرحباً بك في GameZone",
    loginSuccess: "تم تسجيل الدخول بنجاح",
    logoutSuccess: "تم تسجيل الخروج بنجاح",
    registerSuccess: "تم إنشاء الحساب بنجاح",

    // Errors
    invalidEmail: "البريد الإلكتروني غير صحيح",
    weakPassword: "كلمة المرور ضعيفة",
    passwordMismatch: "كلمات المرور غير متطابقة",
    userNotFound: "المستخدم غير موجود",
    wrongPassword: "كلمة المرور غير صحيحة",

    // Features
    instantRecharge: "شحن فوري",
    securePayment: "دفع آمن",
    support24_7: "دعم 24/7",
    highQuality: "جودة عالية",

    // Footer
    aboutUs: "من نحن",
    contactUs: "اتصل بنا",
    privacy: "سياسة الخصوصية",
    terms: "شروط الاستخدام",
    faq: "الأسئلة الشائعة",

    // Admin
    adminPanel: "لوحة الإدارة",
    users: "المستخدمين",
    orders: "الطلبات",
    accounts: "الحسابات",
    analytics: "الإحصائيات",
    settings: "الإعدادات",
  },
  en: {
    // Navigation
    home: "Home",
    recharge: "Game Recharge",
    buyAccounts: "Buy Accounts",
    login: "Login",
    register: "Register",
    logout: "Logout",
    dashboard: "Dashboard",
    profile: "Profile",
    cart: "Cart",
    support: "Support",

    // Common
    loading: "Loading...",
    error: "Error",
    success: "Success",
    warning: "Warning",
    info: "Info",
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    add: "Add",
    search: "Search",
    filter: "Filter",
    sort: "Sort",

    // Games
    fifa: "FIFA Mobile",
    pubg: "PUBG Mobile",
    freefire: "Free Fire",
    cod: "Call of Duty",
    pes: "PES Mobile",

    // Currency
    egp: "Egyptian Pound",
    price: "Price",
    total: "Total",

    // Auth
    email: "Email",
    password: "Password",
    confirmPassword: "Confirm Password",
    displayName: "Display Name",
    rememberMe: "Remember Me",
    forgotPassword: "Forgot Password?",

    // Messages
    welcomeMessage: "Welcome to GameZone",
    loginSuccess: "Login successful",
    logoutSuccess: "Logout successful",
    registerSuccess: "Registration successful",

    // Errors
    invalidEmail: "Invalid email",
    weakPassword: "Weak password",
    passwordMismatch: "Passwords don't match",
    userNotFound: "User not found",
    wrongPassword: "Wrong password",

    // Features
    instantRecharge: "Instant Recharge",
    securePayment: "Secure Payment",
    support24_7: "24/7 Support",
    highQuality: "High Quality",

    // Footer
    aboutUs: "About Us",
    contactUs: "Contact Us",
    privacy: "Privacy Policy",
    terms: "Terms of Service",
    faq: "FAQ",

    // Admin
    adminPanel: "Admin Panel",
    users: "Users",
    orders: "Orders",
    accounts: "Accounts",
    analytics: "Analytics",
    settings: "Settings",
  },
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem("language")
    return (saved as Language) || "ar"
  })

  useEffect(() => {
    localStorage.setItem("language", language)
    document.documentElement.lang = language
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr"
  }, [language])

  const t = (key: string): string => {
    return translations[language][key as keyof (typeof translations)[typeof language]] || key
  }

  const dir = language === "ar" ? "rtl" : "ltr"

  const value: LanguageContextType = {
    language,
    setLanguage,
    t,
    dir,
  }

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}
