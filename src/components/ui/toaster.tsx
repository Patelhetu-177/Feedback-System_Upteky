"use client"

import * as React from "react"
import { Toast } from "./use-toast"

export function Toaster({ toast }: { toast: Toast | null }) {
  if (!toast) return null

  return (
    <div className="fixed top-4 right-4 z-50">
      <div
        className={`p-4 rounded-md shadow-lg ${
          toast.variant === "destructive"
            ? "bg-red-100 border border-red-200 text-red-800"
            : "bg-white border border-gray-200 text-gray-800"
        }`}
      >
        {toast.title && <div className="font-semibold">{toast.title}</div>}
        {toast.description && (
          <div className="text-sm mt-1">{toast.description}</div>
        )}
      </div>
    </div>
  )
}
