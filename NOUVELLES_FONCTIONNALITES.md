# 🎯 Nouvelles Fonctionnalités - Iron Throne

## ✅ Implémentations Complètes

### 1. **Système de Monarchie (Trône de Fer)**
- ✅ Un joueur peut être désigné comme Monarque (`is_monarch = true`)
- ✅ Les vassaux doivent payer 200 dragons d'or de taxes à la Couronne
- ✅ Fonction SQL `pay_tax_to_monarch()` pour gérer les paiements
- ✅ Interface dédiée dans le panneau "Trône"

### 2. **Banque de Fer (Rôle Admin/Banquier)**
- ✅ Un joueur peut être désigné comme Banquier (`is_banker = true`)
- ✅ Le banquier peut accorder des prêts avec intérêts aléatoires (5-25%)
- ✅ Table `loans` pour suivre les prêts actifs
- ✅ Interface de gestion des prêts dans le panneau "Trône"

### 3. **Système de Quêtes**
- ✅ Le banquier (admin) peut créer des quêtes
- ✅ Table `quests` pour stocker les quêtes
- ✅ Récompenses en or et en soldats
- ✅ Interface de création et visualisation des quêtes

### 4. **Chat Privé Fonctionnel**
- ✅ Table `private_messages` dédiée aux messages privés
- ✅ Sélection du destinataire via dropdown
- ✅ Onglet "Privé" dans le chat
- ✅ Temps réel avec Supabase Realtime

### 5. **Progression Sauvegardée**
- ✅ Toutes les données sont persistées dans Supabase
- ✅ Colonnes ajoutées : `is_monarch`, `is_banker`, `debt`, `last_tax_paid`

## 📋 Instructions de Déploiement

### Étape 1 : Exécuter le Script SQL
1. Allez sur votre tableau de bord Supabase
2. Ouvrez l'éditeur SQL
3. Copiez le contenu de `supabase_monarchy_system.sql`
4. Exécutez le script

### Étape 2 : Désigner le Premier Monarque
```sql
-- Dans l'éditeur SQL Supabase
UPDATE profiles 
SET is_monarch = true 
WHERE pseudo = 'VotrePseudo';
```

### Étape 3 : Désigner le Banquier (Admin)
```sql
-- Dans l'éditeur SQL Supabase
UPDATE profiles 
SET is_banker = true 
WHERE pseudo = 'VotrePseudo';
```

### Étape 4 : Déployer sur Vercel
```bash
git add .
git commit -m "Système de Monarchie, Banque de Fer et Chat Privé"
git push origin main
```

## 🎮 Utilisation

### Pour les Joueurs Normaux
1. **Payer les Taxes** : Cliquez sur l'icône Couronne (Trône) → Onglet "Taxes" → Bouton "Payer les Taxes"
2. **Messages Privés** : Cliquez sur "Ravens" → Onglet "Privé" → Sélectionnez un destinataire → Envoyez

### Pour le Monarque
1. Accédez au panneau "Trône"
2. Voyez votre trésor royal augmenter avec les taxes
3. Gérez votre royaume

### Pour le Banquier (Admin)
1. **Accorder des Prêts** : Panneau "Trône" → Onglet "Banque" → Sélectionnez un emprunteur → Montant → Accorder
2. **Créer des Quêtes** : Panneau "Trône" → Onglet "Quêtes" → Titre + Récompense → Publier

## 🔧 Fichiers Modifiés/Créés

### Nouveaux Fichiers
- `supabase_monarchy_system.sql` - Script SQL complet
- `components/game/MonarchyPanel.tsx` - Interface Monarchie/Banque/Quêtes

### Fichiers Modifiés
- `components/game/RavensChat.tsx` - Support messages privés
- `app/map/page.tsx` - Intégration du panneau Monarchie
- `lib/gameData.ts` - (Déjà existant, pas modifié)

## 🎨 Interface Utilisateur

### Bouton "Trône" (Bottom Nav)
- Icône : Couronne dorée
- Position : Barre de navigation inférieure
- Ouvre le panneau Monarchie

### Panneau Monarchie
- **Onglet Taxes** : Payer/Recevoir les taxes
- **Onglet Banque** : Gérer les prêts (banquier uniquement)
- **Onglet Quêtes** : Créer/Voir les quêtes (banquier uniquement)

### Chat Privé
- **Onglet Privé** : Remplace "Secret"
- **Dropdown** : Sélection du destinataire
- **Messages** : Stockés dans `private_messages`

## ⚠️ Notes Importantes

1. **RLS (Row Level Security)** : Activé sur toutes les nouvelles tables
2. **Fonction SQL** : `pay_tax_to_monarch()` utilise `SECURITY DEFINER`
3. **Intérêts Aléatoires** : Entre 5% et 25% pour chaque prêt
4. **Taxes Fixes** : 200 dragons d'or par paiement

## 🚀 Prochaines Étapes Suggérées

1. Ajouter un système de rébellion contre le Monarque
2. Implémenter des pénalités pour non-paiement des taxes
3. Créer un système de remboursement automatique des prêts
4. Ajouter des notifications pour les nouveaux messages privés
