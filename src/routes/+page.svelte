<script lang="ts">
  // import { WORDLISTS } from '../wordlists/english';

  const now = new Date();

  let seed = `${now.getMonth() + 1}${now.getDate()}`;
  import { generateDuetSpymaster } from '../codenames/spymaster';

  $: spymaster = generateDuetSpymaster(seed);

  const fields: number[][] = [];
  for (let i = 0; i < 5; i++) {
    let row: number[] = [];
    for (let j = 0; j < 5; j++) {
      row.push(i * 5 + j);
    }
    fields.push(row);
  }
</script>

<h1>Code Names</h1>

<!--<ol>-->
<!--  {#each WORDLISTS['English (Duet)'] as word}-->
<!--    <li>{word}</li>-->
<!--  {/each}-->
<!--</ol>-->

<input bind:value={seed} />

<table style="margin-bottom: 2rem;">
  {#each fields as row}
    <tr>
      {#each row as entry}
        <td class="cell {spymaster[entry][0]}">&nbsp;</td>
      {/each}
    </tr>
  {/each}
</table>
<table>
  {#each fields as row}
    <tr>
      {#each row as entry}
        <td class="cell {spymaster[entry][1]}">&nbsp;</td>
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
