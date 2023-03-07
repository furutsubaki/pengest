<script lang="ts">
import axios from 'axios';
import cloneDeep from 'lodash/cloneDeep';
import { createEventDispatcher } from 'svelte';
import { fly } from 'svelte/transition';

import { authUser } from '$lib/stores/authUser';
import { session } from '$lib/stores/session';
import Button from '$lib/storybook/ui/Button.svelte';
import Textarea from '$lib/storybook/ui/input/Textarea.svelte';
import { success, danger } from '$lib/utils/notification';

export let isShowEdit = false;

const dispatch = createEventDispatcher();
let isLoading = false;
const model = {
    name: $authUser?.data.Profile?.name ?? '',
    screenName: $authUser?.data.Profile?.screenName ?? '',
    detail: $authUser?.data.Profile?.detail ?? '',
    icon: $authUser?.data.Profile?.icon ?? '',
    headerImage: $authUser?.data.Profile?.headerImage ?? '',
    linkHome: $authUser?.data.Profile?.linkHome ?? '',
    linkTwitter: $authUser?.data.Profile?.linkTwitter ?? '',
    linkPixiv: $authUser?.data.Profile?.linkPixiv ?? '',
    linkGithub: $authUser?.data.Profile?.linkGithub ?? '',
};

const onSubmit = async () => {
    isLoading = true;
    try {
        const payload = cloneDeep(model);
        const { data } = await axios.patch('/api/v1/authed/profile', payload, {
            headers: {
                access_token: $session?.access_token,
                refresh_token: $session?.refresh_token,
            },
        });
        $authUser = data;
        dispatch('refreshProfile');
        isShowEdit = false;
        success('プロフィールを更新しました');
    } catch (error) {
        danger('プロフィールの更新に失敗しました');
    } finally {
        isLoading = false;
    }
};
</script>

{#if isShowEdit}
    <div class="profile-edit" transition:fly={{ y: 500 }}>
        <button
            type="button"
            class="close-button"
            on:click={() => (isShowEdit = false)}
            ><i class="las la-angle-double-down" /></button
        >
        <div class="profile">
            <div class="header-img-area" class:is-image={model.headerImage}>
                <div class="header-drop-area">
                    <InputFile
                        bind:value={model.headerImage}
                        placeholder="Drop header(16:9)"
                        let:thumbnail
                        let:thumbnailName
                    >
                        <img class="img" src={thumbnail} alt={thumbnailName} />
                    </InputFile>
                </div>
                <div class="icon">
                    <InputFile
                        bind:value={model.icon}
                        placeholder=""
                        isCircle={true}
                        canRemove={false}
                        let:thumbnail
                        let:thumbnailName
                    >
                        <img class="img" src={thumbnail} alt={thumbnailName} />
                    </InputFile>
                </div>
            </div>
            <div class="edit-area">
                <div class="area">
                    <div class="grid-area">
                        <div class="name">
                            <Input bind:value={model.name} placeholder="name" />
                        </div>
                        <div class="name">
                            <Input
                                bind:value={model.screenName}
                                placeholder="screenName"
                            />
                        </div>
                    </div>
                    <div class="detail">
                        <Textarea
                            bind:value={model.detail}
                            placeholder="紹介文"
                        />
                    </div>

                    <div class="grid-area">
                        <Input
                            bind:value={model.linkHome}
                            placeholder="Site url"
                        />
                        <Input
                            bind:value={model.linkTwitter}
                            placeholder="Twitter url"
                        />
                        <Input
                            bind:value={model.linkPixiv}
                            placeholder="Pixiv url"
                        />
                        <Input
                            bind:value={model.linkGithub}
                            placeholder="Github url"
                        />
                    </div>
                    <div class="button-area">
                        <Button on:click={() => onSubmit()}
                            >プロフィールを更新</Button
                        >
                    </div>
                </div>
            </div>
        </div>
    </div>
{/if}

<style lang="scss">
.profile {
    overflow-y: scroll;
    height: calc(50vh - 32px);
}
.profile-edit {
    position: fixed;
    top: 50%;
    left: 0;
    right: 0;
    z-index: 1;
    --header-img-height: 200px;
    --icon-size: 150px;
    display: flex;
    flex-direction: column;
    border-top: 1px solid var(--color-theme-border);
    background-color: var(--color-theme-bg-alpha);
    transition: border-color 0.2s, background-color 0.2s;
    .header-img-area {
        position: relative;
        aspect-ratio: 16/2;
        width: 100%;
        max-width: var(--main-width);
        margin: auto;
        .is-image {
            aspect-ratio: 16/9;
        }
        .img {
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
            overflow: hidden;
        }
    }
    .edit-area {
        padding-top: 80px;
        background-color: var(--color-theme-bg-primary);
        transition: background-color 0.2s;
    }
    .area {
        display: flex;
        flex-direction: column;
        gap: 24px;
        padding: 24px;
        padding-top: 0;
        width: 100%;
        max-width: var(--main-width);
        margin: auto;
        background-color: var(--color-theme-bg-primary);
        transition: background-color 0.2s;
        .grid-area {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
            gap: 24px;
        }
    }
    .button-area {
        display: flex;
        justify-content: center;
        background-color: var(--color-theme-bg-primary);
        transition: background-color 0.2s;
    }
}
.close-button {
    border: 0;
}

.header-drop-area {
    position: absolute;
    width: 100%;
    height: 100%;
}
</style>
