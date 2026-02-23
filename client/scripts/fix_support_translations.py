import json
import os

languages = ["fr", "en", "es", "it", "de", "nl", "pl", "pt", "ro", "sv"]
base_path = r"c:\Users\tesla\Videos\Nouvelle aventure\pret\client\messages"

support_translations = {
    "fr": {
        "title": "Centre d'assistance",
        "subtitle": "Nous sommes là pour répondre à vos questions et vous accompagner.",
        "badge": "Aide & Support",
        "searchPlaceholder": "Rechercher une solution...",
        "contactButton": "Contacter",
        "faqTitle": "Questions Fréquentes",
        "faqAll": "Afficher toutes les questions",
        "security": {
            "title": "Support Certifié Sécurisé",
            "desc": "Protocoles de chiffrement actifs"
        },
        "Methods": {
            "chat": {
                "title": "Chat en direct",
                "value": "Conseiller en ligne",
                "desc": "Réponse immédiate"
            },
            "phone": {
                "title": "Ligne Téléphonique",
                "value": "AGM INVEST +33 7 56 84 41 45",
                "desc": "9h - 18h (Lun-Ven)"
            },
            "email": {
                "title": "Assistance Email",
                "value": "contact@agm-negoce.com",
                "desc": "Sous 24 heures"
            }
        },
        "FAQs": [
            {
                "q": "Comment se passe la vérification d'identité ?",
                "a": "La vérification s'effectue entièrement en ligne. Il vous suffit de télécharger une pièce d'identité valide et de réaliser un selfie vidéo rapide pour confirmer votre identité en quelques secondes."
            },
            {
                "q": "Quels sont les délais d'accord de prêt ?",
                "a": "Une fois votre dossier complet, vous recevez une réponse de principe immédiate. L'analyse finale et le déblocage des fonds interviennent généralement sous 24 à 48 heures ouvrées."
            },
            {
                "q": "Puis-je modifier ma demande après soumission ?",
                "a": "Tant que votre demande est en statut 'En attente', vous pouvez contacter notre support pour apporter des modifications. Une fois validée, les modifications ne sont plus possibles."
            },
            {
                "q": "Comment télécharger mon contrat signé ?",
                "a": "Votre contrat est disponible dans la section 'Mes Documents' de votre tableau de bord dès que la signature électronique est confirmée."
            },
            {
                "q": "Quels sont les critères d'éligibilité ?",
                "a": "Vous devez être majeur, résider dans un pays éligible et justifier de revenus stables. Chaque projet est étudié de manière personnalisée par nos experts."
            },
            {
                "q": "Comment sécuriser mon compte ?",
                "a": "Nous recommandons d'activer l'authentification à deux facteurs (2FA) dans vos paramètres et d'utiliser un mot de passe unique et complexe."
            }
        ]
    },
    "en": {
        "title": "Support Center",
        "subtitle": "We are here to answer your questions and support you.",
        "badge": "Help & Support",
        "searchPlaceholder": "Search for a solution...",
        "contactButton": "Contact",
        "faqTitle": "Frequently Asked Questions",
        "faqAll": "Show all questions",
        "security": {
            "title": "Certified Secure Support",
            "desc": "Active encryption protocols"
        },
        "Methods": {
            "chat": {
                "title": "Live Chat",
                "value": "Online Advisor",
                "desc": "Immediate response"
            },
            "phone": {
                "title": "Phone Line",
                "value": "AGM INVEST +33 7 56 84 41 45",
                "desc": "9am - 6pm (Mon-Fri)"
            },
            "email": {
                "title": "Email Support",
                "value": "contact@agm-negoce.com",
                "desc": "Within 24 hours"
            }
        },
        "FAQs": [
            {
                "q": "How does identity verification work?",
                "a": "Verification is done entirely online. Simply upload a valid ID and perform a quick video selfie to confirm your identity in seconds."
            },
            {
                "q": "What are the loan approval times?",
                "a": "Once your file is complete, you receive an immediate response in principle. Final analysis and fund disbursement usually occur within 24 to 48 business hours."
            },
            {
                "q": "Can I modify my request after submission?",
                "a": "As long as your request is in 'Pending' status, you can contact our support to make changes. Once validated, modifications are no longer possible."
            },
            {
                "q": "How do I download my signed contract?",
                "a": "Your contract is available in the 'My Documents' section of your dashboard as soon as the electronic signature is confirmed."
            },
            {
                "q": "What are the eligibility criteria?",
                "a": "You must be of legal age, reside in an eligible country, and prove stable income. Each project is studied personally by our experts."
            },
            {
                "q": "How do I secure my account?",
                "a": "We recommend activating two-factor authentication (2FA) in your settings and using a unique, complex password."
            }
        ]
    },
    "es": {
        "title": "Centro de Asistencia",
        "subtitle": "Estamos aquí para responder a sus preguntas y acompañarle.",
        "badge": "Ayuda y Soporte",
        "searchPlaceholder": "Buscar una solución...",
        "contactButton": "Contactar",
        "faqTitle": "Preguntas Frecuentes",
        "faqAll": "Mostrar todas las preguntas",
        "security": {
            "title": "Soporte Certificado Seguro",
            "desc": "Protocolos de cifrado activos"
        },
        "Methods": {
            "chat": {
                "title": "Chat en vivo",
                "value": "Asesor en línea",
                "desc": "Respuesta inmediata"
            },
            "phone": {
                "title": "Línea Telefónica",
                "value": "AGM INVEST +33 7 56 84 41 45",
                "desc": "9h - 18h (Lun-Vie)"
            },
            "email": {
                "title": "Asistencia por Email",
                "value": "contact@agm-negoce.com",
                "desc": "En menos de 24 horas"
            }
        },
        "FAQs": [
            {
                "q": "¿Cómo funciona la verificación de identidad?",
                "a": "La verificación se realiza íntegramente en línea. Solo tiene que subir un documento de identidad válido y realizar un breve vídeo selfie para confirmar su identidad en segundos."
            },
            {
                "q": "¿Cuáles son los plazos de aprobación del préstamo?",
                "a": "Una vez que su expediente esté completo, recibirá una respuesta de principio inmediata. El análisis final y el desembolso de los fondos suelen realizarse en 24-48 horas hábiles."
            },
            {
                "q": "¿Puedo modificar mi solicitud después de enviarla?",
                "a": "Mientras su solicitud esté en estado 'Pendiente', puede contactar con nuestro soporte para realizar cambios. Una vez validada, ya no es posible realizar modificaciones."
            },
            {
                "q": "¿Cómo puedo descargar mi contrato firmado?",
                "a": "Su contrato estará disponible en la sección 'Mis documentos' de su panel de control en cuanto se confirme la firma electrónica."
            },
            {
                "q": "¿Cuáles son los criterios de elegibilidad?",
                "a": "Debe ser mayor de edad, residir en un país eligible y justificar ingresos estables. Chaque projet est étudié de manière personnalisée par nos experts."
            },
            {
                "q": "¿Cómo puedo asegurar mi cuenta?",
                "a": "Recomendamos activar la autenticación de dos factores (2FA) en sus ajustes y utilizar una contraseña única y compleja."
            }
        ]
    },
    "it": {
        "title": "Centro di Assistenza",
        "subtitle": "Siamo qui per rispondere alle vostre domande e accompagnarvi.",
        "badge": "Aiuto e Supporto",
        "searchPlaceholder": "Cerca una soluzione...",
        "contactButton": "Contattare",
        "faqTitle": "Domande Frequenti",
        "faqAll": "Mostra tutte le domande",
        "security": {
            "title": "Supporto Certificato Sicuro",
            "desc": "Protocolli di crittografia attivi"
        },
        "Methods": {
            "chat": {
                "title": "Chat dal vivo",
                "value": "Consulente online",
                "desc": "Risposta immediata"
            },
            "phone": {
                "title": "Linea Telefonica",
                "value": "AGM INVEST +33 7 56 84 41 45",
                "desc": "9:00 - 18:00 (Lun-Ven)"
            },
            "email": {
                "title": "Assistenza Email",
                "value": "contact@agm-negoce.com",
                "desc": "Entro 24 ore"
            }
        },
        "FAQs": [
            {
                "q": "Come avviene la verifica dell'identità?",
                "a": "La verifica si effettua interamente online. Basta caricare un documento d'identità valido ed effettuare un breve video selfie per confermare la propria identità in pochi secondi."
            },
            {
                "q": "Quali sono i tempi di approvazione del prestito?",
                "a": "Una volta completata la pratica, riceverete una risposta di principio immediata. L'analisi finale e l'erogazione dei fondi avvengono generalmente entro 24-48 ore lavorative."
            },
            {
                "q": "Posso modificare la mia richiesta dopo l'invio?",
                "a": "Finché la richiesta è in stato 'In attesa', potete contattare il nostro supporto per apportare modifiche. Una volta convalidata, le modifiche non sono più possibili."
            },
            {
                "q": "Come scaricare il mio contratto firmato?",
                "a": "Il contratto è disponibile nella sezione 'I miei documenti' della dashboard non appena viene confermata la firma elettronica."
            },
            {
                "q": "Quali sono i criteri di ammissibilità?",
                "a": "Dovete essere maggiorenni, risiedere in un paese ammissibile e dimostrare un reddito stabile. Ogni progetto è studiato in modo personalizzato dai nostri esperti."
            },
            {
                "q": "Come rendere sicuro il mio account?",
                "a": "Consigliamo di attivare l'autenticazione a due fattori (2FA) nelle impostazioni e di utilizzare una password univoca e complessa."
            }
        ]
    },
    "de": {
        "title": "Hilfe-Zentrum",
        "subtitle": "Wir sind hier, um Ihre Fragen zu beantworten und Sie zu unterstützen.",
        "badge": "Hilfe & Support",
        "searchPlaceholder": "Nach einer Lösung suchen...",
        "contactButton": "Kontaktieren",
        "faqTitle": "Häufig gestellte Fragen",
        "faqAll": "Alle Fragen anzeigen",
        "security": {
            "title": "Zertifizierter sicherer Support",
            "desc": "Aktive Verschlüsselungsprotokolle"
        },
        "Methods": {
            "chat": {
                "title": "Live-Chat",
                "value": "Online-Berater",
                "desc": "Sofortige Antwort"
            },
            "phone": {
                "title": "Telefonleitung",
                "value": "AGM INVEST +33 7 56 84 41 45",
                "desc": "9 - 18 Uhr (Mo-Fr)"
            },
            "email": {
                "title": "E-Mail-Unterstützung",
                "value": "contact@agm-negoce.com",
                "desc": "Innerhalb von 24 Stunden"
            }
        },
        "FAQs": [
            {
                "q": "Wie funktioniert die Identitätsprüfung?",
                "a": "Die Prüfung erfolgt vollständig online. Laden Sie einfach einen gültigen Ausweis hoch und machen Sie ein kurzes Video-Selfie, um Ihre Identität in Sekunden zu bestätigen."
            },
            {
                "q": "Wie lange dauert die Kreditgenehmigung?",
                "a": "Sobald Ihre Unterlagen vollständig sind, erhalten Sie eine sofortige Grundsatzentscheidung. Die endgültige Analyse und die Auszahlung der Mittel erfolgen in der Regel innerhalb von 24 bis 48 Werktagen."
            },
            {
                "q": "Kann ich meinen Antrag nach der Einreichung noch ändern?",
                "a": "Solange Ihr Antrag den Status 'Ausstehend' hat, können Sie unseren Support kontaktieren, um Änderungen vorzunehmen. Nach der Validierung sind keine Änderungen mehr möglich."
            },
            {
                "q": "Wie lade ich meinen unterschriebenen Vertrag herunter?",
                "a": "Ihr Vertrag ist im Bereich 'Meine Dokumente' Ihres Dashboards verfügbar, sobald die elektronische Signatur bestätigt wurde."
            },
            {
                "q": "Was sind die Voraussetzungen für die Berechtigung?",
                "a": "Sie müssen volljährig sein, in einem berechtigten Land wohnen und ein stabiles Einkommen nachweisen können. Jedes Projekt wird von unseren Experten individuell geprüft."
            },
            {
                "q": "Wie sichere ich mein Konto ab?",
                "a": "Wir empfehlen, die Zwei-Faktor-Authentifizierung (2FA) in Ihren Einstellungen zu aktivieren und ein einzigartiges, komplexes Passwort zu verwenden."
            }
        ]
    },
    "nl": {
        "title": "Ondersteuningscentrum",
        "subtitle": "Wij zijn er om uw vragen te beantwoorden en u te ondersteunen.",
        "badge": "Hulp & Ondersteuning",
        "searchPlaceholder": "Zoek naar een oplossing...",
        "contactButton": "Contact opnemen",
        "faqTitle": "Veelgestelde Vragen",
        "faqAll": "Toon alle vragen",
        "security": {
            "title": "Gecertificeerde Veilige Ondersteuning",
            "desc": "Actieve versleutelingsprotocollen"
        },
        "Methods": {
            "chat": {
                "title": "Live chat",
                "value": "Online adviseur",
                "desc": "Onmiddellijk antwoord"
            },
            "phone": {
                "title": "Telefoonlijn",
                "value": "AGM INVEST +33 7 56 84 41 45",
                "desc": "9u - 18u (Ma-Vr)"
            },
            "email": {
                "title": "E-mail ondersteuning",
                "value": "contact@agm-negoce.com",
                "desc": "Binnen 24 uur"
            }
        },
        "FAQs": [
            {
                "q": "Hoe werkt de identiteitsverificatie?",
                "a": "De verificatie gebeurt volledig online. Upload eenvoudig een geldig identiteitsbewijs en maak een korte videoselfie om uw identiteit in seconden te bevestigen."
            },
            {
                "q": "Wat zijn de termijnen voor leninggoedkeuring?",
                "a": "Zodra uw dossier compleet is, ontvangt u onmiddellijk een principebesluit. De definitieve analyse en de uitbetaling van het geld gebeuren meestal binnen 24 tot 48 werkuren."
            },
            {
                "q": "Kan ik mijn aanvraag wijzigen na indiening?",
                "a": "Zolang uw aanvraag de status 'In afwachting' heeft, kunt u contact opnemen met onze ondersteuning om wijzigingen door te voeren. Eenmaal gevalideerd, zijn wijzigingen niet meer mogelijk."
            },
            {
                "q": "Hoe download ik mijn ondertekende contract?",
                "a": "Uw contract is beschikbaar in de sectie 'Mijn documenten' van uw dashboard zodra de elektronische handtekening is bevestigd."
            },
            {
                "q": "Wat zijn de criteria voor deelname?",
                "a": "U moet meerderjarig zijn, in een in aanmerking komend land wonen en een stabiel inkomen aantonen. Elk project wordt persoonlijk bestudeerd door onze experts."
            },
            {
                "q": "Hoe beveilig ik mijn account?",
                "a": "We raden aan om tweestapsverificatie (2FA) in te schakelen in uw instellingen en een uniek, complex wachtwoord te gebruiken."
            }
        ]
    },
    "pl": {
        "title": "Centrum wsparcia",
        "subtitle": "Jesteśmy tutaj, aby odpowiedzieć na Twoje pytania i wesprzeć Cię.",
        "badge": "Pomoc i wsparcie",
        "searchPlaceholder": "Szukaj rozwiązania...",
        "contactButton": "Kontakt",
        "faqTitle": "Często zadawane pytania",
        "faqAll": "Pokaż wszystkie pytania",
        "security": {
            "title": "Certyfikowane bezpieczne wsparcie",
            "desc": "Aktywne protokoły szyfrowania"
        },
        "Methods": {
            "chat": {
                "title": "Czat na żywo",
                "value": "Doradca online",
                "desc": "Natychmiastowa odpowiedź"
            },
            "phone": {
                "title": "Linia telefoniczna",
                "value": "AGM INVEST +33 7 56 84 41 45",
                "desc": "9:00 - 18:00 (Pon-Pt)"
            },
            "email": {
                "title": "Wsparcie e-mail",
                "value": "contact@agm-negoce.com",
                "desc": "W ciągu 24 godzin"
            }
        },
        "FAQs": [
            {
                "q": "Jak przebiega weryfikacja tożsamości?",
                "a": "Weryfikacja odbywa się w całości online. Wystarczy przesłać ważny dokument tożsamości i wykonać krótkie wideo-selfie, aby potwierdzić tożsamość w kilka sekund."
            },
            {
                "q": "Jakie są terminy zatwierdzenia pożyczki?",
                "a": "Po skompletowaniu dokumentacji otrzymasz natychmiastową decyzję wstępną. Ostateczna analiza i wypłata środków następuje zazwyczaj w ciągu 24 do 48 godzin roboczych."
            },
            {
                "q": "Czy mogę zmodyfikować wniosek po przesłaniu?",
                "a": "Dopóki Twój wniosek ma status 'Oczekujący', możesz skontaktować się z naszym wsparciem w celu dokonania zmian. Po zatwierdzeniu modyfikacje nie są już możliwe."
            },
            {
                "q": "Jak pobrać podpisaną umowę?",
                "a": "Umowa jest dostępna w sekcji 'Moje dokumenty' w panelu sterowania natychmiast po potwierdzeniu podpisu elektronicznego."
            },
            {
                "q": "Jakie są kryteria kwalifikowalności?",
                "a": "Musisz być pełnoletni, mieszkać w kraju kwalifikującym się i wykazać stabilne dochody. Każdy projekt jest analizowany indywidualnie przez naszych ekspertów."
            },
            {
                "q": "Jak zabezpieczyć swoje konto?",
                "a": "Zalecamy aktywację uwierzytelniania dwuskładnikowego (2FA) w ustawieniach i używanie unikalnego, złożonego hasła."
            }
        ]
    },
    "pt": {
        "title": "Centro de Apoio",
        "subtitle": "Estamos aqui para responder às suas perguntas e acompanhá-lo.",
        "badge": "Ajuda e Suporte",
        "searchPlaceholder": "Procurar uma solução...",
        "contactButton": "Contactar",
        "faqTitle": "Perguntas Frecuentes",
        "faqAll": "Mostrar todas as perguntas",
        "security": {
            "title": "Suporte Certificado Seguro",
            "desc": "Protocolos de criptografia ativos"
        },
        "Methods": {
            "chat": {
                "title": "Chat ao vivo",
                "value": "Consultor online",
                "desc": "Resposta imediata"
            },
            "phone": {
                "title": "Linha Telefónica",
                "value": "AGM INVEST +33 7 56 84 41 45",
                "desc": "9h - 18h (Seg-Sex)"
            },
            "email": {
                "title": "Assistência por E-mail",
                "value": "contact@agm-negoce.com",
                "desc": "Em menos de 24 horas"
            }
        },
        "FAQs": [
            {
                "q": "Como funciona a verificação de identidade?",
                "a": "A verificação é feita inteiramente online. Basta carregar um documento de identidade válido e realizar um curto vídeo selfie para confirmar a sua identidade em segundos."
            },
            {
                "q": "Quais são os prazos de aprovação do empréstimo?",
                "a": "Assim que o seu processo estiver completo, receberá uma resposta de princípio imediata. A análise final e o desembolso dos fundos ocorrem geralmente em 24 a 48 horas úteis."
            },
            {
                "q": "Posso modificar o meu pedido após a submissão?",
                "a": "Enquanto o seu pedido estiver no estado 'Pendente', pode contactar o nosso suporte para efetuar alterações. Uma vez validado, as alterações já não são possíveis."
            },
            {
                "q": "Como posso descarregar o meu contrato assinado?",
                "a": "O seu contrato estará disponível na secção 'Os meus documentos' do seu painel de controlo assim que a assinatura eletrónica for confirmada."
            },
            {
                "q": "Quais são os critérios de elegibilidade?",
                "a": "Deve ser maior de idade, residir num país elegível e comprovar rendimentos estáveis. Cada projeto é estudado de forma personalizada pelos nossos especialistas."
            },
            {
                "q": "Como posso proteger a minha conta?",
                "a": "Recomendamos ativar a autenticação de dois fatores (2FA) nas suas definições e utilizar uma palavra-passe única e complexa."
            }
        ]
    },
    "ro": {
        "title": "Centrul de Asistență",
        "subtitle": "Suntem aici pentru a vă răspunde la întrebări și pentru a vă însoți.",
        "badge": "Ajutor și Suport",
        "searchPlaceholder": "Căutați o soluție...",
        "contactButton": "Contactați",
        "faqTitle": "Întrebări Frecvente",
        "faqAll": "Afișați toate întrebările",
        "security": {
            "title": "Suporte Certificat Securizat",
            "desc": "Protocoluri de criptare active"
        },
        "Methods": {
            "chat": {
                "title": "Chat live",
                "value": "Consilier online",
                "desc": "Răspuns imediat"
            },
            "phone": {
                "title": "Linie Telefonică",
                "value": "AGM INVEST +33 7 56 84 41 45",
                "desc": "9:00 - 18:00 (Lun-Vin)"
            },
            "email": {
                "title": "Asistență prin E-mail",
                "value": "contact@agm-negoce.com",
                "desc": "În maximum 24 de ore"
            }
        },
        "FAQs": [
            {
                "q": "Cum se desfășoară verificarea identității?",
                "a": "Verificarea se face în întregime online. Trebuie doar să încărcați un act de identitate valabil și să realizați un scurt video selfie pentru a vă confirma identitatea în câteva secunde."
            },
            {
                "q": "Care sunt termenele de aprobare a împrumutului?",
                "a": "Odată ce dosarul este complet, primiți un răspuns de principiu imediat. Analiza finală și eliberarea fondurilor au loc, de obicei, în 24 până la 48 de ore lucrătoare."
            },
            {
                "q": "Pot modifica cererea după trimitere?",
                "a": "Atât timp cât cererea este în starea 'În așteptare', puteți contacta serviciul nostru de suport pentru a face modificări. Odată validată, modificările nu mai sunt posibile."
            },
            {
                "q": "Cum pot descărca contractul semnat?",
                "a": "Contractul dvs. este disponibil în secțiunea 'Documentele mele' din tabloul de bord imediat ce semnătura electronică este confirmată."
            },
            {
                "q": "Care sunt criteriile de eligibilitate?",
                "a": "Trebuie să fiți major, să locuiți într-o țară eligibilă și să justificați venituri stabile. Fiecare proiect este studiat în mod personalizat de către experții noștri."
            },
            {
                "q": "Cum îmi pot securiza contul?",
                "a": "Vă recomandăm să activați autentificarea cu doi factori (2FA) în setări și să folosiți o parolă unică și complexă."
            }
        ]
    },
    "sv": {
        "title": "Supportcenter",
        "subtitle": "Vi är här för att svara på dina frågor och stödja dig.",
        "badge": "Hjälp & Support",
        "searchPlaceholder": "Sök efter en lösning...",
        "contactButton": "Kontakta",
        "faqTitle": "Vanliga frågor",
        "faqAll": "Visa alla frågor",
        "security": {
            "title": "Certifierad säker support",
            "desc": "Aktiva krypteringsprotokoll"
        },
        "Methods": {
            "chat": {
                "title": "Livechatt",
                "value": "Online-rådgivare",
                "desc": "Omedelbart svar"
            },
            "phone": {
                "title": "Telefonlinje",
                "value": "AGM INVEST +33 7 56 84 41 45",
                "desc": "09:00 - 18:00 (Mån-Fre)"
            },
            "email": {
                "title": "E-postsupport",
                "value": "contact@agm-negoce.com",
                "desc": "Inom 24 timmar"
            }
        },
        "FAQs": [
            {
                "q": "Hur går identitetsverifieringen till?",
                "a": "Verifieringen sker helt online. Ladda bara upp en giltig legitimation och gör en snabb videoselfie för att bekräfta din identitet på några sekunder."
            },
            {
                "q": "Vilka är handläggningstiderna för lån?",
                "a": "När din ansökan är komplett får du ett omedelbart förhandsbesked. Slutlig analys och utbetalning av medel sker vanligtvis inom 24 till 48 arbetstimmar."
            },
            {
                "q": "Kan jag ändra min ansökan efter att den skickats in?",
                "a": "Så länge din ansökan har statusen 'Väntande' kan du kontakta vår support för att göra ändringar. När den har validerats är ändringar inte längre möjliga."
            },
            {
                "q": "Hur laddar jag ner mitt signerade kontrakt?",
                "a": "Ditt kontrakt finns tillgängligt i sektionen 'Mina dokument' på din instrumentpanel så snart den elektroniska signaturen har bekräftats."
            },
            {
                "q": "Vilka är behörighetskraven?",
                "a": "Du måste vara myndig, vara bosatt i ett berättigat land och kunna styrka en stabil inkomst. Varje projekt studeras personligen av våra experter."
            },
            {
                "q": "Hur säkrar jag mitt konto?",
                "a": "Vi rekommenderar att du aktiverar tvåfaktorsautentisering (2FA) i dina inställningar och använder ett unikt och komplext lösenord."
            }
        ]
    }
}

for lang in languages:
    file_path = os.path.join(base_path, f"{lang}.json")
    if not os.path.exists(file_path):
        print(f"Skipping {lang}.json: File not found")
        continue

    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)

        if "Dashboard" not in data:
            data["Dashboard"] = {}
        
        data["Dashboard"]["Support"] = support_translations[lang]

        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        
        print(f"Successfully updated Dashboard.Support in {lang}.json")

    except Exception as e:
        print(f"Error processing {lang}.json: {e}")
