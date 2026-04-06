/**
 * Caesar cipher — shift cipher used by Julius Caesar (shift of 3).
 * Documented by Suetonius in "The Twelve Caesars", Chapter 56.
 * Broken trivially by brute force: only 25 possible shifts.
 */

const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWER = 'abcdefghijklmnopqrstuvwxyz';

export function caesarEncrypt(text: string, shift: number): string {
  shift = ((shift % 26) + 26) % 26;
  return shiftText(text, shift);
}

export function caesarDecrypt(text: string, shift: number): string {
  shift = ((shift % 26) + 26) % 26;
  return shiftText(text, 26 - shift);
}

function shiftText(text: string, shift: number): string {
  let result = '';
  for (const ch of text) {
    let idx = UPPER.indexOf(ch);
    if (idx !== -1) {
      result += UPPER[(idx + shift) % 26];
      continue;
    }
    idx = LOWER.indexOf(ch);
    if (idx !== -1) {
      result += LOWER[(idx + shift) % 26];
      continue;
    }
    result += ch;
  }
  return result;
}

export function caesarBruteForce(ciphertext: string): Array<{ shift: number; plaintext: string }> {
  const results: Array<{ shift: number; plaintext: string }> = [];
  for (let shift = 0; shift < 26; shift++) {
    results.push({
      shift,
      plaintext: caesarDecrypt(ciphertext, shift),
    });
  }
  return results;
}
