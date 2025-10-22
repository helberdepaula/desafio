import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import type { Queue } from 'bull';
import { Relatorios } from './entities/Relatorios.entity';
import { RelatoriosRepository } from './repositories/relatorios.repository';
import { RelatorioSearchDto } from './dto/relatorio.search.dtos';
import { EstoqueValorBrutoRelatorioDto } from './dto/estoque.valorbruto.relatorio.dtos';
import { EstoqueEntradaRelatorioDto } from './dto/estoque.entrada.relatorio.dtos';
import { EstoqueCriticoRelatorioDto } from './dto/estoque.critico.relatorio.dtos';
import { ExcelService } from '../../common/excel.service';
import * as ExcelJS from 'exceljs';
import path, { dirname } from 'path';

export enum TipoRelatorio {
  ESTOQUE_PROXIMO_VENCIMENTO = 'ESTOQUE_PROXIMO_VENCIMENTO',
  ESTOQUE_CRITICO = 'ESTOQUE_CRITICO',
  VALOR_BRUTO_MENSAL = 'VALOR_BRUTO_MENSAL',
  ESTOQUE_ENTRADA = 'ESTOQUE_ENTRADA',
}

export interface RelatorioJobData {
  relatorioId: number;
  tipo: TipoRelatorio;
  parametros: any;
  usuarioId: number;
}

@Injectable()
export class RelatoriosService {
  private readonly logger = new Logger(RelatoriosService.name);

  constructor(
    private readonly excelService: ExcelService,
    private relatoriosRepository: RelatoriosRepository,
    @InjectQueue('relatorio-queue')
    private relatoriosQueue: Queue,
  ) {}

  async criarRelatorio(tipo: TipoRelatorio, parametros: any, usuarioId: number): Promise<Relatorios> {
    const relatorio = new Relatorios();
    relatorio.nome = `Relatório ${tipo}`;
    relatorio.status = 'SOLICITADO';
    relatorio.start = new Date();
    
    const savedRelatorio = await this.relatoriosRepository.save(relatorio);

    await this.relatoriosQueue.add('processar-relatorio', {
      relatorioId: savedRelatorio.id,
      tipo,
      parametros,
      usuarioId,
    } as RelatorioJobData);

    return savedRelatorio;
  }

  async buscarRelatorio(id: number): Promise<Relatorios | null> {
    return this.relatoriosRepository.findOne({ where: { id } });
  }

  async listarRelatorios(filter: RelatorioSearchDto): Promise<[Relatorios[], number]> {
    return this.relatoriosRepository.findAllPagination(filter);
  }

  async atualizarStatus(id: number, status: string, path?: string, log?: string): Promise<void> {
    const updateData: Partial<Relatorios> = { status };
    if (path) updateData.path = path;
    if (log) updateData.log = log;
    if (status === 'CONCLUIDO' || status === 'ERRO') {
      updateData.end = new Date();
    }
    
    await this.relatoriosRepository.update(id, updateData);
  }

  async processarRelatorioProximoVencimento(): Promise<string> {
    const caminhoArquivo = await this.proximoVencimentoXls();
    return caminhoArquivo;
  }

  async processarEstoqueCritico(sku: string): Promise<string> {
    const caminhoArquivo = await this.estoqueCriticoXls(sku);
    return caminhoArquivo;
  }

  async processarValorBrutoMensal(data: EstoqueValorBrutoRelatorioDto): Promise<string> {
    const caminhoArquivo = await this.valorBrutoMensalXls(data);
    return caminhoArquivo;
  }

  async processarEstoqueEntrada(data: EstoqueEntradaRelatorioDto): Promise<string> {
    const caminhoArquivo = await this.estoqueEntradaXls(data);
    return caminhoArquivo;
  }

