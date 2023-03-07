<script lang="ts" context="module"></script>

<script lang="ts">
import { APP_NAME } from '$lib/consts';

import dayjs from 'dayjs';
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
    display: flex;
    justify-content: flex-end;
    align-items: center;
    flex-wrap: wrap;
    bottom: 0;
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
