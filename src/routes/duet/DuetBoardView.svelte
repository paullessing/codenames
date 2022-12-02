<script lang="ts">
  import {
    DuetFieldType,
    GameState,
    generateBoard,
    generateSpymaster,
    GuessResult,
    Player,
  } from '../../codenames/duet';

  export let seed = '';
  export let player: Player;
  let activePlayer: Player = player;

  export let viewMode: 'board' | 'spymaster' = 'board';

  interface BoardField {
    index: number;
    word: string;
    field: DuetFieldType;
  }

  let spymasterData: BoardField[][];

  let confirmChoice: BoardField | null = null;

  let words = generateBoard(seed);
  let cards = generateSpymaster(seed);
  let gameState: GameState = new GameState(cards);

  $: {
    const playerCards = cards.map(([a, b]) => (player === Player.A ? a : b));
    spymasterData = [];

    for (let i = 0; i < 5; i++) {
      let row: BoardField[] = [];
      for (let j = 0; j < 5; j++) {
        const index = i * 5 + j;
        row.push({
          index,
          word: words[index],
          field: playerCards[index],
        });
      }
      spymasterData.push(row);
    }
  }

  const confirmSelection = () => {
    if (!confirmChoice) {
      return;
    }

    gameState = gameState.guess(confirmChoice.index, activePlayer);
    const newState = gameState.getGuessResult(confirmChoice.index);

    console.log(newState);
    if (newState !== GuessResult.AGENT) {
      console.log('switching player');
      activePlayer = activePlayer === Player.A ? Player.B : Player.A;
      if (activePlayer !== player) {
        viewMode = 'spymaster';
      } else {
        viewMode = 'board';
      }
    }

    confirmChoice = null;
  };

  $: getGuessCss = (entry: BoardField): string => {
    const guessResult = gameState.getGuessResult(entry.index);
    if (guessResult === GuessResult.AGENT || guessResult === GuessResult.ASSASSIN) {
      return guessResult;
    }
    if (viewMode === 'spymaster') {
      return entry.field;
    } else {
      if (~gameState.getBystanders(entry.index).indexOf(player)) {
        return 'bystander'; // TODO this is very messy
      }
      return guessResult;
    }
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

<table style="margin-bottom: 2rem;">
  {#each spymasterData as row}
    <tr>
      {#each row as entry}
        <!-- TODO add a11y for this on:click handler if it sticks around -->
        <td class="cell {getGuessCss(entry)}" on:click={() => (confirmChoice = entry)}
          >{entry.word}{#if gameState.getBystanders(entry.index).length}
            <br />{gameState
              .getBystanders(entry.index)
              .map((player) => `🤔${player.toLocaleUpperCase()}`)
              .join(', ')}
          {/if}</td
        >
      {/each}
    </tr>
  {/each}
</table>

{#if confirmChoice !== null}
  <button on:click={confirmSelection}>Confirm {confirmChoice.word}</button>
  <br />
  <br />
{/if}

<button on:click={() => (viewMode = viewMode === 'board' ? 'spymaster' : 'board')}
  >{viewMode === 'board' ? 'Spymaster View' : 'Board View'}</button
>

<br />
{gameState.hash()}

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
