import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RelatoriosService } from './relatorios.service';
import { RelatoriosProcessor } from './relatorios.processor';
import { RelatoriosController } from './relatorios.controller';
import { Relatorios } from './entities/Relatorios.entity';
import { RelatoriosRepository } from './repositories/relatorios.repository';
import { Users } from '../users/entities/users.entity';
import { ExcelService } from '../../common/excel.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Relatorios, Users]),
    BullModule.registerQueue({
      name: 'relatorio-queue',
    }),
  ],
  controllers: [RelatoriosController],
  providers: [RelatoriosService, RelatoriosProcessor, RelatoriosRepository, ExcelService],
  exports: [RelatoriosService, RelatoriosRepository],
})
export class RelatoriosModule {}