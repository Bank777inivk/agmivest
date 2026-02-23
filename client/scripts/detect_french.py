import json
import os
import re

def is_french(text):
    # Simple check for French-specific characters or common words
    french_words = ['le', 'la', 'les', 'des', 'du', 'en', 'et', 'pour', 'dans', 'sur', 'avec', 'par', 'est', 'sont', 'votre', 'notre', 'votre', 'nos', 'vos', 'leur', 'leurs', 'mes', 'tes', 'ses', 'ces', 'ce', 'cette', 'cet', 'ces', 'de', 'du', 'des', 'un', 'une', 'des', 'à', 'au', 'aux', 'si', 'se', 'sa', 'son', 'qui', 'que', 'quoi', 'dont', 'où', 'quand', 'comment', 'pourquoi', 'puisque', 'car', 'comme', 'si', 'non', 'oui', 'peut-être', 'toujours', 'jamais', 'souvent', 'parfois', 'donc', 'ainsi', 'alors', 'ensuite', 'puis', 'après', 'avant', 'pendant', 'durant', 'malgré', 'contre', 'selon', 'parmi', 'depuis', 'entre', 'derrière', 'devant', 'sous', 'vers', 'chez', 'pour', 'sans', 'selon', 'voici', 'voilà']
    
    # Common French words in the context of the app
    app_french = ['Prêt', 'Personnel', 'Moto', 'Professionnel', 'Autre', 'projet', 'Mensualité', 'Montant', 'souhaité', 'Saisissez', 'votre', 'adresse', 'Civilité', 'Prénom', 'Famille', 'Naissance', 'Ville', 'Pays', 'Nationalité', 'Française', 'Marié', 'Pacsé', 'Célibataire', 'Divorcé', 'Veuf', 'Locataire', 'Propriétaire', 'Logé', 'gratuit', 'Retraité', 'Étudiant', 'Apprenti', 'Sans', 'emploi', 'Ministère', 'Éducation', 'Cabinet', 'Gérant', 'Menuisier', 'Développeur', 'Apprenti', 'Mécanicien', 'Envoi', 'cours', 'Modifier', 'ma', 'demande', 'Résumé', 'Suivant', 'Retour', 'Précédent', 'Confirmer', 'Traitement']

    words = re.findall(r'\b\w+\b', text.lower())
    if not words:
        return False
    
    french_count = sum(1 for w in words if w in french_words or w.capitalize() in app_french)
    return french_count / len(words) > 0.3 if len(words) > 3 else french_count > 0

def find_french_in_json(obj, path=""):
    results = []
    if isinstance(obj, dict):
        for k, v in obj.items():
            results.extend(find_french_in_json(v, f"{path}.{k}" if path else k))
    elif isinstance(obj, list):
        for i, v in enumerate(obj):
            results.extend(find_french_in_json(v, f"{path}[{i}]"))
    elif isinstance(obj, str):
        if is_french(obj):
            results.append((path, obj))
    return results

def audit_all_languages():
    languages = ['en', 'es', 'it', 'de', 'nl', 'pl', 'pt', 'ro', 'sv']
    base_path = "c:/Users/tesla/Videos/Nouvelle aventure/pret/client/messages"
    
    for lang in languages:
        file_path = os.path.join(base_path, f"{lang}.json")
        if not os.path.exists(file_path):
            print(f"File not found: {lang}.json")
            continue
            
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            
        print(f"\n--- Audit for {lang}.json ---")
        french_strings = find_french_in_json(data)
        if not french_strings:
            print("No French strings found.")
        else:
            for path, val in french_strings:
                print(f"[{path}] = {val}")

if __name__ == "__main__":
    audit_all_languages()
