<script lang="ts">
	interface Props {
		title: string;
		description: string;
		image?: string;
		canonical?: string;
		noindex?: boolean;
	}

	let { title, description, image, canonical, noindex = false }: Props = $props();

	const baseUrl = 'https://fictograph.com';
	const ogImage = $derived(image ? `${baseUrl}${image}` : `${baseUrl}/og-image.svg`);
	const canonicalUrl = $derived(canonical ?? baseUrl);
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />

	{#if noindex}
		<meta name="robots" content="noindex, nofollow" />
	{/if}

	<link rel="canonical" href={canonicalUrl} />

	<!-- Open Graph -->
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:type" content="website" />
	<meta property="og:url" content={canonicalUrl} />
	<meta property="og:image" content={ogImage} />

	<!-- Twitter Card -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={ogImage} />
</svelte:head>
