import { SupabaseClient, Session } from '@supabase/supabase-js';

import { Database } from './DatabaseDefinitions';

import type { UserObj } from '$lib/stores/authUser';
import type { Cookie } from 'universal-cookie';

declare global {
    namespace App {
        interface Locals {
            supabase: SupabaseClient<Database>;
            getSession(): Promise<Session | null>;
            cookies: Cookie,
            authUser: UserObj | null,
        }
        // interface PageData {}
        // interface Error {}
        // interface Platform {}
    }
}

declare module '*.svg?component' {
    import type { ComponentType, SvelteComponentTyped } from 'svelte';
    import type { SVGAttributes } from 'svelte/elements';

    const content: ComponentType<
    SvelteComponentTyped<SVGAttributes<SVGSVGElement>>
    >;

    export default content;
}

declare module '*.svg?src' {
    const content: string;
    export default content;
}

declare module '*.svg?url' {
    const content: string;
    export default content;
}

declare module '*.svg?dataurl' {
    const content: string;
    export default content;
}

export { };
