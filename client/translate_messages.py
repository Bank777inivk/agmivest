"""
Script de traduction i18n - Utilise MyMemory API (gratuit, sans clé).
Bibliothèque standard Python uniquement (ssl context désactivé).
"""

import json
import re
import time
import os
import urllib.request
import urllib.parse
import ssl

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MESSAGES_DIR = os.path.join(BASE_DIR, "messages")
SOURCE_FILE = os.path.join(MESSAGES_DIR, "fr.json")

LANGUAGES = {
    "es": "es",
    "it": "it",
    "nl": "nl",
    "pl": "pl",
    "ro": "ro",
    "sv": "sv",
}

# Contexte SSL désactivé pour contourner les erreurs de certificat
SSL_CTX = ssl.create_default_context()
SSL_CTX.check_hostname = False
SSL_CTX.verify_mode = ssl.CERT_NONE

PRESERVED_VALUES = {
    "AGM INVEST", "AGM", "Hostinger", "ORIAS", "ACPR", "RGPD",
    "IOBSP", "SIREN", "SIRET", "RCS", "CDI", "CDD", "PACS",
    "PME", "TPE", "BIC", "IBAN", "SWIFT", "SARL", "Cookies",
}

NO_TRANSLATE_PATTERNS = [
    r"^\+\d[\d\s]+$",
    r".*@.*\..+",
    r"^https?://",
    r"^www\.",
    r"^FR\s*\d",
    r"^[A-Z]{4,11}\d",
    r"^©",
    r"^\d+$",
    r"^[\d\s€/hH:]+$",
    r"^Ex:",
    r"^\d{2}h",
    r"^[A-Z]{2,4}\d{2}",
]


def should_skip(value: str) -> bool:
    if not isinstance(value, str) or len(value.strip()) == 0:
        return True
    if value.strip() in PRESERVED_VALUES:
        return True
    for p in NO_TRANSLATE_PATTERNS:
        if re.search(p, value.strip(), re.IGNORECASE):
            return True
    return False


def protect_tags(text: str):
    ph = {}
    counter = [0]

    def rep(m):
        k = f"XXTAG{counter[0]}XX"
        ph[k] = m.group(0)
        counter[0] += 1
        return k

    text = re.sub(r"<[^>]+>", rep, text)
    text = re.sub(r"\{[a-zA-Z][^}]*\}", rep, text)
    return text, ph


def restore_tags(text: str, ph: dict) -> str:
    for k, v in ph.items():
        text = text.replace(k, v)
    return text


def mymemory_translate(text: str, target: str, retries: int = 3) -> str:
    """Utilise MyMemory API (gratuit, 5000 mots/jour)."""
    url = "https://api.mymemory.translated.net/get"
    params = urllib.parse.urlencode({
        "q": text,
        "langpair": f"fr|{target}",
    })
    full_url = f"{url}?{params}"
    for attempt in range(retries):
        try:
            req = urllib.request.Request(
                full_url,
                headers={"User-Agent": "Mozilla/5.0"}
            )
            with urllib.request.urlopen(req, context=SSL_CTX, timeout=20) as resp:
                data = json.loads(resp.read().decode("utf-8"))
            translated = data.get("responseData", {}).get("translatedText", "")
            if translated and translated.upper() != text.upper():
                return translated
            return text
        except Exception as e:
            if attempt < retries - 1:
                time.sleep(2 ** attempt)
            else:
                print(f"    ⚠ Erreur: {e}")
                return text
    return text


def google_translate_fallback(text: str, target: str) -> str:
    """Fallback sur l'API Google Translate non officielle."""
    url = "https://translate.googleapis.com/translate_a/single"
    params = urllib.parse.urlencode({
        "client": "gtx", "sl": "fr", "tl": target, "dt": "t", "q": text,
    })
    try:
        req = urllib.request.Request(
            f"{url}?{params}",
            headers={"User-Agent": "Mozilla/5.0"}
        )
        with urllib.request.urlopen(req, context=SSL_CTX, timeout=15) as resp:
            data = json.loads(resp.read().decode("utf-8"))
        parts = [seg[0] for seg in data[0] if seg[0]]
        return "".join(parts)
    except Exception:
        return text


def translate_value(value: str, target: str) -> str:
    if should_skip(value):
        return value
    protected, ph = protect_tags(value)
    clean = protected
    for k in ph:
        clean = clean.replace(k, "").strip()
    if not clean:
        return value
    # Essai MyMemory d'abord, puis fallback Google
    translated = mymemory_translate(protected, target)
    if translated == protected:
        translated = google_translate_fallback(protected, target)
    return restore_tags(translated, ph)


def translate_json(data, target: str, counter: list):
    if isinstance(data, dict):
        return {k: translate_json(v, target, counter) for k, v in data.items()}
    elif isinstance(data, list):
        return [translate_json(item, target, counter) for item in data]
    elif isinstance(data, str):
        result = translate_value(data, target)
        counter[0] += 1
        if counter[0] % 100 == 0:
            print(f"    ... {counter[0]} chaînes traitées")
        return result
    else:
        return data


def main():
    print(f"📄 Chargement de fr.json...")
    with open(SOURCE_FILE, "r", encoding="utf-8") as f:
        fr_data = json.load(f)
    print("✅ fr.json chargé.\n")

    for lang_code, google_lang in LANGUAGES.items():
        output_file = os.path.join(MESSAGES_DIR, f"{lang_code}.json")
        print(f"🌐 [{lang_code.upper()}] Traduction en cours...")
        counter = [0]
        translated_data = translate_json(fr_data, google_lang, counter)
        with open(output_file, "w", encoding="utf-8") as f:
            json.dump(translated_data, f, ensure_ascii=False, indent=2)
        print(f"   ✅ {lang_code}.json généré ({counter[0]} chaînes).\n")
        time.sleep(2)

    print("🎉 Toutes les traductions sont terminées !")


if __name__ == "__main__":
    main()
