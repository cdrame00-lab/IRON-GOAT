"use client"

import React, { useEffect, useState, useMemo } from "react"
import { MapContainer, useMap, Polygon, Tooltip } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { motion, AnimatePresence } from "framer-motion"
import { Sword, Ban, Eye, Heart, X, Crown, Castle, Shield } from "lucide-react"
import { HOUSES, getHouse } from "@/lib/gameData"
import { HEX_SIZE, HEX_WIDTH, HEX_HEIGHT, getHexColor } from "@/lib/hexGrid"

// --- Types ---
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

interface HexTile {
    q: number
    r: number
    x: number // Map pixel X
    y: number // Map pixel Y
    type: 'land' | 'water' | 'mountain' | 'forest' | 'snow' | 'castle'
    region: string
    ownerId?: string // Qui contrôle cette tuile
}

// --- Generator Helper ---
function generateHexGrid(width: number, height: number): HexTile[] {
    const tiles: HexTile[] = []
    for (let r = 0; r < height; r++) {
        for (let q = 0; q < width; q++) {
            // Offset coordinates to pixel
            // Using "Pointy topped" hexes
            const x = HEX_SIZE * (Math.sqrt(3) * q + Math.sqrt(3) / 2 * r)
            const y = HEX_SIZE * (3 / 2 * r)

            // Simple Logic for Westeros Shape
            let type: HexTile['type'] = 'water'
            let region = 'Narrow Sea'

            // Forme approximative de Westeros (très simplifiée)
            // On utilise des coordonnées (q, r) pour définir la terre
            const isLand = (q > 3 && q < 12) && (r > 2 && r < 38)

            if (isLand) {
                if (r < 10) { type = 'snow'; region = 'North' }
                else if (r < 15) { type = 'forest'; region = 'Riverlands' }
                else if (r < 20) { type = 'mountain'; region = 'Westerlands' }
                else if (r < 28) { type = 'land'; region = 'Reach' }
                else { type = 'land'; region = 'Dorne' }
            }

            // Random variation
            if (type !== 'water' && Math.random() > 0.85) type = 'mountain'
            if (type === 'land' && Math.random() > 0.7) type = 'forest'

            tiles.push({ q, r, x, y, type, region })
        }
    }
    return tiles
}

// --- Components ---

