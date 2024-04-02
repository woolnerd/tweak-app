import Base from './base';
import { fixtureAssignments } from '@/db/schema';
import { QueryKeys } from '@/db/types/database';
import {
  SelectFixtureAssignment,
  TableNames
} from '@/db/types/tables';
import FixtureUniverse from '@/util/fixture-universe';
export default class FixtureAssignment extends Base<
  typeof fixtureAssignments,
  SelectFixtureAssignment
> {
  readonly table = fixtureAssignments;
  readonly name: QueryKeys = TableNames.FixtureAssignments;
}
