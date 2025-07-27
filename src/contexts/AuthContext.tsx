"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import {
  type User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInAnonymously,
  sendPasswordResetEmail,
  updateProfile,
  sendEmailVerification,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth"
import { doc, setDoc, getDoc, updateDoc, serverTimestamp, increment } from "firebase/firestore"
import { auth, db } from "../firebase/config"
import { logActivity, logUserAction } from "../services/analytics"
import { sendWelcomeEmail, sendLoginAlert } from "../services/emailService"

interface UserData {
  uid: string
  email: string
  displayName: string
  photoURL?: string
  role: "user" | "admin" | "moderator"
  isVerified: boolean
  createdAt: any
  lastLogin: any
  totalSpent: number
  totalOrders: number
  referralCode: string
  referredBy?: string
  isBlocked: boolean
  preferences: {
    language: "ar" | "en"
    theme: "light" | "dark" | "auto"
    notifications: {
      email: boolean
      push: boolean
      sms: boolean
    }
    currency: "EGP" | "USD"
  }
  profile: {
    phone?: string
    address?: string
    dateOfBirth?: string
    gender?: "male" | "female"
    favoriteGames: string[]
  }
  stats: {
    loginCount: number
    lastActiveAt: any
    deviceInfo: string
    ipAddress?: string
  }
  wallet: {
    balance: number
    transactions: any[]
  }
  loyalty: {
    points: number
    level: "bronze" | "silver" | "gold" | "platinum"
    tier: number
  }
}

interface AuthContextType {
  currentUser: User | null
  userData: UserData | null
  loading: boolean
  isGuest: boolean
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>
  register: (email: string, password: string, displayName: string, referralCode?: string) => Promise<void>
  logout: () => Promise<void>
  loginWithGoogle: () => Promise<void>
  loginWithGithub: () => Promise<void>
  loginAsGuest: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  updateUserProfile: (data: Partial<UserData>) => Promise<void>
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>
  deleteAccount: () => Promise<void>
  resendVerificationEmail: () => Promise<void>
  isAdmin: boolean
  isModerator: boolean
  refreshUserData: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [isGuest, setIsGuest] = useState(false)

