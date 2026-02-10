"use client"

import { motion } from "framer-motion"
import { Sparkles, Trophy, Users, ShoppingCart, TrendingUp, Info } from "lucide-react"

const RESOURCES = [
    { id: "culture", label: "Culture", value: "840", icon: Sparkles, color: "text-blue-400", sub: "Production: +12/h" },
    { id: "prestige", label: "Prestige", value: "1,250", icon: Trophy, color: "text-amber-400", sub: "Rang: 12ème" },
    { id: "soldiers", label: "Recrutement", value: "4,500", icon: Users, color: "text-red-400", sub: "Capacité: 5,000" },
    { id: "commerce", label: "Commerce", value: "12,400", icon: ShoppingCart, color: "text-green-400", sub: "Flux: +150/h" },
]

export default function ResourceDashboard() {
    return (
        <div className="flex flex-col h-full bg-[#030303] text-white">
            <div className="p-6 border-b border-[#1A1A1A] bg-black/40">
                <h2 className="text-2xl font-serif gold-text tracking-[0.2em] uppercase">Trésorerie & Intendance</h2>
                <p className="text-gray-500 text-xs uppercase tracking-widest mt-1">
                    Un royaume se gagne par le fer, mais se garde par l'or.
                </p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {/* Main Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    {RESOURCES.map((res, index) => {
                        const Icon = res.icon
                        return (
                            <motion.div
                                key={res.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="glass p-4 border border-[#1A1A1A] relative group"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <Icon className={`w-5 h-5 ${res.color}`} />
                                    <TrendingUp className="w-3 h-3 text-gray-700" />
                                </div>
                                <h3 className="text-[10px] text-gray-500 uppercase tracking-widest">{res.label}</h3>
                                <p className="text-2xl font-serif text-white mt-1">{res.value}</p>
                                <p className="text-[10px] text-gray-600 mt-2 italic">{res.sub}</p>
                            </motion.div>
                        )
                    })}
                </div>

                {/* Recruitment Action Panel */}
                <div className="glass p-5 border border-[#1A1A1A] bg-gradient-to-br from-red-900/10 to-transparent">
                    <div className="flex items-center gap-2 mb-4">
                        <Users className="w-4 h-4 text-red-500" />
                        <h4 className="font-serif uppercase tracking-widest text-sm">Caserne de Recrutement</h4>
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-400">Levée de paysans</span>
                            <span className="text-white">100 Or</span>
                        </div>
                        <div className="w-full bg-black/60 h-2 rounded-full overflow-hidden border border-[#1A1A1A]">
                            <div className="bg-red-900 h-full w-2/3 shadow-[0_0_10px_rgba(153,27,27,0.5)]" />
                        </div>
                        <button className="w-full py-2 bg-black border border-[#1A1A1A] text-red-500 uppercase text-[10px] tracking-widest hover:border-red-500/50 transition-all">
                            Lever des Troupes
                        </button>
                    </div>
                </div>

                {/* Market Summary */}
                <div className="glass p-5 border border-[#1A1A1A] bg-gradient-to-br from-green-900/10 to-transparent">
                    <div className="flex items-center gap-2 mb-4">
                        <ShoppingCart className="w-4 h-4 text-green-500" />
                        <h4 className="font-serif uppercase tracking-widest text-sm">Comptoir des Cités Libres</h4>
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-start gap-3 p-3 bg-black/40 rounded border border-[#1A1A1A]">
                            <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                            <p className="text-[10px] text-gray-400 leading-relaxed italic">
                                Le prix de la soie est en hausse à Pentos. Vos caravanes de Braavos rapportent +15% d'or ce cycle.
                            </p>
                        </div>
                        <button className="w-full py-2 bg-[#B1976B] text-black font-bold uppercase text-[10px] tracking-widest hover:bg-[#8e7855] transition-all">
                            Ouvrir le Marché
                        </button>
                    </div>
                </div>
            </div>

            {/* Bottom Padding for Navbar */}
            <div className="h-20" />
        </div>
    )
}
