import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Session,
  UseGuards,
} from '@nestjs/common';
import { SessionGuard } from '../../session/session.gaurd';
import {
  OrganizationInfoDto,
  UpdateMemberRoleDto,
} from '../../organization/org-info.dto';
import { OrganizationService } from '../../organization/organization.service';
import { UserService } from '../../user/user.service';
import { UserSessionType } from '../../session/interfaces';
import { UserOrgRoleEnum } from '../../utils/enums/UserOrgRoleEnum';
import { RolesGuard } from '../../organization/roles.gaurd';
import { Roles } from '../../organization/roles.metadata';

@Controller('org')
export class OrganizationController {
  constructor(
    private orgService: OrganizationService,
    private userService: UserService,
  ) {}

  @UseGuards(SessionGuard)
  @Post('create')
  async createNewOrg(
    @Body() orgInfo: OrganizationInfoDto,
    @Session() session: UserSessionType,
  ) {
    try {
      const userEmail = session.email;
      const owner = await this.userService.getUserByEmail(userEmail);

      await this.orgService.createNewOrg({
        owner,
        slug: orgInfo.orgSlug,
        name: orgInfo.orgName,
      });
      return `Successfully ${orgInfo.orgName} added`;
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(SessionGuard)
  @Get('all-members/:orgId')
  async get(@Param('orgId') orgId: string) {
    try {
      return this.orgService.getAllMembers(orgId);
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(SessionGuard)
  @Get('get-orgs/:userId')
  async getOrgs(@Param('userId') userId: string) {
    return await this.orgService.getUserOrgs(Number(userId));
  }

  @UseGuards(SessionGuard, RolesGuard)
  @Roles([UserOrgRoleEnum.ADMIN, UserOrgRoleEnum.MANAGER])
  @Post('update-member-role')
  async updateMemberRole(@Body() mem: UpdateMemberRoleDto) {
    return await this.orgService.updateMemberRole({
      id: mem.memberId,
      role: mem.role,
    });
  }

  @UseGuards(SessionGuard, RolesGuard)
  @Roles([UserOrgRoleEnum.ADMIN, UserOrgRoleEnum.MANAGER])
  @Delete('delete-member/:memberId')
  async deleteMember(@Param('memberId') memberId: string) {
    await this.orgService.deleteMember(Number(memberId));
    return 'Successfully removed member';
  }
}
