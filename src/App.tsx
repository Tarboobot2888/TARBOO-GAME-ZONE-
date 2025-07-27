"use client"
import { ThemeProvider } from "./contexts/ThemeContext"
import { LanguageProvider } from "./contexts/LanguageContext"
import { AuthProvider } from "./contexts/AuthContext"
import { CartProvider } from "./contexts/CartContext"
import { InventoryProvider } from "./contexts/InventoryContext"
import { NotificationProvider } from "./contexts/NotificationContext"
import ErrorBoundary from "./components/ErrorBoundary"
import "./App.css"

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <CartProvider>
              <InventoryProvider>
                <NotificationProvider>
                  <div className="App">
                    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="text-center">
                          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            مرحباً بك في GameZone
                          </h1>
                          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
                            منصتك المفضلة لشحن الألعاب وشراء الحسابات
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">شحن الألعاب</h3>
                              <p className="text-gray-600 dark:text-gray-400">
                                اشحن ألعابك المفضلة بأسرع وقت وأفضل الأسعار
                              </p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">شراء حسابات</h3>
                              <p className="text-gray-600 dark:text-gray-400">
                                اشتري حسابات مميزة ومضمونة لألعابك المفضلة
                              </p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                خدمة عملاء 24/7
                              </h3>
                              <p className="text-gray-600 dark:text-gray-400">فريق دعم متاح على مدار الساعة لمساعدتك</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </NotificationProvider>
              </InventoryProvider>
            </CartProvider>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App