export default function InteractiveMap({
    players,
    myProfile,
    onAction,
    selectedTarget,
    setSelectedTarget
}: {
    players: Profile[]
    myProfile: Profile | null
    onAction: (type: string, target?: Profile) => void
    selectedTarget: Profile | null
    setSelectedTarget: (p: Profile | null) => void
}) {
    // Generate static grid once
    const tiles = useMemo(() => generateHexGrid(15, 40), [])

    const handleHexClick = (tile: HexTile, owner?: Profile) => {
        if (owner) {
            setSelectedTarget(owner)
        } else {
            console.log("Clicked empty tile:", tile.region)
        }
    }

    return (
        <div className="relative w-full h-full bg-[#1a2b3c] overflow-hidden">
            {/* Note: Leaflet Coordinate System is tricky. 
                 We use CRS.Simple for game coordinates.
                 Leaflet maps [y, x] to [lat, lng].
             */}
            <MapContainer
                center={[500, 250]}
                zoom={-1}
                className="w-full h-full bg-[#1a2b3c]"
                crs={L.CRS.Simple}
                minZoom={-2}
                maxZoom={2}
                scrollWheelZoom={true}
                doubleClickZoom={false}
                zoomControl={false}
            >
                <CustomHexLayer tiles={tiles} players={players} onHexClick={handleHexClick} />
            </MapContainer>

            {/* Kingdom Sheet (UI Overlay) */}
            <AnimatePresence>
                {selectedTarget && (
                    <motion.div
                        initial={{ y: 200 }}
                        animate={{ y: 0 }}
                        exit={{ y: 200 }}
                        className="absolute bottom-16 left-4 right-4 z-[1000]"
                    >
                        {(() => {
                            const house = getHouse(selectedTarget.house.toLowerCase())
                            const isWW = selectedTarget.faction === 'whitewalker'
                            const isMe = selectedTarget.id === myProfile?.id

                            return (
                                <div className="glass p-0 overflow-hidden border-[#B1976B] border rounded-lg shadow-2xl bg-black/95">
                                    <div className="relative h-20 overflow-hidden bg-cover bg-center" style={{ backgroundColor: house?.color || '#333' }}>
                                        <div className="absolute top-2 right-2">
                                            <button onClick={() => setSelectedTarget(null)}><X className="text-white w-5 h-5" /></button>
                                        </div>
                                        <div className="absolute bottom-2 left-4 flex gap-3 items-end">
                                            <div className="text-4xl shadow-xl filter drop-shadow user-select-none">{house?.icon || '🛡️'}</div>
                                            <div>
                                                <div className="text-[10px] uppercase text-gray-400 tracking-widest">{selectedTarget.pseudo}</div>
                                                <div className="text-xl font-serif text-[#B1976B] uppercase">{house?.name || selectedTarget.house}</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-4 grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <div className="text-[9px] uppercase text-gray-500">Puissance</div>
                                            <div className="text-sm font-bold text-white flex items-center gap-1">
                                                <Sword className="w-3 h-3 text-gray-400" /> {selectedTarget.soldiers} <span className="text-[9px] font-normal text-gray-500">Soldats</span>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="text-[9px] uppercase text-gray-500">Richesse</div>
                                            <div className="text-sm font-bold text-[#B1976B] flex items-center gap-1">
                                                <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500" /> {selectedTarget.gold} <span className="text-[9px] font-normal text-gray-500">Or</span>
                                            </div>
                                        </div>
                                    </div>

                                    {!isMe && (
                                        <div className="p-2 bg-[#111] grid grid-cols-4 gap-1">
                                            <ActionButton icon={<Sword />} label="Guerre" color="red" onClick={() => onAction('siege', selectedTarget)} />
                                            <ActionButton icon={<Ban />} label="Corruption" color="yellow" onClick={() => onAction('bribe', selectedTarget)} />
                                            <ActionButton icon={<Eye />} label="Espion" color="purple" onClick={() => onAction('infiltrate', selectedTarget)} />
                                            <ActionButton icon={<Heart />} label="Alliance" color="pink" onClick={() => onAction('marriage', selectedTarget)} />
                                        </div>
                                    )}
                                </div>
                            )
                        })()}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

function ActionButton({ icon, label, color, onClick }: any) {
    const colors: any = {
        red: 'text-red-500 border-red-900/40 hover:bg-red-900/20',
        yellow: 'text-yellow-500 border-yellow-900/40 hover:bg-yellow-900/20',
        purple: 'text-purple-500 border-purple-900/40 hover:bg-purple-900/20',
        pink: 'text-pink-500 border-pink-900/40 hover:bg-pink-900/20',
    }
    return (
        <button className={`flex flex-col items-center justify-center p-2 border rounded transition-all ${colors[color]}`} onClick={onClick}>
            {React.cloneElement(icon, { className: "w-4 h-4 mb-1" })}
            <span className="text-[7px] uppercase font-bold tracking-wider">{label}</span>
        </button>
    )
}

// Separate component to hook into useMap
function CustomHexLayer({ tiles, players, onHexClick }: any) {
    const map = useMap()

    // Initial view set
    useEffect(() => {
        // Center the map roughly on Westeros
        map.setView([500, 250], -1)
    }, [map])

    return (
        <>
            {tiles.map((tile: HexTile) => {
                if (tile.type === 'water') return null

                const angle = Math.PI / 3
                const size = 18 // Slightly smaller than spacing for gap
                // Leaflet uses [lat, lng]. In CRS.Simple, it's [y, x].
                const center = [tile.y, tile.x] as [number, number]

                const points = []
                for (let i = 0; i < 6; i++) {
                    points.push([
                        center[0] + size * Math.sin(angle * i),
                        center[1] + size * Math.cos(angle * i)
                    ])
                }

                // Color by Region
                let fillColor = '#333'
                if (tile.region === 'North') fillColor = '#bdc3c7' // Gris clair/Neige
                if (tile.region === 'Riverlands') fillColor = '#2ecc71' // Vert
                if (tile.region === 'Westerlands') fillColor = '#e74c3c' // Rouge montagne
                if (tile.region === 'Reach') fillColor = '#f1c40f' // Champs blé
                if (tile.region === 'Dorne') fillColor = '#e67e22' // Orange désert
                if (tile.type === 'forest') fillColor = '#27ae60' // Forêt dense
                if (tile.type === 'mountain') fillColor = '#7f8c8d' // Pierre

                // If a player is ON this tile (approx)
                const occupant = players.find((p: Profile) => {
                    const px = p.x || 0
                    const py = p.y || 0
                    return Math.abs(px - tile.x) < 40 && Math.abs(py - tile.y) < 40
                })

                if (occupant) {
                    fillColor = getHouse(occupant.house.toLowerCase())?.color || '#fff'
                }

                return (
                    <Polygon
                        key={`${tile.q}-${tile.r}`}
                        positions={points as any}
                        pathOptions={{
                            color: '#000',
                            weight: 1,
                            fillColor: fillColor,
                            fillOpacity: occupant ? 0.9 : 0.4
                        }}
                        eventHandlers={{
                            click: () => onHexClick(tile, occupant)
                        }}
                    >
                        {/* Optional Tooltip */}
                        {occupant && (
                            <Tooltip direction="center" permanent offset={[0, 0]} opacity={0.9} className="bg-transparent border-none shadow-none">
                                <span className="font-bold text-white drop-shadow-md text-[10px]">{occupant.house.substring(0, 2)}</span>
                            </Tooltip>
                        )}
                    </Polygon>
                )
            })}
        </>
    )
}
