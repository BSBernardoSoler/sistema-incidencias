import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { AlertasService } from '../alertas/alertas.service';
import { Registro } from 'src/registros/entities/registro.entity';
import { RegistrosService } from 'src/registros/registros.service';

@Injectable()
export class AlertasWebsocketsService {

    
    constructor(
        private readonly alertasService: AlertasService,
        @Inject(forwardRef(() => RegistrosService)) private readonly registrosService: RegistrosService,
    ) {}
    
    async createAleta(registro: Registro, descripcion: string,tipo_alerta: string) {
        const registroS = await this.registrosService.findOne(registro.id);
        if (!registroS) {
            throw new Error('Registro no encontrado');
        }
        const notificacion = await this.alertasService.create({
            registro_id :registroS.id,
            tipo_alerta: tipo_alerta,
            descripcion,
            fecha_generada: new Date().toISOString(),
            resuelta: false,
            estado: 1, // Asumiendo que el estado por defecto es 1
         
        });
        if (!notificacion) {
            throw new Error('Error al crear la notificación');
        }
        return notificacion;
    }

}
