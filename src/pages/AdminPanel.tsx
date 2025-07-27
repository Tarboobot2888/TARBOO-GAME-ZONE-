"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { Users, ShoppingBag, DollarSign, TrendingUp, Plus, Edit, Trash2, Eye, Search } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"
import { useInventory } from "../contexts/InventoryContext"
import { useNotification } from "../contexts/NotificationContext"
import LoadingSpinner from "../components/LoadingSpinner"
import AdminRoute from "../components/AdminRoute"
import { formatCurrency } from "../utils/currency"

const AdminPanel: React.FC = () => {
  const { currentUser } = useAuth()
  const { games, accounts, rechargePackages, loading } = useInventory()
  const { addNotification } = useNotification()

  const [activeTab, setActiveTab] = useState("dashboard")
  const [searchQuery, setSearchQuery] = useState("")

  // Mock data for admin dashboard
  const [stats] = useState({
    totalUsers: 1250,
    totalOrders: 3420,
    totalRevenue: 125000,
    monthlyGrowth: 12.5,
  })

  const [recentOrders] = useState([
    {
      id: "1",
      user: "أحمد محمد",
      game: "PUBG Mobile",
      amount: 50,
      status: "completed",
      date: "2024-01-15",
    },
    {
      id: "2",
      user: "فاطمة علي",
      game: "FIFA Mobile",
      amount: 100,
      status: "pending",
      date: "2024-01-15",
    },
  ])

  const tabs = [
    { id: "dashboard", label: "لوحة التحكم", icon: TrendingUp },
    { id: "games", label: "الألعاب", icon: ShoppingBag },
    { id: "accounts", label: "الحسابات", icon: Users },
    { id: "packages", label: "باقات الشحن", icon: DollarSign },
    { id: "orders", label: "الطلبات", icon: ShoppingBag },
  ]

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">إجمالي المستخدمين</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalUsers.toLocaleString()}</p>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">إجمالي الطلبات</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalOrders.toLocaleString()}</p>
            </div>
            <ShoppingBag className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">إجمالي الإيرادات</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(stats.totalRevenue)}</p>
            </div>
            <DollarSign className="h-8 w-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">النمو الشهري</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">+{stats.monthlyGrowth}%</p>
            </div>
            <TrendingUp className="h-8 w-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">الطلبات الأخيرة</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{order.user}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {order.game} - {order.date}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="font-semibold text-green-600">{formatCurrency(order.amount)}</p>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      order.status === "completed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {order.status === "completed" ? "مكتمل" : "قيد المعالجة"}
                  </span>
                  <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                    <Eye className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  const renderGames = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">إدارة الألعاب</h3>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Plus className="h-4 w-4" />
            إضافة لعبة
          </button>
        </div>
      </div>
      <div className="p-6">
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن الألعاب..."
              className="w-full pr-10 pl-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => (
            <div key={game.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <img
                  src={game.image || "/placeholder.svg"}
                  alt={game.nameAr}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="flex items-center gap-2">
                  <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{game.nameAr}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{game.name}</p>
              <div className="flex items-center justify-between">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    game.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}
                >
                  {game.isActive ? "نشط" : "غير نشط"}
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400">{game.category}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderAccounts = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">إدارة الحسابات</h3>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Plus className="h-4 w-4" />
            إضافة حساب
          </button>
        </div>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {accounts.slice(0, 10).map((account) => (
            <div key={account.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img
                    src={account.images?.[0] || "/placeholder.svg"}
                    alt={account.title}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">{account.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{account.gameName}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      المستوى: {account.level} | الرتبة: {account.rank}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-semibold text-green-600">{formatCurrency(account.price)}</p>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        account.isAvailable ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {account.isAvailable ? "متاح" : "مباع"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderPackages = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">إدارة باقات الشحن</h3>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Plus className="h-4 w-4" />
            إضافة باقة
          </button>
        </div>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rechargePackages.map((pkg) => (
            <div key={pkg.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">{pkg.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{pkg.gameName}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">الكمية:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{pkg.amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">السعر:</span>
                  <span className="font-semibold text-green-600">{formatCurrency(pkg.price)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">الحالة:</span>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      pkg.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    {pkg.isActive ? "نشط" : "غير نشط"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderOrders = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">إدارة الطلبات</h3>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {recentOrders.map((order) => (
            <div key={order.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">طلب #{order.id}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {order.user} - {order.game}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{order.date}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-semibold text-green-600">{formatCurrency(order.amount)}</p>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        order.status === "completed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {order.status === "completed" ? "مكتمل" : "قيد المعالجة"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                      <Edit className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="جاري تحميل لوحة الإدارة..." />
      </div>
    )
  }

  return (
    <AdminRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">لوحة الإدارة</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">إدارة المنصة والمحتوى</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <nav className="space-y-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center px-4 py-3 text-right rounded-lg transition-colors ${
                          activeTab === tab.id
                            ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                        }`}
                      >
                        <Icon className="h-5 w-5 ml-3" />
                        {tab.label}
                      </button>
                    )
                  })}
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-4">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                {activeTab === "dashboard" && renderDashboard()}
                {activeTab === "games" && renderGames()}
                {activeTab === "accounts" && renderAccounts()}
                {activeTab === "packages" && renderPackages()}
                {activeTab === "orders" && renderOrders()}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </AdminRoute>
  )
}

export default AdminPanel
