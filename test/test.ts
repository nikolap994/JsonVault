import { initialize } from '../src/index';

const dbFileName = './db.json';
const initialData = { users: [], posts: [] };

const dbEngine = initialize(dbFileName, initialData);