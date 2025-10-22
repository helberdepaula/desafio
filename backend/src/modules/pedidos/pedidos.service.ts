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
import { runOnTransactionRollback, Transactional } from 'typeorm-transactional';
import { Estoques } from '../estoques/entities/estoque.entity';
import { PedidoItensRepository } from './repositories/pedido.itens.repository';

@Injectable()
export class PedidosService {
  constructor(
    private readonly pedidosRepository: PedidosRepository,
    private readonly produtoRepository: ProdutosRepository,
    private readonly estoqueRepository: EstoquesRepository,
    private readonly itensRepository: PedidoItensRepository,
  ) {}

  async findAll(queryPrams: PedidoSearchDto) {
    const limit = Number(process.env.LIMIT_PAGINATION) || 0;
    const [result, total] =
      await this.pedidosRepository.findAllPagination(queryPrams);
    return {
      data: result.map((item) => {
        return {
          id: item.id,
          valor_total: item.valorTotal,
          data_venda: item.dataVenda,
          quantide_itens: Object.values(item.pedidoItens).reduce(
            (t, { quantidade }) => t + quantidade,
            0,
          ),
          status: item.status,
          created_at: item.createdAt,
          updated_at: item.updatedAt,
        };
      }),
      meta: {
        page: 1,
        limit: Number(queryPrams.limit) || limit,
        total: total,
      },
    };
  }

  async findOne(id: number) {
    const result = await this.pedidosRepository.findByPK(id);
    if (!result) {
      throw new NotFoundException(['Ordem não foi encontrada']);
    }
    return {
      id: result.id,
      valor_total: result.valorTotal,
      data_venda: result.dataVenda,
      itens: result.pedidoItens.map((item) => {
        return {
          id: item.id,
          codigo: item.produto.codigo,
          nome: item.produto.nome,
          preco: item.preco,
          quantidade: item.quantidade,
          status: item.status,
        };
      }),
      status: result.status,
      created_at: result.createdAt,
      updated_at: result.updatedAt,
    };
  }

  @Transactional()
  async create(createPedidoDto: CreatePedidoDto) {
    let valorTotal = 0;
    let itens: (Estoques & { quantidade: number })[] = [];

    for (const item of createPedidoDto.itens) {
      const [estoque] = await Promise.all([
        this.estoqueRepository.findByPK(item.estoque_id),
      ]);

      if (!estoque) {
        throw new NotFoundException([
          ' O Estoque informado não existe ou foi removido',
        ]);
      }

      if (item.quantidade > estoque.quantidade) {
        throw new ConflictException([
          `O item ${estoque.produto.nome} não possui estoque suficiente para finalizar a venda.`,
        ]);
      }

      await this.estoqueRepository.registrarBaixa(
        item.estoque_id,
        item.quantidade,
      );
      valorTotal += Number(estoque.preco_custo) * item.quantidade;
      itens.push({
        ...estoque,
        ...{ quantidade: item.quantidade },
      });
    }

    const ordem = await this.pedidosRepository.save({
      user: { id: createPedidoDto.user_id },
      valorTotal: String(valorTotal),
      dataVenda: new Date().toISOString(),
    });

    await this.itensRepository.save(
      itens.map((item) => {
        return {
          pedido: { id: ordem.id },
          produto: { id: item.produto.id },
          estoque: { id: item.id },
          quantidade: item.quantidade,
          preco: item.preco_venda,
        };
      }),
    );
    return { message: ' Ordem Criada com sucesso'};
  }

  @Transactional()
  async remove(id: number) {
    const pedido = await this.pedidosRepository.findByPK(id);
    if (!pedido) {
      throw new NotFoundException(['Ordem não encontrada']);
    }

    for (const item of pedido.pedidoItens) {
      await this.itensRepository.update(item.id, { status: 'CANCELED' });
      await this.estoqueRepository.update(item.estoque.id, {
        quantidade: item.estoque.quantidade + item.quantidade,
      });
    }

    await this.pedidosRepository.update(id, {
      status: 'CANCELED',
    });

    return { message: 'Ordem cancelada com sucesso' };
  }

  @Transactional()
  async removeItem(id: number) {
    const item = await this.itensRepository.findByPK(id);
    if (!item) {
      throw new NotFoundException(['Ordem não encontrada']);
    }

    await this.itensRepository.update(item.id, { status: 'CANCELED' });
    await this.estoqueRepository.update(item.estoque.id, {
      quantidade: item.estoque.quantidade + item.quantidade,
    });

    //recalcula o valor do pedido
    await this.pedidosRepository.update(item.pedido.id, {
      valorTotal: String(
        Number(item.pedido.valorTotal) - item.quantidade * Number(item.preco),
      ),
    });

    return { message: 'Item cancelado com sucesso' };
  }
}
