import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Relatorios } from '../../relatorios/entities/Relatorios.entity';

export enum TypeRules {
  ADMIN = 'ADMIN',
  VENDEDOR = 'VENDEDOR',
}

@Index('users_email_key', ['email'], { unique: true })
@Index('users_pkey', ['id'], { unique: true })
@Entity('users', { schema: 'public' })
export class Users {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('character varying', { name: 'nome', nullable: true, length: 255 })
  nome: string | null;

  @Column('character varying', {
    name: 'email',
    nullable: true,
    unique: true,
    length: 255,
  })
  email: string | null;

  @Column('character varying', { name: 'pwd', nullable: true, length: 255 })
  pwd: string | null;

  @Column('character varying', {
    name: 'recovery_code',
    nullable: true,
    length: 10,
  })
  recoveryCode: string | null;

  @Column({
    type: 'enum',
    enum: TypeRules,
    default: TypeRules.VENDEDOR,
    nullable: false,
  })
  perfil: TypeRules;

  @Column('enum', {
    name: 'status',
    enum: ['ACTIVE', 'INACTIVE'],
    default: () => "'ACTIVE'",
  })
  status: 'ACTIVE' | 'INACTIVE';

  @Column('integer', {
    name: 'endereco_id',
  })
  endereco_id: number;

  @Column('timestamp with time zone', {
    name: 'created_at',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date | null;

  @Column('timestamp with time zone', {
    name: 'updated_at',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date | null;

  @OneToMany(() => Relatorios, (relatorios) => relatorios.user)
  relatorios: Relatorios[];
}