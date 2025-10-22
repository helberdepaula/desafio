import { Users } from '../../users/entities/users.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('relatorios', { schema: 'public' })
export class Relatorios {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('character varying', { name: 'nome', length: 255 })
  nome: string;

  @Column('character varying', { name: 'path', nullable: true, length: 255 })
  path: string | null;

  @Column('text', { name: 'log', nullable: true })
  log: string | null;

  @Column('character varying', { name: 'status', length: 255 })
  status: string;

  @Column('timestamp without time zone', { name: 'start' })
  start: Date;

  @Column('timestamp without time zone', { name: 'end', nullable: true })
  end: Date | null;

  @Column('timestamp without time zone', {
    name: 'created_at',
    default: () => 'now()',
  })
  createdAt: Date;

  @Column('timestamp without time zone', {
    name: 'updated_at',
    default: () => 'now()',
  })
  updatedAt: Date;

  @ManyToOne(() => Users, (users) => users.relatorios, { onDelete: 'CASCADE' })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: Users;
}
