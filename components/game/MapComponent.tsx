"use client"

import { useEffect } from "react"
import { MapContainer, ImageOverlay, Marker, Popup } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { motion } from "framer-motion"
import { Sword, X, Ban, Eye, Heart } from "lucide-react"

// Fix for default Leaflet markers
const DefaultIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
})
L.Marker.prototype.options.icon = DefaultIcon

import { HOUSES, getHouse } from "@/lib/gameData"

const WESTEROS_MAP_URL = "/westeros.svg"
const BOUNDS: L.LatLngBoundsExpression = [[0, 0], [1000, 800]]

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
}

interface MapComponentProps {
    players: Profile[]
    myProfile: Profile | null
    selectedTarget: Profile | null
    setSelectedTarget: (target: Profile | null) => void
    handleSelectTarget: (player: Profile) => void
    performAction: (type: string) => void
    distance: number | null
}

export default function MapComponent({
    players,
    myProfile,
    selectedTarget,
    setSelectedTarget,
    handleSelectTarget,
    performAction,
    distance
}: MapComponentProps) {
    // Force map resize to ensure tiles load correctly
    useEffect(() => {
        const timer = setTimeout(() => {
            window.dispatchEvent(new Event('resize'))
        }, 500)
        return () => clearTimeout(timer)
    }, [])

    return (
        <>
            <div className="flex-grow relative h-full w-full overflow-hidden">
                <MapContainer
                    crs={L.CRS.Simple}
                    bounds={BOUNDS}
                    className="h-full w-full z-0"
                    zoom={2}
                    minZoom={1}
                    maxZoom={4}
                    style={{ height: '100%', width: '100%', background: '#030303' }}
                >
                    <ImageOverlay
                        url={WESTEROS_MAP_URL}
                        bounds={BOUNDS}
                        opacity={0.8}
                    />

                    {players.map((player) => {
                        const houseData = getHouse(player.house.toLowerCase()) || {
                            id: 'unknown', name: 'Inconnu', motto: '...', color: '#6d5e46', icon: '🛡️', seat: 'Inconnu', description: 'Une maison mineure.', region: 'Unknown'
                        }
                        const isWW = player.faction === 'whitewalker'

                        return (
                            <Marker
                                key={player.id}
                                position={[player.y, player.x]}
                                eventHandlers={{ click: () => handleSelectTarget(player) }}
                                icon={L.divIcon({
                                    className: 'custom-div-icon',
                                    html: `<div style="
                                    background: ${isWW ? '#a5f3fc' : houseData.color};
                                    width: ${isWW ? '12px' : '16px'}; 
                                    height: ${isWW ? '12px' : '16px'}; 
                                    border-radius: 50%; 
                                    box-shadow: 0 0 10px ${isWW ? '#06b6d4' : houseData.color}; 
                                    border: 2px solid white;
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    font-size: 8px;
                                ">${isWW ? '' : houseData.icon}</div>`,
                                    iconSize: [16, 16],
                                    iconAnchor: [8, 8]
                                })}
                            >
                                <Popup className="custom-popup">
                                    <div className="text-center p-1">
                                        <div className={`font-serif uppercase ${isWW ? 'text-cyan-400 animate-pulse' : 'text-[#B1976B]'} ${!isWW && 'gold-text'}`}>
                                            {player.pseudo} {player.is_bot && <span className="text-[6px] opacity-70">(IA)</span>}
                                        </div>
                                        {!isWW && <div className="text-[6px] text-gray-400 uppercase tracking-widest mb-1">{houseData.name}</div>}
                                        <div className="text-[8px] uppercase tracking-tighter text-gray-500">
                                            {player.soldiers || 0} {isWW ? 'Spectres ❄️' : 'Épées ⚔️'}
                                        </div>
                                        {player.is_rebel && (
                                            <div className="text-[6px] text-red-500 font-bold uppercase mt-1">Séditieux / Hors-la-loi</div>
                                        )}
                                    </div>
                                </Popup>
                            </Marker>
                        )
                    })}
                </MapContainer>
            </div>

            {/* Action Panel */}
            {selectedTarget && (
                <motion.div
                    initial={{ y: 200 }}
                    animate={{ y: 0 }}
                    className="absolute bottom-16 left-4 right-4 z-[1000]"
                >
                    {(() => {
                        const house = getHouse(selectedTarget.house.toLowerCase())
                        const isWW = selectedTarget.faction === 'whitewalker'

                        return (
                            <div className="glass p-0 overflow-hidden border-[#B1976B] border rounded-lg shadow-2xl bg-black/90">
                                {/* Header / Banner */}
                                <div className="relative h-24 overflow-hidden">
                                    <div className="absolute inset-0 opacity-50" style={{ backgroundColor: house?.color || '#333' }} />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                                    <div className="absolute bottom-3 left-4 flex items-end gap-3">
                                        <div className="text-4xl filter drop-shadow-lg">{isWW ? '❄️' : house?.icon || '🛡️'}</div>
                                        <div>
                                            <div className="text-[10px] text-white/70 uppercase tracking-widest">{isWW ? 'Menace' : `Maison ${house?.name || selectedTarget.house}`}</div>
                                            <h2 className="text-2xl font-serif text-white uppercase leading-none tracking-wide text-shadow-sm">{selectedTarget.pseudo}</h2>
                                        </div>
                                    </div>
                                    <button onClick={() => setSelectedTarget(null)} className="absolute top-2 right-2 text-white/50 hover:text-white p-2 bg-black/20 rounded-full"><X className="w-4 h-4" /></button>
                                </div>

                                {/* Stats & Info */}
                                <div className="p-4 grid grid-cols-2 gap-4 border-b border-white/10">
                                    <div className="space-y-1">
                                        <div className="text-[9px] text-gray-500 uppercase tracking-widest">Devise</div>
                                        <div className="text-xs text-[#B1976B] italic font-serif">"{house?.motto || 'L\'Hiver Vient...'}"</div>
                                    </div>
                                    <div className="space-y-1 text-right">
                                        <div className="text-[9px] text-gray-500 uppercase tracking-widest">Forces</div>
                                        <div className="text-xs text-white font-bold">{selectedTarget.soldiers || 0} <span className="text-gray-500 font-normal">{isWW ? 'Spectres' : 'Hommes'}</span></div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-[9px] text-gray-500 uppercase tracking-widest">Siège</div>
                                        <div className="text-xs text-gray-300">{house?.seat || 'Inconnu'}</div>
                                    </div>
                                    <div className="space-y-1 text-right">
                                        <div className="text-[9px] text-gray-500 uppercase tracking-widest">Trésor</div>
                                        <div className="text-xs text-[#B1976B]">{selectedTarget.gold || 0} <span className="text-[8px]">Dragons d'Or</span></div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="p-3 bg-[#0A0A0A]">
                                    <div className="text-[8px] text-gray-600 uppercase tracking-[0.2em] text-center mb-3">Actions Diplomatiques</div>
                                    <div className="grid grid-cols-4 gap-2">
                                        <button onClick={() => performAction('siege')} className="group flex flex-col items-center justify-center p-3 rounded bg-red-900/10 border border-red-900/30 hover:bg-red-900/30 transition-all">
                                            <Sword className="w-5 h-5 text-red-500 mb-1 group-hover:scale-110 transition-transform" />
                                            <span className="text-[7px] uppercase font-bold text-red-400 group-hover:text-red-300">Guerre</span>
                                        </button>
                                        <button onClick={() => performAction('bribe')} className="group flex flex-col items-center justify-center p-3 rounded bg-yellow-900/10 border border-yellow-900/30 hover:bg-yellow-900/30 transition-all">
                                            <Ban className="w-5 h-5 text-yellow-600 mb-1 group-hover:scale-110 transition-transform" />
                                            <span className="text-[7px] uppercase font-bold text-yellow-500 group-hover:text-yellow-400">Corruption</span>
                                        </button>
                                        <button onClick={() => performAction('infiltrate')} className="group flex flex-col items-center justify-center p-3 rounded bg-purple-900/10 border border-purple-900/30 hover:bg-purple-900/30 transition-all">
                                            <Eye className="w-5 h-5 text-purple-500 mb-1 group-hover:scale-110 transition-transform" />
                                            <span className="text-[7px] uppercase font-bold text-purple-400 group-hover:text-purple-300">Espionner</span>
                                        </button>
                                        <button onClick={() => performAction('marriage')} className="group flex flex-col items-center justify-center p-3 rounded bg-pink-900/10 border border-pink-900/30 hover:bg-pink-900/30 transition-all">
                                            <Heart className="w-5 h-5 text-pink-500 mb-1 group-hover:scale-110 transition-transform" />
                                            <span className="text-[7px] uppercase font-bold text-pink-400 group-hover:text-pink-300">Alliance</span>
                                        </button>
                                    </div>
                                    <div className="mt-3 text-center">
                                        <p className="text-[8px] text-gray-600 uppercase tracking-widest italic">
                                            Distance: {distance} Lieues | Marche: {Math.round((distance || 0) * 2)} min
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )
                    })()}
                </motion.div>
            )}

            <style jsx global>{`
                .leaflet-container { background: #030303 !important; }
                .custom-popup .leaflet-popup-content-wrapper {
                    background: #1A1A1A !important;
                    color: white !important;
                    border-radius: 0 !important;
                    border: 1px solid #B1976B !important;
                }
                .custom-popup .leaflet-popup-tip { background: #B1976B !important; }
            `}</style>
        </>
    )
}
