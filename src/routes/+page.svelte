<script lang="ts">
  import DuetSpymasterView from './duet/DuetSpymasterView.svelte';

  const now = new Date();

  let seed = `${now.getMonth() + 1}${now.getDate()}`;
  let player = 'a';
</script>

<h1>Code Names</h1>

<input bind:value={seed} />
<input bind:group={player} value="a" type="radio" />
<input bind:group={player} value="b" type="radio" />

Player {player}

<DuetSpymasterView bind:player bind:seed />
