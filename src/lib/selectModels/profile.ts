export interface Profile {
    screenName: string;
    name: string;
    icon: string;
    headerImage: string | null;
    detail: string;
    linkHome: string | null;
    linkTwitter: string | null;
    linkPixiv: string | null;
    linkGithub: string | null;
    updatedAt: string;
    User: {
        id: string;
        deactivateAt: string | null;
        freezeAt: string | null;
    },
}

export default {
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
    User: {
        select: {
            id: true,
            deactivateAt: true,
            freezeAt: true,
        },
    },
};
