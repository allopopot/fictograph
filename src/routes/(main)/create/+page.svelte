<script lang="ts">
    import * as InputGroup from "$lib/components/ui/input-group";
    import { Button } from "$lib/components/ui/button";
    import { SearchIcon, X } from "@lucide/svelte";
    // import type { PageProps } from "./$types";
    import {
        getBooks,
        type BookDoc,
        type OpenLibrarySearchResponse,
    } from "$lib/api/books";

    // let { data }: PageProps = $props();

    let selectedTitles = $state<BookDoc[]>([]);
    let search = $state("");
    let bookResponse = $state<Promise<Response>>();

    function searchBook() {
        bookResponse = getBooks(search, 20, 1);
    }

    function OpenLibrarySearchResponseInject(v: any) {
        return v as OpenLibrarySearchResponse;
    }

    function selectBooks(b: BookDoc) {
        if (selectedTitles.length < 3) {
            selectedTitles.push(b);
        }
    }

    function deselect(idx: number) {
        if (selectedTitles.length !== 0) {
            selectedTitles.splice(idx, 1);
        }
    }

    function isSelected(b: BookDoc) {
        const a = selectedTitles.find((ax) => {
            return ax.key === b.key;
        });
        return Boolean(a);
    }
</script>

<div class="overflow-hidden grid grid-cols-[3fr_2fr]">
    <div class="w-full overflow-auto">
        <div class="sticky top-0 bg-background px-6 pt-6 pb-2">
            <h2 class="text-xl font-semibold mb-2">Select Titles</h2>
            <InputGroup.Root>
                <InputGroup.Input
                    onkeyup={(e) => {}}
                    placeholder="Search for a title..."
                    bind:value={search}
                />
                <InputGroup.Addon>
                    <SearchIcon />
                </InputGroup.Addon>
                <InputGroup.Addon align="inline-end">
                    <InputGroup.Button
                        variant={"default"}
                        onclick={() => searchBook()}
                    >
                        <SearchIcon></SearchIcon>Search</InputGroup.Button
                    >
                </InputGroup.Addon>
            </InputGroup.Root>
        </div>
        <div class="p-6">
            {#await bookResponse}
                <p>Loading...</p>
            {:then bookRes}
                {#if bookRes?.ok}
                    {#await bookRes.json()}
                        <p>Loading...</p>
                    {:then bookData}
                        {#each OpenLibrarySearchResponseInject(bookData).docs as book}
                            <div
                                class="first:border-t border-b p-3 flex items-center-safe gap-4"
                            >
                                <img
                                    class="rounded h-16 w-auto"
                                    src={`https://covers.openlibrary.org/b/ID/${book.cover_i}-M.jpg`}
                                    alt={`Cover of ${book.title}`}
                                />
                                <div class="grow">
                                    <h3 class="text-xl font-semibold">
                                        {book?.title}
                                    </h3>
                                    <em>{book?.author_name?.join(", ")}</em>
                                </div>
                                <div>
                                    <Button
                                        disabled={isSelected(book)}
                                        onclick={() => {
                                            selectBooks(book);
                                        }}
                                        >{isSelected(book)
                                            ? "Selected"
                                            : "Select"}
                                    </Button>
                                </div>
                            </div>
                        {/each}
                    {/await}
                {/if}
            {/await}
        </div>
    </div>
    <div class="w-full p-6">
        <h2 class="text-xl font-semibold mb-2">
            Selected ({selectedTitles.length})
        </h2>
        {#each selectedTitles as book, idx}
            <div
                class="first:border-t border-b p-3 flex items-center-safe gap-4"
            >
                <img
                    class="rounded h-16 w-auto"
                    src={`https://covers.openlibrary.org/b/ID/${book.cover_i}-M.jpg`}
                    alt={`Cover of ${book.title}`}
                />
                <div class="grow">
                    <h3 class="text-xl font-semibold">
                        {book?.title}
                    </h3>
                    <em>{book?.author_name?.join(", ")}</em>
                </div>
                <div>
                    <Button
                        variant={"destructive"}
                        onclick={() => {
                            deselect(idx);
                        }}
                    >
                        <X></X>
                    </Button>
                </div>
            </div>
        {/each}
    </div>
</div>
