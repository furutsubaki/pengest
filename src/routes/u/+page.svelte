<script lang="ts">
import { onMount } from 'svelte';

import LeftColumn from '$lib/storybook/page/layout/settings/LeftColumn.svelte';
import { applyJsAgain } from '$lib/utils/routerOption';

onMount(() => {
    applyJsAgain();
});
</script>

<div class="page">
    <div class="left">
        <LeftColumn />
    </div>
    <div class="right">
        <RightColumn />
    </div>
</div>

<style lang="scss">
@import '../../../lib/assets/scss/core/_breakpoints.scss';

.page {
    display: flex;
    justify-content: center;
    max-width: var(--main-width);
    width: 100%;
    height: 100%;
    margin: auto;
    .right {
        display: none;
        @include device('tablet') {
            display: initial;
            flex: 1;
        }
    }
}
</style>
