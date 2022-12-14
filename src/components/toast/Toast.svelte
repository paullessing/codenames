<script lang="ts">
  import { fade, fly } from 'svelte/transition';
  import { dismissFirstToast, toast } from './toast';
  import type { ToastConfig } from './toast';

  const VISIBILITY_DURATION_MS = 5000;

  let lastToast: ToastConfig | null = null;
  toast.subscribe((value) => {
    if (value && value !== lastToast) {
      console.log('update', value, lastToast);
      setTimeout(() => {
        dismissFirstToast();
      }, VISIBILITY_DURATION_MS);
      lastToast = value;
      console.log('hiu');
    }
  });

  const dismiss = () => {
    dismissFirstToast();
  };
</script>

{#if $toast !== null}
  <div class="toast" in:fade out:fly={{ x: -400 }}>
    <p class="toast__body">
      {$toast.text}
    </p>
    <button class="toast__dismiss" on:click={dismiss}>Dismiss</button>
  </div>
{/if}

<style lang="scss">
  .toast {
    $margin: 5px;
    position: fixed;
    bottom: $margin;
    left: $margin;
    right: $margin;

    border: 1px solid darken(#e0ffc4, 40);
    background-color: #e0ffc4;
    border-radius: 4px;
    box-shadow: 2px 2px 4px 2px rgba(#000, 0.2);

    padding: 8px 12px;
    display: flex;

    &__body {
      margin: 0;
      display: inline-block;
      flex-grow: 1;
    }

    &__dismiss {
      border: none;
      background: transparent;
      display: inline;
      text-decoration: underline;
      color: inherit;
      font-family: inherit;
      cursor: pointer;
      padding: 0;
      margin: 0;
      position: relative;

      &::before {
        $hitbox-size: 8px;
        position: absolute;
        content: '';
        left: -$hitbox-size;
        right: -$hitbox-size;
        top: -$hitbox-size;
        bottom: -$hitbox-size;
      }
    }
  }
</style>
