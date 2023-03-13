<script lang="ts">
import { createEventDispatcher } from 'svelte';
import { fade } from 'svelte/transition';
import Portal from 'svelte-portal';

const dispatch = createEventDispatcher();

export let variant: '' | 'transparent' = '';

const onClose = () => {
    dispatch('close');
};
</script>

<Portal>
    <button
        type="button"
        class="overlay {variant}"
        transition:fade={{ duration: 200 }}
        on:click|self|preventDefault={onClose}
    >
        <style scoped>
        * {
            cursor: initial;
        }
        </style>
        <slot />
    </button>
</Portal>

<style lang="scss">
.overlay {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background-color: rgb(0 0 0 / 50%);
    border: 0;
    transition: background-color 0.2s;
}

.transparent {
    background-color: transparent;
}
</style>
