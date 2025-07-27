"use client"

import type React from "react"
import ProtectedRoute from "./ProtectedRoute"

interface AdminRouteProps {
  children: React.ReactNode
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  return <ProtectedRoute adminOnly={true}>{children}</ProtectedRoute>
}

export default AdminRoute
