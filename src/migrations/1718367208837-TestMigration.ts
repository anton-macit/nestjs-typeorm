import { MigrationInterface, QueryRunner } from 'typeorm';

export class TestMigration1718367208837 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('create table if not exists testMigration();');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('drop table if exists testMigration;');
  }
}
