<script lang="ts">
    import { Button } from "$lib/components/ui/button/index";
    import type { PageProps } from "./$types";
    import * as Card from "$lib/components/ui/card/index.js";

    let { data }: PageProps = $props();
</script>

<div class="overflow-auto p-6">
    {#if (data.images?.length ?? 0) <= 0}
        <div class="grid place-items-center w-full h-full">
            <div>
                <p>Welcome, {data.user.name}</p>
                <Button href="/create">Create</Button>
            </div>
        </div>
    {:else}
        <div class="grid grid-cols-3 w-full gap-6">
            {#each data.images as image}
                <Card.Root class="relative group">
                    <img
                        src={image.image_key}
                        alt=""
                        class="relative z-20 aspect-video w-full object-cover brightness-60 grayscale dark:brightness-40 group-hover:grayscale-0 group-hover:brightness-100 transition"
                    />
                    <!-- <Card.Header>
                        <Card.Title>Design systems meetup</Card.Title>
                        <Card.Description>
                            A practical talk on component APIs, accessibility,
                            and shipping faster.
                        </Card.Description>
                    </Card.Header> -->
                    <Card.Footer>
                        <Button class="w-full">View Image</Button>
                    </Card.Footer>
                </Card.Root>
            {/each}
        </div>
    {/if}
</div>
