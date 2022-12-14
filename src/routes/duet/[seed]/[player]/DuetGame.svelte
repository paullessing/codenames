<script lang="ts">
  import { DuetGame, GuessResult, Player } from '@codenames/duet';
  import DuetBoard from '../../DuetBoardView.svelte';
  import { ViewMode } from '../../view-mode.enum';
  import { showToast } from '@components/toast';

  export let seed = '';
  export let player: Player;
  let activePlayer: Player = Player.A;

  export let viewMode: ViewMode = ViewMode.BOARD;

  let confirmChoice: number | null = null;

  let gameState: DuetGame = DuetGame.create(seed);

  const guess = ({ detail: { index } }) => {
    confirmChoice = index;
  };

  const confirmSelection = () => {
    if (!confirmChoice) {
      return;
    }

    gameState = gameState.guess(confirmChoice, activePlayer);
    const newState = gameState.getGuessResult(confirmChoice);

    if (newState !== GuessResult.AGENT) {
      activePlayer = activePlayer === Player.A ? Player.B : Player.A;
      if (activePlayer !== player) {
        viewMode = ViewMode.SPYMASTER;
      } else {
        viewMode = ViewMode.BOARD;
      }
      showToast({
        text: `New player: ${activePlayer.toUpperCase()}`,
      });
    }

    confirmChoice = null;
  };
</script>

<div style="margin-bottom: 1rem; text-align: center">
  <div style="font-size: 0.8rem">Guessing:</div>
  <div style="font-size: 2rem">
    Player {activePlayer.toUpperCase()}
    {#if player === activePlayer} (You){/if}
  </div>
  <button class="link-button" on:click={() => (activePlayer = activePlayer === Player.A ? Player.B : Player.A)}
    >Switch</button
  >
</div>

<DuetBoard {viewMode} {gameState} {player} pendingChoice={confirmChoice} on:guess={guess} />

{#if confirmChoice !== null}
  <button on:click={confirmSelection}>Confirm {gameState.getWord(confirmChoice)}</button>
  <br />
  <br />
{/if}

<button on:click={() => (viewMode = viewMode === ViewMode.BOARD ? ViewMode.SPYMASTER : ViewMode.BOARD)}
  >{viewMode === ViewMode.BOARD ? 'Spymaster View' : 'Board View'}</button
>
<br />
{gameState.hash()}
