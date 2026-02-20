import json

def generate_en_json():
    with open('extracted_reviews.json', 'r', encoding='utf-8') as f:
        items = json.load(f)

    # Note: Client reviews are usually not translated in real-time to preserve authenticity,
    # but for a full i18n experience, we might want to translate them.
    # For now, I'll keep the French comments but translate UI strings.
    
    reviews_namespace = {
        "Reviews": {
            "title": "What our clients <highlight>say about us</highlight>",
            "description": "Discover testimonies from those who trusted us with their financing project.",
            "backToHome": "Back to Home",
            "allReviews": "All Reviews",
            "page": "Page",
            "of": "of",
            "verified": "Verified Review",
            "previous": "Previous",
            "next": "Next",
            "Items": items
        },
        "ReviewForm": {
            "brandName": "AGM INVEST",
            "certifiedReviews": "Certified Client Reviews",
            "verifiedEstablishment": "Verified Establishment",
            "Success": {
                "title": "Thank you for your review!",
                "message": "Your testimony has been well received. It will be published after validation by our moderation team.",
                "button": "Close"
            },
            "ratingLabel": "Your overall rating",
            "Labels": {
                "name": "Your full name",
                "region": "Your city / region",
                "comment": "Your testimony"
            },
            "Placeholders": {
                "name": "Ex: John Doe",
                "region": "Ex: London, UK",
                "comment": "Share your experience with AGM INVEST..."
            },
            "submit": "Publish my review",
            "disclaimer": "By publishing this review, you accept our terms of use.",
            "Errors": {
                "submission": "An error occurred during sending. Please try again.",
                "name": "Name is required.",
                "region": "Region is required.",
                "commentRequired": "Comment is required.",
                "commentTooShort": "Comment must be at least 10 characters long."
            },
            "Ratings": {
                "1": "Disappointing",
                "2": "Average",
                "3": "Satisfactory",
                "4": "Very good",
                "5": "Excellent"
            }
        }
    }
    
    with open('reviews_block_en.json', 'w', encoding='utf-8') as f:
        json.dump(reviews_namespace, f, indent=2, ensure_ascii=False)
    print("Full i18n block generated to reviews_block_en.json")

if __name__ == "__main__":
    generate_en_json()
