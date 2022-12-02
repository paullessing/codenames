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

export class DuetGame {
  private constructor(
    private readonly words: readonly string[],
    private readonly solution: readonly DuetField[],
    private readonly guesses: readonly Guesses[]
  ) {}

  public static create(seed: string): DuetGame {
    const words = generateBoard(seed);
    const solution = generateSpymaster(seed);
    const guesses: Guesses[] = new Array(25).fill(Guesses.NONE);

    return new DuetGame(words, solution, guesses);
  }

  public hash(): string {
    return this.guesses.join('');
  }

  public getWord(row: number, column: number): string {
    return this.words[row * 5 + column];
  }

  public getSolution(row: number, column: number): DuetField {
    return this.solution[row * 5 + column];
  }

  public guess(row: number, column: number, player: Player): DuetGame {
    // console.log('Guessing', row, column, player);
    const targetIndex = row * 5 + column;
    return new DuetGame(
      this.words,
      this.solution,
      this.guesses.map((currentValue: Guesses, index: number) => {
        if (index !== targetIndex) {
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

  public getGuessResult(row: number, column: number): GuessResult {
    if (row < 0 || row >= 5 || column < 0 || column >= 5) {
      throw new Error('Index out of bounds');
    }
    const guesses = this.guesses[row * 5 + column];
    const solution = this.solution[row * 5 + column];

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

  public getBystanders(row: number, column: number): Player[] {
    if (row < 0 || row >= 5 || column < 0 || column >= 5) {
      throw new Error('Index out of bounds');
    }
    const guess = this.guesses[row * 5 + column];
    const solution = this.solution[row * 5 + column];

    const bystanders = [];

    if ((guess === Guesses.A || guess === Guesses.BOTH) && solution[1] === DuetFieldType.Bystander) {
      bystanders.push(Player.A);
    }
    if ((guess === Guesses.B || guess === Guesses.BOTH) && solution[0] === DuetFieldType.Bystander) {
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
