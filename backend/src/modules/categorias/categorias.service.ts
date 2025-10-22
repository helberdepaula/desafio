import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CategoriasRepository } from './repositories/categorias.repository';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { CategoriaSearchDto } from './dto/cagoriaSearch.dtos';
import { Transactional } from 'typeorm-transactional';
import { throws } from 'assert';

@Injectable()
export class CategoriasService {
  constructor(private readonly categoriasRepository: CategoriasRepository) {}

  async findJson(queryParams: CategoriaSearchDto) {
    const result = await this.categoriasRepository.findAll(queryParams);
    return result.map((item) => {
      return {
        id: item.id,
        nome: item.nome,
      };
    });
  }

  async find(id: number) {
    const result = await this.categoriasRepository.findByPK(+id);
    if (!result) {
      throw new NotFoundException([
        'A categoria não existe ou foi removido da base de dados',
      ]);
    }
    return {
      id: result.id,
      nome: result.nome,
    };
  }

  async findAll(queryParams: CategoriaSearchDto) {
    const limit = Number(process.env.LIMIT_PAGINATION) || 0;
    const [result, total] =
      await this.categoriasRepository.findAllPagination(queryParams);

    return {
      data: result,
      meta: {
        page: 1,
        limit: Number(queryParams.limit) || limit,
        total: total,
      },
    };
  }

  @Transactional()
  async create(data: CreateCategoriaDto) {
    const exists = await this.categoriasRepository.findByName(data.nome);
    if (exists) {
      throw new ConflictException([
        'Já existe uma categoria com esse nome cadastrado no banco de dados',
      ]);
    }

    const result = await this.categoriasRepository.save(data);
    return { message: 'Categoria criado com sucesso', data: result };
  }

  @Transactional()
  async update(id: number, data: UpdateCategoriaDto) {
    const [exists, categoria] = await Promise.all([
      this.categoriasRepository.findByNameISNOT(id, data.nome || ''),
      this.categoriasRepository.findByPK(id),
    ]);

    if (exists) {
      throw new ConflictException([
        'Já existe uma categoria com esse nome cadastrado no banco de dados',
      ]);
    }

    if (!categoria) {
      throw new NotFoundException([
        'A categoria não foi encontra ou não existe em nossa base de dados',
      ]);
    }

    const result = await this.categoriasRepository.update(id, data);
    return { message: 'Categoria atualizada com sucesso', data: result };
  }

  @Transactional()
  delete(id: number) {
    // return this.categoriasRepository.update({});
  }
}
