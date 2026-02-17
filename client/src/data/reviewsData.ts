// Reviews database - 100+ realistic French reviews
export interface Review {
    id: number;
    name: string;
    region: string;
    rating: number;
    comment: string;
    date: string;
    verified: boolean;
}

export const reviews: Review[] = [
    { id: 1, name: "Thomas Dubois", region: "Paris", rating: 5, comment: "Service impeccable ! J'ai obtenu mon financement en moins de 2 semaines. L'équipe est très professionnelle.", date: "2026-02-15", verified: true },
    { id: 2, name: "Marie Laurent", region: "Lyon", rating: 5, comment: "Excellente expérience. Le conseiller m'a accompagné à chaque étape. Je recommande vivement AGM INVEST.", date: "2026-02-14", verified: true },
    { id: 3, name: "Pierre Martin", region: "Marseille", rating: 4, comment: "Très satisfait du service. Processus rapide et transparent. Quelques documents à fournir mais c'est normal.", date: "2026-02-13", verified: true },
    { id: 4, name: "Sophie Bernard", region: "Toulouse", rating: 5, comment: "Je suis ravie ! Mon dossier a été traité rapidement et j'ai pu acheter ma voiture sans stress.", date: "2026-02-11", verified: true },
    { id: 5, name: "Julien Petit", region: "Nice", rating: 5, comment: "Service au top ! L'équipe est réactive et à l'écoute. Mon crédit a été validé en 10 jours.", date: "2026-02-11", verified: true },
    { id: 6, name: "Camille Durand", region: "Nantes", rating: 4, comment: "Bonne expérience globale. Le suivi est excellent et les conseillers sont compétents.", date: "2026-02-10", verified: true },
    { id: 7, name: "Alexandre Roux", region: "Strasbourg", rating: 5, comment: "Parfait ! Processus simple et efficace. J'ai eu mon financement automobile sans problème.", date: "2026-02-09", verified: true },
    { id: 8, name: "Léa Moreau", region: "Montpellier", rating: 5, comment: "Je recommande à 100% ! Service professionnel, rapide et transparent. Merci à toute l'équipe.", date: "2026-02-08", verified: true },
    { id: 9, name: "Nicolas Simon", region: "Bordeaux", rating: 4, comment: "Très bon service. Les délais ont été respectés et le conseiller était disponible pour répondre à mes questions.", date: "2026-02-07", verified: true },
    { id: 10, name: "Emma Leroy", region: "Lille", rating: 5, comment: "Expérience exceptionnelle ! Dossier traité rapidement, équipe professionnelle. Je suis très satisfaite.", date: "2026-02-06", verified: true },
    { id: 11, name: "Lucas Blanc", region: "Rennes", rating: 5, comment: "Service irréprochable. Mon conseiller m'a guidé tout au long du processus. Financement obtenu en 12 jours.", date: "2026-02-05", verified: true },
    { id: 12, name: "Chloé Garnier", region: "Reims", rating: 4, comment: "Bonne prestation. Le processus est bien expliqué et l'équipe est disponible.", date: "2026-02-04", verified: true },
    { id: 13, name: "Hugo Chevalier", region: "Le Havre", rating: 5, comment: "Excellent ! J'ai pu financer mon véhicule rapidement. Service client au top.", date: "2026-02-03", verified: true },
    { id: 14, name: "Manon Girard", region: "Saint-Étienne", rating: 5, comment: "Très professionnels et efficaces. Mon dossier a été accepté rapidement. Je recommande.", date: "2026-02-02", verified: true },
    { id: 15, name: "Antoine Bonnet", region: "Toulon", rating: 4, comment: "Service de qualité. Bonne communication et suivi régulier du dossier.", date: "2026-02-01", verified: true },
    { id: 16, name: "Sarah Dupont", region: "Grenoble", rating: 5, comment: "Parfait du début à la fin ! Équipe réactive et professionnelle. Mon crédit validé en 8 jours.", date: "2026-01-31", verified: true },
    { id: 17, name: "Maxime Rousseau", region: "Dijon", rating: 5, comment: "Je suis très satisfait. Processus simple, rapide et transparent. Merci AGM INVEST !", date: "2026-01-30", verified: true },
    { id: 18, name: "Laura Vincent", region: "Angers", rating: 4, comment: "Bonne expérience. Les conseillers sont compétents et le suivi est régulier.", date: "2026-01-29", verified: true },
    { id: 19, name: "Théo Lambert", region: "Nîmes", rating: 5, comment: "Service excellent ! Mon dossier a été traité rapidement et efficacement.", date: "2026-02-17", verified: true },
    { id: 20, name: "Inès Fontaine", region: "Villeurbanne", rating: 5, comment: "Très bonne expérience. L'équipe est professionnelle et à l'écoute.", date: "2026-01-27", verified: true },
    { id: 21, name: "Raphaël Morel", region: "Le Mans", rating: 4, comment: "Satisfait du service. Bon accompagnement tout au long du processus.", date: "2026-01-26", verified: true },
    { id: 22, name: "Jade Fournier", region: "Aix-en-Provence", rating: 5, comment: "Impeccable ! Financement obtenu rapidement. Je recommande vivement.", date: "2026-01-25", verified: true },
    { id: 23, name: "Nathan Mercier", region: "Clermont-Ferrand", rating: 5, comment: "Excellent service. Équipe réactive et professionnelle. Dossier validé en 10 jours.", date: "2026-01-24", verified: true },
    { id: 24, name: "Lola Bertrand", region: "Brest", rating: 4, comment: "Bonne prestation globale. Le conseiller était disponible et compétent.", date: "2026-01-23", verified: true },
    { id: 25, name: "Gabriel Lefebvre", region: "Tours", rating: 5, comment: "Service au top ! Processus rapide et transparent. Très satisfait.", date: "2026-02-11", verified: true },
    { id: 26, name: "Zoé Renard", region: "Amiens", rating: 5, comment: "Parfait ! Mon crédit automobile a été validé rapidement. Équipe professionnelle.", date: "2026-01-21", verified: true },
    { id: 27, name: "Louis Dumas", region: "Limoges", rating: 4, comment: "Très bon service. Communication claire et suivi régulier.", date: "2026-01-20", verified: true },
    { id: 28, name: "Alice Perrin", region: "Annecy", rating: 5, comment: "Excellente expérience ! Conseiller à l'écoute et processus efficace.", date: "2026-01-19", verified: true },
    { id: 29, name: "Arthur Roussel", region: "Perpignan", rating: 5, comment: "Je recommande ! Service rapide et professionnel. Mon dossier traité en 2 semaines.", date: "2026-01-18", verified: true },
    { id: 30, name: "Rose Giraud", region: "Boulogne-Billancourt", rating: 4, comment: "Bonne expérience. L'équipe est compétente et réactive.", date: "2026-01-17", verified: true },
    { id: 31, name: "Enzo Faure", region: "Metz", rating: 5, comment: "Service impeccable ! Financement obtenu rapidement. Très satisfait.", date: "2026-01-16", verified: true },
    { id: 32, name: "Léna André", region: "Besançon", rating: 5, comment: "Excellente prestation. Processus simple et équipe professionnelle.", date: "2026-01-15", verified: true },
    { id: 33, name: "Paul Marchand", region: "Orléans", rating: 4, comment: "Très bon service. Mon conseiller m'a bien accompagné.", date: "2026-01-14", verified: true },
    { id: 34, name: "Amélie Blanchard", region: "Saint-Denis", rating: 5, comment: "Parfait ! Dossier traité rapidement et efficacement. Je recommande.", date: "2026-02-12", verified: true },
    { id: 35, name: "Dylan Muller", region: "Argenteuil", rating: 5, comment: "Service au top ! Équipe réactive et professionnelle.", date: "2026-01-12", verified: true },
    { id: 36, name: "Clara Barbier", region: "Rouen", rating: 4, comment: "Bonne expérience globale. Processus transparent et bien expliqué.", date: "2026-01-11", verified: true },
    { id: 37, name: "Mathis Brun", region: "Mulhouse", rating: 5, comment: "Excellent ! Mon crédit validé en 9 jours. Service professionnel.", date: "2026-01-10", verified: true },
    { id: 38, name: "Océane Meyer", region: "Montreuil", rating: 5, comment: "Très satisfaite ! L'équipe est à l'écoute et efficace.", date: "2026-01-09", verified: true },
    { id: 39, name: "Clément Denis", region: "Caen", rating: 4, comment: "Bon service. Conseiller compétent et disponible.", date: "2026-02-13", verified: true },
    { id: 40, name: "Anaïs Legrand", region: "Nancy", rating: 5, comment: "Impeccable ! Processus rapide et transparent. Je recommande vivement.", date: "2026-01-07", verified: true },
    { id: 41, name: "Baptiste Gauthier", region: "Versailles", rating: 5, comment: "Service excellent ! Mon dossier a été traité avec professionnalisme.", date: "2026-01-06", verified: true },
    { id: 42, name: "Margaux Perrot", region: "Nanterre", rating: 4, comment: "Très bonne prestation. Équipe réactive et à l'écoute.", date: "2026-01-05", verified: true },
    { id: 43, name: "Valentin Roy", region: "Créteil", rating: 5, comment: "Parfait ! Financement obtenu rapidement. Service professionnel.", date: "2026-01-04", verified: true },
    { id: 44, name: "Lucie Clement", region: "Vitry-sur-Seine", rating: 5, comment: "Excellente expérience ! Conseiller compétent et processus efficace.", date: "2026-01-03", verified: true },
    { id: 45, name: "Romain Leclerc", region: "Avignon", rating: 4, comment: "Bon service. Communication claire et suivi régulier du dossier.", date: "2026-02-15", verified: true },
    { id: 46, name: "Charlotte Vidal", region: "Poitiers", rating: 5, comment: "Je recommande ! Service rapide et transparent. Très satisfaite.", date: "2026-01-01", verified: true },
    { id: 47, name: "Adrien Benoit", region: "Aubervilliers", rating: 5, comment: "Service au top ! Mon crédit validé en 11 jours.", date: "2026-02-12", verified: true },
    { id: 48, name: "Justine Olivier", region: "Aulnay-sous-Bois", rating: 4, comment: "Bonne expérience. L'équipe est professionnelle et réactive.", date: "2025-12-30", verified: true },
    { id: 49, name: "Florian Picard", region: "Asnières-sur-Seine", rating: 5, comment: "Excellent ! Processus simple et rapide. Je recommande.", date: "2025-12-29", verified: true },
    { id: 50, name: "Marine Jacquet", region: "Colombes", rating: 5, comment: "Très satisfaite ! Équipe à l'écoute et efficace.", date: "2025-12-28", verified: true },
    { id: 51, name: "Kévin Renaud", region: "La Rochelle", rating: 4, comment: "Bon service. Mon conseiller était disponible et compétent.", date: "2025-12-27", verified: true },
    { id: 52, name: "Émilie Caron", region: "Calais", rating: 5, comment: "Impeccable ! Dossier traité rapidement. Service professionnel.", date: "2026-02-11", verified: true },
    { id: 53, name: "Quentin Guillot", region: "Rueil-Malmaison", rating: 5, comment: "Parfait ! Financement obtenu en moins de 2 semaines.", date: "2025-12-25", verified: true },
    { id: 54, name: "Pauline Bourgeois", region: "Antibes", rating: 4, comment: "Très bonne prestation. Processus transparent et bien expliqué.", date: "2025-12-24", verified: true },
    { id: 55, name: "Benjamin Gaillard", region: "Saint-Maur-des-Fossés", rating: 5, comment: "Excellent service ! Équipe réactive et professionnelle.", date: "2025-12-23", verified: true },
    { id: 56, name: "Mathilde Meunier", region: "Champigny-sur-Marne", rating: 5, comment: "Je recommande vivement ! Service rapide et efficace.", date: "2025-12-22", verified: true },
    { id: 57, name: "Alexis Lemoine", region: "Dunkerque", rating: 4, comment: "Bonne expérience globale. Conseiller compétent.", date: "2025-12-21", verified: true },
    { id: 58, name: "Julie Hubert", region: "Bourges", rating: 5, comment: "Service au top ! Mon dossier validé rapidement.", date: "2025-12-20", verified: true },
    { id: 59, name: "Sébastien Renault", region: "Cannes", rating: 5, comment: "Parfait ! Processus simple et transparent. Très satisfait.", date: "2025-12-19", verified: true },
    { id: 60, name: "Audrey Girard", region: "Pau", rating: 4, comment: "Très bon service. L'équipe est à l'écoute et réactive.", date: "2025-12-18", verified: true },
    { id: 61, name: "Jérôme Dupuis", region: "Colmar", rating: 5, comment: "Excellent ! Mon crédit automobile validé en 10 jours.", date: "2025-12-17", verified: true },
    { id: 62, name: "Céline Lemaire", region: "Quimper", rating: 5, comment: "Service impeccable ! Équipe professionnelle et efficace.", date: "2025-12-16", verified: true },
    { id: 63, name: "Grégory Masson", region: "Valence", rating: 4, comment: "Bonne prestation. Communication claire et suivi régulier.", date: "2025-12-15", verified: true },
    { id: 64, name: "Stéphanie Morin", region: "Troyes", rating: 5, comment: "Je recommande ! Service rapide et professionnel.", date: "2025-12-14", verified: true },
    { id: 65, name: "Olivier Sanchez", region: "Ajaccio", rating: 5, comment: "Parfait ! Financement obtenu rapidement. Très satisfait.", date: "2025-12-13", verified: true },
    { id: 66, name: "Nathalie Garnier", region: "Chambéry", rating: 4, comment: "Très bonne expérience. L'équipe est compétente.", date: "2025-12-12", verified: true },
    { id: 67, name: "Damien Rousseau", region: "Lorient", rating: 5, comment: "Service excellent ! Processus efficace et transparent.", date: "2025-12-11", verified: true },
    { id: 68, name: "Laetitia Giraud", region: "Niort", rating: 5, comment: "Impeccable ! Mon dossier traité avec professionnalisme.", date: "2025-12-10", verified: true },
    { id: 69, name: "Fabien Martinez", region: "Sarcelles", rating: 4, comment: "Bon service. Conseiller disponible et à l'écoute.", date: "2025-12-09", verified: true },
    { id: 70, name: "Sandrine Lopez", region: "Beauvais", rating: 5, comment: "Excellent ! Je recommande vivement AGM INVEST.", date: "2026-02-12", verified: true },
    { id: 71, name: "Christophe Garcia", region: "Vannes", rating: 5, comment: "Service au top ! Mon crédit validé en 9 jours.", date: "2025-12-07", verified: true },
    { id: 72, name: "Valérie Rodriguez", region: "Ivry-sur-Seine", rating: 4, comment: "Très bonne prestation. Équipe réactive et professionnelle.", date: "2025-12-06", verified: true },
    { id: 73, name: "Laurent Fernandez", region: "Cergy", rating: 5, comment: "Parfait ! Processus rapide et transparent.", date: "2025-12-05", verified: true },
    { id: 74, name: "Isabelle Gonzalez", region: "Levallois-Perret", rating: 5, comment: "Excellente expérience ! Service professionnel.", date: "2025-12-04", verified: true },
    { id: 75, name: "Michaël Perez", region: "Pessac", rating: 4, comment: "Bon service. Mon conseiller était compétent.", date: "2025-12-03", verified: true },
    { id: 76, name: "Corinne Sanchez", region: "Clichy", rating: 5, comment: "Je recommande ! Dossier traité rapidement.", date: "2025-12-02", verified: true },
    { id: 77, name: "Franck Moreau", region: "Arles", rating: 5, comment: "Service impeccable ! Équipe à l'écoute et efficace.", date: "2025-12-01", verified: true },
    { id: 78, name: "Sylvie Blanc", region: "Vénissieux", rating: 4, comment: "Très bonne expérience. Processus bien expliqué.", date: "2025-11-30", verified: true },
    { id: 79, name: "Thierry Roux", region: "Antony", rating: 5, comment: "Excellent ! Mon financement obtenu en 12 jours.", date: "2026-02-14", verified: true },
    { id: 80, name: "Monique Durand", region: "La Seyne-sur-Mer", rating: 5, comment: "Parfait ! Service rapide et professionnel.", date: "2025-11-28", verified: true },
    { id: 81, name: "Patrick Simon", region: "Neuilly-sur-Seine", rating: 4, comment: "Bon service. L'équipe est réactive.", date: "2025-11-27", verified: true },
    { id: 82, name: "Brigitte Leroy", region: "Montauban", rating: 5, comment: "Je recommande vivement ! Service excellent.", date: "2025-11-26", verified: true },
    { id: 83, name: "Yves Chevalier", region: "Pantin", rating: 5, comment: "Service au top ! Dossier validé rapidement.", date: "2025-11-25", verified: true },
    { id: 84, name: "Martine Bonnet", region: "Noisy-le-Grand", rating: 4, comment: "Très bonne prestation. Conseiller compétent.", date: "2025-11-24", verified: true },
    { id: 85, name: "Alain Roussel", region: "Évry", rating: 5, comment: "Excellent service ! Processus efficace.", date: "2025-11-23", verified: true },
    { id: 86, name: "Nicole Giraud", region: "Villeneuve-d'Ascq", rating: 5, comment: "Impeccable ! Mon crédit automobile validé.", date: "2025-11-22", verified: true },
    { id: 87, name: "Daniel Faure", region: "Meaux", rating: 4, comment: "Bon service. Communication claire.", date: "2026-02-13", verified: true },
    { id: 88, name: "Jacqueline André", region: "Cholet", rating: 5, comment: "Parfait ! Équipe professionnelle et réactive.", date: "2025-11-20", verified: true },
    { id: 89, name: "Michel Marchand", region: "Belfort", rating: 5, comment: "Service excellent ! Je recommande.", date: "2025-11-19", verified: true },
    { id: 90, name: "Christine Blanchard", region: "Bayonne", rating: 4, comment: "Très bonne expérience. Processus transparent.", date: "2025-11-18", verified: true },
    { id: 91, name: "Jean Muller", region: "Chartres", rating: 5, comment: "Impeccable ! Financement obtenu rapidement.", date: "2025-11-17", verified: true },
    { id: 92, name: "Françoise Barbier", region: "Drancy", rating: 5, comment: "Excellent ! Service professionnel et efficace.", date: "2025-11-16", verified: true },
    { id: 93, name: "Bernard Brun", region: "Sartrouville", rating: 4, comment: "Bon service. Mon conseiller était disponible.", date: "2025-11-15", verified: true },
    { id: 94, name: "Annie Meyer", region: "Saint-Quentin", rating: 5, comment: "Je recommande ! Dossier traité avec soin.", date: "2025-11-14", verified: true },
    { id: 95, name: "René Denis", region: "Île-de-France", rating: 5, comment: "Service au top ! Très satisfait du résultat.", date: "2026-02-16", verified: true },
    { id: 96, name: "Denise Legrand", region: "Auvergne-Rhône-Alpes", rating: 4, comment: "Très bonne prestation. Équipe compétente.", date: "2025-11-12", verified: true },
    { id: 97, name: "Jacques Gauthier", region: "Nouvelle-Aquitaine", rating: 5, comment: "Parfait ! Processus simple et rapide.", date: "2025-11-11", verified: true },
    { id: 98, name: "Marie-Claire Perrot", region: "Occitanie", rating: 5, comment: "Excellent service ! Mon crédit validé en 10 jours.", date: "2025-11-10", verified: true },
    { id: 99, name: "André Roy", region: "Hauts-de-France", rating: 4, comment: "Bon service. Communication efficace.", date: "2026-02-13", verified: true },
    { id: 100, name: "Yvette Clement", region: "Provence-Alpes-Côte d'Azur", rating: 5, comment: "Je recommande vivement ! Service professionnel.", date: "2025-11-08", verified: true },
    { id: 101, name: "Robert Leclerc", region: "Grand Est", rating: 5, comment: "Impeccable ! Équipe réactive et à l'écoute.", date: "2025-11-07", verified: true },
    { id: 102, name: "Geneviève Vidal", region: "Pays de la Loire", rating: 4, comment: "Très bonne expérience. Processus transparent.", date: "2025-11-06", verified: true },
    { id: 103, name: "Claude Benoit", region: "Bretagne", rating: 5, comment: "Service excellent ! Mon dossier validé rapidement.", date: "2025-11-05", verified: true },
    { id: 104, name: "Odile Olivier", region: "Normandie", rating: 5, comment: "Parfait ! Je recommande AGM INVEST.", date: "2025-11-04", verified: true },
    { id: 105, name: "Gérard Picard", region: "Bourgogne-Franche-Comté", rating: 4, comment: "Bon service. Conseiller compétent et disponible.", date: "2025-11-03", verified: true },
    { id: 106, name: "Éliane Jacquet", region: "Centre-Val de Loire", rating: 5, comment: "Excellent ! Financement obtenu en 11 jours.", date: "2025-11-02", verified: true },
    { id: 107, name: "Serge Renaud", region: "Corse", rating: 5, comment: "Service impeccable ! Équipe professionnelle.", date: "2025-11-01", verified: true },
    { id: 108, name: "Lydie Caron", region: "Paris", rating: 4, comment: "Très bonne prestation. Processus efficace.", date: "2025-10-31", verified: true },
    { id: 109, name: "Francis Guillot", region: "Lyon", rating: 5, comment: "Je recommande ! Service rapide et transparent.", date: "2026-02-13", verified: true },
    { id: 110, name: "Viviane Bourgeois", region: "Marseille", rating: 5, comment: "Parfait ! Mon crédit automobile validé rapidement.", date: "2026-02-11", verified: true }
];

// Get statistics
export function getReviewStats() {
    const totalReviews = reviews.length;
    const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews;
    const ratingDistribution = {
        5: reviews.filter(r => r.rating === 5).length,
        4: reviews.filter(r => r.rating === 4).length,
        3: reviews.filter(r => r.rating === 3).length,
        2: reviews.filter(r => r.rating === 2).length,
        1: reviews.filter(r => r.rating === 1).length,
    };

    return {
        totalReviews,
        averageRating: Math.round(averageRating * 10) / 10,
        ratingDistribution
    };
}

// Get recent reviews
export function getRecentReviews(count: number = 10) {
    return [...reviews]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, count);
}

// Filter reviews by rating
export function filterByRating(rating: number) {
    return reviews.filter(r => r.rating === rating);
}
