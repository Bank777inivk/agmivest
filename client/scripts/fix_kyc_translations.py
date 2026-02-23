import json
import os

languages = ['en', 'es', 'it', 'de', 'nl', 'pl', 'pt', 'ro', 'sv']

# Source of truth (French)
kyc_fr = {
    "title": "Vérification d'Identité",
    "subtitle": "Conformité et sécurité des fonds.",
    "Intro": {
        "badge": "Conformité",
        "title": "Finalisation de votre dossier",
        "step1": {
            "title": "Identité",
            "desc": "Photos couleur nettes uniquement.",
            "note": "Les 4 bordures du document doivent impérativement être visibles."
        },
        "step2": {
            "title": "Finance & Domicile",
            "desc": "Format PDF original (non scanné).",
            "note": "Les captures d'écran ou scans seront rejetés par la conformité."
        },
        "support": "Support technique disponible en cas de besoin",
        "contact": "Contact",
        "secure": "Validation securisée AES-256"
    },
    "Documents": {
        "identity_1": "Identité 1",
        "identity_2": "Identité 2",
        "id_front": "Pièce ID (Recto)",
        "id_back": "Pièce ID (Verso)",
        "front": "Recto",
        "back": "Verso",
        "cni": "CNI",
        "passport": "Passeport",
        "resident_card": "Titre",
        "driver_license": "Permis",
        "vital_card": "Carte Vitale",
        "tax_notice": "Avis d'imposition",
        "pay_slip_1": "Bulletin de paie n°1",
        "pay_slip_2": "Bulletin de paie n°2",
        "pay_slip_3": "Bulletin de paie n°3",
        "address_proof": "Justificatif Domicile",
        "rib": "RIB / IBAN",
        "nature_1": "Nature ID 1",
        "nature_2": "Nature ID 2",
        "labels": {
            "cni": "CNI",
            "passport": "Passeport",
            "resident_card": "Titre",
            "driver_license": "Permis"
        },
        "descriptions": {
            "generic_recto": "Face avant de votre {label}. Photos couleur nettes, bordures visibles.",
            "generic_verso": "Face arrière de votre {label}. Photos couleur nettes, bordures visibles.",
            "generic_simple": "Photo claire de votre {label}. Photos couleur nettes, bordures visibles.",
            "vital_card": "Copie lisible de votre carte vitale.",
            "tax_notice": "Dernier avis fiscal complet (PDF uniquement).",
            "pay_slip": "Bulletin de paie ou justificatif pension/allocation (PDF uniquement).",
            "pay_slip_detailed": "Mois actuel ou précédent selon le rang (PDF uniquement).",
            "address_proof": "Facture récente -3 mois (EDF, Eau, Internet...) (PDF uniquement).",
            "rib": "À votre nom et prénom (PDF uniquement).",
            "intl_id": "Photos couleur nettes, bordures visibles.",
            "intl_address": "Facture ou certificat récent (PDF uniquement)."
        }
    },
    "Status": {
        "global": "Statut Global",
        "valid": "Validés",
        "certified": "Cértifié",
        "missing": "Manquant",
        "recorded": "Document enregistré",
        "success": "Succès !",
        "transmitted": "Transmis",
        "transmission": "Transmission",
        "transmission_desc": "Envoyez vos documents pour examen.",
        "transmitted_desc": "Vos documents ont été envoyés avec succès.",
        "transmitting": "En cours...",
        "submit": "Envoyer le dossier",
        "finalizing": "Finaliser mon dossier",
        "encryption": "Cryptage AES-256",
        "validCount": "{completed} / {total} Validés",
        "transmitted_short": "Dossier Transmis"
    },
    "Actions": {
        "capture": "Capture",
        "upload": "Uploader",
        "home": "Revenir à l'accueil",
        "instructions": "Cliquez sur une icône pour ajouter votre document.",
        "takePhoto": "Prendre une photo",
        "selectFile": "Sélectionner un fichier",
        "support_short": "Support en ligne"
    },
    "Overlays": {
        "success": {
            "title": "Succès !",
            "message": "Vos documents ont été transmis à notre équipe d'analyse. Nous reviendrons vers vous sous 24h."
        }
    },
    "Errors": {
        "pdfRequired": "Ce document doit être obligatoirement au format PDF.",
        "fileTooLarge": "Le fichier est trop volumineux (max 8MB)",
        "missingDocs": "Veuillez fournir tous les documents.",
        "submitError": "Erreur lors de l'envoi.",
        "uploadError": "Erreur upload"
    }
}

