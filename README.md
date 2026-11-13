# SAX-AI

Un’interfaccia dal look psichedelico (sfondo WebGL reattivo al mouse) che:

- **risponde a domande** (Claude, via API Anthropic)
- **genera immagini** (FLUX, via Replicate)
- **genera video** (via Replicate)

## Avvio

```bash
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # poi inserisci le tue chiavi
uvicorn server:app --reload
```

Apri http://localhost:8000

## Chiavi necessarie

- `ANTHROPIC_API_KEY`: console.anthropic.com
- `REPLICATE_API_TOKEN`: replicate.com/account/api-tokens

Puoi cambiare i modelli di immagine e video nel file `.env`.

## Pubblicare su GitHub

```bash
git init && git add . && git commit -m "SAX-AI"
git branch -M main
git remote add origin https://github.com/TUO-UTENTE/sax-ai.git
git push -u origin main
```

Non committare mai il file `.env`: è già nel `.gitignore`.
