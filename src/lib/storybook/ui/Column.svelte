<script lang="ts">
import { onMount } from 'svelte';

import type { Column } from '$lib/stores/column';

import { applyJsAgain } from '$lib/utils/routerOption';

export let column: Column;
export let isOnly = false;

onMount(() => {
    applyJsAgain();
});
</script>

<section
    class="column"
    class:only={isOnly}
    style:--width={`${column.option.width}px`}
>
    {#if column.mode === 'timeline'}
        <PostArea />
    {:else if column.mode === 'user'}
        <Profile user={column.user} />
    {:else if column.mode === 'search'}
        <SearchArea columnId={column.id} />
    {/if}
    <div class="posts">
        {#if column.posts}
            {#if !!column.posts.data?.length}
                {#each column.posts.data as post (post.id)}
                    {#if column.type === 'post'}
                        <PostCard {post} />
                    {:else if column.type === 'user'}
                        <UserCard user={post} />
                    {/if}
                {/each}
            {:else}
                <div class="empty">
                    <p>データがありません</p>
                </div>
            {/if}
        {:else if column.post}
            {#if !column.post.data.id}
                <div class="empty">
                    <p>データがありません</p>
                </div>
            {/if}

            <PostCard post={column.post.data} />
        {/if}
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
    border-left: 1px solid var(--color-theme-border);
    border-right: 1px solid var(--color-theme-border);
    &.only {
        width: 100%;
        border-left: 0;
        border-right: 0;
    }
    .posts {
        display: flex;
        flex-direction: column;
        padding: 24px 0;
        gap: 16px;
    }
}

.empty {
    padding: 24px;
    text-align: center;
}
</style>
