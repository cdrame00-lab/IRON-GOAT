"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { motion, AnimatePresence } from "framer-motion"
import { Crown, DollarSign, X, Scroll, Coins } from "lucide-react"

interface Profile {
    id: string
    pseudo: string
    house: string
    gold: number
    soldiers: number
    is_monarch?: boolean
    is_banker?: boolean
    debt?: number
    last_tax_paid?: string
}

interface Loan {
    id: string
    borrower_id: string
    amount: number
    interest_rate: number
    total_due: number
    created_at: string
    status: string
}

interface Quest {
    id: string
    title: string
    description: string
    reward_gold: number
    reward_soldiers: number
    status: string
}

export default function MonarchyPanel({
    isOpen,
    onClose,
    myProfile,
    players
}: {
    isOpen: boolean
    onClose: () => void
    myProfile: Profile | null
    players: Profile[]
}) {
    const [tab, setTab] = useState<'taxes' | 'bank' | 'quests'>('taxes')
    const [loans, setLoans] = useState<Loan[]>([])
    const [quests, setQuests] = useState<Quest[]>([])
    const [loanAmount, setLoanAmount] = useState(500)
    const [selectedBorrower, setSelectedBorrower] = useState<string>("")
    const [questTitle, setQuestTitle] = useState("")
    const [questReward, setQuestReward] = useState(1000)

    const monarch = players.find(p => p.is_monarch)
    const iAmMonarch = myProfile?.is_monarch
    const iAmBanker = myProfile?.is_banker

    useEffect(() => {
        if (isOpen) {
            fetchLoans()
            fetchQuests()
        }
    }, [isOpen])

    const fetchLoans = async () => {
        const { data } = await supabase
            .from('loans')
            .select('*')
            .eq('borrower_id', myProfile?.id)
        if (data) setLoans(data)
    }

    const fetchQuests = async () => {
        const { data } = await supabase
            .from('quests')
            .select('*')
            .eq('status', 'active')
        if (data) setQuests(data)
    }

    const payTaxToMonarch = async () => {
        if (!myProfile || !monarch) return

        const taxAmount = 200
        if (myProfile.gold < taxAmount) {
            alert("Vous n'avez pas assez d'or pour payer les taxes !")
            return
        }

        try {
            await supabase.rpc('pay_tax_to_monarch', {
                player_id: myProfile.id,
                tax_amount: taxAmount
            })
            alert(`Vous avez payé ${taxAmount} dragons d'or au Trône de Fer.`)
            window.location.reload()
        } catch (e) {
            console.error(e)
            alert("Erreur lors du paiement des taxes")
        }
    }

    const requestLoan = async () => {
        if (!myProfile || !selectedBorrower) return

        const interestRate = Math.random() * 20 + 5 // 5-25%
        const totalDue = Math.floor(loanAmount * (1 + interestRate / 100))

        await supabase.from('loans').insert({
            borrower_id: selectedBorrower,
            lender_id: myProfile.id,
            amount: loanAmount,
            interest_rate: interestRate,
            total_due: totalDue,
            status: 'active'
        })

        alert(`Prêt accordé : ${loanAmount} or, à rembourser ${totalDue} or (${interestRate.toFixed(1)}% d'intérêt)`)
        fetchLoans()
    }

    const createQuest = async () => {
        if (!myProfile || !questTitle) return

        await supabase.from('quests').insert({
            creator_id: myProfile.id,
            title: questTitle,
            description: `Quête créée par ${myProfile.pseudo}`,
            reward_gold: questReward,
            status: 'active'
        })

        alert("Quête créée avec succès !")
        setQuestTitle("")
        fetchQuests()
    }

    if (!isOpen) return null

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[3000] bg-black/80 flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-[#030303] border border-[#B1976B] rounded-lg w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col"
                >
                    {/* Header */}
                    <div className="p-4 border-b border-[#1A1A1A] flex justify-between items-center">
                        <h2 className="font-serif gold-text tracking-widest uppercase flex items-center gap-2">
                            <Crown className="w-5 h-5" />
                            {iAmMonarch ? "Votre Règne" : "Le Trône de Fer"}
                        </h2>
                        <button onClick={onClose} className="text-gray-500 hover:text-white">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="flex border-b border-[#1A1A1A]">
                        <button
                            onClick={() => setTab('taxes')}
                            className={`flex-1 py-3 text-[10px] uppercase tracking-widest ${tab === 'taxes' ? 'gold-text border-b-2 border-[#B1976B]' : 'text-gray-600'}`}
                        >
                            <Crown className="w-4 h-4 inline mr-1" /> Taxes
                        </button>
                        {iAmBanker && (
                            <button
                                onClick={() => setTab('bank')}
                                className={`flex-1 py-3 text-[10px] uppercase tracking-widest ${tab === 'bank' ? 'gold-text border-b-2 border-[#B1976B]' : 'text-gray-600'}`}
                            >
                                <DollarSign className="w-4 h-4 inline mr-1" /> Banque
                            </button>
                        )}
                        {iAmBanker && (
                            <button
                                onClick={() => setTab('quests')}
                                className={`flex-1 py-3 text-[10px] uppercase tracking-widest ${tab === 'quests' ? 'gold-text border-b-2 border-[#B1976B]' : 'text-gray-600'}`}
                            >
                                <Scroll className="w-4 h-4 inline mr-1" /> Quêtes
                            </button>
                        )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {tab === 'taxes' && (
                            <div className="space-y-4">
                                {monarch && (
                                    <div className="glass p-4 border border-[#B1976B]/30">
                                        <div className="text-sm font-serif gold-text mb-2">
                                            Monarque Actuel : {monarch.pseudo}
                                        </div>
                                        <div className="text-xs text-gray-400">
                                            Maison {monarch.house} | Trésor Royal : {monarch.gold} dragons d'or
                                        </div>
                                    </div>
                                )}

                                {!iAmMonarch && monarch && (
                                    <div className="glass p-4">
                                        <p className="text-xs text-gray-400 mb-3">
                                            En tant que vassal, vous devez payer 200 dragons d'or de taxes à la Couronne.
                                        </p>
                                        <button
                                            onClick={payTaxToMonarch}
                                            className="w-full py-2 bg-[#B1976B] text-black uppercase text-xs font-bold tracking-widest hover:bg-[#9d8159] transition-colors"
                                        >
                                            <Coins className="w-4 h-4 inline mr-2" />
                                            Payer les Taxes (200 or)
                                        </button>
                                    </div>
                                )}

                                {iAmMonarch && (
                                    <div className="glass p-4">
                                        <p className="text-sm font-serif gold-text mb-2">Vous régnez sur Westeros</p>
                                        <p className="text-xs text-gray-400">
                                            Les vassaux vous versent des taxes. Gouvernez avec sagesse ou affrontez la rébellion.
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {tab === 'bank' && iAmBanker && (
                            <div className="space-y-4">
                                <div className="glass p-4">
                                    <h3 className="text-sm font-serif gold-text mb-3">Accorder un Prêt</h3>
                                    <select
                                        className="w-full bg-[#1A1A1A] border border-gray-800 text-xs gold-text p-2 mb-2"
                                        value={selectedBorrower}
                                        onChange={(e) => setSelectedBorrower(e.target.value)}
                                    >
                                        <option value="">--- Choisir un emprunteur ---</option>
                                        {players.filter(p => p.id !== myProfile?.id).map(p => (
                                            <option key={p.id} value={p.id}>{p.pseudo} ({p.house})</option>
                                        ))}
                                    </select>
                                    <input
                                        type="number"
                                        className="w-full bg-[#1A1A1A] border border-gray-800 text-xs gold-text p-2 mb-2"
                                        value={loanAmount}
                                        onChange={(e) => setLoanAmount(Number(e.target.value))}
                                        placeholder="Montant"
                                    />
                                    <button
                                        onClick={requestLoan}
                                        className="w-full py-2 bg-[#B1976B] text-black uppercase text-xs font-bold"
                                    >
                                        Accorder le Prêt
                                    </button>
                                </div>

                                <div className="glass p-4">
                                    <h3 className="text-sm font-serif gold-text mb-2">Prêts Actifs</h3>
                                    {loans.length === 0 ? (
                                        <p className="text-xs text-gray-500">Aucun prêt en cours</p>
                                    ) : (
                                        loans.map(loan => (
                                            <div key={loan.id} className="border-b border-gray-800 py-2">
                                                <div className="text-xs text-gray-300">
                                                    {loan.amount} or → {loan.total_due} or ({loan.interest_rate.toFixed(1)}%)
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}

                        {tab === 'quests' && iAmBanker && (
                            <div className="space-y-4">
                                <div className="glass p-4">
                                    <h3 className="text-sm font-serif gold-text mb-3">Créer une Quête</h3>
                                    <input
                                        type="text"
                                        className="w-full bg-[#1A1A1A] border border-gray-800 text-xs gold-text p-2 mb-2"
                                        value={questTitle}
                                        onChange={(e) => setQuestTitle(e.target.value)}
                                        placeholder="Titre de la quête"
                                    />
                                    <input
                                        type="number"
                                        className="w-full bg-[#1A1A1A] border border-gray-800 text-xs gold-text p-2 mb-2"
                                        value={questReward}
                                        onChange={(e) => setQuestReward(Number(e.target.value))}
                                        placeholder="Récompense en or"
                                    />
                                    <button
                                        onClick={createQuest}
                                        className="w-full py-2 bg-[#B1976B] text-black uppercase text-xs font-bold"
                                    >
                                        Publier la Quête
                                    </button>
                                </div>

                                <div className="glass p-4">
                                    <h3 className="text-sm font-serif gold-text mb-2">Quêtes Disponibles</h3>
                                    {quests.length === 0 ? (
                                        <p className="text-xs text-gray-500">Aucune quête active</p>
                                    ) : (
                                        quests.map(quest => (
                                            <div key={quest.id} className="border-b border-gray-800 py-2">
                                                <div className="text-xs font-bold text-[#B1976B]">{quest.title}</div>
                                                <div className="text-xs text-gray-400">Récompense : {quest.reward_gold} or</div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}
