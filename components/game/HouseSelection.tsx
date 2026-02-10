"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { HOUSES } from "@/lib/gameData"
import { ChevronRight, Shield, Skull, Scroll, Swords } from "lucide-react"

interface HouseSelectionProps {
    onSelect: (houseId: string) => void
}

export default function HouseSelection({ onSelect }: HouseSelectionProps) {
    const [selectedHouse, setSelectedHouse] = useState(HOUSES[0])

    return (
        <div className="flex flex-col md:flex-row h-full w-full max-w-6xl mx-auto overflow-hidden bg-black/40 border border-[#1A1A1A] backdrop-blur-md rounded-lg shadow-2xl">
            {/* List of Houses */}
            <div className="w-full md:w-1/3 border-r border-[#1A1A1A] overflow-y-auto custom-scrollbar bg-black/20">
                <div className="p-4 border-b border-[#1A1A1A] bg-black/40 sticky top-0 z-10">
                    <h2 className="text-xl font-serif gold-text tracking-widest text-center uppercase">
                        Grandes Maisons
                    </h2>
                </div>
                <div className="space-y-1 p-2">
                    {HOUSES.map((house) => (
                        <button
                            key={house.id}
                            onClick={() => setSelectedHouse(house)}
                            className={`w-full text-left px-4 py-4 border-b border-[#1A1A1A]/50 transition-all duration-300 group relative overflow-hidden ${selectedHouse.id === house.id
                                    ? "bg-[#B1976B]/10 border-l-4 border-l-[#B1976B]"
                                    : "hover:bg-white/5 border-l-4 border-l-transparent hover:border-l-gray-600"
                                }`}
                        >
                            <div className="flex items-center gap-4 relative z-10">
                                <span className="text-3xl filter drop-shadow-md pb-1">{house.icon}</span>
                                <div>
                                    <h3 className={`font-serif uppercase tracking-wider text-sm ${selectedHouse.id === house.id ? "text-[#B1976B]" : "text-gray-300"
                                        }`}>
                                        {house.name}
                                    </h3>
                                    <p className="text-[10px] text-gray-500 italic truncate w-40">
                                        {house.motto}
                                    </p>
                                </div>
                            </div>

                            {/* Hover effect background */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                        </button>
                    ))}
                </div>
            </div>

            {/* House Details */}
            <div className="w-full md:w-2/3 p-6 md:p-10 relative flex flex-col">
                {/* Background Banner Effect */}
                <div
                    className="absolute inset-0 opacity-10 bg-center bg-cover pointer-events-none grayscale"
                    style={{ backgroundColor: selectedHouse.color }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-[#030303]/80 to-transparent pointer-events-none" />

                <AnimatePresence mode="wait">
                    <motion.div
                        key={selectedHouse.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="relative z-10 h-full flex flex-col"
                    >
                        {/* Header */}
                        <div className="mb-8 text-center md:text-left">
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="inline-block p-4 rounded-full border border-[#B1976B]/30 bg-black/40 mb-4 shadow-[0_0_30px_rgba(177,151,107,0.1)]"
                            >
                                <span className="text-6xl md:text-7xl">{selectedHouse.icon}</span>
                            </motion.div>

                            <h1 className="text-4xl md:text-5xl font-serif text-white tracking-[0.2em] uppercase mb-2 drop-shadow-lg">
                                {selectedHouse.name}
                            </h1>
                            <div className="h-px w-32 bg-[#B1976B] mb-2 md:mx-0 mx-auto" />
                            <p className="text-[#B1976B] text-lg italic font-serif tracking-widest">
                                "{selectedHouse.motto}"
                            </p>
                        </div>

                        {/* Lore Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div className="bg-black/40 p-5 rounded border border-[#1A1A1A] backdrop-blur-sm">
                                <div className="flex items-center gap-2 mb-3 text-[#B1976B]">
                                    <Scroll className="w-4 h-4" />
                                    <h4 className="uppercase tracking-widest text-xs font-bold">Histoire & Origines</h4>
                                </div>
                                <p className="text-gray-400 text-sm leading-relaxed italic">
                                    {(selectedHouse as any).lore || selectedHouse.description}
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div className="bg-green-900/10 p-4 rounded border border-green-900/30">
                                    <div className="flex items-center gap-2 mb-2 text-green-500">
                                        <Shield className="w-4 h-4" />
                                        <h4 className="uppercase tracking-widest text-xs font-bold">Forces</h4>
                                    </div>
                                    <p className="text-green-400/80 text-sm">
                                        {(selectedHouse as any).strengths || "Aucune donnée disponible."}
                                    </p>
                                </div>

                                <div className="bg-red-900/10 p-4 rounded border border-red-900/30">
                                    <div className="flex items-center gap-2 mb-2 text-red-500">
                                        <Skull className="w-4 h-4" />
                                        <h4 className="uppercase tracking-widest text-xs font-bold">Faiblesses</h4>
                                    </div>
                                    <p className="text-red-400/80 text-sm">
                                        {(selectedHouse as any).weaknesses || "Aucune donnée disponible."}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Stats / Region */}
                        <div className="grid grid-cols-2 gap-4 mb-auto text-xs uppercase tracking-widest text-gray-500">
                            <div>
                                <span className="block text-[#B1976B] mb-1">Siège</span>
                                {selectedHouse.seat}
                            </div>
                            <div>
                                <span className="block text-[#B1976B] mb-1">Région</span>
                                {selectedHouse.region}
                            </div>
                        </div>

                        {/* Action Button */}
                        <div className="mt-8 pt-6 border-t border-[#1A1A1A]">
                            <button
                                onClick={() => onSelect(selectedHouse.id)}
                                className="w-full md:w-auto px-8 py-4 bg-[#B1976B] text-black font-bold uppercase tracking-[0.2em] hover:bg-[#8e7855] transition-colors flex items-center justify-center gap-4 group"
                            >
                                <Swords className="w-5 h-5" />
                                Prêter Allégeance
                                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <p className="text-[10px] text-gray-600 mt-2 text-center md:text-left italic">
                                * Ce choix est définitif pour cette ère.
                            </p>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    )
}
