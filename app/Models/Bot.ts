import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm';

import { DateTime } from 'luxon';
import User from './User';

export default class Bot extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public user_id: number;

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>;

  @column()
  public name: string;

  @column()
  public description: string;

  @column()
  public status: string;

  @column()
  public wastate: string;

  @column()
  public session: object;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;
}
