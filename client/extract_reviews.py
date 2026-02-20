import re
import json

def extract_reviews():
    with open('c:/Users/tesla/Videos/Nouvelle aventure/pret/client/src/data/reviewsData.ts', 'r', encoding='utf-8') as f:
        content = f.read()

    # Regex to find review objects
    # Example: { id: 1, name: "...", region: "...", rating: 5, comment: "...", date: "...", verified: true }
    pattern = r'\{\s*id:\s*(\d+),\s*name:\s*"([^"]*)",\s*region:\s*"([^"]*)",\s*rating:\s*\d+,\s*comment:\s*"([^"]*)",\s*date:\s*"([^"]*)",\s*verified:\s*(true|false)\s*\}'
    matches = re.finditer(pattern, content)

    reviews_json = {}
    for match in matches:
        rid = match.group(1)
        region = match.group(3)
        comment = match.group(4)
        
        reviews_json[f"r{rid}"] = {
            "region": region,
            "comment": comment
        }

    return reviews_json

if __name__ == "__main__":
    data = extract_reviews()
    with open('extracted_reviews.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print("Reviews extracted to extracted_reviews.json")
