<script lang="ts">
import axios from 'axios';
import { onMount } from 'svelte';
import { fade } from 'svelte/transition';

import type { Image } from '$lib/selectModels/image';

import { page } from '$app/stores';
import { library } from '$lib/stores/library';
import { session } from '$lib/stores/session';
import { danger, success } from '$lib/utils/notification';
import { applyJsAgain } from '$lib/utils/routerOption';

$library = $page.data.images.data;

let filter = '';
let tideNode: HTMLElement;
let isShow = false;
let isLoading = false;
let isShowDialog = false;
let currentImage: Image = {} as Image;
const model = {
    tags: [],
};

const tags = ['イラスト', '日常', 'テスト'];

const onTideOpen = ({ detail: image }: { detail: Image }) => {
    isShow = true;
    currentImage = image;
};
const onTideClose = () => {
    isShow = false;
    currentImage = {} as Image;
};
const onTideChange = ({ detail: image }: { detail: Image }) => {
    currentImage = image;
};

const onImageDeleteConfirm = () => {
    if (currentImage.Post.length) {
        isShowDialog = true;
        return;
    }
    onImageDelete(currentImage);
};

const onImageDelete = async (image: Image) => {
    try {
        isLoading = true;
        const { data: deletedImage } = await axios.delete(
            `/api/v1/authed/images/${image.id}`,
            {
                headers: {
                    access_token: $session?.access_token,
                    refresh_token: $session?.refresh_token,
                },
            },
        );

        $library = $library.filter(
            (image) => image.id !== deletedImage.data.id,
        );

        onClose();
        success('画像を削除しました');
    } catch (error) {
        danger('画像の削除に失敗しました');
    } finally {
        isLoading = false;
    }
};

let onClose: () => void;

onMount(() => {
    applyJsAgain();
});
</script>

<div class="page">
    <ColumnFrame>
        <!-- <div class="operation-area" slot="operationArea"> -->
        <!-- <Input bind:value={filter} placeholder="Filter" />
            <H2
                >Tag Cloud<Button variant="secondary" size="small">clear</Button
                ></H2
            >
            <div class="tags">
                <Checkbox bind:value={model.tags} items={tags} />
            </div> -->
        <!-- </div> -->
        <div class="library">
            <TideGallery
                images={$library.map((image) => ({
                    ...image,
                    src: `/i/${image.id}`,
                    alt: image.id,
                }))}
                options={{
                    appendToNode: tideNode,
                }}
                bind:onCloseTrigger={onClose}
                on:open={onTideOpen}
                on:close={onTideClose}
                on:change={onTideChange}
            />
        </div>
        {#if isShow}
            <div class="detail">
                <div class="tidebox" bind:this={tideNode} />
                <div class="sidebar" transition:fade>
                    <div class="sideber-item">
                        <div class="label">Meta</div>
                        <div class="id">id: {currentImage.id}</div>

                        <a
                            href={currentImage.src}
                            target="_blank"
                            rel="noopener noreferrer">画像リンク</a
                        >

                        <button
                            type="button"
                            class="danger-button"
                            disabled={isLoading}
                            on:click={onImageDeleteConfirm}>削除</button
                        >
                    </div>
                    <div class="sideber-item">
                        <div class="label">Link Posts</div>
                        {#each currentImage.Post as post}
                            <a
                                href={`/${post.User.Profile.screenName}/${post.id}`}
                                target="_blank"
                                rel="noopener noreferrer">{post.text}</a
                            >
                        {/each}
                    </div>
                </div>
            </div>
        {/if}
    </ColumnFrame>
</div>

{#if isShowDialog}
    <Dialog
        title="画像削除"
        variant="danger"
        primaryText="削除"
        bind:isShow={isShowDialog}
        on:submit={() => onImageDelete(currentImage)}
    >
        この画像には下記の投稿で使用されていますが、削除してもよろしいですか？
        <div class="desc">
            ※投稿は削除されませんが、投稿から画像は消えます。
        </div>
        <div class="post-card">
            {#each currentImage.Post as post}
                <div>
                    <div>{post.text}</div>
                    <div class="date">{post.createdAt}</div>
                </div>
            {/each}
        </div>
    </Dialog>
{/if}

<style lang="scss">
@import '../../../lib/assets/scss/core/_breakpoints.scss';

.page {
    width: 100%;
}

.operation-area {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 24px;
    margin-top: 24px;
    background-color: var(--color-theme-bg-primary);
    transition: background-color 0.2s;
    .tags {
        display: flex;
        gap: 16px;
    }
}

.library {
    border-radius: 8px;
    overflow: hidden;
    :global(.images) {
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        width: auto;
    }
}

.detail {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    display: flex;
    flex-direction: column;
    z-index: 1;
    @include device('tablet') {
        flex-direction: row;
    }
    .tidebox {
        pointer-events: visible;
        position: relative;
        flex: 1;
        :global(.tide-show-image) {
            position: absolute;
        }
    }
    .sidebar {
        pointer-events: visible;
        display: flex;
        flex-direction: column;
        gap: 24px;
        padding: 24px;
        width: 100%;
        height: 200px;
        background-color: var(--color-theme-bg-primary);
        transition: background-color 0.2s;
        @include device('tablet') {
            width: 300px;
            height: 100%;
        }
        .sideber-item {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }
        .label {
            font-weight: bold;
        }
        .id {
            font-size: var(--font-size-small);
            color: var(--color-theme-text-secondary);
            transition: color 0.2s;
        }
    }
}

.desc {
    font-size: var(--font-size-small);
    color: var(--color-theme-text-secondary);
    transition: color 0.2s;
}
.danger-button {
    text-align: start;
    border: 0;
    color: var(--color-status-danger);
    transition: color 0.2s;
}

.post-card {
    display: flex;
    flex-direction: column;
    gap: 24px;
    text-align: initial;
    pointer-events: none;
    .date {
        font-size: var(--font-size-small);
        color: var(--color-theme-text-secondary);
        transition: color 0.2s;
    }
}
</style>
