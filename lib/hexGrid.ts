export const HEX_SIZE = 25
export const HEX_WIDTH = Math.sqrt(3) * HEX_SIZE
export const HEX_HEIGHT = 2 * HEX_SIZE

export function hexToPixel(q: number, r: number): { x: number, y: number } {
    const x = HEX_SIZE * (Math.sqrt(3) * q + Math.sqrt(3) / 2 * r)
    const y = HEX_SIZE * (3 / 2 * r)
    return { x, y }
}

export function pixelToHex(x: number, y: number): { q: number, r: number } {
    const q = (Math.sqrt(3) / 3 * x - 1 / 3 * y) / HEX_SIZE
    const r = (2 / 3 * y) / HEX_SIZE
    return { q: Math.round(q), r: Math.round(r) }
}

export function getHexColor(type: string, region: string): string {
    switch (type) {
        case 'water': return '#1a2b3c' // Mer sombre
        case 'snow': return '#e6f2ff' // Neige
        case 'forest': return '#2d5a27' // Forêt sombre
        case 'mountain': return '#5d4037' // Montagne brune
        case 'plains': return '#8d6e63' // Terre
        case 'castle': return '#4a4a4a' // Château gris
        case 'wall': return '#ffffff' // Le Mur
        default: return '#000000'
    }
}
