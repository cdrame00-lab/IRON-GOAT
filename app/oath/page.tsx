"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { Check } from "lucide-react"

const HOUSES = [
    { id: 'stark', name: 'Stark', motto: 'L\'hiver vient', color: '#888888', icon: '🐺', seat: 'Winterfell', description: 'Gardiens du Nord, fiers et honorables.' },
    { id: 'lannister', name: 'Lannister', motto: 'Je rugis !', color: '#C02424', icon: '🦁', seat: 'Castral Roc', description: 'Riches et impitoyables, ils paient toujours leurs dettes.' },
    { id: 'baratheon', name: 'Baratheon', motto: 'Nôtre est la fureur', color: '#E3B341', icon: '🦌', seat: 'Accalmie', description: 'Puissants guerriers, nés dans la tempête.' },
    { id: 'targaryen', name: 'Targaryen', motto: 'Feu et Sang', color: '#000000', icon: '🐉', seat: 'Peyredragon', description: 'Le sang de l\'ancienne Valyria, maîtres des dragons.' },
    { id: 'greyjoy', name: 'Greyjoy', motto: 'Nous ne semons pas', color: '#333333', icon: '🦑', seat: 'Pyke', description: 'Seigneurs des Îles de Fer, rois du sel et du roc.' },
    { id: 'martell', name: 'Martell', motto: 'Insoumis, Invaincus, Intacts', color: '#E38041', icon: '☀️', seat: 'Lancehélion', description: 'Le venin de Dorne, brûlant sous le soleil.' },
    { id: 'tyrell', name: 'Tyrell', motto: 'Plus haut, plus fort', color: '#2D7A2F', icon: '🌹', seat: 'Hautjardin', description: 'Maîtres des récoltes et de la chevalerie.' },
    { id: 'nightwatch', name: 'Garde de Nuit', motto: 'Le Bouclier des Royaumes', color: '#000000', icon: '⚔️', seat: 'Châteaunoir', description: 'Le Lord Commandant protège le Mur contre les horreurs du Nord.' },
]

const CULTURES = [
    { id: 'north', name: 'Premier Homme', bonus: '+20% Défense en Hiver' },
    { id: 'andal', name: 'Andal', bonus: '+15% Prestige Diplomatique' },
    { id: 'rhoynar', name: 'Rhoynar', bonus: '+25% Vitesse Navale' },
    { id: 'valyrian', name: 'Valyrien', bonus: '+10% Puissance Militaire' },
]

