import svg from '@poppanator/sveltekit-svg';
import { sveltekit } from '@sveltejs/kit/vite';
import autoprefixer from 'autoprefixer';
import Components from 'unplugin-svelte-components/vite';

import type { UserConfig } from 'vite';

const config: UserConfig = {
    server: {
        host: '0.0.0.0',
    },
    css: {
        postcss: {
            plugins: [
                autoprefixer,
            ],
        },
    },
    plugins: [
        Components({
            dts: './src/@types/components.d.ts',
            dirs: ['./src/lib/storybook'],
            importPathTransform: v => v.replace(/(.*)lib(.*)/, '$lib$2'),
        }),
        sveltekit(),
        svg({
            svgoOptions: {
                multipass: true,
                plugins: [],
            },
        }),
    ],
    optimizeDeps: {
        exclude: ['svelte-tide-image-box', '@zerodevx/svelte-toast'],
    },
};

export default config;
