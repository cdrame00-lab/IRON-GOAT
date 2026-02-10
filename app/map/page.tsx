"use client"

import { useEffect, useState, useCallback } from "react"
import dynamic from "next/dynamic"
import { supabase } from "@/lib/supabase"
import { AnimatePresence, motion } from "framer-motion"
import { Shield, Compass, MessageSquare, Eye, X, Crown } from "lucide-react"
import RavensChat from "@/components/game/RavensChat"
import MonarchyPanel from "@/components/game/MonarchyPanel"
import GameNavbar from "@/components/layout/GameNavbar"

// We must import Leaflet components dynamically because they require 'window'
const MapComponent = dynamic(() => import("@/components/game/MapComponent"), {
    ssr: false,
    loading: () => <div className="flex-grow bg-[#030303] flex items-center justify-center text-[#B1976B] font-serif uppercase tracking-widest text-xs">Chargement des cartes de Westeros...</div>
})

interface Profile {
    id: string
    pseudo: string
    house: string
    gold: number
    soldiers: number
    x: number
    y: number
    realm_key: string
    is_bot?: boolean
    faction?: 'noble' | 'nightwatch' | 'whitewalker'
    is_rebel?: boolean
    is_monarch?: boolean
    is_banker?: boolean
    debt?: number
    last_tax_paid?: string
}

interface Conflict {
    id: string
    attacker_id: string
    defender_id: string
    title: string
    status: string
    eta_arrival: string
    profiles?: { pseudo: string }
}

