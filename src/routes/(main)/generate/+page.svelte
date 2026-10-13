<script lang="ts">
    import type { PageProps } from "./$types";
    import { selectedTitles } from "../books.svelte";
    import { Button } from "$lib/components/ui/button";
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";

    let { data }: PageProps = $props();

    let imageUrl: string = $state<string>("");
    let title: string = $state<string>("");
    let description: string = $state<string>("");

    async function generate() {
        const response = await fetch("/generate", {
            method: "POST",
            body: JSON.stringify(selectedTitles),
            headers: { "content-type": "application/json" },
        });
        const data = await response.formData();
        imageUrl = data.get("image")?.toString() ?? "";
        title = data.get("title")?.toString() ?? "";
        description = data.get("description")?.toString() ?? "";
    }

    onMount(() => {
        if (selectedTitles.length <= 0) {
            goto("/create");
        } else {
            generate();
        }
    });
</script>

<!-- Two-panel: stack on mobile, side-by-side on md+ -->
<div class="flex flex-col md:grid md:grid-cols-[1fr_280px] h-[calc(100dvh-3rem)] overflow-hidden">

    <!-- Left: Image output -->
    <div class="flex flex-col overflow-auto border-b md:border-b-0 md:border-r border-border">
        {#if imageUrl}
            <img src={imageUrl} alt={title} class="w-full h-auto block" />
            <div class="p-6 border-t border-border">
                <p class="text-base font-semibold">{title}</p>
                <p class="text-sm text-muted-foreground mt-2 leading-relaxed">{description}</p>
            </div>
        {:else}
            <div class="flex flex-col items-center justify-center flex-1 min-h-[50vh] gap-3">
                <div class="w-4 h-4 border border-foreground/30 border-t-foreground rounded-full animate-spin"></div>
                <p class="text-xs text-muted-foreground">Generating…</p>
            </div>
        {/if}
    </div>

    <!-- Right: Source books + actions -->
    <div class="flex flex-col overflow-hidden bg-muted/20">
        <div class="border-b border-border px-5 py-3">
            <p class="text-xs text-muted-foreground uppercase tracking-widest">Source books</p>
        </div>

        <div class="flex-1 overflow-auto p-5 flex flex-col gap-3">
            {#each selectedTitles as st}
                <div class="relative h-20 overflow-hidden bg-muted">
                    <img
                        class="absolute inset-0 w-full h-full object-cover opacity-50"
                        src={`https://covers.openlibrary.org/b/ID/${st.cover_i}-M.jpg`}
                        alt={`Cover of ${st.title}`}
                    />
                    <div class="absolute inset-0 flex items-center justify-center px-3">
                        <p class="text-xs font-medium text-white text-center leading-snug drop-shadow">{st.title}</p>
                    </div>
                </div>
            {/each}
        </div>

        <div class="p-5 border-t border-border flex flex-col gap-2">
            <a href="/create">
                <Button disabled={!imageUrl} variant="outline" class="w-full text-xs">
                    Create again
                </Button>
            </a>
            <a href="/">
                <Button disabled={!imageUrl} class="w-full text-xs">
                    Go to gallery
                </Button>
            </a>
        </div>
    </div>
</div>
