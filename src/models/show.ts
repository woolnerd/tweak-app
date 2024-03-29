import Base from './base';
import { shows } from '@/db/schema';
import { Database, QueryKeys } from '@/db/types/database';
import { InsertShow, SelectShow, TableNames } from '@/db/types/tables';

export default class Show extends Base<
  InsertShow,
  SelectShow
> {
  readonly table = shows;
  readonly name: QueryKeys = TableNames.Shows;

  constructor(db: Database) {
    super(db);
  }
}
