import { JsonArchitect } from '../src/JsonArchitect';

const dbFileName = './db.json';
const initialData = { users: [], posts: [] };

// Creating a new JsonArchitect instance will automatically initialize the database
const dbEngine = new JsonArchitect(dbFileName, initialData);

// Now you can directly use dbEngine to set data or perform other operations
dbEngine.setData({ users: [{ id: 1, name: 'Alice' }] });