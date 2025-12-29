import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
export declare class UsersService {
    private usersRepository;
    constructor(usersRepository: Repository<User>);
    findOneById(id: string): Promise<User | null>;
    findOneByEmail(email: string): Promise<User | null>;
    updateUser(id: string, updateData: Partial<User>): Promise<User>;
}
