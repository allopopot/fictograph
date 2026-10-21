<script lang="ts">
    import { selectedTitles } from "../books.svelte";
    import DotField from "$lib/components/DotField.svelte";
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";

    async function generate() {
        const response = await fetch("/generate", {
            method: "POST",
            body: JSON.stringify(selectedTitles),
            headers: { "content-type": "application/json" },
        });
        const data = (await response.json()) as { id: string };
        if (data?.id) {
            goto(`/image/${data?.id}`);
        } else {
            goto(`/`);
        }
    }

    onMount(() => {
        if (selectedTitles.length <= 0) {
            goto("/create");
        } else {
            generate();
        }
    });
</script>

<div class="w-full h-[calc(100dvh-4rem)] p-8">
    <div class="w-full h-full rounded-4xl border-2 border-secondary">
        <DotField
            dotRadius={1.5}
            dotSpacing={14}
            cursorRadius={200}
            cursorForce={0.1}
            bulgeOnly={true}
            bulgeStrength={67}
            glowRadius={160}
            sparkle={false}
            waveAmplitude={0}
            gradientFrom="#FFFFFF"
            gradientTo="#060606"
        ></DotField>
    </div>
    <p
        class="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] text-3xl font-semibold"
    >
        Generating
    </p>
</div>
