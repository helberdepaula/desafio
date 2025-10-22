import { Raw, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Relatorios } from '../entities/Relatorios.entity';
import { RelatorioSearchDto } from '../dto/relatorio.search.dtos';
import { EstoqueValorBrutoRelatorioDto } from '../dto/estoque.valorbruto.relatorio.dtos';
import { EstoqueEntradaRelatorioDto } from '../dto/estoque.entrada.relatorio.dtos';

@Injectable()
export class RelatoriosRepository extends Repository<Relatorios> {
  constructor(
    @InjectRepository(Relatorios)
    private readonly repository: Repository<Relatorios>,
  ) {
    super(Relatorios, repository.manager, repository.queryRunner);
  }

  async findAllPagination(
    filter: RelatorioSearchDto,
  ): Promise<[Relatorios[], number]> {
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

  relatorioProximoVencimento() {
    return this.repository.query(`
      SELECT estoques.id,
            estoques.data_vencimento,
            estoques.data_vencimento :: DATE - ( Now() ) :: DATE AS dias,
            estoques.quantidade,
            estoques.prateleira,
            estoques.secao,
            estoques.corredor,
            estoques.sku,
            produtos.nome
      FROM   estoques
            inner join produtos
                    ON( estoques.produto_id = produtos.id )
      WHERE  estoques.data_vencimento :: DATE - ( Now() ) :: DATE <= 30
            AND estoques.quantidade > 0 
        `);
  }

  estoqueCritico(sku: string) {
    return this.repository.query(`
     select * from estoques
      inner join produtos on(estoques.produto_id=produtos.id)
      where estoques.sku='${sku}'
        `);
  }

  valorBrutoMensal(data: EstoqueValorBrutoRelatorioDto) {
    return this.repository.query(`
     WITH vendas_calculadas AS (
          SELECT
            pedidos.data_venda,
            estoques.preco_custo AS preco_compra,
            pedido_itens.preco AS preco_venda,
            (pedido_itens.quantidade * pedido_itens.preco) AS total_venda,
            (pedido_itens.quantidade * (pedido_itens.preco - estoques.preco_custo)) AS spread_bruto
          FROM pedidos
          INNER JOIN pedido_itens ON pedidos.id = pedido_itens.pedido_id
          INNER JOIN estoques ON estoques.id = pedido_itens.estoque_id
        )
        SELECT
          EXTRACT(YEAR FROM data_venda) AS ano_da_venda,
          EXTRACT(MONTH FROM data_venda) AS mes_da_venda,
          SUM(total_venda) AS total_de_vendas,
          SUM(spread_bruto) AS total_de_spread
        FROM vendas_calculadas
        where EXTRACT(YEAR FROM data_venda) ='${data.ano}' and EXTRACT(MONTH FROM data_venda) ='${data.mes}'
        GROUP BY
          mes_da_venda,ano_da_venda
        ORDER BY
          mes_da_venda;
        `);
  }

  estoqueEntrada(data: EstoqueEntradaRelatorioDto) {
    return this.repository.query(`
    SELECT    estoques.*,   produtos.nome
    FROM       estoques
    INNER JOIN produtos ON (estoques.produto_id= produtos.id) 
    where 
       estoques.created_at BETWEEN '${data.data_ini} 00:00:00' AND '${data.data_end} 23:59:59';
  `);
  }
}
