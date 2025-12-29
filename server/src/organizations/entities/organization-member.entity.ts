import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Organization } from './organization.entity';

export type OrganizationMemberRole = 'owner' | 'admin' | 'member';

@Entity()
export class OrganizationMember {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Organization, { nullable: false })
  organization: Organization;

  @ManyToOne(() => User, { nullable: false })
  user: User;

  @Column({ type: 'varchar', default: 'member' })
  role: OrganizationMemberRole;

  @CreateDateColumn()
  joinedAt: Date;
}
