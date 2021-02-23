import Bot from 'App/Models/Bot';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { WebhookStatus } from 'App/Models/Webhook';

export default class WebhooksController {
  public async store({ request, response }: HttpContextContract) {
    const { token, number, content } = request.all();

    const bot = await Bot.findByOrFail('token', token);

    const webhook = await bot.related('webhooks').create({
      number,
      content,
      status: WebhookStatus.QUEUE,
    });

    return response.json(webhook);
  }
}
