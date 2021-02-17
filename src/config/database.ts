import * as dotenv from "dotenv";

import { SequelizeOptions } from 'sequelize-typescript'

dotenv.config();

export const sequelizeOptions : SequelizeOptions = {
  dialect: 'mysql',
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: 3306,
  define: {
    timestamps: true,
    underscored: true
  },
}

export default { sequelizeOptions };