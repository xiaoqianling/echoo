import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Organization } from './organization.entity';
import { User } from '../../../core/users/entities/user.entity';

@Entity()
export class OrganizationMessage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: false })
  content: string;

  @ManyToOne(() => Organization, { nullable: false })
  organization: Organization;

  @ManyToOne(() => User, { nullable: false })
  sender: User;

  @CreateDateColumn()
  createdAt: Date;
}