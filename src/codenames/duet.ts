import { pickRandom, shuffle } from '../util/random';
import { WORDLISTS } from './wordlists/english';

export enum DuetFieldType {
  Bystander = 'Bystander',
  Agent = 'Agent',
  Assassin = 'Assassin',
}

export type DuetField = readonly [agentA: DuetFieldType, agentB: DuetFieldType];

const DUET_ALL_FIELDS = [
  [DuetFieldType.Agent, DuetFieldType.Agent],
  [DuetFieldType.Agent, DuetFieldType.Agent],
  [DuetFieldType.Agent, DuetFieldType.Agent],

  [DuetFieldType.Agent, DuetFieldType.Bystander],
  [DuetFieldType.Agent, DuetFieldType.Bystander],
  [DuetFieldType.Agent, DuetFieldType.Bystander],
  [DuetFieldType.Agent, DuetFieldType.Bystander],
  [DuetFieldType.Agent, DuetFieldType.Bystander],

  [DuetFieldType.Bystander, DuetFieldType.Agent],
  [DuetFieldType.Bystander, DuetFieldType.Agent],
  [DuetFieldType.Bystander, DuetFieldType.Agent],
  [DuetFieldType.Bystander, DuetFieldType.Agent],
  [DuetFieldType.Bystander, DuetFieldType.Agent],

  [DuetFieldType.Bystander, DuetFieldType.Bystander],
  [DuetFieldType.Bystander, DuetFieldType.Bystander],
  [DuetFieldType.Bystander, DuetFieldType.Bystander],
  [DuetFieldType.Bystander, DuetFieldType.Bystander],
  [DuetFieldType.Bystander, DuetFieldType.Bystander],
  [DuetFieldType.Bystander, DuetFieldType.Bystander],
  [DuetFieldType.Bystander, DuetFieldType.Bystander],

  [DuetFieldType.Agent, DuetFieldType.Assassin],
  [DuetFieldType.Bystander, DuetFieldType.Assassin],
  [DuetFieldType.Assassin, DuetFieldType.Assassin],
  [DuetFieldType.Assassin, DuetFieldType.Agent],
  [DuetFieldType.Assassin, DuetFieldType.Bystander],
] as const;

export const enum Player {
  A = 'a',
  B = 'b',
}

enum Guesses {
  NONE,
  A,
  B,
  BOTH,
}

export enum GuessResult {
  UNGUESSED = 'unguessed',
  AGENT = 'agent',
  ASSASSIN = 'assassin',
}

export class GameState {
  private readonly guesses: readonly Guesses[];

  constructor(private readonly solution: readonly DuetField[], state?: readonly Guesses[]) {
    if (state) {
      this.guesses = state;
    } else {
      this.guesses = new Array(25).fill(Guesses.NONE);
    }
  }

  public hash(): string {
    let result: number[] = [];
    for (const guess of this.guesses) {
      result = [...result, guess % 2, Math.floor(guess / 2)];
    }

    console.log('Result is', this.binaryToString(result));
    return result.join('');
  }

  private binaryToString(binary: number[]): string {
    const characters = 'abcdefghkmnopqrstuvwxyz123456789';
    let result = '';
    const CHUNK_SIZE = 5;
    for (let start = 0; start < binary.length; start += CHUNK_SIZE) {
      let value = 0;
      for (let i = 0; i < CHUNK_SIZE; i++) {
        value <<= 1;
        value += binary[start + i] ?? 0;
      }
      result += characters[value];
    }
    return result;
  }

  // private stringToBinary(value: string): number[] {
  //   const characters = 'abcdefghkmnopqrstuvwxyz123456789';
  // }

  // public static fromHash(seed: string, hash: string): GameState {
  //   return new GameState([]); // TODO
  // }

  public guess(targetField: number, player: Player): GameState {
    console.log('Guessing', targetField, player);
    return new GameState(
      this.solution,
      this.guesses.map((currentValue: Guesses, index: number) => {
        if (index !== targetField) {
          return currentValue;
        }
        if (currentValue === Guesses.BOTH) {
          throw new Error('Cannot guess, already guessed both');
        }
        if (player === Player.A) {
          switch (currentValue) {
            case Guesses.A:
              throw new Error('Cannot guess this field, already guessed');
            case Guesses.B:
              return Guesses.BOTH;
            default:
              return Guesses.A;
          }
        } else {
          switch (currentValue) {
            case Guesses.A:
              return Guesses.BOTH;
            case Guesses.B:
              throw new Error('Cannot guess this field, already guessed');
            default:
              return Guesses.B;
          }
        }
      })
    );
  }

  public getGuessResult(index: number): GuessResult {
    if (index < 0 || index >= 25) {
      throw new Error('Index out of bounds');
    }
    const guesses = this.guesses[index];
    const solution = this.solution[index];

    // Note that guess A corresponds to solution 1, and vice versa
    // because each player sees the other person's solutions
    if (
      (solution[1] === DuetFieldType.Agent && guesses === Guesses.A) ||
      (solution[0] === DuetFieldType.Agent && guesses === Guesses.B) ||
      (solution.includes(DuetFieldType.Agent) && guesses === Guesses.BOTH)
    ) {
      return GuessResult.AGENT;
    }
    if (
      (solution[1] === DuetFieldType.Assassin && guesses === Guesses.A) ||
      (solution[0] === DuetFieldType.Assassin && guesses === Guesses.B) ||
      (solution.includes(DuetFieldType.Assassin) && guesses === Guesses.BOTH)
    ) {
      return GuessResult.ASSASSIN;
    }
    return GuessResult.UNGUESSED;
  }

  public getBystanders(index: number): Player[] {
    if (index < 0 || index >= 25) {
      throw new Error('Index out of bounds');
    }
    const state = this.guesses[index];
    const solution = this.solution[index];

    const bystanders = [];

    if ((state === Guesses.A || state === Guesses.BOTH) && solution[1] === DuetFieldType.Bystander) {
      bystanders.push(Player.A);
    }
    if ((state === Guesses.B || state === Guesses.BOTH) && solution[0] === DuetFieldType.Bystander) {
      bystanders.push(Player.B);
    }
    return bystanders;
  }
}

export function generateSpymaster(seed: string): readonly DuetField[] {
  return shuffle(DUET_ALL_FIELDS, seed);
}

export function generateBoard(seed: string): string[] {
  return pickRandom(WORDLISTS['English (Duet)'], 25, seed);
}
