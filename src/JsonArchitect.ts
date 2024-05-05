import fs from 'fs';

export class JsonArchitect {
    private fileName: string;

    constructor(fileName: string, initialData: any = {}) {
        this.fileName = fileName;
        this.initializeDatabase(initialData);
    }

    private initializeDatabase(initialData: any): void {
        if (!fs.existsSync(this.fileName)) {
            fs.writeFileSync(this.fileName, JSON.stringify(initialData, null, 2), 'utf8');
            console.log(`JSON file '${this.fileName}' created successfully.`);
        } else {
            console.log(`JSON file '${this.fileName}' already exists. Skipping creation.`);
        }
    }

    setData(data: any): void {
        const currentData = this.readJsonFile();
        const newData = { ...currentData, ...data };
        this.writeJsonFile(newData);
    }

    private readJsonFile(): any {
        try {
            const jsonData = fs.readFileSync(this.fileName, 'utf8');
            return JSON.parse(jsonData);
        } catch (error) {
            console.error(`Error reading JSON file '${this.fileName}':`, error);
            return {};
        }
    }

    private writeJsonFile(data: any): void {
        const jsonData = JSON.stringify(data, null, 2);
        fs.writeFileSync(this.fileName, jsonData, 'utf8');
        console.log(`JSON file '${this.fileName}' updated.`);
    }
}
