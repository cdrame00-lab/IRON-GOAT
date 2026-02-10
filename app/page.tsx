"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Crown } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#030303] text-white p-6 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#1a130a] via-transparent to-transparent opacity-30" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5 }}
        className="z-10 text-center max-w-lg"
      >
        <div className="mb-6 flex justify-center">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            <Crown className="w-20 h-20 text-[#B1976B] drop-shadow-[0_0_15px_rgba(177,151,107,0.5)]" />
          </motion.div>
        </div>

        <h1 className="text-5xl md:text-6xl font-serif gold-text tracking-[0.2em] mb-4 uppercase leading-tight">
          GOT: Conquest
        </h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="space-y-6"
        >
          <p className="text-gray-400 text-sm md:text-base uppercase tracking-[0.3em] font-sans">
            MMO-RP Strategy & Treachery
          </p>

          <div className="h-px w-24 bg-[#B1976B] mx-auto opacity-50" />

          <p className="text-gray-500 italic text-sm md:text-base max-w-sm mx-auto leading-relaxed">
            {"Le pouvoir réside là où les hommes croient qu'il réside. C'est un tour de passe-passe, une ombre sur le mur."}
          </p>

          <div className="pt-12">
            <Link href="/login">
              <button className="px-12 py-4 border border-[#B1976B] text-[#B1976B] uppercase tracking-[0.4em] text-xs hover:bg-[#B1976B] hover:text-black transition-all duration-500 group relative overflow-hidden">
                <span className="relative z-10">Entrer dans la Citadelle</span>
                <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500" />
              </button>
            </Link>
          </div>
        </motion.div>
      </motion.div>

      {/* Mobile hint */}
      <div className="absolute bottom-8 text-[10px] text-gray-700 uppercase tracking-widest text-center px-4">
        Optimisé pour les appareils mobiles. Forgez votre destin.
      </div>
    </div>
  )
}
