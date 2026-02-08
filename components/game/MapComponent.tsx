"use client"

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

const WESTEROS_MAP_URL = "https://awoiaf.westeros.org/images/2/2e/Westeros_political.png"
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

                    {players.map((player) => (
                        <Marker
                            key={player.id}
                            position={[player.y, player.x]}
                            eventHandlers={{ click: () => handleSelectTarget(player) }}
                            icon={player.faction === 'whitewalker' ? L.divIcon({
                                className: 'custom-div-icon',
                                html: `<div style="background: #a5f3fc; width: 12px; height: 12px; border-radius: 50%; box-shadow: 0 0 10px #06b6d4; border: 2px solid white;"></div>`,
                                iconSize: [12, 12],
                                iconAnchor: [6, 6]
                            }) : undefined}
                        >
                            <Popup className="custom-popup">
                                <div className="text-center p-1">
                                    <div className={`font-serif uppercase ${player.faction === 'whitewalker' ? 'text-cyan-400 animate-pulse' : 'text-[#B1976B]'}`}>
                                        {player.pseudo} {player.is_bot && <span className="text-[6px] opacity-70">(IA)</span>}
                                    </div>
                                    <div className="text-[8px] uppercase tracking-tighter text-gray-500">
                                        {player.house} | {player.soldiers || 0} {player.faction === 'whitewalker' ? 'Spectres ❄️' : '⚔️'}
                                    </div>
                                    {player.is_rebel && (
                                        <div className="text-[6px] text-red-500 font-bold uppercase mt-1">Séditieux / Hors-la-loi</div>
                                    )}
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>

            {/* Action Panel */}
            {selectedTarget && (
                <motion.div
                    initial={{ y: 200 }}
                    animate={{ y: 0 }}
                    className="absolute bottom-16 left-4 right-4 z-[1000] glass p-5 border-t-2 border-t-[#B1976B]"
                >
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <div className="text-[10px] text-[#B1976B] uppercase tracking-[0.2em] mb-1">Cible Diplomatique</div>
                            <div className="text-xl font-serif uppercase leading-none">{selectedTarget.pseudo}</div>
                            <div className="text-[10px] text-gray-500 italic mt-1 leading-none">Armée : {selectedTarget.soldiers || 0} hommes</div>
                        </div>
                        <button onClick={() => setSelectedTarget(null)} className="text-gray-500 p-2"><X className="w-4 h-4" /></button>
                    </div>

                    <div className="grid grid-cols-4 gap-2">
                        <button onClick={() => performAction('siege')} className="flex flex-col items-center justify-center p-2 border border-red-900/50 hover:bg-red-900/10 transition-colors">
                            <Sword className="w-5 h-5 text-red-500 mb-1" />
                            <span className="text-[8px] uppercase font-bold text-gray-400">Assiéger</span>
                        </button>
                        <button onClick={() => performAction('bribe')} className="flex flex-col items-center justify-center p-2 border border-[#B1976B]/30 hover:bg-[#B1976B]/10">
                            <Ban className="w-5 h-5 text-yellow-600 mb-1" />
                            <span className="text-[8px] uppercase font-bold text-gray-400">Soudoyer</span>
                        </button>
                        <button onClick={() => performAction('infiltrate')} className="flex flex-col items-center justify-center p-2 border border-purple-900/30 hover:bg-purple-900/10">
                            <Eye className="w-5 h-5 text-purple-500 mb-1" />
                            <span className="text-[8px] uppercase font-bold text-gray-400">Infiltrer</span>
                        </button>
                        <button onClick={() => performAction('marriage')} className="flex flex-col items-center justify-center p-2 border border-pink-900/30 hover:bg-pink-900/10">
                            <Heart className="w-5 h-5 text-pink-500 mb-1" />
                            <span className="text-[8px] uppercase font-bold text-gray-400">Mariage</span>
                        </button>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#1A1A1A] text-center">
                        <p className="text-[8px] text-gray-600 uppercase tracking-widest italic">
                            Distance: {distance} Lieues | Trajet estimé: {Math.round((distance || 0) * 2)} minutes
                        </p>
                    </div>
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
