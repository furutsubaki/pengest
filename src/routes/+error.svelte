<script lang="ts">
import { onMount } from 'svelte';

import { page } from '$app/stores';
import { applyJsAgain } from '$lib/utils/routerOption';

onMount(() => {
    applyJsAgain();
});
</script>

<div class="error">
    <H1>エラーが発生しました。</H1>
    <H2>{$page.status}</H2>
    <div>
        <p>{$page.error?.message}</p>
    </div>
</div>

<style lang="scss">
.error {
    display: flex;
    flex-direction: column;
    gap: 24px;
    padding: 24px;
    width: 100%;
    height: 100%;
}
</style>
