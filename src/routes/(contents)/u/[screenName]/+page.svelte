<script lang="ts">
import { onMount } from 'svelte';

import type { PageData } from './$types';
import type {
    RealtimeChannel,
    REALTIME_LISTEN_TYPES,
} from '@supabase/supabase-js';

import { beforeNavigate } from '$app/navigation';
import { page } from '$app/stores';
import { columns } from '$lib/stores/column';
import { applyJsAgain } from '$lib/utils/routerOption';

export let data: PageData;

$columns = [$page.data.settings.columns[0]];
let userChannel: RealtimeChannel;

if ($columns[0].user?.data) {
    // ===== タイムライン購読 =====

    userChannel = data.supabase.channel(`user-${$columns[0].user?.data.id}`);

    interface Payload {
        type: `${REALTIME_LISTEN_TYPES.BROADCAST}`;
        event: string;
        [key: string]: any;
    }
    const timelineInsertPost = (payload: Payload) => {
        $columns[0].posts.data = [
            payload.payload.data,
            ...$columns[0].posts.data,
        ];
    };
    const timelineDeletePost = (payload: Payload) => {
        $columns[0].posts.data = $columns[0].posts.data.filter(
            (post) => post.id !== payload.payload.data.id,
        );
    };
    userChannel
        .on('broadcast', { event: 'post-insert' }, timelineInsertPost)
        .on('broadcast', { event: 'post-delete' }, timelineDeletePost)
        .subscribe();
}
onMount(() => {
    applyJsAgain();
});
beforeNavigate(() => {
    if (userChannel) {
        userChannel.unsubscribe();
    }
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
