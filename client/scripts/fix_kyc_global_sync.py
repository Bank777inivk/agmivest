import json
import os

locales = ['fr', 'en', 'es', 'it', 'pt', 'nl', 'de', 'pl', 'ro', 'sv']

kyc_data = {
    'fr': {
        "title": "Vérification d'Identité",
        "subtitle": "Conformité et sécurité des fonds.",
        "Intro": {
            "badge": "Conformité",
            "title": "Finalisation de votre dossier",
            "step1": {"title": "Identité", "desc": "Photos couleur nettes uniquement.", "note": "Les 4 bordures du document doivent impérativement être visibles."},
            "step2": {"title": "Finance & Domicile", "desc": "Format PDF original (non scanné).", "note": "Les captures d'écran ou scans seront rejetés par la conformité."},
            "support": "Support technique disponible en cas de besoin",
            "contact": "Contact",
            "secure": "Validation securisée AES-256"
        },
        "Documents": {
            "identity_1": "Identité 1", "identity_2": "Identité 2", "id_front": "Pièce ID (Recto)", "id_back": "Pièce ID (Verso)",
            "front": "Recto", "back": "Verso", "cni": "CNI", "passport": "Passeport", "resident_card": "Titre", "driver_license": "Permis",
            "vital_card": "Carte Vitale", "tax_notice": "Avis d'imposition", "pay_slip_1": "Bulletin de paie n°1", "pay_slip_2": "Bulletin de paie n°2",
            "pay_slip_3": "Bulletin de paie n°3", "address_proof": "Justificatif Domicile", "rib": "RIB / IBAN", "nature_1": "Nature ID 1", "nature_2": "Nature ID 2",
            "labels": {"cni": "CNI", "passport": "Passeport", "resident_card": "Titre", "driver_license": "Permis"},
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
            "global": "Statut Global", "valid": "Validés", "certified": "Certifié", "missing": "Manquant", "recorded": "Document enregistré",
            "success": "Succès !", "transmitted": "Transmis", "transmission": "Transmission", "transmission_desc": "Envoyez vos documents pour examen.",
            "transmitted_desc": "Vos documents ont été envoyés avec succès.", "transmitting": "En cours...", "submit": "Envoyer le dossier",
            "finalizing": "Finaliser mon dossier", "encryption": "Cryptage AES-256", "validCount": "{completed} / {total} Validés", "transmitted_short": "Dossier Transmis"
        },
        "Actions": {"capture": "Capture", "upload": "Uploader", "home": "Accueil", "instructions": "Cliquez sur une icône.", "takePhoto": "Prendre une photo", "selectFile": "Sélectionner un fichier", "support_short": "Support", "retake": "Reprendre", "validate": "Valider"},
        "Overlays": {
            "success": {"title": "Succès !", "message": "Vos documents ont été transmis. Réponse sous 24h."},
            "cameraError": "Impossible d'accéder à la caméra.", "analyzing": "Analyse de l'objectif..."
        },
        "Errors": {"pdfRequired": "Format PDF obligatoire.", "fileTooLarge": "Fichier trop volumineux (max 8Mo).", "missingDocs": "Documents manquants.", "submitError": "Erreur d'envoi.", "uploadError": "Erreur upload."},
        "MobileRedirect": {"title": "Utilisez votre mobile", "subtitle": "La capture est réservée aux smartphones.", "method1_label": "Méthode recommandée", "method1_desc": "Scanner le QR Code", "method2_label": "Navigation directe", "method2_desc": "agminvest.com", "button": "Compris"}
    },
    'en': {
        "title": "Identity Verification",
        "subtitle": "Compliance and funds security.",
        "Intro": {
            "badge": "Compliance", "title": "Finalizing your file",
            "step1": {"title": "Identity", "desc": "Clear color photos only.", "note": "All 4 borders must be visible."},
            "step2": {"title": "Finance & Home", "desc": "Original PDF format.", "note": "Scans will be rejected."},
            "support": "Support available if needed", "contact": "Contact", "secure": "AES-256 Secure Validation"
        },
        "Documents": {
            "identity_1": "Identity 1", "identity_2": "Identity 2", "id_front": "ID Piece (Front)", "id_back": "ID Piece (Back)",
            "front": "Front", "back": "Back", "cni": "ID Card", "passport": "Passport", "resident_card": "Card", "driver_license": "License",
            "vital_card": "Health Card", "tax_notice": "Tax Notice", "pay_slip_1": "Pay Slip #1", "pay_slip_2": "Pay Slip #2",
            "pay_slip_3": "Pay Slip #3", "address_proof": "Proof of Address", "rib": "Bank Details", "nature_1": "ID 1 Nature", "nature_2": "ID 2 Nature",
            "labels": {"cni": "ID Card", "passport": "Passport", "resident_card": "Residence", "driver_license": "Driver"},
            "descriptions": {
                "generic_recto": "Front side of your {label}. Clear photos, borders visible.",
                "generic_verso": "Back side of your {label}. Clear photos, borders visible.",
                "generic_simple": "Clear photo of your {label}. Clear photos, borders visible.",
                "vital_card": "Readable copy of your health card.", "tax_notice": "Full tax notice (PDF).",
                "pay_slip": "Pay slip or proof of pension (PDF).", "pay_slip_detailed": "Current or previous month (PDF).",
                "address_proof": "Recent bill (Electricity, Water, Internet) (PDF).", "rib": "In your first and last name (PDF).",
                "intl_id": "Clear color photos, borders visible.", "intl_address": "Recent bill or certificate (PDF)."
            }
        },
        "Status": {
            "global": "Global Status", "valid": "Validated", "certified": "Certified", "missing": "Missing", "recorded": "Recorded",
            "success": "Success!", "transmitted": "Submitted", "transmission": "Transmission", "transmission_desc": "Send your documents for review.",
            "transmitted_desc": "Submitted successfully.", "transmitting": "Processing...", "submit": "Submit File",
            "finalizing": "Finalize my file", "encryption": "AES-256 Encryption", "validCount": "{completed} / {total} Validated", "transmitted_short": "Submitted"
        },
        "Actions": {"capture": "Capture", "upload": "Upload", "home": "Home", "instructions": "Click on an icon.", "takePhoto": "Take photo", "selectFile": "Select file", "support_short": "Support", "retake": "Retake", "validate": "Validate"},
        "Overlays": {
            "success": {"title": "Success!", "message": "Documents transmitted. Response in 24h."},
            "cameraError": "Unable to access camera.", "analyzing": "Analyzing..."
        },
        "Errors": {"pdfRequired": "PDF format required.", "fileTooLarge": "File too large (max 8MB).", "missingDocs": "Missing documents.", "submitError": "Submit error.", "uploadError": "Upload error."},
        "MobileRedirect": {"title": "Use your mobile", "subtitle": "Capture is reserved for smartphones.", "method1_label": "Recommended", "method1_desc": "Scan QR Code", "method2_label": "Direct links", "method2_desc": "agminvest.com", "button": "I understand"}
    },
    'es': {
        "title": "Verificación de Identidad",
        "subtitle": "Cumplimiento y seguridad.",
        "Intro": {
            "badge": "Cumplimiento", "title": "Finalización del expediente",
            "step1": {"title": "Identidad", "desc": "Solo fotos en color nítidas.", "note": "Los 4 bordes deben ser visibles."},
            "step2": {"title": "Finanzas", "desc": "Formato PDF original.", "note": "Los escaneos serán rechazados."},
            "support": "Soporte disponible", "contact": "Contacto", "secure": "AES-256 Asegurado"
        },
        "Documents": {
            "identity_1": "Identidad 1", "identity_2": "Identidad 2", "id_front": "DNI (Anverso)", "id_back": "DNI (Reverso)",
            "front": "Anverso", "back": "Reverso", "cni": "DNI", "passport": "Pasaporte", "resident_card": "Residencia", "driver_license": "Licencia",
            "vital_card": "Tarjeta Sanitaria", "tax_notice": "Declaración Renta", "pay_slip_1": "Nómina 1", "pay_slip_2": "Nómina 2",
            "pay_slip_3": "Nómina 3", "address_proof": "Justificante Domicilio", "rib": "Datos Bancarios", "nature_1": "Tipo ID 1", "nature_2": "Tipo ID 2",
            "labels": {"cni": "DNI", "passport": "Pasaporte", "resident_card": "Residencia", "driver_license": "Licencia"},
            "descriptions": {
                "generic_recto": "Anverso de {label}. Fotos nítidas, bordes visibles.",
                "generic_verso": "Reverso de {label}. Fotos nítidas, bordes visibles.",
                "generic_simple": "Foto de {label}. Fotos nítidas, bordes visibles.",
                "vital_card": "Copia de tarjeta sanitaria.", "tax_notice": "Declaración renta (PDF).",
                "pay_slip": "Nómina o justificante (PDF).", "pay_slip_detailed": "Mes actual o anterior (PDF).",
                "address_proof": "Factura reciente (Luz, Agua) (PDF).", "rib": "A su nombre (PDF).",
                "intl_id": "Fotos nítidas, bordes visibles.", "intl_address": "Certificado reciente (PDF)."
            }
        },
        "Status": {
            "global": "Estado Global", "valid": "Validados", "certified": "Certificado", "missing": "Faltante", "recorded": "Registrado",
            "success": "¡Éxito!", "transmitted": "Transmitido", "transmission": "Transmisión", "transmission_desc": "Envíe documentos para revisión.",
            "transmitted_desc": "Enviado con éxito.", "transmitting": "Enviando...", "submit": "Enviar expediente",
            "finalizing": "Finalizar expediente", "encryption": "Cifrado AES-256", "validCount": "{completed} / {total} Validados", "transmitted_short": "Transmitido"
        },
        "Actions": {"capture": "Captura", "upload": "Subir", "home": "Inicio", "instructions": "Clic en un icono.", "takePhoto": "Tomar foto", "selectFile": "Elegir archivo", "support_short": "Soporte", "retake": "Repetir", "validate": "Validar"},
        "Overlays": {
            "success": {"title": "¡Éxito!", "message": "Documentos transmitidos. Respuesta en 24h."},
            "cameraError": "Cámara no disponible.", "analyzing": "Analizando..."
        },
        "Errors": {"pdfRequired": "PDF obligatorio.", "fileTooLarge": "Máx 8MB.", "missingDocs": "Faltan documentos.", "submitError": "Error envío.", "uploadError": "Error subida."},
        "MobileRedirect": {"title": "Use su móvil", "subtitle": "Captura para smartphones.", "method1_label": "Recomendado", "method1_desc": "Escanear QR", "method2_label": "Enlace directo", "method2_desc": "agminvest.com", "button": "Entendido"}
    },
    'it': {
        "title": "Verifica Identità",
        "subtitle": "Conformità e sicurezza dei fondi.",
        "Intro": {
            "badge": "Conformità", "title": "Finalizzazione della pratica",
            "step1": {"title": "Identità", "desc": "Solo foto a colori nitide.", "note": "I 4 bordi devono essere visibili."},
            "step2": {"title": "Finanze & Domicilio", "desc": "Formato PDF originale.", "note": "Scansioni non accettate."},
            "support": "Supporto tecnico disponibile", "contact": "Contatti", "secure": "Sicurezza AES-256"
        },
        "Documents": {
            "identity_1": "Identità 1", "identity_2": "Identità 2", "id_front": "ID (Fronte)", "id_back": "ID (Retro)",
            "front": "Fronte", "back": "Retro", "cni": "Carta d'Identità", "passport": "Passaporto", "resident_card": "Permesso", "driver_license": "Patente",
            "vital_card": "Tessera Sanitaria", "tax_notice": "Dichiarazione redditi", "pay_slip_1": "Busta paga 1", "pay_slip_2": "Busta paga 2",
            "pay_slip_3": "Busta paga 3", "address_proof": "Prova domicilio", "rib": "IBAN", "nature_1": "Tipo ID 1", "nature_2": "Tipo ID 2",
            "labels": {"cni": "ID", "passport": "Passaporto", "resident_card": "Permesso", "driver_license": "Patente"},
            "descriptions": {
                "generic_recto": "Fronte di {label}. Foto nitide, bordi visibili.",
                "generic_verso": "Retro di {label}. Foto nitide, bordi visibili.",
                "generic_simple": "Foto di {label}. Foto nitide, bordi visibili.",
                "vital_card": "Copia tessera sanitaria.", "tax_notice": "Documento fiscale (PDF).",
                "pay_slip": "Busta paga o pensione (PDF).", "pay_slip_detailed": "Mese corrente o precedente (PDF).",
                "address_proof": "Bolletta recente (PDF).", "rib": "A vostro nome (PDF).",
                "intl_id": "Foto nitide, bordi visibili.", "intl_address": "Certificato recente (PDF)."
            }
        },
        "Status": {
            "global": "Stato Globale", "valid": "Validati", "certified": "Certificato", "missing": "Mancante", "recorded": "Registrato",
            "success": "Successo!", "transmitted": "Trasmesso", "transmission": "Trasmissione", "transmission_desc": "Invia documenti per revisione.",
            "transmitted_desc": "Inviato con successo.", "transmitting": "Inviando...", "submit": "Invia pratica",
            "finalizing": "Finalizza pratica", "encryption": "Criptazione AES-256", "validCount": "{completed} / {total} Validati", "transmitted_short": "Trasmesso"
        },
        "Actions": {"capture": "Cattura", "upload": "Carica", "home": "Home", "instructions": "Clicca su un'icona.", "takePhoto": "Scatta foto", "selectFile": "Scegli file", "support_short": "Supporto", "retake": "Rifai", "validate": "Valida"},
        "Overlays": {
            "success": {"title": "Successo!", "message": "Documenti trasmessi. Risposta entro 24h."},
            "cameraError": "Fotocamera non disponibile.", "analyzing": "Analisi..."
        },
        "Errors": {"pdfRequired": "PDF obbligatorio.", "fileTooLarge": "Max 8MB.", "missingDocs": "Documenti mancanti.", "submitError": "Errore invio.", "uploadError": "Errore caricamento."},
        "MobileRedirect": {"title": "Usa il tuo mobile", "subtitle": "Cattura per smartphone.", "method1_label": "Raccomandato", "method1_desc": "Scansiona QR", "method2_label": "Link diretto", "method2_desc": "agminvest.com", "button": "Capito"}
    },
    'pt': {
        "title": "Verificação de Identidade",
        "subtitle": "Conformidade e segurança.",
        "Intro": {
            "badge": "Conformidade", "title": "Finalização do processo",
            "step1": {"title": "Identidade", "desc": "Apenas fotos nítidas.", "note": "As 4 bordas devem estar visíveis."},
            "step2": {"title": "Finanças & Morada", "desc": "Formato PDF original.", "note": "Scans não aceites."},
            "support": "Suporte disponível", "contact": "Contacto", "secure": "Segurança AES-256"
        },
        "Documents": {
            "identity_1": "Identidade 1", "identity_2": "Identidade 2", "id_front": "ID (Frente)", "id_back": "ID (Verso)",
            "front": "Frente", "back": "Verso", "cni": "Cartão de Cidadão", "passport": "Passaporte", "resident_card": "Residência", "driver_license": "Carta",
            "vital_card": "Cartão Saúde", "tax_notice": "Declaração fiscal", "pay_slip_1": "Recibo 1", "pay_slip_2": "Recibo 2",
            "pay_slip_3": "Recibo 3", "address_proof": "Comprovativo morada", "rib": "Dados Bancários", "nature_1": "Tipo ID 1", "nature_2": "Tipo ID 2",
            "labels": {"cni": "ID", "passport": "Passaporte", "resident_card": "Residência", "driver_license": "Carta"},
            "descriptions": {
                "generic_recto": "Frente de {label}. Fotos nítidas, bordas visíveis.",
                "generic_verso": "Verso de {label}. Fotos nítidas, bordas visíveis.",
                "generic_simple": "Foto de {label}. Fotos nítidas, bordas visíveis.",
                "vital_card": "Cópia cartão saúde.", "tax_notice": "Documento fiscal (PDF).",
                "pay_slip": "Recibo vencimento (PDF).", "pay_slip_detailed": "Mês atual ou anterior (PDF).",
                "address_proof": "Fatura recente (PDF).", "rib": "Em seu nome (PDF).",
                "intl_id": "Fotos nítidas, bordas visíveis.", "intl_address": "Certificado recente (PDF)."
            }
        },
        "Status": {
            "global": "Estado Global", "valid": "Validados", "certified": "Certificado", "missing": "Em falta", "recorded": "Registado",
            "success": "Sucesso!", "transmitted": "Transmitido", "transmission": "Transmissão", "transmission_desc": "Enviar para revisão.",
            "transmitted_desc": "Enviado com sucesso.", "transmitting": "Enviando...", "submit": "Enviar dossier",
            "finalizing": "Finalizar dossier", "encryption": "AES-256", "validCount": "{completed} / {total} Validados", "transmitted_short": "Transmitido"
        },
        "Actions": {"capture": "Captura", "upload": "Carregar", "home": "Início", "instructions": "Clique num ícone.", "takePhoto": "Tirar foto", "selectFile": "Escolher ficheiro", "support_short": "Suporte", "retake": "Repetir", "validate": "Validar"},
        "Overlays": {
            "success": {"title": "Sucesso!", "message": "Documentos enviados. Resposta em 24h."},
            "cameraError": "Câmara indisponível.", "analyzing": "Analisando..."
        },
        "Errors": {"pdfRequired": "PDF obrigatório.", "fileTooLarge": "Máx 8MB.", "missingDocs": "Documentos em falta.", "submitError": "Erro de envio.", "uploadError": "Erro upload."},
        "MobileRedirect": {"title": "Use o seu telemóvel", "subtitle": "Captura para smartphones.", "method1_label": "Recomendado", "method1_desc": "Ler QR Code", "method2_label": "Link direto", "method2_desc": "agminvest.com", "button": "Percebi"}
    },
    'de': {
        "title": "Identitätsprüfung",
        "subtitle": "Compliance und Sicherheit.",
        "Intro": {
            "badge": "Compliance", "title": "Abschluss Ihrer Akte",
            "step1": {"title": "Identität", "desc": "Nur scharfe Farbfotos.", "note": "Alle 4 Ränder müssen sichtbar sein."},
            "step2": {"title": "Finanzen & Wohnsitz", "desc": "Original-PDF-Format.", "note": "Scans werden abgelehnt."},
            "support": "Support verfügbar", "contact": "Kontakt", "secure": "AES-256 Sicherheit"
        },
        "Documents": {
            "identity_1": "Identität 1", "identity_2": "Identität 2", "id_front": "Ausweis (Vorderseite)", "id_back": "Ausweis (Rückseite)",
            "front": "Vorderseite", "back": "Rückseite", "cni": "Personalausweis", "passport": "Reisepass", "resident_card": "Aufenthaltstitel", "driver_license": "Führerschein",
            "vital_card": "Gesundheitskarte", "tax_notice": "Steuerbescheid", "pay_slip_1": "Gehaltsnachweis 1", "pay_slip_2": "Gehaltsnachweis 2",
            "pay_slip_3": "Gehaltsnachweis 3", "address_proof": "Wohnsitznachweis", "rib": "Bankverbindung", "nature_1": "ID Typ 1", "nature_2": "ID Typ 2",
            "labels": {"cni": "Ausweis", "passport": "Reisepass", "resident_card": "Titel", "driver_license": "Führerschein"},
            "descriptions": {
                "generic_recto": "Vorderseite von {label}. Scharf, Ränder sichtbar.",
                "generic_verso": "Rückseite von {label}. Scharf, Ränder sichtbar.",
                "generic_simple": "Foto von {label}. Scharf, Ränder sichtbar.",
                "vital_card": "Gesundheitskarte (Kopie).", "tax_notice": "Steuerbescheid (PDF).",
                "pay_slip": "Gehaltsabrechnung (PDF).", "pay_slip_detailed": "Aktueller/letzter Monat (PDF).",
                "address_proof": "Rechnung (Strom, Wasser) (PDF).", "rib": "Auf Ihren Namen (PDF).",
                "intl_id": "Scharfe Fotos, Ränder sichtbar.", "intl_address": "Bescheinigung (PDF)."
            }
        },
        "Status": {
            "global": "Status", "valid": "Validiert", "certified": "Zertifiziert", "missing": "Fehlt", "recorded": "Gespeichert",
            "success": "Erfolg!", "transmitted": "Übermittelt", "transmission": "Übertragung", "transmission_desc": "Dokumente zur Prüfung senden.",
            "transmitted_desc": "Erfolgreich übermittelt.", "transmitting": "Übertragung...", "submit": "Akte senden",
            "finalizing": "Akte abschließen", "encryption": "AES-256 Verschlüsselung", "validCount": "{completed} / {total} Validiert", "transmitted_short": "Übermittelt"
        },
        "Actions": {"capture": "Aufnahme", "upload": "Hochladen", "home": "Home", "instructions": "Icon klicken.", "takePhoto": "Foto machen", "selectFile": "Datei wählen", "support_short": "Support", "retake": "Wiederholen", "validate": "Validieren"},
        "Overlays": {
            "success": {"title": "Erfolg!", "message": "Dokumente übermittelt. Antwort in 24h."},
            "cameraError": "Kamera nicht verfügbar.", "analyzing": "Analyse..."
        },
        "Errors": {"pdfRequired": "PDF erforderlich.", "fileTooLarge": "Max 8MB.", "missingDocs": "Fehlende Dokumente.", "submitError": "Fehler beim Senden.", "uploadError": "Fehler beim Upload."},
        "MobileRedirect": {"title": "Mobil nutzen", "subtitle": "Aufnahme nur für Smartphones.", "method1_label": "Empfohlen", "method1_desc": "QR-Code scannen", "method2_label": "Direkter Link", "method2_desc": "agminvest.com", "button": "Verstanden"}
    },
    'nl': {
        "title": "Identiteitsverificatie",
        "subtitle": "Compliance en veiligheid.",
        "Intro": {
            "badge": "Compliance", "title": "Afronding van uw dossier",
            "step1": {"title": "Identiteit", "desc": "Alleen scherpe kleurenfoto's.", "note": "Alle 4 randen moeten zichtbaar zijn."},
            "step2": {"title": "Financiën & Adres", "desc": "Origineel PDF-formaat.", "note": "Scans worden geweigerd."},
            "support": "Technische support beschikbaar", "contact": "Contact", "secure": "AES-256 Veilig"
        },
        "Documents": {
            "identity_1": "Identiteit 1", "identity_2": "Identiteit 2", "id_front": "ID (Voorkant)", "id_back": "ID (Achterkant)",
            "front": "Voorkant", "back": "Achterkant", "cni": "ID-kaart", "passport": "Paspoort", "resident_card": "Verblijfstitel", "driver_license": "Rijbewijs",
            "vital_card": "Zorgpas", "tax_notice": "Belastingaanslag", "pay_slip_1": "Loonstrook 1", "pay_slip_2": "Loonstrook 2",
            "pay_slip_3": "Loonstrook 3", "address_proof": "Adresbewijs", "rib": "Bankgegevens", "nature_1": "ID Type 1", "nature_2": "ID Type 2",
            "labels": {"cni": "ID", "passport": "Paspoort", "resident_card": "Titel", "driver_license": "Rijbewijs"},
            "descriptions": {
                "generic_recto": "Voorkant van {label}. Scherp, randen zichtbaar.",
                "generic_verso": "Achterkant van {label}. Scherp, randen zichtbaar.",
                "generic_simple": "Foto van {label}. Scherp, randen zichtbaar.",
                "vital_card": "Kopie zorgpas.", "tax_notice": "Belastingdocument (PDF).",
                "pay_slip": "Loonstrook (PDF).", "pay_slip_detailed": "Huidige/vorige maand (PDF).",
                "address_proof": "Recente factuur (PDF).", "rib": "Op uw naam (PDF).",
                "intl_id": "Scherpe foto's, randen zichtbaar.", "intl_address": "Recent certificaat (PDF)."
            }
        },
        "Status": {
            "global": "Status", "valid": "Gevalideerd", "certified": "Gecertificeerd", "missing": "Ontbrekend", "recorded": "Opgeslagen",
            "success": "Succes!", "transmitted": "Verzonden", "transmission": "Verzending", "transmission_desc": "Verstuur voor controle.",
            "transmitted_desc": "Succesvol verzonden.", "transmitting": "Verzenden...", "submit": "Dossier verzenden",
            "finalizing": "Dossier afronden", "encryption": "AES-256 Versleuteling", "validCount": "{completed} / {total} Gevalideerd", "transmitted_short": "Verzonden"
        },
        "Actions": {"capture": "Vastleg", "upload": "Uploaden", "home": "Home", "instructions": "Klik op een icoon.", "takePhoto": "Foto maken", "selectFile": "Kies bestand", "support_short": "Support", "retake": "Opnieuw", "validate": "Valideren"},
        "Overlays": {
            "success": {"title": "Succes!", "message": "Documenten verzonden. Antwoord binnen 24u."},
            "cameraError": "Camera niet beschikbaar.", "analyzing": "Analyseren..."
        },
        "Errors": {"pdfRequired": "PDF vereist.", "fileTooLarge": "Max 8MB.", "missingDocs": "Documenten ontbreken.", "submitError": "Fout bij verzenden.", "uploadError": "Uploadfout."},
        "MobileRedirect": {"title": "Gebruik mobiel", "subtitle": "Vastleggen via smartphone.", "method1_label": "Aanbevolen", "method1_desc": "Scan QR-code", "method2_label": "Directe link", "method2_desc": "agminvest.com", "button": "Begrepen"}
    },
    'pl': {
        "title": "Weryfikacja Tożsamości",
        "subtitle": "Zgodność i bezpieczeństwo.",
        "Intro": {
            "badge": "Zgodność", "title": "Finalizacja dokumentacji",
            "step1": {"title": "Tożsamość", "desc": "Tylko wyraźne zdjęcia.", "note": "Wszystkie 4 krawędzie widoczne."},
            "step2": {"title": "Finanse i Adres", "desc": "Oryginalny format PDF.", "note": "Skany będą odrzucane."},
            "support": "Wsparcie techniczne", "contact": "Kontakt", "secure": "Bezpieczeństwo AES-256"
        },
        "Documents": {
            "identity_1": "Tożsamość 1", "identity_2": "Tożsamość 2", "id_front": "Dowód (Przód)", "id_back": "Dowód (Tył)",
            "front": "Przód", "back": "Tył", "cni": "Dowód Osobisty", "passport": "Paszport", "resident_card": "Karta Pobytu", "driver_license": "Prawo Jazdy",
            "vital_card": "Karta Zdrowia", "tax_notice": "Deklaracja podatkowa", "pay_slip_1": "Pasek 1", "pay_slip_2": "Pasek 2",
            "pay_slip_3": "Pasek 3", "address_proof": "Potwierdzenie adresu", "rib": "Dane Bankowe", "nature_1": "Typ ID 1", "nature_2": "Typ ID 2",
            "labels": {"cni": "Dowód", "passport": "Paszport", "resident_card": "Karta", "driver_license": "Prawo Jazdy"},
            "descriptions": {
                "generic_recto": "Przód {label}. Wyraźne, krawędzie widoczne.",
                "generic_verso": "Tył {label}. Wyraźne, krawędzie widoczne.",
                "generic_simple": "Zdjęcie {label}. Wyraźne, krawędzie widoczne.",
                "vital_card": "Kopia karty zdrowia.", "tax_notice": "Dokument podatkowy (PDF).",
                "pay_slip": "Potwierdzenie dochodów (PDF).", "pay_slip_detailed": "Bieżący/zeszły miesiąc (PDF).",
                "address_proof": "Rachunek (Prąd, Woda) (PDF).", "rib": "Na Twoje nazwisko (PDF).",
                "intl_id": "Wyraźne zdjęcia, widoczne krawędzie.", "intl_address": "Zaświadczenie (PDF)."
            }
        },
        "Status": {
            "global": "Status", "valid": "Zatwierdzone", "certified": "Certyfikowany", "missing": "Brakujący", "recorded": "Zapisano",
            "success": "Sukces!", "transmitted": "Przesłano", "transmission": "Transmisja", "transmission_desc": "Wyślij do weryfikacji.",
            "transmitted_desc": "Przesłano pomyślnie.", "transmitting": "Przesyłanie...", "submit": "Wyślij wniosek",
            "finalizing": "Finalizuj wniosek", "encryption": "Szyfrowanie AES-256", "validCount": "{completed} / {total} Zatwierdzone", "transmitted_short": "Przesłano"
        },
        "Actions": {"capture": "Zrób zdjęcie", "upload": "Wgraj", "home": "Home", "instructions": "Kliknij ikonę.", "takePhoto": "Zrób zdjęcie", "selectFile": "Wybierz plik", "support_short": "Wsparcie", "retake": "Ponów", "validate": "Zatwierdź"},
        "Overlays": {
            "success": {"title": "Sukces!", "message": "Dokumenty przesłane. Decyzja w 24h."},
            "cameraError": "Kamera niedostępna.", "analyzing": "Analiza..."
        },
        "Errors": {"pdfRequired": "Wymagany PDF.", "fileTooLarge": "Max 8MB.", "missingDocs": "Brakujące dokumenty.", "submitError": "Błąd wysyłania.", "uploadError": "Błąd wgrywania."},
        "MobileRedirect": {"title": "Użyj telefonu", "subtitle": "Zdjęcia tylko przez smartfon.", "method1_label": "Zalecane", "method1_desc": "Skanuj kod QR", "method2_label": "Link bezpośredni", "method2_desc": "agminvest.com", "button": "Rozumiem"}
    },
    'ro': {
        "title": "Verificarea Identității",
        "subtitle": "Conformitate și securitate.",
        "Intro": {
            "badge": "Conformitate", "title": "Finalizarea dosarului",
            "step1": {"title": "Identitate", "desc": "Doar fotografii clare.", "note": "Toate cele 4 margini vizibile."},
            "step2": {"title": "Finanțe și Adresă", "desc": "Format PDF original.", "note": "Scanările vor fi respinse."},
            "support": "Suport tehnic disponibil", "contact": "Contact", "secure": "Securitate AES-256"
        },
        "Documents": {
            "identity_1": "Identitate 1", "identity_2": "Identitate 2", "id_front": "ID (Față)", "id_back": "ID (Spate)",
            "front": "Față", "back": "Spate", "cni": "Buletin / CI", "passport": "Pașaport", "resident_card": "Permis Rezidență", "driver_license": "Permis Conducere",
            "vital_card": "Card Sănătate", "tax_notice": "Declarație fiscală", "pay_slip_1": "Fluturaș 1", "pay_slip_2": "Fluturaș 2",
            "pay_slip_3": "Fluturaș 3", "address_proof": "Dovadă adresă", "rib": "Date Bancare", "nature_1": "Tip ID 1", "nature_2": "Tip ID 2",
            "labels": {"cni": "CI", "passport": "Pașaport", "resident_card": "Permis", "driver_license": "Permis"},
            "descriptions": {
                "generic_recto": "Fața {label}. Foto clară, margini vizibile.",
                "generic_verso": "Spatele {label}. Foto clară, margini vizibile.",
                "generic_simple": "Foto {label}. Foto clară, margini vizibile.",
                "vital_card": "Copie card sănătate.", "tax_notice": "Document fiscal (PDF).",
                "pay_slip": "Dovadă venit (PDF).", "pay_slip_detailed": "Luna curentă/anterioară (PDF).",
                "address_proof": "Factură recentă (PDF).", "rib": "Pe numele dvs. (PDF).",
                "intl_id": "Foto clară, margini vizibile.", "intl_address": "Certificat recent (PDF)."
            }
        },
        "Status": {
            "global": "Status Global", "valid": "Validat", "certified": "Certificat", "missing": "Lipsește", "recorded": "Înregistrat",
            "success": "Succes!", "transmitted": "Transmis", "transmission": "Transmisie", "transmission_desc": "Trimiteți pentru revizuire.",
            "transmitted_desc": "Transmis cu succes.", "transmitting": "Se transmite...", "submit": "Trimite dosarul",
            "finalizing": "Finalizează dosarul", "encryption": "Criptare AES-256", "validCount": "{completed} / {total} Validate", "transmitted_short": "Transmis"
        },
        "Actions": {"capture": "Captură", "upload": "Încărcare", "home": "Acasă", "instructions": "Click pe o pictogramă.", "takePhoto": "Fă o poză", "selectFile": "Alege fișier", "support_short": "Suport", "retake": "Refă", "validate": "Validează"},
        "Overlays": {
            "success": {"title": "Succes!", "message": "Documente transmise. Răspuns în 24h."},
            "cameraError": "Cameră indisponibilă.", "analyzing": "Analiză..."
        },
        "Errors": {"pdfRequired": "Format PDF obligatoriu.", "fileTooLarge": "Max 8MB.", "missingDocs": "Documente lipsă.", "submitError": "Eroare trimitere.", "uploadError": "Eroare încărcare."},
        "MobileRedirect": {"title": "Folosiți mobilul", "subtitle": "Captură doar pe smartphone.", "method1_label": "Recomandat", "method1_desc": "Scanați codul QR", "method2_label": "Link direct", "method2_desc": "agminvest.com", "button": "Am înțeles"}
    },
    'sv': {
        "title": "Identitetsverifiering",
        "subtitle": "Efterlevnad och säkerhet.",
        "Intro": {
            "badge": "Compliance", "title": "Slutförande av ärendet",
            "step1": {"title": "Identitet", "desc": "Endast tydliga färgfoton.", "note": "Alla 4 hörn måste synas."},
            "step2": {"title": "Ekonomi & Bostad", "desc": "Original PDF-format.", "note": "Skannade kopior nekas."},
            "support": "Teknisk support tillgänglig", "contact": "Kontakt", "secure": "AES-256 Säkerhet"
        },
        "Documents": {
            "identity_1": "Identitet 1", "identity_2": "Identitet 2", "id_front": "ID (Framsida)", "id_back": "ID (Baksida)",
            "front": "Framsida", "back": "Baksida", "cni": "ID-kort", "passport": "Pass", "resident_card": "Uppehållstillstånd", "driver_license": "Körkort",
            "vital_card": "Sjukvårdskort", "tax_notice": "Skattebesked", "pay_slip_1": "Lönespec 1", "pay_slip_2": "Lönespec 2",
            "pay_slip_3": "Lönespec 3", "address_proof": "Adressbevis", "rib": "Bankuppgifter", "nature_1": "ID Typ 1", "nature_2": "ID Typ 2",
            "labels": {"cni": "ID", "passport": "Pass", "resident_card": "Tillstånd", "driver_license": "Körkort"},
            "descriptions": {
                "generic_recto": "Framsida av {label}. Tydlig bild, hörn synliga.",
                "generic_verso": "Baksida av {label}. Tydlig bild, hörn synliga.",
                "generic_simple": "Bild på {label}. Tydlig bild, hörn synliga.",
                "vital_card": "Kopia av sjukvårdskort.", "tax_notice": "Skattebesked (PDF).",
                "pay_slip": "Lönebesked (PDF).", "pay_slip_detailed": "Nuvarande/förra månaden (PDF).",
                "address_proof": "Nylig faktura (PDF).", "rib": "I ditt namn (PDF).",
                "intl_id": "Tydliga foton, hörn synliga.", "intl_address": "Nyligt intyg (PDF)."
            }
        },
        "Status": {
            "global": "Global Status", "valid": "Validerade", "certified": "Certifierat", "missing": "Saknas", "recorded": "Registrerat",
            "success": "Klart!", "transmitted": "Skickat", "transmission": "Överföring", "transmission_desc": "Skicka för granskning.",
            "transmitted_desc": "Skickat framgångsrikt.", "transmitting": "Skickar...", "submit": "Skicka ärende",
            "finalizing": "Slutför ärende", "encryption": "AES-256 Kryptering", "validCount": "{completed} / {total} Validerade", "transmitted_short": "Skickat"
        },
        "Actions": {"capture": "Fota", "upload": "Ladda upp", "home": "Hem", "instructions": "Klicka på en ikon.", "takePhoto": "Ta foto", "selectFile": "Välj fil", "support_short": "Support", "retake": "Gör om", "validate": "Validera"},
        "Overlays": {
            "success": {"title": "Klart!", "message": "Dokument skickade. Svar inom 24h."},
            "cameraError": "Kamera inte tillgänglig.", "analyzing": "Analyserar..."
        },
        "Errors": {"pdfRequired": "PDF-format krävs.", "fileTooLarge": "Max 8MB.", "missingDocs": "Saknade dokument.", "submitError": "Fel vid skickande.", "uploadError": "Uppladdningsfel."},
        "MobileRedirect": {"title": "Använd mobilen", "subtitle": "Fotografering via smartphone.", "method1_label": "Rekommenderat", "method1_desc": "Skanna QR-kod", "method2_label": "Direktlänk", "method2_desc": "agminvest.com", "button": "Jag förstår"}
    }
}

def update_json(lang):
    path = f'messages/{lang}.json'
    if not os.path.exists(path):
        print(f"File {path} not found.")
        return

    with open(path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    if 'Dashboard' not in data:
        data['Dashboard'] = {}
    
    # Force KYC to be inside Dashboard
    data['Dashboard']['KYC'] = kyc_data[lang]

    # Clean root KYC if exists
    if 'KYC' in data:
        del data['KYC']

    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print(f"Updated {path} (Global Sync)")

for lang in locales:
    update_json(lang)
