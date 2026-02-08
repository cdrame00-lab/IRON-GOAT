"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { motion } from "framer-motion"
import { Shield, Sword, Crown } from "lucide-react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            setError("Les corbeaux n'ont pas pu vérifier vos titres. Réessayez.")
            setLoading(false)
        } else {
            router.push("/oath")
        }
    }

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const { error } = await supabase.auth.signUp({
            email,
            password,
        })

        if (error) {
            setError(error.message)
            setLoading(false)
        } else {
            setError("Un message a été envoyé à votre logis (Email). Vérifiez-le.")
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-6 py-12 bg-[#030303] text-white">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-sm"
            >
                <div className="text-center mb-10">
                    <motion.div
                        animate={{ rotate: [0, 5, -5, 0] }}
                        transition={{ repeat: Infinity, duration: 4 }}
                        className="inline-block mb-4"
                    >
                        <Crown className="w-16 h-16 text-[#B1976B]" />
                    </motion.div>
                    <h1 className="text-3xl font-serif gold-text tracking-widest mb-2">IRON THRONE</h1>
                    <p className="text-gray-500 text-sm italic">{"\"Le chaos n'est pas un gouffre. Le chaos est une échelle.\""}</p>
                </div>

                <form className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-tighter text-gray-500 ml-1">Parchemin (Email)</label>
                        <input
                            type="email"
                            placeholder="votre@nom.com"
                            className="w-full bg-[#030303] border border-[#1A1A1A] px-4 py-3 text-sm focus:border-[#B1976B] outline-none transition-colors"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-tighter text-gray-500 ml-1">Sceau Secret (Mot de passe)</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            className="w-full bg-[#030303] border border-[#1A1A1A] px-4 py-3 text-sm focus:border-[#B1976B] outline-none transition-colors"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {error && (
                        <p className="text-red-400 text-xs text-center italic">{error}</p>
                    )}

                    <div className="flex flex-col gap-4 pt-4">
                        <button
                            onClick={handleLogin}
                            disabled={loading}
                            className="w-full border border-[#B1976B] text-[#B1976B] py-3 text-sm uppercase tracking-widest hover:bg-[#B1976B] hover:text-black transition-all duration-300 flex items-center justify-center gap-2 group"
                        >
                            <Sword className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                            S'identifier
                        </button>

                        <button
                            onClick={handleSignUp}
                            disabled={loading}
                            className="w-full border border-[#1A1A1A] text-gray-500 py-3 text-sm uppercase tracking-widest hover:border-gray-700 transition-all flex items-center justify-center gap-2"
                        >
                            <Shield className="w-4 h-4" />
                            Prêter Serment
                        </button>
                    </div>
                </form>

                <div className="mt-12 border-t border-[#1A1A1A] pt-6 text-center">
                    <p className="text-[10px] text-gray-600 uppercase tracking-[0.2em]">
                        Protégé par la Garde de Nuit
                    </p>
                </div>
            </motion.div>
        </div>
    )
}
