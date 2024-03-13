import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Fixture } from './Fixture';

@Entity()
export class Fixture {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fixture_id: number;

  @Column()
  profile_id: number;

  @ManyToOne(() => FixtureProfile, (fixtureProfile) => fixtureProfile.fixtures)
  fixtureProfile: FixtureProfile;
}
