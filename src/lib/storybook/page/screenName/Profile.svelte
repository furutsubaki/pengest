<script lang="ts">
import axios from 'axios';
import dayjs from 'dayjs';

import { page } from '$app/stores';
import { APP_NAME } from '$lib/consts';
import pixivIcon from '$lib/images/icon_pixiv.png';
import { authUser, type UserObj } from '$lib/stores/authUser';
import { session } from '$lib/stores/session';
import { success, danger } from '$lib/utils/notification';

export let user: UserObj | undefined;
$: userName =
    user?.data?.Profile?.name ??
    (user?.meta.isDeactivate
        ? '対象のユーザーは削除されています'
        : user?.meta.isFreeze
            ? '対象のユーザーは凍結されています'
            : '対象のユーザーは存在しません');
$: screenName = user?.data?.Profile?.screenName ?? $page.params.screenName;

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

        success(`${user?.data.Profile?.name}をフォローしました`);
    } catch (error) {
        danger(`${user?.data.Profile?.name}のフォローに失敗しました`);
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

        success(`${user?.data.Profile?.name}をフォロー解除しました`);
    } catch (error) {
        danger(`${user?.data.Profile?.name}のフォロー解除に失敗しました`);
    } finally {
        isLoading = false;
    }
};

const refreshProfile = () => {
    user = $authUser as UserObj;
};

let isShowEdit = false;
const onEdit = () => {
    // TODO:
    isShowEdit = true;
};
</script>

