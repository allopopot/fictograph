<script lang="ts">
    import { Button } from "$lib/components/ui/button/index";
    import type { PageProps } from "./$types";
    import * as Card from "$lib/components/ui/card/index.js";
    import type { ImageListResponse } from "./+server";
    import type { Image } from "$lib/server/db/schema";

    let { data }: PageProps = $props();
    let imagesList: Image[] = $state([]);
    let allImagesLoaded = $state(false);

    async function loadMore() {
        const lastId = imagesList?.at(-1)?.id ?? data.images?.at(-1)?.id;
        const url = new URL(window.location.href);
        url.searchParams.append("last_id", lastId?.toString() ?? "");
        const response = await fetch(url.toString());
        const responseBody: ImageListResponse = await response.json();
        if (responseBody.images.length <= 0) {
            allImagesLoaded = true;
        } else {
            responseBody.images.forEach((ax) => imagesList?.push(ax));
        }
    }
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
                        alt={image.title}
                        class="relative z-20 aspect-video w-full object-cover"
                    />
                    <Card.Header>
                        <Card.Title>{image.title}</Card.Title>
                        <Card.Description>
                            {image.description}
                        </Card.Description>
                    </Card.Header>
                    <Card.Footer>
                        <Button class="w-full">View Image</Button>
                    </Card.Footer>
                </Card.Root>
            {/each}
            {#each imagesList as image}
                <Card.Root class="relative group">
                    <img
                        src={image.image_key}
                        alt={image.title ?? ""}
                        class="relative z-20 aspect-video w-full object-cover"
                    />
                    <Card.Header>
                        <Card.Title>{image.title}</Card.Title>
                        <Card.Description>
                            {image.description}
                        </Card.Description>
                    </Card.Header>
                    <Card.Footer>
                        <Button class="w-full">View Image</Button>
                    </Card.Footer>
                </Card.Root>
            {/each}
        </div>
        <div class="mt-6">
            {#if allImagesLoaded}
                <Button
                    onclick={() => {
                        loadMore();
                    }}
                    disabled={true}
                    variant="outline"
                    class="w-full">Reached the End.</Button
                >
            {:else}
                <Button
                    onclick={() => {
                        loadMore();
                    }}
                    variant="outline"
                    class="w-full">Load More</Button
                >
            {/if}
        </div>
    {/if}
</div>
