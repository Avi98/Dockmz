import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from '../../auth/auth.service';
import { UserService } from '../../user/user.service';
import { User } from '../../user/user.entity';
import { OrganizationService } from '../../organization/organization.service';
import { Organization } from '../../organization/organization.entity';
import { OrganizationUser } from '../../organization/organization-user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Organization, OrganizationUser])],
  providers: [AuthService, UserService, OrganizationService],
  controllers: [AuthController],
})
export class PublicApiModule {}
