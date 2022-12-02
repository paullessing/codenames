<script lang="ts">
  import { page } from '$app/stores';
  import { generateBoard } from '../../../../codenames/duet';
  import DuetBoardView from '../../DuetBoardView.svelte';
  import { Player } from '../../../../codenames/duet.js';

  const { seed, player } = $page.params;

  $: board = generateBoard(seed);
</script>

<DuetBoardView {seed} {player} />

<br />

Seed: {seed}
<br />
Player {player === Player.A ? 'A' : 'B'}

<br />
<a href="/">Home</a>
