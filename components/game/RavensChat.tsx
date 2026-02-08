"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { supabase } from "@/lib/supabase"
import { motion, AnimatePresence } from "framer-motion"
import { Send, X, MessageSquare } from "lucide-react"

interface Profile {
    id: string
    pseudo: string
    house?: string
    gold?: number
    soldiers?: number
    x?: number
    y?: number
}

interface Message {
    id: string
    sender_id: string
    content: string
    channel: string
    created_at: string
    sender_pseudo?: string
}

export default function RavensChat({ isOpen, onClose, userProfile, players }: { isOpen: boolean, onClose: () => void, userProfile: Profile | null, players: Profile[] }) {
    const [messages, setMessages] = useState<Message[]>([])
    const [newMessage, setNewMessage] = useState("")
    const [channel, setChannel] = useState("public")
    const [recipientId, setRecipientId] = useState<string | null>(null)
    const scrollRef = useRef<HTMLDivElement>(null)

    const fetchMessages = useCallback(async () => {
        if (channel === 'private') {
            if (!recipientId || !userProfile) return

            // Fetch private messages from private_messages table
            const { data } = await supabase
                .from('private_messages')
                .select('*, sender:profiles!sender_id(pseudo), recipient:profiles!recipient_id(pseudo)')
                .or(`and(sender_id.eq.${userProfile.id},recipient_id.eq.${recipientId}),and(sender_id.eq.${recipientId},recipient_id.eq.${userProfile.id})`)
                .order('created_at', { ascending: true })
                .limit(50)

            if (data) {
                const formatted = data.map((msg: any) => ({
                    id: msg.id,
                    sender_id: msg.sender_id,
                    content: msg.content,
                    channel: 'private',
                    created_at: msg.created_at,
                    sender_pseudo: msg.sender?.pseudo || 'Inconnu'
                }))
                setMessages(formatted)
            }
        } else {
            // Fetch public/secret messages
            const { data } = await supabase
                .from('messages')
                .select('*, profiles(pseudo)')
                .eq('channel', channel)
                .order('created_at', { ascending: true })
                .limit(50)

            if (data) {
                const formatted = data.map((msg: any) => ({
                    ...msg,
                    sender_pseudo: msg.profiles?.pseudo || 'Inconnu'
                }))
                setMessages(formatted)
            }
        }
    }, [channel, recipientId, userProfile?.id])

    useEffect(() => {
        if (isOpen) {
            fetchMessages()
            const subscription = supabase
                .channel('public_chat')
                .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
                    setMessages(prev => [...prev, payload.new as Message])
                })
                .subscribe()

            return () => { supabase.removeChannel(subscription) }
        }
    }, [isOpen, channel, fetchMessages])

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages])

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newMessage.trim() || !userProfile) return

        if (channel === 'private') {
            if (!recipientId) {
                alert('Sélectionnez un destinataire')
                return
            }
            await supabase.from('private_messages').insert({
                sender_id: userProfile.id,
                recipient_id: recipientId,
                content: newMessage
            })
        } else {
            await supabase.from('messages').insert({
                sender_id: userProfile.id,
                content: newMessage,
                channel: channel
            })
        }

        setNewMessage("")
        fetchMessages()
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    className="fixed inset-0 z-[2000] bg-[#030303] flex flex-col pt-12"
                >
                    <div className="p-4 border-b border-[#1A1A1A] flex justify-between items-center">
                        <h2 className="font-serif gold-text tracking-widest uppercase flex items-center gap-2">
                            <MessageSquare className="w-4 h-4" /> Les Corbeaux
                        </h2>
                        <button onClick={onClose} className="text-gray-500"><X /></button>
                    </div>

                    <div className="flex border-b border-[#1A1A1A]">
                        <button
                            onClick={() => setChannel("public")}
                            className={`flex-1 py-3 text-[10px] uppercase tracking-widest ${channel === "public" ? 'gold-text border-b-2 border-[#B1976B]' : 'text-gray-600'}`}
                        >
                            Public
                        </button>
                        <button
                            onClick={() => setChannel("alliance")}
                            className={`flex-1 py-3 text-[10px] uppercase tracking-widest ${channel === "alliance" ? 'gold-text border-b-2 border-[#B1976B]' : 'text-gray-600'}`}
                        >
                            Alliance
                        </button>
                        <button
                            onClick={() => setChannel("private")}
                            className={`flex-1 py-3 text-[10px] uppercase tracking-widest ${channel === "private" ? 'gold-text border-b-2 border-[#B1976B]' : 'text-gray-600'}`}
                        >
                            Privé
                        </button>
                    </div>

                    {/* Recipient Selector for Private Messages */}
                    {channel === 'private' && (
                        <div className="p-2 border-b border-[#1A1A1A] bg-[#0A0A0A]">
                            <select
                                className="w-full bg-[#1A1A1A] border border-gray-800 text-[10px] gold-text p-2 outline-none uppercase tracking-widest"
                                value={recipientId || ""}
                                onChange={(e) => setRecipientId(e.target.value)}
                            >
                                <option value="">--- Choisir un destinataire ---</option>
                                {players.filter(p => p.id !== userProfile?.id).map(p => (
                                    <option key={p.id} value={p.id}>{p.pseudo} ({p.house})</option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div ref={scrollRef} className="flex-grow overflow-y-auto p-4 space-y-4 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]">
                        {messages.map((m) => (
                            <div key={m.id} className={`flex flex-col ${m.sender_id === userProfile?.id ? 'items-end' : 'items-start'}`}>
                                <div className="text-[8px] text-gray-600 uppercase mb-1">{m.sender_pseudo || "Inconnu"}</div>
                                <div className={`max-w-[80%] p-3 text-sm ${m.sender_id === userProfile?.id ? 'bg-[#1A1A1A] border-r-2 border-[#B1976B]' : 'bg-[#0A0A0A] border-l-2 border-gray-700'}`}>
                                    {m.content}
                                </div>
                            </div>
                        ))}
                    </div>

                    <form onSubmit={sendMessage} className="p-4 border-t border-[#1A1A1A] bg-[#030303] flex gap-2">
                        <input
                            type="text"
                            placeholder={channel === 'secret' && !recipientId ? "Sélectionnez un destinataire..." : "Écrire un message..."}
                            disabled={channel === 'secret' && !recipientId}
                            className="flex-grow bg-[#1A1A1A] border-none px-4 py-3 text-sm focus:ring-1 focus:ring-[#B1976B] outline-none text-white disabled:opacity-50"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                        />
                        <button type="submit" className="bg-[#B1976B] text-black px-4 flex items-center justify-center disabled:opacity-50" disabled={channel === 'secret' && !recipientId}>
                            <Send className="w-4 h-4" />
                        </button>
                    </form>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
