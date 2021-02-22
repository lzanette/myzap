declare module '@ioc:Socket.IO' {

import { Server } from 'socket.io';

export function io(): Server;
  export function afterStart(cb: () => void): void;
}
