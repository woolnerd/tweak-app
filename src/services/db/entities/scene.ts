import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm/browser';
import { SceneList } from './scene-list';
import { FixtureAssignment } from './fixture-assignment';

@Entity()
export class Scene {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(() => SceneList)
  @JoinTable()
  sceneLists: SceneList[];

  @ManyToMany(() => FixtureAssignment)
  @JoinTable()
  fixtureAssignments: FixtureAssignment[];
}
