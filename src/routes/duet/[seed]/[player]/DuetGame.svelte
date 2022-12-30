<script lang="ts">
  import { DuetGame, GuessResult, Player } from '@codenames/duet';
  import DuetBoard from '../../DuetBoardView.svelte';
  import { ViewMode } from '../../view-mode.enum';
  import { showToast } from '@components/toast';

  export let seed = '';
  export let player: Player;
  let activePlayer: Player = Player.A;

  let showSpymaster = false;

  let gameState: DuetGame = DuetGame.create(seed);

  $: getViewMode = (): ViewMode => {
    if (activePlayer !== player) {
      return ViewMode.SPYMASTER;
    } else {
      return showSpymaster ? ViewMode.SPYMASTER : ViewMode.BOARD;
    }
  }

  const toggleSpymaster = (show: boolean) => () => showSpymaster = show;

  const guess = ({ detail: { index: guessPosition } }) => {
    gameState = gameState.guess(guessPosition, activePlayer);
    const newState = gameState.getGuessResult(guessPosition);

    if (newState !== GuessResult.AGENT) {
      activePlayer = activePlayer === Player.A ? Player.B : Player.A;
      showToast({
        text: `New player: ${activePlayer.toUpperCase()}`,
      });
    }
  };
</script>

<div style="margin-bottom: 1rem; text-align: center">
  {#if gameState.isGameOver()}
    <div style="font-size: 2rem">Game Over</div>
  {:else}
    <div style="font-size: 0.8rem">Guessing:</div>
    <div style="font-size: 2rem">
      Player {activePlayer.toUpperCase()}
      {#if player === activePlayer} (You){/if}
    </div>
    <button class="link-button" on:click={() => (activePlayer = activePlayer === Player.A ? Player.B : Player.A)}
      >Switch</button
    >
  {/if}
</div>

<DuetBoard viewMode={getViewMode()} {gameState} {player} on:guess={guess} />

{#if player === activePlayer}
  <button
    on:mousedown={toggleSpymaster(true)}
    on:mouseup={toggleSpymaster(false)}
    on:touchstart={toggleSpymaster(true)}
    on:touchend={toggleSpymaster(false)}
  >Spymaster</button>
{/if}

<!--<button on:click={() => (viewMode = viewMode === ViewMode.BOARD ? ViewMode.SPYMASTER : ViewMode.BOARD)}-->
<!--  >{viewMode === ViewMode.BOARD ? 'Spymaster View' : 'Board View'}</button-->
<!--&gt;-->
<br />
<br />
<br />
<br />
{gameState.hash()}
