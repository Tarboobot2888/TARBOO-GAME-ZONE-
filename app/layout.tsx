import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "../src/contexts/AuthContext"
import { ThemeProvider } from "../src/contexts/ThemeContext"
import { CartProvider } from "../src/contexts/CartContext"
import { NotificationProvider } from "../src/contexts/NotificationContext"
import { LanguageProvider } from "../src/contexts/LanguageContext"
import { InventoryProvider } from "../src/contexts/InventoryContext"
import Navbar from "../src/components/Navbar"
import Footer from "../src/components/Footer"
import Toast from "../src/components/Toast"
import ErrorBoundary from "../src/components/ErrorBoundary"
import ScrollToTop from "../src/components/ScrollToTop"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "GameZone - منصة شحن الألعاب وشراء الحسابات",
  description: "منصتك الموثوقة لشحن الألعاب وشراء الحسابات المميزة بأفضل الأسعار",
  keywords: "شحن ألعاب, شراء حسابات, PUBG, FIFA, Free Fire, Call of Duty",
  authors: [{ name: "GameZone Team" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  openGraph: {
    title: "GameZone - منصة شحن الألعاب وشراء الحسابات",
    description: "منصتك الموثوقة لشحن الألعاب وشراء الحسابات المميزة بأفضل الأسعار",
    type: "website",
    locale: "ar_EG",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className={inter.className}>
        <ErrorBoundary>
          <LanguageProvider>
            <ThemeProvider>
              <AuthProvider>
                <NotificationProvider>
                  <CartProvider>
                    <InventoryProvider>
                      <div className="min-h-screen flex flex-col">
                        <Navbar />
                        <main className="flex-1 pt-16">{children}</main>
                        <Footer />
                      </div>
                      <Toast />
                      <ScrollToTop />
                    </InventoryProvider>
                  </CartProvider>
                </NotificationProvider>
              </AuthProvider>
            </ThemeProvider>
          </LanguageProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
