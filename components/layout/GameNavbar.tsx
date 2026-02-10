"use client"

import { motion } from "framer-motion"
import { Users, Scroll, Coins, Map as MapIcon } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const NAV_ITEMS = [
    { id: "players", label: "Joueurs", icon: Users, href: "/players" },
    { id: "diplomacy", label: "Diplomatie", icon: Scroll, href: "/diplomacy" },
    { id: "resources", label: "Ressources", icon: Coins, href: "/resources" },
    { id: "map", label: "Carte", icon: MapIcon, href: "/map" },
]

export default function GameNavbar() {
    const pathname = usePathname()

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#030303]/90 backdrop-blur-md border-t border-[#1A1A1A] pb-safe">
            <div className="max-w-md mx-auto flex justify-around items-center h-16 pointer-events-auto">
                {NAV_ITEMS.map((item) => {
                    const isActive = pathname === item.href
                    const Icon = item.icon

                    return (
                        <Link key={item.id} href={item.href} className="relative group px-4 py-2">
                            <motion.div
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="flex flex-col items-center gap-1"
                            >
                                <div className={`p-2 rounded-full transition-all duration-300 ${isActive
                                        ? "text-[#B1976B] bg-[#B1976B]/10 shadow-[0_0_15px_rgba(177,151,107,0.2)]"
                                        : "text-gray-500 group-hover:text-gray-300"
                                    }`}>
                                    <Icon className="w-5 h-5" />
                                </div>
                                <span className={`text-[10px] uppercase tracking-tighter transition-colors ${isActive ? "text-[#B1976B] font-bold" : "text-gray-500 group-hover:text-gray-400"
                                    }`}>
                                    {item.label}
                                </span>

                                {isActive && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#B1976B]"
                                    />
                                )}
                            </motion.div>
                        </Link>
                    )
                })}
            </div>

            {/* Medieval decorative corners (subtle) */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-[#B1976B]/20 pointer-events-none" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-[#B1976B]/20 pointer-events-none" />
        </nav>
    )
}
