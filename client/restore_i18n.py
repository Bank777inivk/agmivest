import json
import os

ROOT_DIR = r"c:\Users\tesla\Videos\Nouvelle aventure\pret\client"
MESSAGES_DIR = os.path.join(ROOT_DIR, "messages")

# --- AUTHENTIC DATA (Full Audit) ---
PUBLIC_FR = {
    "Home": {
        "Services": {
            "title": "Nos Solutions de Financement",
            "subtitle": "Une expertise complète pour tous vos besoins de financement.",
            "cta": "Voir tous nos services"
        },
        "Simulator": {
            "title": "Simulateur de prêt",
            "subtitle": "Calculez vos mensualités en quelques clics."
        },
        "Contact": {
            "title": "Contact & Accès",
            "subtitle": "Une question ? Venez nous rencontrer ou envoyez-nous un message."
        }
    },
    "Navigation": {
        "home": "Accueil",
        "services": "Nos services",
        "documents": "Préparez vos documents",
        "about": "Qui sommes-nous ?",
        "contact": "Contact",
        "appointment": "Prendre rendez-vous",
        "creditRequest": "Demander un Prêt",
        "becomeClient": "Devenir Client",
        "brandSubtitle": "Crédit & Assurances",
        "reviews": "Avis"
    },
    "Hero": {
        "titleLine1": "Votre projet",
        "titleLine2": "immobilier",
        "titleLine3": "accompagné",
        "description1": "Votre emprunt immobilier ou assurance emprunteur aux meilleures conditions :",
        "descriptionHighlight": "c'est l'expertise AGM INVEST !",
        "description2": "Notre équipe vous guide à chaque étape pour obtenir le meilleur financement.",
        "tagline": "Tout simplement !",
        "cta": "Prendre rendez-vous"
    },
    "AdBanner": {
        "msg1": "Besoin d'un prêt ? Je suis là pour vous aider !",
        "msg2": "Obtenez votre simulation en 2 minutes !",
        "msg3": "Nos clients nous font confiance depuis 20 ans",
        "msg4": "Taux compétitifs garantis !",
        "msg5": "Accompagnement personnalisé à chaque étape"
    },
    "Services": {
        "title": "Nos Services",
        "subtitle": "Une expertise complète pour tous vos besoins de financement.",
        "Items": {
            "realEstate": {
                "title": "Prêt Immobilier",
                "description": "Devenez propriétaire avec nos taux compétitifs et nos durées flexibles."
            },
            "insurance": {
                "title": "Assurance Emprunteur",
                "description": "Économisez jusqu'à 50% sur votre assurance actuelle."
            },
            "creditConsolidation": {
                "title": "Rachat de Crédit",
                "description": "Regroupez vos crédits pour réduire vos mensualités et simplifier votre budget."
            },
            "professionalLoan": {
                "title": "Prêt Professionnel",
                "description": "Financement de vos projets, fonds de commerce ou équipements."
            },
            "renegotiation": {
                "title": "Renégociation de Taux",
                "description": "Profitez des baisses de taux actuelles pour réduire le coût de votre crédit."
            },
            "support": {
                "title": "Conseil Expert",
                "description": "Un accompagnement personnalisé de la simulation jusqu'au déblocage des fonds."
            }
        }
    },
    "About": {
        "title": "Qui sommes-nous ?",
        "subtitle": "Votre partenaire de confiance en crédit et assurances depuis plus de 20 ans.",
        "Stats": {
            "experience": { "value": "20+", "label": "Ans d'expérience" },
            "clients": { "value": "Clients", "label": "Satisfaits" },
            "acceptance": { "value": "98%", "label": "Taux d'acceptation" },
            "secure": { "value": "100%", "label": "Sécurisé" }
        },
        "Mission": {
            "title": "Notre Mission",
            "p1": "Nous négocions pour vous auprès de nos partenaires bancaires et vous garantissons un accompagnement <highlight>personnalisé</highlight>.",
            "p2": "De la simulation jusqu'à la signature chez le notaire, nous sommes à vos côtés."
        },
        "Values": {
            "title": "Nos valeurs",
            "v1": "Transparence totale sur les taux et les frais",
            "v2": "Accompagnement personnalisé et humain",
            "v3": "Réactivité et disponibilité de nos conseillers",
            "v4": "Expertise reconnue du marché immobilier"
        }
    },
    "Documents": {
        "title": "Préparez vos documents",
        "subtitle": "Pour accélérer votre prêt, préparez ces documents à l'avance.",
        "cta": "Tous les documents peuvent être envoyés en ligne de manière sécurisée",
        "Items": {
            "identity": {
                "title": "Pièce d'identité",
                "description": "Carte d'identité ou passeport en cours de validité"
            },
            "income": {
                "title": "Justificatifs de revenus",
                "description": "3 derniers bulletins de salaire et avis d'imposition"
            },
            "bank": {
                "title": "Relevés bancaires",
                "description": "3 derniers mois de vos comptes courants"
            },
            "home": {
                "title": "Justificatif de domicile",
                "description": "Facture de moins de 3 mois (électricité, eau, téléphone)"
            },
            "sales": {
                "title": "Compromis de vente",
                "description": "Si vous avez déjà trouvé votre bien immobilier"
            },
            "amortization": {
                "title": "Tableau d'amortissement",
                "description": "Pour les rachats de crédits ou renégociations de taux"
            }
        }
    },
    "Reviews": {
        "title": "Ce que <highlight>disent</highlight> nos clients",
        "subtitle": "Découvrez les témoignages de ceux qui nous ont fait confiance.",
        "Stats": {
            "averageRating": "Note Moyenne",
            "totalReviews": "Avis vérifiés",
            "fiveStars": "Avis 5 Étoiles"
        },
        "allReviews": "Tous les avis",
        "stars": "étoiles",
        "verified": "Avis vérifié",
        "seeAll": "Voir tous les avis"
    },
    "Contact": {
        "title": "Contact & Accès",
        "subtitle": "Une question ? Venez nous rencontrer ou envoyez-nous un message.",
        "minimalTitle": "Envoyez-nous un message",
        "form": {
            "name": "Nom complet *",
            "namePlaceholder": "Votre nom",
            "email": "Adresse email *",
            "emailPlaceholder": "votre@email.com",
            "phone": "Téléphone",
            "phonePlaceholder": "06 12 34 56 78",
            "subject": "Sujet",
            "message": "Message",
            "messagePlaceholder": "Comment pouvons-nous vous aider ?",
            "submit": "Envoyer le message",
            "success": "Votre message a été envoyé avec succès !"
        }
    },
    "Location": {
        "title": "Où nous trouver",
        "subtitle": "Nos bureaux sont situés au cœur de Paris pour vous accueillir.",
        "address": "Siège Social",
        "phone": "Téléphone",
        "email": "Email",
        "details": {
            "address": "40 Rue Jean Monnet,\n68200 Mulhouse",
            "phone": "+33 7 56 84 41 45",
            "email": "contact@agm-negoce.com"
        },
        "hours": {
            "title": "Horaires d'ouverture",
            "week": "Lundi - Vendredi: 09h00 - 19h00",
            "saturday": "Samedi: 10h00 - 16h00",
            "sunday": "Dimanche: Fermé"
        }
    },
    "Simulator": {
        "amountLabel": "Montant souhaité (€)",
        "durationLabel": "Durée (ans)",
        "durationSuffix": "ans",
        "months": "mois",
        "rateLabel": "Taux d'intérêt (%)",
        "guaranteedRate": "Taux fixe et garanti.",
        "monthlyEstimate": "Votre mensualité",
        "perMonth": "/ mois",
        "excludedInsurance": "Hors assurance",
        "borrowerInsurance": "Assurance emprunteur",
        "totalInsuranceCost": "Coût total assurance",
        "disclaimer": "Un crédit vous engage et doit être remboursé. Vérifiez vos capacités de remboursement.",
        "startRequest": "Obtenir mon étude"
    },
    "Footer": {
        "description": "Votre partenaire de confiance pour tous vos projets de financement immobilier et d'assurances depuis 20 ans.",
        "linksTitle": "Liens rapides",
        "Links": {
            "services": "Nos services",
            "simulator": "Simulateur",
            "documents": "Documents",
            "about": "Qui sommes-nous ?",
            "contact": "Contact",
            "clientArea": "Espace Client"
        },
        "contactTitle": "Contact",
        "details": {
            "phone": "+33 7 56 84 41 45",
            "email": "contact@agm-negoce.com",
            "address": "40 Rue Jean Monnet,\n68200 Mulhouse"
        },
        "copyright": "AGM INVEST Crédit & Assurances. Tous droits réservés.",
        "legal": {
            "mentions": "Mentions Légales",
            "privacy": "Confidentialité",
            "cookies": "Cookies",
            "cgu": "CGU",
            "refund": "Remboursement",
            "disclaimer": "Avertissement",
            "trust": "Sécurité",
            "ads": "Publicité"
        }
    },
    "Dashboard": {
        "Layout": {
            "Sidebar": {
                "clientSpace": "Espace Client",
                "balance": "Mon Solde",
                "makeRequest": "Demander un Prêt",
                "myRequests": "Mes Demandes",
                "myDocuments": "Mes Documents",
                "billing": "Facturation",
                "myProfile": "Mon Profil",
                "settings": "Paramètres",
                "support": "Aide & Support",
                "logout": "Déconnexion"
            }
        },
        "Home": {
            "welcome": "Bonjour, {name} !",
            "subtitle": "Bienvenue sur votre tableau de bord.",
            "status": {
                "verified": "Compte Vérifié",
                "premium": "Client Premium"
            },
            "stats": {
                "total": "Total Demandes",
                "approved": "Approuvées",
                "pending": "En attente",
                "projects": "Projets"
            }
        },
        "Accounts": {
            "title": "Mon Solde",
            "subtitle": "Gérez vos comptes et informations bancaires."
        }
    },
     "Legal": {
        "Privacy": { "title": "Politique de Confidentialité" },
        "Terms": { "title": "Mentions Légales" },
        "Cookies": { "title": "Gestion des Cookies" },
        "CGU": { "title": "Conditions Générales de Vente" }
    }
}

