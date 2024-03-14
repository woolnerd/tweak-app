import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  ManyToOne,
} from 'typeorm';
import { Profile } from './profile';
import { Manufacturer } from './manufacturer';
import { FixtureAssignment } from './fixture-assignment';

@Entity()
export class Fixture {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  notes: string;

  @ManyToMany(() => Profile)
  @JoinTable()
  profiles: Profile[];

  @ManyToMany(() => FixtureAssignment)
  @JoinTable()
  fixtureAssignments: FixtureAssignment[];

  @ManyToOne(() => Manufacturer, (manufacturer) => manufacturer.fixtures)
  manufacturer: Manufacturer;
}
