<script lang="ts">
import { SvelteToast } from '@zerodevx/svelte-toast';

const options = {
    // reversed: false,
};
</script>

<div class="notify">
    <SvelteToast {options} />
</div>

<style lang="scss">
/* stylelint-disable custom-property-pattern */

.notify {
    :global() {
        --toastContainerTop: auto;
        --toastContainerRight: 24px;
        --toastContainerBottom: 8rem;
        --toastContainerLeft: auto;
        --toastMsgPadding: 24px;
        --toastWidth: 100%;
    }
    :global(.info) {
        // --toastBackground: var(--color-status-info-alpha);
        --toastBarBackground: var(--color-status-info);
    }
    :global(.success) {
        // --toastBackground: var(--color-status-success-alpha);
        --toastBarBackground: var(--color-status-success);
    }
    :global(.warning) {
        // --toastBackground: var(--color-status-warning-alpha);
        --toastBarBackground: var(--color-status-warning);
    }
    :global(.danger) {
        // --toastBackground: var(--color-status-danger-alpha);
        --toastBarBackground: var(--color-status-danger);
    }
}
</style>
