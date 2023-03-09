<script lang="ts">
import { createEventDispatcher } from 'svelte';
import { fly } from 'svelte/transition';

import type { Image } from '$lib/selectModels/image';

import { VALIDATION } from '$lib/consts/validation';
import { library } from '$lib/stores/library';
import { danger } from '$lib/utils/notification';

export let isShow: boolean;
export let model: Image[];
export let fileCount: number;

const dispatch = createEventDispatcher();

const toggleImage = (image: Image) => {
    const index = model.findIndex((i) => i.id === image.id);
    if (index !== -1) {
        // 削除
        model.splice(index, 1);
    } else {
        // 追加
        if (fileCount + model.length >= 4) {
            danger(VALIDATION.MAX_COUNT_POST_IMAGE);
            return;
        }
        model.push(image);
    }
    model = model;
};
</script>

{#if isShow}
    <div class="sidebar" transition:fly={{ x: 200 }}>
        <div class="button-area">
            <Button variant="secondary" on:click={() => (isShow = false)}
                >閉じる</Button
            >
        </div>
        <div class="area">
            {#each $library as image, i (image.id)}
                <ButtonText
                    class="button-text"
                    on:click={() => toggleImage(image)}
                >
                    <div
                        class="checkbox "
                        class:is-checked={!!model.find(
                            (i) => i.id === image.id,
                        )}
                    >
                        {#if !!model.find((i) => i.id === image.id)}
                            <i class="las la-check-circle icon" />
                        {:else}
                            <i class="las la-circle icon" />
                        {/if}
                        <img class="img" src="/i/{image.id}" alt={image.id} />
                    </div>
                </ButtonText>
            {/each}
        </div>
    </div>
{/if}

<style lang="scss">
.sidebar {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 1;
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 400px;
    max-width: 90vw;
    height: 100%;
    background-color: var(--color-theme-bg-primary);
    transition: background-color 0.2s;
}

.button-area {
    display: flex;
    justify-content: center;
    padding-top: 24px;
}

.area {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    height: 100%;
    padding: 24px;
    overflow-y: scroll;
    .img {
        object-fit: cover;
        width: 100%;
        height: 100%;
        max-height: 300px;
        aspect-ratio: 1/1;
    }
}

.checkbox {
    position: relative;
    width: 100%;
    height: 100%;
    filter: grayscale(1);
    transition: filter 0.2s;

    @media (hover: hover) {
        &:hover {
            filter: grayscale(0);
        }
    }

    @media (hover: none) {
        &:active {
            filter: grayscale(0);
        }
    }
    &.is-checked {
        filter: grayscale(0);
    }
    .icon {
        position: absolute;
        top: 8px;
        right: 8px;
        font-size: var(--font-size-large);
        font-weight: bold;
    }
}
</style>
