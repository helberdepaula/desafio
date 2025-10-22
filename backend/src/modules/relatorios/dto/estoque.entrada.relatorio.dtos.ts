import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class EstoqueEntradaRelatorioDto {
  @ApiProperty({
    description: 'Data de inicio',
    required: false,
  })
  @IsNotEmpty({ message: 'A data de inicio do relatório é obrigatorio' })
  @IsOptional()
  data_ini: string;

  @ApiProperty({
    description: 'Data final',
    required: false,
  })
  @IsNotEmpty({ message: 'A data final do relatório é obrigatorio' })
  @IsOptional()
  data_end: string;

  user_id: number;
}
