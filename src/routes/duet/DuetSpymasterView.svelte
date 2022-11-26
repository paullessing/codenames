<script lang="ts">
  import { DuetFieldType, generateSpymaster } from '../../codenames/duet';

  export let seed = '';
  export let player: 'a' | 'b';

  let spymasterData: DuetFieldType[][];

  $: {
    const cards = generateSpymaster(seed);
    const playerCards = cards.map(([a, b]) => (player === 'a' ? a : b));
    spymasterData = [];

    for (let i = 0; i < 5; i++) {
      let row: DuetFieldType[] = [];
      for (let j = 0; j < 5; j++) {
        row.push(playerCards[i * 5 + j]);
      }
      spymasterData.push(row);
    }
  }
</script>

<table style="margin-bottom: 2rem;">
  {#each spymasterData as row}
    <tr>
      {#each row as entry}
        <td class="cell {entry}">&nbsp;</td>
      {/each}
    </tr>
  {/each}
</table>

<style lang="scss">
  .cell {
    width: 24px;
    height: 16px;

    &.Agent {
      background-color: green;
    }

    &.Assassin {
      background-color: #222;
    }

    &.Bystander {
      background-color: beige;
    }
  }
</style>
