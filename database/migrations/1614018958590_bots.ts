import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class Bots extends BaseSchema {
  protected tableName = 'bots';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');
      table.integer('user_id').unsigned();
      table.string('name');
      table.text('description').nullable();
      table.string('status').nullable();
      table.string('wastate').nullable();
      table.json('session').nullable();
      table.timestamps(true, true);
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
