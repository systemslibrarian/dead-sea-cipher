/**
 * Vigenère cipher — polyalphabetic substitution.
 * Actually invented by Giovan Battista Bellaso (1553).
 * Blaise de Vigenère described a different autokey cipher;
 * the misattribution persists to this day.
 * Broken by Friedrich Kasiski (1863); Babbage broke it ~1854 but never published.
 */

const ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export function vigenereEncrypt(text: string, key: string): string {
  if (!key || key.length === 0) throw new Error('Key must not be empty');
  const upperKey = key.toUpperCase().replace(/[^A-Z]/g, '');
  if (upperKey.length === 0) throw new Error('Key must contain at least one letter');

  let result = '';
  let keyIndex = 0;
  for (const ch of text) {
    const upperIdx = ALPHA.indexOf(ch.toUpperCase());
    if (upperIdx === -1) {
      result += ch;
      continue;
    }
    const shift = ALPHA.indexOf(upperKey[keyIndex % upperKey.length]);
    const encrypted = (upperIdx + shift) % 26;
    result += ch === ch.toUpperCase() ? ALPHA[encrypted] : ALPHA[encrypted].toLowerCase();
    keyIndex++;
  }
  return result;
}

export function vigenereDecrypt(text: string, key: string): string {
  if (!key || key.length === 0) throw new Error('Key must not be empty');
  const upperKey = key.toUpperCase().replace(/[^A-Z]/g, '');
  if (upperKey.length === 0) throw new Error('Key must contain at least one letter');

  let result = '';
  let keyIndex = 0;
  for (const ch of text) {
    const upperIdx = ALPHA.indexOf(ch.toUpperCase());
    if (upperIdx === -1) {
      result += ch;
      continue;
    }
    const shift = ALPHA.indexOf(upperKey[keyIndex % upperKey.length]);
    const decrypted = (upperIdx - shift + 26) % 26;
    result += ch === ch.toUpperCase() ? ALPHA[decrypted] : ALPHA[decrypted].toLowerCase();
    keyIndex++;
  }
  return result;
}
