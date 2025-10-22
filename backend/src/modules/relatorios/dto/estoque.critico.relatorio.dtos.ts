import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class EstoqueCriticoRelatorioDto {
  @ApiProperty({
    description: 'Lote',
    required: false,
  })
  @IsNotEmpty({ message: 'O lote do relatório é obrigatorio' })
  @IsOptional()
  sku: string;

  user_id: number;
}
