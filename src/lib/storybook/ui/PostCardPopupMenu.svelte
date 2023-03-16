<script lang="ts">
import axios from 'axios';
import { slide } from 'svelte/transition';

import type { Post } from '$lib/selectModels/post';

import { authUser } from '$lib/stores/authUser';
import { session } from '$lib/stores/session';
import { success, danger } from '$lib/utils/notification';

export let isShow = false;
export let post: Post;

let isLoading = false;
let isShowDialog = false;

const onShowPostDeleteConfirm = () => {
    isShowDialog = true;
    isShow = false;
};

const onPostDelete = async () => {
    try {
        isLoading = true;
        await axios.delete('/api/v1/authed/posts', {
            data: {
                id: post.id,
            },
            headers: {
                access_token: $session?.access_token,
                refresh_token: $session?.refresh_token,
            },
        });
        success('投稿を削除しました');
    } catch (error) {
        danger('投稿の削除に失敗しました');
    } finally {
        isLoading = false;
    }
};
</script>

{#if isShow}
    <Overlay variant="transparent" on:close={() => (isShow = false)} />
    <div class="popup-menu" transition:slide={{ duration: 200 }}>
        <ul class="menu">
            {#if $authUser?.data.id === post.User.id}
                <li class="item">
                    <button
                        on:click|preventDefault={onShowPostDeleteConfirm}
                        class="button delete"
                        ><i class="lar la-trash-alt" />削除</button
                    >
                </li>
            {/if}
        </ul>
    </div>
{/if}

{#if isShowDialog}
    <Dialog
        title="投稿削除"
        variant="danger"
        primaryText="削除"
        bind:isShow={isShowDialog}
        on:submit={onPostDelete}
    >
        この投稿を削除してもよろしいですか？
        <div class="post-card">
            <PostCard {post} />
        </div>
    </Dialog>
{/if}

<style lang="scss">
.popup-menu {
    position: absolute;
    top: 24px;
    right: 24px;
    z-index: 2;
    padding: 8px;
    background-color: var(--color-theme-bg-alpha);
    border: 1px solid var(--color-theme-border);
    transition: background-color 0.2s, border-color 0.2s;
    .menu {
        padding: 0;
        margin: 0;
        .item {
            list-style: none;
            .button {
                display: flex;
                gap: 8px;
                align-items: center;
                border: 0;
                &.delete {
                    color: var(--color-status-danger);
                }
            }
        }
    }
}

.post-card {
    text-align: initial;
    pointer-events: none;
}
</style>
