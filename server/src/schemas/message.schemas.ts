import { z } from 'zod';

export const SendMessageSchema = z.object({
  title: z.string().min(1, '标题不能为空'),
  desp: z.string().optional(),
  tags: z.array(z.string()).optional(),
  short: z.string().optional(),
  organizationId: z.string().optional(),
});

export type SendMessageDto = z.infer<typeof SendMessageSchema>;
