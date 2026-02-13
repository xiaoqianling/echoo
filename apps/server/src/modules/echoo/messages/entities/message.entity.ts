import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../../../core/users/entities/user.entity';
import { Organization } from '../../organizations/entities/organization.entity';

@Entity()
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: true, type: 'text' })
  desp?: string;

  @Column({ nullable: true })
  short?: string;

  @Column({ nullable: true, type: 'json' })
  tags?: string[];

  @ManyToOne(() => User, { nullable: false })
  sender: User;

  @ManyToOne(() => Organization, { nullable: true })
  organization?: Organization;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
