<script lang="ts">
import { onMount } from 'svelte';

import { applyJsAgain } from '$lib/utils/routerOption';

onMount(() => {
    applyJsAgain();
});
</script>

<section class="column">
    <slot name="operationArea" />
    <div class="posts">
        <slot />
    </div>
</section>

<style lang="scss">
.column {
    display: flex;
    flex-direction: column;
    margin: auto;
    max-width: var(--main-width);
    width: var(--width);
    height: 100%;
    transition: background-color 0.2s;
    .posts {
        display: flex;
        flex-direction: column;
        padding: 24px 0;
        gap: 16px;
    }
}
</style>
