<script lang="ts">
    import type { PageProps } from "./$types";
    import { Input } from "$lib/components/ui/input/index.js";
    import { Label } from "$lib/components/ui/label/index.js";
    import { Button } from "$lib/components/ui/button/index.js";

    let { data, form, params }: PageProps = $props();
</script>

<div class="border border-border bg-card p-8">
    <h2 class="text-base font-semibold mb-1">Sign in</h2>
    <p class="text-xs text-muted-foreground mb-6">Enter your email and password.</p>

    {#if form?.message}
        <p class="text-xs text-destructive mb-4 py-2 px-3 bg-destructive/5 border border-destructive/20">
            {form?.message}
        </p>
    {/if}

    <form method="POST">
        <div class="flex flex-col gap-4">
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
                <div class="flex items-center justify-between">
                    <Label for="password" class="text-xs text-muted-foreground">Password</Label>
                    <a href="##" class="text-xs text-muted-foreground hover:text-foreground transition-colors">
                        Forgot?
                    </a>
                </div>
                <Input id="password" type="password" required name="password" />
                {#if form?.properties?.password}
                    <p class="text-xs text-destructive">{form?.properties?.password.errors}</p>
                {/if}
            </div>

            <Button type="submit" class="w-full mt-1">Sign in</Button>
        </div>
    </form>

    <p class="text-xs text-muted-foreground text-center mt-6">
        No account?
        <a href="/auth/signup" class="text-foreground hover:underline underline-offset-4 ml-1">Sign up</a>
    </p>
</div>
