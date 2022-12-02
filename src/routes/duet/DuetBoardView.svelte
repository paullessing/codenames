<script lang="ts">
  import { DuetGame, GuessResult, Player } from '../../codenames/duet';
  import { createEventDispatcher } from 'svelte';
  import { ViewMode } from './[seed]/[player]/view-mode.enum';

  const dispatch = createEventDispatcher();

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

<table style="margin-bottom: 2rem;">
  {#each Array(5) as _, row}
    <tr>
      {#each Array(5) as _, column}
        <!-- TODO add a11y for this on:click handler if it sticks around -->
        <td class="cell {getGuessCss(row, column)}" on:click={() => dispatch('guess', { row, column })}
          >{gameState.getWord(row, column)}{#if gameState.getBystanders(row, column).length}
            <br />{gameState
              .getBystanders(row, column)
              .map((player) => `🤔${player.toLocaleUpperCase()}`)
              .join(', ')}
          {/if}</td
        >
      {/each}
    </tr>
  {/each}
</table>

<style lang="scss">
  .cell {
    width: 20%;
    height: 16px;
    font-family: sans-serif;
    padding: 5px;
    text-align: center;

    background-color: beige;

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
