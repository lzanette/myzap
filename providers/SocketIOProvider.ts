import { ConfigContract } from '@ioc:Adonis/Core/Config';
import { IocContract } from '@adonisjs/fold';
import { ServerContract } from '@ioc:Adonis/Core/Server';
import SocketIO from 'socket.io';
//import redisAdapter from 'socket.io-redis'

class SocketIOInstance {
  private server: ServerContract;
  private config: ConfigContract;
  private afterStartCB: () => void;
  private ioInstance = SocketIO();
  constructor(Server: ServerContract, Config: ConfigContract) {
    this.server = Server;
    this.config = Config;
  }
  public afterStart(cb: () => void) {
    this.afterStartCB = cb;
  }
  public start() {
    // const { host, port } = this.config.get('redis.connections.local');
    this.ioInstance = SocketIO(this.server.instance, {
      cors: {},
    });
    //this.ioInstance.adapter(redisAdapter({ host, port }))
    if (typeof this.afterStartCB === 'function') {
      this.afterStartCB();
    }
    console.log('SocketIO started');
  }
  public io() {
    return this.ioInstance;
  }
}

export default class SocketIOProvider {
  constructor(protected $container: IocContract) {}

  public register() {
    // Register your own bindings
    this.$container.singleton('Socket.IO', () => {
      const Server: ServerContract = this.$container.use('Adonis/Core/Server');
      const Config: ConfigContract = this.$container.use('Adonis/Core/Config');
      return new SocketIOInstance(Server, Config);
    });
  }

  public boot() {}

  public shutdown() {
    // Cleanup, since app is going down
  }

  public ready() {
    // When app and http server are ready
    const SocketIO = this.$container.use('Socket.IO');
    SocketIO.start();
  }
}
