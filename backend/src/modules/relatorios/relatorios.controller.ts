import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  createrRelatorio,
  getListRelatorio,
} from './swagger/relatorio.swagger';
import { RelatoriosService } from './relatorios.service';
import { createPermissionsGuard } from '../auth/permissions.guard';
import { CreateRelatorioDto } from './dto/create.relatorio';
import { RelatorioSearchDto } from './dto/relatorio.search.dtos';
import { VencimentoRelatorioDto } from './dto/vencimento.relatorio.dtos';
import { EstoqueValorBrutoRelatorioDto } from './dto/estoque.valorbruto.relatorio.dtos';
import { EstoqueCriticoRelatorioDto } from './dto/estoque.critico.relatorio.dtos';
import { EstoqueEntradaRelatorioDto } from './dto/estoque.entrada.relatorio.dtos';

@ApiTags('Relatórios')
@ApiBearerAuth('JWT-auth')
@Controller('relatorios')
@UseGuards(JwtAuthGuard)
export class RelatoriosController {
  constructor(private readonly relatorioService: RelatoriosService) {}

  @Get()
  @ApiOperation({ summary: 'Obtem uma lista relatorios gerados' })
  @ApiResponse({
    status: 200,
    ...getListRelatorio,
  })
  @ApiUnauthorizedResponse({
    description: 'Não autorizado',
  })
  findAll(@Query() queryParams: RelatorioSearchDto) {
    return this.relatorioService.findAll(queryParams);
  }

  @Get('vencimento')
  @ApiOperation({
    summary: 'Relatório de Produtos Próximos ao Vencimento',
  })
  @ApiResponse({
    status: 200,
    ...createrRelatorio,
  })
  @ApiUnauthorizedResponse({ description: 'Não autorizado' })
  @ApiForbiddenResponse({
    description: 'Permissão insuficiente',
  })
  @UseGuards(createPermissionsGuard('READ'))
  vencimento(@Query() queryParam: VencimentoRelatorioDto, @Request() req) {
    queryParam.user_id = req.user.id;
    return this.relatorioService.vencimento(queryParam);
  }

  @Get('critico')
  @ApiOperation({
    summary: 'Relatório de Produtos com Estoque Crítico',
  })
  @ApiResponse({
    status: 200,
    ...createrRelatorio,
  })
  @ApiUnauthorizedResponse({ description: 'Não autorizado' })
  @ApiForbiddenResponse({
    description: 'Permissão insuficiente',
  })
  @UseGuards(createPermissionsGuard('READ'))
  critico(@Query() queryParam: EstoqueCriticoRelatorioDto, @Request() req) {
    queryParam.user_id = req.user.id;
    return this.relatorioService.estoqueCritico(queryParam);
  }

  @Get('entrada')
  @ApiOperation({
    summary: 'Relatório de Entrada de Produtos por Período',
  })
  @ApiResponse({
    status: 200,
    ...createrRelatorio,
  })
  @ApiUnauthorizedResponse({ description: 'Não autorizado' })
  @ApiForbiddenResponse({
    description: 'Permissão insuficiente',
  })
  @UseGuards(createPermissionsGuard('READ'))
  entradaEstoqeu(
    @Query() queryParam: EstoqueEntradaRelatorioDto,
    @Request() req,
  ) {
    queryParam.user_id = req.user.id;
    return this.relatorioService.estoqueEntrada(queryParam);
  }

  @Get('valor-bruto')
  @ApiOperation({
    summary: 'Relatório de Lucro Bruto Total por Mês',
  })
  @ApiResponse({
    status: 200,
    ...createrRelatorio,
  })
  @ApiUnauthorizedResponse({ description: 'Não autorizado' })
  @ApiForbiddenResponse({
    description: 'Permissão insuficiente',
  })
  @UseGuards(createPermissionsGuard('READ'))
  valorbruto(
    @Query() queryParam: EstoqueValorBrutoRelatorioDto,
    @Request() req,
  ) {
    queryParam.user_id = req.user.id;
    return this.relatorioService.valorBrutoMensal(queryParam);
  }
}
