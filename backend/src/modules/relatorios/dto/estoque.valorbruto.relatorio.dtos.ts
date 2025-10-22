import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class EstoqueValorBrutoRelatorioDto {
  @ApiProperty({
    description: 'Data de inicio',
    required: false,
  })
  @IsNotEmpty({ message: 'A data de inicio do relatório é obrigatorio' })
  @IsOptional()
  ano: string;

  @ApiProperty({
    description: 'Data final',
    required: false,
  })
  @IsNotEmpty({ message: 'A data final do relatório é obrigatorio' })
  @IsOptional()
  mes: string;

  user_id: number;
}
