import type { z } from 'zod';

import { VALIDATION } from '$lib/consts/validation';

/**
 * loginSchema用カスタムエラーメッセージ
 */
export const loginSchemaErrorMap: z.ZodErrorMap = () => {
    // 強制的にログインエラーのみを返す
    return { message: VALIDATION.VALID_LOGIN };
};
