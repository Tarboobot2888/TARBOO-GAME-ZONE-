import { collection, addDoc, serverTimestamp, doc, updateDoc, increment, getDoc } from "firebase/firestore"
import { db } from "../firebase/config"

export interface AnalyticsEvent {
  action: string
  category: string
  label?: string
  value?: number
  userId?: string
  sessionId?: string
  timestamp: any
  metadata?: any
}

// Helper function to clean objects by removing undefined values
const cleanObject = (obj: any): any => {
  if (obj === null || obj === undefined) {
    return {}
  }

  if (typeof obj !== "object") {
    return obj
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => cleanObject(item)).filter((item) => item !== undefined)
  }

  const cleaned: any = {}
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined && value !== null) {
      if (typeof value === "object") {
        const cleanedValue = cleanObject(value)
        if (Object.keys(cleanedValue).length > 0 || Array.isArray(cleanedValue)) {
          cleaned[key] = cleanedValue
        }
      } else {
        cleaned[key] = value
      }
    }
  }
  return cleaned
}

export const logActivity = async (action: string, data: any) => {
  try {
    if (!action || typeof action !== "string") {
      console.warn("Invalid action parameter for logActivity")
      return
    }

    // Clean data to remove undefined values
    const cleanData = cleanObject(data)

    await addDoc(collection(db, "analytics"), {
      action,
      data: cleanData,
      timestamp: serverTimestamp(),
      userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
      url: typeof window !== "undefined" ? window.location.href : "",
      referrer: typeof document !== "undefined" ? document.referrer : "",
      sessionId: getSessionId(),
    })
  } catch (error) {
    console.error("Error logging activity:", error)
  }
}

export const logUserAction = async (userId: string, action: string, data: any) => {
  try {
    // Only proceed if userId is valid
    if (!userId || typeof userId !== "string" || userId.trim() === "") {
      console.warn("Cannot log user action: userId is invalid")
      return
    }

    if (!action || typeof action !== "string") {
      console.warn("Cannot log user action: action is invalid")
      return
    }

    // Clean data to remove undefined values
    const cleanData = cleanObject(data)

    await addDoc(collection(db, "userActions"), {
      userId,
      action,
      data: cleanData,
      timestamp: serverTimestamp(),
      userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
      url: typeof window !== "undefined" ? window.location.href : "",
      sessionId: getSessionId(),
    })

    // Update user activity stats
    const userRef = doc(db, "users", userId)
    await updateDoc(userRef, {
      "stats.lastActiveAt": serverTimestamp(),
      [`stats.actions.${action}`]: increment(1),
    })
  } catch (error) {
    console.error("Error logging user action:", error)
  }
}

export const logPageView = async (page: string, userId?: string) => {
  try {
    if (!page || typeof page !== "string") {
      console.warn("Invalid page parameter for logPageView")
      return
    }

    const pageViewData: any = {
      page,
      timestamp: serverTimestamp(),
      userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
      referrer: typeof document !== "undefined" ? document.referrer : "",
      sessionId: getSessionId(),
      viewport:
        typeof window !== "undefined"
          ? {
              width: window.innerWidth,
              height: window.innerHeight,
            }
          : {},
    }

    // Only add userId if it's defined and valid
    if (userId && typeof userId === "string" && userId.trim() !== "") {
      pageViewData.userId = userId
    }

    await addDoc(collection(db, "pageViews"), pageViewData)

    // Update daily stats
    const today = new Date().toISOString().split("T")[0]
    const statsRef = doc(db, "dailyStats", today)

    try {
      await updateDoc(statsRef, {
        pageViews: increment(1),
        [`pages.${page}`]: increment(1),
      })
    } catch (error) {
      // Document doesn't exist, create it
      await addDoc(collection(db, "dailyStats"), {
        date: today,
        pageViews: 1,
        pages: { [page]: 1 },
        timestamp: serverTimestamp(),
      })
    }
  } catch (error) {
    console.error("Error logging page view:", error)
  }
}

export const logPurchase = async (orderId: string, amount: number, gameId: string, userId: string) => {
  try {
    // Validate required parameters
    if (!orderId || !amount || !gameId || !userId) {
      console.warn("Cannot log purchase: missing required parameters")
      return
    }

    await addDoc(collection(db, "purchases"), {
      orderId,
      amount,
      gameId,
      userId,
      timestamp: serverTimestamp(),
      sessionId: getSessionId(),
    })

    // Update purchase stats
    const today = new Date().toISOString().split("T")[0]
    const statsRef = doc(db, "dailyStats", today)

    try {
      await updateDoc(statsRef, {
        revenue: increment(amount),
        orders: increment(1),
        [`games.${gameId}.revenue`]: increment(amount),
        [`games.${gameId}.orders`]: increment(1),
      })
    } catch (error) {
      // Document doesn't exist, create it
      await addDoc(collection(db, "dailyStats"), {
        date: today,
        revenue: amount,
        orders: 1,
        games: { [gameId]: { revenue: amount, orders: 1 } },
        timestamp: serverTimestamp(),
      })
    }

    // Update user purchase stats
    const userRef = doc(db, "users", userId)
    await updateDoc(userRef, {
      totalSpent: increment(amount),
      totalOrders: increment(1),
      "loyalty.points": increment(Math.floor(amount * 0.1)), // 10% cashback in points
    })
  } catch (error) {
    console.error("Error logging purchase:", error)
  }
}

