import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateRelatorioDto {
  @ApiProperty({
    description: 'Nome do realtório',
    required: true,
  })
  @IsNotEmpty({ message: 'O campo nome é obrigatório.' })
  @IsString({ message: 'O nome deve ser uma string' })
  nome: string;

  @ApiProperty({
    description: 'Lote do realtório',
    required: true,
  })
  @IsOptional()
  sku: string;

  @ApiProperty({
    description: 'Data de início',
    required: true,
  })
  @IsOptional()
  data_ini: string;

  @ApiProperty({
    description: 'Data final',
    required: true,
  })
  @IsOptional()
  data_end: string;

  user_id: number;
}
