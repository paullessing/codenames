<script lang="ts">
  import { DuetFieldType, generateBoard, generateSpymaster } from '../../codenames/duet';

  export let seed = '';
  export let player: 'a' | 'b';

  let spymasterData: {
    word: string;
    field: DuetFieldType;
  }[][];

  $: {
    const words = generateBoard(seed);
    const cards = generateSpymaster(seed);
    const playerCards = cards.map(([a, b]) => (player === 'a' ? a : b));
    spymasterData = [];

    for (let i = 0; i < 5; i++) {
      let row: {
        word: string;
        field: DuetFieldType;
      }[] = [];
      for (let j = 0; j < 5; j++) {
        const index = i * 5 + j;
        row.push({
          word: words[index],
          field: playerCards[index],
        });
      }
      spymasterData.push(row);
    }
  }
</script>

<table style="margin-bottom: 2rem;">
  {#each spymasterData as row}
    <tr>
      {#each row as entry}
        <td class="cell {entry.field}">{entry.word}</td>
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
