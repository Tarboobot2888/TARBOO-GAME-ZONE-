"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { collection, getDocs, query, where, orderBy } from "firebase/firestore"
import { db } from "../firebase/config"

interface Game {
  id: string
  name: string
  nameAr: string
  image: string
  category: string
  isPopular?: boolean
  minPrice: number
  maxPrice: number
}

interface GameAccount {
  id: string
  gameId: string
  gameName: string
  gameNameAr: string
  level: number
  rank: string
  rankAr: string
  price: number
  currency: string
  image: string
  features: string[]
  featuresAr: string[]
  verified: boolean
  featured: boolean
  description: string
  descriptionAr: string
}

interface RechargePackage {
  id: string
  gameId: string
  gameName: string
  title: string
  amount: string
  price: number
  currency: string
  isActive: boolean
  isPopular?: boolean
  description?: string
}

interface InventoryContextType {
  games: Game[]
  accounts: GameAccount[]
  featuredAccounts: GameAccount[]
  rechargePackages: RechargePackage[]
  loading: boolean
  error: string | null
  searchGames: (query: string) => Game[]
  searchAccounts: (query: string) => GameAccount[]
  searchPackages: (query: string) => RechargePackage[]
  getGameById: (id: string) => Game | undefined
  getAccountById: (id: string) => GameAccount | undefined
  getPackageById: (id: string) => RechargePackage | undefined
  getAccountsByGame: (gameId: string) => GameAccount[]
  getPackagesByGame: (gameId: string) => RechargePackage[]
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined)

// Fallback data
const fallbackGames: Game[] = [
  {
    id: "pubg-mobile",
    name: "PUBG Mobile",
    nameAr: "ببجي موبايل",
    image: "/placeholder.svg?height=200&width=300&text=PUBG+Mobile",
    category: "battle-royale",
    isPopular: true,
    minPrice: 5,
    maxPrice: 100,
  },
  {
    id: "free-fire",
    name: "Free Fire",
    nameAr: "فري فاير",
    image: "/placeholder.svg?height=200&width=300&text=Free+Fire",
    category: "battle-royale",
    isPopular: true,
    minPrice: 3,
    maxPrice: 50,
  },
  {
    id: "fortnite",
    name: "Fortnite",
    nameAr: "فورتنايت",
    image: "/placeholder.svg?height=200&width=300&text=Fortnite",
    category: "battle-royale",
    isPopular: true,
    minPrice: 10,
    maxPrice: 200,
  },
  {
    id: "fifa-mobile",
    name: "FIFA Mobile",
    nameAr: "فيفا موبايل",
    image: "/placeholder.svg?height=200&width=300&text=FIFA+Mobile",
    category: "sports",
    isPopular: true,
    minPrice: 8,
    maxPrice: 150,
  },
  {
    id: "cod-mobile",
    name: "Call of Duty Mobile",
    nameAr: "كول أوف ديوتي موبايل",
    image: "/placeholder.svg?height=200&width=300&text=COD+Mobile",
    category: "fps",
    isPopular: true,
    minPrice: 6,
    maxPrice: 120,
  },
  {
    id: "clash-of-clans",
    name: "Clash of Clans",
    nameAr: "كلاش أوف كلانس",
    image: "/placeholder.svg?height=200&width=300&text=Clash+of+Clans",
    category: "strategy",
    isPopular: false,
    minPrice: 4,
    maxPrice: 80,
  },
]

const fallbackAccounts: GameAccount[] = [
  {
    id: "pubg-account-1",
    gameId: "pubg-mobile",
    gameName: "PUBG Mobile",
    gameNameAr: "ببجي موبايل",
    level: 85,
    rank: "Crown",
    rankAr: "تاج",
    price: 150,
    currency: "USD",
    image: "/placeholder.svg?height=200&width=300&text=PUBG+Account",
    features: ["High Level", "Rare Skins", "Many Weapons"],
    featuresAr: ["مستوى عالي", "سكنات نادرة", "أسلحة كثيرة"],
    verified: true,
    featured: true,
    description: "High level PUBG account with rare items",
    descriptionAr: "حساب ببجي مستوى عالي مع عناصر نادرة",
  },
  {
    id: "ff-account-1",
    gameId: "free-fire",
    gameName: "Free Fire",
    gameNameAr: "فري فاير",
    level: 60,
    rank: "Heroic",
    rankAr: "بطولي",
    price: 80,
    currency: "USD",
    image: "/placeholder.svg?height=200&width=300&text=Free+Fire+Account",
    features: ["Good Rank", "Nice Skins", "Diamonds"],
    featuresAr: ["رتبة جيدة", "سكنات جميلة", "ألماس"],
    verified: true,
    featured: true,
    description: "Well-ranked Free Fire account",
    descriptionAr: "حساب فري فاير برتبة جيدة",
  },
]

