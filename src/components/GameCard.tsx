"use client"

import type React from "react"
import Link from "next/link"
import { Star, TrendingUp, Gamepad2 } from "lucide-react"
import { formatCurrency } from "../utils/currency"

interface Game {
  id: string
  name: string
  nameAr?: string
  image: string
  category: string
  categoryAr?: string
  minPrice: number
  maxPrice: number
  currency: string
  popular?: boolean
  featured?: boolean
  description?: string
  descriptionAr?: string
}

interface GameCardProps {
  game: Game
}

const GameCard: React.FC<GameCardProps> = ({ game }) => {
  const displayName = game.nameAr || game.name
  const displayCategory = game.categoryAr || game.category
  const displayDescription = game.descriptionAr || game.description

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow group">
      <div className="relative">
        <img
          src={game.image || "/placeholder.svg?height=200&width=300"}
          alt={displayName}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Badges */}
        <div className="absolute top-2 right-2 flex flex-col gap-2">
          {game.popular && (
            <span className="bg-yellow-500 text-black px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              شائع
            </span>
          )}
          {game.featured && (
            <span className="bg-purple-500 text-white px-2 py-1 rounded-full text-xs font-semibold">مميز</span>
          )}
        </div>

        {/* Game Icon */}
        <div className="absolute top-2 left-2">
          <div className="bg-black bg-opacity-50 text-white p-2 rounded-full">
            <Gamepad2 className="h-4 w-4" />
          </div>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{displayName}</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">{displayCategory}</p>

        {displayDescription && (
          <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 line-clamp-2">{displayDescription}</p>
        )}

        {/* Price Range */}
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">من</span>
            <span className="text-lg font-bold text-green-600">{formatCurrency(game.minPrice)}</span>
            <span className="text-sm text-gray-600 dark:text-gray-400">إلى</span>
            <span className="text-lg font-bold text-green-600">{formatCurrency(game.maxPrice)}</span>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="h-4 w-4 text-yellow-500 fill-current" />
            ))}
          </div>
          <span className="text-sm text-gray-600 dark:text-gray-400">(4.8)</span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Link
            href={`/recharge/${game.id}`}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors text-center"
          >
            شحن الآن
          </Link>
          <Link
            href={`/buy-accounts?game=${game.id}`}
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors text-center"
          >
            شراء حساب
          </Link>
        </div>
      </div>
    </div>
  )
}

export default GameCard
