<script lang="ts">
    import type { PageProps } from "./$types";

    import * as Card from "$lib/components/ui/card/index.js";
    import { Button } from "$lib/components/ui/button/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import { Label } from "$lib/components/ui/label/index.js";

    let { data, form, params }: PageProps = $props();
</script>

<Card.Root class="w-full">
    <Card.Header>
        <Card.Title>Login to your Account</Card.Title>
        <Card.Description>Enter your credentials</Card.Description>
        <Card.Action>
            <a href="/auth/signup">
                <Button variant="link">Sign Up</Button>
            </a>
        </Card.Action>
    </Card.Header>
    <Card.Content>
        {#if form?.message}
            <p class="text-red-500">{form?.message}</p>
        {/if}
        <form method="POST">
            <div class="flex flex-col gap-6">
                <div class="grid gap-2">
                    <Label for="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        required
                        name="email"
                        value={form?.body.email}
                    />
                    {#if form?.properties?.email}
                        <p class="text-red-500">
                            {form?.properties?.email.errors}
                        </p>
                    {/if}
                </div>
                <div class="grid gap-2">
                    <div class="flex items-center">
                        <Label for="password">Password</Label>
                        <a
                            href="##"
                            class="ms-auto inline-block text-sm underline-offset-4 hover:underline"
                        >
                            Forgot your password?
                        </a>
                    </div>
                    <Input
                        id="password"
                        type="password"
                        required
                        name="password"
                    />
                    {#if form?.properties?.password}
                        <p class="text-red-500">
                            {form?.properties?.password.errors}
                        </p>
                    {/if}
                </div>
                <Button type="submit" class="w-full">Sign In</Button>
            </div>
        </form>
    </Card.Content>
</Card.Root>
