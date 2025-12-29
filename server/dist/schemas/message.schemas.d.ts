import { z } from 'zod';
export declare const SendMessageSchema: z.ZodObject<{
    title: z.ZodString;
    desp: z.ZodOptional<z.ZodString>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    short: z.ZodOptional<z.ZodString>;
    organizationId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    title: string;
    desp?: string | undefined;
    short?: string | undefined;
    tags?: string[] | undefined;
    organizationId?: string | undefined;
}, {
    title: string;
    desp?: string | undefined;
    short?: string | undefined;
    tags?: string[] | undefined;
    organizationId?: string | undefined;
}>;
export type SendMessageDto = z.infer<typeof SendMessageSchema>;
