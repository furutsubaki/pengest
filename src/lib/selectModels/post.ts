import type { User } from '$lib/selectModels/user';

export interface Post {
    [key: string]: string;
    id: string;
    text: string;
    parentPostId: string;
    updatedAt: string;
    Images: {
        id: string,
    }[],
    User: User,
}

export default {
    id: true,
    text: true,
    parentPostId: true,
    updatedAt: true,
    Post_Image: {
        select: {
            Image: {
                select: {
                    id: true,
                },
            },
        },
    },
    // ここUserモデルから引っ張ってくる？（あそこほど量いらないと思うけど……
    User: {
        select: {
            id: true,
            deactivateAt: true,
            freezeAt: true,
            Profile: {
                select: {
                    screenName: true,
                    name: true,
                    icon: true,
                },
            },
        },
    },
};
