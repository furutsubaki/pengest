<script lang="ts">
import dayjs from 'dayjs';
import { slide } from 'svelte/transition';

import type { Post } from '$lib/selectModels/post';

export let post: Post;

let isShowMenu = false;
</script>

<div class="card">
    <a
        href={`/u/${post.User.Profile?.screenName}/${post.id}`}
        class="card-link"
        data-post-id={post.id}
        transition:slide|local={{ duration: 200 }}
    >
        <div class="left">
            <ProfileIcon user={post.User} />
        </div>
        <div class="right">
            <div class="name-area">
                <object title="profile">
                    <a
                        href={`/u/${post.User.Profile?.screenName}`}
                        class="name-link"
                    >
                        <span class="name">{post.User.Profile?.name}</span>
                        <span class="screenName"
                            >@{post.User.Profile?.screenName}</span
                        ></a
                    >
                </object>
                <object title="profile">
                    <button
                        type="button"
                        class="menu-button"
                        on:click|preventDefault={() => (isShowMenu = true)}
                    >
                        <i class="las la-ellipsis-v" />
                    </button>
                </object>
            </div>
            <div class="content">
                <div class="text">{post.text}</div>
                {#if post.Images.length}
                    <div class="tide-gallery">
                        <TideGallery
                            images={post.Images.map((img) => ({
                                src: `/i/${img.id}`,
                                alt: img.id,
                            }))}
                            isAspect={true}
                        />
                    </div>
                {/if}
            </div>
            <div class="date">
                {dayjs(post.updatedAt).format('YYYY/MM/DD (ddd) HH:mm')}
            </div>
        </div></a
    >
    <PostCardPopupMenu {post} bind:isShow={isShowMenu} />
</div>

<style lang="scss">
@import '../../assets/scss/core/_breakpoints';

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
            .screenName {
                font-size: var(--font-size-small);
                color: var(--color-theme-text-secondary);
            }
        }
    }
}

.name-area {
    display: flex;
    gap: 24px;
    justify-content: space-between;
    .menu-button {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 2em;
        height: 2em;
        padding: 0;
        border: 0;
    }
}

.content {
    display: flex;
    flex-direction: column;
    gap: 24px;

    @include device('tablet') {
        display: flex;
        flex-direction: row;
        .text {
            flex: 1;
        }
        .tide-gallery {
            max-width: 20vw;
            max-width: 20dvw;
        }
    }
}

.date {
    font-size: var(--font-size-small);
}
</style>
