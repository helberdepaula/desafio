import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateEstoqueDto } from './dto/create-estoque.dto';
import { EstoquesRepository } from './repositories/estoques.repository';
import { SearchEstoqueDto } from './dto/searchEstoque.dtos';
import { ProdutosRepository } from '../produtos/repositories/produtos.repository';
import { FornecedoresRepository } from '../fornecedores/repositories/fornecedores.repository';
import { isAfter } from 'date-fns';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class EstoquesService {
  constructor(
    private readonly estoqueRepository: EstoquesRepository,
    private readonly produtosRepository: ProdutosRepository,
    private readonly fornecedoresRepository: FornecedoresRepository,
  ) {}

  async findAll(queryParams: SearchEstoqueDto) {
    const limit = Number(process.env.LIMIT_PAGINATION) || 0;
    const [result, total] =
      await this.estoqueRepository.findAllPagination(queryParams);

    return {
      data: result,
      meta: {
        page: 1,
        limit: Number(queryParams.limit) || limit,
        total: total,
      },
    };
  }

  findOne(id: number) {
    return this.estoqueRepository.findByPK(id);
  }

  @Transactional()
  async create(createEstoqueDto: CreateEstoqueDto) {
    const [produto, fornecedor] = await Promise.all([
      this.produtosRepository.findByPK(createEstoqueDto.produto_id),
      this.fornecedoresRepository.findByPK(createEstoqueDto.fornecedor_id),
    ]);

    if (!produto) {
      throw new NotFoundException(['O produto não existe ou foi removido']);
    }

    if (!fornecedor) {
      throw new NotFoundException(['O fornecedor não existe ou foi removido']);
    }

    // grantindo que a a string será somente numero e depois formantando
    const dataFormatting = createEstoqueDto.data_vencimento
      .replace(/\D/g, '')
      .replace(/^(\d{2})(\d{2})(\d{4})$/, '$3-$2-$1');

    const dataFutura = new Date(dataFormatting);
    const dataAtual = new Date();

    const _isAfter = isAfter(dataFutura, dataAtual);
    if (!_isAfter) {
      throw new ConflictException(['O produto está com a validade vencida']);
    }

    if (createEstoqueDto.quantidade < 0) {
      throw new ConflictException([
        'Não é permitida entrada no estoque com quantidade negativa',
      ]);
    }

    const skuExist = await this.estoqueRepository.findSKU(createEstoqueDto.sku);
    if (skuExist) {
      throw new ConflictException(['Esté lote já foi cadastrdo no estoque']);
    }

    if (
      Number(createEstoqueDto.preco_venda) <=
      Number(createEstoqueDto.preco_custo)
    ) {
      throw new ConflictException(['O valor da venda tem que ser maior que o valor da compra']);
    }

    const result = await this.estoqueRepository.save({
      corredor: createEstoqueDto.corredor,
      prateleira: createEstoqueDto.prateleira,
      secao: createEstoqueDto.secao,
      quantidade: Number(createEstoqueDto.quantidade),
      sku: createEstoqueDto.sku,
      preco_custo: createEstoqueDto.preco_custo,
      preco_venda: createEstoqueDto.preco_venda,
      data_vencimento: new Date(dataFormatting).toISOString(),
      user: {
        id: createEstoqueDto.user_id,
      },
      produto: produto,
      fornecedor: fornecedor,
    });

    return {
      message: 'Entrada no estoque realizada com sucesso',
      data: result,
    };
  }
}
