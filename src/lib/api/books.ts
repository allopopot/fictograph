export async function getBooks(search: string, limit: 20, page: 1) {
    const url = new URL("https://openlibrary.org/search.json")
    url.searchParams.append("q", `subject:fictitious title:${search}`)
    url.searchParams.append("page", page.toString())
    url.searchParams.append("limit", limit.toString())

    return fetch(url, {
        method: "GET"
    })
}

export interface OpenLibrarySearchResponse {
    numFound: number;
    start: number;
    numFoundExact: boolean;
    num_found: number;
    documentation_url: string;
    q: string;
    offset: number | null;
    docs: BookDoc[];
}

export interface BookDoc {
    author_key: string[];
    author_name: string[];
    cover_edition_key?: string;
    cover_height?: number;
    cover_i?: number;
    cover_width?: number;
    ebook_access: string;
    edition_count: number;
    first_publish_year?: number;
    has_fulltext: boolean;
    ia?: string[];
    ia_collection?: string[];
    key: string;
    language?: string[];
    lending_edition_s?: string;
    lending_identifier_s?: string;
    public_scan_b?: boolean;
    series_key?: string[];
    series_name?: string[];
    series_position?: string[];
    title: string;
    id_standard_ebooks?: string[];
    id_project_gutenberg?: string[];
}
