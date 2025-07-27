"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { useRouter } from "next/navigation"
import { ArrowRight, Star, Shield, Eye, ShoppingCart, Heart, Share2 } from "lucide-react"
import { useInventory } from "../contexts/InventoryContext"
import { useAuth } from "../contexts/AuthContext"
import { useCart } from "../contexts/CartContext"
import { useNotification } from "../contexts/NotificationContext"
import LoadingSpinner from "../components/LoadingSpinner"
import { formatCurrency } from "../utils/currency"

const AccountDetails: React.FC = () => {
  const params = useParams()
  const router = useRouter()
  const { currentUser } = useAuth()
  const { addToCart } = useCart()
  const { addNotification } = useNotification()
  const { getAccountById, incrementAccountViews } = useInventory()

  const [account, setAccount] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  const id = params?.id as string

  useEffect(() => {
    if (id) {
      const accountData = getAccountById(id)
      if (accountData) {
        setAccount(accountData)
        incrementAccountViews(id)
      }
      setLoading(false)
    }
  }, [id])

  const handleAddToCart = () => {
    if (!currentUser) {
      addNotification({
        type: "warning",
        title: "تسجيل الدخول مطلوب",
        message: "يجب تسجيل الدخول أولاً لإضافة العناصر للسلة",
      })
      router.push("/login")
      return
    }

    addToCart({
      id: account.id,
      type: "account",
      gameId: account.gameId,
      gameName: account.gameName,
      title: account.title,
      price: account.price,
      image: account.images[0] || `/placeholder.svg?height=200&width=300&text=${account.gameName}`,
      details: account,
    })

    addNotification({
      type: "success",
      title: "تم الإضافة للسلة",
      message: `تم إضافة ${account.title} للسلة بنجاح`,
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="جاري تحميل تفاصيل الحساب..." />
      </div>
    )
  }

  if (!account) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">الحساب غير موجود</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">لم يتم العثور على الحساب المطلوب</p>
          <button
            onClick={() => router.push("/buy-accounts")}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            العودة للحسابات
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
          <button onClick={() => router.push("/")} className="hover:text-blue-600">
            الرئيسية
          </button>
          <ArrowRight className="h-4 w-4" />
          <button onClick={() => router.push("/buy-accounts")} className="hover:text-blue-600">
            شراء حسابات
          </button>
          <ArrowRight className="h-4 w-4" />
          <span className="text-gray-900 dark:text-white">{account.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Images */}
          <div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              <img
                src={account.images[selectedImageIndex] || "/placeholder.svg?height=400&width=600"}
                alt={account.title}
                className="w-full h-96 object-cover"
              />
            </div>
            {account.images.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto">
                {account.images.map((image: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      selectedImageIndex === index ? "border-blue-500" : "border-gray-200 dark:border-gray-700"
                    }`}
                  >
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`صورة ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{account.title}</h1>
                <p className="text-gray-600 dark:text-gray-400">{account.gameName}</p>
              </div>
              <div className="flex gap-2">
                <button className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600">
                  <Heart className="h-5 w-5" />
                </button>
                <button className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600">
                  <Share2 className="h-5 w-5" />
                </button>
              </div>
            </div>

            <p className="text-gray-700 dark:text-gray-300 mb-6">{account.description}</p>

            {/* Price */}
            <div className="mb-6">
              {account.originalPrice && (
                <span className="text-lg text-gray-500 line-through ml-2">{formatCurrency(account.originalPrice)}</span>
              )}
              <span className="text-3xl font-bold text-green-600">{formatCurrency(account.price)}</span>
              {account.originalPrice && (
                <span className="bg-red-500 text-white px-2 py-1 rounded-full text-sm font-semibold mr-2">
                  -{Math.round(((account.originalPrice - account.price) / account.originalPrice) * 100)}%
                </span>
              )}
            </div>

            {/* Account Info */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">معلومات الحساب</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">المستوى:</span>
                    <span className="font-semibold">{account.level}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">الرتبة:</span>
                    <span className="font-semibold">{account.rank}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">المنصة:</span>
                    <span className="font-semibold">{account.platform.toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">المنطقة:</span>
                    <span className="font-semibold">{account.region}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">البائع</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600 dark:text-gray-400">{account.seller.name}</span>
                    {account.seller.verified && <Shield className="h-4 w-4 text-green-500" />}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="font-semibold">{account.seller.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-400">{account.stats.views} مشاهدة</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Features */}
            {account.features.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">المميزات</h3>
                <div className="flex flex-wrap gap-2">
                  {account.features.map((feature: string, index: number) => (
                    <span
                      key={index}
                      className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Warranty */}
            {account.warranty && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                  <Shield className="h-5 w-5" />
                  <span className="font-semibold">ضمان {account.guaranteeDays} يوم</span>
                </div>
                <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                  نضمن لك استرداد أموالك في حالة وجود أي مشكلة في الحساب
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingCart className="h-5 w-5" />
                إضافة للسلة
              </button>
              <button
                onClick={() => {
                  handleAddToCart()
                  router.push("/checkout")
                }}
                className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                شراء الآن
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccountDetails
