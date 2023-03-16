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
    width: var(--width);
    max-width: var(--main-width);
    height: 100%;
    margin: auto;
    transition: background-color 0.2s;
    .posts {
        display: flex;
        flex-direction: column;
        gap: 16px;
        padding: 24px 0;
    }
}
</style>
