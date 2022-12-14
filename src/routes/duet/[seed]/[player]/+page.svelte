<script lang="ts">
  import { page } from '$app/stores';
  import { Player } from '@codenames/duet.js';
  import DuetGame from './DuetGame.svelte';

  const { seed, player } = $page.params;
</script>

<h1 class="typewriter-title">Codenames: Duet</h1>

<DuetGame {seed} {player} />

<br />

Seed: {seed}
<br />
Player {player === Player.A ? 'A' : 'B'}

<br />
<br />
<br />
<a href="/">Home</a>
