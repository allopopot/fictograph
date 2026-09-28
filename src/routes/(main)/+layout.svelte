<script lang="ts">
    import type { LayoutProps } from "./$types";
    import "../layout.css";
    import { Button } from "$lib/components/ui/button/index";

    let { data, children }: LayoutProps = $props();
</script>

<div class="w-full h-dvh grid grid-rows-[max-content_1fr] overflow-hidden">
    <div class="h-14 flex items-center-safe justify-between border-b px-8">
        <h1 class="text-lg italic font-semibold">Fictograph</h1>
        <div class="flex gap-2">
            <Button variant={"default"}>Create</Button>
            <form method="POST" action="/?/signout">
                <Button type="submit" variant={"destructive"}>Logout</Button>
            </form>
        </div>
    </div>
    {@render children()}
</div>
