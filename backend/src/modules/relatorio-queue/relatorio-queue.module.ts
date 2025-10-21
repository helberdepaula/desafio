import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { RelatorioQueueService } from './relatorio-queue.service';
import { relatorioQueueConsumer } from './relatorio-queue-consumer';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'relatorio-queue',
    }),
  ],
  providers: [RelatorioQueueService,relatorioQueueConsumer],
  exports: [RelatorioQueueService],
})
export class RelatorioQueueModule {}
