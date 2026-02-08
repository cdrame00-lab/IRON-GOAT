-- Ajout des colonnes pour le système de monarchie et banque
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_monarch BOOLEAN DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_banker BOOLEAN DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS debt INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_tax_paid TIMESTAMP;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_rebel BOOLEAN DEFAULT false;

-- Table pour les prêts de la Banque de Fer
CREATE TABLE IF NOT EXISTS loans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    borrower_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    lender_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL,
    interest_rate DECIMAL(5,2) NOT NULL,
    total_due INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    due_date TIMESTAMP,
    status TEXT DEFAULT 'active' -- active, paid, defaulted
);

-- Table pour les quêtes
CREATE TABLE IF NOT EXISTS quests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    reward_gold INTEGER DEFAULT 0,
    reward_soldiers INTEGER DEFAULT 0,
    target_player_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'active', -- active, completed, failed
    created_at TIMESTAMP DEFAULT NOW()
);

-- Table pour les messages privés
CREATE TABLE IF NOT EXISTS private_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    recipient_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    read BOOLEAN DEFAULT false
);

-- Activer RLS (Row Level Security)
ALTER TABLE loans ENABLE ROW LEVEL SECURITY;
ALTER TABLE quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE private_messages ENABLE ROW LEVEL SECURITY;

-- Policies pour loans
CREATE POLICY "Users can view their own loans" ON loans FOR SELECT USING (borrower_id = auth.uid() OR lender_id = auth.uid());
CREATE POLICY "Bankers can create loans" ON loans FOR INSERT WITH CHECK (lender_id = auth.uid());
CREATE POLICY "Users can update their loans" ON loans FOR UPDATE USING (borrower_id = auth.uid() OR lender_id = auth.uid());

-- Policies pour quests
CREATE POLICY "Users can view quests" ON quests FOR SELECT USING (true);
CREATE POLICY "Admins can create quests" ON quests FOR INSERT WITH CHECK (true);
CREATE POLICY "Quest creators can update" ON quests FOR UPDATE USING (creator_id = auth.uid());

-- Policies pour private_messages
CREATE POLICY "Users can view their messages" ON private_messages FOR SELECT USING (sender_id = auth.uid() OR recipient_id = auth.uid());
CREATE POLICY "Users can send messages" ON private_messages FOR INSERT WITH CHECK (sender_id = auth.uid());
CREATE POLICY "Recipients can mark as read" ON private_messages FOR UPDATE USING (recipient_id = auth.uid());

-- Fonction pour payer les taxes au Roi
CREATE OR REPLACE FUNCTION pay_tax_to_monarch(player_id UUID, tax_amount INTEGER)
RETURNS void AS $$
DECLARE
    monarch_id UUID;
BEGIN
    -- Trouver le monarque
    SELECT id INTO monarch_id FROM profiles WHERE is_monarch = true LIMIT 1;
    
    IF monarch_id IS NULL THEN
        RAISE EXCEPTION 'Aucun monarque sur le Trône de Fer';
    END IF;
    
    -- Déduire l'or du joueur
    UPDATE profiles SET gold = gold - tax_amount, last_tax_paid = NOW() WHERE id = player_id;
    
    -- Ajouter l'or au monarque
    UPDATE profiles SET gold = gold + tax_amount WHERE id = monarch_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
