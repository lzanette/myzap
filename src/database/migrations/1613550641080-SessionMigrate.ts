import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class SessionMigrate1613550641080 implements MigrationInterface {
    name = 'SessionMigrate1613550641080'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `session` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(255) NOT NULL, `state` enum ('STARTING', 'CLOSED', 'CONFLICT', 'UNPAIRED', 'UNLAUNCHED', 'QRCODE', 'CONNECTED') NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`)) ENGINE=InnoDB");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP TABLE `session`");
    }

}
