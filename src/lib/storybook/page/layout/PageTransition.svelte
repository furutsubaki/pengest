<script lang="ts">
import {
    fly,
    type FlyParams,
    type TransitionConfig,
} from 'svelte/transition';

import { beforeNavigate } from '$app/navigation';

export let pathname = '';
$: _pathname = pathname.startsWith('/settings') ? '/settings' : pathname;
const pageTransitionDuration = 500;

let isTransition = true;
interface TransitionOption extends FlyParams {
    fn: typeof fly;
}
const maybe = (node: HTMLElement, options: TransitionOption) => {
    if (isTransition) {
        return options.fn(node, options);
    }
    // return fade(node, { duration: 0, delay: 0 });
    return (): TransitionConfig => {
        return null as unknown as TransitionConfig;
    };
};
beforeNavigate((navigation) => {
    if (
        navigation.from?.url.pathname.startsWith('/settings') &&
        navigation.to?.url.pathname.startsWith('/settings')
    ) {
        // 設定画面同士の場合はトランジションを無効
        isTransition = false;
    } else {
        isTransition = true;
    }
});
</script>

<div class="transition-outer">
    {#key _pathname}
        <div
            class="transition-inner"
            in:maybe={{
                fn: fly,
                x: -10,
                duration: pageTransitionDuration,
                delay: pageTransitionDuration,
            }}
            out:maybe={{ fn: fly, x: 10, duration: pageTransitionDuration }}
        >
            <slot />
        </div>
    {/key}
</div>

<style lang="scss">
.transition-outer {
    flex: 1;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    min-height: 100%;
}
.transition-inner {
    flex: 1;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    min-height: 100%;
}
</style>
