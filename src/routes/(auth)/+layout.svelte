<script lang="ts">
	import "../layout.css";
	import ThemeToggle from "$lib/components/ui/theme-toggle/ThemeToggle.svelte";
	import Logo from "$lib/components/Logo.svelte";

	let { children } = $props();
</script>

<div class="min-h-dvh w-full flex flex-col items-center justify-center px-4 py-16 bg-background">
	<!-- Theme toggle -->
	<div class="fixed top-4 right-4 z-50">
		<ThemeToggle />
	</div>

	<!-- Brand -->
	<div class="mb-10 text-center flex flex-col items-center">
		<Logo size={64} />
	</div>

	<!-- Auth card -->
	<div class="w-full max-w-sm">
		{@render children()}
	</div>
</div>
