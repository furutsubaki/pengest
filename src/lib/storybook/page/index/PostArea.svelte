<script lang="ts">
import axios from 'axios';
import cloneDeep from 'lodash/cloneDeep';
import { onMount } from 'svelte';

import type { Image } from '$lib/selectModels/image';
import type { Post } from '$lib/selectModels/post';

import { VALIDATION } from '$lib/consts/validation';
import { authUser } from '$lib/stores/authUser';
import { postData } from '$lib/stores/post';
import { session } from '$lib/stores/session';
import { base642File, file2Base64, getImageFormat } from '$lib/utils';
import { success, danger } from '$lib/utils/notification';

export let type: 'post' | 'reply' = 'post';

$: primaryText = type === 'reply' ? '返信' : '投稿';

let model = {
    text: '',
    images: [] as string[],
    imageIds: [] as string[],
};

let thumbnails = [] as string[];
let libraryThumbnails = [] as Image[];

let isLoading = false;
let isShowLibraryCheckboxArea = false;

const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey) && model.text.length) {
        onSubmit();
    }
};

const selectLibrary = () => {
    isShowLibraryCheckboxArea = true;
};
const onDeleteLibraryThumbnail = (i: number) => {
    libraryThumbnails.splice(i, 1);
    libraryThumbnails = [...libraryThumbnails];
};
const selectFiles = async (e: Event) => {
    const files = [...((e.target as HTMLInputElement)?.files as FileList)];

    if (!files.length) {
        return;
    }

    if (model.images.length + libraryThumbnails.length + files.length > 4) {
        danger(VALIDATION.MAX_COUNT_POST_IMAGE);
        return;
    }

    await setFiles(files);
};
const setFiles = async (files: File[]) => {
    isLoading = true;
    try {
        const types = await Promise.all(
            files.map((file) => getImageFormat(file)),
        );
        // MEMO: webp,png,gif,jpeg、10MB以下を許可
        if (
            types.length !== files.length ||
            types.some(
                (type) =>
                    ![
                        'image/webp',
                        'image/png',
                        'image/gif',
                        'image/jpeg',
                    ].includes(type as string),
            ) ||
            files.some((file) => file.size / 1000 ** 2 > 10)
        ) {
            isLoading = false;
            danger(VALIDATION.VALID_UPLOAD_FILE);
            return;
        }

        const base64s = await Promise.all(
            files.map((file) => file2Base64(file)),
        );
        const res = await Promise.all(
            base64s.map((base64) =>
                axios.post('/api/v1/convertImg2Webp', {
                    image: base64,
                }),
            ),
        );

        const wepbFiles = await Promise.all(
            res.map((r, i) => base642File(r.data.data.image, files[i].name)),
        );
        model.images = [...model.images, ...res.map((r) => r.data.data.image)];
        await renderFiles(wepbFiles as File[]);
    } catch (error) {
        danger('変換エラーが発生しました。別のファイルをお試しください');
        isLoading = false;
    }
};
const renderFiles = (files: File[]) => {
    files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.src = e.target?.result as string;
            img.onload = () => {
                thumbnails = [...thumbnails, img.src];
            };
        };
        reader.readAsDataURL(file);
    });
    isLoading = false;
};
const onDeleteThumbnail = (i: number) => {
    thumbnails.splice(i, 1);
    thumbnails = [...thumbnails];
    model.images.splice(i, 1);
    model.images = [...model.images];
};

const onSubmit = async () => {
    try {
        isLoading = true;
        const payload = cloneDeep(model);
        payload.imageIds = libraryThumbnails.map((t) => t.id);
        await axios.post('/api/v1/authed/posts', payload, {
            headers: {
                access_token: $session?.access_token,
                refresh_token: $session?.refresh_token,
            },
        });
        reset();
        onClose();
        success('投稿完了しました');
    } catch (error) {
        danger('投稿に失敗しました');
    } finally {
        isLoading = false;
    }
};

const reset = () => {
    model.text = '';
    model.images = [];
    model.imageIds = [];
    thumbnails = [];
    libraryThumbnails = [];
};

const onClose = () => {
    $postData.isShow = false;
    reset();
};
onMount(() => {
    return () => {
        $postData.replyPost = {} as Post;
        $postData.type = 'post';
    };
});
</script>

