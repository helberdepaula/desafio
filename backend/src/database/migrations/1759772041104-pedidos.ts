import { MigrationInterface, QueryRunner } from 'typeorm';

export class Pedidos1759772041104 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS public.pedidos
            (
                id SERIAL NOT NULL,
                user_id INTEGER NOT NULL,
                valor_total numeric  NOT NULL CHECK (valor_total >= 0) ,
                data_venda DATE,
                status TypeStatusPedido NOT NULL DEFAULT 'ACTIVE',
                created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT pedido_pkey PRIMARY KEY (id),
                CONSTRAINT pedido_users FOREIGN KEY (user_id)
                    REFERENCES public.users (id) MATCH SIMPLE
                    ON UPDATE NO ACTION
                    ON DELETE NO ACTION
                    NOT VALID
            )
            TABLESPACE pg_default;
            ALTER TABLE IF EXISTS public.pedidos
                OWNER to postgres;
                        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS pedidos CASCADE;');
  }
}
