import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import * as Bull from 'bull';

@Injectable()
export class RelatorioQueueService {
  constructor(
    @InjectQueue('relatorio-queue') private relatorioQueue: Bull.Queue,
  ) {}

  async SendProximoVencimento(data: any) {
    return await this.relatorioQueue.add('proximo_vencimento', data);
  }
}
