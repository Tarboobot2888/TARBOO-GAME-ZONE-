"use client"
import { Component, type ReactNode } from "react"
import { AlertTriangle, RefreshCw, Home } from "lucide-react"
import { logError } from "../services/analytics"

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: any
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error("Error caught by boundary:", error, errorInfo)

    // Log error to analytics
    logError(error.message, {
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      url: window.location.href,
    })

    this.setState({ error, errorInfo })
  }

  handleReload = () => {
    window.location.reload()
  }

  handleGoHome = () => {
    window.location.href = "/"
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
            <div className="flex justify-center mb-4">
              <AlertTriangle className="h-16 w-16 text-red-500" />
            </div>

            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">حدث خطأ غير متوقع</h1>

            <p className="text-gray-600 dark:text-gray-400 mb-6">
              نعتذر، حدث خطأ في التطبيق. يرجى المحاولة مرة أخرى أو العودة للصفحة الرئيسية.
            </p>

            {process.env.NODE_ENV === "development" && this.state.error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6 text-right">
                <h3 className="text-sm font-semibold text-red-800 dark:text-red-200 mb-2">
                  تفاصيل الخطأ (وضع التطوير):
                </h3>
                <pre className="text-xs text-red-700 dark:text-red-300 overflow-auto">{this.state.error.message}</pre>
              </div>
            )}

            <div className="flex gap-3 justify-center">
              <button
                onClick={this.handleReload}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                إعادة تحميل
              </button>

              <button
                onClick={this.handleGoHome}
                className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Home className="h-4 w-4" />
                الصفحة الرئيسية
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
