# Dead Sea Cipher

A browser-based cryptographic history demo that walks the full arc of cryptographic history — from Atbash (~600 BCE, embedded in the Hebrew Bible) through Caesar, Vigenère, the One-Time Pad, and AES-256-GCM — showing why each cipher failed and what the next one fixed.

Part of the [crypto-compare](https://github.com/systemslibrarian/crypto-compare) portfolio.

## What This Demo Shows

Every era of cryptographic history is operable: type plaintext and see real encryption, frequency analysis, and attack output live in the browser.

| Era | Cipher | Year | Fatal Flaw |
|-----|--------|------|-----------|
| 1 | Atbash | ~600 BCE | Zero key space — one possible mapping |
| 2 | Caesar | ~58 BCE | Only 25 shifts — brute force trivial |
| 3 | Vigenère | 1553 | Repeating key — Kasiski attack |
| 4 | One-Time Pad | 1882 | Key distribution impossible at scale |
| 5 | AES-256-GCM | 2001 | None known — computational security |

### Live Attacks

- **Caesar brute force:** All 25 decryptions with chi-squared ranking
- **Kasiski examination:** Step-by-step key length recovery for Vigenère
- **OTP key reuse:** XOR of ciphertexts reveals XOR of plaintexts, with crib dragging
- **AES tamper detection:** Flip one bit, watch GCM authentication fail

## The Scripture Connection

The earliest documented cipher in human history appears in the Hebrew Bible:

- **Jeremiah 25:26** — "Sheshach" (ששך) is the Atbash encoding of "Babel" (בבל)
- **Jeremiah 51:41** — Sheshach again, encoding the same enemy
- **Jeremiah 51:1** — "Lev Kamai" (לב קמי) encodes "Chaldea" (כשדים)

The prophet Jeremiah used Atbash to conceal the name of Babylon in sacred text — making this the earliest known use of a substitution cipher, approximately 2,600 years before AES.

## Run Locally

```bash
cd demos/dead-sea-cipher
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

### Build for Production

```bash
npm run build
```

Output is in `dist/`. The demo runs fully offline — no external CDN dependencies.

### Run Tests

```bash
npm test
```

Verifies all test vectors:
- `atbash('BABEL', 'latin')` → `'YZYVO'`
- `caesarEncrypt('ATTACK AT DAWN', 3)` → `'DWWDFN DW GDZQ'`
- `vigenereEncrypt('ATTACKATDAWN', 'LEMON')` → `'LXFOPVEFRNHR'`
- OTP key reuse: `C1 ⊕ C2 = P1 ⊕ P2`
- Hebrew Atbash: `בבל` → `ששך`

## Historical Sources

See [SOURCES.md](SOURCES.md) for complete documentation of every historical claim.

## Technical Stack

- **Frontend:** Vite + TypeScript (vanilla — no framework)
- **Classical ciphers:** Pure TypeScript implementations
- **AES-256-GCM:** Web Crypto API (`crypto.subtle`)
- **KDF:** PBKDF2-SHA256 via Web Crypto API (200,000 iterations)
- **Analysis:** Vanilla TypeScript (frequency analysis, Kasiski examination)

## Hebrew Text Rendering

This demo renders Hebrew text using Unicode with `dir="rtl"` for correct right-to-left display. Modern browsers handle this natively. The demo uses standard Hebrew Unicode block characters (U+0590–U+05FF) and requires no special fonts, though "Noto Serif Hebrew" is preferred if available.

---

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*
