import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Timestamp,
  OneToMany,
} from 'typeorm/browser';

import { SceneList } from './scene-list';

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

  @OneToMany(() => SceneList, (scenelist) => scenelist.show)
  sceneLists: SceneList[];
}
