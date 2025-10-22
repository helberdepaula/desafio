import { Raw, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Estoques } from '../entities/estoque.entity';
import { SearchEstoqueDto } from '../dto/searchEstoque.dtos';

@Injectable()
export class EstoquesRepository extends Repository<Estoques> {
  constructor(
    @InjectRepository(Estoques)
    private readonly repository: Repository<Estoques>,
  ) {
    super(Estoques, repository.manager, repository.queryRunner);
  }

  async findSKU(sku: string): Promise<Estoques | null> {
    return this.repository.findOne({
      where: { sku },
    });
  }

  async findByPK(id: number): Promise<Estoques | null> {
    return this.repository.findOne({
      relations: ['produto', 'fornecedor', 'produto.categoria'],
      where: { id },
    });
  }

  async findAllPagination(
    filter: SearchEstoqueDto,
  ): Promise<[Estoques[], number]> {
    const limit = Number(process.env.LIMIT_PAGINATION) || 0;
    const whereParam: any = {};

    if (filter.categoria) {
      whereParam.produto = {
        categoria: {
          nome: Raw((alias) => `${alias} ILIKE '%${filter.categoria}%'`),
        },
      };
    }

    if (filter.fornecedor) {
      whereParam.fornecedor = {
        nome: Raw((alias) => `${alias} ILIKE '%${filter.fornecedor}%'`),
      };
    }

    if (filter.produto) {
      whereParam.produto = {
        nome: Raw((alias) => `${alias} ILIKE '%${filter.produto}%'`),
      };
    }

    if (filter.codigo) {
      whereParam.produto = {
        codigo: Raw((alias) => `${alias} ILIKE '%${filter.codigo}%'`),
      };
    }

    if (filter.sku) {
      whereParam.sku = Raw((alias) => `${alias} ILIKE '%${filter.sku}%'`);
    }

    if (filter.prateleira) {
      whereParam.prateleira = Raw(
        (alias) => `${alias} ILIKE '%${filter.prateleira}%'`,
      );
    }

    if (filter.sessao) {
      whereParam.sessao = Raw((alias) => `${alias} ILIKE '%${filter.sessao}%'`);
    }

    const offset =
      (Number(filter?.page) - 1 || 1 - 1) * Number(filter.limit || limit);
    return await this.repository.findAndCount({
      relations: ['produto', 'fornecedor', 'produto.categoria'],
      where: whereParam,
      take: filter.limit || limit,
      skip: offset ?? 0,
    });
  }

  async registrarBaixa(id: number, quantidade: number) {
    const restoque = await this.repository.findOne({
      select: { quantidade: true },
      where: { id },
    });

    if (!restoque) {
      return;
    }

    if (restoque.quantidade < quantidade) {
      return;
    }
    return this.repository.update(id, {
      quantidade:
        restoque.quantidade - quantidade > 0
          ? restoque.quantidade - quantidade
          : 0,
    });
  }
}
