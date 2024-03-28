import Base from './base';
import { fixtureAssignments } from '@/db/schema';
import { QueryKeys } from '@/db/types/database';
import {
  InsertFixtureAssignment,
  SelectFixtureAssignment,
  TableNames
} from '@/db/types/tables';
export default class FixtureAssignment extends Base<
  InsertFixtureAssignment,
  SelectFixtureAssignment
> {
  readonly table = fixtureAssignments;
  readonly name: QueryKeys = TableNames.FixtureAssignments;
}
