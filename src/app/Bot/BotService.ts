import { Client, ClientSession, Message, MessageContent } from 'whatsapp-web.js'

import SessionRepository from "@/app/repositories/SessionRepository"
import { getCustomRepository } from "typeorm"
import Session from '../models/Session'

const qrcode = require('qrcode-terminal')

class BotService {

  private client: Client

  private session: Session

  private repository: SessionRepository

  constructor() {
    this.repository = getCustomRepository(SessionRepository)
  }

  async init(name: string) {
    this.session = await this.repository.findOne({ where: { name } })

    if (!this.session) {
      this.session = this.repository.create({
        name
      })
    }

    console.log(`SESSION: ${this.session.name}`);

    this.client = this.instanceBot(this.session);

    this.client.on('qr', this.generateQr.bind(this));

    this.client.on('authenticated', this.authenticated.bind(this));

    this.client.on('auth_failure', this.authFailure.bind(this));

    this.client.on('ready', this.ready);

    this.client.on('message', this.message.bind(this));
  }

  private instanceBot(session: Session): Client {
    const client = new Client({
      puppeteer: {
        headless: true,
        defaultViewport: null
      },
      session: <ClientSession>session.browserSessionToken || null
    })

    client.initialize()

    return client
  }

  private ready() {
    console.log('READY');
  }

  private generateQr(qr: string) {
    this.session.qrcode = qr
    this.repository.save(this.session)

    qrcode.generate(qr, { small: true })
  }

  private authenticated(browserSessionToken: ClientSession) {
    console.log('AUTHENTICATED');

    this.session.browserSessionToken = browserSessionToken;
    this.repository.save(this.session);
  }

  private async authFailure(message: string) {
    console.log('AUTH_FAILURE', message);

    await this.client.destroy();
    this.session.browserSessionToken = null;
    await this.repository.save(this.session);

    this.init(this.session.name);
  }

  private message(message: Message) {
    console.log('MESSAGE RECEIVED', message);

    if (message.body.includes('somar')) {

      const expression = message.body.match(/(\d+)([^0-9])(\d+)/);

      const result = <string>eval(
        `${expression[1]} ${expression[2]} ${expression[3]}`
      );

      this.client.sendMessage(message.from, <MessageContent>`Resultado: ${result}`);
    }
  }

}

export default BotService;