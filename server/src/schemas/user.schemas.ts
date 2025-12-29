import { z } from 'zod';

export const UpdateUserSchema = z.object({
  name: z.string().optional(),
  avatar: z.string().optional(),
});

export type UpdateUserDto = z.infer<typeof UpdateUserSchema>;