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
    private readonly ExcelService: ExcelService,
    private readonly relatoriosRepository: RelatoriosRepository,
    private readonly relatorioQueueService: RelatorioQueueService,
  ) {}

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
      status: 'START',
    });
    this.proximoVencimentoXls(resutl);
    return { message: 'Solicitação de relatório realizada com sucesso' };
  }

  async estoqueCritico(queryParams: EstoqueCriticoRelatorioDto) {
    const resutl = await this.relatoriosRepository.save({
      nome: 'estoque_critico',
      start: new Date(),
      user: { id: queryParams.user_id },
      status: 'START',
    });

    this.estoqueCriticoXls(resutl, queryParams);

    return { message: 'Solicitação de relatório realizada com sucesso' };
  }

  async estoqueEntrada(queryParams: EstoqueEntradaRelatorioDto) {
    const resutl = await this.relatoriosRepository.save({
      nome: 'estoque_entrada',
      start: new Date(),
      user: { id: queryParams.user_id },
      status: 'START',
    });
    this.estoqueEntradaXls(resutl, queryParams);
    return { message: 'Solicitação de relatório realizada com sucesso' };
  }

  async valorBrutoMensal(queryParams: EstoqueValorBrutoRelatorioDto) {
    const resutl = await this.relatoriosRepository.save({
      nome: 'valor_bruto_mensal',
      start: new Date(),
      user: { id: queryParams.user_id },
      status: 'START',
    });

    this.valorBrutoMensalXls(resutl, queryParams);

    return { message: 'Solicitação de relatório realizada com sucesso' };
  }

  private async proximoVencimentoXls(data: Relatorios) {
    setTimeout(async () => {
      const headers: Array<Partial<ExcelJS.Column>> = [
        { header: 'ID', key: 'id', width: 10 },
        { header: 'Data de vecimento', key: 'data_vencimento', width: 30 },
        { header: 'Quantidade', key: 'quantidade', width: 10 },
        { header: 'Lote', key: 'sku', width: 10 },
        { header: 'seção', key: 'secao', width: 10 },
        { header: 'corredor', key: 'corredo', width: 10 },
        { header: 'Prateleira', key: 'prateleira', width: 10 },
      ];

      const body = await this.relatoriosRepository.relatorioProximoVencimento();
      const pacth =
        dirname(dirname(dirname(__dirname))) +
        `/relatorios/${new Date().getTime()}_proximo_vencimento.xlsx`;
      this.ExcelService.generateReport('teste', headers, body, pacth)
        .then(async (res) => {
          await this.relatoriosRepository.update(data.id, {
            path: pacth,
            status: 'FINISHED',
            end: new Date(),
          });
        })
        .catch(async (error) => {
          await this.relatoriosRepository.update(data.id, {
            status: 'FAIL',
            log: JSON.stringify(error),
            end: new Date(),
          });
        });
    }, 9000);
    console.log('Relatorio enviado para o processamento');
  }

  private async estoqueCriticoXls(
    data: Relatorios,
    queryParams: EstoqueCriticoRelatorioDto,
  ) {
    setTimeout(async () => {
      const headers: Array<Partial<ExcelJS.Column>> = [
        { header: 'ID', key: 'id', width: 10 },
        { header: 'Produto', key: 'nome', width: 30 },
        { header: 'Quantidade', key: 'quantidade', width: 10 },
        { header: 'Lote', key: 'sku', width: 10 },
        { header: 'seção', key: 'secao', width: 10 },
        { header: 'corredor', key: 'corredo', width: 10 },
        { header: 'Prateleira', key: 'prateleira', width: 10 },
      ];

      const body = await this.relatoriosRepository.estoqueCritico(
        queryParams.sku,
      );
      const pacth =
        dirname(dirname(dirname(__dirname))) +
        `/relatorios/${new Date().getTime()}_estoque_critico.xlsx`;
      this.ExcelService.generateReport('teste', headers, body, pacth)
        .then(async (res) => {
          await this.relatoriosRepository.update(data.id, {
            path: pacth,
            status: 'FINISHED',
            end: new Date(),
          });
        })
        .catch(async (error) => {
          await this.relatoriosRepository.update(data.id, {
            status: 'FAIL',
            log: JSON.stringify(error),
            end: new Date(),
          });
        });
    }, 9000);
    console.log('Relatorio enviado para o processamento');
  }

  private async estoqueEntradaXls(
    data: Relatorios,
    queryParams: EstoqueEntradaRelatorioDto,
  ) {
    setTimeout(async () => {
      const headers: Array<Partial<ExcelJS.Column>> = [
        { header: 'ID', key: 'id', width: 10 },
        { header: 'Produto', key: 'nome', width: 30 },
        { header: 'Quantidade', key: 'quantidade', width: 10 },
        { header: 'Lote', key: 'sku', width: 10 },
        { header: 'Seção', key: 'secao', width: 10 },
        { header: 'Corredor', key: 'corredo', width: 10 },
        { header: 'Prateleira', key: 'prateleira', width: 10 },
        { header: 'Data da entrada', key: 'created_at', width: 10 },
      ];

      const body = await this.relatoriosRepository.estoqueEntrada(queryParams);
      const pacth =
        dirname(dirname(dirname(__dirname))) +
        `/relatorios/${new Date().getTime()}_entrada_estoque.xlsx`;
      this.ExcelService.generateReport('teste', headers, body, pacth)
        .then(async (res) => {
          await this.relatoriosRepository.update(data.id, {
            path: pacth,
            status: 'FINISHED',
            end: new Date(),
          });
        })
        .catch(async (error) => {
          await this.relatoriosRepository.update(data.id, {
            status: 'FAIL',
            log: JSON.stringify(error),
            end: new Date(),
          });
        });
    }, 9000);
    console.log('Relatorio enviado para o processamento');
  }

  private async valorBrutoMensalXls(
    data: Relatorios,
    queryParams: EstoqueValorBrutoRelatorioDto,
  ) {
    setTimeout(async () => {
      const headers: Array<Partial<ExcelJS.Column>> = [
        { header: 'ID', key: 'id', width: 10 },
        { header: 'Ano da venda', key: 'ano_da_venda', width: 30 },
        { header: 'Mês da Venda', key: 'mes_da_venda', width: 10 },
        { header: 'Total em vendas', key: 'total_venda', width: 10 },
        { header: 'Lucro Obtido', key: 'spread_bruto', width: 10 },
      ];

      const body =
        await this.relatoriosRepository.valorBrutoMensal(queryParams);
      const pacth =
        dirname(dirname(dirname(__dirname))) +
        `/relatorios/${new Date().getTime()}_valor_buto_mensal.xlsx`;
      this.ExcelService.generateReport('teste', headers, body, pacth)
        .then(async (res) => {
          await this.relatoriosRepository.update(data.id, {
            path: pacth,
            status: 'FINISHED',
            end: new Date(),
          });
        })
        .catch(async (error) => {
          await this.relatoriosRepository.update(data.id, {
            status: 'FAIL',
            log: JSON.stringify(error),
            end: new Date(),
          });
        });
    }, 300);
    console.log('Relatorio enviado para o processamento');
  }
}
