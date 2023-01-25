<script>
  import Toast from '@components/toast/Toast.svelte';
</script>

<slot />

<!--<button on:click={() => addMessage({ text: 'Hello world ' + Math.random() })}>Add Toast</button>-->
<Toast />

<style lang="scss">
  :global {
    :root {
      --color-player-a: #041263;
      --color-player-b: #810a0a;
    }

    body {
      font-family: 'Open Sans', Helvetica, Arial, sans-serif;
      font-size: 16px;
      background-color: #e8e5d9;
    }

    .typewriter-title {
      font-family: 'Special Elite', cursive;
    }

    .text-input {
      padding: 8px;
      font-size: 1.5rem;
      border-radius: 4px;
      border: none;
      background-color: beige;
      box-shadow: inset 2px 2px 4px rgba(#000, 0.2);
    }

    .radio-button {
      & > input {
        display: none;
      }

      &__label {
        display: inline-block;
        padding: 8px;
        color: white;
        font-size: 1.5rem;

        border-radius: 4px;
        background-color: #555;
        box-shadow: 2px 2px 4px 0 rgba(#000, 0.2);
        z-index: -1;

        input:checked ~ & {
          background-color: #ccc;
          color: inherit;
          box-shadow: inset 2px 2px 4px rgba(#000, 0.2);
        }
      }
    }

    .link-button {
      background: none;
      border: none;
      display: inline;
      text-decoration: underline;
      color: inherit;
      font-family: inherit;
      cursor: pointer;
      padding: 0;
      margin: 0;
    }

    .button {
      background-color: beige;
      border: none;
      box-shadow: 1px 1px 2px 1px rgba(#000, 0.3);

      border-radius: 0.5rem;

      min-height: 40px;
      padding: 16px;

      &:active {
        box-shadow: inset 1px 1px 2px 1px rgba(#000, 0.3);
      }
    }
  }
</style>
