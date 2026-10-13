<script lang="ts">
    import { Button } from "$lib/components/ui/button/index";
    import type { PageProps } from "./$types";
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

<div class="max-w-6xl mx-auto px-6 py-10">
    {#if (data.images?.length ?? 0) <= 0}
        <!-- Empty state -->
        <div
            class="flex flex-col items-center justify-center min-h-[60vh] gap-5 text-center"
        >
            <p class="text-sm text-muted-foreground">No images yet.</p>
            <a href="/create">
                <Button>Create your first image</Button>
            </a>
        </div>
    {:else}
        <!-- Page label -->
        <div class="mb-8 flex items-center justify-between">
            <p class="text-xs text-muted-foreground tracking-widest uppercase">
                {data?.count ?? 0} images
            </p>
            <a href="/create">
                <Button size="sm" variant="outline">+ Create</Button>
            </a>
        </div>

        <!-- Grid -->
        <div
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border"
        >
            {#each [...data.images, ...imagesList] as image}
                <a
                    href={`/image/${image.id}`}
                    class="group bg-background block overflow-hidden"
                >
                    <div class="relative overflow-hidden">
                        <img
                            src={image.image_key}
                            alt={image.title}
                            class="aspect-video w-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                        />
                    </div>
                    <div class="p-4">
                        <p class="text-sm font-medium text-foreground truncate">
                            {image.title}
                        </p>
                        <p
                            class="text-xs text-muted-foreground mt-0.5 line-clamp-2 leading-relaxed"
                        >
                            {image.description}
                        </p>
                    </div>
                </a>
            {/each}
        </div>

        <!-- Load more -->
        <div class="mt-10 text-center">
            {#if allImagesLoaded}
                <p class="text-xs text-muted-foreground">All images loaded.</p>
            {:else}
                <Button
                    onclick={() => loadMore()}
                    variant="outline"
                    class="min-w-32"
                >
                    Load more
                </Button>
            {/if}
        </div>
    {/if}
</div>
