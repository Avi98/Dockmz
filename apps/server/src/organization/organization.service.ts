import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Organization } from './organization.entity';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { OrganizationUser } from './organization-user.entity';
import { UserOrgRoleEnum } from '../utils/enums/UserOrgRoleEnum';
import { AlreadyInDB, InValidPayload, NotInDB } from '../exceptions/errors';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(Organization)
    private orgRepository: Repository<Organization>,
    @InjectRepository(OrganizationUser)
    private orgUserRepository: Repository<OrganizationUser>,
  ) {}

  async createNewOrg(org: { name: string; owner: User; slug }) {
    try {
      const organization = Organization.create({
        name: org.name,
        slug: org.slug,
      });

      organization.owner = org.owner;
      const orgSaved = await this.orgRepository.save(organization);
      const orgUser = this.orgUserRepository.create({
        isOwner: true,
        role: UserOrgRoleEnum.ADMIN,
      });
      orgUser.organization = orgSaved;
      orgUser.user = org.owner;
      await this.orgUserRepository.save(orgUser);
    } catch (error) {
      console.log({ error });
      throw error;
    }
  }

  private async getUserOwnedOrgs(userId: number) {
    return (await this.getAdminOrg(userId))?.map((org) => org.org_id) || [];
  }

  private async getAdminOrg(userId: number): Promise<{ org_id: string }[]> {
    return await this.orgUserRepository
      .createQueryBuilder('org_user')
      .leftJoinAndSelect(
        'org_user.user',
        'user',
        'org_user.user_id = :userId',
        { userId },
      )
      .where('org_user.isOwner = :isOwner', { isOwner: true })
      .select(['org_user.organization'])
      .getRawMany();
  }
  //must not exceed max value
  async addMemberToOrg(
    user: User,
    orgId: string,
    role = UserOrgRoleEnum.MEMBER,
  ) {
    try {
      if (role == UserOrgRoleEnum.ADMIN)
        throw new InValidPayload('Org can not have more than 1 admin');

      if (await this.isOwner(user.id, orgId))
        throw new AlreadyInDB('Owner can not be added as member');

      const org = await this.orgRepository.findOneBy({ id: orgId });
      const orgUser = this.orgUserRepository.create({ role });
      orgUser.user = user;
      orgUser.organization = org;

      await this.orgUserRepository.save(orgUser);
      return `userId: ${user.firstName || user.username} saved for ${org.name}`;
    } catch (error) {
      if (error instanceof AlreadyInDB) throw error;
      if (error instanceof InValidPayload) throw error;

      throw new AlreadyInDB('Organization has member with same id');
    }
  }

  private async isOwner(userId: number, orgId: string) {
    try {
      const isOwner = await this.orgRepository.findOne({
        where: { id: orgId, owner: { id: userId } },
      });
      if (isOwner) {
        return true;
      }
    } catch (error) {
      return false;
    }
  }

  async getUserOrgs(userId: number) {
    const ownedOrgIds = await this.getUserOwnedOrgs(userId);
    const allUsersOrgs = [...(await this.findOrgByUserId(userId))] as Array<
      Organization & { isOwned: boolean }
    >;

    allUsersOrgs.forEach((org) => {
      if (ownedOrgIds.includes(org.id)) {
        org.isOwned = true;
      } else {
        org.isOwned = false;
      }
    });

    return allUsersOrgs;
  }

  private async findOrgByUserId(userId: number) {
    try {
      return await this.orgRepository
        .createQueryBuilder('og')
        .where('og.owner_id = :userId', { userId })
        .getMany();
    } catch (error) {
      throw new NotInDB('User does not have any organization.');
    }
  }

  async getAllMembers(orgId: string) {
    if (!(await this.orgRepository.exist({ where: { id: orgId } })))
      throw new NotInDB(`Organization_id: ${orgId} does not exists`);

    return await this.orgUserRepository
      .createQueryBuilder('org_user')
      .innerJoin('user', 'user', 'user.id = org_user.user_id')
      .where('org_user.org_id = :id', { id: orgId })
      .where('org_user.role IN (:...roles)', {
        roles: [UserOrgRoleEnum.MEMBER, UserOrgRoleEnum.VIEWER],
      })
      .addSelect([
        'user.email',
        'org_user.role',
        'user.firstName',
        'user.lastName',
      ])
      .orderBy('org_user.created_at', 'DESC')
      .getRawMany();
  }

  async updateMemberRole(memberInfo: {
    id: number;
    role: Omit<UserOrgRoleEnum, 'Admin'>;
  }) {
    try {
      if (memberInfo.role === UserOrgRoleEnum.ADMIN)
        throw new AlreadyInDB('Can not set multiple Admin');

      const orgUser = await this.orgUserRepository.findOne({
        where: {
          user: {
            id: memberInfo.id,
          },
        },
      });

      orgUser.role = memberInfo.role as UserOrgRoleEnum;
      await this.orgUserRepository.save(orgUser);
    } catch (error) {
      if (error instanceof AlreadyInDB) throw error;
      throw new Error('Something went wrong');
    }
  }

  async deleteMember(memberId: number) {
    try {
      await this.orgUserRepository
        .createQueryBuilder('org_user')
        .delete()
        .where('user_id = :userId', { userId: memberId })
        .execute();
    } catch (error) {
      throw new Error('Unable to delete');
    }
  }

  async getMemberRole(memberId: number) {
    try {
      return await this.orgUserRepository.find({
        select: {
          role: true,
        },
        where: {
          user: {
            id: Number(memberId),
          },
        },
      });
    } catch (error) {
      return null;
    }
  }

  getOrgById(orgId: string) {
    return this.orgRepository.findOneBy({ id: orgId });
  }
}
