import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Organization } from '../organization/organization.entity';
import { OrganizationUser } from '../organization/organization-user.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ default: true })
  isActive: boolean;

  @Exclude()
  @Column({
    nullable: true,
  })
  password: string;

  @Exclude()
  @CreateDateColumn({ default: () => 'now()', name: 'created_at' })
  createdAt: Date;

  @Exclude()
  @UpdateDateColumn({ default: () => 'now()', name: 'updated_at' })
  updatedAt: Date;

  @Column({
    type: 'text',
    nullable: true,
  })
  photo: string | null;

  @Column({
    nullable: false,
    unique: true,
    type: 'text',
  })
  email: string | null;

  @Column({
    type: 'enum',
    enumName: 'source',
    enum: ['invite', 'google', 'git', 'azure', 'email'],
    default: 'invite',
  })
  source: string;

  @OneToMany(() => Organization, (org) => org.owner, {
    cascade: true,
  })
  organizations: Organization[];

  @OneToMany(() => OrganizationUser, (org_user) => org_user.user, {
    cascade: true,
  })
  ownedOrganizations: OrganizationUser[];

  static create(userInfo: {
    firstName: string;
    lastName: string;
    photo?: string;
    email: string;
    password?: string;
    username: string;
    isActive?: boolean;
    source: 'invite' | 'google' | 'git' | 'azure' | 'email';
  }) {
    const user = new User();
    user.firstName = userInfo.firstName;
    user.email = userInfo.email;
    user.lastName = userInfo.lastName;
    user.source = userInfo.source;
    user.photo = userInfo.photo;
    user.password = userInfo.password;
    user.isActive = userInfo?.isActive || false;
    user.username = userInfo.username;

    return user;
  }
}
