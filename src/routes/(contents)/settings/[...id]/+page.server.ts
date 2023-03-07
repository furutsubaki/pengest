import { error } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';

import { list } from '$lib/stores/settings';

export const load: PageServerLoad = async (event) => {
    const { params} = event;

    interface Item {
        [key: string]: string | { [key: string]: string }[]
    }
    let ids: string[] = [];
    let _parent: Item | undefined = undefined;
    let child: Item | undefined = undefined;

    if (params.id) {
        ids = params.id.split('/');
        let parentId = '';
        let childId = '';

        list.subscribe(v => {
            _parent = v.find(item => item.id === ids[0]);
            if (_parent) {
                parentId = _parent.id as string;
                child = (_parent.child as { [key: string]: string }[]).find(item => (item.id as string) === ids[1]);
                if (child) {
                    childId = child.id as string;
                }
            }
        });

        if (!parentId) {
            throw error(404, 'ページが存在しません');
        }

        if (ids.length > 1 === !childId) {
            throw error(404, 'ページが存在しません');
        }

    }

    let title = 'SETTINGS';
    if (child) {
        title = `SETTINGS - ${(child as Item).label}`;
    } else if (_parent) {
        title = `SETTINGS - ${(_parent as Item).label}`;
    }

    return {
        title,
        ids: params.id ? params.id.split('/') : [],
    };
};

export const prerender = true;
