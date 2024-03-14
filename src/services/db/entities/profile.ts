import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
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

  @ManyToMany(() => FixtureAssignment)
  fixtureAssignments: FixtureAssignment[];

  @ManyToMany(() => Fixture)
  fixtures: Fixture[];
}
