import json, os

base_dir = r"c:\Users\tesla\Videos\Nouvelle aventure\pret\client\messages"

translations = {
    "fr": {
        "title": "Mes Documents",
        "subtitle": "Consultez et téléchargez vos documents contractuels, attestations et garanties certifiées.",
        "empty": {
            "title": "Aucun document disponible",
            "message": "Vos documents officiels seront générés automatiquement dès que votre financement sera activé."
        },
        "contract": {
            "title": "Contrat de Prêt",
            "description": "Votre contrat complet incluant l'échéancier, les conditions générales et les mentions légales.",
            "button": "Télécharger PDF"
        },
        "insurance": {
            "title": "Assurance",
            "description": "Certificat d'adhésion à l'assurance emprunteur AGM INVEST couvrant votre projet à 100%.",
            "button": "Télécharger Certificat"
        },
        "privacy": {
            "title": "Vie Privée",
            "description": "Document détaillant la protection de vos données personnelles et vos droits RGPD.",
            "button": "Télécharger PDF"
        },
        "security": {
            "title": "Documents Certifiés & Sécurisés",
            "message": "\"Tous les documents générés depuis cet espace sont protégés électroniquement et certifiés conformes par AGM INVEST. Ils ont valeur légale pour vos démarches.\""
        }
    },
    "en": {
        "title": "My Documents",
        "subtitle": "View and download your contractual documents, certificates and certified guarantees.",
        "empty": {
            "title": "No documents available",
            "message": "Your official documents will be generated automatically once your financing is activated."
        },
        "contract": {
            "title": "Loan Agreement",
            "description": "Your complete contract including the repayment schedule, general conditions and legal notices.",
            "button": "Download PDF"
        },
        "insurance": {
            "title": "Insurance",
            "description": "AGM INVEST borrower insurance membership certificate covering your project 100%.",
            "button": "Download Certificate"
        },
        "privacy": {
            "title": "Privacy",
            "description": "Document detailing the protection of your personal data and your GDPR rights.",
            "button": "Download PDF"
        },
        "security": {
            "title": "Certified & Secure Documents",
            "message": "\"All documents generated from this area are electronically protected and certified compliant by AGM INVEST. They have legal value for your procedures.\""
        }
    },
    "es": {
        "title": "Mis Documentos",
        "subtitle": "Consulte y descargue sus documentos contractuales, certificados y garantías certificadas.",
        "empty": {
            "title": "No hay documentos disponibles",
            "message": "Sus documentos oficiales se generarán automáticamente una vez que su financiación esté activada."
        },
        "contract": {
            "title": "Contrato de Préstamo",
            "description": "Su contrato completo incluyendo el calendario de pagos, condiciones generales y menciones legales.",
            "button": "Descargar PDF"
        },
        "insurance": {
            "title": "Seguro",
            "description": "Certificado de adhesión al seguro de prestatario AGM INVEST que cubre su proyecto al 100%.",
            "button": "Descargar Certificado"
        },
        "privacy": {
            "title": "Privacidad",
            "description": "Documento que detalla la protección de sus datos personales y sus derechos RGPD.",
            "button": "Descargar PDF"
        },
        "security": {
            "title": "Documentos Certificados y Seguros",
            "message": "\"Todos los documentos generados desde este espacio están protegidos electrónicamente y certificados conformes por AGM INVEST. Tienen valor legal para sus gestiones.\""
        }
    },
    "it": {
        "title": "I Miei Documenti",
        "subtitle": "Consulti e scarichi i suoi documenti contrattuali, attestati e garanzie certificate.",
        "empty": {
            "title": "Nessun documento disponibile",
            "message": "I suoi documenti ufficiali saranno generati automaticamente non appena il suo finanziamento sarà attivato."
        },
        "contract": {
            "title": "Contratto di Prestito",
            "description": "Il suo contratto completo incluso il piano di ammortamento, le condizioni generali e le note legali.",
            "button": "Scarica PDF"
        },
        "insurance": {
            "title": "Assicurazione",
            "description": "Certificato di adesione all'assicurazione mutuatario AGM INVEST che copre il suo progetto al 100%.",
            "button": "Scarica Certificato"
        },
        "privacy": {
            "title": "Privacy",
            "description": "Documento che dettaglia la protezione dei suoi dati personali e i suoi diritti RGPD.",
            "button": "Scarica PDF"
        },
        "security": {
            "title": "Documenti Certificati e Sicuri",
            "message": "\"Tutti i documenti generati da questo spazio sono protetti elettronicamente e certificati conformi da AGM INVEST. Hanno valore legale per le sue pratiche.\""
        }
    },
    "de": {
        "title": "Meine Dokumente",
        "subtitle": "Sehen und laden Sie Ihre Vertragsdokumente, Bescheinigungen und zertifizierten Garantien herunter.",
        "empty": {
            "title": "Keine Dokumente verfügbar",
            "message": "Ihre offiziellen Dokumente werden automatisch erstellt, sobald Ihre Finanzierung aktiviert ist."
        },
        "contract": {
            "title": "Darlehensvertrag",
            "description": "Ihr vollständiger Vertrag einschließlich Tilgungsplan, allgemeiner Bedingungen und rechtlicher Hinweise.",
            "button": "PDF herunterladen"
        },
        "insurance": {
            "title": "Versicherung",
            "description": "Beitrittszertifikat zur AGM INVEST Kreditnehmerversicherung, die Ihr Projekt zu 100% absichert.",
            "button": "Zertifikat herunterladen"
        },
        "privacy": {
            "title": "Datenschutz",
            "description": "Dokument mit Details zum Schutz Ihrer persönlichen Daten und Ihren DSGVO-Rechten.",
            "button": "PDF herunterladen"
        },
        "security": {
            "title": "Zertifizierte & Gesicherte Dokumente",
            "message": "\"Alle von diesem Bereich generierten Dokumente sind elektronisch geschützt und von AGM INVEST als konform zertifiziert. Sie haben rechtlichen Wert für Ihre Vorgänge.\""
        }
    },
    "nl": {
        "title": "Mijn Documenten",
        "subtitle": "Bekijk en download uw contractuele documenten, attesten en gecertificeerde garanties.",
        "empty": {
            "title": "Geen documenten beschikbaar",
            "message": "Uw officiële documenten worden automatisch gegenereerd zodra uw financiering is geactiveerd."
        },
        "contract": {
            "title": "Leningsovereenkomst",
            "description": "Uw volledig contract inclusief het aflossingsschema, algemene voorwaarden en wettelijke vermeldingen.",
            "button": "PDF downloaden"
        },
        "insurance": {
            "title": "Verzekering",
            "description": "Lidmaatschapscertificaat voor de AGM INVEST kredietnemersverzekering die uw project voor 100% dekt.",
            "button": "Certificaat downloaden"
        },
        "privacy": {
            "title": "Privacy",
            "description": "Document met details over de bescherming van uw persoonlijke gegevens en uw AVG-rechten.",
            "button": "PDF downloaden"
        },
        "security": {
            "title": "Gecertificeerde & Beveiligde Documenten",
            "message": "\"Alle vanuit deze ruimte gegenereerde documenten zijn elektronisch beschermd en door AGM INVEST gecertificeerd als conform. Ze hebben juridische waarde voor uw procedures.\""
        }
    },
    "pl": {
        "title": "Moje Dokumenty",
        "subtitle": "Przeglądaj i pobieraj swoje dokumenty umowne, zaświadczenia i certyfikowane gwarancje.",
        "empty": {
            "title": "Brak dostępnych dokumentów",
            "message": "Twoje oficjalne dokumenty zostaną wygenerowane automatycznie po aktywacji finansowania."
        },
        "contract": {
            "title": "Umowa Pożyczki",
            "description": "Twoja pełna umowa zawierająca harmonogram spłat, ogólne warunki i noty prawne.",
            "button": "Pobierz PDF"
        },
        "insurance": {
            "title": "Ubezpieczenie",
            "description": "Certyfikat członkostwa w ubezpieczeniu pożyczkobiorcy AGM INVEST pokrywającym Twój projekt w 100%.",
            "button": "Pobierz Certyfikat"
        },
        "privacy": {
            "title": "Prywatność",
            "description": "Dokument szczegółowo opisujący ochronę Twoich danych osobowych i Twoje prawa RODO.",
            "button": "Pobierz PDF"
        },
        "security": {
            "title": "Certyfikowane i Bezpieczne Dokumenty",
            "message": "\"Wszystkie dokumenty wygenerowane z tej przestrzeni są chronione elektronicznie i certyfikowane przez AGM INVEST jako zgodne. Mają wartość prawną dla Twoich procedur.\""
        }
    },
    "pt": {
        "title": "Os Meus Documentos",
        "subtitle": "Consulte e descarregue os seus documentos contratuais, atestados e garantias certificadas.",
        "empty": {
            "title": "Nenhum documento disponível",
            "message": "Os seus documentos oficiais serão gerados automaticamente assim que o seu financiamento for ativado."
        },
        "contract": {
            "title": "Contrato de Empréstimo",
            "description": "O seu contrato completo incluindo o plano de reembolso, condições gerais e menções legais.",
            "button": "Descarregar PDF"
        },
        "insurance": {
            "title": "Seguro",
            "description": "Certificado de adesão ao seguro de mutuário AGM INVEST que cobre o seu projeto a 100%.",
            "button": "Descarregar Certificado"
        },
        "privacy": {
            "title": "Privacidade",
            "description": "Documento que detalha a proteção dos seus dados pessoais e os seus direitos RGPD.",
            "button": "Descarregar PDF"
        },
        "security": {
            "title": "Documentos Certificados e Seguros",
            "message": "\"Todos os documentos gerados a partir deste espaço são protegidos eletronicamente e certificados conformes pela AGM INVEST. Têm valor legal para os seus procedimentos.\""
        }
    },
    "ro": {
        "title": "Documentele Mele",
        "subtitle": "Consultați și descărcați documentele dvs. contractuale, atestele și garanțiile certificate.",
        "empty": {
            "title": "Niciun document disponibil",
            "message": "Documentele dvs. oficiale vor fi generate automat odată ce finanțarea dvs. va fi activată."
        },
        "contract": {
            "title": "Contract de Împrumut",
            "description": "Contractul dvs. complet incluzând graficul de rambursare, condițiile generale și mențiunile legale.",
            "button": "Descarcă PDF"
        },
        "insurance": {
            "title": "Asigurare",
            "description": "Certificat de aderare la asigurarea împrumutătorului AGM INVEST care acoperă proiectul dvs. 100%.",
            "button": "Descarcă Certificatul"
        },
        "privacy": {
            "title": "Confidențialitate",
            "description": "Document care detaliază protecția datelor personale și drepturile dvs. RGPD.",
            "button": "Descarcă PDF"
        },
        "security": {
            "title": "Documente Certificate și Securizate",
            "message": "\"Toate documentele generate din acest spațiu sunt protejate electronic și certificate conforme de AGM INVEST. Au valoare legală pentru procedurile dvs.\""
        }
    },
    "sv": {
        "title": "Mina Dokument",
        "subtitle": "Se och ladda ner dina avtalsdokument, intyg och certifierade garantier.",
        "empty": {
            "title": "Inga dokument tillgängliga",
            "message": "Dina officiella dokument genereras automatiskt när din finansiering är aktiverad."
        },
        "contract": {
            "title": "Låneavtal",
            "description": "Ditt fullständiga avtal inklusive amorteringsplan, allmänna villkor och rättsliga uppgifter.",
            "button": "Ladda ner PDF"
        },
        "insurance": {
            "title": "Försäkring",
            "description": "Medlemscertifikat för AGM INVEST låntagarförsäkring som täcker ditt projekt till 100%.",
            "button": "Ladda ner Certifikat"
        },
        "privacy": {
            "title": "Integritet",
            "description": "Dokument som beskriver skyddet av dina personuppgifter och dina GDPR-rättigheter.",
            "button": "Ladda ner PDF"
        },
        "security": {
            "title": "Certifierade och Säkra Dokument",
            "message": "\"Alla dokument som genereras från detta utrymme är elektroniskt skyddade och certifierade som konforme av AGM INVEST. De har juridiskt värde för dina ärenden.\""
        }
    }
}

def deep_merge(source, target):
    for key, value in source.items():
        if isinstance(value, dict):
            node = target.setdefault(key, {})
            deep_merge(value, node)
        else:
            target[key] = value

for lang, data in translations.items():
    path = os.path.join(base_dir, f"{lang}.json")
    if not os.path.exists(path):
        print(f"SKIP {lang} - file not found")
        continue
    with open(path, "r", encoding="utf-8") as f:
        lang_data = json.load(f)

    # Navigate to Dashboard.Documents
    dash = lang_data.setdefault("Dashboard", {})
    docs = dash.setdefault("Documents", {})
    deep_merge(data, docs)

    with open(path, "w", encoding="utf-8") as f:
        json.dump(lang_data, f, ensure_ascii=False, indent=2)
    print(f"OK {lang}")

print("All done!")
