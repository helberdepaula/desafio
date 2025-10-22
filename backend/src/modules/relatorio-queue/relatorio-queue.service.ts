import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { EstoqueCriticoRelatorioDto } from '../relatorios/dto/estoque.critico.relatorio.dtos';
import { VencimentoRelatorioDto } from '../relatorios/dto/vencimento.relatorio.dtos';
import { EstoqueValorBrutoRelatorioDto } from '../relatorios/dto/estoque.valorbruto.relatorio.dtos';
import { EstoqueEntradaRelatorioDto } from '../relatorios/dto/estoque.entrada.relatorio.dtos';
import * as Bull from 'bull';
import { InjectQueue } from '@nestjs/bull';

export enum TipoRelatorio {
  ESTOQUE_PROXIMO_VENCIMENTO = 'ESTOQUE_PROXIMO_VENCIMENTO',
  ESTOQUE_CRITICO = 'ESTOQUE_CRITICO',
  VALOR_BRUTO_MENSAL = 'VALOR_BRUTO_MENSAL',
  ESTOQUE_ENTRADA = 'ESTOQUE_ENTRADA',
}

export interface CriarRelatorioDto {
  tipo: TipoRelatorio;
  parametros: any;
  usuarioId: number;
  relatorioId: number;
}

@Injectable()
export class RelatorioQueueService {
  constructor(
    @InjectQueue('relatorio-queue') private readonly client: Bull.Queue
  ) { }

  async sendProximoVencimento(data: VencimentoRelatorioDto, relatorioId: number) {
    const payload: CriarRelatorioDto = {
      tipo: TipoRelatorio.ESTOQUE_PROXIMO_VENCIMENTO,
      parametros: data,
      usuarioId: data.user_id,
      relatorioId
    };
    return this.client.add('processar-relatorio', payload);
  }

  async sendEstoqueCritico(data: EstoqueCriticoRelatorioDto, relatorioId: number) {
    const payload: CriarRelatorioDto = {
      tipo: TipoRelatorio.ESTOQUE_CRITICO,
      parametros: data,
      usuarioId: data.user_id,
      relatorioId
    };
    return this.client.add('processar-relatorio', payload);
  }

  async sendValorBrutoMensal(data: EstoqueValorBrutoRelatorioDto, relatorioId: number) {
    const payload: CriarRelatorioDto = {
      tipo: TipoRelatorio.VALOR_BRUTO_MENSAL,
      parametros: data,
      usuarioId: data.user_id,
      relatorioId
    };
    return this.client.add('processar-relatorio', payload);
  }

  async sendEstoqueEntrada(data: EstoqueEntradaRelatorioDto, relatorioId: number) {
    const payload: CriarRelatorioDto = {
      tipo: TipoRelatorio.ESTOQUE_ENTRADA,
      parametros: data,
      usuarioId: data.user_id,
      relatorioId
    };
    return this.client.add('processar-relatorio', payload);
  }

}
