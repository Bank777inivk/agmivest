import json
import os

locales = ['fr', 'en', 'es', 'it', 'pt', 'nl', 'de', 'pl', 'ro', 'sv']

translations = {
    'fr': {
        'MobileRedirect': {
            'title': 'Utilisez votre mobile',
            'subtitle': 'Pour garantir une qualité de capture optimale et une validation rapide de votre dossier, la fonction de capture est réservée aux smartphones.',
            'method1_label': 'Méthode recommandée',
            'method1_desc': 'Scanner ce site depuis votre téléphone',
            'method2_label': 'Navigation directe',
            'method2_desc': 'Connectez-vous sur agminvest.com',
            'button': "J'ai compris"
        },
        'Actions': {
            'retake': 'Reprendre',
            'validate': 'Valider'
        },
        'Overlays': {
            'cameraError': "Impossible d'accéder à la caméra.",
            'analyzing': "Analyse de l'objectif..."
        }
    },
    'en': {
        'MobileRedirect': {
            'title': 'Use your mobile',
            'subtitle': 'To ensure optimal capture quality and rapid validation of your file, the capture function is reserved for smartphones.',
            'method1_label': 'Recommended method',
            'method1_desc': 'Scan this site from your phone',
            'method2_label': 'Direct navigation',
            'method2_desc': 'Log in to agminvest.com',
            'button': 'I understand'
        },
        'Actions': {
            'retake': 'Retake',
            'validate': 'Validate'
        },
        'Overlays': {
            'cameraError': 'Unable to access camera.',
            'analyzing': 'Analyzing lens...'
        }
    },
    'es': {
        'MobileRedirect': {
            'title': 'Use su móvil',
            'subtitle': 'Para garantizar una calidad de captura óptima y una validación rápida de su expediente, la función de captura está reservada para teléfonos inteligentes.',
            'method1_label': 'Método recomendado',
            'method1_desc': 'Escanee este sitio desde su teléfono',
            'method2_label': 'Navegación directa',
            'method2_desc': 'Inicie sesión en agminvest.com',
            'button': 'Entendido'
        },
        'Actions': {
            'retake': 'Repetir',
            'validate': 'Validar'
        },
        'Overlays': {
            'cameraError': 'No se puede acceder a la cámara.',
            'analyzing': 'Analizando lente...'
        }
    }
}

# Default mappings for other languages (using English as base)
fallback_keys = ['it', 'pt', 'nl', 'de', 'pl', 'ro', 'sv']
for lang in fallback_keys:
    if lang not in translations:
        translations[lang] = translations['en']

def update_json(lang):
    path = f'messages/{lang}.json'
    if not os.path.exists(path):
        print(f"File {path} not found.")
        return

    with open(path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    if 'Dashboard' not in data:
        data['Dashboard'] = {}
    
    # Ensure KYC is inside Dashboard
    if 'KYC' in data and 'KYC' not in data['Dashboard']:
        # Move KYC from root to Dashboard
        data['Dashboard']['KYC'] = data.pop('KYC')
    elif 'KYC' not in data['Dashboard']:
        data['Dashboard']['KYC'] = {}

    target_kyc = data['Dashboard']['KYC']
    source = translations.get(lang, translations['en'])

    # Update MobileRedirect
    target_kyc['MobileRedirect'] = source['MobileRedirect']

    # Update Actions (merge)
    if 'Actions' not in target_kyc:
        target_kyc['Actions'] = {}
    target_kyc['Actions'].update(source['Actions'])

    # Update Overlays (merge)
    if 'Overlays' not in target_kyc:
        target_kyc['Overlays'] = {}
    target_kyc['Overlays'].update(source['Overlays'])

    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print(f"Updated {path}")

for lang in locales:
    update_json(lang)
