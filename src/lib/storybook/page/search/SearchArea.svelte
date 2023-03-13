<script lang="ts">
import axios from 'axios';
import { crossfade } from 'svelte/transition';

import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import { page } from '$app/stores';
import { columns, type DisplayType } from '$lib/stores/column';
import { session } from '$lib/stores/session';
import { danger } from '$lib/utils/notification';

export let columnId: string;

const [send, receive] = crossfade({});
let currentTabId =
    ($page.url.searchParams.get('type') as DisplayType) ?? 'user';

interface Tab {
    id: string;
    label: string;
    type: DisplayType;
    placeholder: string;
}
const tabs: Tab[] = [
    { id: 'user', label: 'User', type: 'user', placeholder: 'ユーザーを検索' },
    { id: 'post', label: 'Post', type: 'post', placeholder: '投稿を検索' },
];
let model = {
    q: $page.url.searchParams.get('q') ?? '',
    placeholder: tabs.find((tab) => tab.id === currentTabId)
        ?.placeholder as string,
};

const onChangeTab = (newTabId: DisplayType) => {
    currentTabId = newTabId;
    const targetTab = tabs.find((tab) => tab.id === currentTabId);
    model.q = '';
    model.placeholder = targetTab?.placeholder as string;
    const targetColumnIndex = $columns.findIndex(
        (column) => column.id === columnId,
    );
    $columns[targetColumnIndex].type = targetTab?.type as DisplayType;
    $columns[targetColumnIndex].posts.data = [];
    $columns[targetColumnIndex].posts.meta = {};
    $columns = $columns;
    if (browser) {
        goto(`/search?type=${currentTabId}`, {
            replaceState: true,
        });
    }
};

let isLoading = false;

const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey) && model.q.length) {
        onSubmit();
    }
};

const onSubmit = async () => {
    try {
        isLoading = true;

        const targetTab = tabs.find((tab) => tab.id === currentTabId);
        goto(`/search?type=${currentTabId}&q=${model.q}`, {
            replaceState: true,
        });
        let posts = {};
        if (targetTab?.type === 'user') {
            const { data: getUsers } = await axios(
                '/api/v1/authed/search/users',
                {
                    params: {
                        q: model.q,
                    },
                    headers: {
                        access_token: $session?.access_token,
                        refresh_token: $session?.refresh_token,
                    },
                },
            );
            posts = getUsers;
        } else if (targetTab?.type === 'post') {
            const { data: getPosts } = await axios(
                '/api/v1/authed/search/posts',
                {
                    params: {
                        q: model.q,
                    },
                    headers: {
                        access_token: $session?.access_token,
                        refresh_token: $session?.refresh_token,
                    },
                },
            );
            posts = getPosts;
        }

        const targetColumnIndex = $columns.findIndex(
            (column) => column.id === columnId,
        );
        $columns[targetColumnIndex].posts = posts;
        $columns = $columns;
    } catch (error) {
        danger('検索に失敗しました');
    } finally {
        isLoading = false;
    }
};
</script>

<div class="search-area">
    <div class="tab-area">
        {#each tabs as tab (tab.id)}
            <button
                type="button"
                class="tab"
                class:is-active={currentTabId === tab.id}
                on:click={() => onChangeTab(tab.id)}
            >
                {tab.label}
                {#if currentTabId === tab.id}
                    <div
                        class="active-bar"
                        in:receive={{ key: 'id' }}
                        out:send={{ key: 'id' }}
                    />
                {/if}
            </button>
        {/each}
    </div>
    <div class="input-area">
        <Input
            bind:value={model.q}
            placeholder={model.placeholder}
            icon="las la-search"
            {isLoading}
            on:keydown={handleKeyDown}
            on:iconClick={onSubmit}
        />
    </div>
</div>

<style lang="scss">
.search-area {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 24px;
    margin-top: 24px;
    background-color: var(--color-theme-bg-primary);
    transition: background-color 0.2s;
    .tab-area {
        .tab {
            height: auto;
            padding: 8px;
            padding-bottom: 10px;
            text-align: center;
            border: 0;
            opacity: 0.5;
            transition: opacity 0.2s;
            &.is-active {
                pointer-events: none;
                opacity: 1;
            }
            .active-bar {
                position: absolute;
                bottom: 0;
                left: 0;
                width: 100%;
                height: 2px;
                background-color: var(--color-theme-active);
                transition: background-color 0.2s;
            }
        }
    }
    .input-area {
        position: relative;
        display: flex;
        width: 100%;
    }
}
</style>
