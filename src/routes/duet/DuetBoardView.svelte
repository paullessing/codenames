<script lang="ts">
  import { DuetFieldType, generateBoard, generateSpymaster } from '../../codenames/duet';

  export let seed = '';
  export let player: 'a' | 'b';


  export let viewMode: 'board' | 'spymaster' = 'board';

  interface BoardField {
    index: number;
    word: string;
    field: DuetFieldType;
  }

  let spymasterData: BoardField[][];

  let confirmChoice: BoardField | null = null;

  $: words = generateBoard(seed);
  $: cards = generateSpymaster(seed);
  $: {
    const playerCards = cards.map(([a, b]) => (player === 'a' ? a : b));
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

    // TODO figure out whether this is a valid answer and display somehow
  }
</script>

<table style="margin-bottom: 2rem;">
  {#each spymasterData as row}
    <tr>
      {#each row as entry}
        <td
          class="cell {viewMode === 'spymaster' ? entry.field : ''}"
          on:click={() => viewMode === 'board' ? confirmChoice = entry : ''}
        >{entry.word}</td>
      {/each}
    </tr>
  {/each}
</table>

{#if viewMode === 'board' && confirmChoice !== null}
  <button
    on:click={confirmSelection}
  >Confirm {confirmChoice.word}</button>
  <br/>
  <br/>
{/if}

<button
  on:click={() => viewMode = viewMode === 'board' ? 'spymaster' : 'board'}
>{viewMode === 'board' ? 'Spymaster View' : 'Board View'}</button>

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

    &.Assassin {
      background-color: #222;
      color: white;
    }

    &.Bystander {
      background-color: beige;
    }
  }
</style>
