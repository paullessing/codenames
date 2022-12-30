<script lang="ts">
  import { DuetFieldType, DuetGame, GuessResult, Player } from '@codenames/duet';
  import { createEventDispatcher } from 'svelte';
  import { ViewMode } from './view-mode.enum';

  const dispatch = createEventDispatcher<{
    guess: { index: number };
  }>();

  export let viewMode: ViewMode;
  export let gameState: DuetGame;
  export let player: Player;
  let pendingChoice: number | null = null;

  $: cards = new Array(25).fill(null).map(
    (
      _,
      index
    ): {
      index: number;
      word: string;
      solution: { player: DuetFieldType; spymaster: DuetFieldType };
      result: { solution: GuessResult; bystanders: Player[] };
    } => {
      const [solution1, solution2] = gameState.getSolution(index);
      const solution =
        player === Player.A
          ? {
              player: solution2,
              spymaster: solution1,
            }
          : {
              player: solution1,
              spymaster: solution2,
            };
      const guessResult = gameState.getGuessResult(index);
      const bystanders = gameState.getBystanders(index);
      const word = gameState.getWord(index);

      return {
        index,
        word,
        solution,
        result: {
          solution: guessResult,
          bystanders,
        },
      };
    }
  );

  const clickCard = (index: number) => {
    console.log('clicked', index);
    if (!gameState.canGuess(index, player)) {
      console.debug('Invalid index clicked', index);
      return;
    }
    if (index === pendingChoice) {
      dispatch('guess', { index });
      pendingChoice = null;
    } else {
      pendingChoice = index;
    }
  };

  const mapFieldTypeToCssClass = (fieldType: DuetFieldType): string =>
    ({
      [DuetFieldType.Agent]: 'agent',
      [DuetFieldType.Assassin]: 'assassin',
      [DuetFieldType.Bystander]: 'bystander',
    }[fieldType]);

  const mapGuessToCssClass = (guess: GuessResult): string =>
    ({
      [GuessResult.AGENT]: 'agent',
      [GuessResult.ASSASSIN]: 'assassin',
      [GuessResult.UNGUESSED]: 'unguessed',
    }[guess]);
</script>

<div
  class="duet-board"
  class:duet-board--gameover={gameState.isGameOver()}
  class:duet-board--spymaster={viewMode === ViewMode.SPYMASTER}
>
  {#each cards as card, index}
    <button
      style="cursor: {gameState.canGuess(index, player) ? 'pointer' : 'default'}"
      class="duet-board__card duet-board__card--spymaster-{mapFieldTypeToCssClass(
        card.solution.spymaster
      )} duet-board__card--guess-{mapGuessToCssClass(card.result.solution)}"
      class:duet-board__card--guess-bystander={card.result.bystanders.includes(player)}
      class:duet-board__card--pending={pendingChoice === index}
      on:click={() => clickCard(index)}
      >{card.word}{#if card.result.bystanders.length}
        <div style="font-size: 0.8em">
          {card.result.bystanders.map((player) => `🤔${player.toLocaleUpperCase()}`).join(', ')}
        </div>
      {/if}
    </button>
  {/each}
</div>

{#if pendingChoice !== null}
  <p style="text-align: center; font-size: 1.2em;">
    Click the card again to confirm {gameState.getWord(pendingChoice)}
  </p>
{/if}

<style lang="scss">
  .duet-board {
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    grid-template-rows: repeat(5, minmax(0, 1fr));
    gap: 4px 4px;
    max-width: 800px;
    margin: 0 auto;

    &--gameover {
      opacity: 0.8;
    }

    &__card {
      width: 100%;
      height: 100%;
      min-height: 80px;
      font-size: min(2.5vw, 1.2rem);
      font-family: Rubik, 'Open Sans', Helvetica, Arial, sans-serif;
      padding: 5px;
      text-align: center;

      background-color: beige;
      border: none;
      box-shadow: 1px 1px 2px 1px rgba(#000, 0.3);

      border-radius: 0.5rem;

      @mixin overlay($color) {
        position: relative;
        &::before {
          display: block;
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          border-radius: inherit;
          content: '';
          background-color: $color;
        }
      }

      &--guess {
        &-agent {
          background-color: green;
          color: transparent;
          box-shadow: 1px 1px 2px 3px rgba(#000, 0.3);
        }

        &-assassin {
          background-color: #222;
          color: white;
        }

        &-unguessed {
          background-color: beige;
        }

        .duet-board:not(.duet-board--spymaster) &-bystander {
          background: repeating-linear-gradient(-45deg, beige, beige 10px, #b3b3a1 10px, #b3b3a1 20px);
          background-color: beige;
        }
      }

      .duet-board--spymaster & {
        &--spymaster {
          &-agent {
            @include overlay(rgba(green, 0.3));
          }

          &-assassin {
            @include overlay(rgba(black, 0.3));
          }
        }
      }

      &--pending {
        @include overlay(rgba(#000, 0.3));
      }
    }
  }
</style>
