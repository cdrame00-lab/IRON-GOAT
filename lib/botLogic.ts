export interface Bot {
    id: string
    pseudo: string
    house: string
    behavior: "aggressive" | "diplomatic" | "balanced"
    power: number
    status: "online"
}

const BOT_NAMES = [
    "Walder Bot", " Ramsay Machine", "Joffrey AI", "Littlefinger Bot",
    "Varys Logic", "Tywin Compute", "The Mountain.exe", "Hound Proxy"
]

const HOUSES = ["Stark", "Lannister", "Baratheon", "Targaryen", "Greyjoy", "Martell", "Tyrell", "Bolton"]

export function generateBots(count: number): Bot[] {
    return Array.from({ length: count }, (_, i) => {
        const behavior = Math.random() > 0.6 ? "aggressive" : (Math.random() > 0.5 ? "diplomatic" : "balanced")
        return {
            id: `bot-${i}-${Date.now()}`,
            pseudo: `${BOT_NAMES[Math.floor(Math.random() * BOT_NAMES.length)]} #${Math.floor(Math.random() * 999)}`,
            house: HOUSES[Math.floor(Math.random() * HOUSES.length)],
            behavior: behavior as any,
            power: Math.floor(Math.random() * 20000) + 5000,
            status: "online"
        }
    })
}
