# Résumé de l'Intégration Google Ads & Optimisation SEO

Ce document récapitule toutes les mises à jour effectuées pour rendre l'application performante pour la publicité Ads et le référencement naturel.

## 1. Google Ads & Tracking (Haute Performance)
- **Installation de `@next/third-parties`** : Utilisation de la bibliothèque officielle de Next.js pour charger la balise Google sans impacter le score Lighthouse.
- **Suivi Global** : Intégration de `GoogleTagManager` dans le layout racine pour un suivi sur 100% des pages.
- **Enhanced Conversions (Conversions Boostées)** : Envoi sécurisé (hashage) des données utilisateurs (email, téléphone) pour une précision publicitaire maximale.
- **Bibliothèque `src/lib/gtag.ts`** : Création d'un utilitaire centralisé pour gérer tous les événements de conversion.

## 2. Tunnel de Conversion & Funnel
- **Simulateur de Prêt** :
    - Événement `loan_simulation_start` : Mesure l'engagement initial.
    - Événement `loan_simulation_complete` : Mesure l'intention forte.
- **Formulaire de Demande de Crédit** :
    - Suivi étape par étape (`credit_request_step`) : Permet d'identifier où les clients abandonnent.
    - Événement final `credit_request_submitted` : Déclenché uniquement lors du succès réel, incluant le montant et le type de projet.

## 3. SEO & Visibilité Sociale
- **Image Open Graph (OG)** : Génération d'une image de marque premium (1200x630) stockée dans `/public/og-image.webp`.
- **Twitter Cards** : Configuration pour des aperçus grand format sur X.
- **Données Structurées JSON-LD** :
    - `Organization` : Pour l'identité de marque globale.
    - `FinancialService` : Pour que Google reconnaisse spécifiquement vos services de crédit.
- **Métadonnées Dynamiques** : Optimisation des titres et descriptions selon la langue.

## 4. Prochaines étapes suggérées
- **Google Search Console** : Soumettre le sitemap généré à `https://www.agm-negoce.com/sitemap.xml`.
- **Vérification Ads** : Vérifier dans l'interface Google Ads que les événements remontent bien après 24h.

---
*Optimisé par Antigravity - 2026*
