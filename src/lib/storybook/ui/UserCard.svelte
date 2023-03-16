<script lang="ts">
import axios from 'axios';
import dayjs from 'dayjs';
import ja from 'dayjs/locale/ja';
import { slide } from 'svelte/transition';

import type { User } from '$lib/selectModels/user';

import { authUser } from '$lib/stores/authUser';
import { session } from '$lib/stores/session';
import { success, danger } from '$lib/utils/notification';

dayjs.locale(ja);

export let user: User;

let isLoading = false;
let isHover = false;

const onFollow = async (userId: string) => {
    try {
        isLoading = true;
        const { data: followUser } = await axios.post(
            `/api/v1/authed/follow/${userId}`,
            {},
            {
                headers: {
                    access_token: $session?.access_token,
                    refresh_token: $session?.refresh_token,
                },
            },
        );
        $authUser!.meta.followingIds = [
            ...($authUser?.meta.followingIds ?? []),
            followUser.data.id as string,
        ];

        success(`${user.Profile?.name}をフォローしました`);
    } catch (error) {
        danger(`${user.Profile?.name}のフォローに失敗しました`);
    } finally {
        isLoading = false;
    }
};
const onUnFollow = async (userId: string) => {
    try {
        isLoading = true;
        const { data: unFollowUser } = await axios.delete(
            `/api/v1/authed/follow/${userId}`,
            {
                headers: {
                    access_token: $session?.access_token,
                    refresh_token: $session?.refresh_token,
                },
            },
        );
        $authUser!.meta.followingIds = $authUser?.meta.followingIds.filter(
            (id: string) => id !== unFollowUser.data.id,
        ) as string[];

        success(`${user.Profile?.name}をフォロー解除しました`);
    } catch (error) {
        danger(`${user.Profile?.name}のフォロー解除に失敗しました`);
    } finally {
        isLoading = false;
    }
};
</script>

<div class="card">
    <a
        href={`/u/${user.Profile?.screenName}`}
        class="card-link"
        data-user-id={user.id}
        transition:slide|local={{ duration: 200 }}
    >
        <div class="left">
            <ProfileIcon {user} />
        </div>
        <div class="right">
            <div class="name-area">
                <object title="profile">
                    <a
                        href={`/u/${user.Profile?.screenName}`}
                        class="name-link"
                    >
                        <span class="name">{user.Profile?.name}</span>
                        <span class="screen-name"
                            >@{user.Profile?.screenName}</span
                        ></a
                    >
                </object>
                {#if $authUser?.data.id !== user.id}
                    <object title="profile">
                        {#if $authUser?.meta.followingIds.includes(user.id)}
                            <button
                                type="button"
                                class="dummy-button"
                                disabled={isLoading}
                                on:click|preventDefault={() =>
                                    onUnFollow(user.id)}
                            >
                                <Button
                                    variant={isHover ? 'danger' : 'primary'}
                                    on:mouseover={() => (isHover = true)}
                                    on:mouseleave={() => (isHover = false)}
                                >
                                    {#if isHover}
                                        <i
                                            class="las la-minus unfollow-icon"
                                        />フォロー解除
                                    {:else}
                                        フォロー中
                                    {/if}
                                </Button>
                            </button>
                        {:else}
                            <button
                                type="button"
                                class="dummy-button"
                                disabled={isLoading}
                                on:click|preventDefault={() =>
                                    onFollow(user.id)}
                            >
                                <Button
                                    variant="secondary"
                                    on:mouseover={() => (isHover = true)}
                                    on:mouseleave={() => (isHover = false)}
                                >
                                    <i class="las la-plus" />フォロー
                                </Button>
                            </button>
                        {/if}
                    </object>
                {/if}
            </div>
            <div class="detail">{user.Profile?.detail}</div>
        </div>
    </a>
</div>

<style lang="scss">
.card {
    position: relative;
}

.card-link {
    position: relative;
    display: flex;
    gap: 8px;
    padding: 8px;
    color: var(--color-theme-text-primary);
    background-color: var(--color-theme-bg-primary);
    transition: background-color 0.2s, color 0.2s;

    @media (hover: hover) {
        // PC
        &:hover {
            text-decoration: none;
        }
    }

    @media (hover: none) {
        // mobile
        &:active {
            text-decoration: none;
        }
    }
    .left {
        flex-shrink: 0;
        width: 40px;
    }
    .right {
        display: flex;
        flex: 1;
        flex-direction: column;
        gap: 16px;
        padding-right: 40px;
        .name-area {
            display: flex;
            gap: 24px;
            justify-content: space-between;
            .name-link {
                display: flex;
                flex-direction: column;
                color: var(--color-theme-text-primary);
                transition: color 0.2s;

                @media (hover: hover) {
                    // PC
                    &:hover {
                        text-decoration: underline;
                    }
                }

                @media (hover: none) {
                    // mobile
                    &:active {
                        text-decoration: underline;
                    }
                }
                .name {
                    font-weight: bold;
                }
                .screen-name {
                    font-size: var(--font-size-small);
                    color: var(--color-theme-text-secondary);
                }
            }
        }
        .detail {
            white-space: pre-wrap;
        }
    }
}

.unfollow-icon {
    position: absolute;
    left: 4px;
}

.dummy-button {
    padding: 0;
    margin: 0;
    border: 0;
}
</style>
