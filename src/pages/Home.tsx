"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Gamepad2, Zap, Shield, Clock, Star, ArrowLeft, TrendingUp, Users, Award } from "lucide-react"
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore"
import { db } from "../firebase/config"
import GameCard from "../components/GameCard"
import TestimonialCard from "../components/TestimonialCard"

interface Game {
  id: string
  name: string
  nameAr: string
  image: string
  category: string
  isPopular: boolean
  minPrice: number
  maxPrice: number
}

interface Stats {
  totalUsers: number
  totalOrders: number
  totalGames: number
  satisfaction: number
}

const Home: React.FC = () => {
  const [popularGames, setPopularGames] = useState<Game[]>([])
  const [stats, setStats] = useState<Stats>({
    totalUsers: 15420,
    totalOrders: 8750,
    totalGames: 25,
    satisfaction: 98,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPopularGames()
  }, [])

  const fetchPopularGames = async () => {
    try {
      const gamesRef = collection(db, "games")
      const q = query(gamesRef, orderBy("popularity", "desc"), limit(6))
      const snapshot = await getDocs(q)

      const games = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Game[]

      setPopularGames(games)
    } catch (error) {
      console.error("Error fetching games:", error)
      // Fallback data
      setPopularGames([
        {
          id: "1",
          name: "FIFA Mobile",
          nameAr: "فيفا موبايل",
          image: "/placeholder.svg?height=200&width=300",
          category: "sports",
          isPopular: true,
          minPrice: 50,
          maxPrice: 500,
        },
        {
          id: "2",
          name: "PUBG Mobile",
          nameAr: "ببجي موبايل",
          image: "/placeholder.svg?height=200&width=300",
          category: "battle-royale",
          isPopular: true,
          minPrice: 25,
          maxPrice: 1000,
        },
        {
          id: "3",
          name: "Free Fire",
          nameAr: "فري فاير",
          image: "/placeholder.svg?height=200&width=300",
          category: "battle-royale",
          isPopular: true,
          minPrice: 20,
          maxPrice: 800,
        },
        {
          id: "4",
          name: "Call of Duty Mobile",
          nameAr: "كول أوف ديوتي موبايل",
          image: "/placeholder.svg?height=200&width=300",
          category: "fps",
          isPopular: true,
          minPrice: 30,
          maxPrice: 600,
        },
        {
          id: "5",
          name: "PES Mobile",
          nameAr: "بيس موبايل",
          image: "/placeholder.svg?height=200&width=300",
          category: "sports",
          isPopular: true,
          minPrice: 40,
          maxPrice: 400,
        },
        {
          id: "6",
          name: "Clash of Clans",
          nameAr: "كلاش أوف كلانس",
          image: "/placeholder.svg?height=200&width=300",
          category: "strategy",
          isPopular: true,
          minPrice: 35,
          maxPrice: 700,
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const testimonials = [
    {
      id: "1",
      name: "أحمد محمد",
      rating: 5,
      comment: "خدمة ممتازة وسريعة، تم شحن حسابي في دقائق معدودة!",
      game: "PUBG Mobile",
      avatar: "/placeholder.svg?height=50&width=50",
    },
    {
      id: "2",
      name: "فاطمة علي",
      rating: 5,
      comment: "أفضل موقع لشراء حسابات الألعاب، أسعار معقولة وجودة عالية",
      game: "FIFA Mobile",
      avatar: "/placeholder.svg?height=50&width=50",
    },
    {
      id: "3",
      name: "محمود حسن",
      rating: 5,
      comment: "دعم فني ممتاز ومساعدة في كل وقت، أنصح بالتعامل معهم",
      game: "Free Fire",
      avatar: "/placeholder.svg?height=50&width=50",
    },
  ]

  const features = [
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
      title: "جودة عالية",
      description: "حسابات مميزة ومضمونة 100%",
    },
  ]

  const steps = [
    {
      number: "1",
      title: "اختر اللعبة",
      description: "حدد اللعبة التي تريد شحنها أو شراء حساب لها",
    },
    {
      number: "2",
      title: "اختر الباقة",
      description: "اختر الباقة المناسبة لك من الخيارات المتاحة",
    },
    {
      number: "3",
      title: "أدخل البيانات",
      description: "أدخل معرف اللعبة أو بيانات الحساب المطلوبة",
    },
    {
      number: "4",
      title: "ادفع واستلم",
      description: "اختر طريقة الدفع المناسبة واستلم طلبك فوراً",
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                مرحباً بك في <span className="text-yellow-400">GameZone</span>
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-gray-200">
                منصتك الموثوقة لشحن الألعاب وشراء الحسابات المميزة
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/recharge"
                  className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-4 rounded-lg font-semibold text-lg transition-colors inline-flex items-center justify-center"
                >
                  <Zap className="h-5 w-5 ml-2" />
                  شحن الآن
                </Link>
                <Link
                  to="/buy-accounts"
                  className="bg-transparent border-2 border-white hover:bg-white hover:text-gray-900 px-8 py-4 rounded-lg font-semibold text-lg transition-colors inline-flex items-center justify-center"
                >
                  <Gamepad2 className="h-5 w-5 ml-2" />
                  شراء حسابات
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Animated Background Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-400 rounded-full opacity-20 animate-bounce"></div>
        <div className="absolute bottom-10 right-10 w-16 h-16 bg-purple-400 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-blue-400 rounded-full opacity-20 animate-ping"></div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <div className="flex items-center justify-center mb-2">
                <Users className="h-8 w-8 text-blue-600 ml-2" />
                <span className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stats.totalUsers.toLocaleString()}+
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-400">مستخدم راضي</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-center"
            >
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="h-8 w-8 text-green-600 ml-2" />
                <span className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stats.totalOrders.toLocaleString()}+
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-400">طلب مكتمل</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center"
            >
              <div className="flex items-center justify-center mb-2">
                <Gamepad2 className="h-8 w-8 text-purple-600 ml-2" />
                <span className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalGames}+</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400">لعبة مدعومة</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center"
            >
              <div className="flex items-center justify-center mb-2">
                <Award className="h-8 w-8 text-yellow-600 ml-2" />
                <span className="text-3xl font-bold text-gray-900 dark:text-white">{stats.satisfaction}%</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400">نسبة الرضا</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">لماذا تختار GameZone؟</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">نقدم أفضل الخدمات في عالم الألعاب الإلكترونية</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow"
              >
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Games Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                الألعاب الأكثر شعبية
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">اكتشف أشهر الألعاب وأكثرها طلباً</p>
            </div>
            <Link
              to="/buy-accounts"
              className="hidden md:flex items-center text-blue-600 hover:text-blue-700 font-semibold"
            >
              عرض الكل
              <ArrowLeft className="h-5 w-5 mr-2" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-gray-200 dark:bg-gray-700 rounded-lg h-64 animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {popularGames.map((game, index) => (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <GameCard game={game} />
                </motion.div>
              ))}
            </div>
          )}

          <div className="text-center mt-8 md:hidden">
            <Link
              to="/buy-accounts"
              className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              عرض جميع الألعاب
              <ArrowLeft className="h-5 w-5 mr-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">كيف يعمل الموقع؟</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">خطوات بسيطة للحصول على ما تريد</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{step.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">ماذا يقول عملاؤنا؟</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">آراء حقيقية من عملائنا الكرام</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <TestimonialCard testimonial={testimonial} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">ابدأ رحلتك في عالم الألعاب الآن!</h2>
            <p className="text-xl mb-8 text-gray-200">انضم إلى آلاف اللاعبين الذين يثقون في خدماتنا</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-4 rounded-lg font-semibold text-lg transition-colors inline-flex items-center justify-center"
              >
                إنشاء حساب مجاني
              </Link>
              <Link
                to="/recharge"
                className="bg-transparent border-2 border-white hover:bg-white hover:text-gray-900 px-8 py-4 rounded-lg font-semibold text-lg transition-colors inline-flex items-center justify-center"
              >
                <Zap className="h-5 w-5 ml-2" />
                شحن فوري
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Home
