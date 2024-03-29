import { Module } from '@nestjs/common';
import { SessionService } from './session.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Session } from './session.entitiy';

@Module({
  imports: [TypeOrmModule.forFeature([Session])],
  providers: [SessionService],
})
export class SessionModule {}
