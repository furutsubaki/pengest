<script lang="ts">
import axios from 'axios';

import { goto } from '$app/navigation';
import { page } from '$app/stores';
import { MESSAGE } from '$lib/consts/message';
import { session } from '$lib/stores/session';
import { errorHandling } from '$lib/utils';
import { success } from '$lib/utils/notification';

let model = {
    email: $session?.user.email as string,
};

// const refreshSession = async () => {
//     const {
//         data: { session: newSession },
//         error,
//     } = await $page.data.supabase.auth.setSession($session);
//     $session = newSession;
// };

if ([...$page.url.searchParams.keys()].includes('success')) {
    success(MESSAGE.SUCCESS.EMAIL_UPDATE);
    // TODO: セッションのリフレッシュができない
    // refreshSession();

    goto($page.url.pathname, {
        replaceState: true,
    });
}

let isLoading = false;
let isShowConfirm = false;
let isShowEmailUpdatedConfirm = false;
const onSubmitConfirm = async () => {
    isShowConfirm = true;
};

const onSubmit = async () => {
    isShowConfirm = false;
    isLoading = true;
    try {
        await axios.patch('/api/v1/authed/auth/email-update', model);
        // const {
        //     data: { session: newSession },
        // } = $page.data.supabase.auth.refreshSession();

        // $session = newSession;
        isShowEmailUpdatedConfirm = true;
    } catch (error) {
        errorHandling(error);
    } finally {
        isLoading = false;
    }
};
</script>

<div class="wrap">
    <Form>
        <FormGroup>
            <FormItem label="メールアドレス">
                <Input
                    bind:value={model.email}
                    type="email"
                    placeholder="mailaddress"
                />
                {#if $session?.user.email !== model.email}
                    <Button on:click={onSubmitConfirm} disabled={isLoading}
                        >保存</Button
                    >
                {/if}
            </FormItem>
        </FormGroup>
        <!-- <H2>お知らせ</H2>
        <FormGroup>
            <FormItem label="お知らせメールを受け取る">
                <ToggleSwitch />
            </FormItem>
        </FormGroup>
        <H2>メール通知</H2>
        <FormGroup>
            <FormItem label="リプライ">
                <ToggleSwitch />
            </FormItem>
            <FormItem label="リポスト">
                <ToggleSwitch />
            </FormItem>
            <FormItem label="ブックマーク">
                <ToggleSwitch />
            </FormItem>
            <FormItem label="DM">
                <ToggleSwitch />
            </FormItem>
        </FormGroup> -->
    </Form>
</div>

{#if isShowConfirm}
    <Dialog
        title="メールアドレス更新"
        variant="warning"
        primaryText="更新"
        bind:isShow={isShowConfirm}
        on:submit={onSubmit}
    >
        メールアドレスを更新してもよろしいですか？
    </Dialog>
{/if}

{#if isShowEmailUpdatedConfirm}
    <Dialog
        title="メールアドレス確認"
        variant="info"
        bind:isShow={isShowEmailUpdatedConfirm}
    >
        <p>新しいメールアドレスに確認のメールを送信しました。</p>
        <p>メールに記載している認証リンクにアクセスしてください。</p>
    </Dialog>
{/if}

<style lang="scss">
.wrap {
    padding: 24px;
}

.icon {
    display: inline-block;
    max-width: 50px;
    height: auto;
    max-height: 50px;
    padding: 0;
    margin: 0;
    overflow: hidden;
    font-size: 2.4rem;
    color: var(--color-theme-text-primary);
    border: 0;
    border-radius: 100%;
    transition: color 0.2s;

    @media (hover: hover) {
        // PC
        &:hover {
            color: var(--color-theme-text-secondary);
        }
    }

    @media (hover: none) {
        // mobile
        &:active {
            color: var(--color-theme-text-secondary);
        }
    }
}

.button-area {
    display: flex;
    justify-content: flex-end;
}
</style>