export default function OathPage() {
    const [step, setStep] = useState(1)
    const [pseudo, setPseudo] = useState("")
    const [realmKey, setRealmKey] = useState("")
    const [selectedHouse, setSelectedHouse] = useState<string | null>(null)
    const [selectedCulture, setSelectedCulture] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) router.push("/login")
        }
        checkUser()
    }, [router])

    const handleFinalize = async () => {
        setLoading(true)
        const { data: { user } } = await supabase.auth.getUser()

        if (user) {
            // Update profile with House, Culture and Realm Key
            await supabase.from('profiles').update({
                pseudo,
                house: selectedHouse,
                culture: selectedCulture,
                realm_key: realmKey || 'public', // Default to public if empty
                gold: 1000,
                soldiers: 100,
                x: Math.floor(Math.random() * 600 + 100),
                y: Math.floor(Math.random() * 600 + 100)
            }).eq('id', user.id)
        }

        setTimeout(() => {
            router.push("/map")
        }, 1500)
    }

    return (
        <div className="min-h-screen bg-[#030303] text-white flex flex-col p-6 overflow-hidden">
            {/* Background Decor */}
            <div className="fixed inset-0 pointer-events-none opacity-5">
                <div className="absolute top-0 right-0 w-64 h-64 border-r border-t border-[#B1976B]" />
                <div className="absolute bottom-0 left-0 w-64 h-64 border-l border-b border-[#B1976B]" />
            </div>

            <div className="z-10 flex flex-col items-center max-w-md mx-auto w-full pt-12">
                <h1 className="text-2xl font-serif gold-text tracking-widest mb-12 uppercase">Le Serment</h1>

                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="w-full space-y-8"
                        >
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs uppercase tracking-widest text-gray-500 block text-center">{"Comment l'histoire vous retiendra-t-elle ?"}</label>
                                    <input
                                        type="text"
                                        placeholder="NOM DU SEIGNEUR"
                                        className="w-full border-b border-[#1A1A1A] bg-transparent text-center py-4 text-xl font-serif outline-none focus:border-[#B1976B] tracking-[0.3em] transition-all"
                                        value={pseudo}
                                        onChange={(e) => setPseudo(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[8px] uppercase tracking-widest text-[#B1976B]/60 block text-center">{"Clé de la Citadelle (Laissez vide pour Public)"}</label>
                                    <input
                                        type="text"
                                        placeholder="CLE PRIVEE"
                                        className="w-full border-b border-[#1A1A1A] bg-transparent text-center py-2 text-xs font-mono outline-none focus:border-[#B1976B] tracking-widest opacity-60"
                                        value={realmKey}
                                        onChange={(e) => setRealmKey(e.target.value)}
                                    />
                                </div>
                            </div>
                            <button
                                onClick={() => pseudo.length >= 3 && setStep(2)}
                                disabled={pseudo.length < 3}
                                className="w-full mt-12 py-4 border border-[#B1976B] text-[#B1976B] uppercase tracking-widest text-sm disabled:opacity-30 disabled:border-gray-800 transition-all font-serif"
                            >
                                Choisir son Allégeance
                            </button>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="w-full"
                        >
                            <p className="text-xs uppercase tracking-widest text-gray-500 text-center mb-8 italic">Seul un fou marche seul à Westeros</p>
                            <div className="grid grid-cols-2 gap-3">
                                {HOUSES.map((house) => (
                                    <button
                                        key={house.id}
                                        onClick={() => setSelectedHouse(house.id)}
                                        className={`p-4 border ${selectedHouse === house.id ? 'border-[#B1976B] bg-[#1A1A1A]' : 'border-[#1A1A1A]'} transition-all text-center relative overflow-hidden group min-h-[120px] flex flex-col items-center justify-center`}
                                    >
                                        <div className="text-2xl mb-2 grayscale group-hover:grayscale-0 transition-all">{house.icon}</div>
                                        <div className="text-[10px] font-bold uppercase tracking-widest">{house.name}</div>
                                        <div className="text-[6px] text-[#B1976B] uppercase tracking-tighter mb-1 mt-1">{house.seat}</div>
                                        <div className="text-[7px] text-gray-400 italic line-clamp-2 leading-tight">{house.description}</div>
                                        {selectedHouse === house.id && <div className="absolute top-1 right-1"><Check className="w-3 h-3 text-[#B1976B]" /></div>}
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={() => setStep(3)}
                                disabled={!selectedHouse}
                                className="w-full mt-8 py-4 border border-[#B1976B] text-[#B1976B] uppercase tracking-widest text-sm disabled:opacity-30 transition-all"
                            >
                                Définir votre Culture
                            </button>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="w-full space-y-4"
                        >
                            <p className="text-xs uppercase tracking-widest text-gray-500 text-center mb-6">Le sang de vos ancêtres</p>
                            {CULTURES.map((culture) => (
                                <button
                                    key={culture.id}
                                    onClick={() => setSelectedCulture(culture.id)}
                                    className={`w-full p-4 border ${selectedCulture === culture.id ? 'border-[#B1976B] bg-[#1A1A1A]' : 'border-[#1A1A1A]'} transition-all text-left flex justify-between items-center`}
                                >
                                    <div>
                                        <div className="text-xs font-bold uppercase tracking-widest">{culture.name}</div>
                                        <div className="text-[10px] text-noble-gold italic">{culture.bonus}</div>
                                    </div>
                                    {selectedCulture === culture.id && <Check className="w-4 h-4 text-[#B1976B]" />}
                                </button>
                            ))}
                            <button
                                onClick={handleFinalize}
                                disabled={!selectedCulture || loading}
                                className="w-full mt-12 py-4 bg-[#B1976B] text-black uppercase tracking-widest text-sm font-bold flex items-center justify-center gap-2"
                            >
                                {loading ? "Gravure du nom..." : "Je jure fidélité au Trône"}
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Navigation Dots */}
                <div className="flex gap-2 mt-auto pb-8 pt-12">
                    {[1, 2, 3].map(i => (
                        <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all ${step === i ? 'bg-[#B1976B] w-4' : 'bg-gray-800'}`} />
                    ))}
                </div>
            </div>
        </div>
    )
}
