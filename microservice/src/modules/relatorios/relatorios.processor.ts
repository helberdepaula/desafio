import { Process, Processor } from '@nestjs/bull';
import type { Job } from 'bull';
import { RelatoriosService, RelatorioJobData, TipoRelatorio } from './relatorios.service';

@Processor('relatorio-queue')
export class RelatoriosProcessor {
  constructor(private relatoriosService: RelatoriosService) {}

  @Process('processar-relatorio')
  async processarRelatorio(job: Job<RelatorioJobData>) {
    const { relatorioId, tipo, parametros } = job.data;

    try {
      console.log(`Iniciando processamento do relatório ID: ${relatorioId}, Tipo: ${tipo}`);
      await this.relatoriosService.atualizarStatus(relatorioId, 'PROCESSANDO');

      let resultado: string;

      switch (tipo) {
        case TipoRelatorio.ESTOQUE_PROXIMO_VENCIMENTO:
          resultado = await this.relatoriosService.processarRelatorioProximoVencimento();
          break;
        case TipoRelatorio.ESTOQUE_CRITICO:
          resultado = await this.relatoriosService.processarEstoqueCritico(parametros.sku);
          break;
        case TipoRelatorio.VALOR_BRUTO_MENSAL:
          resultado = await this.relatoriosService.processarValorBrutoMensal(parametros);
          break;
        case TipoRelatorio.ESTOQUE_ENTRADA:
          resultado = await this.relatoriosService.processarEstoqueEntrada(parametros);
          break;
        default:
          throw new Error(`Tipo de relatório não suportado: ${tipo}`);
      }
      
      await this.relatoriosService.atualizarStatus(
        relatorioId,
        'CONCLUIDO',
        resultado,
        `Relatório processado com sucesso. registros encontrados.`
      );

      console.log(`Relatório ${tipo} processado com sucesso. Arquivo: ${resultado}`);
    } catch (error) {
      console.error(`Erro ao processar relatório ID: ${relatorioId}`, error);
      await this.relatoriosService.atualizarStatus(
        relatorioId,
        'ERRO',
        undefined,
        error.message
      );
      throw error;
    }
  }
}