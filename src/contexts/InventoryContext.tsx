"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { collection, query, where, onSnapshot, doc, updateDoc, increment } from "firebase/firestore"
import { db } from "../firebase/config"

interface GameAccount {
  id: string
  gameId: string
  gameName: string
  title: string
  description: string
  price: number
  originalPrice?: number
  discount?: number
  images: string[]
  level: number
  rank: string
  platform: "android" | "ios" | "pc"
  region: string
  status: "available" | "sold" | "reserved" | "pending"
  features: string[]
  stats: {
    views: number
    likes: number
    purchases: number
  }
  seller: {
    id: string
    name: string
    rating: number
    verified: boolean
  }
  createdAt: any
  updatedAt: any
  expiresAt?: any
  tags: string[]
  category: string
  subcategory?: string
  isVerified: boolean
  isFeatured: boolean
  isPopular: boolean
  condition: "new" | "used" | "excellent"
  warranty: boolean
  guaranteeDays: number
}

interface RechargePackage {
  id: string
  gameId: string
  gameName: string
  packageName: string
  amount: number
  bonus?: number
  price: number
  originalPrice?: number
  discount?: number
  currency: string
  description: string
  features: string[]
  deliveryTime: string
  isPopular: boolean
  isFeatured: boolean
  status: "active" | "inactive"
  region: string[]
  platforms: string[]
  minLevel?: number
  maxLevel?: number
  createdAt: any
  updatedAt: any
}

interface InventoryContextType {
  accounts: GameAccount[]
  rechargePackages: RechargePackage[]
  loading: boolean
  error: string | null
  filters: {
    game: string
    priceRange: [number, number]
    platform: string
    status: string
    category: string
    sortBy: string
    sortOrder: "asc" | "desc"
  }
  setFilters: (filters: Partial<InventoryContextType["filters"]>) => void
  searchAccounts: (query: string) => GameAccount[]
  searchPackages: (query: string) => RechargePackage[]
  getAccountById: (id: string) => GameAccount | undefined
  getPackageById: (id: string) => RechargePackage | undefined
  updateAccountStatus: (id: string, status: GameAccount["status"]) => Promise<void>
  incrementAccountViews: (id: string) => Promise<void>
  getPopularAccounts: (limit?: number) => GameAccount[]
  getFeaturedAccounts: (limit?: number) => GameAccount[]
  getAccountsByGame: (gameId: string) => GameAccount[]
  getPackagesByGame: (gameId: string) => RechargePackage[]
  refreshInventory: () => void
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined)

export const useInventory = () => {
  const context = useContext(InventoryContext)
  if (!context) {
    throw new Error("useInventory must be used within an InventoryProvider")
  }
  return context
}

interface InventoryProviderProps {
  children: ReactNode
}

