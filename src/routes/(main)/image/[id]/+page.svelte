<script lang="ts">
    import { Button } from "$lib/components/ui/button/index";
    import type { PageProps } from "./$types";

    let { data }: PageProps = $props();
</script>

<div class="max-w-5xl mx-auto px-6 py-10">
    <!-- Back -->
    <a
        href="/"
        class="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-8 group"
    >
        <span class="group-hover:-translate-x-0.5 transition-transform">←</span>
        Gallery
    </a>

    <!-- Two-column on lg+, single on mobile -->
    <div class="flex flex-col lg:grid lg:grid-cols-[1fr_320px] gap-8">
        <!-- Image -->
        <div>
            <img
                src={data.image.image_key}
                alt={data.image.title ?? ""}
                class="w-full h-auto block bg-muted"
            />
        </div>

        <!-- Info -->
        <div class="flex flex-col gap-6">
            <div>
                <h1 class="text-lg font-semibold leading-snug">
                    {data.image.title ?? "Untitled"}
                </h1>
                <p class="text-sm text-muted-foreground mt-2 leading-relaxed">
                    {data.image.description ?? "No description."}
                </p>
                <p class="text-xs text-muted-foreground mt-4">
                    {new Date(data.image.createdAt).toLocaleDateString(
                        "en-US",
                        {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        },
                    )}
                </p>
            </div>

            {#if data.books.length > 0}
                <div>
                    <p
                        class="text-xs text-muted-foreground uppercase tracking-widest mb-3"
                    >
                        Inspired by
                    </p>
                    <div class="flex flex-col gap-2">
                        {#each data.books as bookItem}
                            <div
                                class="flex items-center gap-3 py-2 border-b border-border last:border-0"
                            >
                                {#if bookItem.image_url}
                                    <img
                                        src={bookItem.image_url}
                                        alt={`Cover of ${bookItem.title}`}
                                        class="h-12 w-auto bg-muted shrink-0"
                                    />
                                {/if}
                                <p class="text-sm">
                                    {bookItem.title ?? "Unknown"}
                                </p>
                            </div>
                        {/each}
                    </div>
                </div>
            {/if}

            <form action="?/delete" method="POST">
                <Button
                    type="submit"
                    variant="destructive"
                    class="w-full text-xs">Delete</Button
                >
            </form>
        </div>
    </div>
</div>
