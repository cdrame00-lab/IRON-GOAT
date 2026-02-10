export const HOUSES = [
    { 
        id: 'stark', 
        name: 'Stark', 
        motto: 'L\'hiver vient', 
        color: '#888888', 
        icon: '🐺', 
        seat: 'Winterfell', 
        description: 'Gardiens du Nord, fiers et honorables.', 
        region: 'North',
        lore: "Maison ancestrale descendant des Premiers Hommes, les Stark règnent sur le Nord depuis des millénaires. Ils sont connus pour leur résistance au froid et leur sens de l'honneur inébranlable.",
        strengths: "Défense accrue en hiver, Loyauté des vassaux élevée.",
        weaknesses: "Faible intrigue politique, Economie lente."
    },
    { 
        id: 'lannister', 
        name: 'Lannister', 
        motto: 'Je rugis !', 
        color: '#C02424', 
        icon: '🦁', 
        seat: 'Castral Roc', 
        description: 'Riches et impitoyables, ils paient toujours leurs dettes.', 
        region: 'Westerlands',
        lore: "Les Lannister sont la maison la plus riche des Sept Couronnes, tirant leur fortune des mines d'or de l'Ouest. Ils excellent dans la manipulation politique et la guerre par l'argent.",
        strengths: "Ressources financières illimitées, Espionnage efficace.",
        weaknesses: "Arrogance (Diplomatie difficile), Coût d'entretien des armées élevé." 
    },
    { 
        id: 'baratheon', 
        name: 'Baratheon', 
        motto: 'Nôtre est la fureur', 
        color: '#E3B341', 
        icon: '🦌', 
        seat: 'Accalmie', 
        description: 'Puissants guerriers, nés dans la tempête.', 
        region: 'Stormlands',
        lore: "Nés de la conquête, les Baratheon sont des guerriers féroces. Leur forteresse, Accalmie, est imprenable. Ils ont le sang du dragon par leur lignée féminine.",
        strengths: "Bonus d'attaque en bataille rangée, Moral des troupes élevé.",
        weaknesses: "Gestion économique médiocre, Diplomatie brusque."
    },
    { 
        id: 'targaryen', 
        name: 'Targaryen', 
        motto: 'Feu et Sang', 
        color: '#000000', 
        icon: '🐉', 
        seat: 'Peyredragon', 
        description: 'Le sang de l\'ancienne Valyria, maîtres des dragons.', 
        region: 'Crownlands',
        lore: "L'ancienne dynastie royale, capable de lier des dragons à leur volonté. Ils sont souvent en proie à la folie, mais leur puissance de feu est inégalée.",
        strengths: "Unités uniques (Dragons), Crainte inspirée aux ennemis.",
        weaknesses: "Instabilité mentale (Malus aléatoires), Détestés par les usurpateurs."
    },
    { 
        id: 'greyjoy', 
        name: 'Greyjoy', 
        motto: 'Nous ne semons pas', 
        color: '#333333', 
        icon: '🦑', 
        seat: 'Pyke', 
        description: 'Seigneurs des Îles de Fer, rois du sel et du roc.', 
        region: 'Iron Islands',
        lore: "Les Fer-nés sont des pillards redoutables qui ne croient qu'en la force de leurs bras. Ils méprisent l'agriculture et le commerce conventionnel.",
        strengths: "Flotte navale supérieure, Pillage de ressources rapide.",
        weaknesses: "Aucune agriculture, Diplomatie impossible avec les terres vertes."
    },
    { 
        id: 'martell', 
        name: 'Martell', 
        motto: 'Insoumis, Invaincus, Intacts', 
        color: '#E38041', 
        icon: '☀️', 
        seat: 'Lancehélion', 
        description: 'Le venin de Dorne, brûlant sous le soleil.', 
        region: 'Dorne',
        lore: "Isolés dans le désert de Dorne, les Martell préfèrent les lances, le poison et la guérilla. Ils respectent les femmes au pouvoir autant que les hommes.",
        strengths: "Résistance à la chaleur, Tactiques de guérilla (Embuscades).",
        weaknesses: "Armure légère (Faible en choc frontal), Isolation politique."
    },
    { 
        id: 'tyrell', 
        name: 'Tyrell', 
        motto: 'Plus haut, plus fort', 
        color: '#2D7A2F', 
        icon: '🌹', 
        seat: 'Hautjardin', 
        description: 'Maîtres des récoltes et de la chevalerie.', 
        region: 'Reach',
        lore: "Gardiens du Bief, le grenier à blé de Westeros. Les Tyrell possèdent l'armée la plus nombreuse et usent de leur richesse alimentaire comme d'une arme.",
        strengths: "Production de nourriture immense, Chevalerie nombreuse.",
        weaknesses: "Qualité des troupes moyenne, Dépendance au climat."
    },
    { 
        id: 'nightwatch', 
        name: 'Garde de Nuit', 
        motto: 'Le Bouclier des Royaumes', 
        color: '#000000', 
        icon: '⚔️', 
        seat: 'Châteaunoir', 
        description: 'Le Lord Commandant protège le Mur contre les horreurs du Nord.', 
        region: 'The Wall',
        lore: "Un ordre ancien de parias et de volontaires jurés à la protection des royaumes humains. Ils ne prennent pas part aux guerres des rois.",
        strengths: "Défense imprenable (Le Mur), Recrutement peu coûteux.",
        weaknesses: "Pas de descendance, Ressources très limitées."
    },
    { 
        id: 'bolton', 
        name: 'Bolton', 
        motto: 'Nos lames sont acérées', 
        color: '#E86676', 
        icon: '🩸', 
        seat: 'Fort-Terreur', 
        description: 'Une maison ancienne connue pour ses pratiques cruelles.', 
        region: 'North',
        lore: "Rivaux historiques des Stark, les Bolton écorchent leurs ennemis. La peur est leur principal outil de gouvernance.",
        strengths: "Inspirer la terreur (Baisse le moral ennemi), Torture (Information).",
        weaknesses: "Détestés par tous, Loyauté des troupes faible."
    },
    { 
        id: 'frey', 
        name: 'Frey', 
        motto: 'Nous tenons le passage', 
        color: '#4F5D75', 
        icon: '🏰', 
        seat: 'Les Jumeaux', 
        description: 'Gardiens du pont, riches et nombreux.', 
        region: 'Riverlands',
        lore: "Une maison parvenue qui s'est enrichie en taxant le passage de la Verfurque. Ils sont nombreux, rancuniers et souvent sous-estimés.",
        strengths: "Revenus de péage, Nombreuse progéniture (Alliances).",
        weaknesses: "Lâcheté militaire, Réputation de traîtres."
    },
]

export const CULTURES = [
    { id: 'north', name: 'Premier Homme', bonus: '+20% Défense en Hiver' },
    { id: 'andal', name: 'Andal', bonus: '+15% Prestige Diplomatique' },
    { id: 'rhoynar', name: 'Rhoynar', bonus: '+25% Vitesse Navale' },
    { id: 'valyrian', name: 'Valyrien', bonus: '+10% Puissance Militaire' },
]

export const getHouse = (id: string) => HOUSES.find(h => h.id === id)
export const getCulture = (id: string) => CULTURES.find(c => c.id === id)
