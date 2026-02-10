-- Extension pour Game of Thrones: Conquest
-- Complétez votre base de données avec ces structures

-- 1. Extension des Profils pour les nouvelles ressources
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS culture INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS prestige INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS power_score INTEGER DEFAULT 0;

-- 2. Système de Salles (Lobby)
CREATE TABLE IF NOT EXISTS rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    host_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'waiting', -- waiting, active, finished
    max_players INTEGER DEFAULT 8,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 3. Système de Diplomatie (Alliances & Trahisons)
CREATE TABLE IF NOT EXISTS diplomacy_relations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    initiator_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    target_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- marriage, alliance, nap (non-aggression), spy
    status TEXT DEFAULT 'pending', -- pending, active, broken
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(initiator_id, target_id, type)
);

-- 4. Persistance de la Carte (Optionnel mais recommandé pour un MMO)
CREATE TABLE IF NOT EXISTS map_territories (
    q INTEGER,
    r INTEGER,
    owner_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    last_captured TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (q, r)
);

-- 5. RLS pour les nouvelles tables
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE diplomacy_relations ENABLE ROW LEVEL SECURITY;
ALTER TABLE map_territories ENABLE ROW LEVEL SECURITY;

-- Policies pour rooms
CREATE POLICY "Tout le monde peut voir les salles" ON rooms FOR SELECT USING (true);
CREATE POLICY "Les hôtes peuvent créer des salles" ON rooms FOR INSERT WITH CHECK (auth.uid() = host_id);

-- Policies pour diplomatie
CREATE POLICY "Les joueurs voient leurs relations" ON diplomacy_relations 
FOR SELECT USING (initiator_id = auth.uid() OR target_id = auth.uid());

CREATE POLICY "Les joueurs proposent des traités" ON diplomacy_relations 
FOR INSERT WITH CHECK (initiator_id = auth.uid());

-- Trigger pour mettre à jour le score de puissance
CREATE OR REPLACE FUNCTION update_power_score()
RETURNS TRIGGER AS $$
BEGIN
    NEW.power_score := (NEW.soldiers * 10) + (NEW.gold / 10) + (NEW.prestige * 5);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_update_power
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION update_power_score();
