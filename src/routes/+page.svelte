<script lang="ts">
  import { Player } from '@codenames/duet';
  import { goto } from '$app/navigation';

  const now = new Date();

  let seed = `${now.getMonth() + 1}${now.getDate()}`;
</script>

<div class="body">
  <h1 class="page-title">Codenames: Duet</h1>

  <label class="labelled-input">
    <span class="labelled-input__label">Seed</span>
    <input class="text-input labelled-input__input" bind:value={seed} />
  </label>
  <br />

  <button class="button button--player-a" on:click={() => goto(`/duet/${seed}/${Player.A}`)}>Player A</button>
  <button class="button button--player-b" on:click={() => goto(`/duet/${seed}/${Player.B}`)}>Player B</button>
</div>

<style lang="scss">
  .body {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .page-title {
    font-family: 'Special Elite', cursive;
  }

  .labelled-input {
    display: flex;
    flex-direction: column;

    &__label {
      order: 2;
      font-size: 0.8em;
      color: #666;
      padding-left: 0.5em;
    }
    &__input {
      font-family: 'Courier Prime', 'Courier New', monospace;
      text-align: center;
    }
  }

  .button {
    display: inline-block;
    padding: 8px;
    color: white;
    font-size: 1.5rem;
    margin-bottom: 1rem;

    border: none;
    border-radius: 4px;
    background-color: #555;
    box-shadow: 2px 2px 4px 0 rgba(#000, 0.2);

    @each $player in a, b {
      &--player-#{$player} {
        background-color: var(--color-player-#{$player});
      }
    }
  }
</style>
