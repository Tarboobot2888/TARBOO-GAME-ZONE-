"use client"

import type React from "react"
import { Routes, Route, Link, useLocation } from "react-router-dom"
import { motion } from "framer-motion"
import { User, ShoppingBag, Heart, Settings, CreditCard, Gift, LogOut } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"
import LoadingSpinner from "../components/LoadingSpinner"

const UserDashboard: React.FC = () => {
  const { currentUser, userData, logout } = useAuth()
  const location = useLocation()

  const menuItems = [
    { id: "overview", label: "نظرة عامة", icon: User, path: "/dashboard" },
    { id: "orders", label: "طلباتي", icon: ShoppingBag, path: "/dashboard/orders" },
    { id: "favorites", label: "المفضلة", icon: Heart, path: "/dashboard/favorites" },
    { id: "wallet", label: "المحفظة", icon: CreditCard, path: "/dashboard/wallet" },
    { id: "rewards", label: "المكافآت", icon: Gift, path: "/dashboard/rewards" },
    { id: "settings", label: "الإعدادات", icon: Settings, path: "/dashboard/settings" },
  ]

  if (!currentUser || !userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="جاري تحميل لوحة التحكم..." />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              {/* User Info */}
              <div className="text-center mb-6">
                <img
                  src={userData.photoURL || "/placeholder.svg?height=80&width=80"}
                  alt="Profile"
                  className="w-20 h-20 rounded-full mx-auto mb-4"
                />
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{userData.displayName}</h2>
                <p className="text-gray-600 dark:text-gray-400">{userData.email}</p>
                <div className="mt-2">
                  <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full text-xs">
                    {userData.loyalty.level}
                  </span>
                </div>
              </div>

              {/* Menu */}
              <nav className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon
                  const isActive = location.pathname === item.path
                  return (
                    <Link
                      key={item.id}
                      to={item.path}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive
                          ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      {item.label}
                    </Link>
                  )
                })}
                <button
                  onClick={logout}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors w-full text-right"
                >
                  <LogOut className="h-5 w-5" />
                  تسجيل الخروج
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Routes>
              <Route path="/" element={<DashboardOverview />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="/wallet" element={<WalletPage />} />
              <Route path="/rewards" element={<RewardsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  )
}

// Dashboard Overview Component
const DashboardOverview: React.FC = () => {
  const { userData } = useAuth()

  const stats = [
    { label: "إجمالي الطلبات", value: userData?.totalOrders || 0, color: "bg-blue-500" },
    { label: "إجمالي الإنفاق", value: `${userData?.totalSpent || 0} جنيه`, color: "bg-green-500" },
    { label: "نقاط الولاء", value: userData?.loyalty.points || 0, color: "bg-purple-500" },
    { label: "رصيد المحفظة", value: `${userData?.wallet.balance || 0} جنيه`, color: "bg-yellow-500" },
  ]

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">نظرة عامة</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center mr-4`}>
                <span className="text-white font-bold text-lg">{index + 1}</span>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">النشاط الأخير</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <ShoppingBag className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900 dark:text-white">طلب جديد</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">تم إنشاء طلب شحن PUBG Mobile</p>
            </div>
            <span className="text-sm text-gray-500">منذ ساعتين</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// Placeholder components for other pages
const OrdersPage: React.FC = () => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">طلباتي</h1>
    <p className="text-gray-600 dark:text-gray-400">لا توجد طلبات حتى الآن</p>
  </div>
)

const FavoritesPage: React.FC = () => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">المفضلة</h1>
    <p className="text-gray-600 dark:text-gray-400">لا توجد عناصر مفضلة حتى الآن</p>
  </div>
)

const WalletPage: React.FC = () => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">المحفظة</h1>
    <p className="text-gray-600 dark:text-gray-400">رصيد المحفظة: 0 جنيه</p>
  </div>
)

const RewardsPage: React.FC = () => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">المكافآت</h1>
    <p className="text-gray-600 dark:text-gray-400">لا توجد مكافآت متاحة حتى الآن</p>
  </div>
)

const SettingsPage: React.FC = () => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">الإعدادات</h1>
    <p className="text-gray-600 dark:text-gray-400">إعدادات الحساب</p>
  </div>
)

export default UserDashboard