<Overlay on:close={onClose}>
    <div class="dialog">
        <div class="title">
            <img
                class="icon"
                src={$authUser?.data.Profile?.icon}
                alt="profile"
            />
            <button class="close-button" on:click={onClose}
                ><i class="las la-times" /></button
            >
        </div>
        <div class="post-area">
            <div class="input-area">
                <Textarea
                    bind:value={model.text}
                    maxLength={140}
                    placeholder="つぶやき"
                    on:keydown={handleKeyDown}
                />
            </div>
            {#if thumbnails.length || libraryThumbnails.length}
                <div class="thumbnail-area">
                    {#each thumbnails as thumbnail, i (i)}
                        <div class="thumbnail-box">
                            <button
                                type="button"
                                class="thumbnail-remove-button"
                                on:click={() => onDeleteThumbnail(i)}
                                ><i class="las la-times" /></button
                            >
                            <img class="thumbnail" src={thumbnail} alt="" />
                        </div>
                    {/each}
                    {#each libraryThumbnails as thumbnail, i (i)}
                        <div class="thumbnail-box">
                            <button
                                type="button"
                                class="thumbnail-remove-button"
                                on:click={() => onDeleteLibraryThumbnail(i)}
                                ><i class="las la-times" /></button
                            >
                            <img
                                class="thumbnail"
                                src={thumbnail.src}
                                alt={thumbnail.id}
                            />
                        </div>
                    {/each}
                </div>
            {/if}
            <div class="button-area">
                <div class="button-area-inner">
                    <label class="icon-button">
                        <input
                            class="input-file"
                            type="file"
                            accept="image/webp, image/png, image/jpeg, image/gif"
                            disabled={isLoading}
                            multiple
                            on:input={(e) => selectFiles(e)}
                        />
                        <i class="las la-file-upload" />
                    </label>
                    <ButtonText
                        class="icon-button"
                        variant="secondary"
                        size="large"
                        disabled={isLoading}
                        on:click={() => selectLibrary()}
                    >
                        <i class="las la-image" />
                    </ButtonText>
                </div>
                <Button
                    on:click={onSubmit}
                    disabled={isLoading || !model.text.length}
                    >{primaryText}</Button
                >
            </div>
        </div>
    </div>
</Overlay>

<LibraryCheckboxArea
    bind:isShow={isShowLibraryCheckboxArea}
    bind:model={libraryThumbnails}
    fileCount={model.images.length}
/>

<style lang="scss">
.post-area {
    display: flex;
    flex-direction: column;
    gap: 24px;
    padding: 24px;
    background-color: var(--color-theme-bg-primary);
    transition: background-color 0.2s;
}

.input-area {
    display: flex;
    flex-direction: column;
}

.thumbnail-area {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    grid-auto-rows: 150px;
    .thumbnail-box {
        position: relative;
        .thumbnail-remove-button {
            position: absolute;
            top: 8px;
            right: 8px;
            height: auto;
            border: 0;
        }
        .thumbnail {
            width: 100%;
            max-width: 100%;
            height: 100%;
            max-height: 100%;
            object-fit: cover;
        }
    }
}

.button-area {
    display: flex;
    gap: 24px;
    justify-content: space-between;
    .button-area-inner {
        display: flex;
        flex: 1;
        gap: 16px;
        align-items: center;
    }
}

.icon {
    flex-shrink: 0;
    width: 32px;
}

.icon-button {
    display: flex;
    margin: 0;
    font-size: var(--font-size-large);
    cursor: pointer;
    transition: color 0.2s;

    @media (hover: hover) {
        &:hover {
            color: var(--color-theme-active);
            filter: brightness(1.5);
        }
    }

    @media (hover: none) {
        &:active {
            color: var(--color-theme-active);
            filter: brightness(1.5);
        }
    }
}

.input-file {
    display: none;
}

.dialog {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 600px;
    height: auto;
    min-height: 100px;
    max-height: 400px;
    background-color: var(--color-theme-bg-primary);
    transition: background-color 0.2s;
    .title {
        display: flex;
        gap: 24px;
        align-items: center;
        justify-content: space-between;
        padding: 8px;
        border-bottom: 1px solid var(--color-theme-border);
        transition: border-bottom 0.2s;
        .close-button {
            margin: auto 0;
            border: 0;
        }
    }
}
</style>
