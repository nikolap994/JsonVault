import { initializeDatabase } from '../src/index';

const dbFileName = './db.json';
const initialData = { users: [], posts: [] };

const dbEngine = initializeDatabase(dbFileName, initialData);