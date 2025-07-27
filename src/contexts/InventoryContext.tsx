"use client"
import type React from "react"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore"
import { db } from "../firebase/config"
import { logError } from "../services/analytics"

interface Game {
  id: string
  name: string
  nameAr: string
  image: string
  category: string
  categoryAr: string
  minPrice: number
  maxPrice: number
  currency: string
  popular: boolean
  featured: boolean
  description: string
  descriptionAr: string
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

interface InventoryContextType {
  games: Game[]
  accounts: GameAccount[]
  featuredAccounts: GameAccount[]
  loading: boolean
  error: string | null
  refreshInventory: () => Promise<void>
  getGameById: (id: string) => Game | undefined
  getAccountById: (id: string) => GameAccount | undefined
  getAccountsByGame: (gameId: string) => GameAccount[]
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined)

export const useInventory = () => {
  const context = useContext(InventoryContext)
  if (context === undefined) {
    throw new Error("useInventory must be used within an InventoryProvider")
  }
  return context
}

interface InventoryProviderProps {
  children: ReactNode
}

export const InventoryProvider: React.FC<InventoryProviderProps> = ({ children }) => {
  const [games, setGames] = useState<Game[]>([])
  const [accounts, setAccounts] = useState<GameAccount[]>([])
  const [featuredAccounts, setFeaturedAccounts] = useState<GameAccount[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fallback data
  const fallbackGames: Game[] = [
    {
      id: "pubg-mobile",
      name: "PUBG Mobile",
      nameAr: "ببجي موبايل",
      image: "/placeholder.svg?height=200&width=300&text=PUBG+Mobile",
      category: "battle-royale",
      categoryAr: "باتل رويال",
      minPrice: 5,
      maxPrice: 100,
      currency: "USD",
      popular: true,
      featured: true,
      description: "Popular battle royale game",
      descriptionAr: "لعبة باتل رويال شهيرة",
    },
    {
      id: "free-fire",
      name: "Free Fire",
      nameAr: "فري فاير",
      image: "/placeholder.svg?height=200&width=300&text=Free+Fire",
      category: "battle-royale",
      categoryAr: "باتل رويال",
      minPrice: 3,
      maxPrice: 50,
      currency: "USD",
      popular: true,
      featured: false,
      description: "Fast-paced battle royale",
      descriptionAr: "باتل رويال سريع الوتيرة",
    },
    {
      id: "fortnite",
      name: "Fortnite",
      nameAr: "فورتنايت",
      image: "/placeholder.svg?height=200&width=300&text=Fortnite",
      category: "battle-royale",
      categoryAr: "باتل رويال",
      minPrice: 10,
      maxPrice: 200,
      currency: "USD",
      popular: true,
      featured: true,
      description: "Build and battle",
      descriptionAr: "ابني وقاتل",
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

  const loadGames = async () => {
    try {
      const gamesQuery = query(collection(db, "games"), orderBy("popular", "desc"), limit(50))
      const gamesSnapshot = await getDocs(gamesQuery)
      const gamesData = gamesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Game[]

      if (gamesData.length > 0) {
        setGames(gamesData)
      } else {
        setGames(fallbackGames)
      }
    } catch (err) {
      console.error("Error loading games:", err)
      setGames(fallbackGames)
      logError("Failed to load games", { error: err }, undefined).catch(console.error)
    }
  }

  const loadAccounts = async () => {
    try {
      const accountsQuery = query(collection(db, "accounts"), orderBy("featured", "desc"), limit(50))
      const accountsSnapshot = await getDocs(accountsQuery)
      const accountsData = accountsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as GameAccount[]

      if (accountsData.length > 0) {
        setAccounts(accountsData)
        setFeaturedAccounts(accountsData.filter((account) => account.featured))
      } else {
        setAccounts(fallbackAccounts)
        setFeaturedAccounts(fallbackAccounts.filter((account) => account.featured))
      }
    } catch (err) {
      console.error("Error loading accounts:", err)
      setAccounts(fallbackAccounts)
      setFeaturedAccounts(fallbackAccounts.filter((account) => account.featured))
      logError("Failed to load accounts", { error: err }, undefined).catch(console.error)
    }
  }

  const refreshInventory = async () => {
    setLoading(true)
    setError(null)

    try {
      await Promise.all([loadGames(), loadAccounts()])
    } catch (err) {
      console.error("Error refreshing inventory:", err)
      setError("Failed to refresh inventory")
      logError("Failed to refresh inventory", { error: err }, undefined).catch(console.error)
    } finally {
      setLoading(false)
    }
  }

  const getGameById = (id: string): Game | undefined => {
    return games.find((game) => game.id === id)
  }

  const getAccountById = (id: string): GameAccount | undefined => {
    return accounts.find((account) => account.id === id)
  }

  const getAccountsByGame = (gameId: string): GameAccount[] => {
    return accounts.filter((account) => account.gameId === gameId)
  }

  useEffect(() => {
    // Set fallback data immediately
    setGames(fallbackGames)
    setAccounts(fallbackAccounts)
    setFeaturedAccounts(fallbackAccounts.filter((account) => account.featured))

    // Then try to load real data
    refreshInventory()
  }, [])

  const value: InventoryContextType = {
    games,
    accounts,
    featuredAccounts,
    loading,
    error,
    refreshInventory,
    getGameById,
    getAccountById,
    getAccountsByGame,
  }

  return <InventoryContext.Provider value={value}>{children}</InventoryContext.Provider>
}
