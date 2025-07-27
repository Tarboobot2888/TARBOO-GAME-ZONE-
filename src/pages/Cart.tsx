"use client"

import type React from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { ShoppingCart, Plus, Minus, Trash2, ArrowRight } from "lucide-react"
import { useCart } from "../contexts/CartContext"
import { useAuth } from "../contexts/AuthContext"
import { useNotification } from "../contexts/NotificationContext"
import { formatCurrency } from "../utils/currency"

const Cart: React.FC = () => {
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const { items, removeFromCart, updateQuantity, clearCart, getTotalPrice, getTotalItems } = useCart()
  const { addNotification } = useNotification()

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(id)
      return
    }
    updateQuantity(id, newQuantity)
  }

  const handleRemoveItem = (id: string, title: string) => {
    removeFromCart(id)
    addNotification({
      type: "success",
      title: "تم الحذف",
      message: `تم حذف ${title} من السلة`,
    })
  }

  const handleClearCart = () => {
    clearCart()
    addNotification({
      type: "success",
      title: "تم مسح السلة",
      message: "تم مسح جميع العناصر من السلة",
    })
  }

  const handleCheckout = () => {
    if (!currentUser) {
      addNotification({
        type: "warning",
        title: "تسجيل الدخول مطلوب",
        message: "يجب تسجيل الدخول أولاً لإتمام الطلب",
      })
      navigate("/login")
      return
    }
    navigate("/checkout")
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ShoppingCart className="h-24 w-24 text-gray-400 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">السلة فارغة</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">لم تقم بإضافة أي عناصر للسلة بعد</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/recharge"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              شحن الألعاب
            </Link>
            <Link
              to="/buy-accounts"
              className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
            >
              شراء حسابات
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">سلة التسوق</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              لديك {getTotalItems()} {getTotalItems() === 1 ? "عنصر" : "عناصر"} في السلة
            </p>
          </div>
          <button
            onClick={handleClearCart}
            className="text-red-600 hover:text-red-700 font-semibold flex items-center gap-2"
          >
            <Trash2 className="h-5 w-5" />
            مسح السلة
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
              >
                <div className="flex gap-4">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.title}
                    className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{item.title}</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">{item.gameName}</p>
                        <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full text-xs">
                          {item.type === "recharge" ? "شحن" : "حساب"}
                        </span>
                      </div>
                      <button
                        onClick={() => handleRemoveItem(item.id, item.title)}
                        className="text-red-600 hover:text-red-700 p-1"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-600"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="font-semibold text-gray-900 dark:text-white w-8 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-600"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="text-left">
                        <p className="text-lg font-bold text-green-600">{formatCurrency(item.price * item.quantity)}</p>
                        {item.quantity > 1 && (
                          <p className="text-sm text-gray-500">{formatCurrency(item.price)} للواحد</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 sticky top-8"
            >
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">ملخص الطلب</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">المجموع الفرعي:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{formatCurrency(getTotalPrice())}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">رسوم الخدمة:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">مجاناً</span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">الإجمالي:</span>
                    <span className="text-lg font-bold text-green-600">{formatCurrency(getTotalPrice())}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                إتمام الطلب
                <ArrowRight className="h-5 w-5" />
              </button>

              <div className="mt-4 text-center">
                <Link to="/" className="text-blue-600 hover:text-blue-700 text-sm">
                  متابعة التسوق
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
