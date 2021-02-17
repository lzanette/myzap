import {MigrationInterface, QueryRunner} from "typeorm";

export class SessionMigrate1613554023313 implements MigrationInterface {
    name = 'SessionMigrate1613554023313'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `session` ADD `qrcode` text NOT NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `session` DROP COLUMN `qrcode`");
    }

}
