import Base from './base';
import { manufacturers } from '@/db/schema';
import { Database, QueryKeys } from '@/db/types/database';
import { InsertManufacturer, SelectManufacturer } from '@/db/types/tables';

export default class Manufacturer extends Base<
  InsertManufacturer,
  SelectManufacturer
> {
  readonly table = manufacturers;
  readonly name: QueryKeys = 'manufacturers'

  constructor(db: Database) {
    super(db);
  }
}
