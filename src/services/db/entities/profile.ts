import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
} from 'typeorm/browser';
import { Fixture } from './fixture';
import { FixtureAssignment } from './fixture-assignment';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: number;

  @Column()
  fixture_id: number;

  @Column()
  mode: string;

  @Column()
  channels: string;

  @OneToMany(
    () => FixtureAssignment,
    (fixtureAssignment) => fixtureAssignment.profiles
  )
  fixtureAssignments: FixtureAssignment[];

  @ManyToMany(() => Fixture)
  fixtures: Fixture[];
}
