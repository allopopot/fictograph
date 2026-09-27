<script lang="ts">
    import type { LayoutProps } from "./$types";

    let { data, children }: LayoutProps = $props();
</script>

<h1>Main</h1>
<h2>Hello, {data.user.name}</h2>
{@render children()}
