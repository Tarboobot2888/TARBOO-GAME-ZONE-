"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Zap, Search, Filter, Grid, List, ShoppingCart } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"
import { useCart } from "../contexts/CartContext"
import { useNotification } from "../contexts/NotificationContext"
import { useInventory } from "../contexts/InventoryContext"
import { logPageView, logSearch } from "../services/analytics"
import LoadingSpinner from "../components/LoadingSpinner"
import GameCard from "../components/GameCard"
import RechargePackageCard from "../components/RechargePackageCard"

const Recharge: React.FC = () => {
  const { currentUser } = useAuth()
  const { addToCart } = useCart()
  const { addNotification } = useNotification()
  const { games, rechargePackages, loading, searchGames } = useInventory()

  const [selectedGame, setSelectedGame] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredGames, setFilteredGames] = useState(games)
  const [filteredPackages, setFilteredPackages] = useState(rechargePackages)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState("popular")
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    logPageView("recharge", currentUser?.uid)
  }, [currentUser])

  useEffect(() => {
    let filtered = games

    if (searchQuery) {
      filtered = searchGames(searchQuery)
      logSearch(searchQuery, filtered.length, currentUser?.uid)
    }

    // Sort games
    switch (sortBy) {
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      case "popular":
        filtered.sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0))
        break
      default:
        break
    }

    setFilteredGames(filtered)

    // Filter packages by selected game
    if (selectedGame) {
      const gamePackages = rechargePackages.filter((pkg) => pkg.gameId === selectedGame)
      setFilteredPackages(gamePackages)
    } else {
      setFilteredPackages(rechargePackages)
    }
  }, [searchQuery, selectedGame, games, rechargePackages, sortBy])

  const handleGameSelect = (gameId: string) => {
    setSelectedGame(gameId === selectedGame ? "" : gameId)
  }

  const handleAddToCart = (packageData: any) => {
    if (!currentUser) {
      addNotification({
        type: "warning",
        title: "تسجيل الدخول مطلوب",
        message: "يجب تسجيل الدخول أولاً لإضافة العناصر للسلة",
      })
      return
    }

    addToCart({
      id: packageData.id,
      type: "recharge",
      gameId: packageData.gameId,
      gameName: packageData.gameName,
      title: packageData.title,
      price: packageData.price,
      image: packageData.image || `/placeholder.svg?height=200&width=300&text=${packageData.gameName}`,
      details: packageData,
    })

    addNotification({
      type: "success",
      title: "تم الإضافة للسلة",
      message: `تم إضافة ${packageData.title} للسلة بنجاح`,
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="جاري تحميل الألعاب..." />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-600 via-blue-600 to-purple-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <Zap className="inline-block h-12 w-12 ml-4 text-yellow-400" />
              شحن الألعاب
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200">اشحن ألعابك المفضلة بأسرع وقت وأفضل الأسعار</p>
          </motion.div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Bar */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث عن الألعاب..."
                  className="w-full pr-10 pl-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4">
              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="popular">الأكثر شعبية</option>
                <option value="name">الاسم</option>
              </select>

              {/* View Mode */}
              <div className="flex border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 ${
                    viewMode === "grid"
                      ? "bg-blue-500 text-white"
                      : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                  }`}
                >
                  <Grid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 ${
                    viewMode === "list"
                      ? "bg-blue-500 text-white"
                      : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                  }`}
                >
                  <List className="h-5 w-5" />
                </button>
              </div>

              {/* Filters Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                <Filter className="h-5 w-5" />
                فلاتر
              </button>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            تم العثور على {filteredGames.length} لعبة
            {selectedGame && <span className="mr-2">• {filteredPackages.length} باقة شحن متاحة</span>}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {!selectedGame ? (
            // Games Grid
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">اختر لعبتك المفضلة</h2>
              {filteredGames.length === 0 ? (
                <div className="text-center py-16">
                  <Zap className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">لا توجد ألعاب متاحة</h3>
                  <p className="text-gray-600 dark:text-gray-400">جرب تغيير معايير البحث</p>
                </div>
              ) : (
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6"
                      : "space-y-4"
                  }
                >
                  {filteredGames.map((game, index) => (
                    <motion.div
                      key={game.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      onClick={() => handleGameSelect(game.id)}
                      className="cursor-pointer"
                    >
                      <GameCard game={game} />
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            // Recharge Packages
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  باقات الشحن - {games.find((g) => g.id === selectedGame)?.nameAr}
                </h2>
                <button onClick={() => setSelectedGame("")} className="text-blue-600 hover:text-blue-700 font-semibold">
                  العودة للألعاب
                </button>
              </div>

              {filteredPackages.length === 0 ? (
                <div className="text-center py-16">
                  <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">لا توجد باقات شحن متاحة</h3>
                  <p className="text-gray-600 dark:text-gray-400">باقات الشحن لهذه اللعبة ستكون متاحة قريباً</p>
                </div>
              ) : (
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                      : "space-y-4"
                  }
                >
                  {filteredPackages.map((pkg, index) => (
                    <motion.div
                      key={pkg.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                      <RechargePackageCard package={pkg} viewMode={viewMode} onAddToCart={() => handleAddToCart(pkg)} />
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default Recharge
