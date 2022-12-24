<script lang="ts">
  import { DuetGame, GuessResult, Player } from '@codenames/duet';
  import { createEventDispatcher } from 'svelte';
  import { ViewMode } from './view-mode.enum';

  const dispatch = createEventDispatcher<{
    guess: { index: number };
  }>();

  export let viewMode: ViewMode;
  export let gameState: DuetGame;
  export let player: Player;
  let pendingChoice: number | null = null;

  $: getGuessCss = (index: number): string => {
    const guessResult = gameState.getGuessResult(index);
    if (guessResult === GuessResult.AGENT || guessResult === GuessResult.ASSASSIN) {
      return guessResult;
    }
    if (viewMode === ViewMode.SPYMASTER) {
      return gameState.getSolution(index)[player === Player.A ? 0 : 1];
    } else {
      if (~gameState.getBystanders(index).indexOf(player)) {
        return 'bystander'; // TODO this is very messy
      }
      return guessResult;
    }
  };

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
</script>

<div class="duet-board" class:duet-board--gameover={gameState.isGameOver()}>
  {#each Array(25) as _, index}
    <div class="duet-board__cell">
      <button
        style="cursor: {gameState.canGuess(index, player) ? 'pointer' : 'default'}"
        class="card {getGuessCss(index)} {pendingChoice === index ? 'pending' : ''}"
        on:click={() => clickCard(index)}
        >{gameState.getWord(index)}{#if gameState.getBystanders(index).length}
          <div style="font-size: 0.8em">
            {gameState
              .getBystanders(index)
              .map((player) => `🤔${player.toLocaleUpperCase()}`)
              .join(', ')}
          </div>
        {/if}
      </button>
    </div>
  {/each}
</div>

{#if pendingChoice !== null}
  <p style="text-align: center; font-size: 1.2em;">
    Click the card again to confirm {gameState.getWord(pendingChoice)}
  </p>
{/if}

<!--</table>-->
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
  }

  .card {
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

    &.Agent {
      //background-color: green;
      //color: white;
      @include overlay(rgba(green, 0.3));
    }
    &.Assassin {
      @include overlay(rgba(black, 0.3));
    }
    //&.Bystander {
    //  background-color: beige;
    //}

    &.agent {
      background-color: green;
      color: transparent;
      box-shadow: 1px 1px 2px 3px rgba(#000, 0.3);
    }

    &.bystander {
      background-color: beige;
      background: repeating-linear-gradient(-45deg, beige, beige 10px, #b3b3a1 10px, #b3b3a1 20px);
    }

    &.assassin {
      background-color: #222;
      color: white;
    }

    &.unguessed {
      background-color: beige;
    }

    &.pending {
      @include overlay(rgba(#000, 0.3));
    }
  }
</style>
