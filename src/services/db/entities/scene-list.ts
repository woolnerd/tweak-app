import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  ManyToOne,
} from 'typeorm';
import { Scene } from './scene';
import { Show } from './show';

@Entity()
export class SceneList {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  order_number: number;

  @ManyToMany(() => Scene)
  @JoinTable()
  scenes: Scene[];

  @ManyToOne(() => Show, (show) => show.sceneLists)
  show: Show;
}
