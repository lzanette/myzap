import Bot from 'App/Models/Bot';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import SocketIO from '@ioc:Socket.IO';

export default class BotsController {
  public async index({ response, auth }: HttpContextContract) {
    SocketIO.io().emit('BOT#11', 'test');
    const bots = await Bot.query().where('user_id', auth.user?.id || 0);

    response.json(bots);
  }

  public async start({ request }: HttpContextContract) {}

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
