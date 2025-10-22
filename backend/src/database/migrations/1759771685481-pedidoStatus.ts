import { MigrationInterface, QueryRunner } from 'typeorm';

export class PedidoStatus1759771685481 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
      DROP TYPE IF EXISTS TypeStatusPedido;
      CREATE TYPE  TypeStatusPedido AS ENUM ('ACTIVE', 'CANCELED')`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS TypeStatusPedido CASCADE;');
  }
}
