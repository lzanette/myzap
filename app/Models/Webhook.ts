import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm';

import Bot from './Bot';
import { DateTime } from 'luxon';

export const enum WebhookStatus {
  QUEUE = 1,
  SEND = 2,
  ERROR = 3,
}

export default class Webhook extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public bot_id: number;

  @column()
  public number: number;

  @column()
  public content: string;

  @column()
  public status: WebhookStatus;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @belongsTo(() => Bot)
  public bot: BelongsTo<typeof Bot>;
}
