import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm/browser';
import { Profile } from './profile';
import { Fixture } from './fixture';
import { Scene } from './scene';

@Entity()
export class FixtureAssignment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  channel: number;

  @Column()
  value: number;

  @ManyToMany(() => Fixture)
  @JoinTable()
  fixtures: Fixture[];

  @ManyToMany(() => Profile)
  @JoinTable()
  profiles: Profile[];

  @ManyToMany(() => Scene)
  scenes: Scene[];
}
