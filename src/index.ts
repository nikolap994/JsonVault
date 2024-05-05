import { JsonArchitect } from "./JsonArchitect";

export function initializeDatabase(
  dbFileName: string,
  initialData: any = {}
): JsonArchitect {
  return JsonArchitect.initialize(dbFileName, initialData);
}


