import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { User } from '../user/user.entity';
import { OrganizationUser } from './organization-user.entity';

@Entity()
@Unique(['owner', 'name'])
export class Organization {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  slug: string;

  @Exclude()
  @CreateDateColumn({ default: () => 'now()', name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.ownedOrganizations)
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  @OneToMany(() => OrganizationUser, (org_user) => org_user.organization, {
    cascade: true,
  })
  members: OrganizationUser[];

  @Exclude()
  @UpdateDateColumn({ default: () => 'now()', name: 'updated_at' })
  updatedAt: Date;

  static create(org: { name: string; slug: string }) {
    const organization = new Organization();
    organization.name = org.name;
    organization.slug = org.slug;
    return organization;
  }
}
