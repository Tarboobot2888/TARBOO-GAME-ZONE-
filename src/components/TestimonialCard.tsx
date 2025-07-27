import type React from "react"
import { Star } from "lucide-react"

interface Testimonial {
  id: string
  name: string
  rating: number
  comment: string
  game: string
  avatar: string
}

interface TestimonialCardProps {
  testimonial: Testimonial
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
      <div className="flex items-center mb-4">
        <img
          src={testimonial.avatar || "/placeholder.svg"}
          alt={testimonial.name}
          className="w-12 h-12 rounded-full ml-4"
        />
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">{testimonial.game}</p>
        </div>
      </div>

      <div className="flex items-center mb-3">
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            className={`h-4 w-4 ${
              index < testimonial.rating ? "text-yellow-500 fill-current" : "text-gray-300 dark:text-gray-600"
            }`}
          />
        ))}
      </div>

      <p className="text-gray-700 dark:text-gray-300 italic">"{testimonial.comment}"</p>
    </div>
  )
}

export default TestimonialCard
