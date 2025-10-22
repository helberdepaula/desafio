import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ContatoFornecedor } from '../entities/contato-fornecedor.entity';
import { Contatos } from '@app/modules/contatos/entities/contato.entity';
import { createFornecedorContato } from '../dto/create-fornecedor-contato.dto';

@Injectable()
export class ContatoFornecedorRepository extends Repository<ContatoFornecedor> {
  constructor(
    @InjectRepository(ContatoFornecedor)
    private readonly repository: Repository<ContatoFornecedor>,
  ) {
    super(ContatoFornecedor, repository.manager, repository.queryRunner);
  }

    async findByPK(id: number): Promise<ContatoFornecedor| null> {
      return this.repository.findOne({
        relations: ['contato'],
        where: { id },
      });
    }


  async contatoExist(fornecedor_id, data: createFornecedorContato) {
   return this.repository.findOne({
      where: {
        fornecedor_id,
        contato: {
          ddd: String(data.ddd).replace(/\D/g,''),
          numero: String(data.numero).replace(/\D/g,''),
          codigo: String(data.codigo).replace(/\D/g,''),
        },
      },
      relations: ['contato'],
    });
  }

  async findAll(fornecedor_id: number) {
    return this.repository.find({
      where: { fornecedor_id },
      relations: ['contato'],
    });
  }
}
