import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Este es la api de la aplicacion de control de asistencias';
  }
}