export const logSearch = async (query: string, results: number, userId?: string) => {
  try {
    if (!query || typeof query !== "string") {
      console.warn("Cannot log search: query is empty or invalid")
      return
    }

    const searchData: any = {
      query: query.toLowerCase(),
      results: results || 0,
      timestamp: serverTimestamp(),
      sessionId: getSessionId(),
    }

    // Only add userId if it's defined and valid
    if (userId && typeof userId === "string" && userId.trim() !== "") {
      searchData.userId = userId
    }

    await addDoc(collection(db, "searches"), searchData)

    // Update search stats
    const today = new Date().toISOString().split("T")[0]
    const statsRef = doc(db, "dailyStats", today)

    try {
      await updateDoc(statsRef, {
        searches: increment(1),
        [`searchQueries.${query.toLowerCase()}`]: increment(1),
      })
    } catch (error) {
      // Document doesn't exist, create it
      await addDoc(collection(db, "dailyStats"), {
        date: today,
        searches: 1,
        searchQueries: { [query.toLowerCase()]: 1 },
        timestamp: serverTimestamp(),
      })
    }
  } catch (error) {
    console.error("Error logging search:", error)
  }
}

export const logError = async (error: string, context: any, userId?: string) => {
  try {
    if (!error || typeof error !== "string") {
      console.warn("Cannot log error: error message is empty or invalid")
      return
    }

    // Clean context to remove undefined values
    const cleanContext = cleanObject(context)

    const errorData: any = {
      error: error.trim(),
      context: cleanContext,
      timestamp: serverTimestamp(),
      userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
      url: typeof window !== "undefined" ? window.location.href : "",
      sessionId: getSessionId(),
    }

    // Only add userId if it's defined and not empty
    if (userId && typeof userId === "string" && userId.trim() !== "") {
      errorData.userId = userId
    }

    await addDoc(collection(db, "errors"), errorData)
  } catch (err) {
    console.error("Error logging error:", err)
  }
}

export const logPerformance = async (metric: string, value: number, context?: any) => {
  try {
    if (!metric || typeof metric !== "string") {
      console.warn("Cannot log performance: invalid metric")
      return
    }

    if (typeof value !== "number" || isNaN(value)) {
      console.warn("Cannot log performance: invalid value")
      return
    }

    // Clean context to remove undefined values
    const cleanContext = context ? cleanObject(context) : {}

    await addDoc(collection(db, "performance"), {
      metric,
      value,
      context: cleanContext,
      timestamp: serverTimestamp(),
      userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
      url: typeof window !== "undefined" ? window.location.href : "",
      sessionId: getSessionId(),
    })
  } catch (error) {
    console.error("Error logging performance:", error)
  }
}

export const getSessionId = (): string => {
  if (typeof window === "undefined") {
    return "server-session"
  }

  let sessionId = sessionStorage.getItem("sessionId")
  if (!sessionId) {
    sessionId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    sessionStorage.setItem("sessionId", sessionId)
  }
  return sessionId
}

export const trackEvent = async (event: Omit<AnalyticsEvent, "timestamp">) => {
  try {
    // Clean event data to remove undefined values
    const cleanEvent = cleanObject(event)

    await addDoc(collection(db, "events"), {
      ...cleanEvent,
      timestamp: serverTimestamp(),
      sessionId: getSessionId(),
    })
  } catch (error) {
    console.error("Error tracking event:", error)
  }
}

// Real-time analytics functions
export const getRealtimeStats = async () => {
  try {
    const today = new Date().toISOString().split("T")[0]
    const statsRef = doc(db, "dailyStats", today)
    const statsDoc = await getDoc(statsRef)

    if (statsDoc.exists()) {
      return statsDoc.data()
    }

    return {
      pageViews: 0,
      orders: 0,
      revenue: 0,
      searches: 0,
      users: 0,
    }
  } catch (error) {
    console.error("Error getting realtime stats:", error)
    return null
  }
}

export const updateUserEngagement = async (userId: string, action: string, duration?: number) => {
  try {
    if (!userId || typeof userId !== "string" || userId.trim() === "") {
      console.warn("Cannot update user engagement: missing or invalid userId")
      return
    }

    if (!action || typeof action !== "string") {
      console.warn("Cannot update user engagement: missing or invalid action")
      return
    }

    const userRef = doc(db, "users", userId)
    const updateData: any = {
      "stats.lastActiveAt": serverTimestamp(),
      "stats.engagementScore": increment(1),
    }

    if (duration && typeof duration === "number" && !isNaN(duration)) {
      updateData[`stats.timeSpent.${action}`] = increment(duration)
    } else {
      updateData[`stats.timeSpent.${action}`] = increment(1)
    }

    await updateDoc(userRef, updateData)
  } catch (error) {
    console.error("Error updating user engagement:", error)
  }
}
