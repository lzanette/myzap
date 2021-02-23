import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class Bots extends BaseSchema {
  protected tableName = 'bots';

  public async up() {
    this.schema.table(this.tableName, (table) => {
      table.string('token').nullable().after('session');
    });
  }

  public async down() {
    this.schema.table(this.tableName, (table) => {
      table.dropColumn('token');
    });
  }
}
