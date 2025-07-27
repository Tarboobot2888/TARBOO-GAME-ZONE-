"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { User, ShoppingBag, CreditCard, Settings, Bell, Eye, Edit, Download } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"
import { useCart } from "../contexts/CartContext"
import { useNotification } from "../contexts/NotificationContext"
import LoadingSpinner from "../components/LoadingSpinner"
import { formatCurrency } from "../utils/currency"

const UserDashboard: React.FC = () => {
  const { currentUser, updateProfile } = useAuth()
  const { items, clearCart } = useCart()
  const { addNotification } = useNotification()

  const [activeTab, setActiveTab] = useState("overview")
  const [loading, setLoading] = useState(false)
  const [orders] = useState([
    {
      id: "1",
      date: "2024-01-15",
      type: "recharge",
      gameName: "PUBG Mobile",
      amount: 50,
      status: "completed",
    },
    {
      id: "2",
      date: "2024-01-10",
      type: "account",
      gameName: "FIFA Mobile",
      amount: 150,
      status: "completed",
    },
  ])

  const [profileData, setProfileData] = useState({
    displayName: currentUser?.displayName || "",
    email: currentUser?.email || "",
    phone: "",
  })

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await updateProfile({
        displayName: profileData.displayName,
      })

      addNotification({
        type: "success",
        title: "تم تحديث الملف الشخصي",
        message: "تم حفظ التغييرات بنجاح",
      })
    } catch (error: any) {
      addNotification({
        type: "error",
        title: "خطأ في التحديث",
        message: error.message || "حدث خطأ أثناء تحديث الملف الشخصي",
      })
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { id: "overview", label: "نظرة عامة", icon: User },
    { id: "orders", label: "طلباتي", icon: ShoppingBag },
    { id: "profile", label: "الملف الشخصي", icon: Settings },
    { id: "notifications", label: "الإشعارات", icon: Bell },
  ]

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">إجمالي الطلبات</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{orders.length}</p>
            </div>
            <ShoppingBag className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">إجمالي الإنفاق</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(orders.reduce((sum, order) => sum + order.amount, 0))}
              </p>
            </div>
            <CreditCard className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">عناصر في السلة</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{items.length}</p>
            </div>
            <ShoppingBag className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">الطلبات الأخيرة</h3>
        <div className="space-y-4">
          {orders.slice(0, 3).map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">{order.gameName}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{order.date}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-green-600">{formatCurrency(order.amount)}</p>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  مكتمل
                </span>
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
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">جميع الطلبات</h3>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">طلب #{order.id}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{order.date}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                    <Eye className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400">
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-900 dark:text-white">{order.gameName}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {order.type === "recharge" ? "شحن" : "حساب"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">{formatCurrency(order.amount)}</p>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    مكتمل
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderProfile = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">الملف الشخصي</h3>
      </div>
      <div className="p-6">
        <form onSubmit={handleProfileUpdate} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">الاسم الكامل</label>
            <input
              type="text"
              value={profileData.displayName}
              onChange={(e) => setProfileData({ ...profileData, displayName: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">البريد الإلكتروني</label>
            <input
              type="email"
              value={profileData.email}
              disabled
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-400"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">لا يمكن تغيير البريد الإلكتروني</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">رقم الهاتف</label>
            <input
              type="tel"
              value={profileData.phone}
              onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="أدخل رقم هاتفك"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {loading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>
                  <Edit className="h-4 w-4" />
                  حفظ التغييرات
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )

  const renderNotifications = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">إعدادات الإشعارات</h3>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">إشعارات الطلبات</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">تلقي إشعارات عند تحديث حالة الطلبات</p>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">إشعارات العروض</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">تلقي إشعارات عن العروض والخصومات الجديدة</p>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">إشعارات الأمان</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">تلقي إشعارات عن أنشطة الحساب المهمة</p>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>
        </div>
      </div>
    </div>
  )

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="جاري تحميل لوحة التحكم..." />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            مرحباً، {currentUser.displayName || "المستخدم"}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">إدارة حسابك وطلباتك من هنا</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div className="mr-3">
                  <p className="font-semibold text-gray-900 dark:text-white">{currentUser.displayName || "المستخدم"}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{currentUser.email}</p>
                </div>
              </div>

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
          <div className="lg:col-span-3">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {activeTab === "overview" && renderOverview()}
              {activeTab === "orders" && renderOrders()}
              {activeTab === "profile" && renderProfile()}
              {activeTab === "notifications" && renderNotifications()}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserDashboard
