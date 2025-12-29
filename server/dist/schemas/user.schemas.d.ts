import { z } from 'zod';
export declare const UpdateUserSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    avatar: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    avatar?: string | undefined;
}, {
    name?: string | undefined;
    avatar?: string | undefined;
}>;
export type UpdateUserDto = z.infer<typeof UpdateUserSchema>;
