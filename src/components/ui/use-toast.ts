"use client"

import * as React from "react"

export type Toast = {
  id: string
  title?: string
  description?: string
  variant?: "default" | "destructive"
}

export function useToast() {
  const [toast, setToast] = React.useState<Toast | null>(null)

  const showToast = React.useCallback(({
    title,
    description,
    variant = "default",
    duration = 5000,
  }: {
    title?: string
    description?: string
    variant?: "default" | "destructive"
    duration?: number
  }) => {
    const id = Math.random().toString(36).substring(2, 9)
    const newToast = { id, title, description, variant }
    
    setToast(newToast)

    if (duration) {
      setTimeout(() => {
        setToast((prev) => (prev?.id === id ? null : prev))
      }, duration)
    }

    return id
  }, [])

  const dismissToast = React.useCallback(() => {
    setToast(null)
  }, [])

  return {
    toast,
    showToast,
    dismissToast,
  }
}
