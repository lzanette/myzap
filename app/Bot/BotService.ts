import Bot from 'App/Models/Bot';
import Ws from 'App/Services/Ws';
import { Client, ClientSession, Message } from 'whatsapp-web.js';

const qrcode = require('qrcode-terminal');

class BotService {
  private client: Client;

  constructor(private readonly bot: Bot) {
    // this.repository = getCustomRepository(SessionRepository)
  }

  async init() {
    console.log(`INSTANCE BOT#${this.bot.id} ${this.bot.name}`);

    this.client = this.instanceBot(this.bot);

    this.client.on('qr', this.generateQr.bind(this));

    this.client.on('authenticated', this.authenticated.bind(this));

    this.client.on('auth_failure', this.authFailure.bind(this));

    this.client.on('ready', this.ready);

    this.client.on('message', this.message.bind(this));
  }

  private instanceBot(bot: Bot): Client {
    Ws.start((socket) => {
      console.log(socket.local);
    });

    const client = new Client({
      puppeteer: {
        headless: true,
        defaultViewport: null,
      },
      session: <ClientSession>bot.session || null,
    });

    client.initialize();

    return client;
  }

  private ready() {
    console.log('READY');
  }

  private generateQr(qr: string) {
    // this.session.qrcode = qr;
    // this.repository.save(this.session);
    Ws.io.emit(`BOT#${this.bot.id}`, qr);

    qrcode.generate(qr, { small: true });
  }

  private authenticated(browserSessionToken: ClientSession) {
    console.log('AUTHENTICATED');

    this.bot.session = browserSessionToken;
    this.bot.save();
  }

  private async authFailure(message: string) {
    console.log('AUTH_FAILURE', message);

    // await this.client.destroy();
    // this.session.browserSessionToken = null;
    // await this.repository.save(this.session);

    // this.init(this.session.name);
  }

  private message(message: Message) {
    console.log('MESSAGE RECEIVED', message);
  }
}

export default BotService;
