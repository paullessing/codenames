import seedrandom from 'seedrandom';
import type { PRNG } from 'seedrandom';

export function pickRandom<T>(list: readonly T[], count: number, rngOrSeed?: string | PRNG): T[] {
  const rng = getRng(rngOrSeed);

  const values = list.slice();
  // Randomise the list using Fisher-Yates shuffle
  for (let i = list.length - 1; i >= list.length - count; i--) {
    const newPosition = numberUpTo(rng, i);
    // console.log('swapping', i, newPosition);
    if (i === newPosition) {
      continue;
    }
    const tempValue = values[newPosition];
    values[newPosition] = values[i];
    values[i] = tempValue;
  }

  return values.slice(list.length - count);
}

export function numberUpTo(rng: seedrandom.PRNG, exclusiveMaximum: number): number {
  return Math.floor(rng.quick() * exclusiveMaximum);
}

export function shuffle<T>(list: readonly T[], rngOrSeed?: string | PRNG): T[] {
  return pickRandom(list, list.length, rngOrSeed);
}

function getRng(rngOrSeed: string | seedrandom.PRNG | undefined): PRNG {
  if (typeof rngOrSeed === 'undefined') {
    return seedrandom();
  } else if (typeof rngOrSeed === 'string') {
    return seedrandom(rngOrSeed);
  } else {
    return rngOrSeed;
  }
}
