<script lang="ts">
    import { Button } from "$lib/components/ui/button/index";
    import * as Card from "$lib/components/ui/card/index.js";
    import type { PageProps } from "./$types";

    let { data }: PageProps = $props();
</script>

<div class="overflow-auto p-6">
    <div class="mb-4">
        <a href="/">
            <Button variant="outline">← Back to Gallery</Button>
        </a>
    </div>

    <div class="grid grid-cols-[3fr_2fr] gap-6">
        <div>
            <img
                src={data.image.image_key}
                alt={data.image.title ?? ""}
                class="w-full rounded-lg border"
            />
        </div>

        <div class="flex flex-col gap-6">
            <Card.Root>
                <Card.Header>
                    <Card.Title class="text-2xl">
                        {data.image.title ?? "Untitled"}
                    </Card.Title>
                    <Card.Description>
                        {data.image.description ?? "No description"}
                    </Card.Description>
                </Card.Header>
                <Card.Content>
                    <p class="text-sm text-muted-foreground">
                        Created on {new Date(data.image.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                    </p>
                </Card.Content>
            </Card.Root>

            {#if data.books.length > 0}
                <Card.Root>
                    <Card.Header>
                        <Card.Title>Inspired By</Card.Title>
                        <Card.Description>
                            {data.books.length} book{data.books.length > 1 ? "s" : ""}
                        </Card.Description>
                    </Card.Header>
                    <Card.Content class="flex flex-col gap-3">
                        {#each data.books as bookItem}
                            <div
                                class="flex items-center gap-3 rounded-lg border p-3"
                            >
                                {#if bookItem.image_url}
                                    <img
                                        src={bookItem.image_url}
                                        alt={`Cover of ${bookItem.title}`}
                                        class="h-16 w-auto rounded"
                                    />
                                {/if}
                                <div>
                                    <p class="font-medium">
                                        {bookItem.title ?? "Unknown Title"}
                                    </p>
                                </div>
                            </div>
                        {/each}
                    </Card.Content>
                </Card.Root>
            {/if}
        </div>
    </div>
</div>

