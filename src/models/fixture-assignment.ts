import Base from './base';
import { fixtureAssignments } from '@/db/schema';
import {
  InsertFixtureAssignment,
  SelectFixtureAssignment,
} from '@/db/types/tables';

export default class FixtureAssignment extends Base<
  InsertFixtureAssignment,
  SelectFixtureAssignment
> {
  readonly table = fixtureAssignments;
}
