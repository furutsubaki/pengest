import { z } from 'zod';

// TODO: validationを共通化
export const emailUpdatePatchSchema = z.object({
    email: z.string().min(1).email().max(100),
});
export type EmailUpdatePatchType = z.infer<typeof emailUpdatePatchSchema>;