# --- EN DATA ---
PUBLIC_EN = {
    "Home": {
        "Services": {
            "title": "Our Financing Solutions",
            "subtitle": "Full expertise for all your financing needs.",
            "cta": "See all our services"
        },
        "Simulator": {
            "title": "Loan Simulator",
            "subtitle": "Calculate your monthly payments in a few clicks."
        },
        "Contact": {
            "title": "Contact & Access",
            "subtitle": "A question? Come meet us or send us a message."
        }
    },
    "Navigation": {
        "home": "Home",
        "services": "Our services",
        "documents": "Document Preparation",
        "about": "Who are we?",
        "contact": "Contact",
        "appointment": "Book an appointment",
        "creditRequest": "Request a Loan",
        "becomeClient": "Become a Client",
        "brandSubtitle": "Credit & Insurance",
        "reviews": "Reviews"
    },
    "Hero": {
        "titleLine1": "Your real estate",
        "titleLine2": "project",
        "titleLine3": "accompanied",
        "description1": "Your mortgage or borrower insurance at the best conditions:",
        "descriptionHighlight": "that's AGM INVEST expertise!",
        "description2": "Our team guides you through every step to obtain the best financing.",
        "tagline": "Quite simply!",
        "cta": "Book an appointment"
    },
    "AdBanner": {
        "msg1": "Need a loan? I'm here to help!",
        "msg2": "Get your simulation in 2 minutes!",
        "msg3": "Our clients have trusted us for 20 years",
        "msg4": "Guaranteed competitive rates!",
        "msg5": "Personalized support at every step"
    },
    "Services": {
        "title": "Our Services",
        "subtitle": "Full expertise for all your financing needs.",
        "Items": {
            "realEstate": {
                "title": "Mortgage",
                "description": "Become a homeowner with our competitive rates and flexible terms."
            },
            "insurance": {
                "title": "Borrower Insurance",
                "description": "Save up to 50% on your current insurance."
            },
            "creditConsolidation": {
                "title": "Credit Consolidation",
                "description": "Group your credits to reduce your monthly payments and simplify your budget."
            },
            "professionalLoan": {
                "title": "Business Loan",
                "description": "Financing for your projects, business assets or equipment."
            },
            "renegotiation": {
                "title": "Rate Renegotiation",
                "description": "Take advantage of current rate cuts to reduce the cost of your current credit."
            },
            "support": {
                "title": "Expert Advice",
                "description": "Personalized support from simulation to fund release."
            }
        }
    },
    "About": {
        "title": "Who are we?",
        "subtitle": "Your trusted partner in credit and insurance for over 20 years.",
        "Stats": {
            "experience": { "value": "20+", "label": "Years of experience" },
            "clients": { "value": "Clients", "label": "Satisfied" },
            "acceptance": { "value": "98%", "label": "Acceptance rate" },
            "secure": { "value": "100%", "label": "Secure" }
        },
        "Mission": {
            "title": "Our Mission",
            "p1": "We negotiate for you with our banking partners and guarantee <highlight>personalized</highlight> support.",
            "p2": "From simulation to signing at the notary, we are by your side."
        },
        "Values": {
            "title": "Our values",
            "v1": "Full transparency on rates and fees",
            "v2": "Personalized and human support",
            "v3": "Responsiveness and availability of our consultants",
            "v4": "Recognized real estate market expertise"
        }
    },
    "Documents": {
        "title": "Document Preparation",
        "subtitle": "To speed up your loan, prepare these documents in advance.",
        "cta": "All documents can be sent online securely",
        "Items": {
            "identity": {
                "title": "ID Document",
                "description": "Valid ID card or passport"
            },
            "income": {
                "title": "Proof of Income",
                "description": "Last 3 payslips and tax notice"
            },
            "bank": {
                "title": "Bank Statements",
                "description": "Last 3 months of your current accounts"
            },
            "home": {
                "title": "Proof of Residence",
                "description": "Utility bill less than 3 months old (electricity, water, phone)"
            },
            "sales": {
                "title": "Sales Agreement",
                "description": "If you have already found your real estate property"
            },
            "amortization": {
                "title": "Amortization Table",
                "description": "For credit consolidation or rate renegotiation"
            }
        }
    },
    "Reviews": {
        "title": "What our clients <highlight>say</highlight>",
        "subtitle": "Discover the testimonials of those who trusted us.",
        "Stats": {
            "averageRating": "Average Rating",
            "totalReviews": "Verified Reviews",
            "fiveStars": "5 Star Reviews"
        },
        "allReviews": "All reviews",
        "stars": "stars",
        "verified": "Verified Review",
        "seeAll": "See all reviews"
    },
    "Contact": {
        "title": "Contact & Access",
        "subtitle": "A question? Come meet us or send us a message.",
        "minimalTitle": "Send us a message",
        "form": {
            "name": "Full name *",
            "namePlaceholder": "Your name",
            "email": "Email address *",
            "emailPlaceholder": "your@email.com",
            "phone": "Phone",
            "phonePlaceholder": "06 12 34 56 78",
            "subject": "Subject",
            "message": "Message",
            "messagePlaceholder": "How can we help you?",
            "submit": "Send message",
            "success": "Your message has been sent successfully!"
        }
    },
    "Location": {
        "title": "Where to find us",
        "subtitle": "Our offices are located in the heart of Paris.",
        "address": "Headquarters",
        "phone": "Phone",
        "email": "Email",
        "details": {
            "address": "40 Rue Jean Monnet,\n68200 Mulhouse",
            "phone": "+33 7 56 84 41 45",
            "email": "contact@agm-negoce.com"
        },
        "hours": {
            "title": "Opening Hours",
            "week": "Monday - Friday: 09:00 AM - 07:00 PM",
            "saturday": "Saturday: 10:00 AM - 04:00 PM",
            "sunday": "Sunday: Closed"
        }
    },
    "Simulator": {
        "amountLabel": "Desired amount (€)",
        "durationLabel": "Duration (years)",
        "durationSuffix": "years",
        "months": "months",
        "rateLabel": "Interest rate (%)",
        "guaranteedRate": "Fixed and guaranteed rate.",
        "monthlyEstimate": "Your monthly payment",
        "perMonth": "/ month",
        "excludedInsurance": "Excl. insurance",
        "borrowerInsurance": "Borrower insurance",
        "totalInsuranceCost": "Total insurance cost",
        "disclaimer": "A credit commits you and must be repaid. Check your repayment capacity.",
        "startRequest": "Get my study"
    },
    "Footer": {
        "description": "Your trusted partner for all your real estate financing and insurance projects for 20 years.",
        "linksTitle": "Quick links",
        "Links": {
            "services": "Our services",
            "simulator": "Simulator",
            "documents": "Documents",
            "about": "Who are we?",
            "contact": "Contact",
            "clientArea": "Client Area"
        },
        "contactTitle": "Contact",
        "details": {
            "phone": "+33 7 56 84 41 45",
            "email": "contact@agm-negoce.com",
            "address": "40 Rue Jean Monnet,\n68200 Mulhouse"
        },
        "copyright": "AGM INVEST Credit & Insurance. All rights reserved.",
        "legal": {
            "mentions": "Legal Notice",
            "privacy": "Privacy",
            "cookies": "Cookies",
            "cgu": "Terms",
            "refund": "Refund",
            "disclaimer": "Disclaimer",
            "trust": "Security",
            "ads": "Ads"
        }
    },
    "Dashboard": {
        "Layout": {
            "Sidebar": {
                "clientSpace": "Client Area",
                "balance": "My Balance",
                "makeRequest": "Request a Loan",
                "myRequests": "My Requests",
                "myDocuments": "My Documents",
                "billing": "Billing",
                "myProfile": "My Profile",
                "settings": "Settings",
                "support": "Help & Support",
                "logout": "Logout"
            }
        },
        "Home": {
            "welcome": "Hello, {name} !",
            "subtitle": "Welcome to your dashboard.",
            "status": {
                "verified": "Verified Account",
                "premium": "Premium Client"
            },
            "stats": {
                "total": "Total Requests",
                "approved": "Approved",
                "pending": "Pending",
                "projects": "Projects"
            }
        },
        "Accounts": {
            "title": "My Balance",
            "subtitle": "Manage your accounts and banking info."
        }
    }
}

