import Base from './base';
import { profiles } from '@/db/schema';
import { Database, QueryKeys } from '@/db/types/database';
import { InsertProfile, SelectProfile, TableNames } from '@/db/types/tables';

export default class Profile extends Base<
  InsertProfile,
  SelectProfile
> {
  readonly table = profiles;
  readonly name: QueryKeys = TableNames.Profiles;

  constructor(db: Database) {
    super(db);
  }
}
