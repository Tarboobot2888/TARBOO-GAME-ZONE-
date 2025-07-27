export const formatCurrency = (amount: number): string => {
  return `${amount.toLocaleString("ar-EG")} جنيه`
}

export const parseCurrency = (currencyString: string): number => {
  return Number.parseFloat(currencyString.replace(/[^\d.-]/g, ""))
}

export const calculateDiscount = (originalPrice: number, discountPercent: number): number => {
  return originalPrice - (originalPrice * discountPercent) / 100
}

export const formatDiscountedPrice = (originalPrice: number, discountPercent: number): string => {
  const discountedPrice = calculateDiscount(originalPrice, discountPercent)
  return formatCurrency(discountedPrice)
}
