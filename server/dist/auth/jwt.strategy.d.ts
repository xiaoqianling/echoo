import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { JwtPayload } from '../common/interfaces/websocket.interface';
declare const JwtStrategy_base: new (...args: any) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    private usersRepository;
    constructor(usersRepository: Repository<User>);
    validate(payload: JwtPayload): Promise<User>;
}
export {};
