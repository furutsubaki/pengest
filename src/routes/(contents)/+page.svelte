<script lang="ts">
import { onMount } from 'svelte';

import type { PageData } from './$types';
import type { REALTIME_LISTEN_TYPES } from '@supabase/supabase-js';

import { beforeNavigate } from '$app/navigation';
import { page } from '$app/stores';
import { authUser } from '$lib/stores/authUser';
import { columns } from '$lib/stores/column';
import { library } from '$lib/stores/library';
import { applyJsAgain } from '$lib/utils/routerOption';

export let data: PageData;

$library = $page.data.images.data;
$columns = [$page.data.settings.columns[0]];

// ===== タイムライン購読 =====

let timelineChannels = [
    $authUser?.data.id,
    ...($authUser?.meta.followingIds ?? []),
].map((id) => data.supabase.channel(`user-${id}`));

interface Payload {
    type: `${REALTIME_LISTEN_TYPES.BROADCAST}`;
    event: string;
    [key: string]: any;
}
const timelineInsertPost = (payload: Payload) => {
    $columns[0].posts.data = [payload.payload.data, ...$columns[0].posts.data];
};
const timelineDeletePost = (payload: Payload) => {
    $columns[0].posts.data = $columns[0].posts.data.filter(
        (post) => post.id !== payload.payload.data.id,
    );
};
timelineChannels.forEach((channel) => {
    channel
        .on('broadcast', { event: 'post-insert' }, timelineInsertPost)
        .on('broadcast', { event: 'post-delete' }, timelineDeletePost);
});

onMount(() => {
    applyJsAgain();
});
beforeNavigate(() => {
    timelineChannels.forEach(async (channel) => {
        channel.unsubscribe();
    });
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
