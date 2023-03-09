<script lang="ts">
import axios from 'axios';

import { errorHandling } from '$lib/utils';
import { success } from '$lib/utils/notification';

let model = {
    currentPassword: '',
    password: '',
    passwordConfirm: '',
};

let isLoading = false;
let isShowConfirm = false;
const onSubmitConfirm = () => {
    isShowConfirm = true;
};

const onSubmit = async () => {
    isShowConfirm = false;
    isLoading = true;
    try {
        await axios.patch('/api/v1/authed/auth/password-update', model);
        model.currentPassword = '';
        model.password = '';
        model.passwordConfirm = '';
        success('パスワードを更新しました');
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
            <FormItem label="現在のパスワード">
                <Input
                    bind:value={model.currentPassword}
                    type="password"
                    placeholder="現在のパスワード"
                />
            </FormItem>
            <FormItem label="新しいパスワード">
                <Input
                    bind:value={model.password}
                    type="password"
                    placeholder="新しいパスワード"
                />
            </FormItem>
            <FormItem label="パスワードを確認">
                <Input
                    bind:value={model.passwordConfirm}
                    type="password"
                    placeholder="パスワードを確認"
                />
            </FormItem>
        </FormGroup>
        <div class="button-area">
            <Button on:click={onSubmitConfirm} disabled={isLoading}>保存</Button
            >
        </div>
    </Form>
</div>

{#if isShowConfirm}
    <Dialog
        title="パスワード更新"
        variant="warning"
        primaryText="更新"
        bind:isShow={isShowConfirm}
        on:submit={onSubmit}
    >
        パスワードを更新してもよろしいですか？
    </Dialog>
{/if}

<style lang="scss">
.wrap {
    padding: 24px;
}
.icon {
    display: inline-block;
    margin: 0;
    padding: 0;
    height: auto;
    max-width: 50px;
    max-height: 50px;
    font-size: 2.4rem;
    color: var(--color-theme-text-primary);
    border: 0;
    border-radius: 100%;
    overflow: hidden;
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
