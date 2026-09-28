<script lang="ts">
    import { Button } from "$lib/components/ui/button/index";
    import type { PageProps } from "./$types";

    let { data }: PageProps = $props();
</script>

<div class="overflow-auto grid place-items-center">
    <div class="grid place-items-center">
        <p>Welcome, {data.user.name}</p>
        <Button href="/create">Create</Button>
    </div>
</div>
