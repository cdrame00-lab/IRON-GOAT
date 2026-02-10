"use client"

import { motion } from "framer-motion"
import { Shield, Swords, Trophy, Crown } from "lucide-react"

// Mock data for players - in a real app this would come from Supabase
const PLAYERS = [
    { id: 1, pseudo: "Jon Snow", house: "Stark", power: 12500, status: "online", is_monarch: false },
    { id: 2, pseudo: "Cersei L.", house: "Lannister", power: 45000, status: "online", is_monarch: true },
    { id: 3, pseudo: "Stannis B.", house: "Baratheon", power: 8200, status: "offline", is_monarch: false },
    { id: 4, pseudo: "Daenerys T.", house: "Targaryen", power: 38000, status: "online", is_monarch: false },
    { id: 5, pseudo: "Theon G.", house: "Greyjoy", power: 4200, status: "offline", is_monarch: false },
    { id: 6, pseudo: "Oberyn M.", house: "Martell", power: 15600, status: "online", is_monarch: false },
    { id: 7, pseudo: "Olenna T.", house: "Tyrell", power: 22000, status: "online", is_monarch: false },
    { id: 8, pseudo: "Ramsay B.", house: "Bolton", power: 11000, status: "offline", is_monarch: false },
]

const HOUSE_ICONS: Record<string, string> = {
    Stark: "🐺",
    Lannister: "🦁",
    Baratheon: "🦌",
    Targaryen: "🐉",
    Greyjoy: "🦑",
    Martell: "☀️",
    Tyrell: "🌹",
    Bolton: "🩸",
}

export default function PlayerList() {
    return (
        <div className="flex flex-col h-full bg-[#030303] text-white">
            <div className="p-6 border-b border-[#1A1A1A] bg-black/40">
                <h2 className="text-2xl font-serif gold-text tracking-[0.2em] uppercase">Seigneurs du Royaume</h2>
                <p className="text-gray-500 text-xs uppercase tracking-widest mt-1">
                    {PLAYERS.filter(p => p.status === "online").length} Actifs / {PLAYERS.length} Total
                </p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {PLAYERS.sort((a, b) => b.power - a.power).map((player, index) => (
                    <motion.div
                        key={player.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="glass p-4 rounded-none border border-[#1A1A1A] hover:border-[#B1976B]/50 transition-all duration-300 relative overflow-hidden group"
                    >
                        {/* Status Indicator */}
                        <div className={`absolute top-0 right-0 w-1 h-full ${player.status === "online" ? "bg-green-500" : "bg-gray-800"
                            }`} />

                        <div className="flex items-center gap-4 relative z-10">
                            {/* Blason */}
                            <div className="w-16 h-16 bg-black/60 rounded-full border border-[#1A1A1A] flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition-transform">
                                {HOUSE_ICONS[player.house]}
                            </div>

                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-serif text-lg tracking-wider text-white">
                                        {player.pseudo}
                                    </h3>
                                    {player.is_monarch && <Crown className="w-4 h-4 text-[#B1976B] fill-[#B1976B]/20" />}
                                </div>
                                <p className="text-[10px] text-gray-500 uppercase tracking-widest">
                                    Maison {player.house}
                                </p>
                            </div>

                            {/* Power Score */}
                            <div className="text-right">
                                <div className="flex items-center gap-1 justify-end text-[#B1976B]">
                                    <Swords className="w-3 h-3" />
                                    <span className="font-serif text-sm">
                                        {player.power.toLocaleString()}
                                    </span>
                                </div>
                                <p className="text-[10px] text-gray-600 uppercase tracking-tighter">Puissance</p>
                            </div>
                        </div>

                        {/* Rank Overlay (Background) */}
                        <div className="absolute -bottom-2 -left-2 opacity-[0.03] text-8xl font-serif text-white pointer-events-none italic">
                            #{index + 1}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Bottom Padding for Navbar */}
            <div className="h-20" />
        </div>
    )
}
