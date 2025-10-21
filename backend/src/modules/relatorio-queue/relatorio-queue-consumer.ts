import { Processor, Process, OnQueueFailed } from '@nestjs/bull';
import * as bull from 'bull';

@Processor('relatorio-queue')
export class relatorioQueueConsumer {
  @Process('proximo_vencimento')
  async handleRelatoriosGenerate(job: any) {
    const { data } = job;
    console.log(`Processing proximo_vencimento relatorio for user:`, data);
  }

  @Process()
  async handleGenericJob(job: any) {
    console.log(`Processing generic job: ${job.name}`);
  }

  @OnQueueFailed()
  onError(job: bull.Job<any>, error: any) {
    console.log(error,job);
  }
}
