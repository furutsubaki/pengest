import {z} from 'zod';

import {loginSchemaErrorMap} from '$lib/validations/loginErrorMap';

export const signinPostSchema = z.object({
    // スクリーンネームかメールアドレス
    // screenNameOrEmail: z.union([
    //     z.string({ errorMap: loginSchemaErrorMap }).min(1).max(40),
    //     z.string({ errorMap: loginSchemaErrorMap }).min(1).email().max(100)
    // ]),
    email:z.string({ errorMap: loginSchemaErrorMap }).min(1).email().max(100),
    password: z.string({ errorMap: loginSchemaErrorMap }).min(8).max(20),
});
export type SigninPostType = z.infer<typeof signinPostSchema>;