  async proximoVencimentoXls(): Promise<string> {
    const headers: Array<Partial<ExcelJS.Column>> = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Data de vencimento', key: 'data_vencimento', width: 30 },
      { header: 'Quantidade', key: 'quantidade', width: 10 },
      { header: 'Lote', key: 'sku', width: 10 },
      { header: 'Seção', key: 'secao', width: 10 },
      { header: 'Corredor', key: 'corredor', width: 10 },
      { header: 'Prateleira', key: 'prateleira', width: 10 },
    ];

    const body = await this.relatoriosRepository.relatorioProximoVencimento();
    const fileName = `${new Date().getTime()}_proximo_vencimento.xlsx`;
    const filePath = dirname(dirname(dirname(__dirname))) + `/relatorios/${fileName}`;
    
    await this.excelService.generateReport('Próximo Vencimento', headers, body, filePath);
    
    this.logger.log(`Relatório próximo vencimento gerado: ${filePath}`);
    return String(fileName);
  }

  async estoqueCriticoXls(sku: string): Promise<string> {
    const headers: Array<Partial<ExcelJS.Column>> = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Produto', key: 'nome', width: 30 },
      { header: 'Quantidade', key: 'quantidade', width: 10 },
      { header: 'Lote', key: 'sku', width: 10 },
      { header: 'Seção', key: 'secao', width: 10 },
      { header: 'Corredor', key: 'corredor', width: 10 },
      { header: 'Prateleira', key: 'prateleira', width: 10 },
    ];

    const body = await this.relatoriosRepository.estoqueCritico(sku);
    const fileName = `${new Date().getTime()}_estoque_critico.xlsx`;
    const filePath = dirname(dirname(dirname(__dirname))) + `/relatorios/${fileName}`;
    
    await this.excelService.generateReport('Estoque Crítico', headers, body, filePath);
    
    this.logger.log(`Relatório estoque crítico gerado: ${filePath}`);
    return String(fileName);
  }

  async estoqueEntradaXls(queryParams: EstoqueEntradaRelatorioDto): Promise<string> {
    const headers: Array<Partial<ExcelJS.Column>> = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Produto', key: 'nome', width: 30 },
      { header: 'Quantidade', key: 'quantidade', width: 10 },
      { header: 'Lote', key: 'sku', width: 10 },
      { header: 'Seção', key: 'secao', width: 10 },
      { header: 'Corredor', key: 'corredor', width: 10 },
      { header: 'Prateleira', key: 'prateleira', width: 10 },
      { header: 'Data da entrada', key: 'created_at', width: 20 },
    ];

    const body = await this.relatoriosRepository.estoqueEntrada(queryParams);
    const fileName = `${new Date().getTime()}_entrada_estoque.xlsx`;
    const filePath = dirname(dirname(dirname(__dirname))) + `/relatorios/${fileName}`;
    
    await this.excelService.generateReport('Entrada de Estoque', headers, body, filePath);
    
    this.logger.log(`Relatório estoque entrada gerado: ${filePath}`);
    return String(fileName);
  }

  async valorBrutoMensalXls(queryParams: EstoqueValorBrutoRelatorioDto): Promise<string> {
    const headers: Array<Partial<ExcelJS.Column>> = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Ano da venda', key: 'ano_da_venda', width: 30 },
      { header: 'Mês da Venda', key: 'mes_da_venda', width: 20 },
      { header: 'Total em vendas', key: 'total_venda', width: 20 },
      { header: 'Lucro Obtido', key: 'spread_bruto', width: 20 },
    ];

    const body = await this.relatoriosRepository.valorBrutoMensal(queryParams);
    const fileName = `${new Date().getTime()}_valor_bruto_mensal.xlsx`;
    const filePath = dirname(dirname(dirname(__dirname))) + `/relatorios/${fileName}`;
    
    await this.excelService.generateReport('Valor Bruto Mensal', headers, body, filePath);
    
    this.logger.log(`Relatório valor bruto mensal gerado: ${filePath}`);
    return String(fileName);
  }

}