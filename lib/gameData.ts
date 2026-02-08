export const HOUSES = [
    { id: 'stark', name: 'Stark', motto: 'L\'hiver vient', color: '#888888', icon: '🐺', seat: 'Winterfell', description: 'Gardiens du Nord, fiers et honorables.', region: 'North' },
    { id: 'lannister', name: 'Lannister', motto: 'Je rugis !', color: '#C02424', icon: '🦁', seat: 'Castral Roc', description: 'Riches et impitoyables, ils paient toujours leurs dettes.', region: 'Westerlands' },
    { id: 'baratheon', name: 'Baratheon', motto: 'Nôtre est la fureur', color: '#E3B341', icon: '🦌', seat: 'Accalmie', description: 'Puissants guerriers, nés dans la tempête.', region: 'Stormlands' },
    { id: 'targaryen', name: 'Targaryen', motto: 'Feu et Sang', color: '#000000', icon: '🐉', seat: 'Peyredragon', description: 'Le sang de l\'ancienne Valyria, maîtres des dragons.', region: 'Crownlands' },
    { id: 'greyjoy', name: 'Greyjoy', motto: 'Nous ne semons pas', color: '#333333', icon: '🦑', seat: 'Pyke', description: 'Seigneurs des Îles de Fer, rois du sel et du roc.', region: 'Iron Islands' },
    { id: 'martell', name: 'Martell', motto: 'Insoumis, Invaincus, Intacts', color: '#E38041', icon: '☀️', seat: 'Lancehélion', description: 'Le venin de Dorne, brûlant sous le soleil.', region: 'Dorne' },
    { id: 'tyrell', name: 'Tyrell', motto: 'Plus haut, plus fort', color: '#2D7A2F', icon: '🌹', seat: 'Hautjardin', description: 'Maîtres des récoltes et de la chevalerie.', region: 'Reach' },
    { id: 'nightwatch', name: 'Garde de Nuit', motto: 'Le Bouclier des Royaumes', color: '#000000', icon: '⚔️', seat: 'Châteaunoir', description: 'Le Lord Commandant protège le Mur contre les horreurs du Nord.', region: 'The Wall' },
    { id: 'bolton', name: 'Bolton', motto: 'Nos lames sont acérées', color: '#E86676', icon: '🩸', seat: 'Fort-Terreur', description: 'Une maison ancienne connue pour ses pratiques cruelles.', region: 'North' },
    { id: 'frey', name: 'Frey', motto: 'Nous tenons le passage', color: '#4F5D75', icon: '🏰', seat: 'Les Jumeaux', description: 'Gardiens du pont, riches et nombreux.', region: 'Riverlands' },
]

export const CULTURES = [
    { id: 'north', name: 'Premier Homme', bonus: '+20% Défense en Hiver' },
    { id: 'andal', name: 'Andal', bonus: '+15% Prestige Diplomatique' },
    { id: 'rhoynar', name: 'Rhoynar', bonus: '+25% Vitesse Navale' },
    { id: 'valyrian', name: 'Valyrien', bonus: '+10% Puissance Militaire' },
]

export const getHouse = (id: string) => HOUSES.find(h => h.id === id)
export const getCulture = (id: string) => CULTURES.find(c => c.id === id)
