<script lang="ts">
import axios from 'axios';

import { VALIDATION } from '$lib/consts/validation';
import { getImageFormat, file2Base64, base642File } from '$lib/utils';
import { danger } from '$lib/utils/notification';

export let value: string | null;
export let name = '';
export let placeholder = 'ファイル アップロード';
export let disabled = false;
export let isCircle = false;
export let canRemove = true;

let isEnter = false;
let input: HTMLInputElement | null = null;
let thumbnail = '';
let thumbnailName = '';

const dragEnter = () => {
    isEnter = true;
};
const dragLeave = () => {
    isEnter = false;
};
const dropFile = async (e: DragEvent) => {
    if (disabled) {
        removeFile();
        return;
    }

    isEnter = false;
    const files = [...(e.dataTransfer?.files as FileList)];
    await setFile(files);
};
const selectFile = async (e: Event) => {
    const files = [...((e.target as HTMLInputElement)?.files as FileList)];

    if (!files.length) {
        // removeFile();
        return;
    }

    await setFile(files);
};
const setFile = async (files: File[]) => {
    if (disabled) {
        return;
    }

    if (files.length !== 1) {
        danger(VALIDATION.VALID_UPLOAD_FILE_COUNT);
        removeFile();
        return;
    }

    const type = await getImageFormat(files[0]);
    // MEMO: webp,png,gif,jpeg、10MB以下を許可
    if (
        !type ||
        !['image/webp', 'image/png', 'image/gif', 'image/jpeg'].includes(
            type,
        ) ||
        files[0].size / 1000 ** 2 > 10
    ) {
        danger(VALIDATION.VALID_UPLOAD_FILE);
        removeFile();
        return;
    }

    const { data } = await axios.post('/api/v1/convertImg2Webp', {
        image: await file2Base64(files[0]),
    });

    const wepbFile = await base642File(data.data.image, files[0].name);
    value = data.data.image;
    await renderFile(wepbFile as File);
};
const renderFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        img.src = e.target?.result as string;
        img.onload = () => {
            thumbnail = img.src;
            thumbnailName = file.name;
        };
    };
    reader.readAsDataURL(file);
};
const removeFile = () => {
    (input as HTMLInputElement).value = '';
    value = null;
    thumbnail = '';
    thumbnailName = '';
};

$: {
    if (input) {
        if (!value) {
            removeFile();
        } else {
            fetch(value)
                .then((response) => response.blob())
                .then((blob) => new File([blob], 'image.'))
                .then((file) => {
                    // fileはFileオブジェクト
                    renderFile(file);
                });
        }
    }
}
</script>

<div
    class="droparea"
    class:is-enter={isEnter}
    on:dragenter={() => dragEnter()}
    on:dragleave={() => dragLeave()}
    on:dragover|preventDefault
    on:drop|preventDefault={(e) => dropFile(e)}
>
    {#if value}
        <slot {thumbnail} {thumbnailName} />
        <div class="file-name">
            {name}
        </div>
    {:else}
        {placeholder}
    {/if}
    <input
        bind:this={input}
        class="input"
        type="file"
        accept="image/webp, image/png, image/jpeg, image/gif"
        {disabled}
        on:input={(e) => selectFile(e)}
    />
    {#if canRemove && value}
        <button type="button" class="times" on:click={() => removeFile()}>
            <i class="las la-times" />
        </button>
    {/if}

    <div class="overlay">
        {#if isCircle}
            <div class="dashed-circle" />
        {:else}
            <div class="dashed" />
        {/if}
    </div>
</div>

<style lang="scss" scoped>
.droparea {
    position: relative;
    display: flex;
    flex-grow: 1;
    align-items: center;
    justify-content: center;
    height: 100%;
    overflow: hidden;
    color: var(--ui-global-text-color);
    text-align: center;
    word-break: keep-all;
    background-color: var(--ui-alpha-background-color);
    border: 1px solid var(--border-color);
    transition: 0.2s;
    &.is-enter {
        border: 1px solid var(--color-accent);
    }
    .input {
        position: absolute;
        width: 100%;
        height: 100%;
        padding: 0;
        opacity: 0;
    }
    .times {
        position: absolute;
        top: 0;
        right: 0;
        width: 1.5em;
        height: 1.5em;
        padding: 0;
        margin: 0;
        background-color: transparent;
        border: none;
        transition: 0.2s;
        @media (hover: hover) {
            // PC
            &:hover {
                color: var(--color-accent);
            }
        }
        @media (hover: none) {
            // mobile
            &:active {
                color: var(--color-accent);
            }
        }
    }
    .file-name {
        position: absolute;
        right: 0;
        bottom: 0;
        font-size: var(--font-size-small);
        text-shadow: 0 0 0.25em black;
        white-space: nowrap;
    }
}

.overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
}
.dashed {
    pointer-events: none;
    display: flex;
    justify-content: center;
    align-items: center;
    width: calc(100% - 24px);
    height: calc(100% - 24px);
    margin: 12px;
    transition: background-image 0.2s;
    background-image: linear-gradient(
            to right,
            var(--color-theme-border),
            var(--color-theme-border) 7px,
            transparent 7px,
            transparent 16px
        ),
        linear-gradient(
            to bottom,
            var(--color-theme-border),
            var(--color-theme-border) 7px,
            transparent 7px,
            transparent 16px
        ),
        linear-gradient(
            to left,
            var(--color-theme-border),
            var(--color-theme-border) 7px,
            transparent 7px,
            transparent 16px
        ),
        linear-gradient(
            to top,
            var(--color-theme-border),
            var(--color-theme-border) 7px,
            transparent 7px,
            transparent 16px
        );
    background-size: 16px 2px, 2px 16px, 16px 2px, 2px 16px;
    background-position: left top, right top, right bottom, left bottom;
    background-repeat: repeat-x, repeat-y, repeat-x, repeat-y;
    filter: invert(100%) grayscale(100%) contrast(100);
}
.dashed-circle {
    pointer-events: none;
    width: calc(100% - 24px);
    height: calc(100% - 24px);
    margin: 12px;
    background-image: repeating-conic-gradient(
        var(--color-theme-text-primary) 0% 2%,
        transparent 2% 5%
    );
    mask-image: radial-gradient(
        transparent 67%,
        var(--color-theme-text-primary) 67% 70%,
        transparent 70%
    );
    filter: invert(100%) grayscale(100%) contrast(100);
}
</style>
