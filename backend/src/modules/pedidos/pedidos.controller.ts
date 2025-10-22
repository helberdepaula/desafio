import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { PedidosService } from './pedidos.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
import { PedidoSearchDto } from './dto/pedido.search.dto';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { createPermissionsGuard } from '../auth/permissions.guard';
import { getlistPedidoResponse } from './swagger/pedidos.swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Pedidos')
@ApiBearerAuth('JWT-auth')
@Controller('pedidos')
@UseGuards(JwtAuthGuard)
export class PedidosController {
  constructor(private readonly pedidosService: PedidosService) {}
  
  @Get()
  @ApiOperation({ summary: 'Obter uma lista de pedidos com paginação' })
  @ApiResponse({
    status: 200,
    ...getlistPedidoResponse,
  })
  @ApiUnauthorizedResponse({ description: 'Não autorizado' })
  @ApiForbiddenResponse({
    description: 'Permissão insuficiente',
  })
  @UseGuards(createPermissionsGuard('READ'))
  findAll(@Query() queryPrams: PedidoSearchDto) {
    return this.pedidosService.findAll(queryPrams);
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: 'number' })
  @ApiOperation({ summary: 'Obtem registro de uma ordem de venda' })
  @ApiResponse({
    status: 200,
    ...{},
  })
  @ApiNotFoundResponse({
    description: 'Ordem não encontrado ou não existe na base de dados',
  })
  @ApiUnauthorizedResponse({ description: 'Não autorizado' })
  @ApiForbiddenResponse({
    description: 'Permissão insuficiente',
  })
  @UseGuards(createPermissionsGuard('READ'))
  findOne(@Param('id') id: string) {
    return this.pedidosService.findOne(+id);
  }

  @Post()
  @ApiOperation({
    summary: 'Criar uma ordem de venda',
  })
  @ApiResponse({
    status: 200,
    ...{},
  })
  @ApiNotFoundResponse({
    description: 'Usuário não encontrado ou foi removido da base de dados',
  })
  @ApiUnauthorizedResponse({ description: 'Não autorizado' })
  @ApiForbiddenResponse({
    description: 'Permissão insuficiente',
  })
  @UseGuards(createPermissionsGuard('CREATE'))
  create(@Body() createPedidoDto: CreatePedidoDto, @Request() req) {
    createPedidoDto.user_id = req.user.id;
    return this.pedidosService.create(createPedidoDto);
  }


  @Delete('item/:id')
  @ApiOperation({ summary: 'Cancelar um iten dentro do pedido existente existente' })
  @ApiOkResponse({ description: 'Pedido cancelado com sucesso' })
  @ApiConflictResponse({ description: 'O item foi já foi cancelado' })
  @ApiNotFoundResponse({
    description: 'Item não foi encontrado',
  })
  @ApiUnauthorizedResponse({ description: 'Não autorizado' })
  @ApiForbiddenResponse({
    description: 'Permissão insuficiente',
  })
  @UseGuards(createPermissionsGuard('DELETE'))
  removeItem(@Param('id') id: string) {
    return this.pedidosService.removeItem(+id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Cancelar um pedido existente existente' })
  @ApiOkResponse({ description: 'Ordem cancelada com sucesso' })
  @ApiConflictResponse({ description: 'A ordem já foi cancelado' })
  @ApiNotFoundResponse({
    description: 'Ordem não encontrada',
  })
  @ApiUnauthorizedResponse({ description: 'Não autorizado' })
  @ApiForbiddenResponse({
    description: 'Permissão insuficiente',
  })
  @UseGuards(createPermissionsGuard('DELETE'))
  remove(@Param('id') id: string) {
    return this.pedidosService.remove(+id);
  }
}
