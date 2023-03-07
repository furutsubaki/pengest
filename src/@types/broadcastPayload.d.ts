import type { User } from '$lib/selectModels/user';

export interface StatusNoticePayload {
    payloadType: 'FOLLOW';
    message: string;
    user: User,
}
