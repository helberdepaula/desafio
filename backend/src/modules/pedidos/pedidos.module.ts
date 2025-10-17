import { Module } from '@nestjs/common';
import { PedidosService } from './pedidos.service';
import { PedidosController } from './pedidos.controller';
import { PedidosRepository } from './repositories/pedidos.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pedidos } from './entities/pedido.entity';
import { ProdutosRepository } from '../produtos/repositories/produtos.repository';
import { EstoquesRepository } from '../estoques/repositories/estoques.repository';
import { Estoques } from '../estoques/entities/estoque.entity';
import { Produtos } from '../produtos/entities/produto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Pedidos, Estoques, Produtos])],
  controllers: [PedidosController],
  providers: [
    PedidosService,
    PedidosRepository,
    ProdutosRepository,
    EstoquesRepository,
  ],
})
export class PedidosModule {}
