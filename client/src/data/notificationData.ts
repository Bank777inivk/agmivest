// Notification data for popup system
export const frenchFirstNames = [
    "Alexandre", "Antoine", "Arthur", "Baptiste", "Benjamin", "Clément", "David", "Dylan",
    "Enzo", "Étienne", "Florian", "Gabriel", "Hugo", "Jules", "Julien", "Kevin",
    "Laurent", "Louis", "Lucas", "Mathis", "Maxime", "Nathan", "Nicolas", "Noah",
    "Paul", "Pierre", "Raphaël", "Romain", "Samuel", "Simon", "Thomas", "Théo",
    "Victor", "Vincent", "Yanis", "Yann", "Adrien", "Alexis", "Arnaud", "Aurélien",
    "Bastien", "Cédric", "Charles", "Christophe", "Damien", "Denis", "Dimitri", "Émile",
    "Fabien", "François", "Grégory", "Guillaume", "Henri", "Jérôme", "Jonathan", "Jordan",
    "Kévin", "Léo", "Loïc", "Marc", "Martin", "Matthieu", "Maxence", "Michaël",
    "Olivier", "Patrick", "Philippe", "Quentin", "Rémi", "Robin", "Sébastien", "Stéphane",
    "Thibault", "Valentin", "Xavier", "Yoann", "Zacharie", "Alain", "André", "Bernard",
    "Bruno", "Christian", "Claude", "Daniel", "Didier", "Dominique", "Éric", "Franck",
    "Gérard", "Jacques", "Jean", "Jean-Pierre", "Luc", "Michel", "Pascal", "René",
    "Robert", "Serge", "Thierry", "Yves", "Camille", "Emma", "Léa", "Chloé",
    "Manon", "Sarah", "Julie", "Marie", "Laura", "Lucie", "Charlotte", "Océane",
    "Anaïs", "Clara", "Inès", "Jade", "Lola", "Zoé", "Alice", "Ambre",
    "Amélie", "Anna", "Audrey", "Céline", "Élise", "Émilie", "Eva", "Fanny",
    "Gabrielle", "Hélène", "Iris", "Jeanne", "Justine", "Léna", "Lisa", "Louise",
    "Margaux", "Marine", "Mathilde", "Mélanie", "Morgane", "Nathalie", "Nina", "Noémie",
    "Pauline", "Rose", "Salomé", "Sophie", "Stéphanie", "Valentine", "Valérie", "Victoire",
    "Yasmine", "Adèle", "Agnès", "Alexandra", "Alix", "Angélique", "Anne", "Béatrice",
    "Brigitte", "Caroline", "Catherine", "Christelle", "Christine", "Claire", "Corinne", "Delphine",
    "Diane", "Dominique", "Éliane", "Élisabeth", "Estelle", "Florence", "Françoise", "Geneviève",
    "Isabelle", "Jacqueline", "Jennifer", "Jessica", "Joséphine", "Karine", "Laetitia", "Laurence",
    "Laurie", "Liliane", "Lydie", "Madeleine", "Magali", "Martine", "Michèle", "Monique",
    "Muriel", "Nadine", "Nicole", "Odile", "Patricia", "Rachel", "Sandrine", "Sylvie",
    "Véronique", "Virginie", "Viviane", "Yvette", "Yvonne", "Zohra"
];

export const frenchRegions = [
    "Paris", "Marseille", "Lyon", "Toulouse", "Nice", "Nantes", "Strasbourg", "Montpellier",
    "Bordeaux", "Lille", "Rennes", "Reims", "Le Havre", "Saint-Étienne", "Toulon", "Grenoble",
    "Dijon", "Angers", "Nîmes", "Villeurbanne", "Le Mans", "Aix-en-Provence", "Clermont-Ferrand", "Brest",
    "Tours", "Amiens", "Limoges", "Annecy", "Perpignan", "Boulogne-Billancourt", "Metz", "Besançon",
    "Orléans", "Saint-Denis", "Argenteuil", "Rouen", "Mulhouse", "Montreuil", "Caen", "Nancy",
    "Île-de-France", "Auvergne-Rhône-Alpes", "Nouvelle-Aquitaine", "Occitanie", "Hauts-de-France",
    "Provence-Alpes-Côte d'Azur", "Grand Est", "Pays de la Loire", "Bretagne", "Normandie",
    "Bourgogne-Franche-Comté", "Centre-Val de Loire", "Corse", "Versailles", "Nanterre",
    "Créteil", "Vitry-sur-Seine", "Avignon", "Poitiers", "Aubervilliers", "Aulnay-sous-Bois",
    "Asnières-sur-Seine", "Colombes", "La Rochelle", "Calais", "Rueil-Malmaison", "Antibes",
    "Saint-Maur-des-Fossés", "Champigny-sur-Marne", "Dunkerque", "Bourges", "Cannes", "Pau",
    "Colmar", "Quimper", "Valence", "Troyes", "Ajaccio", "Chambéry", "Lorient",
    "Niort", "Sarcelles", "Beauvais", "Vannes", "Ivry-sur-Seine", "Cergy", "Levallois-Perret",
    "Pessac", "Clichy", "Arles", "Vénissieux", "Antony", "La Seyne-sur-Mer", "Neuilly-sur-Seine",
    "Troyes", "Montauban", "Pantin", "Noisy-le-Grand", "Évry", "Villeneuve-d'Ascq", "Meaux",
    "Cholet", "Belfort", "Bayonne", "Chartres", "Drancy", "Sartrouville", "Saint-Quentin"
];

export function getRandomNotification() {
    const name = frenchFirstNames[Math.floor(Math.random() * frenchFirstNames.length)];
    const region = frenchRegions[Math.floor(Math.random() * frenchRegions.length)];
    return { name, region };
}
