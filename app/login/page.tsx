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
                            className="w-full border border-[#B1976B] text-[#B1976B] py-3 text-sm uppercase tracking-widest hover:bg-[#B1976B] hover:text-black transition-all duration-500 flex items-center justify-center gap-2 group relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500" />
                            <Sword className="w-4 h-4 group-hover:rotate-12 transition-transform relative z-10" />
                            <span className="relative z-10">S'identifier</span>
                        </button>

                        <div className="relative py-4">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-[#1A1A1A]"></div>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-[#030303] px-2 text-gray-500 italic">Ou via le sceau</span>
                            </div>
                        </div>

                        <button
                            onClick={() => supabase.auth.signInWithOAuth({ provider: 'apple' })}
                            className="w-full bg-white text-black py-3 text-sm font-bold uppercase tracking-widest hover:bg-gray-200 transition-all duration-300 flex items-center justify-center gap-2"
                        >
                            <svg className="w-4 h-4 fill-current" viewBox="0 0 384 512">
                                <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
                            </svg>
                            Sign in with Apple
                        </button>

                        <button
                            onClick={handleSignUp}
                            disabled={loading}
                            className="w-full border border-[#1A1A1A] text-gray-500 py-3 text-sm uppercase tracking-widest hover:border-gray-700 hover:text-gray-300 transition-all flex items-center justify-center gap-2"
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
