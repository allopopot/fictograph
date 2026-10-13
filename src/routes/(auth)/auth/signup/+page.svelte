<script lang="ts">
    import type { PageProps } from "./$types";
    import { Input } from "$lib/components/ui/input/index.js";
    import { Label } from "$lib/components/ui/label/index.js";
    import { Button } from "$lib/components/ui/button/index.js";

    let { data, form, params }: PageProps = $props();
</script>

<div class="border border-border bg-card p-8">
    <h2 class="text-base font-semibold mb-1">Create account</h2>
    <p class="text-xs text-muted-foreground mb-6">Fill in the details below.</p>

    {#if form?.message}
        <p class="text-xs text-destructive mb-4 py-2 px-3 bg-destructive/5 border border-destructive/20">
            {form?.message}
        </p>
    {/if}

    <form method="post">
        <div class="flex flex-col gap-4">
            <div class="grid gap-1.5">
                <Label for="name" class="text-xs text-muted-foreground">Name</Label>
                <Input
                    id="name"
                    type="text"
                    placeholder="Your name"
                    required
                    name="name"
                    value={form?.body.name}
                />
                {#if form?.properties?.name}
                    <p class="text-xs text-destructive">{form?.properties?.name.errors}</p>
                {/if}
            </div>

            <div class="grid gap-1.5">
                <Label for="email" class="text-xs text-muted-foreground">Email</Label>
                <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    name="email"
                    value={form?.body.email}
                />
                {#if form?.properties?.email}
                    <p class="text-xs text-destructive">{form?.properties?.email.errors}</p>
                {/if}
            </div>

            <div class="grid gap-1.5">
                <Label for="password" class="text-xs text-muted-foreground">Password</Label>
                <Input
                    id="password"
                    type="password"
                    required
                    name="password"
                    value={form?.body.password}
                />
                {#if form?.properties?.password}
                    <p class="text-xs text-destructive">{form?.properties?.password.errors}</p>
                {/if}
            </div>

            <Button type="submit" class="w-full mt-1">Create account</Button>
        </div>
    </form>

    <p class="text-xs text-muted-foreground text-center mt-6">
        Already have an account?
        <a href="/auth/signin" class="text-foreground hover:underline underline-offset-4 ml-1">Sign in</a>
    </p>
</div>
