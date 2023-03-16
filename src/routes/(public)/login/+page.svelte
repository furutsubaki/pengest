<script lang="ts">
import axios from 'axios';
import { onMount } from 'svelte';
import { fly } from 'svelte/transition';

import type { LayoutData } from '.svelte-kit/types/src/routes/$types';

import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import loginBg from '$lib/assets/images/login_bg.webp';
import { APP_NAME } from '$lib/consts';
import { MESSAGE } from '$lib/consts/message';
import { errorHandling } from '$lib/utils';
import { success } from '$lib/utils/notification';
import { applyJsAgain } from '$lib/utils/routerOption';
import { type SigninPostType, signinPostSchema } from '$lib/validations/signin';
import { type SignupPostType, signupPostSchema } from '$lib/validations/signup';

export let data: LayoutData;
let isLoading = false;
let dispType = 'login';

const onChangeType = async (type: string) => {
    if (type === 'signup') {
        isSignuped = false;
    }
    dispType = type;
};

// ===== ログイン =====

const loginModel: SigninPostType = {
    email: '',
    password: '',
};

let isShowDeactivateUserDialog = false;
let isShowFreezingUserDialog = false;
let isConfirmReactivate = false;
const onLogin = async () => {
    isLoading = true;

    // 現時点のセッションをClear
    await data.supabase.auth.signOut();

    try {
        signinPostSchema.parse({
            email: loginModel.email,
            password: loginModel.password,
        });

        const { error } = await data.supabase.auth.signInWithPassword({
            email: loginModel.email,
            password: loginModel.password,
        });
        if (error) {
            throw new Error(error.message);
        }

        const { data: loginUser } = await axios('/api/v1/authed/authUser');
        if (loginUser.meta.isDeactivate) {
            isConfirmReactivate = true;
            isShowDeactivateUserDialog = true;
            return;
        }

        goto('/');
        success(MESSAGE.SUCCESS.LOGIN);
    } catch (error) {
        errorHandling(MESSAGE.ERROR.INVALID_LOGIN);
    } finally {
        isLoading = false;
    }
};

// ===== 登録 =====

let signupModel: SignupPostType = {
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
};

let isSignuped = false;

const onSignup = async () => {
    isLoading = true;
    try {
        signupPostSchema.parse(signupModel);

        await axios.post('/api/v1/auth/signup', signupModel);
        isSignuped = true;
    } catch (error) {
        errorHandling(error);
    } finally {
        isLoading = false;
    }
};

// ===== 再activate =====
const onReactivate = async () => {
    isLoading = true;
    try {
        await axios.post('/api/v1/authed/auth/reactivate');
        await onLogin();
    } catch (error) {
        errorHandling(error);
    } finally {
        isConfirmReactivate = false;
        isLoading = false;
    }
};

onMount(() => {
    applyJsAgain();
    if (browser) {
        window.addEventListener('beforeunload', async (event) => {
            if (isConfirmReactivate) {
                // 再アクティブ化確認中にタブをクローズした場合はログアウトしておく
                await data.supabase.auth.signOut();
            }
        });
    }
});
// ここで全ユーザーをぶろーどきゃすとできるか？
</script>

<div class="page" style="

    --bg: url({loginBg});">
    <div class="bg">
        <img class="login-bg" src={loginBg} alt="" />
    </div>
    {#if dispType === 'login'}
        <div
            class="inner"
            in:fly|local={{ x: 500, duration: 500, delay: 500 }}
            out:fly|local={{ x: 500, duration: 500 }}
        >
            <H1>{APP_NAME}</H1>
            <form class="content" on:submit|preventDefault={onLogin}>
                <Input
                    bind:value={loginModel.email}
                    autocomplete="email"
                    placeholder="email"
                />
                <Input
                    bind:value={loginModel.password}
                    type="password"
                    autocomplete="current-password"
                    placeholder="password"
                />
                <Button type="submit" disabled={isLoading}>ログイン</Button>
                <div class="other-menu">
                    <a href="/info/roadmap">ロードマップ</a>
                    <ButtonText on:click={() => onChangeType('signup')}
                        >登録</ButtonText
                    >
                </div>
            </form>
            <Footer style="padding: 0" />
        </div>
    {:else if dispType === 'signup'}
        <div
            class="inner"
            in:fly|local={{ x: 500, duration: 500, delay: 500 }}
            out:fly|local={{ x: 500, duration: 500 }}
        >
            {#if isSignuped}
                <div>
                    <p>仮登録が完了しました。</p>
                    <p>
                        本登録用のメールが送信されましたので、メール内のリンクをクリックしアクティベートしてください。
                    </p>
                </div>
            {:else}
                <H1>Signup</H1>
                <form class="content" on:submit|preventDefault={onSignup}>
                    <Input
                        bind:value={signupModel.name}
                        name="id"
                        required
                        maxLength={40}
                        placeholder="name"
                        autocomplete="nickname"
                    />
                    <Input
                        bind:value={signupModel.email}
                        name="email"
                        required
                        maxLength={100}
                        placeholder="email"
                        autocomplete="email"
                    />
                    <Input
                        bind:value={signupModel.password}
                        name="password"
                        type="password"
                        required
                        minLength={8}
                        maxLength={20}
                        placeholder="password"
                        autocomplete="new-password"
                    />
                    <Input
                        bind:value={signupModel.passwordConfirm}
                        type="password"
                        name="passwordConfirm"
                        required
                        minLength={8}
                        maxLength={20}
                        placeholder="confirm password"
                    />
                    <div class="button-area">
                        <Button type="submit" disabled={isLoading}>登録</Button>
                    </div>
                </form>
            {/if}
            <button
                type="button"
                class="link"
                on:click={() => onChangeType('login')}>戻る</button
            >
        </div>
    {/if}
</div>

{#if isShowDeactivateUserDialog}
    <Dialog
        title="アカウント復元Process"
        variant="warning"
        primaryText="復元"
        bind:isShow={isShowDeactivateUserDialog}
        on:submit={onReactivate}
    >
        このアカウントは削除されていますが、復元しますか？
    </Dialog>
{/if}

<style lang="scss">
@import '../../../lib/assets/scss/core/_breakpoints';

.page {
    display: flex;
    flex: 1;
    width: 100%;
    .bg {
        position: absolute;
        inset: 0;
        z-index: -1;
        flex-shrink: 0;
        width: 100%;
        margin: auto;
        overflow: hidden;
        pointer-events: none;

        @include device('tablet') {
            position: relative;
            inset: initial;
            width: 50%;
            height: auto;
            margin: 0;
        }
        .login-bg {
            --margin: 8px;

            width: 100%;
            height: 100%;
            margin: auto;
            filter: blur(var(--margin));
            object-fit: cover;
        }
    }
    .inner {
        display: flex;
        flex-direction: column;
        flex-shrink: 0;
        justify-content: space-between;
        width: 100%;
        padding: 24px;
        margin-left: auto;
        background-color: var(--color-theme-bg-alpha);
        transition: background-color 0.2s;

        @include device('tablet') {
            width: 50%;
            background-color: var(--color-theme-bg-secondary);
        }
    }
}

.content {
    display: flex;
    flex-direction: column;
    gap: 24px;
    margin: auto 0;
}

.other-menu {
    display: flex;
    gap: 24px;
    justify-content: space-between;
}

.button-area {
    display: flex;
    justify-content: flex-end;
}
</style>
