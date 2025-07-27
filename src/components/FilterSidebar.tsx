"use client"

import type React from "react"
import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

interface FilterSidebarProps {
  priceRange: [number, number]
  setPriceRange: (range: [number, number]) => void
  selectedRegion: string
  setSelectedRegion: (region: string) => void
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  priceRange,
  setPriceRange,
  selectedRegion,
  setSelectedRegion,
}) => {
  const [expandedSections, setExpandedSections] = useState({
    price: true,
    region: true,
    features: true,
  })

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const regions = [
    { id: "", name: "جميع المناطق" },
    { id: "global", name: "عالمي" },
    { id: "mena", name: "الشرق الأوسط وشمال أفريقيا" },
    { id: "egypt", name: "مصر" },
    { id: "saudi", name: "السعودية" },
    { id: "uae", name: "الإمارات" },
  ]

  const priceRanges = [
    { min: 0, max: 50, label: "أقل من 50 جنيه" },
    { min: 50, max: 100, label: "50 - 100 جنيه" },
    { min: 100, max: 200, label: "100 - 200 جنيه" },
    { min: 200, max: 500, label: "200 - 500 جنيه" },
    { min: 500, max: 1000, label: "500 - 1000 جنيه" },
    { min: 1000, max: 10000, label: "أكثر من 1000 جنيه" },
  ]

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">فلاتر البحث</h3>

      {/* Price Range Filter */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection("price")}
          className="flex items-center justify-between w-full text-left font-medium text-gray-900 dark:text-white mb-3"
        >
          نطاق السعر
          {expandedSections.price ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </button>

        {expandedSections.price && (
          <div className="space-y-2">
            {priceRanges.map((range) => (
              <label key={`${range.min}-${range.max}`} className="flex items-center">
                <input
                  type="radio"
                  name="priceRange"
                  checked={priceRange[0] === range.min && priceRange[1] === range.max}
                  onChange={() => setPriceRange([range.min, range.max])}
                  className="ml-2 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">{range.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Region Filter */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection("region")}
          className="flex items-center justify-between w-full text-left font-medium text-gray-900 dark:text-white mb-3"
        >
          المنطقة
          {expandedSections.region ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </button>

        {expandedSections.region && (
          <div className="space-y-2">
            {regions.map((region) => (
              <label key={region.id} className="flex items-center">
                <input
                  type="radio"
                  name="region"
                  checked={selectedRegion === region.id}
                  onChange={() => setSelectedRegion(region.id)}
                  className="ml-2 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">{region.name}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Features Filter */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection("features")}
          className="flex items-center justify-between w-full text-left font-medium text-gray-900 dark:text-white mb-3"
        >
          المميزات
          {expandedSections.features ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </button>

        {expandedSections.features && (
          <div className="space-y-2">
            {["شحن فوري", "بونص إضافي", "ضمان الاسترداد", "دعم 24/7", "عرض محدود"].map((feature) => (
              <label key={feature} className="flex items-center">
                <input type="checkbox" className="ml-2 text-blue-600 focus:ring-blue-500 rounded" />
                <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Clear Filters */}
      <button
        onClick={() => {
          setPriceRange([0, 1000])
          setSelectedRegion("")
        }}
        className="w-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
      >
        مسح جميع الفلاتر
      </button>
    </div>
  )
}

export default FilterSidebar
