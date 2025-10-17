import { Not, Raw, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Produtos } from '../entities/produto.entity';
import { ProdutoSearchDto } from '../dto/produtoSearch.dtos';

@Injectable()
export class ProdutosRepository extends Repository<Produtos> {
  constructor(
    @InjectRepository(Produtos)
    private readonly repository: Repository<Produtos>,
  ) {
    super(Produtos, repository.manager, repository.queryRunner);
  }

  async findAll(queryParams: ProdutoSearchDto) {
    return this.repository.find({
      select: { id: true, nome: true },
    });
  }

  async findCodigo(codigo: string) {
    return this.repository.findOne({
      where: {
        codigo: codigo,
      },
    });
  }

  async findCodigoIsNotId(id, codigo: string) {
    return this.repository.findOne({
      where: {
        codigo: codigo,
        id: Not(id),
      },
    });
  }

  async findByPK(id: number): Promise<Produtos | null> {
    return this.repository.findOne({
      relations: ['marca', 'unidade', 'categoria'],
      where: {
        id,
        // status: 'ACTIVE'
      },
    });
  }

  async findAllPagination(
    filter: ProdutoSearchDto,
  ): Promise<[Produtos[], number]> {
    const limit = Number(process.env.LIMIT_PAGINATION) || 0;

    const whereParam: any = {
      /*status: 'ACTIVE'*/
    };

    if (filter.nome) {
      whereParam.nome = Raw((alias) => `${alias} ILIKE '%${filter.nome}%'`);
    }

    const offset =
      (Number(filter?.page) - 1 || 1 - 1) * Number(filter.limit || limit);
    return await this.repository.findAndCount({
      where: whereParam,
      take: filter.limit || limit,
      skip: offset ?? 0,
    });
  }
}
