import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Timestamp,
} from 'typeorm';

@Entity()
export class Show {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  created_at: Timestamp;

  @Column()
  updated_at: Timestamp;
}
