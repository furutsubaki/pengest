<script lang="ts">
import { onMount } from 'svelte';

import ToggleButton from '$lib/storybook/ui/input/ToggleButton.svelte';
import { getCookie, setCookie } from '$lib/utils/cookie';

let theme: string;
const items = [
    { label: 'light', value: 'light', icon: 'las la-sun' },
    { label: 'dark', value: 'dark', icon: 'las la-moon' },
];

$: if (typeof document !== 'undefined') {
    const newTheme = theme === 'light' ? 'light' : 'dark';
    setCookie('theme', newTheme);
    document.documentElement.dataset.theme = newTheme;
}

onMount(() => {
    theme = getCookie('theme');
});
</script>

<div class="wrap">
    <FormGroup>
        <FormItem label="テーマ">
            <ToggleButton bind:value={theme} {items} />
        </FormItem>
    </FormGroup>
</div>

<style lang="scss">
.wrap {
    padding: 24px;
}
.icon {
    display: inline-block;
    margin: 0;
    padding: 0;
    height: auto;
    max-width: 50px;
    max-height: 50px;
    line-height: 1;
    font-size: 2.4rem;
    color: var(--color-theme-text-primary);
    border: 0;
    border-radius: 100%;
    overflow: hidden;
    transition: color 0.2s;
    @media (hover: hover) {
        // PC
        &:hover {
            color: var(--color-theme-text-secondary);
        }
    }
    @media (hover: none) {
        // mobile
        &:active {
            color: var(--color-theme-text-secondary);
        }
    }
}
</style>
