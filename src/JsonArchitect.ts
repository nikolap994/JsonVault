import fs from "fs";

export class JsonArchitect {
    private fileName: string;

    constructor(fileName: string) {
        this.fileName = fileName;
    }

    createJsonFile(data: any): void {
        const jsonData = JSON.stringify(data, null, 2);
        fs.writeFileSync(this.fileName, jsonData);
        console.log(`JSON file '${this.fileName}' created successfully.`);
    }

    static initialize(dbFileName: string, initialData: any = {}): JsonArchitect {
        const engine = new JsonArchitect(dbFileName);
        engine.createJsonFile(initialData);
        return engine;
    }
}
