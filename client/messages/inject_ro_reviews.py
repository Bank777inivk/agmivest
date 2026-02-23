import json

def inject_reviews():
    ro_json_path = r'c:\Users\tesla\Videos\Nouvelle aventure\pret\client\messages\ro.json'
    ro_reviews_path = r'c:\Users\tesla\Videos\Nouvelle aventure\pret\client\messages\ro_reviews_output.json'
    
    with open(ro_json_path, 'r', encoding='utf-8') as f:
        ro_data = json.load(f)
        
    with open(ro_reviews_path, 'r', encoding='utf-8') as f:
        new_reviews = json.load(f)
        
    # Inject reviews
    ro_data['Reviews']['Items'] = new_reviews
    
    with open(ro_json_path, 'w', encoding='utf-8') as f:
        json.dump(ro_data, f, indent=2, ensure_ascii=False)
    print("Injection réussie !")

if __name__ == "__main__":
    inject_reviews()
