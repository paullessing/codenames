<script lang="ts">
  import { DuetGame, GuessResult, Player } from '../../codenames/duet';
  import { createEventDispatcher } from 'svelte';
  import { ViewMode } from './[seed]/[player]/view-mode.enum';

  const dispatch = createEventDispatcher<{
    guess: { row: number; column: number };
  }>();

  export let viewMode: ViewMode;
  export let gameState: DuetGame;
  export let player: Player;

  $: getGuessCss = (row: number, column: number): string => {
    const guessResult = gameState.getGuessResult(row, column);
    if (guessResult === GuessResult.AGENT || guessResult === GuessResult.ASSASSIN) {
      return guessResult;
    }
    if (viewMode === ViewMode.SPYMASTER) {
      return gameState.getSolution(row, column)[player === Player.A ? 0 : 1];
    } else {
      if (~gameState.getBystanders(row, column).indexOf(player)) {
        return 'bystander'; // TODO this is very messy
      }
      return guessResult;
    }
  };
</script>

<div class="duet-board">
  {#each Array(5) as _, row}
    {#each Array(5) as _, column}
      <div class="duet-board__cell">
        <button class="card {getGuessCss(row, column)}" on:click={() => dispatch('guess', { row, column })}
          >{gameState.getWord(row, column)}{#if gameState.getBystanders(row, column).length}
            <br />{gameState
              .getBystanders(row, column)
              .map((player) => `🤔${player.toLocaleUpperCase()}`)
              .join(', ')}
          {/if}
        </button>
      </div>
    {/each}
  {/each}
</div>

<!--</table>-->
<style lang="scss">
  .duet-board {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-template-rows: repeat(5, 1fr);
    gap: 4px 4px;
    max-width: 800px;
  }

  .card {
    width: 100%;
    height: 100%;
    min-height: 80px;
    font-family: sans-serif;
    padding: 5px;
    text-align: center;

    background-color: beige;

    border-radius: 0.5rem;

    &.Agent {
      background-color: green;
      color: white;
    }

    &.agent {
      background-color: green;
      color: transparent;
      border: 4px black solid;
    }

    &.bystander {
      background-color: beige;
      color: #999;
      border: 4px black solid;
    }

    &.Assassin,
    &.assassin {
      background-color: #222;
      color: white;
    }

    &.Bystander {
      background-color: beige;
    }

    &.unguessed {
      background-color: beige;
    }
  }
</style>
