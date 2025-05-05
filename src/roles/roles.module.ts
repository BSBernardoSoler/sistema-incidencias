import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Role])], // Add your imports here if needed
  controllers: [RolesController],
  providers: [RolesService],
  exports: [RolesService], // Export the service if needed in other modules
})
export class RolesModule {}
