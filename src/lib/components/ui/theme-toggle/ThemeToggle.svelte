<script lang="ts">
	import { Moon, Sun } from '@lucide/svelte';
	import { onMount } from 'svelte';
	import { cn } from '$lib/utils';

	let isDark = $state(false);

	onMount(() => {
		const stored = localStorage.getItem('fictograph-theme');
		isDark = stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches);
		applyTheme(isDark);
	});

	function applyTheme(dark: boolean) {
		document.documentElement.classList.toggle('dark', dark);
		localStorage.setItem('fictograph-theme', dark ? 'dark' : 'light');
	}

	function toggle() {
		isDark = !isDark;
		applyTheme(isDark);
	}
</script>

<button
	onclick={toggle}
	aria-label="Toggle dark mode"
	class="h-8 w-8 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
>
	{#if isDark}
		<Sun size={15} />
	{:else}
		<Moon size={15} />
	{/if}
</button>
