<script lang="ts">
    import * as InputGroup from "$lib/components/ui/input-group";
    import { Button } from "$lib/components/ui/button";
    import { SearchIcon, X } from "@lucide/svelte";
    import { selectedTitles, selectedTitlesLimit } from "../books.svelte";
    import {
        getBooks,
        type BookDoc,
        type OpenLibrarySearchResponse,
    } from "$lib/api/books";

    let search = $state("");
    let bookResponse = $state<Promise<Response>>();

    function searchBook() {
        bookResponse = getBooks(search, 20, 1);
    }

    function OpenLibrarySearchResponseInject(v: any) {
        return v as OpenLibrarySearchResponse;
    }

    function selectBooks(b: BookDoc) {
        if (selectedTitles.length < selectedTitlesLimit) {
            selectedTitles.push(b);
        }
    }

    function deselect(idx: number) {
        if (selectedTitles.length !== 0) {
            selectedTitles.splice(idx, 1);
        }
    }

    function isSelected(b: BookDoc) {
        return Boolean(selectedTitles.find((ax) => ax.key === b.key));
    }
</script>

<!-- Two-panel: stack on mobile, side-by-side on md+ -->
<div class="flex flex-col md:grid md:grid-cols-[1fr_360px] h-[calc(100dvh-3rem)] overflow-hidden">

    <!-- Left: Search -->
    <div class="flex flex-col overflow-hidden border-b md:border-b-0 md:border-r border-border flex-1 min-h-0">
        <!-- Search bar -->
        <div class="border-b border-border px-5 py-3 shrink-0">
            <p class="text-xs text-muted-foreground mb-3 uppercase tracking-widest">Search books</p>
            <InputGroup.Root>
                <InputGroup.Input
                    onkeyup={(e) => { if (e.key === 'Enter') searchBook(); }}
                    placeholder="Title or author…"
                    bind:value={search}
                />
                <InputGroup.Addon>
                    <SearchIcon size={14} />
                </InputGroup.Addon>
                <InputGroup.Addon align="inline-end">
                    <InputGroup.Button variant={"default"} onclick={() => searchBook()}>
                        Search
                    </InputGroup.Button>
                </InputGroup.Addon>
            </InputGroup.Root>
        </div>

        <!-- Results -->
        <div class="flex-1 min-h-0 overflow-auto">
            {#await bookResponse}
                <p class="text-xs text-muted-foreground text-center py-12">Searching…</p>
            {:then bookRes}
                {#if bookRes?.ok}
                    {#await bookRes.json()}
                        <p class="text-xs text-muted-foreground text-center py-12">Loading…</p>
                    {:then bookData}
                        {#each OpenLibrarySearchResponseInject(bookData).docs as book}
                            <div class="flex items-center gap-4 px-5 py-3 border-b border-border hover:bg-muted/40 transition-colors">
                                <img
                                    class="h-14 w-auto shrink-0 bg-muted"
                                    src={`https://covers.openlibrary.org/b/ID/${book.cover_i}-M.jpg`}
                                    alt={`Cover of ${book.title}`}
                                />
                                <div class="flex-1 min-w-0">
                                    <p class="text-sm font-medium truncate">{book?.title}</p>
                                    <p class="text-xs text-muted-foreground truncate mt-0.5">{book?.author_name?.join(", ")}</p>
                                </div>
                                <Button
                                    size="sm"
                                    variant={isSelected(book) ? "secondary" : "outline"}
                                    disabled={isSelected(book)}
                                    onclick={() => selectBooks(book)}
                                    class="shrink-0 text-xs"
                                >
                                    {isSelected(book) ? "Added" : "Add"}
                                </Button>
                            </div>
                        {/each}
                    {/await}
                {:else if !bookRes}
                    <div class="flex flex-col items-center justify-center h-full gap-2 text-center py-20">
                        <SearchIcon size={24} class="text-muted-foreground/30" />
                        <p class="text-xs text-muted-foreground">Search for a book to begin.</p>
                    </div>
                {/if}
            {/await}
        </div>
    </div>

    <!-- Right: Selected -->
    <div class="flex flex-col overflow-hidden bg-muted/20 h-56 shrink-0 md:h-full md:shrink">
        <!-- Header -->
        <div class="border-b border-border px-5 py-3 flex items-center justify-between shrink-0 bg-background/50">
            <div>
                <p class="text-xs text-muted-foreground uppercase tracking-widest">Selected</p>
                <p class="text-sm font-medium mt-0.5">{selectedTitles.length} / {selectedTitlesLimit}</p>
            </div>
            <a href="/generate">
                <Button size="sm" disabled={selectedTitles.length <= 1}>
                    Generate →
                </Button>
            </a>
        </div>

        <!-- Selected list -->
        <div class="flex-1 min-h-0 overflow-auto">
            {#if selectedTitles.length === 0}
                <div class="flex items-center justify-center h-full p-6 text-center">
                    <p class="text-xs text-muted-foreground">No books selected.</p>
                </div>
            {:else}
                {#each selectedTitles as book, idx}
                    <div class="flex items-center gap-4 px-5 py-2.5 border-b border-border">
                        <img
                            class="h-12 w-auto shrink-0 bg-muted"
                            src={`https://covers.openlibrary.org/b/ID/${book.cover_i}-M.jpg`}
                            alt={`Cover of ${book.title}`}
                        />
                        <div class="flex-1 min-w-0">
                            <p class="text-sm font-medium truncate">{book?.title}</p>
                            <p class="text-xs text-muted-foreground truncate mt-0.5">{book?.author_name?.join(", ")}</p>
                        </div>
                        <button
                            onclick={() => deselect(idx)}
                            class="text-muted-foreground hover:text-foreground transition-colors shrink-0 p-1"
                            aria-label="Remove"
                        >
                            <X size={14} />
                        </button>
                    </div>
                {/each}
            {/if}
        </div>
    </div>
</div>
