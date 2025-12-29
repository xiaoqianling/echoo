import { User } from '../../users/entities/user.entity';
export declare class Organization {
    id: string;
    name: string;
    description?: string;
    owner: User;
    createdAt: Date;
    updatedAt: Date;
}
