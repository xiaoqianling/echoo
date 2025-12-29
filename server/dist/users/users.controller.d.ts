import { UsersService } from './users.service';
import type { AuthenticatedRequest } from '../common/interfaces/request.interface';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getMe(req: AuthenticatedRequest): Promise<import("./entities/user.entity").User | null>;
    updateMe(req: AuthenticatedRequest, body: unknown): Promise<import("./entities/user.entity").User>;
}
