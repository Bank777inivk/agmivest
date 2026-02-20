import json

def generate_full_json():
    with open('extracted_reviews.json', 'r', encoding='utf-8') as f:
        items = json.load(f)

    reviews_namespace = {
        "Reviews": {
            "title": "Ce que nos clients <highlight>disent de nous</highlight>",
            "description": "Découvrez les témoignages de ceux qui nous ont fait confiance pour leur projet de financement.",
            "backToHome": "Retour à l'accueil",
            "allReviews": "Tous les avis",
            "page": "Page",
            "of": "sur",
            "verified": "Avis Vérifié",
            "previous": "Précédent",
            "next": "Suivant",
            "Items": items
        },
        "ReviewForm": {
            "brandName": "AGM INVEST",
            "certifiedReviews": "Avis Clients Certifiés",
            "verifiedEstablishment": "Établissement Vérifié",
            "Success": {
                "title": "Merci pour votre avis !",
                "message": "Votre témoignage a bien été reçu. Il sera publié après validation par notre équipe de modération.",
                "button": "Fermer"
            },
            "ratingLabel": "Votre note globale",
            "Labels": {
                "name": "Votre nom complet",
                "region": "Votre ville / région",
                "comment": "Votre témoignage"
            },
            "Placeholders": {
                "name": "Ex: Jean Dupont",
                "region": "Ex: Strasbourg, Grand Est",
                "comment": "Partagez votre expérience avec AGM INVEST..."
            },
            "submit": "Publier mon avis",
            "disclaimer": "En publiant cet avis, vous acceptez nos conditions d'utilisation.",
            "Errors": {
                "submission": "Une erreur est survenue lors de l'envoi. Veuillez réessayer.",
                "name": "Le nom est obligatoire.",
                "region": "La région est obligatoire.",
                "commentRequired": "Le commentaire est obligatoire.",
                "commentTooShort": "Le commentaire doit faire au moins 10 caractères."
            },
            "Ratings": {
                "1": "Décevant",
                "2": "Moyen",
                "3": "Satisfaisant",
                "4": "Très bien",
                "5": "Excellent"
            }
        }
    }
    
    with open('reviews_block_fr.json', 'w', encoding='utf-8') as f:
        json.dump(reviews_namespace, f, indent=2, ensure_ascii=False)
    print("Full i18n block generated to reviews_block_fr.json")

if __name__ == "__main__":
    generate_full_json()
