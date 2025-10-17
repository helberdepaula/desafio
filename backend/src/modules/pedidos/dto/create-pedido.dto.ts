import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  ValidateNested,
} from 'class-validator';

export class Itens {
  @ApiProperty({
    description: 'Código do Produto',
    type: 'number',
  })
  @IsNotEmpty({ message: 'O campo produto é obrigatório.' })
  @IsNumber({}, { message: 'O codigo do produto dever ser um valor numérico' })
  produto_id: number;

  @ApiProperty({
    description: 'Código do Produto',
    type: 'number',
  })
  @IsNumber({}, { message: 'O estoque dever ser um valor numérico' })
  estoque_id: number;

  @ApiProperty({
    description: 'A quantidade do Produto',
    type: 'number',
  })
  @IsNumber({}, { message: 'A quantidade dever ser um valor numérico' })
  quantidade: number;

  preco: string;
}

export class CreatePedidoDto {
  @ApiProperty({
    description: 'Itens do pedido',
    type: () => Itens,
    isArray: true,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(100)
  @Type(() => Itens)
  itens: Itens[];

  user_id: number;
  data_venda: string;
}
