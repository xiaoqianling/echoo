import { z } from 'zod';
export declare const CreateOrganizationSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    description?: string | undefined;
}, {
    name: string;
    description?: string | undefined;
}>;
export declare const AddMemberSchema: z.ZodObject<{
    userId: z.ZodString;
    role: z.ZodEnum<["admin", "member"]>;
}, "strip", z.ZodTypeAny, {
    role: "admin" | "member";
    userId: string;
}, {
    role: "admin" | "member";
    userId: string;
}>;
export type CreateOrganizationDto = z.infer<typeof CreateOrganizationSchema>;
export type AddMemberDto = z.infer<typeof AddMemberSchema>;
