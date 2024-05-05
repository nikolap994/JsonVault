import { JsonArchitect } from './JsonArchitect';
import fs from 'fs';

export function initialize(dbFileName: string, initialData: any = {}): JsonArchitect | null {
  if (fs.existsSync(dbFileName)) {
    console.log(`Database file '${dbFileName}' already exists. Skipping initialization.`);
    return null;
  }

  const engine = new JsonArchitect(dbFileName);
  engine.createJsonFile(initialData);
  return engine;
}
