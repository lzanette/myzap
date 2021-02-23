import Bot from 'App/Models/Bot';
import BotService from 'App/Bot/BotService';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

export default class BotsController {
  public async index({ response, auth }: HttpContextContract) {
    const bots = await Bot.query().where('user_id', auth.user?.id || 0);

    response.json(bots);
  }

  public async start({ params, response }: HttpContextContract) {
    const bot = await Bot.findByOrFail('token', params.id);

    await BotService.init(bot);

    response.json({ ok: true });
  }

  public async store({ request, response, auth }: HttpContextContract) {
    const data = request.only(['name', 'description']);

    const bot = await auth.user?.related('bots').create(data);

    response.json(bot);
  }

  public async show({ params, response }: HttpContextContract) {
    const bot = await Bot.findByOrFail('id', params.id);

    response.json(bot);
  }

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
