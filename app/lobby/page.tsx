"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Crown, Users, Plus, Share2, Shield, Swords, ArrowRight } from "lucide-react"
import { generateBots, Bot } from "@/lib/botLogic"

export default function LobbyPage() {
    const [roomCode, setRoomCode] = useState<string | null>(null)
    const [players, setPlayers] = useState<any[]>([])
    const [maxPlayers] = useState(8)

    const createRoom = () => {
        const code = Math.random().toString(36).substring(2, 8).toUpperCase()
        setRoomCode(code)
        // Add current user as host (mock)
        setPlayers([{ id: "host", pseudo: "Vous (Seigneur)", house: "Votre Choix", power: 10000, status: "online", isHost: true }])
    }

    const addBots = () => {
        const remaining = maxPlayers - players.length
        if (remaining > 0) {
            const bots = generateBots(Math.min(remaining, 3))
            setPlayers([...players, ...bots])
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#030303] text-white p-6 pb-24">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-2xl bg-black/40 border border-[#1A1A1A] backdrop-blur-md p-8 rounded-lg shadow-2xl relative overflow-hidden"
            >
                {/* Decorative Background */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#B1976B]/5 rounded-full blur-[100px] pointer-events-none" />

                {!roomCode ? (
                    <div className="text-center space-y-8">
                        <div className="space-y-2">
                            <Crown className="w-16 h-16 text-[#B1976B] mx-auto drop-shadow-[0_0_15px_rgba(177,151,107,0.3)]" />
                            <h1 className="text-4xl font-serif gold-text tracking-[0.2em] uppercase">Salle de Guerre</h1>
                            <p className="text-gray-500 uppercase tracking-widest text-xs">Rassemblez vos alliés avant la conquête</p>
                        </div>

                        <div className="flex flex-col gap-4 max-w-xs mx-auto">
                            <button
                                onClick={createRoom}
                                className="w-full py-4 border border-[#B1976B] text-[#B1976B] uppercase tracking-widest text-xs hover:bg-[#B1976B] hover:text-black transition-all duration-500 flex items-center justify-center gap-2 group"
                            >
                                <Plus className="w-4 h-4" />
                                Créer une Salle Privée
                            </button>
                            <div className="flex items-center gap-4">
                                <div className="h-px bg-[#1A1A1A] flex-1" />
                                <span className="text-[10px] text-gray-700 uppercase">Ou</span>
                                <div className="h-px bg-[#1A1A1A] flex-1" />
                            </div>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="CODE"
                                    className="flex-1 bg-black/60 border border-[#1A1A1A] px-4 py-3 text-sm focus:border-[#B1976B] outline-none transition-colors uppercase tracking-widest"
                                />
                                <button className="px-6 border border-[#1A1A1A] hover:border-[#B1976B] transition-colors">
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {/* Header with Code */}
                        <div className="flex justify-between items-end border-b border-[#1A1A1A] pb-6">
                            <div>
                                <h1 className="text-2xl font-serif text-white tracking-widest uppercase mb-1">Salle active</h1>
                                <p className="text-[10px] text-gray-500 uppercase tracking-widest">Partagez ce sceau pour inviter des seigneurs</p>
                            </div>
                            <div className="text-right">
                                <div className="flex items-center gap-2 bg-[#B1976B]/10 border border-[#B1976B]/30 px-4 py-2 rounded select-all cursor-pointer group">
                                    <span className="text-2xl font-serif gold-text tracking-[0.3em] font-bold">{roomCode}</span>
                                    <Share2 className="w-4 h-4 text-[#B1976B] group-hover:scale-110 transition-transform" />
                                </div>
                            </div>
                        </div>

                        {/* Player List */}
                        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                            <AnimatePresence>
                                {players.map((player, index) => (
                                    <motion.div
                                        key={player.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className="flex items-center justify-between p-4 bg-black/40 border border-[#1A1A1A] transition-all hover:bg-black/60"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-[#1A1A1A] flex items-center justify-center border border-[#333]">
                                                {player.pseudo.includes("Bot") ? "🤖" : "🛡️"}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-serif text-sm uppercase tracking-wider">{player.pseudo}</span>
                                                    {player.isHost && <Crown className="w-3 h-3 text-[#B1976B]" />}
                                                </div>
                                                <span className="text-[9px] text-gray-600 uppercase tracking-tighter italic">
                                                    {player.behavior ? `Tempérament: ${player.behavior}` : player.house}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 text-[#B1976B]">
                                            <Swords className="w-3 h-3" />
                                            <span className="text-xs font-serif">{player.power.toLocaleString()}</span>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {players.length < maxPlayers && (
                                <button
                                    onClick={addBots}
                                    className="w-full py-4 border border-dashed border-[#1A1A1A] text-gray-600 hover:border-[#333] hover:text-gray-400 transition-all text-[10px] uppercase tracking-widest flex items-center justify-center gap-2"
                                >
                                    <Plus className="w-3 h-3" />
                                    Convoquer des bots ({maxPlayers - players.length} places libres)
                                </button>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="pt-6 border-t border-[#1A1A1A] flex gap-4">
                            <button className="flex-1 py-4 bg-[#B1976B] text-black font-bold uppercase tracking-[0.2em] text-xs hover:bg-[#8e7855] transition-all shadow-[0_4px_20px_rgba(177,151,107,0.2)]">
                                Commencer la Campagne
                            </button>
                            <button
                                onClick={() => setRoomCode(null)}
                                className="px-6 py-4 border border-[#1A1A1A] text-gray-500 hover:text-red-500 hover:border-red-900/50 transition-all uppercase text-[10px] tracking-widest"
                            >
                                Quitter
                            </button>
                        </div>
                    </div>
                )}
            </motion.div>

            {/* Hint */}
            <p className="mt-8 text-[10px] text-gray-700 uppercase tracking-[0.3em] font-sans">
                La mort est certaine, l'heure est incertaine.
            </p>
        </div>
    )
}
