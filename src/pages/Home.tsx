"use client"
import type React from "react"
import { useEffect, useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import { useInventory } from "../contexts/InventoryContext"
import { useLanguage } from "../contexts/LanguageContext"
import { useTheme } from "../contexts/ThemeContext"
import GameCard from "../components/GameCard"
import GameAccountCard from "../components/GameAccountCard"
import TestimonialCard from "../components/TestimonialCard"
import LoadingSpinner from "../components/LoadingSpinner"
import { logPageView, logActivity } from "../services/analytics"
import { Search, Star, Shield, Clock, Users, Trophy, Gamepad2, CreditCard } from "lucide-react"

const Home: React.FC = () => {
  const { user } = useAuth()
  const { games = [], featuredAccounts = [], loading } = useInventory()
  const { t } = useLanguage()
  const { theme } = useTheme()
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    // Log page view
    logPageView("home", user?.uid).catch(console.error)

    // Log activity
    logActivity("page_visit", {
      page: "home",
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
    }).catch(console.error)
  }, [user])

  // Fallback data for when Firebase is loading or unavailable
  const fallbackGames = [
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

  const fallbackAccounts = [
    {
      id: "pubg-account-1",
      gameId: "pubg-mobile",
      gameName: "PUBG Mobile",
      gameNameAr: "ببجي موبايل",
      title: "حساب ببجي مستوى عالي",
      level: 85,
      rank: "Crown",
      rankAr: "تاج",
      price: 150,
      currency: "USD",
      images: ["/placeholder.svg?height=200&width=300&text=PUBG+Account"],
      features: ["High Level", "Rare Skins", "Many Weapons"],
      featuresAr: ["مستوى عالي", "سكنات نادرة", "أسلحة كثيرة"],
      verified: true,
      featured: true,
      platform: "android" as const,
      condition: "excellent" as const,
      warranty: true,
      guaranteeDays: 30,
      description: "High level PUBG account with rare items",
      seller: {
        id: "seller1",
        name: "أحمد محمد",
        rating: 4.8,
        verified: true,
      },
    },
    {
      id: "ff-account-1",
      gameId: "free-fire",
      gameName: "Free Fire",
      gameNameAr: "فري فاير",
      title: "حساب فري فاير برتبة عالية",
      level: 60,
      rank: "Heroic",
      rankAr: "بطولي",
      price: 80,
      currency: "USD",
      images: ["/placeholder.svg?height=200&width=300&text=Free+Fire+Account"],
      features: ["Good Rank", "Nice Skins", "Diamonds"],
      featuresAr: ["رتبة جيدة", "سكنات جميلة", "ألماس"],
      verified: true,
      featured: true,
      platform: "ios" as const,
      condition: "new" as const,
      warranty: true,
      guaranteeDays: 15,
      description: "Well-ranked Free Fire account",
      seller: {
        id: "seller2",
        name: "فاطمة علي",
        rating: 4.9,
        verified: true,
      },
    },
  ]

  // Use actual data if available, otherwise use fallback
  const displayGames = Array.isArray(games) && games.length > 0 ? games : fallbackGames
  const displayAccounts =
    Array.isArray(featuredAccounts) && featuredAccounts.length > 0 ? featuredAccounts : fallbackAccounts

  // Filter games based on search
  const filteredGames = displayGames.filter(
    (game) =>
      game?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game?.nameAr?.includes(searchQuery) ||
      game?.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game?.categoryAr?.includes(searchQuery),
  )

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      logActivity("search", {
        query: searchQuery,
        results: filteredGames.length,
        timestamp: new Date().toISOString(),
      }).catch(console.error)
    }
  }

  const handleAddToCart = (accountId: string) => {
    console.log("Adding to cart:", accountId)
    // TODO: Implement cart functionality
  }

  const handleViewDetails = (accountId: string) => {
    console.log("Viewing details:", accountId)
    // TODO: Navigate to account details page
  }

  if (loading && displayGames.length === 0) {
    return <LoadingSpinner />
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">مرحباً بك في GameZone</h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">منصتك المفضلة لشحن الألعاب وشراء الحسابات المميزة</p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث عن لعبتك المفضلة..."
                  className="w-full px-6 py-4 pr-12 text-gray-900 bg-white rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600"
                >
                  <Search className="h-6 w-6" />
                </button>
              </div>
            </form>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <Users className="h-8 w-8" />
                </div>
                <div className="text-2xl font-bold">50K+</div>
                <div className="text-sm opacity-80">عميل راضي</div>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <Gamepad2 className="h-8 w-8" />
                </div>
                <div className="text-2xl font-bold">100+</div>
                <div className="text-sm opacity-80">لعبة متاحة</div>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <Shield className="h-8 w-8" />
                </div>
                <div className="text-2xl font-bold">99.9%</div>
                <div className="text-sm opacity-80">معدل الأمان</div>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <Clock className="h-8 w-8" />
                </div>
                <div className="text-2xl font-bold">24/7</div>
                <div className="text-sm opacity-80">دعم فني</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Games */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">الألعاب المميزة</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">اشحن ألعابك المفضلة بأسرع وقت وأفضل الأسعار</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredGames.slice(0, 6).map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>

          {filteredGames.length > 6 && (
            <div className="text-center mt-12">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
                عرض المزيد من الألعاب
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Featured Accounts */}
      <section className="py-16 bg-gray-100 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">حسابات مميزة</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">اشتري حسابات مضمونة ومميزة لألعابك المفضلة</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayAccounts.slice(0, 6).map((account) => (
              <GameAccountCard
                key={account.id}
                account={account}
                onAddToCart={() => handleAddToCart(account.id)}
                onViewDetails={() => handleViewDetails(account.id)}
              />
            ))}
          </div>

          <div className="text-center mt-12">
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
              عرض جميع الحسابات
            </button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">لماذا تختار GameZone؟</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
              <div className="flex justify-center mb-4">
                <Shield className="h-12 w-12 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">أمان مضمون</h3>
              <p className="text-gray-600 dark:text-gray-400">جميع المعاملات محمية بأعلى معايير الأمان والحماية</p>
            </div>

            <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
              <div className="flex justify-center mb-4">
                <Clock className="h-12 w-12 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">سرعة في التسليم</h3>
              <p className="text-gray-600 dark:text-gray-400">تسليم فوري للشحنات والحسابات خلال دقائق معدودة</p>
            </div>

            <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
              <div className="flex justify-center mb-4">
                <CreditCard className="h-12 w-12 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">طرق دفع متنوعة</h3>
              <p className="text-gray-600 dark:text-gray-400">ندعم جميع طرق الدفع المحلية والعالمية لراحتك</p>
            </div>

            <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
              <div className="flex justify-center mb-4">
                <Users className="h-12 w-12 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">دعم فني 24/7</h3>
              <p className="text-gray-600 dark:text-gray-400">فريق دعم متاح على مدار الساعة لمساعدتك وحل مشاكلك</p>
            </div>

            <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
              <div className="flex justify-center mb-4">
                <Trophy className="h-12 w-12 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">جودة مضمونة</h3>
              <p className="text-gray-600 dark:text-gray-400">جميع الحسابات والخدمات مفحوصة ومضمونة الجودة</p>
            </div>

            <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
              <div className="flex justify-center mb-4">
                <Star className="h-12 w-12 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">أسعار تنافسية</h3>
              <p className="text-gray-600 dark:text-gray-400">أفضل الأسعار في السوق مع عروض وخصومات مستمرة</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-100 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">ماذا يقول عملاؤنا</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <TestimonialCard
              name="أحمد محمد"
              rating={5}
              comment="خدمة ممتازة وسريعة، تم تسليم الشحنة خلال دقائق"
              game="PUBG Mobile"
            />
            <TestimonialCard
              name="فاطمة علي"
              rating={5}
              comment="أفضل موقع لشراء حسابات الألعاب، جودة عالية وأسعار مناسبة"
              game="Free Fire"
            />
            <TestimonialCard
              name="محمد سالم"
              rating={4}
              comment="دعم فني ممتاز ومساعدة سريعة، أنصح بالتعامل معهم"
              game="Fortnite"
            />
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
