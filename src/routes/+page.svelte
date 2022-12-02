<script lang="ts">
  import { Player } from '../codenames/duet';
  import { goto } from '$app/navigation';

  const now = new Date();

  let seed = `${now.getMonth() + 1}${now.getDate()}`;
  let player: Player = Player.A;
</script>

<h1>Code Names</h1>

<label>
  Seed
  <input bind:value={seed} />
</label>
<br />
<label>
  <input bind:group={player} value={Player.A} type="radio" />
  Player A
</label><br />
<label>
  <input bind:group={player} value={Player.B} type="radio" />
  Player B
</label><br />

<button on:click={() => goto(`/duet/${seed}/${player}`)}>Play Codenames: Duet</button>
