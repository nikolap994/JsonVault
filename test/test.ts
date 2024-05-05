import { JsonArchitect } from '../src/JsonArchitect';

const dbFileName = './db.json';
const initialData = { users: [{ name: 'Alice' }, { name: 'Bob' }], posts: [] };

// Creating a new JsonArchitect instance will automatically initialize the database if necessary
const db = new JsonArchitect(dbFileName, initialData);

const firstName = db.get('users.0.name');
console.log('First user name:', firstName); // Output: "Alice"

db.set('users.0.name', 'Jeff');
console.log(db.get('users')); // Output: [{ name: 'Jeff' }, { name: 'Bob' }]

db.set('posts', [{ title: 'First Post' }]);
console.log(db.get('users.0.name'));

db.delete('users.0.name');