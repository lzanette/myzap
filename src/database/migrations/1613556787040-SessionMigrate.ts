import {MigrationInterface, QueryRunner} from "typeorm";

export class SessionMigrate1613556787040 implements MigrationInterface {
    name = 'SessionMigrate1613556787040'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `session` ADD `browserSessionToken` json NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `session` DROP COLUMN `browserSessionToken`");
    }

}
