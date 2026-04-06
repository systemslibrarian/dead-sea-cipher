/**
 * Caesar cipher cracking via chi-squared frequency analysis.
 * Uses statistical fitness to rank all 25 possible shifts.
 */

import { chiSquaredFitness } from './frequency.ts';
import { caesarDecrypt } from '../ciphers/caesar.ts';

export interface CaesarCrackResult {
  likelyShift: number;
  confidence: number;
  allDecryptions: Array<{ shift: number; text: string; score: number }>;
}

export function crackCaesar(ciphertext: string): CaesarCrackResult {
  const allDecryptions: Array<{ shift: number; text: string; score: number }> = [];

  for (let shift = 0; shift < 26; shift++) {
    const text = caesarDecrypt(ciphertext, shift);
    const score = chiSquaredFitness(text);
    allDecryptions.push({ shift, text, score });
  }

  // Sort by chi-squared score (lower = better fit to English)
  allDecryptions.sort((a, b) => a.score - b.score);

  const best = allDecryptions[0];
  const secondBest = allDecryptions[1];

  // Confidence: ratio of second-best to best score (higher = more confident)
  const confidence = secondBest.score > 0 && best.score > 0
    ? Math.min(1, 1 - (best.score / secondBest.score))
    : 0;

  return {
    likelyShift: best.shift,
    confidence,
    allDecryptions,
  };
}
