import json
import os

languages = ["fr", "en", "es", "it", "de", "nl", "pl", "pt", "ro", "sv"]
base_path = r"c:\Users\tesla\Videos\Nouvelle aventure\pret\client\messages"

chat_translations = {
    "fr": {
        "onlineStatus": "CLIENT EN LIGNE",
        "welcome": "Bonjour !",
        "advisorReady": "Votre conseiller est prêt à vous aider.",
        "askQuestion": "Posez votre question ci-dessous.",
        "filePlaceholder": "Fichier",
        "loadingFile": "Chargement du fichier...",
        "inputPlaceholder": "Répondre au client...",
        "fileTooLarge": "Le fichier est trop volumineux (max 10MB)",
        "uploadError": "Erreur lors de l'envoi du fichier. Veuillez réessayer.",
        "fileSent": "📎 Fichier envoyé"
    },
    "en": {
        "onlineStatus": "CLIENT ONLINE",
        "welcome": "Hello!",
        "advisorReady": "Your advisor is ready to help you.",
        "askQuestion": "Ask your question below.",
        "filePlaceholder": "File",
        "loadingFile": "Uploading file...",
        "inputPlaceholder": "Reply to client...",
        "fileTooLarge": "The file is too large (max 10MB)",
        "uploadError": "Error uploading file. Please try again.",
        "fileSent": "📎 File sent"
    },
    "es": {
        "onlineStatus": "CLIENTE EN LÍNEA",
        "welcome": "¡Hola!",
        "advisorReady": "Su asesor está listo para ayudarle.",
        "askQuestion": "Haga su pregunta a continuación.",
        "filePlaceholder": "Archivo",
        "loadingFile": "Cargando archivo...",
        "inputPlaceholder": "Responder al cliente...",
        "fileTooLarge": "El archivo es demasiado grande (máx. 10MB)",
        "uploadError": "Error al cargar el archivo. Por favor, inténtelo de nuevo.",
        "fileSent": "📎 Archivo enviado"
    },
    "it": {
        "onlineStatus": "CLIENTE ONLINE",
        "welcome": "Ciao!",
        "advisorReady": "Il tuo consulente è pronto ad aiutarti.",
        "askQuestion": "Fai la tua domanda qui sotto.",
        "filePlaceholder": "File",
        "loadingFile": "Caricamento file...",
        "inputPlaceholder": "Rispondi al cliente...",
        "fileTooLarge": "Il file è troppo grande (max 10MB)",
        "uploadError": "Errore durante il caricamento del file. Riprova.",
        "fileSent": "📎 File inviato"
    },
    "de": {
        "onlineStatus": "KUNDE ONLINE",
        "welcome": "Hallo!",
        "advisorReady": "Ihr Berater ist bereit, Ihnen zu helfen.",
        "askQuestion": "Stellen Sie Ihre Frage unten.",
        "filePlaceholder": "Datei",
        "loadingFile": "Datei wird hochgeladen...",
        "inputPlaceholder": "Dem Kunden antworten...",
        "fileTooLarge": "Die Datei ist zu groß (max. 10MB)",
        "uploadError": "Fehler beim Hochladen der Datei. Bitte versuchen Sie es erneut.",
        "fileSent": "📎 Datei gesendet"
    },
    "nl": {
        "onlineStatus": "CLIENT ONLINE",
        "welcome": "Hallo!",
        "advisorReady": "Uw adviseur staat klaar om u te helpen.",
        "askQuestion": "Stel hieronder uw vraag.",
        "filePlaceholder": "Bestand",
        "loadingFile": "Bestand uploaden...",
        "inputPlaceholder": "Antwoord aan klant...",
        "fileTooLarge": "Het bestand is te groot (max 10MB)",
        "uploadError": "Fout bij het uploaden van het bestand. Probeer het opnieuw.",
        "fileSent": "📎 Bestand verzonden"
    },
    "pl": {
        "onlineStatus": "KLIENT ONLINE",
        "welcome": "Witaj!",
        "advisorReady": "Twój doradca jest gotowy do pomocy.",
        "askQuestion": "Zadaj pytanie poniżej.",
        "filePlaceholder": "Plik",
        "loadingFile": "Przesyłanie pliku...",
        "inputPlaceholder": "Odpowiedz klientowi...",
        "fileTooLarge": "Plik jest zbyt duży (maks. 10MB)",
        "uploadError": "Błąd podczas przesyłania pliku. Spróbuj ponownie.",
        "fileSent": "📎 Plik wysłany"
    },
    "pt": {
        "onlineStatus": "CLIENTE ONLINE",
        "welcome": "Olá!",
        "advisorReady": "O seu consultor está pronto para ajudar.",
        "askQuestion": "Faça a sua pergunta abaixo.",
        "filePlaceholder": "Arquivo",
        "loadingFile": "Carregando arquivo...",
        "inputPlaceholder": "Responder ao cliente...",
        "fileTooLarge": "O arquivo é muito grande (máx. 10MB)",
        "uploadError": "Erro ao carregar o arquivo. Por favor, tente novamente.",
        "fileSent": "📎 Arquivo enviado"
    },
    "ro": {
        "onlineStatus": "CLIENT ONLINE",
        "welcome": "Bună ziua!",
        "advisorReady": "Consilierul dumneavoastră este gata să vă ajute.",
        "askQuestion": "Puneți întrebarea mai jos.",
        "filePlaceholder": "Fișier",
        "loadingFile": "Se încarcă fișierul...",
        "inputPlaceholder": "Răspundeți clientului...",
        "fileTooLarge": "Fișierul este prea mare (max 10MB)",
        "uploadError": "Eroare la încărcarea fișierului. Vă rugăm să încercați din nou.",
        "fileSent": "📎 Fișier trimis"
    },
    "sv": {
        "onlineStatus": "KUND ONLINE",
        "welcome": "Hej!",
        "advisorReady": "Din rådgivare är redo att hjälpa dig.",
        "askQuestion": "Ställ din fråga nedan.",
        "filePlaceholder": "Fil",
        "loadingFile": "Laddar upp fil...",
        "inputPlaceholder": "Svara kunden...",
        "fileTooLarge": "Filen är för stor (max 10MB)",
        "uploadError": "Fel vid uppladdning av fil. Försök igen.",
        "fileSent": "📎 Fil skickad"
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
        
        data["Dashboard"]["Chat"] = chat_translations[lang]

        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        
        print(f"Successfully updated Dashboard.Chat in {lang}.json")

    except Exception as e:
        print(f"Error processing {lang}.json: {e}")
