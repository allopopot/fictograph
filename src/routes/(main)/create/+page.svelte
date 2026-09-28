<script lang="ts">
    import * as InputGroup from "$lib/components/ui/input-group";
    import { SearchIcon, Loader } from "@lucide/svelte";
    // import type { PageProps } from "./$types";
    import { getBooks, type OpenLibrarySearchResponse } from "$lib/api/books";

    // let { data }: PageProps = $props();

    let selectedCount = $state(0);
    let search = $state("");
    let bookResponse = $state<Promise<Response>>();

    function searchBook() {
        bookResponse = getBooks(search, 20, 1);
    }

    function OpenLibrarySearchResponseInject(v: any) {
        return v as OpenLibrarySearchResponse;
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
                                <div>
                                    <h3 class="text-xl font-semibold">
                                        {book?.title}
                                    </h3>
                                    <em>{book?.author_name?.join(", ")}</em>
                                </div>
                            </div>
                        {/each}
                    {/await}
                {/if}
            {/await}
        </div>
    </div>
    <div class="w-full p-6">
        <h2 class="text-xl font-semibold mb-2">Selected ({selectedCount})</h2>
    </div>
</div>
