import { AuthService } from './auth.service';
import type { AuthenticatedRequest } from '../common/interfaces/request.interface';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(body: unknown): Promise<{
        accessToken: string;
        refreshToken: string;
        user: Omit<import("../users/entities/user.entity").User, "password">;
    }>;
    login(body: unknown): Promise<{
        accessToken: string;
        refreshToken: string;
        user: Omit<import("../users/entities/user.entity").User, "password">;
    }>;
    getMe(req: AuthenticatedRequest): {
        id: string;
        email: string;
        name: string;
        avatar?: string;
        createdAt: Date;
        updatedAt: Date;
    };
    refreshToken(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
}