export const InventoryProvider: React.FC<InventoryProviderProps> = ({ children }) => {
  const [accounts, setAccounts] = useState<GameAccount[]>([])
  const [rechargePackages, setRechargePackages] = useState<RechargePackage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState({
    game: "",
    priceRange: [0, 10000] as [number, number],
    platform: "",
    status: "",
    category: "",
    sortBy: "createdAt",
    sortOrder: "desc" as "asc" | "desc",
  })

  // Real-time listeners for accounts and packages
  useEffect(() => {
    const accountsQuery = query(collection(db, "accounts"), where("status", "in", ["available", "featured"]))

    const packagesQuery = query(collection(db, "rechargePackages"), where("status", "==", "active"))

    const unsubscribeAccounts = onSnapshot(
      accountsQuery,
      (snapshot) => {
        const accountsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as GameAccount[]

        setAccounts(accountsData)
        setLoading(false)
      },
      (error) => {
        console.error("Error fetching accounts:", error)
        setError("فشل في تحميل الحسابات")
        setLoading(false)
      },
    )

    const unsubscribePackages = onSnapshot(
      packagesQuery,
      (snapshot) => {
        const packagesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as RechargePackage[]

        setRechargePackages(packagesData)
      },
      (error) => {
        console.error("Error fetching packages:", error)
        setError("فشل في تحميل باقات الشحن")
      },
    )

    return () => {
      unsubscribeAccounts()
      unsubscribePackages()
    }
  }, [])

  const searchAccounts = (query: string): GameAccount[] => {
    if (!query.trim()) return accounts

    const searchTerm = query.toLowerCase()
    return accounts.filter(
      (account) =>
        account.title.toLowerCase().includes(searchTerm) ||
        account.gameName.toLowerCase().includes(searchTerm) ||
        account.description.toLowerCase().includes(searchTerm) ||
        account.tags.some((tag) => tag.toLowerCase().includes(searchTerm)),
    )
  }

  const searchPackages = (query: string): RechargePackage[] => {
    if (!query.trim()) return rechargePackages

    const searchTerm = query.toLowerCase()
    return rechargePackages.filter(
      (pkg) =>
        pkg.packageName.toLowerCase().includes(searchTerm) ||
        pkg.gameName.toLowerCase().includes(searchTerm) ||
        pkg.description.toLowerCase().includes(searchTerm),
    )
  }

  const getAccountById = (id: string): GameAccount | undefined => {
    return accounts.find((account) => account.id === id)
  }

  const getPackageById = (id: string): RechargePackage | undefined => {
    return rechargePackages.find((pkg) => pkg.id === id)
  }

  const updateAccountStatus = async (id: string, status: GameAccount["status"]) => {
    try {
      const accountRef = doc(db, "accounts", id)
      await updateDoc(accountRef, {
        status,
        updatedAt: new Date(),
      })
    } catch (error) {
      console.error("Error updating account status:", error)
      throw new Error("فشل في تحديث حالة الحساب")
    }
  }

  const incrementAccountViews = async (id: string) => {
    try {
      const accountRef = doc(db, "accounts", id)
      await updateDoc(accountRef, {
        "stats.views": increment(1),
        updatedAt: new Date(),
      })
    } catch (error) {
      console.error("Error incrementing views:", error)
    }
  }

  const getPopularAccounts = (limit = 10): GameAccount[] => {
    return accounts
      .filter((account) => account.isPopular || account.stats.purchases > 5)
      .sort((a, b) => b.stats.purchases - a.stats.purchases)
      .slice(0, limit)
  }

  const getFeaturedAccounts = (limit = 6): GameAccount[] => {
    return accounts
      .filter((account) => account.isFeatured)
      .sort((a, b) => b.stats.views - a.stats.views)
      .slice(0, limit)
  }

  const getAccountsByGame = (gameId: string): GameAccount[] => {
    return accounts.filter((account) => account.gameId === gameId)
  }

  const getPackagesByGame = (gameId: string): RechargePackage[] => {
    return rechargePackages.filter((pkg) => pkg.gameId === gameId)
  }

  const refreshInventory = () => {
    setLoading(true)
    // The real-time listeners will automatically refresh the data
  }

  // Apply filters and sorting
  const filteredAccounts = accounts
    .filter((account) => {
      if (filters.game && account.gameId !== filters.game) return false
      if (filters.platform && account.platform !== filters.platform) return false
      if (filters.status && account.status !== filters.status) return false
      if (filters.category && account.category !== filters.category) return false
      if (account.price < filters.priceRange[0] || account.price > filters.priceRange[1]) return false
      return true
    })
    .sort((a, b) => {
      const aValue = a[filters.sortBy as keyof GameAccount] as any
      const bValue = b[filters.sortBy as keyof GameAccount] as any

      if (filters.sortOrder === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

  const value: InventoryContextType = {
    accounts: filteredAccounts,
    rechargePackages,
    loading,
    error,
    filters,
    setFilters,
    searchAccounts,
    searchPackages,
    getAccountById,
    getPackageById,
    updateAccountStatus,
    incrementAccountViews,
    getPopularAccounts,
    getFeaturedAccounts,
    getAccountsByGame,
    getPackagesByGame,
    refreshInventory,
  }

  return <InventoryContext.Provider value={value}>{children}</InventoryContext.Provider>
}
