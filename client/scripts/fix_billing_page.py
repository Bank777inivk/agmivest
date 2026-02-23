import json, os

base_dir = r"c:\Users\tesla\Videos\Nouvelle aventure\pret\client\messages"

translations = {
    "fr": {
        "title": "Facturation",
        "subtitle": "Gérez vos paiements et vos dépôts sécurisés.",
        "errors": {"accessDenied": "Accès refusé"},
        "paymentTypes": {
            "frais_dossier": "Frais de Dossier",
            "assurance": "Assurance",
            "frais_notaire": "Frais de Notaire",
            "authentication_deposit": "Dépôt d'Authentification",
            "none": "Aucun"
        },
        "empty": {
            "title": "Aucune facturation en attente",
            "message": "Votre compte est à jour. Aucune action de paiement n'est requise pour le moment.",
            "dashboardButton": "Tableau de Bord"
        },
        "policy": {
            "badge": "Charte Zéro Frais",
            "title": "Politique de Transparence",
            "noHiddenFees": {"text": "AGM INVEST n'applique", "highlight": "aucun frais caché"},
            "depositExplanation": {
                "text1": "Ce virement de",
                "text2": "correspond à un",
                "text3": "de votre compte bancaire."
            },
            "important": {
                "label": "Important :",
                "text1": "Ce n'est pas un frais de dossier. Ce montant est",
                "highlight": "crédité à 100%",
                "text2": "sur votre solde client et servira à l'activation de votre financement."
            }
        },
        "deposit": {
            "label": "Montant du Dépôt",
            "credited": "Crédité à 100%"
        },
        "sepa": {
            "title": "Sécurité SEPA",
            "description": "Virement instantané sécurisé vers notre partenaire européen."
        },
        "rib": {
            "title": "Coordonnées",
            "subtitle": "Virement du Dépôt",
            "secureTransfer": "Transfert Sécurisé",
            "copied": "Copié !",
            "confidentialNote": "Ce transfert est strictement confidentiel. Votre conseiller recevra une notification automatique lors de la réception des fonds par notre banque partenaire.",
            "fields": {
                "beneficiary": "Bénéficiaire",
                "bank": "Établissement",
                "iban": "Code IBAN",
                "bic": "Code BIC (SWIFT)"
            }
        },
        "backLater": "Revenir plus tard"
    },
    "en": {
        "title": "Billing",
        "subtitle": "Manage your payments and secure deposits.",
        "errors": {"accessDenied": "Access denied"},
        "paymentTypes": {
            "frais_dossier": "File Fees",
            "assurance": "Insurance",
            "frais_notaire": "Notary Fees",
            "authentication_deposit": "Authentication Deposit",
            "none": "None"
        },
        "empty": {
            "title": "No pending billing",
            "message": "Your account is up to date. No payment action is required at this time.",
            "dashboardButton": "Dashboard"
        },
        "policy": {
            "badge": "Zero Fees Charter",
            "title": "Transparency Policy",
            "noHiddenFees": {"text": "AGM INVEST applies", "highlight": "no hidden fees"},
            "depositExplanation": {
                "text1": "This transfer of",
                "text2": "corresponds to an",
                "text3": "from your bank account."
            },
            "important": {
                "label": "Important:",
                "text1": "This is not a file fee. This amount is",
                "highlight": "100% credited",
                "text2": "to your client balance and will be used to activate your financing."
            }
        },
        "deposit": {
            "label": "Deposit Amount",
            "credited": "100% Credited"
        },
        "sepa": {
            "title": "SEPA Security",
            "description": "Secure instant transfer to our European partner."
        },
        "rib": {
            "title": "Bank Details",
            "subtitle": "Deposit Transfer",
            "secureTransfer": "Secure Transfer",
            "copied": "Copied!",
            "confidentialNote": "This transfer is strictly confidential. Your advisor will receive an automatic notification when the funds are received by our partner bank.",
            "fields": {
                "beneficiary": "Beneficiary",
                "bank": "Financial Institution",
                "iban": "IBAN Code",
                "bic": "BIC Code (SWIFT)"
            }
        },
        "backLater": "Come back later"
    },
    "es": {
        "title": "Facturación",
        "subtitle": "Gestione sus pagos y depósitos seguros.",
        "errors": {"accessDenied": "Acceso denegado"},
        "paymentTypes": {
            "frais_dossier": "Gastos de Expediente",
            "assurance": "Seguro",
            "frais_notaire": "Gastos de Notaría",
            "authentication_deposit": "Depósito de Autenticación",
            "none": "Ninguno"
        },
        "empty": {
            "title": "Sin facturación pendiente",
            "message": "Su cuenta está al día. No se requiere ninguna acción de pago en este momento.",
            "dashboardButton": "Panel de Control"
        },
        "policy": {
            "badge": "Carta Cero Gastos",
            "title": "Política de Transparencia",
            "noHiddenFees": {"text": "AGM INVEST no aplica", "highlight": "ningún cargo oculto"},
            "depositExplanation": {
                "text1": "Esta transferencia de",
                "text2": "corresponde a un",
                "text3": "de su cuenta bancaria."
            },
            "important": {
                "label": "Importante:",
                "text1": "No es un gasto de expediente. Este importe está",
                "highlight": "acreditado al 100%",
                "text2": "en su saldo de cliente y servirá para la activación de su financiación."
            }
        },
        "deposit": {
            "label": "Importe del Depósito",
            "credited": "Acreditado al 100%"
        },
        "sepa": {
            "title": "Seguridad SEPA",
            "description": "Transferencia instantánea segura a nuestro socio europeo."
        },
        "rib": {
            "title": "Datos Bancarios",
            "subtitle": "Transferencia del Depósito",
            "secureTransfer": "Transferencia Segura",
            "copied": "¡Copiado!",
            "confidentialNote": "Esta transferencia es estrictamente confidencial. Su asesor recibirá una notificación automática cuando los fondos sean recibidos por nuestro banco asociado.",
            "fields": {
                "beneficiary": "Beneficiario",
                "bank": "Entidad",
                "iban": "Código IBAN",
                "bic": "Código BIC (SWIFT)"
            }
        },
        "backLater": "Volver más tarde"
    },
    "it": {
        "title": "Fatturazione",
        "subtitle": "Gestisca i suoi pagamenti e i depositi sicuri.",
        "errors": {"accessDenied": "Accesso negato"},
        "paymentTypes": {
            "frais_dossier": "Spese di Pratica",
            "assurance": "Assicurazione",
            "frais_notaire": "Spese Notarili",
            "authentication_deposit": "Deposito di Autenticazione",
            "none": "Nessuno"
        },
        "empty": {
            "title": "Nessuna fatturazione in sospeso",
            "message": "Il suo account è aggiornato. Non è richiesta alcuna azione di pagamento al momento.",
            "dashboardButton": "Dashboard"
        },
        "policy": {
            "badge": "Carta Zero Spese",
            "title": "Politica di Trasparenza",
            "noHiddenFees": {"text": "AGM INVEST non applica", "highlight": "nessuna spesa nascosta"},
            "depositExplanation": {
                "text1": "Questo bonifico di",
                "text2": "corrisponde a un",
                "text3": "dal suo conto bancario."
            },
            "important": {
                "label": "Importante:",
                "text1": "Non si tratta di una spesa di pratica. Questo importo viene",
                "highlight": "accreditato al 100%",
                "text2": "sul suo saldo cliente e servirà per l'attivazione del suo finanziamento."
            }
        },
        "deposit": {
            "label": "Importo del Deposito",
            "credited": "Accreditato al 100%"
        },
        "sepa": {
            "title": "Sicurezza SEPA",
            "description": "Bonifico istantaneo sicuro verso il nostro partner europeo."
        },
        "rib": {
            "title": "Coordinate Bancarie",
            "subtitle": "Bonifico del Deposito",
            "secureTransfer": "Trasferimento Sicuro",
            "copied": "Copiato!",
            "confidentialNote": "Questo trasferimento è strettamente confidenziale. Il suo consulente riceverà una notifica automatica quando i fondi saranno ricevuti dalla nostra banca partner.",
            "fields": {
                "beneficiary": "Beneficiario",
                "bank": "Istituto",
                "iban": "Codice IBAN",
                "bic": "Codice BIC (SWIFT)"
            }
        },
        "backLater": "Tornare più tardi"
    },
    "de": {
        "title": "Abrechnung",
        "subtitle": "Verwalten Sie Ihre Zahlungen und sicheren Einlagen.",
        "errors": {"accessDenied": "Zugriff verweigert"},
        "paymentTypes": {
            "frais_dossier": "Bearbeitungsgebühren",
            "assurance": "Versicherung",
            "frais_notaire": "Notarkosten",
            "authentication_deposit": "Authentifizierungseinlage",
            "none": "Keine"
        },
        "empty": {
            "title": "Keine ausstehende Abrechnung",
            "message": "Ihr Konto ist auf dem neuesten Stand. Derzeit ist keine Zahlungsaktion erforderlich.",
            "dashboardButton": "Dashboard"
        },
        "policy": {
            "badge": "Null-Gebühren-Charta",
            "title": "Transparenzrichtlinie",
            "noHiddenFees": {"text": "AGM INVEST erhebt", "highlight": "keine versteckten Gebühren"},
            "depositExplanation": {
                "text1": "Diese Überweisung von",
                "text2": "entspricht einer",
                "text3": "von Ihrem Bankkonto."
            },
            "important": {
                "label": "Wichtig:",
                "text1": "Dies ist keine Bearbeitungsgebühr. Dieser Betrag wird",
                "highlight": "zu 100% gutgeschrieben",
                "text2": "auf Ihrem Kundenguthaben und dient zur Aktivierung Ihrer Finanzierung."
            }
        },
        "deposit": {
            "label": "Einlagebetrag",
            "credited": "Zu 100% gutgeschrieben"
        },
        "sepa": {
            "title": "SEPA-Sicherheit",
            "description": "Gesicherte Sofortüberweisung an unseren europäischen Partner."
        },
        "rib": {
            "title": "Bankdaten",
            "subtitle": "Einlagenüberweisung",
            "secureTransfer": "Sichere Überweisung",
            "copied": "Kopiert!",
            "confidentialNote": "Diese Überweisung ist streng vertraulich. Ihr Berater erhält eine automatische Benachrichtigung, wenn die Gelder von unserer Partnerbank eingegangen sind.",
            "fields": {
                "beneficiary": "Empfänger",
                "bank": "Kreditinstitut",
                "iban": "IBAN-Code",
                "bic": "BIC-Code (SWIFT)"
            }
        },
        "backLater": "Später zurückkehren"
    },
    "nl": {
        "title": "Facturering",
        "subtitle": "Beheer uw betalingen en veilige stortingen.",
        "errors": {"accessDenied": "Toegang geweigerd"},
        "paymentTypes": {
            "frais_dossier": "Dossierkosten",
            "assurance": "Verzekering",
            "frais_notaire": "Notariskosten",
            "authentication_deposit": "Authenticatiestorting",
            "none": "Geen"
        },
        "empty": {
            "title": "Geen openstaande facturering",
            "message": "Uw account is up-to-date. Er is momenteel geen betalingsactie vereist.",
            "dashboardButton": "Dashboard"
        },
        "policy": {
            "badge": "Nul Kosten Handvest",
            "title": "Transparantiebeleid",
            "noHiddenFees": {"text": "AGM INVEST past", "highlight": "geen verborgen kosten toe"},
            "depositExplanation": {
                "text1": "Deze overschrijving van",
                "text2": "komt overeen met een",
                "text3": "van uw bankrekening."
            },
            "important": {
                "label": "Belangrijk:",
                "text1": "Dit zijn geen dossierkosten. Dit bedrag wordt",
                "highlight": "voor 100% gecrediteerd",
                "text2": "op uw clientsaldo en zal worden gebruikt voor de activering van uw financiering."
            }
        },
        "deposit": {
            "label": "Stortingsbedrag",
            "credited": "Voor 100% gecrediteerd"
        },
        "sepa": {
            "title": "SEPA-beveiliging",
            "description": "Beveiligde directe overschrijving naar onze Europese partner."
        },
        "rib": {
            "title": "Bankgegevens",
            "subtitle": "Stortingsoverschrijving",
            "secureTransfer": "Veilige Overschrijving",
            "copied": "Gekopieerd!",
            "confidentialNote": "Deze overschrijving is strikt vertrouwelijk. Uw adviseur ontvangt een automatische melding wanneer de fondsen door onze partnerbank worden ontvangen.",
            "fields": {
                "beneficiary": "Begunstigde",
                "bank": "Financiële instelling",
                "iban": "IBAN-code",
                "bic": "BIC-code (SWIFT)"
            }
        },
        "backLater": "Later terugkomen"
    },
    "pl": {
        "title": "Rozliczenia",
        "subtitle": "Zarządzaj swoimi płatnościami i bezpiecznymi depozytami.",
        "errors": {"accessDenied": "Dostęp zabroniony"},
        "paymentTypes": {
            "frais_dossier": "Opłaty za Wniosek",
            "assurance": "Ubezpieczenie",
            "frais_notaire": "Koszty Notarialne",
            "authentication_deposit": "Depozyt Uwierzytelnienia",
            "none": "Brak"
        },
        "empty": {
            "title": "Brak oczekujących rozliczeń",
            "message": "Twoje konto jest aktualne. Żadna płatność nie jest wymagana w tej chwili.",
            "dashboardButton": "Dashboard"
        },
        "policy": {
            "badge": "Karta Zero Opłat",
            "title": "Polityka Przejrzystości",
            "noHiddenFees": {"text": "AGM INVEST nie stosuje", "highlight": "żadnych ukrytych opłat"},
            "depositExplanation": {
                "text1": "Przelew w wysokości",
                "text2": "odpowiada",
                "text3": "z Twojego konta bankowego."
            },
            "important": {
                "label": "Ważne:",
                "text1": "To nie jest opłata za wniosek. Kwota ta jest",
                "highlight": "w 100% zapisana",
                "text2": "na saldzie Twojego konta klienta i posłuży do aktywacji finansowania."
            }
        },
        "deposit": {
            "label": "Kwota Depozytu",
            "credited": "Zapisana w 100%"
        },
        "sepa": {
            "title": "Bezpieczeństwo SEPA",
            "description": "Bezpieczny natychmiastowy przelew do naszego europejskiego partnera."
        },
        "rib": {
            "title": "Dane Bankowe",
            "subtitle": "Przelew Depozytu",
            "secureTransfer": "Bezpieczny Przelew",
            "copied": "Skopiowano!",
            "confidentialNote": "Przelew jest ściśle poufny. Twój doradca otrzyma automatyczne powiadomienie po otrzymaniu środków przez nasz bank partnerski.",
            "fields": {
                "beneficiary": "Odbiorca",
                "bank": "Instytucja",
                "iban": "Kod IBAN",
                "bic": "Kod BIC (SWIFT)"
            }
        },
        "backLater": "Wróć później"
    },
    "pt": {
        "title": "Faturação",
        "subtitle": "Gira os seus pagamentos e depósitos seguros.",
        "errors": {"accessDenied": "Acesso negado"},
        "paymentTypes": {
            "frais_dossier": "Custos de Processo",
            "assurance": "Seguro",
            "frais_notaire": "Custos de Notário",
            "authentication_deposit": "Depósito de Autenticação",
            "none": "Nenhum"
        },
        "empty": {
            "title": "Sem faturação pendente",
            "message": "A sua conta está atualizada. Não é necessária nenhuma ação de pagamento de momento.",
            "dashboardButton": "Dashboard"
        },
        "policy": {
            "badge": "Carta Taxas Zero",
            "title": "Política de Transparência",
            "noHiddenFees": {"text": "A AGM INVEST não aplica", "highlight": "nenhuma taxa oculta"},
            "depositExplanation": {
                "text1": "Esta transferência de",
                "text2": "corresponde a um",
                "text3": "da sua conta bancária."
            },
            "important": {
                "label": "Importante:",
                "text1": "Não se trata de custos de processo. Este valor é",
                "highlight": "creditado a 100%",
                "text2": "no seu saldo de cliente e servirá para a ativação do seu financiamento."
            }
        },
        "deposit": {
            "label": "Montante do Depósito",
            "credited": "Creditado a 100%"
        },
        "sepa": {
            "title": "Segurança SEPA",
            "description": "Transferência instantânea segura para o nosso parceiro europeu."
        },
        "rib": {
            "title": "Dados Bancários",
            "subtitle": "Transferência do Depósito",
            "secureTransfer": "Transferência Segura",
            "copied": "Copiado!",
            "confidentialNote": "Esta transferência é estritamente confidencial. O seu consultor receberá uma notificação automática quando os fundos forem recebidos pelo nosso banco parceiro.",
            "fields": {
                "beneficiary": "Beneficiário",
                "bank": "Instituição",
                "iban": "Código IBAN",
                "bic": "Código BIC (SWIFT)"
            }
        },
        "backLater": "Voltar mais tarde"
    },
    "ro": {
        "title": "Facturare",
        "subtitle": "Gestionați plățile și depozitele dvs. securizate.",
        "errors": {"accessDenied": "Acces refuzat"},
        "paymentTypes": {
            "frais_dossier": "Taxe de Dosar",
            "assurance": "Asigurare",
            "frais_notaire": "Taxe Notariale",
            "authentication_deposit": "Depozit de Autentificare",
            "none": "Niciunul"
        },
        "empty": {
            "title": "Nicio factură în așteptare",
            "message": "Contul dvs. este actualizat. Nu este necesară nicio acțiune de plată în acest moment.",
            "dashboardButton": "Dashboard"
        },
        "policy": {
            "badge": "Carta Zero Taxe",
            "title": "Politica de Transparență",
            "noHiddenFees": {"text": "AGM INVEST nu aplică", "highlight": "nicio taxă ascunsă"},
            "depositExplanation": {
                "text1": "Acest transfer de",
                "text2": "corespunde unui",
                "text3": "din contul dvs. bancar."
            },
            "important": {
                "label": "Important:",
                "text1": "Aceasta nu este o taxă de dosar. Această sumă este",
                "highlight": "creditată 100%",
                "text2": "în soldul dvs. de client și va fi utilizată pentru activarea finanțării."
            }
        },
        "deposit": {
            "label": "Suma Depozitului",
            "credited": "Creditată 100%"
        },
        "sepa": {
            "title": "Securitate SEPA",
            "description": "Transfer instantaneu securizat către partenerul nostru european."
        },
        "rib": {
            "title": "Date Bancare",
            "subtitle": "Transfer Depozit",
            "secureTransfer": "Transfer Sigur",
            "copied": "Copiat!",
            "confidentialNote": "Acest transfer este strict confidențial. Consilierul dvs. va primi o notificare automată când fondurile sunt primite de banca noastră parteneră.",
            "fields": {
                "beneficiary": "Beneficiar",
                "bank": "Instituție",
                "iban": "Cod IBAN",
                "bic": "Cod BIC (SWIFT)"
            }
        },
        "backLater": "Reveniți mai târziu"
    },
    "sv": {
        "title": "Fakturering",
        "subtitle": "Hantera dina betalningar och säkra insättningar.",
        "errors": {"accessDenied": "Åtkomst nekad"},
        "paymentTypes": {
            "frais_dossier": "Handläggningsavgifter",
            "assurance": "Försäkring",
            "frais_notaire": "Notariekostnader",
            "authentication_deposit": "Autentiseringsinsättning",
            "none": "Ingen"
        },
        "empty": {
            "title": "Ingen väntande fakturering",
            "message": "Ditt konto är uppdaterat. Ingen betalningsåtgärd krävs för tillfället.",
            "dashboardButton": "Dashboard"
        },
        "policy": {
            "badge": "Noll-avgiftsstadga",
            "title": "Transparenspolicy",
            "noHiddenFees": {"text": "AGM INVEST tillämpar", "highlight": "inga dolda avgifter"},
            "depositExplanation": {
                "text1": "Denna överföring på",
                "text2": "motsvarar en",
                "text3": "från ditt bankkonto."
            },
            "important": {
                "label": "Viktigt:",
                "text1": "Detta är inte en handläggningsavgift. Beloppet",
                "highlight": "krediteras till 100%",
                "text2": "på ditt kundsaldo och kommer att användas för att aktivera din finansiering."
            }
        },
        "deposit": {
            "label": "Insättningsbelopp",
            "credited": "Krediterad till 100%"
        },
        "sepa": {
            "title": "SEPA-säkerhet",
            "description": "Säker direktöverföring till vår europeiska partner."
        },
        "rib": {
            "title": "Bankuppgifter",
            "subtitle": "Insättningsöverföring",
            "secureTransfer": "Säker Överföring",
            "copied": "Kopierat!",
            "confidentialNote": "Denna överföring är strikt konfidentiell. Din rådgivare får ett automatiskt meddelande när pengarna tagits emot av vår partnerbank.",
            "fields": {
                "beneficiary": "Mottagare",
                "bank": "Finansiellt institut",
                "iban": "IBAN-kod",
                "bic": "BIC-kod (SWIFT)"
            }
        },
        "backLater": "Återkom senare"
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
        print(f"SKIP {lang}")
        continue
    with open(path, "r", encoding="utf-8") as f:
        lang_data = json.load(f)

    billing = lang_data.setdefault("Dashboard", {}).setdefault("Billing", {})
    deep_merge(data, billing)

    with open(path, "w", encoding="utf-8") as f:
        json.dump(lang_data, f, ensure_ascii=False, indent=2)
    print(f"OK {lang}")

print("All done!")
