import { Controller, Get, Param, Res, NotFoundException } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RelatoriosService, TipoRelatorio } from './relatorios.service';
import type { RelatorioSearchDto } from './dto/relatorio.search.dtos';
import type { Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';

export interface CriarRelatorioDto {
  tipo: TipoRelatorio;
  parametros: any;
  usuarioId: number;
}

@Controller()
export class RelatoriosController {
  constructor(private relatoriosService: RelatoriosService) {}

  @MessagePattern('criar_relatorio')
  async criarRelatorio(@Payload() data: CriarRelatorioDto) {
    return this.relatoriosService.criarRelatorio(data.tipo, data.parametros, data.usuarioId);
  }

  @MessagePattern('buscar_relatorio')
  async buscarRelatorio(@Payload() id: number) {
    return this.relatoriosService.buscarRelatorio(id);
  }

  @MessagePattern('listar_relatorios')
  async listarRelatorios(@Payload() filter: RelatorioSearchDto) {
    return this.relatoriosService.listarRelatorios(filter);
  }

  @Get('download/:filename')
  async downloadRelatorio(@Param('filename') filename: string, @Res() res: Response) {
    try {
      console.log(`[DOWNLOAD] Requisição para arquivo: ${filename}`);
      
      const safeFilename = path.basename(filename);
      console.log(`[DOWNLOAD] Nome seguro do arquivo: ${safeFilename}`);
      
      if (safeFilename !== filename) {
        console.log(`[DOWNLOAD] Arquivo rejeitado por segurança`);
        throw new NotFoundException('Arquivo não encontrado');
      }

      if (!safeFilename.endsWith('.xlsx')) {
        console.log(`[DOWNLOAD] Arquivo rejeitado - não é XLSX`);
        throw new NotFoundException('Arquivo deve ser do tipo XLSX');
      }

      const filePath = path.join(process.cwd(), 'relatorios', safeFilename);
      console.log(`[DOWNLOAD] Caminho completo: ${filePath}`);
      
      if (!fs.existsSync(filePath)) {
        console.log(`[DOWNLOAD] Arquivo não encontrado no sistema de arquivos`);
        throw new NotFoundException('Arquivo não encontrado');
      }
      
      console.log(`[DOWNLOAD] Arquivo encontrado, iniciando download`)

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="${safeFilename}"`);
      
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);
      
      fileStream.on('error', (error) => {
        console.error('Erro ao ler arquivo:', error);
        res.status(500).send('Erro interno do servidor');
      });
      
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Erro no download:', error);
      throw new NotFoundException('Arquivo não encontrado');
    }
  }

}