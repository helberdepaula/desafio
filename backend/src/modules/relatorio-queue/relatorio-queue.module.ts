import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { RelatorioQueueService } from './relatorio-queue.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'relatorio-queue',
    }),
  ],
  providers: [RelatorioQueueService],
  exports: [RelatorioQueueService],
})
export class RelatorioQueueModule {}
