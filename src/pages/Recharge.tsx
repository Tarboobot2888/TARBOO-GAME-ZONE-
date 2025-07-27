"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Zap, Star, Clock, Shield, Filter, Search, Grid, List } from "lucide-react"
import { useInventory } from "../contexts/InventoryContext"
import { useAuth } from "../contexts/AuthContext"
import { useCart } from "../contexts/CartContext"
import { useNotification } from "../contexts/NotificationContext"
import { useLanguage } from "../contexts/LanguageContext"
import { logPageView, logSearch } from "../services/analytics"
import LoadingSpinner from "../components/LoadingSpinner"
import RechargePackageCard from "../components/RechargePackageCard"
import FilterSidebar from "../components/FilterSidebar"

const Recharge: React.FC = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const { addToCart } = useCart()
  const { addNotification } = useNotification()
  const { t } = useLanguage()
  const { rechargePackages, loading, searchPackages, getPackagesByGame } = useInventory()

  const [selectedGame, setSelectedGame] = useState(searchParams.get("game") || "")
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredPackages, setFilteredPackages] = useState(rechargePackages)
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState("popular")
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [selectedRegion, setSelectedRegion] = useState("")

  const games = [
    { id: "fifa", name: "FIFA Mobile", nameAr: "فيفا موبايل", icon: "⚽", color: "bg-green-500" },
    { id: "pubg", name: "PUBG Mobile", nameAr: "ببجي موبايل", icon: "🔫", color: "bg-orange-500" },
    { id: "freefire", name: "Free Fire", nameAr: "فري فاير", icon: "🔥", color: "bg-red-500" },
    { id: "cod", name: "Call of Duty", nameAr: "كول أوف ديوتي", icon: "💀", color: "bg-gray-800" },
    { id: "pes", name: "PES Mobile", nameAr: "بيس موبايل", icon: "⚽", color: "bg-blue-500" },
    { id: "clash", name: "Clash of Clans", nameAr: "كلاش أوف كلانس", icon: "🏰", color: "bg-yellow-500" },
  ]

  useEffect(() => {
    logPageView("recharge", currentUser?.uid)
  }, [currentUser])

  useEffect(() => {
    let filtered = rechargePackages

    // Filter by selected game
    if (selectedGame) {
      filtered = getPackagesByGame(selectedGame)
    }

    // Filter by search query
    if (searchQuery) {
      filtered = searchPackages(searchQuery)
      logSearch(searchQuery, filtered.length, currentUser?.uid)
    }

    // Filter by price range
    filtered = filtered.filter((pkg) => pkg.price >= priceRange[0] && pkg.price <= priceRange[1])

    // Filter by region
    if (selectedRegion) {
      filtered = filtered.filter((pkg) => pkg.region.includes(selectedRegion))
    }

    // Sort packages
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        filtered.sort((a, b) => b.price - a.price)
        break
      case "popular":
        filtered.sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0))
        break
      case "newest":
        filtered.sort((a, b) => b.createdAt - a.createdAt)
        break
      default:
        break
    }

    setFilteredPackages(filtered)
  }, [selectedGame, searchQuery, rechargePackages, sortBy, priceRange, selectedRegion])

  const handleGameSelect = (gameId: string) => {
    setSelectedGame(gameId)
    navigate(`/recharge?game=${gameId}`)
  }

  const handleAddToCart = (packageData: any) => {
    if (!currentUser) {
      addNotification({
        type: "warning",
        title: "تسجيل الدخول مطلوب",
        message: "يجب تسجيل الدخول أولاً لإضافة العناصر للسلة",
      })
      navigate("/login")
      return
    }

    addToCart({
      id: packageData.id,
      type: "recharge",
      gameId: packageData.gameId,
      gameName: packageData.gameName,
      title: packageData.packageName,
      price: packageData.price,
      image: `/placeholder.svg?height=200&width=300&text=${packageData.gameName}`,
      details: packageData,
    })

    addNotification({
      type: "success",
      title: "تم الإضافة للسلة",
      message: `تم إضافة ${packageData.packageName} للسلة بنجاح`,
    })
  }

  const handleInstantRecharge = (packageData: any) => {
    if (!currentUser) {
      addNotification({
        type: "warning",
        title: "تسجيل الدخول مطلوب",
        message: "يجب تسجيل الدخول أولاً للشحن الفوري",
      })
      navigate("/login")
      return
    }

    // Add to cart and redirect to checkout
    handleAddToCart(packageData)
    navigate("/checkout")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="جاري تحميل باقات الشحن..." />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <Zap className="inline-block h-12 w-12 ml-4 text-yellow-400" />
              شحن الألعاب الفوري
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200">اشحن ألعابك المفضلة في ثوانٍ معدودة بأفضل الأسعار</p>
          </motion.div>
        </div>
      </section>

      {/* Games Selection */}
      <section className="py-8 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">اختر لعبتك المفضلة</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {games.map((game) => (
              <motion.button
                key={game.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleGameSelect(game.id)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedGame === game.id
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                } bg-white dark:bg-gray-800`}
              >
                <div
                  className={`w-12 h-12 ${game.color} rounded-lg flex items-center justify-center text-2xl mx-auto mb-2`}
                >
                  {game.icon}
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{game.nameAr}</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">{game.name}</p>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-6 bg-gray-50 dark:bg-gray-900">
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
                  placeholder="ابحث عن باقات الشحن..."
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
                <option value="price-low">السعر: من الأقل للأعلى</option>
                <option value="price-high">السعر: من الأعلى للأقل</option>
                <option value="newest">الأحدث</option>
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
            تم العثور على {filteredPackages.length} باقة شحن
            {selectedGame && <span className="mr-2">في لعبة {games.find((g) => g.id === selectedGame)?.nameAr}</span>}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            {/* Filters Sidebar */}
            {showFilters && (
              <div className="w-64 flex-shrink-0">
                <FilterSidebar
                  priceRange={priceRange}
                  setPriceRange={setPriceRange}
                  selectedRegion={selectedRegion}
                  setSelectedRegion={setSelectedRegion}
                />
              </div>
            )}

            {/* Packages Grid/List */}
            <div className="flex-1">
              {filteredPackages.length === 0 ? (
                <div className="text-center py-16">
                  <Zap className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">لا توجد باقات شحن متاحة</h3>
                  <p className="text-gray-600 dark:text-gray-400">جرب تغيير معايير البحث أو الفلاتر</p>
                </div>
              ) : (
                <div
                  className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}
                >
                  {filteredPackages.map((pkg, index) => (
                    <motion.div
                      key={pkg.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                      <RechargePackageCard
                        package={pkg}
                        viewMode={viewMode}
                        onAddToCart={() => handleAddToCart(pkg)}
                        onInstantRecharge={() => handleInstantRecharge(pkg)}
                      />
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            لماذا تختار خدمة الشحن لدينا؟
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Zap className="h-8 w-8 text-yellow-500" />,
                title: "شحن فوري",
                description: "احصل على شحنتك في أقل من 5 دقائق",
              },
              {
                icon: <Shield className="h-8 w-8 text-green-500" />,
                title: "آمان مضمون",
                description: "حماية كاملة لبياناتك ومعاملاتك",
              },
              {
                icon: <Clock className="h-8 w-8 text-blue-500" />,
                title: "دعم 24/7",
                description: "فريق دعم متاح طوال اليوم لمساعدتك",
              },
              {
                icon: <Star className="h-8 w-8 text-purple-500" />,
                title: "أفضل الأسعار",
                description: "أسعار تنافسية وعروض حصرية",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center p-6 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Recharge
