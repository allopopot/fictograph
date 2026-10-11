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
            headers: {
                "content-type": "application/json",
            },
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

<div class="overflow-hidden grid grid-cols-[3fr_1fr]">
    <div class="p-6">
        <div
            id="frame"
            class="border-2 border-gray-200 rounded-lg h-full w-full grid place-items-center-safe grid-flow-row"
        >
            {#if imageUrl}
                <img src={imageUrl} alt="" />
                <div class="p-4">
                    <h2 class="text-xl font-semibold mb-2">{title}</h2>
                    <p>{description}</p>
                </div>
            {:else}
                <p>Generating...</p>
            {/if}
        </div>
    </div>
    <div class="p-6">
        {#each selectedTitles as st}
            <div
                class="grid place-items-center p-8 rounded-lg mb-2 h-28 relative overflow-hidden border-2 border-gray-400"
            >
                <img
                    class="w-full h-auto absolute -z-10 blur-md opacity-90 brightness-50"
                    src={`https://covers.openlibrary.org/b/ID/${st.cover_i}-M.jpg`}
                    alt={`Cover of ${st.title}`}
                />
                <p class="text-md text-center text-background">{st.title}</p>
            </div>
        {/each}
        <a href="/create">
            <Button disabled={!imageUrl} class="w-full mb-1">
                Create Again
            </Button>
        </a>
        <a href="/">
            <Button disabled={!imageUrl} class="w-full">Home</Button>
        </a>
    </div>
</div>
