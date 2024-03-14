import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Fixture } from './fixture';

@Entity()
export class Manufacturer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  website: string;

  @Column()
  notes: string;

  @OneToMany(() => Fixture, (fixture) => fixture.manufacturer)
  fixtures: Fixture[];
}
