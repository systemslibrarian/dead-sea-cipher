/**
 * Kasiski examination — breaking the Vigenère cipher.
 * Friedrich Kasiski published this method in 1863
 * ("Die Geheimschriften und die Dechiffrir-Kunst").
 * Charles Babbage broke the cipher ~1854 but never published.
 */

import { chiSquaredFitness } from './frequency.ts';

export interface KasiskiResult {
  probableKeyLength: number;
  candidateLengths: number[];
  repeatedSequences: Array<{ sequence: string; positions: number[]; spacing: number }>;
  explanation: string;
}

function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    [a, b] = [b, a % b];
  }
  return a;
}

function gcdOfArray(arr: number[]): number {
  return arr.reduce((a, b) => gcd(a, b));
}

export function kasiskiExamination(ciphertext: string, minSeqLength: number = 3): KasiskiResult {
  const clean = ciphertext.toUpperCase().replace(/[^A-Z]/g, '');
  const sequences: Map<string, number[]> = new Map();

  // Step 1: Find all repeated sequences of minSeqLength+ characters
  for (let len = minSeqLength; len <= Math.min(clean.length / 2, 20); len++) {
    for (let i = 0; i <= clean.length - len; i++) {
      const seq = clean.substring(i, i + len);
      if (!sequences.has(seq)) {
        sequences.set(seq, []);
      }
      sequences.get(seq)!.push(i);
    }
  }

  // Filter to only repeated sequences
  const repeated: Array<{ sequence: string; positions: number[]; spacing: number }> = [];
  const allSpacings: number[] = [];

  for (const [seq, positions] of sequences) {
    if (positions.length >= 2 && seq.length >= minSeqLength) {
      // Only keep longer sequences (avoid substrings of already found ones)
      const spacings: number[] = [];
      for (let i = 1; i < positions.length; i++) {
        spacings.push(positions[i] - positions[0]);
      }
      const spacing = spacings[0];
      allSpacings.push(...spacings);
      repeated.push({ sequence: seq, positions, spacing });
    }
  }

  // Deduplicate: keep only the longest overlapping sequences
  repeated.sort((a, b) => b.sequence.length - a.sequence.length);
  const kept: typeof repeated = [];
  for (const item of repeated) {
    const dominated = kept.some(k =>
      k.sequence.includes(item.sequence) &&
      item.positions.every(p => k.positions.some(kp => Math.abs(kp - p) < k.sequence.length))
    );
    if (!dominated) {
      kept.push(item);
    }
    if (kept.length >= 20) break;
  }

  // Step 2: Compute factor frequencies from spacings
  const factorCounts: Map<number, number> = new Map();
  for (const spacing of allSpacings) {
    for (let f = 2; f <= Math.min(spacing, 20); f++) {
      if (spacing % f === 0) {
        factorCounts.set(f, (factorCounts.get(f) || 0) + 1);
      }
    }
  }

  // Sort candidate lengths by frequency
  const candidateLengths = Array.from(factorCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(e => e[0]);

  const probableKeyLength = candidateLengths.length > 0 ? candidateLengths[0] : 1;

  // Build explanation
  let explanation = 'Kasiski Examination Steps:\n\n';
  explanation += `1. REPEATED SEQUENCES FOUND:\n`;
  for (const item of kept.slice(0, 10)) {
    explanation += `   "${item.sequence}" appears at positions [${item.positions.join(', ')}], spacing: ${item.spacing}\n`;
  }

  explanation += `\n2. SPACING ANALYSIS:\n`;
  explanation += `   All spacings: [${allSpacings.slice(0, 20).join(', ')}${allSpacings.length > 20 ? '...' : ''}]\n`;

  if (allSpacings.length >= 2) {
    const overallGcd = gcdOfArray(allSpacings);
    explanation += `   GCD of spacings: ${overallGcd}\n`;
  }

  explanation += `\n3. FACTOR FREQUENCY:\n`;
  for (const [factor, count] of Array.from(factorCounts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 5)) {
    explanation += `   Length ${factor}: appears as factor ${count} time(s)\n`;
  }

  explanation += `\n4. PROBABLE KEY LENGTH: ${probableKeyLength}\n`;

  // Step 3: Try to recover key if we have enough text
  if (clean.length >= probableKeyLength * 5) {
    explanation += `\n5. COLUMN ANALYSIS (key length = ${probableKeyLength}):\n`;
    const recoveredKey: string[] = [];

    for (let col = 0; col < probableKeyLength; col++) {
      let column = '';
      for (let i = col; i < clean.length; i += probableKeyLength) {
        column += clean[i];
      }

      // Find best shift for this column using chi-squared
      let bestShift = 0;
      let bestScore = Infinity;
      for (let shift = 0; shift < 26; shift++) {
        let decrypted = '';
        for (const ch of column) {
          decrypted += String.fromCharCode(((ch.charCodeAt(0) - 65 - shift + 26) % 26) + 65);
        }
        const score = chiSquaredFitness(decrypted);
        if (score < bestScore) {
          bestScore = score;
          bestShift = shift;
        }
      }
      const keyChar = String.fromCharCode(bestShift + 65);
      recoveredKey.push(keyChar);
      explanation += `   Column ${col + 1}: best shift = ${bestShift} → key letter '${keyChar}'\n`;
    }

    explanation += `\n6. RECOVERED KEY: "${recoveredKey.join('')}"`;
  }

  return {
    probableKeyLength,
    candidateLengths: candidateLengths.slice(0, 10),
    repeatedSequences: kept.slice(0, 10),
    explanation,
  };
}
