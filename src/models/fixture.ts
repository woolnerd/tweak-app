import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { FixtureProfile } from './FixtureProfile';

@Entity()
export class Fixture {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  manufacturerId: number;

  @ManyToOne(() => FixtureProfile, (fixtureProfile) => fixtureProfile.fixtures)
  fixtureProfile: FixtureProfile;

  @Column()
  notes: string;
}
