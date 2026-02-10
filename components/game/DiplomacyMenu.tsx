"use client"

import { motion } from "framer-motion"
import { Heart, Eye, Handshake, Skull, FileText, ChevronRight } from "lucide-react"

const DIPLOMACY_ACTIONS = [
    { id: "marriage", label: "Mariage Politique", icon: Heart, color: "text-pink-500", desc: "Unissez deux lignées pour une alliance éternelle." },
    { id: "espionage", label: "Espionnage", icon: Eye, color: "text-purple-500", desc: "Infiltrez les conseils ennemis pour voler des secrets." },
    { id: "alliance", label: "Alliance Militaire", icon: Handshake, color: "text-blue-500", desc: "Partagez vos forces pour écraser vos rivaux communs." },
    { id: "betrayal", label: "Trahison", icon: Skull, color: "text-red-500", desc: "Rompez vos pactes au pire moment pour un gain maximal." },
    { id: "pact", label: "Pacte de Non-Agression", icon: FileText, color: "text-green-500", desc: "Sécurisez vos frontières pour vous concentrer ailleurs." },
]

export default function DiplomacyMenu() {
    return (
        <div className="flex flex-col h-full bg-[#030303] text-white">
            <div className="p-6 border-b border-[#1A1A1A] bg-black/40">
                <h2 className="text-2xl font-serif gold-text tracking-[0.2em] uppercase">Conseil Diplomatique</h2>
                <p className="text-gray-500 text-xs uppercase tracking-widest mt-1">
                    L'encre est plus mortelle que l'acier.
                </p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {DIPLOMACY_ACTIONS.map((action, index) => {
                    const Icon = action.icon
                    return (
                        <motion.button
                            key={action.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className="w-full text-left glass p-5 flex items-center gap-5 group relative overflow-hidden transition-all duration-500 hover:border-[#B1976B]/50"
                        >
                            <div className={`p-4 rounded-full border border-[#1A1A1A] bg-black group-hover:bg-[#111] transition-colors ${action.color}`}>
                                <Icon className="w-8 h-8" />
                            </div>

                            <div className="flex-1">
                                <h3 className="font-serif text-lg tracking-wide group-hover:text-[#B1976B] transition-colors">
                                    {action.label}
                                </h3>
                                <p className="text-xs text-gray-500 italic mt-1 leading-relaxed">
                                    {action.desc}
                                </p>
                            </div>

                            <ChevronRight className="w-5 h-5 text-gray-700 group-hover:text-[#B1976B] transition-colors" />

                            {/* Decorative background pulse */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                        </motion.button>
                    )
                })}
            </div>

            {/* Diplomacy Status Footer (Subtle) */}
            <div className="p-4 bg-black/60 border-t border-[#1A1A1A] text-center mb-20">
                <p className="text-[10px] text-gray-600 uppercase tracking-widest italic">
                    "Les mots sont comme le vent, mais certains vents peuvent briser de vieux chênes."
                </p>
            </div>
        </div>
    )
}
