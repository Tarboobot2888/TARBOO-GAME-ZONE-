import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { db } from "../firebase/config"

export const logActivity = async (action: string, data: any) => {
  try {
    await addDoc(collection(db, "analytics"), {
      action,
      data,
      timestamp: serverTimestamp(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    })
  } catch (error) {
    console.error("Error logging activity:", error)
  }
}

export const logPageView = async (page: string) => {
  await logActivity("page_view", { page })
}

export const logPurchase = async (orderId: string, amount: number, gameId: string) => {
  await logActivity("purchase", { orderId, amount, gameId })
}

export const logSearch = async (query: string, results: number) => {
  await logActivity("search", { query, results })
}
