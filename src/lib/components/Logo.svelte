<script lang="ts">
    import logoDark from "$lib/assets/Fictograph-Logo-Dark.svg";
    import logoLight from "$lib/assets/Fictograph-Logo-Light.svg";
    import { getIsDark } from "$lib/theme.svelte";

    type Props = {
        class?: string;
        size?: number;
    };

    let { class: className = "", size = 28 }: Props = $props();
</script>

<img
    src={getIsDark() ? logoLight : logoDark}
    alt="Fictograph"
    width={size}
    height={size}
    class={className}
/>
