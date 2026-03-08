"use client"

import { useEffect, useState } from "react"
import { ArrowUp } from "lucide-react"
import { Button } from "@/components/ui/button"

export function BackToTop() {
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        const onScroll = () => setVisible(window.scrollY > 300)
        window.addEventListener("scroll", onScroll, { passive: true })
        return () => window.removeEventListener("scroll", onScroll)
    }, [])

    if (!visible) return null

    return (
        <Button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            size="icon"
            className="fixed bottom-6 right-6 z-50 rounded-full shadow-2xl bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-110 transition-all duration-300 animate-fade-in-up"
            aria-label="Back to top"
        >
            <ArrowUp className="h-5 w-5" />
        </Button>
    )
}
