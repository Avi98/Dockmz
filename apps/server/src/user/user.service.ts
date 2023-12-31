import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { InviteSourceEnum } from '../utils/enums/InviteSourceEnum';
import { hashPassword } from '../utils/hash';
import { AlreadyInDB, OrganizationNotFound } from '../exceptions/errors';
import { OrganizationService } from '../organization/organization.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private organizationService: OrganizationService,
  ) {}

  async getUserByEmail(userEmail) {
    const user = await this.userRepository.findOne({
      where: { email: userEmail },
    });
    return user;
  }

  //@todo after  session implementation
  getUserSource(): InviteSourceEnum {
    return InviteSourceEnum.EMAIL;
  }

  async findUserByEmail(email: string) {
    return await this.userRepository.findOneBy({ email });
  }

  async getUserById(userId: number) {
    const organizations = await this.organizationService.getUserOrgs(userId);
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });

    return {
      ...user,
      organizations,
    };
  }

  async createNewUser(userInfo: {
    firstName: string;
    lastName: string;
    username: string;
    photo: string;
    email: string;
    password: string;
  }) {
    try {
      const password = await hashPassword(userInfo.password);
      const source = this.getUserSource();

      const user = User.create({
        ...userInfo,
        password,
        source,
      });

      await this.userRepository.save(user);
    } catch (error) {
      throw new AlreadyInDB('Email already exists');
    }
  }

  private async canAddMember({ orgId, email }) {
    const organization = await this.organizationService.getOrgById(orgId);

    const alreadyExistsUser = await this.userRepository.findBy({
      email,
    });

    if (alreadyExistsUser.length) throw new AlreadyInDB('Email already exist');

    if (!organization)
      throw new OrganizationNotFound(
        `Organization with org_id:${orgId} not found`,
      );

    return true;
  }

  async createNewMemberAddToOrg(userInfo: {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    orgId: string;
  }) {
    try {
      if (
        !(await this.canAddMember({
          orgId: userInfo.orgId,
          email: userInfo.email,
        }))
      )
        return;

      const user = User.create({
        ...userInfo,
        isActive: false,
        source: this.getUserSource(),
      });
      const savedUser = await this.userRepository.save(user);

      await this.organizationService.addMemberToOrg(savedUser, userInfo.orgId);
      return savedUser;
    } catch (error) {
      throw error;
    }
  }
}
