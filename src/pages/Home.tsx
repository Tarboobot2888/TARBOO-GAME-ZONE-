"use client"

import type React from "react"
import { useEffect } from "react"
import { motion } from "framer-motion"
import { Gamepad2, ShoppingCart, Shield, Zap, Trophy, ArrowRight, CheckCircle, Clock, CreditCard } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"
import { useInventory } from "../contexts/InventoryContext"
import { logPageView } from "../services/analytics"
import GameCard from "../components/GameCard"
import TestimonialCard from "../components/TestimonialCard"

const Home: React.FC = () => {
  const { currentUser } = useAuth()
  const { games, featuredAccounts, loading } = useInventory()

  useEffect(() => {
    logPageView("home", currentUser?.uid)
  }, [currentUser])

  const features = [
    {
      icon: <Zap className="h-8 w-8 text-yellow-500" />,
      title: "شحن فوري",
      description: "احصل على شحنتك في أقل من دقيقة واحدة",
    },
    {
      icon: <Shield className="h-8 w-8 text-green-500" />,
      title: "آمن ومضمون",
      description: "جميع المعاملات محمية بأعلى معايير الأمان",
    },
    {
      icon: <CreditCard className="h-8 w-8 text-blue-500" />,
      title: "طرق دفع متعددة",
      description: "ادفع بالطريقة التي تناسبك",
    },
    {
      icon: <Clock className="h-8 w-8 text-purple-500" />,
      title: "خدمة 24/7",
      description: "فريق الدعم متاح على مدار الساعة",
    },
  ]

  const stats = [
    { number: "50K+", label: "عميل راضي" },
    { number: "100+", label: "لعبة متاحة" },
    { number: "99.9%", label: "معدل النجاح" },
    { number: "24/7", label: "دعم فني" },
  ]

  const testimonials = [
    {
      name: "أحمد محمد",
      rating: 5,
      comment: "خدمة ممتازة وسريعة، أنصح بها بشدة!",
      avatar: "/placeholder-user.jpg",
    },
    {
      name: "فاطمة علي",
      rating: 5,
      comment: "أفضل موقع لشحن الألعاب، أسعار منافسة وخدمة رائعة",
      avatar: "/placeholder-user.jpg",
    },
    {
      name: "محمد سالم",
      rating: 5,
      comment: "سرعة في التنفيذ وأمان في التعامل، شكراً لكم",
      avatar: "/placeholder-user.jpg",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <Gamepad2 className="inline-block h-16 w-16 ml-4 text-yellow-400" />
              مرحباً بك في GameZone
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200">منصتك المفضلة لشحن الألعاب وشراء الحسابات المميزة</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-4 rounded-lg font-bold text-lg transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Zap className="h-6 w-6" />
                شحن الآن
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-transparent border-2 border-white hover:bg-white hover:text-gray-900 px-8 py-4 rounded-lg font-bold text-lg transition-all duration-200 flex items-center justify-center gap-2"
              >
                <ShoppingCart className="h-6 w-6" />
                تصفح الحسابات
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 dark:text-gray-400 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">لماذا تختار GameZone؟</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">نقدم لك أفضل تجربة في عالم الألعاب</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg mb-4 mx-auto">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 text-center">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-center">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Games Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">الألعاب الأكثر شعبية</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">اشحن ألعابك المفضلة بأفضل الأسعار</p>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-gray-300 dark:bg-gray-700 h-32 rounded-lg mb-4"></div>
                  <div className="bg-gray-300 dark:bg-gray-700 h-4 rounded mb-2"></div>
                  <div className="bg-gray-300 dark:bg-gray-700 h-3 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {games.slice(0, 6).map((game, index) => (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <GameCard game={game} />
                </motion.div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 mx-auto"
            >
              عرض جميع الألعاب
              <ArrowRight className="h-5 w-5" />
            </motion.button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">ماذا يقول عملاؤنا؟</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">آراء حقيقية من عملائنا الكرام</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
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
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">ابدأ رحلتك معنا الآن!</h2>
            <p className="text-xl mb-8 text-gray-200">انضم إلى آلاف اللاعبين الذين يثقون بنا</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-bold text-lg transition-all duration-200 flex items-center justify-center gap-2"
              >
                <CheckCircle className="h-6 w-6" />
                إنشاء حساب مجاني
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-transparent border-2 border-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-lg font-bold text-lg transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Trophy className="h-6 w-6" />
                تصفح العروض
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Home
