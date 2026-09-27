<script lang="ts">
	import "../layout.css";
	import favicon from "$lib/assets/favicon.svg";

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<div class="h-dvh w-full grid place-items-center-safe">
	<div class="w-full max-w-sm">
		<h1 class="text-2xl p-4 font-semibold italic">Fictograph</h1>
		{@render children()}
	</div>
</div>
