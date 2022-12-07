<script lang="ts">
  import { Player } from '../codenames/duet';
  import { goto } from '$app/navigation';

  const now = new Date();

  let seed = `${now.getMonth() + 1}${now.getDate()}`;
  let player: Player = Player.A;
</script>

<h1 class="page-title">Codenames: Duet</h1>

<label>
  Seed
  <input class="text-input" bind:value={seed} />
</label>
<br />
<label class="radio-button">
  <input bind:group={player} value={Player.A} type="radio" />
  <span class="radio-button__label">Player A</span>
</label><br />
<label class="radio-button">
  <input bind:group={player} value={Player.B} type="radio" />
  <span class="radio-button__label">Player B</span>
</label><br />

<button on:click={() => goto(`/duet/${seed}/${player}`)}>Play Codenames: Duet</button>

<style lang="scss">
  .page-title {
    font-family: 'Special Elite', cursive;
  }
</style>
