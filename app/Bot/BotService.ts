import SocketIO from '@ioc:Socket.IO';
import Bot from 'App/Models/Bot';
import Webhook, { WebhookStatus } from 'App/Models/Webhook';
import qrcode from 'qrcode-terminal';
import { Client, ClientSession, Message } from 'whatsapp-web.js';

class BotService {
  private sessions: Array<Client> = [];
  private webhooks: Array<NodeJS.Timeout> = [];

  async init(bot: Bot) {
    if (this.sessions[bot.id] instanceof Client) {
      console.log(`[BOT#${bot.id}] ALREADY CONNECTED`);
      return;
    }

    console.log(`[BOT#${bot.id}] INITIALIZE`);

    this.sessions[bot.id] = this.instanceBot(bot);

    console.log(this.sessions[bot.id].eventNames());
    this.sessions[bot.id].on('', console.log);
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
    console.log(`[BOT#${bot.id}] READY`);

    bot.wastate = 'CONNECTED';
    bot.save();

    this.webhooks[bot.id] = setInterval(this.sendWebhooks.bind(this, bot), 5 * 1000);
    SocketIO.io().emit(`BOT#${bot.id}#STATE`, 'CONNECTED');
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
    SocketIO.io().emit(`BOT#${bot.id}#QRCODE`, qr);
    qrcode.generate(qr, { small: true });
  }

  private authenticated(bot: Bot, browserSessionToken: ClientSession) {
    bot.session = JSON.stringify(browserSessionToken);
    bot.status = '';
    bot.save();

    SocketIO.io().emit(`BOT#${bot.id}#STATE`, 'AUTHENTICATED');
  }

  private async authFailure(bot: Bot, message: string) {
    this.sessions[bot.id]?.destroy();

    bot.status = 'AUTH_FAILURE';
    bot.session = null;
    bot.save();

    SocketIO.io().emit(`BOT#${bot.id}#STATUS`, 'AUTH_FAILURE');

    this.init(bot);
  }

  private async changeState(bot: Bot, state) {
    bot.wastate = state;
    bot.save();

    SocketIO.io().emit(`BOT#${bot.id}#STATE`, state);
  }

  private async disconnected(bot: Bot) {
    console.log(`[BOT#${bot.id}] DISCONNECTED`);

    bot.status = 'DISCONNECTED';
    bot.session = null;
    bot.save();

    clearInterval(this.webhooks[bot.id]);
    this.sessions[bot.id].destroy();

    delete this.sessions[bot.id];

    SocketIO.io().emit(`BOT#${bot.id}#STATUS`, 'DISCONNECTED');
  }

  private async message(bot: Bot, message: Message) {
    console.log(`[BOT#${bot.id}] MESSAGE RECEIVED: ${message.body} FROM: ${message.from}`);
    SocketIO.io().emit(`BOT#${bot.id}#MESSAGE`, message);
  }
}

export default new BotService();
