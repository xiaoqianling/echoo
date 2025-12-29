import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export type ClientType = 'web' | 'desktop' | 'mobile';

@Entity()
export class Client {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { nullable: false })
  user: User;

  @Column({ type: 'varchar', nullable: false })
  type: ClientType;

  @Column({ nullable: true, type: 'jsonb' })
  deviceInfo: Record<string, any>;

  @Column({ nullable: true })
  lastOnline: Date;

  @CreateDateColumn()
  createdAt: Date;
}
