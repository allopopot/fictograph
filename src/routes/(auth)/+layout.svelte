<script lang="ts">
	import "../layout.css";
	import favicon from "$lib/assets/favicon.svg";
	import ThemeToggle from "$lib/components/ui/theme-toggle/ThemeToggle.svelte";

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<div class="min-h-dvh w-full flex flex-col items-center justify-center px-4 py-16 bg-background">
	<!-- Theme toggle -->
	<div class="fixed top-4 right-4 z-50">
		<ThemeToggle />
	</div>

	<!-- Brand -->
	<div class="mb-10 text-center">
		<p class="text-xs text-muted-foreground tracking-[0.2em] uppercase mb-2">Fictograph</p>
	</div>

	<!-- Auth card -->
	<div class="w-full max-w-sm">
		{@render children()}
	</div>
</div>
