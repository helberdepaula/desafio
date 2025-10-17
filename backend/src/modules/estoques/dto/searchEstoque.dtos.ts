import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class SearchEstoqueDto {
  @ApiProperty({
    description: 'Nome do categoria',
    required: false,
  })
  @IsString({ message: 'O nome do categoria dever ser uma string' })
  @IsOptional()
  categoria?: string;

  @ApiProperty({
    description: 'Nome do fornecedor',
    required: false,
  })
  @IsString({ message: 'O nome do fornecedor dever ser uma string' })
  @IsOptional()
  fornecedor?: string;

  @ApiProperty({
    description: 'Nome do produto ',
    required: false,
  })
  @IsString({ message: 'O nome do produto dever ser uma string' })
  @IsOptional()
  produto?: string;

  @ApiProperty({
    description: 'Código do produto ',
    required: false,
  })
  @IsString({ message: 'O código do produto dever ser uma string' })
  @IsOptional()
  codigo?: string;

  @ApiProperty({
    description: 'Lote do produto ',
    required: false,
  })
  @IsString({ message: 'O lote do produto dever ser uma string' })
  @IsOptional()
  sku?: string;

  @ApiProperty({
    description: 'Prateleira do produto ',
    required: false,
  })
  @IsString({ message: 'O Prateleira do produto dever ser uma string' })
  @IsOptional()
  prateleira?: string;

  @ApiProperty({
    description: 'Sessão do produto ',
    required: false,
  })
  @IsString({ message: 'O sessão do produto dever ser uma string' })
  @IsOptional()
  sessao?: string;

  @ApiProperty({
    description: 'Limite do retorno de registro',
    example: '10',
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
