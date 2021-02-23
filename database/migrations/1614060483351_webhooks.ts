import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class Webhooks extends BaseSchema {
  protected tableName = 'webhooks';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id');
      table.integer('bot_id').unsigned();
      table.bigInteger('number').unsigned();
      table.text('content');
      table.integer('status');
      table.timestamps(true, true);
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
