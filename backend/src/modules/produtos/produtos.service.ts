import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';
import { ProdutoSearchDto } from './dto/produtoSearch.dtos';
import { ProdutosRepository } from './repositories/produtos.repository';
import { MarcasRepository } from '../marcas/repositories/marcas.repository';
import { UnidadesRepository } from '../unidades/repositories/unidades.repository';
import { CategoriasRepository } from '../categorias/repositories/categorias.repository';
import { updateCategoria } from '../categorias/swagger/categorias.swagger';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class ProdutosService {
  constructor(
    private readonly produtosRepository: ProdutosRepository,
    private readonly marcaRepository: MarcasRepository,
    private readonly unidadeRepository: UnidadesRepository,
    private readonly categoriaRepository: CategoriasRepository,
  ) {}

  findList(data: ProdutoSearchDto) {
    return this.produtosRepository.findAll(data);
  }

  async findAll(queryParams: ProdutoSearchDto) {
    const limit = Number(process.env.LIMIT_PAGINATION) || 0;
    const [result, total] =
      await this.produtosRepository.findAllPagination(queryParams);

    return {
      data: result,
      meta: {
        page: 1,
        limit: Number(queryParams.limit) || limit,
        total: total,
      },
    };
  }

  async findOne(id: number) {
    const result = await this.produtosRepository.findByPK(Number(id));
    if (!result) {
      throw new NotFoundException([
        'Produto não encontrado ou foi removido da base de dados',
      ]);
    }

    return result;
  }
  
  @Transactional()
  async create(createProdutoDto: CreateProdutoDto) {
    const [marca, categoria, unidade, codigo] = await Promise.all([
      this.marcaRepository.findByPK(createProdutoDto.marca_id),
      this.categoriaRepository.findByPK(createProdutoDto.categoria_id),
      this.unidadeRepository.findByPK(createProdutoDto.unidade_id),
      this.produtosRepository.findCodigo(createProdutoDto.codigo),
    ]);

    if (!marca) {
      throw new NotFoundException([
        'Marca informada não existe ou fui removida',
      ]);
    }

    if (codigo) {
      throw new ConflictException([
        'Já tem um produto com esse codigo cadastrado',
      ]);
    }

    if (!categoria) {
      throw new NotFoundException([
        'Categoria informada não existe ou fui removida',
      ]);
    }

    if (!unidade) {
      throw new NotFoundException([
        'Unidade informada não existe ou fui removida',
      ]);
    }

    const resust = await this.produtosRepository.save({
      ...createProdutoDto,
      ...{
        user: { id: createProdutoDto.user_id },
        marca,
        categoria,
        unidade,
      },
    });

    return {
      message: 'Produto criado com sucesso.',
      data: resust,
    };
  }

  @Transactional()
  async update(id: number, updateProdutoDto: UpdateProdutoDto) {
    const [marca, categoria, unidade, codigo, produto] = await Promise.all([
      this.marcaRepository.findByPK(updateProdutoDto.marca_id || 0),
      this.categoriaRepository.findByPK(updateProdutoDto.categoria_id || 0),
      this.unidadeRepository.findByPK(updateProdutoDto.unidade_id || 0),
      this.produtosRepository.findCodigoIsNotId(
        id,
        String(updateProdutoDto.codigo),
      ),
      this.produtosRepository.findByPK(id),
    ]);

    if (!produto) {
      throw new NotFoundException([
        'O produto informado não existe ou foi removido',
      ]);
    }

    if (!marca) {
      throw new NotFoundException([
        'Marca informada não existe ou fui removida',
      ]);
    }

    if (codigo) {
      throw new ConflictException([
        'Já tem um produto com esse codigo cadastrado',
      ]);
    }

    if (!categoria) {
      throw new NotFoundException([
        'Categoria informada não existe ou fui removida',
      ]);
    }

    if (!unidade) {
      throw new NotFoundException([
        'Unidade informada não existe ou fui removida',
      ]);
    }
    const result = await this.produtosRepository.update(id, {
      ...{ nome: updateProdutoDto.nome },
      ...{
        marca,
        categoria,
        unidade,
      },
    });
    return { message: 'Produto Atualizado com sucesso' };
  }

  remove(id: number) {
    return `This action removes a #${id} produto`;
  }
}
