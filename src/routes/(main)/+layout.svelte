<script lang="ts">
    import type { LayoutProps } from "./$types";
    import "../layout.css";
    import { Button } from "$lib/components/ui/button/index";
    import ThemeToggle from "$lib/components/ui/theme-toggle/ThemeToggle.svelte";

    let { data, children }: LayoutProps = $props();
    let mobileNavOpen = $state(false);
</script>

<div class="min-h-dvh flex flex-col bg-background">
    <!-- Header: sticky + relative so the absolute dropdown is anchored beneath it -->
    <header
        class="h-12 border-b border-border flex items-center px-6 sticky top-0 z-50 bg-background"
    >
        <div class="flex-1 flex items-center gap-8">
            <a
                href="/"
                class="text-sm font-medium tracking-tight text-foreground"
            >
                Fictograph
            </a>
        </div>

        <!-- Right side -->
        <div class="flex items-center gap-2">
            <ThemeToggle />
            <!-- Signout -->
            <form method="POST" action="/?/signout" class="hidden sm:block">
                <button
                    type="submit"
                    class="text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1"
                >
                    Sign out
                </button>
            </form>
            <!-- Mobile menu toggle -->
            <button
                onclick={() => (mobileNavOpen = !mobileNavOpen)}
                class="sm:hidden text-muted-foreground hover:text-foreground transition-colors p-1"
                aria-label="Menu"
            >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    {#if mobileNavOpen}
                        <path
                            d="M2 2l12 12M14 2L2 14"
                            stroke="currentColor"
                            stroke-width="1.5"
                            stroke-linecap="round"
                        />
                    {:else}
                        <path
                            d="M2 4h12M2 8h12M2 12h12"
                            stroke="currentColor"
                            stroke-width="1.5"
                            stroke-linecap="round"
                        />
                    {/if}
                </svg>
            </button>
        </div>

        <!-- Mobile nav dropdown — inside the sticky header, positioned absolutely below it -->
        {#if mobileNavOpen}
            <div
                class="sm:hidden absolute top-full left-0 right-0 border-b border-border bg-background shadow-md px-6 py-3 flex flex-col gap-3 z-50"
            >
                <form method="POST" action="/?/signout">
                    <button
                        type="submit"
                        class="text-sm text-muted-foreground hover:text-foreground transition-colors py-1 text-left w-full"
                    >
                        Sign out
                    </button>
                </form>
            </div>
        {/if}
    </header>

    <!-- Content -->
    <main class="flex-1 overflow-auto">
        {@render children()}
    </main>
</div>
