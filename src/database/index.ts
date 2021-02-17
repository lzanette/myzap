import { Sequelize } from 'sequelize-typescript';
import { sequelizeOptions } from '@/config/database'

class Database {
  public connection: Sequelize;

  constructor() {
    this.init();
  }

  init(): void {
    this.connection = new Sequelize(sequelizeOptions);
  }
}

const database: Database = new Database;

export default database;