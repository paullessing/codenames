<script lang="ts">
  import { page } from '$app/stores';
  import DuetSpymasterView from '../../DuetSpymasterView.svelte';

  const { seed, player } = $page.params;
</script>

<DuetSpymasterView {seed} {player} />
