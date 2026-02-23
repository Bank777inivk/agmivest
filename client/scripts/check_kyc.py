import json

with open('messages/es.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

kyc = data.get('Dashboard', {}).get('KYC', {})
intro_title = kyc.get('Intro', {}).get('title')
print(f"ES Intro Title: {intro_title}")

# Check IT too
with open('messages/it.json', 'r', encoding='utf-8') as f:
    data_it = json.load(f)
kyc_it = data_it.get('Dashboard', {}).get('KYC', {})
print(f"IT KYC exists: {bool(kyc_it)}")
