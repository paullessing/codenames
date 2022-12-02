<script lang="ts">
  import { DuetGame, GuessResult, Player } from '../../../../codenames/duet';
  import DuetBoardView from '../../DuetBoardView.svelte';
  import { ViewMode } from './view-mode.enum';

  export let seed = '';
  export let player: Player;
  let activePlayer: Player = Player.A;

  export let viewMode: ViewMode = ViewMode.BOARD;

  let confirmChoice: { row: number; column: number } | null = null;

  let gameState: DuetGame = DuetGame.create(seed);

  const confirmSelection = () => {
    if (!confirmChoice) {
      return;
    }

    gameState = gameState.guess(confirmChoice.row, confirmChoice.column, activePlayer);
    const newState = gameState.getGuessResult(confirmChoice.row, confirmChoice.column);

    if (newState !== GuessResult.AGENT) {
      activePlayer = activePlayer === Player.A ? Player.B : Player.A;
      if (activePlayer !== player) {
        viewMode = ViewMode.SPYMASTER;
      } else {
        viewMode = ViewMode.BOARD;
      }
    }

    confirmChoice = null;
  };
</script>

Active Player:<br />
<label>
  <input bind:group={activePlayer} value={Player.A} type="radio" />
  Player A{player === Player.A ? ' (You)' : ''}
</label><br />
<label>
  <input bind:group={activePlayer} value={Player.B} type="radio" />
  Player B{player === Player.B ? ' (You)' : ''}
</label><br />

<DuetBoardView
  {viewMode}
  {gameState}
  {player}
  on:guess={({ detail: { row, column } }) => (confirmChoice = { row, column })}
/>

{#if confirmChoice !== null}
  <button on:click={confirmSelection}>Confirm {gameState.getWord(confirmChoice.row, confirmChoice.column)}</button>
  <br />
  <br />
{/if}

<button on:click={() => (viewMode = viewMode === ViewMode.BOARD ? ViewMode.SPYMASTER : ViewMode.BOARD)}
  >{viewMode === ViewMode.BOARD ? 'Spymaster View' : 'Board View'}</button
>
<br />
{gameState.hash()}
