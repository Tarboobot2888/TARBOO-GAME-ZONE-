"use client"

import type React from "react"
import { Star, Shield, TrendingUp, ShoppingCart, Eye } from "lucide-react"
import { formatCurrency } from "../utils/currency"

interface GameAccount {
  id: string
  gameId: string
  gameName: string
  title: string
  description: string
  price: number
  originalPrice?: number
  discount?: number
  images: string[]
  level: number
  rank: string
  platform: "android" | "ios" | "pc"
  region: string
  status: "available" | "sold" | "reserved" | "pending"
  features: string[]
  stats: {
    views: number
    likes: number
    purchases: number
  }
  seller: {
    id: string
    name: string
    rating: number
    verified: boolean
  }
  isVerified: boolean
  isFeatured: boolean
  isPopular: boolean
  condition: "new" | "used" | "excellent"
  warranty: boolean
  guaranteeDays: number
}

interface GameAccountCardProps {
  account: GameAccount
  viewMode: "grid" | "list"
  onAddToCart: () => void
  onViewDetails: () => void
}

const GameAccountCard: React.FC<GameAccountCardProps> = ({ account, viewMode, onAddToCart, onViewDetails }) => {
  const discountPercentage = account.originalPrice
    ? Math.round(((account.originalPrice - account.price) / account.originalPrice) * 100)
    : 0

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "android":
        return "🤖"
      case "ios":
        return "🍎"
      case "pc":
        return "💻"
      default:
        return "🎮"
    }
  }

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "new":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "excellent":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "used":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  if (viewMode === "list") {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
        <div className="flex gap-6">
          {/* Image */}
          <div className="flex-shrink-0">
            <img
              src={account.images[0] || "/placeholder.svg?height=120&width=120"}
              alt={account.title}
              className="w-24 h-24 rounded-lg object-cover"
            />
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{account.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{account.gameName}</p>
              </div>
              <div className="flex gap-2">
                {account.isPopular && (
                  <span className="bg-yellow-500 text-black px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    شائع
                  </span>
                )}
                {account.isFeatured && (
                  <span className="bg-purple-500 text-white px-2 py-1 rounded-full text-xs font-semibold">مميز</span>
                )}
              </div>
            </div>

            <p className="text-gray-700 dark:text-gray-300 text-sm mb-3 line-clamp-2">{account.description}</p>

            <div className="flex items-center gap-4 mb-3 text-sm">
              <div className="flex items-center gap-1">
                <span className="text-2xl">{getPlatformIcon(account.platform)}</span>
                <span className="text-gray-600 dark:text-gray-400">{account.platform.toUpperCase()}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-semibold">المستوى:</span>
                <span className="text-blue-600">{account.level}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-semibold">الرتبة:</span>
                <span className="text-purple-600">{account.rank}</span>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getConditionColor(account.condition)}`}>
                {account.condition === "new" ? "جديد" : account.condition === "excellent" ? "ممتاز" : "مستعمل"}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div>
                  {account.originalPrice && (
                    <span className="text-sm text-gray-500 line-through ml-2">
                      {formatCurrency(account.originalPrice)}
                    </span>
                  )}
                  <span className="text-2xl font-bold text-green-600">{formatCurrency(account.price)}</span>
                  {discountPercentage > 0 && (
                    <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold mr-2">
                      -{discountPercentage}%
                    </span>
                  )}
                </div>
                {account.warranty && (
                  <div className="flex items-center gap-1 text-green-600 text-sm">
                    <Shield className="h-4 w-4" />
                    <span>ضمان {account.guaranteeDays} يوم</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={onViewDetails}
                  className="flex items-center gap-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  <Eye className="h-4 w-4" />
                  عرض التفاصيل
                </button>
                <button
                  onClick={onAddToCart}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <ShoppingCart className="h-4 w-4" />
                  إضافة للسلة
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow group">
      <div className="relative">
        <img
          src={account.images[0] || "/placeholder.svg?height=200&width=300"}
          alt={account.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Badges */}
        <div className="absolute top-2 right-2 flex flex-col gap-2">
          {account.isPopular && (
            <span className="bg-yellow-500 text-black px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              شائع
            </span>
          )}
          {account.isFeatured && (
            <span className="bg-purple-500 text-white px-2 py-1 rounded-full text-xs font-semibold">مميز</span>
          )}
          {discountPercentage > 0 && (
            <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
              -{discountPercentage}%
            </span>
          )}
        </div>

        {/* Platform */}
        <div className="absolute top-2 left-2">
          <span className="bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
            <span className="text-sm">{getPlatformIcon(account.platform)}</span>
            {account.platform.toUpperCase()}
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">{account.title}</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">{account.gameName}</p>
        <p className="text-gray-700 dark:text-gray-300 text-sm mb-3 line-clamp-2">{account.description}</p>

        {/* Stats */}
        <div className="flex items-center justify-between mb-3 text-sm">
          <div className="flex items-center gap-1">
            <span className="font-semibold">المستوى:</span>
            <span className="text-blue-600">{account.level}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-semibold">الرتبة:</span>
            <span className="text-purple-600">{account.rank}</span>
          </div>
        </div>

        {/* Condition */}
        <div className="mb-3">
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getConditionColor(account.condition)}`}>
            {account.condition === "new" ? "جديد" : account.condition === "excellent" ? "ممتاز" : "مستعمل"}
          </span>
        </div>

        {/* Features */}
        {account.features.length > 0 && (
          <div className="mb-3">
            <div className="flex flex-wrap gap-1">
              {account.features.slice(0, 2).map((feature, index) => (
                <span
                  key={index}
                  className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-xs"
                >
                  {feature}
                </span>
              ))}
              {account.features.length > 2 && (
                <span className="text-xs text-gray-500">+{account.features.length - 2} المزيد</span>
              )}
            </div>
          </div>
        )}

        {/* Seller Info */}
        <div className="flex items-center gap-2 mb-3 text-sm">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-500 fill-current" />
            <span>{account.seller.rating}</span>
          </div>
          <span className="text-gray-600 dark:text-gray-400">{account.seller.name}</span>
          {account.seller.verified && <Shield className="h-4 w-4 text-green-500" title="بائع موثق" />}
        </div>

        {/* Price */}
        <div className="mb-4">
          {account.originalPrice && (
            <span className="text-sm text-gray-500 line-through block">{formatCurrency(account.originalPrice)}</span>
          )}
          <span className="text-xl font-bold text-green-600">{formatCurrency(account.price)}</span>
        </div>

        {/* Warranty */}
        {account.warranty && (
          <div className="flex items-center gap-1 text-green-600 text-sm mb-4">
            <Shield className="h-4 w-4" />
            <span>ضمان {account.guaranteeDays} يوم</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={onViewDetails}
            className="flex-1 flex items-center justify-center gap-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
          >
            <Eye className="h-4 w-4" />
            التفاصيل
          </button>
          <button
            onClick={onAddToCart}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            <ShoppingCart className="h-4 w-4" />
            إضافة للسلة
          </button>
        </div>
      </div>
    </div>
  )
}

export default GameAccountCard
