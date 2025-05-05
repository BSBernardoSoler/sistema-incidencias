import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { HistorialCambiosService } from './historial-cambios.service';
import { CreateHistorialCambioDto } from './dto/create-historial-cambio.dto';
import { UpdateHistorialCambioDto } from './dto/update-historial-cambio.dto';

@Controller('historial-cambios')
export class HistorialCambiosController {
  constructor(private readonly historialCambiosService: HistorialCambiosService) {}

  @Post()
  create(@Body() createHistorialCambioDto: CreateHistorialCambioDto) {
    return this.historialCambiosService.create(createHistorialCambioDto);
  }

  @Get()
  findAll() {
    return this.historialCambiosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.historialCambiosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHistorialCambioDto: UpdateHistorialCambioDto) {
    return this.historialCambiosService.update(+id, updateHistorialCambioDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.historialCambiosService.remove(+id);
  }
}
