<script lang="ts">
  const now = new Date();

  let seed = `${now.getMonth() + 1}${now.getDate()}`;
  let player = 'a';
</script>

<h1>Code Names</h1>

<label>
  Seed
  <input bind:value={seed} />
</label>
<br />
<label>
  <input bind:group={player} value="a" type="radio" />
  Player A
</label><br />
<label>
  <input bind:group={player} value="b" type="radio" />
  Player B
</label><br />

<a href="duet/{seed}/{player}">Play Codenames: Duet</a>