<div class="profile">
    <div
        class="header-img-area"
        class:is-image={user?.data?.Profile?.headerImage}
    >
        {#if user?.data?.Profile?.headerImage}
            <img
                class="header-img"
                src={user?.data.Profile?.headerImage}
                alt="ヘッダー画像"
            />
        {/if}
        {#if user?.data?.Profile?.icon}
            <img class="icon" src={user?.data?.Profile?.icon} alt="profile" />
        {:else}
            <div class="icon empty" />
        {/if}
    </div>
    <div class="area">
        <div class="upper-line">
            <div>
                <div class="name-area">
                    <div class="name">
                        {userName}
                    </div>
                    {#if user?.data}
                        <a href={`/u/${screenName}`} class="screen-name"
                            >@{screenName}</a
                        >
                    {:else}
                        <div class="screen-name">
                            @{screenName}
                        </div>
                    {/if}
                </div>
                {#if user?.data?.Profile}
                    <div class="link-area">
                        {#if user.data.Profile.linkHome}
                            <a
                                href={user.data.Profile.linkHome}
                                class="sns-link"
                                data-blank_icon="false"
                            >
                                <i class="las la-home" />
                            </a>
                        {/if}
                        {#if user.data.Profile.linkTwitter}
                            <a
                                href={user.data.Profile.linkTwitter}
                                class="sns-link"
                                data-blank_icon="false"
                            >
                                <i class="lab la-twitter" />
                            </a>
                        {/if}
                        {#if user.data.Profile.linkPixiv}
                            <a
                                href={user.data.Profile.linkPixiv}
                                class="sns-link"
                                data-blank_icon="false"
                                data-hover
                                ><img
                                    src={pixivIcon}
                                    alt="pixiv"
                                    class="sns-icon"
                                    data-nohover
                                /></a
                            >
                        {/if}
                        {#if user.data.Profile.linkGithub}
                            <a
                                href={user.data.Profile.linkGithub}
                                class="sns-link"
                                data-blank_icon="false"
                            >
                                <i class="lab la-github" />
                            </a>
                        {/if}
                    </div>
                {/if}
            </div>
            {#if user?.data}
                <div class="edit-area">
                    {#if $session && $authUser?.data.id === user.data.id}
                        <Button variant="secondary" on:click={() => onEdit()}
                            >プロフィールを編集</Button
                        >
                    {:else if $session}
                        {#if $authUser?.meta.followingIds.includes(user.data.id)}
                            <Button
                                variant={isHover ? 'danger' : 'primary'}
                                disabled={isLoading}
                                on:mouseover={() => (isHover = true)}
                                on:mouseleave={() => (isHover = false)}
                                on:click={() => onUnFollow(user.data.id)}
                            >
                                {#if isHover}
                                    <i
                                        class="las la-minus unfollow-icon"
                                    />フォロー解除
                                {:else}
                                    フォロー中
                                {/if}
                            </Button>
                        {:else}
                            <Button
                                variant="secondary"
                                disabled={isLoading}
                                on:mouseover={() => (isHover = true)}
                                on:mouseleave={() => (isHover = false)}
                                on:click={() => onFollow(user.data.id)}
                            >
                                <i class="las la-plus" />フォロー
                            </Button>
                        {/if}
                    {/if}
                </div>
            {/if}
        </div>
        {#if user?.data?.Profile?.detail}
            <div class="detail">
                {user.data.Profile.detail}
            </div>
        {/if}
        {#if user?.data?.Profile}
            <div class="meta-area">
                <a
                    class="follow-link"
                    href={`/u/${user?.data?.Profile.screenName}/following`}
                >
                    follow:<span class="follow-count"
                        >{user?.meta.followingCount}</span
                    >
                </a>
                <a
                    class="follow-link"
                    href={`/u/${user?.data.Profile.screenName}/followers`}
                >
                    follower:<span class="follow-count"
                        >{user?.meta.followerCount}</span
                    >
                </a>
                <div>
                    <i class="las la-calendar" />
                    {dayjs(user?.data.createdAt).format(
                        'YYYY/MM/DD',
                    )}から{APP_NAME}を利用しています
                </div>
            </div>
        {/if}
    </div>
</div>

{#if $authUser?.data?.id === user?.data?.id}
    <ProfileEdit bind:isShowEdit on:refreshProfile={() => refreshProfile()} />
{/if}

<style lang="scss">
.profile {
    --header-img-height: 200px;
    --icon-size: 150px;

    display: flex;
    flex-direction: column;
    background-color: var(--color-theme-bg-primary);
    transition: background-color 0.2s;
    .header-img-area {
        position: relative;
        width: 100%;
        aspect-ratio: 16/2;
        background-color: var(--color-theme-bg-secondary);
        transition: background-color 0.2s;
        &.is-image {
            aspect-ratio: 16/9;
        }
        .header-img {
            object-fit: cover;
            width: 100%;
            height: 100%;
        }
        .icon {
            position: absolute;
            bottom: calc(var(--icon-size) / 2 * -1);
            left: 24px;
            width: var(--icon-size);
            height: var(--icon-size);
            border-radius: 100%;
            &.empty {
                background-color: var(--color-theme-bg-primary);
                border: 1px solid var(--color-theme-border);
                transition: background-color 0.2s, border-color 0.2s;
            }
        }
    }
    .edit-area {
        display: flex;
        justify-content: flex-end;
        padding: 24px;
    }
    .area {
        display: flex;
        flex-direction: column;
        gap: 16px;
        padding: 24px;
        padding-top: 0;
        .upper-line {
            display: flex;
            align-items: flex-end;
            justify-content: space-between;
            margin-top: 80px;
        }
        .name {
            font-size: var(--font-size-large);
            font-weight: bold;
        }
        .link-area {
            display: flex;
            gap: 8px;
            align-items: center;
            .la-twitter {
                color: rgb(29 155 240);
            }
            .sns-link {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 3rem;
                height: 3rem;
                font-size: 3rem;
                color: var(--color-theme-text-primary);
                transition: color 0.2s, opacity 0.1s;

                @media (hover: hover) {
                    // PC
                    &:hover {
                        text-decoration: none;
                        opacity: 0.8;
                    }
                }

                @media (hover: none) {
                    // mobile
                    &:active {
                        text-decoration: none;
                        opacity: 0.8;
                    }
                }
            }
        }
        .screen-name {
            font-size: var(--font-size-small);
        }
        .detail {
            padding: 24px 0;
            white-space: pre-wrap;
        }
        .meta-area {
            display: flex;
            gap: 8px;
            align-items: center;
            font-size: var(--font-size-small);
            color: var(--color-theme-text-secondary);
            transition: color 0.2s;
            .follow-link {
                color: var(--color-theme-text-secondary);
                transition: color 0.2s;
                .follow-count {
                    font-weight: bold;
                    color: var(--color-theme-text-primary);
                    transition: color 0.2s;
                }
            }
        }
    }
}
</style>
