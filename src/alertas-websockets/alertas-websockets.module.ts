import { forwardRef, Module } from '@nestjs/common';
import { AlertasWebsocketsService } from './alertas-websockets.service';
import { AlertasWebsocketsGateway } from './alertas-websockets.gateway';
import { AlertasModule } from 'src/alertas/alertas.module';
import { RegistrosModule } from 'src/registros/registros.module';

@Module({
  imports: [AlertasModule, forwardRef(() => RegistrosModule)],
  providers: [AlertasWebsocketsGateway, AlertasWebsocketsService],
  exports: [AlertasWebsocketsGateway], 
})
export class AlertasWebsocketsModule {}
