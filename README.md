# JsonVault

JsonVault is a lightweight library for managing JSON-based databases in Node.js applications. It provides simple and efficient methods to interact with JSON data, including storing, retrieving, updating, and deleting records.

## Installation

You can install JsonVault via npm:

```
npm install jsonvault
```

## Usage

To use JsonVault, follow these steps:

### Initialize JsonVault

Initialize a database with a specified file name and optional initial data:

```typescript
import { JsonVault } from 'jsonvault';

const dbFileName = './db.json';
const initialData = {
    users: [],
    posts: []
};

const db = new JsonVault(dbFileName, initialData);
```

### Basic Operations

#### Get Data

Retrieve data from the JSON database using property paths:

```typescript
// Get users data
const users = db.get('users');

// Get the first user's name
const firstName = db.get('users.0.name');
```

#### Set Data

Set or update data in the JSON database:

```typescript
// Add a new user
db.set('users.1', { name: 'Bob' });

// Update a user's name
db.set('users.0.name', 'Alice');
```

#### Delete Data

Delete data from the JSON database:

```typescript
// Delete a user
db.delete('users.1');

// Clear all users
db.set('users', []);
```

### Advanced Operations

#### Push to Array

Append new elements to an array in the JSON database:

```typescript
// Add a new post
db.get('posts').push({ title: 'New Post' });
```

#### Nested Operations

Perform chained operations on nested data:

```typescript
// Update a nested property
db.get('users.0').set('name', 'Eve');

// Delete a nested property
db.get('posts.0').delete('title');
```

### Automatic Cleanup

JsonVault automatically removes empty objects from arrays after deletions:

```typescript
// Before deletion
// { "users": [{}, { "name": "Bob" }], "posts": [{ "title": "First Post" }] }

// Delete the first user
db.delete('users.0');

// After deletion (empty object removed)
// { "users": [{ "name": "Bob" }], "posts": [{ "title": "First Post" }] }
```

## Contributing

Contributions are welcome! If you have suggestions, feature requests, or bug reports, please [open an issue](https://github.com/nikolap994/JsonVault/issues).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
