import { writable } from 'svelte/store';

import type { Post } from '$lib/selectModels/post';

interface PostData {
    isShow: boolean;
    type: 'post' | 'reply';
    replyPost: Post;
}
export const postData = writable<PostData>({
    isShow: false,
    type: 'post',
    replyPost: {} as Post,
});
