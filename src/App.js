
// import 'reflect-metadata';
import App from './src';

import { DataSource } from "typeorm"

const AppDataSource = new DataSource({
  type: "sqlite3",
  host: "localhost",
  port: 3306,
  username: "test",
  password: "test",
  database: "test",
})


export default App;
