import { pickRandom, shuffle } from '../util/random';
import { WORDLISTS } from './wordlists/english';
import { indexArray, sum } from '../util/array';

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

function switchPlayer(player: Player): Player {
  return player === Player.A ? Player.B : Player.A;
}

function getSolutionIndex(player: Player): 0 | 1 {
  // Return the solution for this player's guesses, which is the other player's view
  return player === Player.A ? 1 : 0;
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

enum GameState {
  SETUP = 'SETUP',
  IN_PROGRESS = 'IN_PROGRESS',
  GAME_OVER = 'GAME_OVER',
}

export class DuetGame {
  private constructor(
    public readonly currentPlayer: Player,
    private readonly gameState: GameState,
    private readonly words: readonly string[],
    private readonly solution: readonly DuetField[],
    private readonly guesses: readonly Guesses[]
  ) {
    console.log('Constructor called for DuetGame');
    this.gameState = indexArray(25).reduce(
      (isGameOver, index) => isGameOver || this.getGuessResult(index) === GuessResult.ASSASSIN,
      false
    )
      ? GameState.GAME_OVER
      : gameState;

    console.log(this);
  }

  public static create(seed: string): DuetGame {
    const words = generateBoard(seed);
    const solution = generateSpymaster(seed);
    const guesses: Guesses[] = new Array(25).fill(Guesses.NONE);

    return new DuetGame(Player.A, GameState.SETUP, words, solution, guesses);
  }

  public start(player?: Player): DuetGame {
    if (this.gameState !== GameState.SETUP) {
      throw new Error('Cannot start, already started');
    }
    return new DuetGame(player ?? this.currentPlayer, GameState.IN_PROGRESS, this.words, this.solution, this.guesses);
  }

  public getTotalTurns(): number {
    return this.guesses.reduce(
      (total: number, guess: Guesses) =>
        total +
        {
          [Guesses.NONE]: 0,
          [Guesses.A]: 1,
          [Guesses.B]: 1,
          [Guesses.BOTH]: 2,
        }[guess],
      0
    );
  }

  public getBystanderGuessesUsed(): number {
    return indexArray(25)
      .map((index) => this.getBystanders(index).length)
      .reduce(sum());
  }

  public hash(): string {
    return this.guesses.join('');
  }

  public isStarted(): boolean {
    return this.gameState !== GameState.SETUP;
  }

  public isGameOver(): boolean {
    return this.gameState === GameState.GAME_OVER;
  }

  public getWord(index: number): string {
    return this.words[index];
  }

  /**
   * Returns the solution for a field, regardless of whether it has been guessed.
   * @param index Index for the field.
   */
  public getSolution(index: number): DuetField {
    return this.solution[index];
  }

  public canGuess(index: number, player: Player): boolean {
    if (this.gameState !== GameState.IN_PROGRESS) {
      return false;
    }
    const result = this.getGuessResult(index);
    if (result !== GuessResult.UNGUESSED) {
      console.debug('Result is guessed', result);
      return false;
    }
    if (this.getBystanders(index).includes(player)) {
      console.debug('Already guessed bystanders', index);
      return false;
    }
    return true;
  }

  public guess(index: number): DuetGame {
    // console.log('Guessing', row, column, player);
    const targetIndex = index;

    const currentValue = this.guesses[index];
    const newValue: Guesses = addGuess(currentValue, this.currentPlayer);
    const isAgent = this.solution[index][getSolutionIndex(this.currentPlayer)] === DuetFieldType.Agent;
    const nextPlayer = isAgent ? this.currentPlayer : switchPlayer(this.currentPlayer);
    console.log('New player:', nextPlayer, this.getGuessResult(index));

    return new DuetGame(
      nextPlayer,
      this.gameState,
      this.words,
      this.solution,
      this.guesses.map((currentValue: Guesses, index: number) => (index === targetIndex ? newValue : currentValue))
    );
  }

  public getGuessResult(index: number): GuessResult {
    if (index < 0 || index >= 25) {
      throw new Error('Index out of bounds');
    }
    const guesses = this.guesses[index];
    const solution = this.solution[index];
    return this.getGuessResultForField(solution, guesses);
  }

  private getGuessResultForField(solution: readonly [agentA: DuetFieldType, agentB: DuetFieldType], guesses: Guesses) {
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
    const guess = this.guesses[index];
    const [solutionB, solutionA] = this.solution[index];

    const bystanders = [];

    if (solutionA === DuetFieldType.Bystander && [Guesses.A, Guesses.BOTH].includes(guess)) {
      bystanders.push(Player.A);
    }
    if (solutionB === DuetFieldType.Bystander && [Guesses.B, Guesses.BOTH].includes(guess)) {
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

function addGuess(guesses: Guesses, player: Player): Guesses {
  if (guesses === Guesses.BOTH) {
    throw new Error('Cannot guess, already guessed both');
  }
  if (player === Player.A) {
    switch (guesses) {
      case Guesses.A:
        throw new Error('Cannot guess this field, already guessed');
      case Guesses.B:
        return Guesses.BOTH;
      default:
        return Guesses.A;
    }
  } else {
    switch (guesses) {
      case Guesses.A:
        return Guesses.BOTH;
      case Guesses.B:
        throw new Error('Cannot guess this field, already guessed');
      default:
        return Guesses.B;
    }
  }
}
