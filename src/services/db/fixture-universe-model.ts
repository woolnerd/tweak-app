import * as SQLite from 'expo-sqlite';
import FixtureUniverse, { FixtureMap } from '@/util/fixture-universe';

const db = SQLite.openDatabase('testDb.db'); // returns Database object

//
/**
 * Fixture universe model
 * Schema:
 * id
 *
 * import {expect, jest, test} from '@jest/globals';
 */
export default class FixtureUniverseModel {
  static createTable() {
    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS universe (id INTEGER PRIMARY KEY AUTOINCREMENT, value INTEGER, addresses TEXT)'
      );
    });

    db.transaction((tx) => {
      tx.executeSql('SELECT * FROM addresses', [null], (txObj, resultSet) =>
        console.log(resultSet.rows._array)
      );
    });
  }

  static addUniverse(value: number, addresses: FixtureMap[]) {
    const serializedAddresses = JSON.stringify(addresses);
    db.transaction((tx) => {
      tx.executeSql('INSERT INTO universe (value, addresses) VALUES (?, ?)', [
        value,
        serializedAddresses,
      ]);
    });
  }

  // static async getUniverse(id: number): Promise<FixtureUniverse | null> {
  //   return new Promise((resolve, reject) => {
  //     db.transaction((tx) => {
  //       tx.executeSql(
  //         'SELECT * FROM universe WHERE id = ?',
  //         [id],
  //         (tx, results) => {
  //           if (results.rows.length > 0) {
  //             const { value, addresses } = results.rows.item(0);
  //             const parsedAddresses = JSON.parse(addresses);
  //             resolve(new FixtureUniverse(value, parsedAddresses));
  //           } else {
  //             resolve(null);
  //           }
  //         }
  //       );
  //     });
  //   });
  // }

  // Implement other CRUD methods...
}
