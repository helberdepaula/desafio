import { Module } from '@nestjs/common';
import { RelatoriosService } from './relatorios.service';
import { RelatoriosController } from './relatorios.controller';
import { RelatoriosRepository } from './repositories/relatorios.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Relatorios } from './entities/Relatorios.entity';
import { ExcelService } from '../common/excel.service';
import { RelatorioQueueService } from '../relatorio-queue/relatorio-queue.service';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    TypeOrmModule.forFeature([Relatorios]),
    BullModule.registerQueue({
      name: 'relatorio-queue',
    }),
  ],
  providers: [
    RelatoriosService,
    RelatoriosRepository,
    ExcelService,
    RelatorioQueueService,
  ],
  controllers: [RelatoriosController],
  exports: [RelatoriosRepository],
})
export class RelatoriosModule {}
