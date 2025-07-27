"use client"

import type React from "react"
import { useNotification } from "../contexts/NotificationContext"
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react"

const Toast: React.FC = () => {
  const { notifications, removeNotification } = useNotification()

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case "info":
        return <Info className="h-5 w-5 text-blue-500" />
      default:
        return <Info className="h-5 w-5 text-blue-500" />
    }
  }

  const getBackgroundColor = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-50 dark:bg-green-900 border-green-200 dark:border-green-700"
      case "error":
        return "bg-red-50 dark:bg-red-900 border-red-200 dark:border-red-700"
      case "warning":
        return "bg-yellow-50 dark:bg-yellow-900 border-yellow-200 dark:border-yellow-700"
      case "info":
        return "bg-blue-50 dark:bg-blue-900 border-blue-200 dark:border-blue-700"
      default:
        return "bg-blue-50 dark:bg-blue-900 border-blue-200 dark:border-blue-700"
    }
  }

  if (notifications.length === 0) return null

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`max-w-sm w-full ${getBackgroundColor(notification.type)} border rounded-lg shadow-lg p-4 animate-slide-in-right`}
        >
          <div className="flex items-start">
            <div className="flex-shrink-0">{getIcon(notification.type)}</div>
            <div className="mr-3 flex-1">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">{notification.title}</h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{notification.message}</p>
            </div>
            <button
              onClick={() => removeNotification(notification.id)}
              className="flex-shrink-0 mr-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Toast
