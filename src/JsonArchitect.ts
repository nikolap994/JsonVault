import fs from 'fs';

export class JsonArchitect {
    private fileName: string;
    private data: any | null = null; // Use null to indicate uninitialized state

    constructor(fileName: string, initialData: any = {}) {
        this.fileName = fileName;
        if (!fs.existsSync(this.fileName)) {
            this.initializeDatabase(initialData);
        } else {
            this.loadData();
        }
    }

    private initializeDatabase(initialData: any): void {
        fs.writeFileSync(this.fileName, JSON.stringify(initialData, null, 2), 'utf8');
        console.log(`JSON file '${this.fileName}' created successfully.`);
        this.data = initialData;
    }

    private loadData(): void {
        try {
            const jsonData = fs.readFileSync(this.fileName, 'utf8');
            this.data = JSON.parse(jsonData);
            console.log(`JSON data loaded from file '${this.fileName}'.`);
        } catch (error) {
            console.error(`Error loading JSON data from file '${this.fileName}':`, error);
            this.data = {}; // Fallback to an empty object if loading fails
        }
    }

    private writeData(): void {
        if (this.data !== null) {
            const jsonData = JSON.stringify(this.data, null, 2);
            fs.writeFileSync(this.fileName, jsonData, 'utf8');
            console.log(`JSON data written to file '${this.fileName}'.`);
        } else {
            console.error(`No data to write to file '${this.fileName}'.`);
        }
    }

    get(propPath: string | number): any {
        if (this.data === null) {
            throw new Error(`Database not initialized. Use initializeDatabase to initialize.`);
        }

        const props = Array.isArray(propPath) ? propPath : String(propPath).split('.');
        let current = this.data;

        for (const prop of props) {
            if (current && typeof current === 'object' && prop in current) {
                current = current[prop];
            } else {
                const fullPath = Array.isArray(propPath) ? propPath.join('.') : String(propPath);
                throw new Error(`Property '${prop}' not found in path '${fullPath}'`);
            }
        }

        return current;
    }

    set(propPath: string | number, value: any): void {
        if (this.data === null) {
            throw new Error(`Database not initialized. Use initializeDatabase to initialize.`);
        }

        const props = Array.isArray(propPath) ? propPath : String(propPath).split('.');
        let current = this.data;

        for (let i = 0; i < props.length - 1; i++) {
            const prop = props[i];
            if (current && typeof current === 'object' && prop in current) {
                current = current[prop];
            } else {
                const fullPath = Array.isArray(propPath) ? propPath.join('.') : String(propPath);
                throw new Error(`Property '${prop}' not found in path '${fullPath}'`);
            }
        }

        const lastProp = props[props.length - 1];
        current[lastProp] = value;
        this.writeData();
    }
}
