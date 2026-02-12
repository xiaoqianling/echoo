import { z } from 'zod';

export const CreateOrganizationSchema = z.object({
  name: z.string().min(1, '组织名称不能为空'),
  description: z.string().optional(),
});

export const AddMemberSchema = z.object({
  userId: z.string().min(1, '用户ID不能为空'),
  role: z.enum(['admin', 'member'], {
    errorMap: () => ({ message: '角色必须是 admin 或 member' }),
  }),
});

export const PublishMessageSchema = z.object({
  title: z.string().min(1, '消息标题不能为空'),
  content: z.string().min(1, '消息内容不能为空'),
});

export type CreateOrganizationDto = z.infer<typeof CreateOrganizationSchema>;
export type AddMemberDto = z.infer<typeof AddMemberSchema>;
export type PublishMessageDto = z.infer<typeof PublishMessageSchema>;
