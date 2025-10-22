import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRelatorioDto } from './dto/create.relatorio';
import { RelatoriosRepository } from './repositories/relatorios.repository';
import { RelatorioSearchDto } from './dto/relatorio.search.dtos';
import { ExcelService } from '../common/excel.service';
import * as ExcelJS from 'exceljs';
import path, { dirname } from 'path';
import { Relatorios } from './entities/Relatorios.entity';
import { RelatorioQueueService } from '../relatorio-queue/relatorio-queue.service';
import { VencimentoRelatorioDto } from './dto/vencimento.relatorio.dtos';
import { EstoqueCriticoRelatorioDto } from './dto/estoque.critico.relatorio.dtos';
import { EstoqueEntradaRelatorioDto } from './dto/estoque.entrada.relatorio.dtos';
import { EstoqueValorBrutoRelatorioDto } from './dto/estoque.valorbruto.relatorio.dtos';
@Injectable()
export class RelatoriosService {
  constructor(
    private readonly relatoriosRepository: RelatoriosRepository,
    private readonly relatorioQueueService: RelatorioQueueService,
  ) { }

  async findAll(queryParams: RelatorioSearchDto) {
    const limit = Number(process.env.LIMIT_PAGINATION) || 0;
    const [result, total] =
      await this.relatoriosRepository.findAllPagination(queryParams);

    return {
      data: result,
      meta: {
        page: 1,
        limit: Number(queryParams.limit) || limit,
        total: total,
      },
    };
  }

  async vencimento(queryParams: VencimentoRelatorioDto) {
    const resutl = await this.relatoriosRepository.save({
      nome: 'proximo_vencimento',
      start: new Date(),
      user: { id: queryParams.user_id },
      status: 'SOLICITADO',
    });
    await this.relatorioQueueService.sendProximoVencimento(queryParams, resutl.id);
    return { message: 'Solicitação de relatório realizada com sucesso' };
  }

  async estoqueCritico(queryParams: EstoqueCriticoRelatorioDto) {
    const resutl = await this.relatoriosRepository.save({
      nome: 'estoque_critico',
      start: new Date(),
      user: { id: queryParams.user_id },
      status: 'SOLICITADO',
    });

    await this.relatorioQueueService.sendEstoqueCritico(queryParams, resutl.id);
    return { message: 'Solicitação de relatório realizada com sucesso' };
  }

  async estoqueEntrada(queryParams: EstoqueEntradaRelatorioDto) {
    const resutl = await this.relatoriosRepository.save({
      nome: 'estoque_entrada',
      start: new Date(),
      user: { id: queryParams.user_id },
      status: 'SOLICITADO',
    });

    await this.relatorioQueueService.sendEstoqueEntrada(queryParams, resutl.id);
    return { message: 'Solicitação de relatório realizada com sucesso' };
  }

  async valorBrutoMensal(queryParams: EstoqueValorBrutoRelatorioDto) {
    const resutl = await this.relatoriosRepository.save({
      nome: 'valor_bruto_mensal',
      start: new Date(),
      user: { id: queryParams.user_id },
      status: 'SOLICITADO',
    });

    await this.relatorioQueueService.sendValorBrutoMensal(queryParams, resutl.id);
    return { message: 'Solicitação de relatório realizada com sucesso' };
  }
}
