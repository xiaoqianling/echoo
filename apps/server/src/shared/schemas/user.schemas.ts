import { z } from 'zod';

export const UpdateUserSchema = z.object({
  name: z.string().optional(),
  avatar: z.string().optional(),
  settings: z.record(z.any()).optional(),
});

export type UpdateUserDto = z.infer<typeof UpdateUserSchema>;