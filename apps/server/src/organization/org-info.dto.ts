import { IsEnum, IsNumber, IsString } from 'class-validator';
import { UserOrgRoleEnum } from '../utils/enums/UserOrgRoleEnum';

export class OrganizationInfoDto {
  @IsString()
  orgName: string;

  @IsString()
  orgSlug: string;

  @IsNumber()
  maxOrgSize: number;
}

export class UpdateMemberRoleDto {
  @IsNumber()
  memberId: number;

  @IsEnum(UserOrgRoleEnum)
  role: Omit<UserOrgRoleEnum, 'ADMIN'>;
}
export interface OrgMemberResponse {
  org_user_id: string;
  org_user_isOwner: boolean;
  org_user_role: string;
  org_user_user_id: number;
  org_user_org_id: string;
  user_firstName: string;
  user_lastName: string;
  user_email: string;
  role: string;
}
