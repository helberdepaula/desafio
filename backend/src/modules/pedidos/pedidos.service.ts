import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
import { PedidoSearchDto } from './dto/pedido.search.dto';
import { PedidosRepository } from './repositories/pedidos.repository';
import { ProdutosRepository } from '../produtos/repositories/produtos.repository';
import { EstoquesRepository } from '../estoques/repositories/estoques.repository';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class PedidosService {
  constructor(
    private readonly pedidosRepository: PedidosRepository,
    private readonly produtoRepository: ProdutosRepository,
    private readonly estoqueRepository: EstoquesRepository,
  ) {}

  async findAll(queryPrams: PedidoSearchDto) {
    const limit = Number(process.env.LIMIT_PAGINATION) || 0;
    const [result, total] =
      await this.pedidosRepository.findAllPagination(queryPrams);
    return {
      data: result,
      meta: {
        page: 1,
        limit: Number(queryPrams.limit) || limit,
        total: total,
      },
    };
  }

  @Transactional()
  async create(createPedidoDto: CreatePedidoDto) {
    await Promise.all(
      createPedidoDto.itens.map(async (item) => {
        const [produto, estoque] = await Promise.all([
          this.produtoRepository.findByPK(item.produto_id),
          this.estoqueRepository.findByPK(item.estoque_id),
        ]);

        if (!produto) {
          throw new NotFoundException([
            ' O produto informado não existe ou foi removido',
          ]);
        }

        if (!estoque) {
          throw new NotFoundException([
            ' O Estoque informado não existe ou foi removido',
          ]);
        }

        if (produto.id !== estoque.produto.id) {
          throw new NotFoundException([
            'O Produto não pertence ao estoque informado',
          ]);
        }
        if (item.quantidade > estoque.quantidade) {
          throw new ConflictException([
            'Estoque insuficiente para realizar a venda',
          ]);
        }

        await this.estoqueRepository.registrarBaixa(
          item.estoque_id,
          item.quantidade,
        );
      }),
    );

    return { message: ' Ordem Criada com sucesso' };
  }

  findOne(id: number) {
    return `This action returns a #${id} pedido`;
  }

  update(id: number, updatePedidoDto: UpdatePedidoDto) {
    return `This action updates a #${id} pedido`;
  }

  remove(id: number) {
    return `This action removes a #${id} pedido`;
  }
}
