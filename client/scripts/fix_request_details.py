import json
import os

base_dir = r"c:\Users\tesla\Videos\Nouvelle aventure\pret\client\messages"

# Namespace complet Dashboard.Requests.Details dans chaque langue
translations = {
    "fr": {
        "header": {
            "back": "Retour",
            "amountLabel": "Montant demandé"
        },
        "status": {
            "pending": "En attente",
            "approved": "Approuvé",
            "rejected": "Refusé",
            "processing": "En cours d'analyse"
        },
        "progression": "PROGRESSION DU DOSSIER",
        "info": {
            "duration": "Durée",
            "monthlyPayment": "Mensualité",
            "rate": "Taux",
            "creationDate": "Date de création"
        },
        "timeline": {
            "step1": {
                "title": "DOSSIER REÇU",
                "desc": "Votre demande a bien été reçue. Notre équipe va l'étudier."
            },
            "step2": {
                "title": "ANALYSE EN COURS",
                "desc": "Nos conseillers experts analysent votre dossier en détail."
            },
            "step3": {
                "title": "VÉRIFICATION FINALE",
                "desc": "Vérification finale de tous les éléments de votre dossier."
            },
            "step4": {
                "approved": {
                    "title": "DOSSIER APPROUVÉ",
                    "desc": "Félicitations ! Votre financement a été approuvé."
                },
                "rejected": {
                    "title": "DOSSIER REFUSÉ",
                    "desc": "Votre dossier n'a pas été retenu. Contactez notre support."
                },
                "pending": "En attente de la décision finale..."
            }
        },
        "declaration": {
            "title": "DÉCLARATION FINANCIÈRE",
            "situation": "Situation professionnelle",
            "income": "Revenus mensuels",
            "expenses": "Charges mensuelles",
            "security": "Données cryptées et sécurisées - AES-256"
        },
        "advisor": {
            "title": "Votre conseiller",
            "contact": "Contacter mon conseiller"
        },
        "nextStep": {
            "title": "PROCHAINE ÉTAPE",
            "pending": "Votre dossier est en cours d'examen. Nous vous contacterons sous 24-48h.",
            "processing": "Notre équipe finalise l'analyse. Vous serez contacté très prochainement.",
            "finished": "Votre dossier a été traité. Consultez le statut ci-dessus.",
            "estimateLabel": "Délai estimé",
            "estimateValue": "24 à 48 heures"
        },
        "banners": {
            "approved": {
                "title": "VOTRE FINANCEMENT EST APPROUVÉ",
                "message": "Nous avons besoin de vérifier votre identité avant de procéder au déblocage des fonds.",
                "action": "Compléter la vérification d'identité"
            },
            "actionRequired": {
                "title": "ACTION REQUISE",
                "message": "Votre dossier a été approuvé. Une action est requise pour finaliser votre financement.",
                "action": "Effectuer mon règlement"
            }
        }
    },
    "en": {
        "header": {
            "back": "Back",
            "amountLabel": "Requested Amount"
        },
        "status": {
            "pending": "Pending",
            "approved": "Approved",
            "rejected": "Rejected",
            "processing": "Being Analyzed"
        },
        "progression": "FILE PROGRESS",
        "info": {
            "duration": "Duration",
            "monthlyPayment": "Monthly Payment",
            "rate": "Rate",
            "creationDate": "Creation Date"
        },
        "timeline": {
            "step1": {
                "title": "FILE RECEIVED",
                "desc": "Your application has been received. Our team will review it."
            },
            "step2": {
                "title": "ANALYSIS IN PROGRESS",
                "desc": "Our expert advisors are analyzing your file in detail."
            },
            "step3": {
                "title": "FINAL VERIFICATION",
                "desc": "Final verification of all elements of your file."
            },
            "step4": {
                "approved": {
                    "title": "FILE APPROVED",
                    "desc": "Congratulations! Your financing has been approved."
                },
                "rejected": {
                    "title": "FILE REJECTED",
                    "desc": "Your application was not accepted. Please contact our support."
                },
                "pending": "Awaiting final decision..."
            }
        },
        "declaration": {
            "title": "FINANCIAL DECLARATION",
            "situation": "Professional situation",
            "income": "Monthly income",
            "expenses": "Monthly expenses",
            "security": "Encrypted and secured data - AES-256"
        },
        "advisor": {
            "title": "Your advisor",
            "contact": "Contact my advisor"
        },
        "nextStep": {
            "title": "NEXT STEP",
            "pending": "Your file is under review. We will contact you within 24-48 hours.",
            "processing": "Our team is finalizing the analysis. You will be contacted very soon.",
            "finished": "Your file has been processed. Check the status above.",
            "estimateLabel": "Estimated time",
            "estimateValue": "24 to 48 hours"
        },
        "banners": {
            "approved": {
                "title": "YOUR FINANCING IS APPROVED",
                "message": "We need to verify your identity before releasing the funds.",
                "action": "Complete identity verification"
            },
            "actionRequired": {
                "title": "ACTION REQUIRED",
                "message": "Your file has been approved. An action is required to finalize your financing.",
                "action": "Make my payment"
            }
        }
    },
    "es": {
        "header": {
            "back": "Volver",
            "amountLabel": "Importe solicitado"
        },
        "status": {
            "pending": "Pendiente",
            "approved": "Aprobado",
            "rejected": "Rechazado",
            "processing": "En análisis"
        },
        "progression": "PROGRESO DEL EXPEDIENTE",
        "info": {
            "duration": "Duración",
            "monthlyPayment": "Cuota mensual",
            "rate": "Tipo",
            "creationDate": "Fecha de creación"
        },
        "timeline": {
            "step1": {
                "title": "SOLICITUD RECIBIDA",
                "desc": "Su solicitud ha sido recibida. Nuestro equipo la estudiará."
            },
            "step2": {
                "title": "ANÁLISIS EN CURSO",
                "desc": "Nuestros asesores expertos analizan su expediente detalladamente."
            },
            "step3": {
                "title": "VERIFICACIÓN FINAL",
                "desc": "Verificación final de todos los elementos de su expediente."
            },
            "step4": {
                "approved": {
                    "title": "EXPEDIENTE APROBADO",
                    "desc": "¡Felicitaciones! Su financiación ha sido aprobada."
                },
                "rejected": {
                    "title": "EXPEDIENTE RECHAZADO",
                    "desc": "Su solicitud no fue aceptada. Contacte con nuestro soporte."
                },
                "pending": "A la espera de la decisión final..."
            }
        },
        "declaration": {
            "title": "DECLARACIÓN FINANCIERA",
            "situation": "Situación profesional",
            "income": "Ingresos mensuales",
            "expenses": "Gastos mensuales",
            "security": "Datos cifrados y seguros - AES-256"
        },
        "advisor": {
            "title": "Su asesor",
            "contact": "Contactar a mi asesor"
        },
        "nextStep": {
            "title": "PRÓXIMO PASO",
            "pending": "Su expediente está siendo analizado. Le contactaremos en 24-48h.",
            "processing": "Nuestro equipo finaliza el análisis. Le contactaremos muy pronto.",
            "finished": "Su expediente ha sido procesado. Consulte el estado arriba.",
            "estimateLabel": "Plazo estimado",
            "estimateValue": "24 a 48 horas"
        },
        "banners": {
            "approved": {
                "title": "SU FINANCIACIÓN ESTÁ APROBADA",
                "message": "Necesitamos verificar su identidad antes de liberar los fondos.",
                "action": "Completar la verificación de identidad"
            },
            "actionRequired": {
                "title": "ACCIÓN REQUERIDA",
                "message": "Su expediente ha sido aprobado. Se requiere una acción para finalizar su financiación.",
                "action": "Realizar mi pago"
            }
        }
    },
    "it": {
        "header": {
            "back": "Indietro",
            "amountLabel": "Importo richiesto"
        },
        "status": {
            "pending": "In attesa",
            "approved": "Approvato",
            "rejected": "Rifiutato",
            "processing": "In analisi"
        },
        "progression": "AVANZAMENTO PRATICA",
        "info": {
            "duration": "Durata",
            "monthlyPayment": "Rata mensile",
            "rate": "Tasso",
            "creationDate": "Data di creazione"
        },
        "timeline": {
            "step1": {
                "title": "PRATICA RICEVUTA",
                "desc": "La sua richiesta è stata ricevuta. Il nostro team la esaminerà."
            },
            "step2": {
                "title": "ANALISI IN CORSO",
                "desc": "I nostri consulenti esperti analizzano la sua pratica in dettaglio."
            },
            "step3": {
                "title": "VERIFICA FINALE",
                "desc": "Verifica finale di tutti gli elementi della sua pratica."
            },
            "step4": {
                "approved": {
                    "title": "PRATICA APPROVATA",
                    "desc": "Congratulazioni! Il suo finanziamento è stato approvato."
                },
                "rejected": {
                    "title": "PRATICA RIFIUTATA",
                    "desc": "La sua richiesta non è stata accettata. Contatti il nostro supporto."
                },
                "pending": "In attesa della decisione finale..."
            }
        },
        "declaration": {
            "title": "DICHIARAZIONE FINANZIARIA",
            "situation": "Situazione professionale",
            "income": "Reddito mensile",
            "expenses": "Spese mensili",
            "security": "Dati crittografati e sicuri - AES-256"
        },
        "advisor": {
            "title": "Il suo consulente",
            "contact": "Contattare il mio consulente"
        },
        "nextStep": {
            "title": "PROSSIMO PASSO",
            "pending": "La sua pratica è in esame. La contatteremo entro 24-48 ore.",
            "processing": "Il nostro team finalizza l'analisi. Sarà contattato molto presto.",
            "finished": "La sua pratica è stata trattata. Verifichi lo stato sopra.",
            "estimateLabel": "Tempo stimato",
            "estimateValue": "24 a 48 ore"
        },
        "banners": {
            "approved": {
                "title": "IL SUO FINANZIAMENTO È APPROVATO",
                "message": "Dobbiamo verificare la sua identità prima di erogare i fondi.",
                "action": "Completare la verifica dell'identità"
            },
            "actionRequired": {
                "title": "AZIONE RICHIESTA",
                "message": "La sua pratica è stata approvata. È richiesta un'azione per finalizzare il finanziamento.",
                "action": "Effettuare il mio pagamento"
            }
        }
    },
    "de": {
        "header": {
            "back": "Zurück",
            "amountLabel": "Beantragte Summe"
        },
        "status": {
            "pending": "Ausstehend",
            "approved": "Genehmigt",
            "rejected": "Abgelehnt",
            "processing": "Wird analysiert"
        },
        "progression": "FORTSCHRITT DES ANTRAGS",
        "info": {
            "duration": "Laufzeit",
            "monthlyPayment": "Monatsrate",
            "rate": "Zinssatz",
            "creationDate": "Erstellungsdatum"
        },
        "timeline": {
            "step1": {
                "title": "ANTRAG ERHALTEN",
                "desc": "Ihr Antrag ist eingegangen. Unser Team wird ihn prüfen."
            },
            "step2": {
                "title": "ANALYSE LÄUFT",
                "desc": "Unsere Berater analysieren Ihren Antrag im Detail."
            },
            "step3": {
                "title": "ABSCHLUSSPRÜFUNG",
                "desc": "Abschließende Überprüfung aller Elemente Ihres Antrags."
            },
            "step4": {
                "approved": {
                    "title": "ANTRAG GENEHMIGT",
                    "desc": "Herzlichen Glückwunsch! Ihre Finanzierung wurde genehmigt."
                },
                "rejected": {
                    "title": "ANTRAG ABGELEHNT",
                    "desc": "Ihr Antrag wurde nicht angenommen. Bitte wenden Sie sich an unseren Support."
                },
                "pending": "Warte auf die endgültige Entscheidung..."
            }
        },
        "declaration": {
            "title": "FINANZIELLE ERKLÄRUNG",
            "situation": "Berufliche Situation",
            "income": "Monatliches Einkommen",
            "expenses": "Monatliche Ausgaben",
            "security": "Verschlüsselte und gesicherte Daten - AES-256"
        },
        "advisor": {
            "title": "Ihr Berater",
            "contact": "Meinen Berater kontaktieren"
        },
        "nextStep": {
            "title": "NÄCHSTER SCHRITT",
            "pending": "Ihr Antrag wird geprüft. Wir melden uns innerhalb von 24-48 Stunden.",
            "processing": "Unser Team schließt die Analyse ab. Sie werden sehr bald kontaktiert.",
            "finished": "Ihr Antrag wurde bearbeitet. Überprüfen Sie den Status oben.",
            "estimateLabel": "Geschätzte Zeit",
            "estimateValue": "24 bis 48 Stunden"
        },
        "banners": {
            "approved": {
                "title": "IHRE FINANZIERUNG WURDE GENEHMIGT",
                "message": "Wir müssen Ihre Identität verifizieren, bevor wir die Mittel freigeben.",
                "action": "Identitätsverifizierung abschließen"
            },
            "actionRequired": {
                "title": "AKTION ERFORDERLICH",
                "message": "Ihr Antrag wurde genehmigt. Eine Aktion ist erforderlich, um Ihre Finanzierung abzuschließen.",
                "action": "Meine Zahlung vornehmen"
            }
        }
    },
    "nl": {
        "header": {
            "back": "Terug",
            "amountLabel": "Aangevraagd bedrag"
        },
        "status": {
            "pending": "In behandeling",
            "approved": "Goedgekeurd",
            "rejected": "Afgewezen",
            "processing": "Wordt geanalyseerd"
        },
        "progression": "VOORTGANG VAN HET DOSSIER",
        "info": {
            "duration": "Looptijd",
            "monthlyPayment": "Maandelijkse betaling",
            "rate": "Rente",
            "creationDate": "Aanmaakdatum"
        },
        "timeline": {
            "step1": {
                "title": "DOSSIER ONTVANGEN",
                "desc": "Uw aanvraag is ontvangen. Ons team zal deze bestuderen."
            },
            "step2": {
                "title": "ANALYSE BEZIG",
                "desc": "Onze deskundige adviseurs analyseren uw dossier in detail."
            },
            "step3": {
                "title": "EINDVERIFICATIE",
                "desc": "Eindverificatie van alle elementen van uw dossier."
            },
            "step4": {
                "approved": {
                    "title": "DOSSIER GOEDGEKEURD",
                    "desc": "Gefeliciteerd! Uw financiering is goedgekeurd."
                },
                "rejected": {
                    "title": "DOSSIER AFGEWEZEN",
                    "desc": "Uw aanvraag is niet aanvaard. Neem contact op met onze support."
                },
                "pending": "Wachten op de definitieve beslissing..."
            }
        },
        "declaration": {
            "title": "FINANCIËLE VERKLARING",
            "situation": "Professionele situatie",
            "income": "Maandelijks inkomen",
            "expenses": "Maandelijkse uitgaven",
            "security": "Versleutelde en beveiligde gegevens - AES-256"
        },
        "advisor": {
            "title": "Uw adviseur",
            "contact": "Contact opnemen met mijn adviseur"
        },
        "nextStep": {
            "title": "VOLGENDE STAP",
            "pending": "Uw dossier wordt geanalyseerd. We nemen binnen 24-48 uur contact met u op.",
            "processing": "Ons team rondt de analyse af. U wordt zeer binnenkort gecontacteerd.",
            "finished": "Uw dossier is behandeld. Controleer de status hierboven.",
            "estimateLabel": "Geschatte tijd",
            "estimateValue": "24 tot 48 uur"
        },
        "banners": {
            "approved": {
                "title": "UW FINANCIERING IS GOEDGEKEURD",
                "message": "We moeten uw identiteit verifiëren voordat we de fondsen vrijgeven.",
                "action": "Identiteitsverificatie voltooien"
            },
            "actionRequired": {
                "title": "ACTIE VEREIST",
                "message": "Uw dossier is goedgekeurd. Een actie is vereist om uw financiering te voltooien.",
                "action": "Mijn betaling uitvoeren"
            }
        }
    },
    "pl": {
        "header": {
            "back": "Wstecz",
            "amountLabel": "Wnioskowana kwota"
        },
        "status": {
            "pending": "Oczekujące",
            "approved": "Zatwierdzone",
            "rejected": "Odrzucone",
            "processing": "W trakcie analizy"
        },
        "progression": "POSTĘP WNIOSKU",
        "info": {
            "duration": "Okres",
            "monthlyPayment": "Rata miesięczna",
            "rate": "Stopa",
            "creationDate": "Data złożenia"
        },
        "timeline": {
            "step1": {
                "title": "WNIOSEK OTRZYMANY",
                "desc": "Twój wniosek został otrzymany. Nasz zespół go przeanalizuje."
            },
            "step2": {
                "title": "ANALIZA W TOKU",
                "desc": "Nasi eksperci analizują Twój wniosek szczegółowo."
            },
            "step3": {
                "title": "WERYFIKACJA KOŃCOWA",
                "desc": "Ostateczna weryfikacja wszystkich elementów Twojego wniosku."
            },
            "step4": {
                "approved": {
                    "title": "WNIOSEK ZATWIERDZONY",
                    "desc": "Gratulacje! Twoje finansowanie zostało zatwierdzone."
                },
                "rejected": {
                    "title": "WNIOSEK ODRZUCONY",
                    "desc": "Twój wniosek nie został przyjęty. Skontaktuj się z naszym wsparciem."
                },
                "pending": "Oczekiwanie na ostateczną decyzję..."
            }
        },
        "declaration": {
            "title": "DEKLARACJA FINANSOWA",
            "situation": "Sytuacja zawodowa",
            "income": "Miesięczne dochody",
            "expenses": "Miesięczne wydatki",
            "security": "Zaszyfrowane i zabezpieczone dane - AES-256"
        },
        "advisor": {
            "title": "Twój doradca",
            "contact": "Skontaktuj się z doradcą"
        },
        "nextStep": {
            "title": "NASTĘPNY KROK",
            "pending": "Twój wniosek jest analizowany. Skontaktujemy się z Tobą w ciągu 24-48 godzin.",
            "processing": "Nasz zespół finalizuje analizę. Wkrótce zostaniesz poinformowany.",
            "finished": "Twój wniosek został rozpatrzony. Sprawdź status powyżej.",
            "estimateLabel": "Szacowany czas",
            "estimateValue": "24 do 48 godzin"
        },
        "banners": {
            "approved": {
                "title": "TWOJE FINANSOWANIE ZOSTAŁO ZATWIERDZONE",
                "message": "Musimy zweryfikować Twoją tożsamość przed uruchomieniem środków.",
                "action": "Zakończ weryfikację tożsamości"
            },
            "actionRequired": {
                "title": "WYMAGANA AKCJA",
                "message": "Twój wniosek został zatwierdzony. Wymagana jest akcja, aby sfinalizować finansowanie.",
                "action": "Dokonaj płatności"
            }
        }
    },
    "pt": {
        "header": {
            "back": "Voltar",
            "amountLabel": "Montante solicitado"
        },
        "status": {
            "pending": "Pendente",
            "approved": "Aprovado",
            "rejected": "Rejeitado",
            "processing": "Em análise"
        },
        "progression": "PROGRESSO DO PROCESSO",
        "info": {
            "duration": "Duração",
            "monthlyPayment": "Prestação mensal",
            "rate": "Taxa",
            "creationDate": "Data de criação"
        },
        "timeline": {
            "step1": {
                "title": "PROCESSO RECEBIDO",
                "desc": "O seu pedido foi recebido. A nossa equipa irá analisá-lo."
            },
            "step2": {
                "title": "ANÁLISE EM CURSO",
                "desc": "Os nossos consultores especialistas analisam o seu processo em detalhe."
            },
            "step3": {
                "title": "VERIFICAÇÃO FINAL",
                "desc": "Verificação final de todos os elementos do seu processo."
            },
            "step4": {
                "approved": {
                    "title": "PROCESSO APROVADO",
                    "desc": "Parabéns! O seu financiamento foi aprovado."
                },
                "rejected": {
                    "title": "PROCESSO REJEITADO",
                    "desc": "O seu pedido não foi aceite. Contacte o nosso suporte."
                },
                "pending": "Aguardando decisão final..."
            }
        },
        "declaration": {
            "title": "DECLARAÇÃO FINANCEIRA",
            "situation": "Situação profissional",
            "income": "Rendimento mensal",
            "expenses": "Despesas mensais",
            "security": "Dados encriptados e seguros - AES-256"
        },
        "advisor": {
            "title": "O seu consultor",
            "contact": "Contactar o meu consultor"
        },
        "nextStep": {
            "title": "PRÓXIMO PASSO",
            "pending": "O seu processo está a ser analisado. Entraremos em contacto em 24-48h.",
            "processing": "A nossa equipa está a finalizar a análise. Será contactado muito em breve.",
            "finished": "O seu processo foi tratado. Verifique o estado acima.",
            "estimateLabel": "Prazo estimado",
            "estimateValue": "24 a 48 horas"
        },
        "banners": {
            "approved": {
                "title": "O SEU FINANCIAMENTO FOI APROVADO",
                "message": "Precisamos de verificar a sua identidade antes de libertar os fundos.",
                "action": "Completar a verificação de identidade"
            },
            "actionRequired": {
                "title": "AÇÃO NECESSÁRIA",
                "message": "O seu processo foi aprovado. É necessária uma ação para finalizar o financiamento.",
                "action": "Efetuar o meu pagamento"
            }
        }
    },
    "ro": {
        "header": {
            "back": "Înapoi",
            "amountLabel": "Suma solicitată"
        },
        "status": {
            "pending": "În așteptare",
            "approved": "Aprobat",
            "rejected": "Respins",
            "processing": "În analiza"
        },
        "progression": "PROGRESUL DOSARULUI",
        "info": {
            "duration": "Durată",
            "monthlyPayment": "Rată lunară",
            "rate": "Dobândă",
            "creationDate": "Data creării"
        },
        "timeline": {
            "step1": {
                "title": "DOSAR PRIMIT",
                "desc": "Cererea dvs. a fost primită. Echipa noastră o va analiza."
            },
            "step2": {
                "title": "ANALIZĂ ÎN CURS",
                "desc": "Consilierii noștri experți analizează dosarul dvs. în detaliu."
            },
            "step3": {
                "title": "VERIFICARE FINALĂ",
                "desc": "Verificarea finală a tuturor elementelor dosarului dvs."
            },
            "step4": {
                "approved": {
                    "title": "DOSAR APROBAT",
                    "desc": "Felicitări! Finanțarea dvs. a fost aprobată."
                },
                "rejected": {
                    "title": "DOSAR RESPINS",
                    "desc": "Cererea dvs. nu a fost acceptată. Contactați asistența noastră."
                },
                "pending": "Se așteaptă decizia finală..."
            }
        },
        "declaration": {
            "title": "DECLARAȚIE FINANCIARĂ",
            "situation": "Situație profesională",
            "income": "Venituri lunare",
            "expenses": "Cheltuieli lunare",
            "security": "Date criptate și securizate - AES-256"
        },
        "advisor": {
            "title": "Consilierul dvs.",
            "contact": "Contactați consilierul meu"
        },
        "nextStep": {
            "title": "PASUL URMĂTOR",
            "pending": "Dosarul dvs. este în curs de examinare. Vă vom contacta în 24-48 de ore.",
            "processing": "Echipa noastră finalizează analiza. Veți fi contactat în curând.",
            "finished": "Dosarul dvs. a fost procesat. Verificați starea de mai sus.",
            "estimateLabel": "Timp estimat",
            "estimateValue": "24 până la 48 de ore"
        },
        "banners": {
            "approved": {
                "title": "FINANȚAREA DVS. ESTE APROBATĂ",
                "message": "Trebuie să vă verificăm identitatea înainte de a elibera fondurile.",
                "action": "Completați verificarea identității"
            },
            "actionRequired": {
                "title": "ACȚIUNE NECESARĂ",
                "message": "Dosarul dvs. a fost aprobat. Este necesară o acțiune pentru a finaliza finanțarea.",
                "action": "Efectuați plata mea"
            }
        }
    },
    "sv": {
        "header": {
            "back": "Tillbaka",
            "amountLabel": "Begärt belopp"
        },
        "status": {
            "pending": "Väntar",
            "approved": "Godkänd",
            "rejected": "Avvisad",
            "processing": "Analyseras"
        },
        "progression": "ÄRENDETS FRAMSTEG",
        "info": {
            "duration": "Löptid",
            "monthlyPayment": "Månadsbetalning",
            "rate": "Ränta",
            "creationDate": "Skapelsedatum"
        },
        "timeline": {
            "step1": {
                "title": "ÄRENDE MOTTAGET",
                "desc": "Din ansökan har mottagits. Vårt team kommer att granska den."
            },
            "step2": {
                "title": "ANALYS PÅGÅR",
                "desc": "Våra expertrådgivare analyserar ditt ärende i detalj."
            },
            "step3": {
                "title": "SLUTVERIFIERING",
                "desc": "Slutlig verifiering av alla delar i ditt ärende."
            },
            "step4": {
                "approved": {
                    "title": "ÄRENDE GODKÄNT",
                    "desc": "Grattis! Din finansiering har godkänts."
                },
                "rejected": {
                    "title": "ÄRENDE AVVISAT",
                    "desc": "Din ansökan accepterades inte. Kontakta vår support."
                },
                "pending": "Väntar på det slutliga beslutet..."
            }
        },
        "declaration": {
            "title": "FINANSIELL FÖRKLARING",
            "situation": "Yrkessituation",
            "income": "Månatlig inkomst",
            "expenses": "Månatliga utgifter",
            "security": "Krypterad och säkrad data - AES-256"
        },
        "advisor": {
            "title": "Din rådgivare",
            "contact": "Kontakta min rådgivare"
        },
        "nextStep": {
            "title": "NÄSTA STEG",
            "pending": "Ditt ärende granskas. Vi kontaktar dig inom 24-48 timmar.",
            "processing": "Vårt team slutför analysen. Du kommer att kontaktas mycket snart.",
            "finished": "Ditt ärende har behandlats. Kontrollera statusen ovan.",
            "estimateLabel": "Beräknad tid",
            "estimateValue": "24 till 48 timmar"
        },
        "banners": {
            "approved": {
                "title": "DIN FINANSIERING ÄR GODKÄND",
                "message": "Vi måste verifiera din identitet innan vi frigör medlen.",
                "action": "Slutför identitetsverifiering"
            },
            "actionRequired": {
                "title": "ÅTGÄRD KRÄVS",
                "message": "Ditt ärende har godkänts. En åtgärd krävs för att slutföra din finansiering.",
                "action": "Genomför min betalning"
            }
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
    if os.path.exists(path):
        with open(path, 'r', encoding='utf-8') as f:
            lang_data = json.load(f)

        # Navigate to Dashboard.Requests.Details
        if "Dashboard" not in lang_data:
            lang_data["Dashboard"] = {}
        if "Requests" not in lang_data["Dashboard"]:
            lang_data["Dashboard"]["Requests"] = {}
        if "Details" not in lang_data["Dashboard"]["Requests"]:
            lang_data["Dashboard"]["Requests"]["Details"] = {}

        deep_merge(data, lang_data["Dashboard"]["Requests"]["Details"])

        with open(path, 'w', encoding='utf-8') as f:
            json.dump(lang_data, f, ensure_ascii=False, indent=2)
        print(f"✓ Injected Dashboard.Requests.Details -> {lang}")

print("All done!")
