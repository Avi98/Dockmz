import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Organization } from './organization.entity';
import { UserOrgRoleEnum } from '../utils/enums/UserOrgRoleEnum';
import { Exclude } from 'class-transformer';

@Entity()
@Unique(['user', 'organization'])
export class OrganizationUser {
  @Exclude()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.organizations)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Organization, (org) => org.members)
  @JoinColumn({ name: 'org_id' })
  organization: Organization;

  @Column({ type: 'boolean', default: false, name: 'isOwner' })
  isOwner: boolean;

  @Column({
    type: 'enum',
    enum: UserOrgRoleEnum,
    default: UserOrgRoleEnum.MEMBER,
  })
  role: UserOrgRoleEnum;

  @Exclude()
  @CreateDateColumn({ default: () => 'now()', name: 'created_at' })
  createdAt: Date;

  @Exclude()
  @UpdateDateColumn({ default: () => 'now()', name: 'updated_at' })
  updatedAt: Date;
}
