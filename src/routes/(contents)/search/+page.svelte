<script lang="ts">
import { onMount } from 'svelte';

import { page } from '$app/stores';
import { columns } from '$lib/stores/column';
import { applyJsAgain } from '$lib/utils/routerOption';

$columns = [$page.data.settings.columns[0]];

onMount(() => {
    applyJsAgain();
});
</script>

<div class="page">
    {#each $columns as column (column.id)}
        <Column {column} isOnly={$columns.length === 1} />
    {/each}
</div>

<style lang="scss">
.page {
    width: 100%;
    // height: 100%;
}
</style>