  const generateReferralCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase()
  }

  const getDeviceInfo = () => {
    return {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      cookieEnabled: navigator.cookieEnabled,
      onLine: navigator.onLine,
      screen: {
        width: screen.width,
        height: screen.height,
        colorDepth: screen.colorDepth,
      },
    }
  }

  const createUserDocument = async (user: User, additionalData: any = {}) => {
    const userRef = doc(db, "users", user.uid)
    const userDoc = await getDoc(userRef)

    if (!userDoc.exists()) {
      const userData: UserData = {
        uid: user.uid,
        email: user.email || "",
        displayName: user.displayName || "مستخدم جديد",
        photoURL: user.photoURL || "",
        role: "user",
        isVerified: user.emailVerified,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
        totalSpent: 0,
        totalOrders: 0,
        referralCode: generateReferralCode(),
        isBlocked: false,
        preferences: {
          language: "ar",
          theme: "auto",
          notifications: {
            email: true,
            push: true,
            sms: false,
          },
          currency: "EGP",
        },
        profile: {
          favoriteGames: [],
        },
        stats: {
          loginCount: 1,
          lastActiveAt: serverTimestamp(),
          deviceInfo: JSON.stringify(getDeviceInfo()),
        },
        wallet: {
          balance: 0,
          transactions: [],
        },
        loyalty: {
          points: 100, // Welcome bonus
          level: "bronze",
          tier: 1,
        },
        ...additionalData,
      }

      await setDoc(userRef, userData)
      setUserData(userData)

      // Send welcome email
      if (user.email && !user.isAnonymous) {
        await sendWelcomeEmail(user.email, userData.displayName)
      }

      // Log registration
      await logUserAction(user.uid, "user_registered", {
        method: additionalData.signInMethod || "email",
        referralCode: additionalData.referredBy,
      })
    } else {
      const data = userDoc.data() as UserData

      // Update login stats
      await updateDoc(userRef, {
        lastLogin: serverTimestamp(),
        "stats.loginCount": increment(1),
        "stats.lastActiveAt": serverTimestamp(),
        "stats.deviceInfo": JSON.stringify(getDeviceInfo()),
      })

      setUserData({ ...data, lastLogin: serverTimestamp() })

      // Send login alert if suspicious activity
      const deviceInfo = getDeviceInfo()
      const lastDeviceInfo = data.stats?.deviceInfo ? JSON.parse(data.stats.deviceInfo) : null

      if (lastDeviceInfo && lastDeviceInfo.platform !== deviceInfo.platform) {
        await sendLoginAlert(user.email!, {
          device: deviceInfo.platform,
          location: "Unknown", // You can integrate with IP geolocation service
          time: new Date().toLocaleString("ar-EG"),
        })
      }
    }
  }

  const login = async (email: string, password: string, rememberMe = false) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password)
      await createUserDocument(result.user, { signInMethod: "email" })

      // Log login activity
      await logActivity("user_login", {
        userId: result.user.uid,
        email: result.user.email,
        timestamp: new Date(),
        userAgent: navigator.userAgent,
        rememberMe,
      })

      if (rememberMe) {
        localStorage.setItem("rememberMe", "true")
      }

      setIsGuest(false)
    } catch (error: any) {
      throw new Error(getErrorMessage(error.code))
    }
  }

  const register = async (email: string, password: string, displayName: string, referralCode?: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(result.user, { displayName })

      const additionalData: any = { signInMethod: "email" }
      if (referralCode) {
        additionalData.referredBy = referralCode
        // Award referral bonus to referrer
        await awardReferralBonus(referralCode)
      }

      await createUserDocument(result.user, additionalData)
      await sendEmailVerification(result.user)

      // Log registration activity
      await logActivity("user_register", {
        userId: result.user.uid,
        email: result.user.email,
        displayName,
        referralCode,
        timestamp: new Date(),
      })

      setIsGuest(false)
    } catch (error: any) {
      throw new Error(getErrorMessage(error.code))
    }
  }

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider()
      provider.addScope("email")
      provider.addScope("profile")

      const result = await signInWithPopup(auth, provider)
      await createUserDocument(result.user, { signInMethod: "google" })

      await logActivity("user_login_google", {
        userId: result.user.uid,
        email: result.user.email,
        timestamp: new Date(),
      })

      setIsGuest(false)
    } catch (error: any) {
      throw new Error(getErrorMessage(error.code))
    }
  }

  const loginWithGithub = async () => {
    try {
      const provider = new GithubAuthProvider()
      provider.addScope("user:email")

      const result = await signInWithPopup(auth, provider)
      await createUserDocument(result.user, { signInMethod: "github" })

      await logActivity("user_login_github", {
        userId: result.user.uid,
        email: result.user.email,
        timestamp: new Date(),
      })

      setIsGuest(false)
    } catch (error: any) {
      throw new Error(getErrorMessage(error.code))
    }
  }

  const loginAsGuest = async () => {
    try {
      const result = await signInAnonymously(auth)
      await createUserDocument(result.user, {
        signInMethod: "anonymous",
        displayName: "زائر",
        role: "user",
      })

      await logActivity("user_login_guest", {
        userId: result.user.uid,
        timestamp: new Date(),
      })

      setIsGuest(true)
    } catch (error: any) {
      throw new Error(getErrorMessage(error.code))
    }
  }

  const logout = async () => {
    try {
      if (currentUser) {
        await logActivity("user_logout", {
          userId: currentUser.uid,
          timestamp: new Date(),
        })
      }

      localStorage.removeItem("rememberMe")
      await signOut(auth)
      setUserData(null)
      setIsGuest(false)
    } catch (error: any) {
      throw new Error("فشل في تسجيل الخروج")
    }
  }

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email, {
        url: `${window.location.origin}/login`,
        handleCodeInApp: false,
      })
    } catch (error: any) {
      throw new Error(getErrorMessage(error.code))
    }
  }

  const changePassword = async (currentPassword: string, newPassword: string) => {
    if (!currentUser || !currentUser.email) {
      throw new Error("المستخدم غير مسجل الدخول")
    }

    try {
      const credential = EmailAuthProvider.credential(currentUser.email, currentPassword)
      await reauthenticateWithCredential(currentUser, credential)
      await updatePassword(currentUser, newPassword)

      await logUserAction(currentUser.uid, "password_changed", {})
    } catch (error: any) {
      throw new Error(getErrorMessage(error.code))
    }
  }

  const updateUserProfile = async (data: Partial<UserData>) => {
    if (!currentUser) return

    try {
      const userRef = doc(db, "users", currentUser.uid)
      await updateDoc(userRef, {
        ...data,
        updatedAt: serverTimestamp(),
      })

      if (userData) {
        setUserData({ ...userData, ...data })
      }

      await logUserAction(currentUser.uid, "profile_updated", { fields: Object.keys(data) })
    } catch (error: any) {
      throw new Error("فشل في تحديث الملف الشخصي")
    }
  }

  const deleteAccount = async () => {
    if (!currentUser) return

    try {
      // Mark account as deleted in Firestore
      const userRef = doc(db, "users", currentUser.uid)
      await updateDoc(userRef, {
        isDeleted: true,
        deletedAt: serverTimestamp(),
      })

      await logUserAction(currentUser.uid, "account_deleted", {})

      // Delete the user account
      await currentUser.delete()

      setUserData(null)
      setIsGuest(false)
    } catch (error: any) {
      throw new Error("فشل في حذف الحساب")
    }
  }

  const resendVerificationEmail = async () => {
    if (!currentUser) return

    try {
      await sendEmailVerification(currentUser)
    } catch (error: any) {
      throw new Error("فشل في إرسال بريد التحقق")
    }
  }

  const refreshUserData = async () => {
    if (!currentUser) return

    try {
      const userRef = doc(db, "users", currentUser.uid)
      const userDoc = await getDoc(userRef)

      if (userDoc.exists()) {
        setUserData(userDoc.data() as UserData)
      }
    } catch (error) {
      console.error("Error refreshing user data:", error)
    }
  }

  const awardReferralBonus = async (referralCode: string) => {
    try {
      // Find user with referral code
      // This would require a Firestore query or Cloud Function
      // For now, we'll implement a basic version
      console.log("Awarding referral bonus for code:", referralCode)
    } catch (error) {
      console.error("Error awarding referral bonus:", error)
    }
  }

  const getErrorMessage = (errorCode: string): string => {
    switch (errorCode) {
      case "auth/user-not-found":
        return "المستخدم غير موجود"
      case "auth/wrong-password":
        return "كلمة المرور غير صحيحة"
      case "auth/email-already-in-use":
        return "البريد الإلكتروني مستخدم بالفعل"
      case "auth/weak-password":
        return "كلمة المرور ضعيفة جداً"
      case "auth/invalid-email":
        return "البريد الإلكتروني غير صحيح"
      case "auth/too-many-requests":
        return "محاولات كثيرة، حاول مرة أخرى لاحقاً"
      case "auth/network-request-failed":
        return "خطأ في الاتصال بالإنترنت"
      case "auth/user-disabled":
        return "تم تعطيل هذا الحساب"
      case "auth/requires-recent-login":
        return "يجب إعادة تسجيل الدخول لإجراء هذا التغيير"
      case "auth/popup-closed-by-user":
        return "تم إغلاق نافذة تسجيل الدخول"
      case "auth/cancelled-popup-request":
        return "تم إلغاء طلب تسجيل الدخول"
      default:
        return "حدث خطأ غير متوقع"
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user)
        setIsGuest(user.isAnonymous)
        await createUserDocument(user)
      } else {
        setCurrentUser(null)
        setUserData(null)
        setIsGuest(false)
      }
      setLoading(false)
    })

    return unsubscribe
  }, [])

  // Auto-refresh user data every 5 minutes
  useEffect(() => {
    if (currentUser && !isGuest) {
      const interval = setInterval(refreshUserData, 5 * 60 * 1000)
      return () => clearInterval(interval)
    }
  }, [currentUser, isGuest])

  const isAdmin = userData?.role === "admin"
  const isModerator = userData?.role === "moderator" || isAdmin

  const value: AuthContextType = {
    currentUser,
    userData,
    loading,
    isGuest,
    login,
    register,
    logout,
    loginWithGoogle,
    loginWithGithub,
    loginAsGuest,
    resetPassword,
    updateUserProfile,
    changePassword,
    deleteAccount,
    resendVerificationEmail,
    isAdmin,
    isModerator,
    refreshUserData,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
