<script lang="ts">
import dayjs from 'dayjs';

import { APP_NAME } from '$lib/consts';

const currentYear = dayjs().format('YYYY');
</script>

<footer class="footer" {...$$restProps}>
    <div class="menu">
        <a href="/info/terms" target="_blank" rel="noopener">利用規約</a>
    </div>
    <div>
        @{APP_NAME} 2023-{currentYear}
    </div>
</footer>

<style lang="scss">
.footer {
    bottom: 0;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    justify-content: flex-end;
    width: 100%;
    padding: 24px;
    font-size: var(--font-size-small);
    white-space: nowrap;
}

.menu {
    font-size: var(--font-size-small);
    color: var(--color-theme-text-secondary);
    transition: color 0.2s;
}
</style>
