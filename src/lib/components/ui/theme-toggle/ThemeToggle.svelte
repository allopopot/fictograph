<script lang="ts">
	import { Moon, Sun } from '@lucide/svelte';
	import { onMount } from 'svelte';
	import { initTheme, toggleTheme, getIsDark } from '$lib/theme.svelte';

	onMount(() => {
		initTheme();
	});
</script>

<button
	onclick={toggleTheme}
	aria-label="Toggle dark mode"
	class="h-8 w-8 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
>
	{#if getIsDark()}
		<Sun size={15} />
	{:else}
		<Moon size={15} />
	{/if}
</button>
