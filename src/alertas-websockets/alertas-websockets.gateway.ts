import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import {Server,Socket} from 'socket.io';

import { HttpException, HttpStatus } from '@nestjs/common';
import { Registro } from 'src/registros/entities/registro.entity';
import { AlertasWebsocketsService } from './alertas-websockets.service';

@WebSocketGateway()
export class AlertasWebsocketsGateway implements OnGatewayConnection , OnGatewayDisconnect {
  constructor(
    private readonly websocketsService: AlertasWebsocketsService
  ) {}
  
  @WebSocketServer() server: Server;
  private clients: { [email: string]: Socket } = {};

 
  handleConnection(client: Socket) {
    const email = client.handshake.query.email;
    if (typeof email === 'string') {
      this.clients[email] = client;
      console.log(`Client connected: ${email}`);
    } else {
      client.disconnect();
      console.log('Client disconnected due to missing or invalid email');
    }
  }
  
  handleDisconnect(client: Socket) {
    const email = client.handshake.query.email;
    if (typeof email === 'string') {
      delete this.clients[email];
      console.log(`Client disconnected: ${email}`);
    }
  }

  async notifyClient(registro:Registro, descripcion :string ,tipo_alerta: string) {

    const notificacion =await this.websocketsService.createAleta(registro, descripcion, tipo_alerta);
    if(!notificacion){
      throw new HttpException("error al crear la notficacion",HttpStatus.BAD_REQUEST);
    }
    
    this.server.emit('dataUpdate', notificacion);
    
  }

 
}
