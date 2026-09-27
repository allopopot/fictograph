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
        <Card.Title>Create your account</Card.Title>
        <Card.Description>Fill the form to create your account</Card.Description
        >
        <Card.Action>
            <a href="/auth/signin">
                <Button variant="link">Sign In</Button>
            </a>
        </Card.Action>
    </Card.Header>
    <Card.Content>
        {#if form?.message}
            <p class="text-red-500">{form?.message}</p>
        {/if}
        <form method="post">
            <div class="flex flex-col gap-6">
                <div class="grid gap-2">
                    <Label for="email">Name</Label>
                    <Input
                        id="name"
                        type="name"
                        placeholder="Katherine"
                        required
                        name="name"
                        value={form?.body.name}
                    />
                    {#if form?.properties?.name}
                        <p class="text-red-500">
                            {form?.properties?.name.errors}
                        </p>
                    {/if}
                </div>
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
                    <Label for="password">Password</Label>
                    <Input
                        id="password"
                        type="password"
                        required
                        name="password"
                        value={form?.body.password}
                    />
                    {#if form?.properties?.password}
                        <p class="text-red-500">
                            {form?.properties?.password.errors}
                        </p>
                    {/if}
                </div>
                <Button type="submit" class="w-full">Create Account</Button>
            </div>
        </form>
    </Card.Content>
</Card.Root>