kyc_translations = {
    'en': {
        "title": "Identity Verification",
        "subtitle": "Compliance and funds security.",
        "Intro": {
            "badge": "Compliance",
            "title": "Finalizing your file",
            "step1": {
                "title": "Identity",
                "desc": "Clear color photos only.",
                "note": "All 4 borders of the document must be visible."
            },
            "step2": {
                "title": "Finance & Home",
                "desc": "Original PDF format (non-scanned).",
                "note": "Screenshots or scans will be rejected by compliance."
            },
            "support": "Technical support available if needed",
            "contact": "Contact",
            "secure": "AES-256 Secure Validation"
        },
        "Documents": {
            "identity_1": "Identity 1",
            "identity_2": "Identity 2",
            "id_front": "ID Piece (Front)",
            "id_back": "ID Piece (Back)",
            "front": "Front",
            "back": "Back",
            "cni": "ID Card",
            "passport": "Passport",
            "resident_card": "Residence Card",
            "driver_license": "Driver License",
            "vital_card": "Health Card",
            "tax_notice": "Tax Notice",
            "pay_slip_1": "Pay Slip #1",
            "pay_slip_2": "Pay Slip #2",
            "pay_slip_3": "Pay Slip #3",
            "address_proof": "Proof of Address",
            "rib": "Bank Details / IBAN",
            "nature_1": "ID 1 Nature",
            "nature_2": "ID 2 Nature",
            "labels": {
                "cni": "ID Card",
                "passport": "Passport",
                "resident_card": "Residence",
                "driver_license": "Driver"
            },
            "descriptions": {
                "generic_recto": "Front side of your {label}. Clear color photos, borders visible.",
                "generic_verso": "Back side of your {label}. Clear color photos, borders visible.",
                "generic_simple": "Clear photo of your {label}. Clear color photos, borders visible.",
                "vital_card": "Readable copy of your health card.",
                "tax_notice": "Full latest tax notice (PDF only).",
                "pay_slip": "Pay slip or proof of pension/allowance (PDF only).",
                "pay_slip_detailed": "Current or previous month depending on rank (PDF only).",
                "address_proof": "Recent bill -3 months (Electricity, Water, Internet...) (PDF only).",
                "rib": "In your first and last name (PDF only).",
                "intl_id": "Clear color photos, borders visible.",
                "intl_address": "Recent bill or certificate (PDF only)."
            }
        },
        "Status": {
            "global": "Global Status",
            "validCount": "{completed} / {total} Validated",
            "valid": "Validated",
            "certified": "Certified",
            "missing": "Missing",
            "recorded": "Document recorded",
            "success": "Success!",
            "transmitted": "Transmitted",
            "transmission": "Transmission",
            "transmission_desc": "Send your documents for review.",
            "transmitted_desc": "Your documents have been submitted successfully.",
            "transmitting": "Processing...",
            "submit": "Submit File",
            "finalizing": "Finalize my file",
            "encryption": "AES-256 Encryption"
        },
        "Actions": {
            "capture": "Capture",
            "upload": "Upload",
            "home": "Back to Home",
            "instructions": "Click on an icon to add your document.",
            "takePhoto": "Take a photo",
            "selectFile": "Select a file",
            "support_short": "Online Support"
        },
        "Overlays": {
            "success": {
                "title": "Success!",
                "message": "Your documents have been transmitted to our analysis team. We will get back to you within 24 hours."
            }
        },
        "Errors": {
            "pdfRequired": "This document must be in PDF format.",
            "fileTooLarge": "The file is too large (max 8MB)",
            "missingDocs": "Please provide all documents.",
            "submitError": "Error during submission.",
            "uploadError": "Upload error"
        }
    },
    'es': {
        "title": "Verificación de Identidad",
        "subtitle": "Cumplimiento y seguridad de los fondos.",
        "Intro": {
            "badge": "Cumplimiento",
            "title": "Finalización de su expediente",
            "step1": {
                "title": "Identidad",
                "desc": "Solo fotos en color nítidas.",
                "note": "Los 4 bordes del documento deben ser visibles obligatoriamente."
            },
            "step2": {
                "title": "Finanzas y Domicilio",
                "desc": "Formato PDF original (no escaneado).",
                "note": "Las capturas de pantalla o escaneos serán rechazados por cumplimiento."
            },
            "support": "Soporte técnico disponible si lo necesita",
            "contact": "Contacto",
            "secure": "Validación segura AES-256"
        },
        "Documents": {
            "identity_1": "Identidad 1",
            "identity_2": "Identidad 2",
            "id_front": "Documento ID (Anverso)",
            "id_back": "Documento ID (Reverso)",
            "front": "Anverso",
            "back": "Reverso",
            "cni": "DNI",
            "passport": "Pasaporte",
            "resident_card": "Tarjeta de Residencia",
            "driver_license": "Licencia de Conducir",
            "vital_card": "Tarjeta Sanitaria",
            "tax_notice": "Declaración de la renta",
            "pay_slip_1": "Nómina n°1",
            "pay_slip_2": "Nómina n°2",
            "pay_slip_3": "Nómina n°3",
            "address_proof": "Justificante de Domicilio",
            "rib": "Cuenta Bancaria / IBAN",
            "nature_1": "Tipo de ID 1",
            "nature_2": "Tipo de ID 2",
            "labels": {
                "cni": "DNI",
                "passport": "Pasaporte",
                "resident_card": "Residencia",
                "driver_license": "Licencia"
            },
            "descriptions": {
                "generic_recto": "Anverso de su {label}. Fotos en color nítidas, bordes visibles.",
                "generic_verso": "Reverso de su {label}. Fotos en color nítidas, bordes visibles.",
                "generic_simple": "Foto clara de su {label}. Fotos en color nítidas, bordes visibles.",
                "vital_card": "Copia legible de su tarjeta sanitaria.",
                "tax_notice": "Última declaración de la renta completa (solo PDF).",
                "pay_slip": "Nómina o justificante de pensión/subsidio (solo PDF).",
                "pay_slip_detailed": "Mes actual o anterior según el rango (solo PDF).",
                "address_proof": "Factura reciente -3 meses (Luz, Agua, Internet...) (solo PDF).",
                "rib": "A su nombre y apellido (solo PDF).",
                "intl_id": "Fotos en color nítidas, bordes visibles.",
                "intl_address": "Factura o certificado reciente (solo PDF)."
            }
        },
        "Status": {
            "global": "Estado Global",
            "valid": "Validados",
            "certified": "Certificado",
            "missing": "Faltante",
            "recorded": "Documento registrado",
            "success": "¡Éxito!",
            "transmitted": "Transmitido",
            "transmission": "Transmisión",
            "transmission_desc": "Envíe sus documentos para revisión.",
            "transmitted_desc": "Sus documentos han sido enviados con éxito.",
            "transmitting": "Enviando...",
            "submit": "Enviar expediente",
            "finalizing": "Finalizar mi expediente",
            "encryption": "Cifrado AES-256",
            "validCount": "{completed} / {total} Validados",
            "transmitted_short": "Expediente Transmitido"
        },
        "Actions": {
            "capture": "Captura",
            "upload": "Subir",
            "home": "Volver al inicio",
            "instructions": "Haga clic en un icono para añadir su documento.",
            "takePhoto": "Tomar una foto",
            "selectFile": "Seleccionar un archivo",
            "support_short": "Soporte en línea"
        },
        "Overlays": {
            "success": {
                "title": "¡Éxito!",
                "message": "Sus documentos han sido transmitidos a nuestro equipo de análisis. Le responderemos en un plazo de 24 horas."
            }
        },
        "Errors": {
            "pdfRequired": "Este documento debe estar obligatoriamente en formato PDF.",
            "fileTooLarge": "El archivo es demasiado grande (máx 8MB)",
            "missingDocs": "Por favor, proporcione todos los documentos.",
            "submitError": "Error al enviar.",
            "uploadError": "Error al subir"
        }
    }
}

def update_json(lang):
    file_path = f'messages/{lang}.json'
    if not os.path.exists(file_path):
        print(f"File {file_path} not found.")
        return

    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    if 'Dashboard' not in data:
        data['Dashboard'] = {}

    # Use French as base for all other languages if not translated
    translations = kyc_translations.get(lang, kyc_fr)
    data['Dashboard']['KYC'] = translations

    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"Updated {file_path}")

for lang in languages:
    update_json(lang)
