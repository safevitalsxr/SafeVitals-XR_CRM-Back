"use client"

import { useEffect, useState } from "react"

let mswStarted = false;

export function MSWProvider({ children }: { children: React.ReactNode }) {
  const [mswReady, setMswReady] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const initMsw = async () => {
        const { worker } = await import("./browser")
        if (!mswStarted) {
          mswStarted = true;
          await worker.start({
            onUnhandledRequest: "bypass",
          })
        }
        setMswReady(true)
      }
      initMsw()
    } else {
      setMswReady(true)
    }
  }, [])

  if (!mswReady) {
    return null
  }

  return <>{children}</>
}
