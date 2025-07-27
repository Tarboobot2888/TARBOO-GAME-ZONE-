"use client"

import type React from "react"
import { Star, Clock, Zap, ShoppingCart, Gift } from "lucide-react"
import { formatCurrency } from "../utils/currency"

interface RechargePackage {
  id: string
  gameId: string
  gameName: string
  packageName: string
  amount: number
  bonus?: number
  price: number
  originalPrice?: number
  discount?: number
  currency: string
  description: string
  features: string[]
  deliveryTime: string
  isPopular: boolean
  isFeatured: boolean
  status: "active" | "inactive"
  region: string[]
  platforms: string[]
}

interface RechargePackageCardProps {
  package: RechargePackage
  viewMode: "grid" | "list"
  onAddToCart: () => void
  onInstantRecharge: () => void
}

const RechargePackageCard: React.FC<RechargePackageCardProps> = ({
  package: pkg,
  viewMode,
  onAddToCart,
  onInstantRecharge,
}) => {
  const discountPercentage = pkg.originalPrice
    ? Math.round(((pkg.originalPrice - pkg.price) / pkg.originalPrice) * 100)
    : 0

  if (viewMode === "list") {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">{pkg.packageName}</h3>
              {pkg.isPopular && (
                <span className="bg-yellow-500 text-black px-2 py-1 rounded-full text-xs font-semibold">شائع</span>
              )}
              {pkg.isFeatured && (
                <span className="bg-purple-500 text-white px-2 py-1 rounded-full text-xs font-semibold">مميز</span>
              )}
            </div>

            <p className="text-gray-600 dark:text-gray-400 mb-2">{pkg.gameName}</p>
            <p className="text-gray-700 dark:text-gray-300 mb-3">{pkg.description}</p>

            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {pkg.deliveryTime}
              </div>
              <div className="flex items-center gap-1">
                <Gift className="h-4 w-4" />
                {pkg.amount} {pkg.bonus && `+ ${pkg.bonus} مجاناً`}
              </div>
            </div>
          </div>

          <div className="text-left">
            <div className="mb-3">
              {pkg.originalPrice && (
                <span className="text-sm text-gray-500 line-through ml-2">{formatCurrency(pkg.originalPrice)}</span>
              )}
              <span className="text-2xl font-bold text-green-600">{formatCurrency(pkg.price)}</span>
              {discountPercentage > 0 && (
                <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold mr-2">
                  -{discountPercentage}%
                </span>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={onAddToCart}
                className="flex items-center gap-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                <ShoppingCart className="h-4 w-4" />
                إضافة للسلة
              </button>
              <button
                onClick={onInstantRecharge}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Zap className="h-4 w-4" />
                شحن فوري
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow group">
      <div className="relative p-6">
        {/* Badges */}
        <div className="absolute top-4 right-4 flex gap-2">
          {pkg.isPopular && (
            <span className="bg-yellow-500 text-black px-2 py-1 rounded-full text-xs font-semibold">شائع</span>
          )}
          {pkg.isFeatured && (
            <span className="bg-purple-500 text-white px-2 py-1 rounded-full text-xs font-semibold">مميز</span>
          )}
          {discountPercentage > 0 && (
            <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
              -{discountPercentage}%
            </span>
          )}
        </div>

        {/* Game Icon */}
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-2xl text-white mb-4">
          🎮
        </div>

        {/* Package Info */}
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{pkg.packageName}</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-1">{pkg.gameName}</p>
        <p className="text-gray-700 dark:text-gray-300 text-sm mb-4">{pkg.description}</p>

        {/* Amount and Bonus */}
        <div className="flex items-center gap-2 mb-4">
          <Gift className="h-5 w-5 text-green-500" />
          <span className="text-lg font-semibold text-gray-900 dark:text-white">{pkg.amount}</span>
          {pkg.bonus && <span className="text-green-600 font-medium">+ {pkg.bonus} مجاناً</span>}
        </div>

        {/* Features */}
        {pkg.features.length > 0 && (
          <div className="mb-4">
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              {pkg.features.slice(0, 2).map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                  <Star className="h-3 w-3 text-yellow-500 fill-current" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Delivery Time */}
        <div className="flex items-center gap-2 mb-4 text-sm text-gray-600 dark:text-gray-400">
          <Clock className="h-4 w-4" />
          <span>التسليم خلال {pkg.deliveryTime}</span>
        </div>

        {/* Price */}
        <div className="mb-4">
          {pkg.originalPrice && (
            <span className="text-sm text-gray-500 line-through block">{formatCurrency(pkg.originalPrice)}</span>
          )}
          <span className="text-2xl font-bold text-green-600">{formatCurrency(pkg.price)}</span>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={onAddToCart}
            className="flex-1 flex items-center justify-center gap-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
          >
            <ShoppingCart className="h-4 w-4" />
            إضافة للسلة
          </button>
          <button
            onClick={onInstantRecharge}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            <Zap className="h-4 w-4" />
            شحن فوري
          </button>
        </div>
      </div>
    </div>
  )
}

export default RechargePackageCard
