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

enum FieldState {
  UNKNOWN,
  GUESSED_A,
  GUESSED_B,
  GUESSED_BOTH,
}

class GameState {
  private readonly state: readonly FieldState[];

  constructor(state?: readonly FieldState[]) {
    if (state) {
      this.state = state;
    } else {
      this.state = new Array(25).fill(FieldState.UNKNOWN);
    }
  }

  public guess(field: number, player: 'a' | 'b'): GameState {
    const newValue = player === 'a' ? FieldState.GUESSED_A : FieldState.GUESSED_B;
    // TODO consider validation
    // TODO figure out new state from old value
    return new GameState(this.state.map((_, index) => (index === field ? newValue : this.state[index])));
  }
}

export function generateSpymaster(seed: string): readonly DuetField[] {
  return shuffle(DUET_ALL_FIELDS, seed);
}

export function generateBoard(seed: string): string[] {
  return pickRandom(WORDLISTS['English (Duet)'], 25, seed);
}
