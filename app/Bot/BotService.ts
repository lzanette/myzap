import SocketIO from '@ioc:Socket.IO';
import Bot from 'App/Models/Bot';
import Webhook, { WebhookStatus } from 'App/Models/Webhook';
import { Client, ClientSession, Message } from 'whatsapp-web.js';

class BotService {
  private sessions: Array<Client> = [];
  private webhooks: Array<NodeJS.Timeout> = [];

  async init(bot: Bot) {
    console.log(`INSTANCE BOT#${bot.id} ${bot.name}`);

    this.sessions[bot.id] = this.instanceBot(bot);

    this.sessions[bot.id].on('qr', this.generateQr.bind(this, bot));

    this.sessions[bot.id].on('authenticated', this.authenticated.bind(this, bot));

    this.sessions[bot.id].on('auth_failure', this.authFailure.bind(this, bot));

    this.sessions[bot.id].on('ready', this.ready.bind(this, bot));

    this.sessions[bot.id].on('message', this.message.bind(this, bot));

    this.sessions[bot.id].on('disconnected', this.disconnected.bind(this, bot));

    this.sessions[bot.id].on('change_state', this.changeState.bind(this, bot));

    this.sessions[bot.id].initialize();
  }

  private instanceBot(bot: Bot): Client {
    const client = new Client({
      puppeteer: {
        headless: true,
        defaultViewport: null,
      },
      restartOnAuthFail: true,
      takeoverOnConflict: true,
      session: bot.session ? <ClientSession>JSON.parse(bot.session) : undefined,
    });

    return client;
  }

  private async ready(bot: Bot) {
    console.log('READY');
    bot.wastate = 'CONNECTED';
    bot.save();

    this.webhooks[bot.id] = setInterval(this.sendWebhooks.bind(this, bot), 5 * 1000);
  }

  private async sendWebhooks(bot: Bot) {
    const webhooks = await bot.related('webhooks').query().where('status', WebhookStatus.QUEUE);

    webhooks.forEach(async (webhook: Webhook) => {
      try {
        await this.sessions[bot.id].sendMessage(`${webhook.number}@c.us`, webhook.content);
        webhook.status = WebhookStatus.SEND;
      } catch (e) {
        webhook.status = WebhookStatus.ERROR;
      } finally {
        webhook.save();
      }
    });
  }

  private generateQr(bot: Bot, qr: string) {
    SocketIO.io().emit(`BOT#${bot.id}`, qr);
  }

  private authenticated(bot: Bot, browserSessionToken: ClientSession) {
    console.log('AUTHENTICATED');

    bot.session = JSON.stringify(browserSessionToken);
    bot.status = 'AUTHENTICATED';
    bot.save();
  }

  private async authFailure(bot: Bot, message: string) {
    console.log('AUTH_FAILURE', message);

    this.sessions[bot.id]?.destroy();

    bot.status = 'AUTH_FAILURE';
    bot.session = null;
    bot.save();

    this.init(bot);
  }

  private async changeState(bot: Bot, state) {
    bot.wastate = state;
    bot.save();
  }

  private async disconnected(bot: Bot) {
    bot.session = null;
    bot.save();

    clearInterval(this.webhooks[bot.id]);
    this.sessions[bot.id].logout();
  }

  private async message(bot: Bot, message: Message) {
    console.log('MESSAGE RECEIVED', message);
  }
}

export default new BotService();
