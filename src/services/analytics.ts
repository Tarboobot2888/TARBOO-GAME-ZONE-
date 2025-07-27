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

export const logActivity = async (action: string, data: any) => {
  try {
    await addDoc(collection(db, "analytics"), {
      action,
      data,
      timestamp: serverTimestamp(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      referrer: document.referrer,
      sessionId: getSessionId(),
    })
  } catch (error) {
    console.error("Error logging activity:", error)
  }
}

export const logUserAction = async (userId: string, action: string, data: any) => {
  try {
    await addDoc(collection(db, "userActions"), {
      userId,
      action,
      data,
      timestamp: serverTimestamp(),
      userAgent: navigator.userAgent,
      url: window.location.href,
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
    await addDoc(collection(db, "pageViews"), {
      page,
      userId,
      timestamp: serverTimestamp(),
      userAgent: navigator.userAgent,
      referrer: document.referrer,
      sessionId: getSessionId(),
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
    })

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
    await addDoc(collection(db, "searches"), {
      query: query.toLowerCase(),
      results,
      userId,
      timestamp: serverTimestamp(),
      sessionId: getSessionId(),
    })

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
    await addDoc(collection(db, "errors"), {
      error,
      context,
      userId,
      timestamp: serverTimestamp(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      sessionId: getSessionId(),
    })
  } catch (err) {
    console.error("Error logging error:", err)
  }
}

export const logPerformance = async (metric: string, value: number, context?: any) => {
  try {
    await addDoc(collection(db, "performance"), {
      metric,
      value,
      context,
      timestamp: serverTimestamp(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      sessionId: getSessionId(),
    })
  } catch (error) {
    console.error("Error logging performance:", error)
  }
}

export const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem("sessionId")
  if (!sessionId) {
    sessionId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    sessionStorage.setItem("sessionId", sessionId)
  }
  return sessionId
}

export const trackEvent = async (event: Omit<AnalyticsEvent, "timestamp">) => {
  try {
    await addDoc(collection(db, "events"), {
      ...event,
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
    const userRef = doc(db, "users", userId)
    await updateDoc(userRef, {
      "stats.lastActiveAt": serverTimestamp(),
      "stats.engagementScore": increment(1),
      [`stats.timeSpent.${action}`]: increment(duration || 1),
    })
  } catch (error) {
    console.error("Error updating user engagement:", error)
  }
}