const fallbackPackages: RechargePackage[] = [
  {
    id: "pubg-package-1",
    gameId: "pubg-mobile",
    gameName: "PUBG Mobile",
    title: "60 UC",
    amount: "60 UC",
    price: 5,
    currency: "USD",
    isActive: true,
    isPopular: true,
    description: "60 Unknown Cash for PUBG Mobile",
  },
  {
    id: "pubg-package-2",
    gameId: "pubg-mobile",
    gameName: "PUBG Mobile",
    title: "325 UC",
    amount: "325 UC",
    price: 25,
    currency: "USD",
    isActive: true,
    isPopular: true,
    description: "325 Unknown Cash for PUBG Mobile",
  },
  {
    id: "ff-package-1",
    gameId: "free-fire",
    gameName: "Free Fire",
    title: "100 Diamonds",
    amount: "100 Diamonds",
    price: 3,
    currency: "USD",
    isActive: true,
    isPopular: true,
    description: "100 Diamonds for Free Fire",
  },
]

export const InventoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [games, setGames] = useState<Game[]>(fallbackGames)
  const [accounts, setAccounts] = useState<GameAccount[]>(fallbackAccounts)
  const [featuredAccounts, setFeaturedAccounts] = useState<GameAccount[]>(
    fallbackAccounts.filter((acc) => acc.featured),
  )
  const [rechargePackages, setRechargePackages] = useState<RechargePackage[]>(fallbackPackages)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadInventoryData()
  }, [])

  const loadInventoryData = async () => {
    setLoading(true)
    setError(null)

    try {
      // Try to load from Firebase, but don't fail if it's not available
      await Promise.all([loadGames(), loadAccounts(), loadRechargePackages()])
    } catch (err) {
      console.warn("Failed to load from Firebase, using fallback data:", err)
      setError("Using offline data")
    } finally {
      setLoading(false)
    }
  }

  const loadGames = async () => {
    try {
      const gamesRef = collection(db, "games")
      const q = query(gamesRef, orderBy("name"))
      const snapshot = await getDocs(q)

      if (!snapshot.empty) {
        const gamesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Game[]
        setGames(gamesData)
      }
    } catch (error) {
      console.warn("Failed to load games from Firebase:", error)
      // Keep fallback data
    }
  }

  const loadAccounts = async () => {
    try {
      const accountsRef = collection(db, "accounts")
      const q = query(accountsRef, orderBy("price"))
      const snapshot = await getDocs(q)

      if (!snapshot.empty) {
        const accountsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as GameAccount[]
        setAccounts(accountsData)
        setFeaturedAccounts(accountsData.filter((acc) => acc.featured))
      }
    } catch (error) {
      console.warn("Failed to load accounts from Firebase:", error)
      // Keep fallback data
    }
  }

  const loadRechargePackages = async () => {
    try {
      const packagesRef = collection(db, "rechargePackages")
      const q = query(packagesRef, where("isActive", "==", true), orderBy("price"))
      const snapshot = await getDocs(q)

      if (!snapshot.empty) {
        const packagesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as RechargePackage[]
        setRechargePackages(packagesData)
      }
    } catch (error) {
      console.warn("Failed to load packages from Firebase:", error)
      // Keep fallback data
    }
  }

  const searchGames = (query: string): Game[] => {
    if (!query.trim()) return games

    const lowercaseQuery = query.toLowerCase()
    return games.filter(
      (game) =>
        game.name.toLowerCase().includes(lowercaseQuery) ||
        game.nameAr.includes(query) ||
        game.category.toLowerCase().includes(lowercaseQuery),
    )
  }

  const searchAccounts = (query: string): GameAccount[] => {
    if (!query.trim()) return accounts

    const lowercaseQuery = query.toLowerCase()
    return accounts.filter(
      (account) =>
        account.gameName.toLowerCase().includes(lowercaseQuery) ||
        account.gameNameAr.includes(query) ||
        account.rank.toLowerCase().includes(lowercaseQuery) ||
        account.rankAr.includes(query),
    )
  }

  const searchPackages = (query: string): RechargePackage[] => {
    if (!query.trim()) return rechargePackages

    const lowercaseQuery = query.toLowerCase()
    return rechargePackages.filter(
      (pkg) =>
        pkg.gameName.toLowerCase().includes(lowercaseQuery) ||
        pkg.title.toLowerCase().includes(lowercaseQuery) ||
        pkg.amount.toLowerCase().includes(lowercaseQuery),
    )
  }

  const getGameById = (id: string): Game | undefined => {
    return games.find((game) => game.id === id)
  }

  const getAccountById = (id: string): GameAccount | undefined => {
    return accounts.find((account) => account.id === id)
  }

  const getPackageById = (id: string): RechargePackage | undefined => {
    return rechargePackages.find((pkg) => pkg.id === id)
  }

  const getAccountsByGame = (gameId: string): GameAccount[] => {
    return accounts.filter((account) => account.gameId === gameId)
  }

  const getPackagesByGame = (gameId: string): RechargePackage[] => {
    return rechargePackages.filter((pkg) => pkg.gameId === gameId)
  }

  const value: InventoryContextType = {
    games,
    accounts,
    featuredAccounts,
    rechargePackages,
    loading,
    error,
    searchGames,
    searchAccounts,
    searchPackages,
    getGameById,
    getAccountById,
    getPackageById,
    getAccountsByGame,
    getPackagesByGame,
  }

  return <InventoryContext.Provider value={value}>{children}</InventoryContext.Provider>
}

export const useInventory = (): InventoryContextType => {
  const context = useContext(InventoryContext)
  if (context === undefined) {
    throw new Error("useInventory must be used within an InventoryProvider")
  }
  return context
}