export default function TacticalMap() {
    const [players, setPlayers] = useState<Profile[]>([])
    const [conflicts, setConflicts] = useState<Conflict[]>([])
    const [myProfile, setMyProfile] = useState<Profile | null>(null)
    const [selectedTarget, setSelectedTarget] = useState<Profile | null>(null)
    const [distance, setDistance] = useState<number | null>(null)
    const [isChatOpen, setIsChatOpen] = useState(false)
    const [isMonarchyOpen, setIsMonarchyOpen] = useState(false)
    const [actionNotif, setActionNotif] = useState<string | null>(null)
    const [loadingAction, setLoadingAction] = useState(false)
    const [battleReport, setBattleReport] = useState<Conflict | null>(null)

    const fetchData = useCallback(async () => {
        const { data: { user } } = await supabase.auth.getUser()
        let currentProfile = null
        if (user) {
            const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
            setMyProfile(profile)
            currentProfile = profile
        }

        // Filter players by current realm key
        const realm = currentProfile?.realm_key || 'public'
        const { data: allPlayers } = await supabase.from('profiles').select('*').eq('realm_key', realm)
        if (allPlayers) {
            setPlayers(allPlayers)

            // Auto-select a monarch if none exists
            const hasMonarch = allPlayers.some(p => p.is_monarch)
            if (!hasMonarch && allPlayers.length > 0) {
                // Select random player as monarch
                const randomIndex = Math.floor(Math.random() * allPlayers.length)
                const chosenMonarch = allPlayers[randomIndex]

                await supabase.from('profiles')
                    .update({ is_monarch: true })
                    .eq('id', chosenMonarch.id)

                console.log(`👑 ${chosenMonarch.pseudo} a été couronné Monarque du Trône de Fer !`)
                setActionNotif(`👑 ${chosenMonarch.pseudo} de la Maison ${chosenMonarch.house} a été couronné Monarque du Trône de Fer !`)
                setTimeout(() => setActionNotif(null), 5000)

                // Refresh data to show the new monarch
                const { data: updatedPlayers } = await supabase.from('profiles').select('*').eq('realm_key', realm)
                if (updatedPlayers) setPlayers(updatedPlayers)
            }
        }

        const { data: activeConflicts } = await supabase.from('conflicts').select('*, profiles!conflicts_defender_id_fkey(pseudo)').eq('status', 'marching')
        if (activeConflicts) setConflicts(activeConflicts)
    }, [])

    const spawnBots = async () => {
        if (!myProfile) return

        setLoadingAction(true)
        try {
            const bots = [
                // Famous Lords - Distributed on Hex Grid (Y: 0-1500, X: 0-650)
                { id: crypto.randomUUID(), pseudo: 'Eddard Stark', house: 'stark', gold: 1200, soldiers: 5000, x: 250, y: 300, realm_key: myProfile.realm_key, is_bot: true, faction: 'noble' },
                { id: crypto.randomUUID(), pseudo: 'Tywin Lannister', house: 'lannister', gold: 8000, soldiers: 8000, x: 150, y: 900, realm_key: myProfile.realm_key, is_bot: true, faction: 'noble' },
                { id: crypto.randomUUID(), pseudo: 'Robert Baratheon', house: 'baratheon', gold: 2000, soldiers: 6000, x: 400, y: 1100, realm_key: myProfile.realm_key, is_bot: true, faction: 'noble' },
                { id: crypto.randomUUID(), pseudo: 'Daenerys Targaryen', house: 'targaryen', gold: 500, soldiers: 3000, x: 550, y: 1400, realm_key: myProfile.realm_key, is_bot: true, faction: 'noble' },
                { id: crypto.randomUUID(), pseudo: 'Jeor Mormont', house: 'nightwatch', gold: 1000, soldiers: 800, x: 300, y: 200, realm_key: myProfile.realm_key, is_bot: true, faction: 'nightwatch' },
                { id: crypto.randomUUID(), pseudo: 'Night King', house: 'whitewalker', gold: 0, soldiers: 10000, x: 300, y: 50, realm_key: myProfile.realm_key, is_bot: true, faction: 'whitewalker' },
                { id: crypto.randomUUID(), pseudo: 'Olenna Tyrell', house: 'tyrell', gold: 6000, soldiers: 7000, x: 200, y: 1200, realm_key: myProfile.realm_key, is_bot: true, faction: 'noble' },
                { id: crypto.randomUUID(), pseudo: 'Balon Greyjoy', house: 'greyjoy', gold: 1500, soldiers: 4000, x: 50, y: 800, realm_key: myProfile.realm_key, is_bot: true, faction: 'noble' },
                { id: crypto.randomUUID(), pseudo: 'Doran Martell', house: 'martell', gold: 3000, soldiers: 4500, x: 300, y: 1450, realm_key: myProfile.realm_key, is_bot: true, faction: 'noble' },
                { id: crypto.randomUUID(), pseudo: 'Jon Arryn', house: 'arryn', gold: 2500, soldiers: 3500, x: 500, y: 800, realm_key: myProfile.realm_key, is_bot: true, faction: 'noble' },
                { id: crypto.randomUUID(), pseudo: 'Edmure Tully', house: 'tully', gold: 1800, soldiers: 3000, x: 300, y: 750, realm_key: myProfile.realm_key, is_bot: true, faction: 'noble' }
            ]

            console.log('Spawning bots:', bots.length)
            const { error } = await supabase.from('profiles').insert(bots)
            if (error) throw error

            await fetchData()
            setActionNotif("L'Hiver est arrivé. Les Seigneurs de Westeros et les Spectres du Nord s'éveillent.")
        } catch (e: any) {
            console.error("Spawn Error:", e)
            if (e.code === '23505') {
                setActionNotif("Le Royaume est déjà peuplé (Doublons détectés).")
            } else {
                setActionNotif(`Erreur d'invocation: ${e.message || 'Inconnue'}`)
            }
        } finally {
            setLoadingAction(false)
            setTimeout(() => setActionNotif(null), 4000)
        }
    }

    const rebelAgainstWatch = async () => {
        if (!myProfile || myProfile.house !== 'nightwatch') return

        const { error } = await supabase.from('profiles').update({
            is_rebel: true,
            pseudo: `${myProfile.pseudo} (Roi au-delà du Mur)`
        }).eq('id', myProfile.id)

        if (!error) {
            setActionNotif("Vous avez brisé vos vœux ! Vous êtes désormais le Roi au-delà du Mur.")
            fetchData()
        } else {
            setActionNotif("Votre conscience vous retient... (Erreur technique)")
        }
    }

    useEffect(() => {
        fetchData()
        const profilesSub = supabase
            .channel('profiles_changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, fetchData)
            .subscribe()

        const conflictsSub = supabase
            .channel('conflicts_changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'conflicts' }, (payload) => {
                const newConflict = payload.new as Conflict
                if (newConflict.status === 'victory' || newConflict.status === 'defeat') {
                    if (newConflict.attacker_id === myProfile?.id || newConflict.defender_id === myProfile?.id) {
                        setBattleReport(newConflict)
                    }
                }
                fetchData()
            })
            .subscribe()

        return () => {
            supabase.removeChannel(profilesSub)
            supabase.removeChannel(conflictsSub)
        }
    }, [myProfile?.id, fetchData])

    const collectTaxes = async () => {
        if (!myProfile) return
        setLoadingAction(true)

        const isNW = myProfile.house === 'nightwatch'
        // FIX: Use direct update instead of RPC to ensure it works without SQL scripts
        const gain = isNW ? 300 : 500 // Supplies worth less/more or similar

        try {
            const { error } = await supabase.from('profiles')
                .update({ gold: myProfile.gold + gain })
                .eq('id', myProfile.id)

            if (error) throw error

            setActionNotif(isNW ? "Les villages du Don ont envoyé des vivres." : "L'or des paysans remplit vos coffres.")
            await fetchData()
        } catch (e) {
            console.error(e)
            setActionNotif("Les percepteurs ont été chassés... (Erreur DB)")
        } finally {
            setLoadingAction(false)
            setTimeout(() => setActionNotif(null), 3000)
        }
    }

    const recruitSoldiers = async () => {
        if (!myProfile) return
        const isNW = myProfile.house === 'nightwatch'

        if (myProfile.gold < 100 && !isNW) {
            setActionNotif("L'or manque pour lever une armée.")
            setTimeout(() => setActionNotif(null), 3000)
            return
        }

        setLoadingAction(true)
        const amount = isNW ? 20 : 10
        const cost = isNW ? 0 : 100

        try {
            const { error } = await supabase.from('profiles')
                .update({
                    gold: myProfile.gold - cost,
                    soldiers: myProfile.soldiers + amount
                })
                .eq('id', myProfile.id)

            if (error) throw error

            setActionNotif(isNW ? "20 nouveaux frères jurés ont rejoint le Mur." : "10 nouveaux soldats ont prêté serment.")
            await fetchData()
        } catch (e) {
            console.error(e)
            setActionNotif("Personne ne veut se battre pour vous. (Erreur DB)")
        } finally {
            setLoadingAction(false)
            setTimeout(() => setActionNotif(null), 3000)
        }
    }

    const handleSelectTarget = (player: any) => {
        if (!player) {
            setSelectedTarget(null)
            return
        }
        if (myProfile && player.id !== myProfile.id) {
            setSelectedTarget(player)
            // Distance approximation on hex grid
            const d = Math.sqrt(Math.pow(player.x - myProfile.x, 2) + Math.pow(player.y - myProfile.y, 2))
            setDistance(Math.round(d))
        }
    }

    const performAction = async (type: string, target?: Profile) => {
        const targetProfile = target || selectedTarget
        if (!myProfile || !targetProfile) return

        // Update selected target if passed directly
        if (target && target.id !== selectedTarget?.id) {
            setSelectedTarget(target)
        }

        let message = ""
        let success = true

        setLoadingAction(true)

        try {
            switch (type) {
                case 'siege':
                    // Night Watch protection logic: Cannot attack lords unless rebelled
                    if (myProfile.house === 'nightwatch' && !myProfile.is_rebel && targetProfile.faction === 'noble') {
                        message = "La Garde de Nuit ne prend pas part aux guerres des Seigneurs. Rebellez-vous d'abord !"
                        success = false
                        break
                    }

                    message = `Vous marchez sur les terres de ${targetProfile.pseudo}...`

                    // Simple distance calc based on coordinates
                    const dist = Math.sqrt(Math.pow(targetProfile.x - myProfile.x, 2) + Math.pow(targetProfile.y - myProfile.y, 2))
                    const eta = new Date()
                    eta.setMinutes(eta.getMinutes() + Math.ceil(dist / 50)) // 1 min per 50 units

                    await supabase.from('conflicts').insert({
                        attacker_id: myProfile.id,
                        defender_id: targetProfile.id,
                        title: `${myProfile.house === 'nightwatch' ? 'Expédition' : 'Siège'} de ${targetProfile.pseudo}`,
                        eta_arrival: eta.toISOString(),
                        status: 'marching'
                    })
                    break

                case 'bribe':
                    if (myProfile.gold < 500) {
                        message = "Vous n'avez pas assez d'or pour soudoyer les gardes."
                        success = false
                    } else {
                        // Direct DB: Pay 500 gold to reduce target soldiers by 20%
                        const reduction = Math.floor(targetProfile.soldiers * 0.2)
                        await supabase.from('profiles').update({
                            gold: myProfile.gold - 500
                        }).eq('id', myProfile.id)

                        await supabase.from('profiles').update({
                            soldiers: Math.max(0, targetProfile.soldiers - reduction)
                        }).eq('id', targetProfile.id)

                        message = `Vos pièces dorées ont convaincu ${reduction} gardes de ${targetProfile.pseudo} de déserter.`
                    }
                    break

                case 'infiltrate':
                    // Direct DB: 50% chance to steal 100-300 gold
                    const success_chance = Math.random() > 0.5
                    if (success_chance) {
                        const stolen = Math.floor(Math.random() * 200) + 100
                        await supabase.from('profiles').update({
                            gold: myProfile.gold + stolen
                        }).eq('id', myProfile.id)

                        await supabase.from('profiles').update({
                            gold: Math.max(0, targetProfile.gold - stolen)
                        }).eq('id', targetProfile.id)

                        message = `Vos espions ont dérobé ${stolen} dragons d'or à ${targetProfile.pseudo} !`
                    } else {
                        message = `Vos espions ont été capturés et exécutés à Port-Réal.`
                    }
                    break

                case 'marriage':
                    // Send a special alliance message
                    await supabase.from('messages').insert({
                        sender_id: myProfile.id,
                        content: `📢 [DIPLOMATIE] La Maison ${myProfile.house} propose un pacte d'union à la Maison ${targetProfile.house}.`,
                        channel: 'public'
                    })
                    message = `Un corbeau portant une proposition d'union a été envoyé à ${targetProfile.pseudo}.`
                    break
            }

            setActionNotif(message)
            await fetchData()
        } catch (err) {
            console.error("Action Error:", err)
            setActionNotif("Le Grand Mestre signale une erreur dans votre plan.")
        } finally {
            setLoadingAction(false)
            setTimeout(() => setActionNotif(null), 5000)
        }
    }

    return (
        <div className="h-screen w-screen bg-[#030303] overflow-hidden relative">
            {/* Background Map - Takes 100% of the space */}
            <div className="absolute inset-0 z-0">
                <MapComponent
                    players={players}
                    myProfile={myProfile}
                    onAction={performAction}
                    selectedTarget={selectedTarget}
                    setSelectedTarget={handleSelectTarget}
                />
            </div>

            <AnimatePresence>
                {actionNotif && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="fixed top-24 left-1/2 -translate-x-1/2 z-[3000] glass px-6 py-3 border-[#B1976B] text-center shadow-[0_0_20px_rgba(177,151,107,0.3)]"
                    >
                        <p className="text-[10px] uppercase font-serif gold-text tracking-widest">{actionNotif}</p>
                    </motion.div>
                )}

                {battleReport && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="fixed inset-0 z-[4000] bg-black/90 flex items-center justify-center p-6 backdrop-blur-md"
                    >
                        <div className={`w-full max-w-xs glass p-8 text-center border-t-4 ${battleReport?.status === 'victory' ? 'border-green-600' : 'border-red-600'}`}>
                            <h2 className="text-2xl font-serif gold-text uppercase mb-4 tracking-widest">Rapport de Bataille</h2>
                            <p className="text-gray-400 text-xs uppercase mb-2">{battleReport?.title}</p>
                            <div className={`text-4xl font-black uppercase mb-6 ${battleReport?.status === 'victory' ? 'text-green-500' : 'text-red-500'}`}>
                                {battleReport?.status === 'victory' ? 'Victoire' : 'Défaite'}
                            </div>
                            <p className="text-gray-500 text-[10px] italic mb-8 leading-relaxed">
                                {battleReport?.status === 'victory'
                                    ? "Vos hommes ont franchi les portes. Le pillage a commencé."
                                    : "Le siège a échoué. Vos forces se sont dispersées dans les bois."
                                }
                            </p>
                            <button
                                onClick={() => setBattleReport(null)}
                                className="w-full py-3 border border-gray-100/10 text-[10px] uppercase tracking-widest hover:bg-white/5 transition-all"
                            >
                                Refermer le Parchemin
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <RavensChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} userProfile={myProfile} players={players} />

            {/* HUD Header */}
            <div className="absolute top-0 left-0 right-0 z-[1000] p-4 flex flex-col gap-2 pointer-events-none">
                <div className="flex justify-between items-start">
                    <div className="glass p-3 rounded-none border-l-4 border-l-[#B1976B] pointer-events-auto">
                        <div className="text-[10px] text-gray-400 uppercase tracking-widest leading-none mb-1">
                            {myProfile?.house === 'nightwatch' ? 'Lord Commandant de' : 'Seigneur de'} {myProfile?.house === 'nightwatch' ? 'la Garde de Nuit' : myProfile?.house}
                        </div>
                        <div className="text-sm font-serif gold-text uppercase leading-none">{myProfile?.pseudo || "..."}</div>
                        {players.some(p => p.is_bot) && (
                            <div className="mt-2 flex items-center gap-1.5 animate-pulse">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_5px_green]"></div>
                                <span className="text-[7px] text-green-500 uppercase tracking-[0.2em] font-bold">Royaume Peuplé par l'IA</span>
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col gap-2 pointer-events-auto items-end">
                        <div className="glass p-3 text-right">
                            <div className="text-[10px] text-gray-400 uppercase leading-none mb-1">{myProfile?.gold || 0} Or</div>
                            <div className="text-[10px] gold-text uppercase leading-none italic">{myProfile?.soldiers || 0} Épées</div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions Bar */}
                <div className="flex gap-2 pointer-events-auto overflow-x-auto pb-2 scrollbar-hide">
                    {players.filter(p => p.is_bot).length === 0 && (
                        <button
                            onClick={spawnBots}
                            disabled={loadingAction}
                            className="bg-[#B1976B] px-5 py-2 text-[9px] uppercase tracking-[0.25em] text-black font-bold whitespace-nowrap flex items-center gap-2 shadow-[0_0_20px_rgba(177,151,107,0.4)] hover:scale-105 transition-all outline-none"
                        >
                            <Crown className="w-3 h-3" /> Invoquer les Seigneurs Bots
                        </button>
                    )}
                    <button
                        onClick={collectTaxes}
                        disabled={loadingAction}
                        className="glass px-4 py-2 text-[8px] uppercase tracking-widest gold-text border border-[#B1976B]/20 whitespace-nowrap"
                    >
                        {myProfile?.house === 'nightwatch' ? 'Patrouille au Mur' : 'Récolter les Taxes'}
                    </button>
                    <button
                        onClick={recruitSoldiers}
                        disabled={loadingAction}
                        className="glass px-4 py-2 text-[8px] uppercase tracking-widest text-gray-300 border border-gray-800 whitespace-nowrap"
                    >
                        {myProfile?.house === 'nightwatch' ? 'Recruter au Donjon' : 'Lever des Armées'}
                    </button>
                    {myProfile?.house === 'nightwatch' && (
                        <button
                            onClick={() => setActionNotif("Le Mur est surveillé. Les Marcheurs Blancs restent dans l'ombre.")}
                            className="glass px-4 py-2 text-[8px] uppercase tracking-widest text-blue-400 border border-blue-900/40 whitespace-nowrap"
                        >
                            Garder le Mur
                        </button>
                    )}
                    {myProfile?.house === 'nightwatch' && !myProfile?.is_rebel && (
                        <button
                            onClick={rebelAgainstWatch}
                            className="glass px-4 py-2 text-[8px] uppercase tracking-widest text-red-600 border border-red-900/60 animate-pulse whitespace-nowrap"
                        >
                            Devenir Roi au-delà du Mur
                        </button>
                    )}
                    {players.filter(p => p.is_bot).length > 0 && (
                        <button
                            onClick={spawnBots}
                            disabled={loadingAction}
                            className="glass px-4 py-2 text-[8px] uppercase tracking-widest text-[#B1976B]/60 border border-[#B1976B]/20 whitespace-nowrap flex items-center gap-1"
                        >
                            <Crown className="w-2 h-2" /> Renforts Bots
                        </button>
                    )}
                    {conflicts.length > 0 && (
                        <div className="glass px-4 py-2 text-[8px] uppercase tracking-widest text-red-500 border border-red-900/40 animate-pulse whitespace-nowrap flex items-center gap-2">
                            <Shield className="w-2 h-2" /> {conflicts.length} Sièges en cours
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom Nav Integration */}
            <GameNavbar />

            {/* Monarchy Panel */}
            <MonarchyPanel
                isOpen={isMonarchyOpen}
                onClose={() => setIsMonarchyOpen(false)}
                myProfile={myProfile}
                players={players}
            />

            {/* Ravens Chat */}
            <RavensChat
                isOpen={isChatOpen}
                onClose={() => setIsChatOpen(false)}
                userProfile={myProfile}
                players={players}
            />
        </div>
    )
}
