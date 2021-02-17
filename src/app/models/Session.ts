import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import { SocketState } from "venom-bot";

enum SessionState {
  starting = 'STARTING',
  closed = 'CLOSED',
  conflict = 'CONFLICT',
  unpaired = 'UNPAIRED',
  unlaunched = 'UNLAUNCHED',
  qrcode = 'QRCODE',
  connected = 'CONNECTED'
};

export const sessionState = SessionState;

@Entity()
export class Session {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  qrcode: string;

  @Column({
    type: 'enum',
    enum: SessionState,
    nullable: true
  })
  state: SessionState;

  @Column({
    type: 'json',
    nullable: true
  })
  browserSessionToken: Object;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

export default Session