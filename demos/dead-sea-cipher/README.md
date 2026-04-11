# Dead Sea Cipher

## What It Is

Dead Sea Cipher is a browser-based interactive demo covering five eras of cryptographic history: Atbash (a simple Hebrew letter-substitution cipher from ~600 BCE), Caesar cipher (shift cipher), Vigenère cipher (polyalphabetic substitution), the One-Time Pad (XOR with a truly random key), and AES-256-GCM (authenticated symmetric encryption via the Web Crypto API with PBKDF2-SHA256 key derivation at 200,000 iterations). Each cipher is implemented in pure TypeScript with a live encoder/decoder and a working attack that demonstrates its fatal flaw — from Caesar brute-force to Kasiski examination to OTP key-reuse to GCM tamper detection. The security model progresses from no key space (Atbash) to computational security (AES-256-GCM symmetric authenticated encryption).

## When to Use It

- **Teaching cryptographic history end-to-end** — the demo walks from the oldest known cipher (Jeremiah's Atbash) to modern authenticated encryption in a single interactive timeline.
- **Demonstrating why each classical cipher fails** — every panel includes a working attack so students can see the vulnerability firsthand rather than read about it.
- **Showing AES-256-GCM authenticated encryption in the browser** — uses the Web Crypto API directly, with PBKDF2 key derivation, a random IV, and GCM integrity verification.
- **Exploring the Hebrew Bible's use of Atbash** — the demo includes original Hebrew text rendering for Jeremiah 25:26, 51:1, and 51:41 with both Latin and Hebrew Atbash encoders.
- **Do not use this for production encryption** — the demo is educational. Key material lives in the DOM and is never protected against side-channel extraction.

## Live Demo

[**systemslibrarian.github.io/crypto-lab-dead-sea-cipher/**](https://systemslibrarian.github.io/crypto-lab-dead-sea-cipher/)

The demo presents a tabbed timeline (Atbash → Caesar → Vigenère → OTP → AES → Full Arc). Each tab lets you type plaintext, adjust parameters (e.g. Caesar shift 1–25, Vigenère keyword, AES passphrase), and see real-time encryption output. Every classical cipher tab includes a "Break It" button that runs the corresponding cryptanalytic attack live in the browser.

## How to Run Locally

```bash
git clone https://github.com/systemslibrarian/crypto-lab-dead-sea-cipher.git
cd crypto-lab-dead-sea-cipher/demos/dead-sea-cipher
npm install
npm run dev
```

## Part of the Crypto-Lab Suite

This demo is part of the [Crypto-Lab](https://systemslibrarian.github.io/crypto-lab/) collection of interactive cryptography demonstrations.

---

*"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31*
