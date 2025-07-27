import type React from "react"
import { Link } from "react-router-dom"
import { Star, TrendingUp } from "lucide-react"
import { formatCurrency } from "../utils/currency"

interface Game {
  id: string
  name: string
  nameAr: string
  image: string
  category: string
  isPopular: boolean
  minPrice: number
  maxPrice: number
}

interface GameCardProps {
  game: Game
}

const GameCard: React.FC<GameCardProps> = ({ game }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow group">
      <div className="relative">
        <img
          src={game.image || "/placeholder.svg"}
          alt={game.nameAr}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {game.isPopular && (
          <div className="absolute top-2 right-2 bg-yellow-500 text-black px-2 py-1 rounded-full text-xs font-semibold flex items-center">
            <TrendingUp className="h-3 w-3 ml-1" />
            شائع
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{game.nameAr}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{game.name}</p>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-500 fill-current" />
            <Star className="h-4 w-4 text-yellow-500 fill-current" />
            <Star className="h-4 w-4 text-yellow-500 fill-current" />
            <Star className="h-4 w-4 text-yellow-500 fill-current" />
            <Star className="h-4 w-4 text-yellow-500 fill-current" />
            <span className="text-sm text-gray-600 dark:text-gray-400 mr-1">(4.9)</span>
          </div>
          <span className="text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
            {getCategoryName(game.category)}
          </span>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-sm text-gray-600 dark:text-gray-400">من </span>
            <span className="text-lg font-bold text-green-600">{formatCurrency(game.minPrice)}</span>
          </div>
          <div>
            <span className="text-sm text-gray-600 dark:text-gray-400">إلى </span>
            <span className="text-lg font-bold text-green-600">{formatCurrency(game.maxPrice)}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Link
            to={`/recharge?game=${game.id}`}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg text-center hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            شحن
          </Link>
          <Link
            to={`/buy-accounts?game=${game.id}`}
            className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 py-2 px-4 rounded-lg text-center hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
          >
            شراء حساب
          </Link>
        </div>
      </div>
    </div>
  )
}

const getCategoryName = (category: string): string => {
  const categories: { [key: string]: string } = {
    sports: "رياضة",
    "battle-royale": "باتل رويال",
    fps: "إطلاق نار",
    strategy: "استراتيجية",
    racing: "سباق",
    adventure: "مغامرة",
  }
  return categories[category] || category
}

export default GameCard
