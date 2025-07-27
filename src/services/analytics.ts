import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { db } from "../firebase/config"

// Helper function to clean objects of undefined values
const cleanObject = (obj: any): any => {
  if (obj === null || obj === undefined) {
    return null
  }

  if (Array.isArray(obj)) {
    return obj.map(cleanObject).filter((item) => item !== null && item !== undefined)
  }

  if (typeof obj === "object") {
    const cleaned: any = {}
    for (const [key, value] of Object.entries(obj)) {
      if (value !== undefined && value !== null) {
        cleaned[key] = cleanObject(value)
      }
    }
    return cleaned
  }

  return obj
}

export const logPageView = async (page: string, userId?: string) => {
  try {
    if (!page || typeof page !== "string") {
      console.warn("Invalid page parameter for logPageView")
      return
    }

    const data: any = {
      page,
      timestamp: serverTimestamp(),
      userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "unknown",
    }

    if (userId && typeof userId === "string" && userId.trim()) {
      data.userId = userId
    }

    const cleanedData = cleanObject(data)
    await addDoc(collection(db, "pageViews"), cleanedData)
  } catch (error) {
    console.error("Error logging page view:", error)
  }
}

export const logSearch = async (query: string, results: number, userId?: string) => {
  try {
    if (!query || typeof query !== "string") {
      console.warn("Invalid query parameter for logSearch")
      return
    }

    const data: any = {
      query,
      results: typeof results === "number" ? results : 0,
      timestamp: serverTimestamp(),
    }

    if (userId && typeof userId === "string" && userId.trim()) {
      data.userId = userId
    }

    const cleanedData = cleanObject(data)
    await addDoc(collection(db, "searches"), cleanedData)
  } catch (error) {
    console.error("Error logging search:", error)
  }
}

export const logActivity = async (activity: string, context: any = {}) => {
  try {
    if (!activity || typeof activity !== "string") {
      console.warn("Invalid activity parameter for logActivity")
      return
    }

    const data: any = {
      activity,
      timestamp: serverTimestamp(),
      context: cleanObject(context) || {},
    }

    const cleanedData = cleanObject(data)
    await addDoc(collection(db, "activities"), cleanedData)
  } catch (error) {
    console.error("Error logging activity:", error)
  }
}

export const logError = async (error: string, context: any = {}) => {
  try {
    if (!error || typeof error !== "string" || error.trim() === "") {
      console.warn("Invalid error parameter for logError")
      return
    }

    const data: any = {
      error,
      timestamp: serverTimestamp(),
      context: cleanObject(context) || {},
      userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "unknown",
    }

    const cleanedData = cleanObject(data)
    await addDoc(collection(db, "errors"), cleanedData)
  } catch (logError) {
    console.error("Error logging error:", logError)
  }
}

export const logPurchase = async (gameId: string, amount: number, userId?: string) => {
  try {
    if (!gameId || typeof gameId !== "string") {
      console.warn("Invalid gameId parameter for logPurchase")
      return
    }

    const data: any = {
      gameId,
      amount: typeof amount === "number" ? amount : 0,
      timestamp: serverTimestamp(),
    }

    if (userId && typeof userId === "string" && userId.trim()) {
      data.userId = userId
    }

    const cleanedData = cleanObject(data)
    await addDoc(collection(db, "purchases"), cleanedData)
  } catch (error) {
    console.error("Error logging purchase:", error)
  }
}
