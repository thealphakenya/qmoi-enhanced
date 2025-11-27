"use client"

import React, { useMemo } from "react"
import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

type ToastItem = {
  id: string | number
  title?: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
  [key: string]: any
}

export function Toaster(): JSX.Element {
  const { toasts } = useToast()

  const items: ToastItem[] = useMemo(() => {
    if (!Array.isArray(toasts)) return []
    return toasts as ToastItem[]
  }, [toasts])

  // Always render the provider/viewport so layout is stable.
  return (
    <ToastProvider>
      {items.length > 0 &&
        items.map(function ({ id, title, description, action, ...props }) {
          const key = id ?? JSON.stringify(props) ?? Math.random()
          return (
            <Toast key={String(key)} {...props}>
              <div className="grid gap-1">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && (
                  <ToastDescription>{description}</ToastDescription>
                )}
              </div>
              {action ?? null}
              <ToastClose />
            </Toast>
          )
        })}
      <ToastViewport />
    </ToastProvider>
  )
}
