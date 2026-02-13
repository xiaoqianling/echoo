import { User } from '@/modules/core/users/entities/user.entity';
import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user: User;
}
