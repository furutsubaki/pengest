export interface User {
    id: string;
    deactivateAt: Date | null;
    freezeAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    Profile: {
        screenName: string;
        name: string;
        icon: string;
        headerImage: string | null;
        detail: string;
        linkHome: string | null;
        linkTwitter: string | null;
        linkPixiv: string | null;
        linkGithub: string | null;
        updatedAt: Date;
    } | null,
}

export interface UserMeta {
    isDeactivate: string | null;
    isFreeze: string | null;
    followingCount: number;
    followingIds: string[];
    followerCount: number;
    followerIds: string[];
}

export default {
    id: true,
    deactivateAt: true,
    freezeAt: true,
    createdAt: true,
    updatedAt: true,
    Profile: {
        select: {
            screenName: true,
            name: true,
            icon: true,
            headerImage: true,
            detail: true,
            linkHome: true,
            linkTwitter: true,
            linkPixiv: true,
            linkGithub: true,
            updatedAt: true,
        },
    },
};
