import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
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
  findAll(
    @Query('page') page: string,
    @Query('limit') limit: string
  ) {
    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 10;
    return this.historialCambiosService.findAll(pageNumber, limitNumber);
  }

    @Get('countByDay')
  countByDay(@Param('id') id: string) {
    return this.historialCambiosService.countToday();
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
