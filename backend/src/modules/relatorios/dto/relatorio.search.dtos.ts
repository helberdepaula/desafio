import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class RelatorioSearchDto {
  @ApiProperty({
    description: 'mome do relatório',
    required: false,
  })
  @IsString({ message: 'O nome do relatório' })
  @IsOptional()
  nome?: string;

  @ApiProperty({
    description: 'limite da paginação',
    required: false,
  })
  @IsOptional()
  limit?: number;

  @ApiProperty({
    description: 'Paginação dos registro ',
    example: '1',
    required: false,
  })
  @IsOptional()
  page?: number;
}
