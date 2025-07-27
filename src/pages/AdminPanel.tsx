"use client"

import type React from "react"
import { Routes, Route, Link, useLocation } from "react-router-dom"
import { motion } from "framer-motion"
import { Users, ShoppingBag, Settings, BarChart3, Package, Shield } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"

const AdminPanel: React.FC = () => {
  const { currentUser, userData, isAdmin } = useAuth()
  const location = useLocation()

  const menuItems = [
    { id: "overview", label: "نظرة عامة", icon: BarChart3, path: "/admin" },
    { id: "users", label: "المستخدمين", icon: Users, path: "/admin/users" },
    { id: "orders", label: "الطلبات", icon: ShoppingBag, path: "/admin/orders" },
    { id: "accounts", label: "الحسابات", icon: Package, path: "/admin/accounts" },
    { id: "security", label: "الأمان", icon: Shield, path: "/admin/security" },
    { id: "settings", label: "الإعدادات", icon: Settings, path: "/admin/settings" },
  ]

  if (!currentUser || !userData || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">غير مصرح</h2>
          <p className="text-gray-600 dark:text-gray-400">ليس لديك صلاحية للوصول لهذه الصفحة</p>
        </div>
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
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">لوحة الإدارة</h2>
                <p className="text-gray-600 dark:text-gray-400">مرحباً {userData.displayName}</p>
              </div>

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
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Routes>
              <Route path="/" element={<AdminOverview />} />
              <Route path="/users" element={<UsersPage />} />
              <Route path="/orders" element={<AdminOrdersPage />} />
              <Route path="/accounts" element={<AccountsPage />} />
              <Route path="/security" element={<SecurityPage />} />
              <Route path="/settings" element={<AdminSettingsPage />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  )
}

// Admin Overview Component
const AdminOverview: React.FC = () => {
  const stats = [
    { label: "إجمالي المستخدمين", value: "1,234", color: "bg-blue-500" },
    { label: "الطلبات اليوم", value: "56", color: "bg-green-500" },
    { label: "الإيرادات الشهرية", value: "45,678 جنيه", color: "bg-purple-500" },
    { label: "الحسابات المتاحة", value: "789", color: "bg-yellow-500" },
  ]

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">لوحة الإدارة</h1>

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

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">النشاط الأخير</h2>
        <p className="text-gray-600 dark:text-gray-400">لا توجد أنشطة حديثة</p>
      </div>
    </motion.div>
  )
}

// Placeholder components for other admin pages
const UsersPage: React.FC = () => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">إدارة المستخدمين</h1>
    <p className="text-gray-600 dark:text-gray-400">قائمة المستخدمين</p>
  </div>
)

const AdminOrdersPage: React.FC = () => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">إدارة الطلبات</h1>
    <p className="text-gray-600 dark:text-gray-400">قائمة الطلبات</p>
  </div>
)

const AccountsPage: React.FC = () => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">إدارة الحسابات</h1>
    <p className="text-gray-600 dark:text-gray-400">قائمة الحسابات</p>
  </div>
)

const SecurityPage: React.FC = () => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">الأمان</h1>
    <p className="text-gray-600 dark:text-gray-400">إعدادات الأمان</p>
  </div>
)

const AdminSettingsPage: React.FC = () => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">إعدادات النظام</h1>
    <p className="text-gray-600 dark:text-gray-400">إعدادات عامة</p>
  </div>
)

export default AdminPanel
