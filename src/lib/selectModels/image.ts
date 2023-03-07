
export interface Image {
    [key: string]: string | object;
    id: string;
    src: string; // ローカル用
    createdAt: Date;
    updatedAt: Date;
    Post: {
        id: string;
        text: string;
        createdAt: string;
        User: {
            id: string;
            Profile: {
                screenName: string;
            }
        }
    }[],
    User: {
        id: string;
        Profile: {
            screenName: string;
        }
    }
}

export default {
    id: true,
    originalSrc: true,
    createdAt: true,
    updatedAt: true,
    Post_Image: {
        select: {
            Post: {
                select: {
                    id: true,
                    text: true,
                    createdAt: true,
                    User: {
                        select: {
                            id: true,
                            Profile: {
                                select: {
                                    screenName: true,
                                },
                            },
                        },
                    },
                },
            },
        },
    },
    User: {
        select: {
            id: true,
            Profile: {
                select: {
                    screenName: true,
                },
            },
        },
    },
};
