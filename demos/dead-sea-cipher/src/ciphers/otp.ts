/**
 * One-Time Pad — information-theoretically secure when used correctly.
 * Frank Miller (1882), reinvented by Gilbert Vernam (1917).
 * Shannon proved perfect secrecy in "Communication Theory of Secrecy Systems" (1949).
 * Fatal flaw: key must be as long as the message, truly random, and never reused.
 */

export function generateOTPKey(length: number): Uint8Array {
  const key = new Uint8Array(length);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(key);
  } else {
    // Fallback for test environments
    for (let i = 0; i < length; i++) {
      key[i] = Math.floor(Math.random() * 256);
    }
  }
  return key;
}

export function otpEncrypt(plaintext: Uint8Array, key: Uint8Array): Uint8Array {
  if (key.length < plaintext.length) {
    throw new Error('Key must be at least as long as the plaintext');
  }
  const ciphertext = new Uint8Array(plaintext.length);
  for (let i = 0; i < plaintext.length; i++) {
    ciphertext[i] = plaintext[i] ^ key[i];
  }
  return ciphertext;
}

export function otpDecrypt(ciphertext: Uint8Array, key: Uint8Array): Uint8Array {
  // XOR is its own inverse
  return otpEncrypt(ciphertext, key);
}

export function otpKeyReuseAttack(c1: Uint8Array, c2: Uint8Array): Uint8Array {
  const len = Math.min(c1.length, c2.length);
  const result = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    result[i] = c1[i] ^ c2[i];
  }
  return result;
}

export function textToBytes(text: string): Uint8Array {
  return new TextEncoder().encode(text);
}

export function bytesToText(bytes: Uint8Array): string {
  return new TextDecoder().decode(bytes);
}

export function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

export function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}
