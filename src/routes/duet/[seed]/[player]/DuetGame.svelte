<script lang="ts">
  import { DuetGame, Player } from '@codenames/duet';
  import DuetBoard from './DuetBoard.svelte';
  import { ViewMode } from '../../view-mode.enum';
  import { showToast } from '@components/toast';

  export let seed = '';
  export let player: Player;
  export let guesses: {
    turns: number;
    bystanders: number;
  } = {
    // TODO this is a placeholder
    turns: 9,
    bystanders: 7,
  };

  let showSpymaster = false;

  let gameState: DuetGame = DuetGame.create(seed);

  $: getViewMode = (): ViewMode => {
    if (gameState.isStarted() && gameState.currentPlayer !== player) {
      return ViewMode.SPYMASTER;
    } else {
      return showSpymaster ? ViewMode.SPYMASTER : ViewMode.BOARD;
    }
  };

  $: turnsRemaining = new Array(guesses.turns - gameState.getTotalTurns()).fill(null).map((_, index) => {
    const bystandersRemaining = guesses.bystanders - gameState.getBystanderGuessesUsed();
    if (index >= bystandersRemaining) {
      return '🧳';
    } else {
      return '🤔';
    }
  });

  const toggleSpymaster = (show: boolean) => () => (showSpymaster = show);

  const guess = ({ detail: { index: guessPosition } }) => {
    const previousPlayer = gameState.currentPlayer;
    gameState = gameState.guess(guessPosition);

    if (previousPlayer !== gameState.currentPlayer) {
      showToast({
        text: `New player: ${gameState.currentPlayer.toUpperCase()}`,
      });
    }
  };

  const startGame = (player: Player) => {
    gameState = gameState.start(player);
  };
</script>

<div style="margin-bottom: 1rem; text-align: center">
  {#if gameState.isGameOver()}
    <div style="font-size: 2rem">Game Over</div>
  {:else if gameState.isStarted()}
    <div style="font-size: 0.8rem">Guessing:</div>
    <div style="font-size: 2rem">
      Player {gameState.currentPlayer.toUpperCase()}
      {#if player === gameState.currentPlayer} (You){/if}
    </div>
  {:else}
    <div>
      <button class="button" on:click={() => startGame(Player.A)}>Player A guesses first</button>
      <button class="button" on:click={() => startGame(Player.B)}>Player B guesses first</button>
    </div>
  {/if}
</div>

<!--
<div class="turns-remaining">
  {#each turnsRemaining as turn}
    {turn}
  {/each}
</div>
-->

<DuetBoard viewMode={getViewMode()} {gameState} {player} on:guess={guess} />

{#if !gameState.isStarted() || player === gameState.currentPlayer}
  <button
    class="button spymaster-button"
    title="Show Spymaster View"
    on:mousedown={toggleSpymaster(true)}
    on:mouseup={toggleSpymaster(false)}
    on:touchstart={toggleSpymaster(true)}
    on:touchend={toggleSpymaster(false)}><span class="material-symbols-outlined">person_search</span></button
  >
{/if}

<!--<button on:click={() => (viewMode = viewMode === ViewMode.BOARD ? ViewMode.SPYMASTER : ViewMode.BOARD)}-->
<!--  >{viewMode === ViewMode.BOARD ? 'Spymaster View' : 'Board View'}</button-->
<!--&gt;-->
<br />
<br />
<br />
<br />
{gameState.hash()}

<style lang="scss">
  .spymaster-button {
    position: absolute;
    bottom: 2rem;
    right: 2rem;
    user-select: none;
  }
</style>
