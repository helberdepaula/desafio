import { Module } from '@nestjs/common';
import { RelatoriosService } from './relatorios.service';
import { RelatoriosController } from './relatorios.controller';
import { RelatoriosRepository } from './repositories/relatorios.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Relatorios } from './entities/Relatorios.entity';
import { ExcelService } from '../common/excel.service';
import { RelatorioQueueModule } from '../relatorio-queue/relatorio-queue.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Relatorios]),
    RelatorioQueueModule,
  ],
  providers: [
    RelatoriosService,
    RelatoriosRepository,
    ExcelService,
  ],
  controllers: [RelatoriosController],
  exports: [RelatoriosRepository],
})
export class RelatoriosModule {}