def sync_keys(master, target, lang):
    new_target = {}
    for key, value in master.items():
        if isinstance(value, dict):
            new_target[key] = sync_keys(value, target.get(key, {}), lang)
        else:
            existing = target.get(key)
            if existing and not any(ord(c) > 127 for c in existing) and "[FIXME]" not in existing:
                new_target[key] = existing
            else:
                new_target[key] = value if lang == "fr" else f"[FIXME] {value}"
    return new_target

def main():
    # 1. Update Masters
    with open(os.path.join(MESSAGES_DIR, "fr.json"), "w", encoding="utf-8") as f:
        json.dump(PUBLIC_FR, f, ensure_ascii=False, indent=2)
    with open(os.path.join(MESSAGES_DIR, "en.json"), "w", encoding="utf-8") as f:
        json.dump(PUBLIC_EN, f, ensure_ascii=False, indent=2)
    
    # 2. Sync Locales
    locales = ["es", "pt", "it", "de"]
    for lang in locales:
        loc_path = os.path.join(MESSAGES_DIR, f"{lang}.json")
        try:
            with open(loc_path, "r", encoding="utf-8") as f:
                current = json.load(f)
        except:
            current = {}
        synced = sync_keys(PUBLIC_FR, current, lang)
        with open(loc_path, "w", encoding="utf-8") as f:
            json.dump(synced, f, ensure_ascii=False, indent=2)
    print("Full authentic restoration complete.")

if __name__ == "__main__":
    main()
