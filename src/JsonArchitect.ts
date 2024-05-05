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

    private findNestedProperty(obj: any, props: string[]): any {
        let current = obj;
        for (const prop of props) {
            if (current && typeof current === 'object' && prop in current) {
                current = current[prop];
            } else {
                return null; // Property path does not exist
            }
        }
        return current;
    }

    private setNestedProperty(obj: any, props: string[], value: any): void {
        let current = obj;
        const lastProp = props.pop(); // Remove last property to set

        if (lastProp === undefined) {
            throw new Error(`Invalid property path: ${props.join('.')}`);
        }

        for (const prop of props) {
            if (current && typeof current === 'object' && prop in current) {
                current = current[prop];
            } else {
                throw new Error(`Property '${prop}' not found in path '${props.join('.')}'`);
            }
        }

        current[lastProp] = value;
        this.writeData();
        console.log(`Set property '${lastProp}' in path '${props.join('.')}' to '${value}'.`);
    }

    private deleteNestedProperty(obj: any, props: string[]): void {
        const lastProp = props.pop(); // Remove last property to delete

        if (lastProp === undefined) {
            throw new Error(`Invalid property path: ${props.join('.')}`);
        }

        let current = obj;
        for (const prop of props) {
            if (current && typeof current === 'object' && prop in current) {
                current = current[prop];
            } else {
                throw new Error(`Property '${prop}' not found in path '${props.join('.')}'`);
            }
        }

        if (Array.isArray(current)) {
            // Check if lastProp is a valid index and the array element is an object
            const index = parseInt(lastProp);
            if (!isNaN(index) && index >= 0 && index < current.length && typeof current[index] === 'object' && Object.keys(current[index]).length === 0) {
                // Remove the empty object from the array
                current.splice(index, 1);
            }
        } else if (current && typeof current === 'object' && lastProp in current) {
            // Delete the property from the object
            delete current[lastProp];
        } else {
            throw new Error(`Property '${lastProp}' not found in path '${props.join('.')}'`);
        }

        // Recursively check and clean up empty objects in arrays
        this.cleanUpEmptyObjects(obj);

        // Check if data object is empty after deletion
        if (Object.keys(this.data).length === 0) {
            this.data = {}; // Reset data to empty object
            this.writeData();
            console.log(`JSON data reset to empty object.`);
        } else {
            this.writeData();
        }
    }

    private cleanUpEmptyObjects(obj: any): void {
        if (Array.isArray(obj)) {
            // Remove empty objects from arrays
            for (let i = obj.length - 1; i >= 0; i--) {
                if (typeof obj[i] === 'object' && Object.keys(obj[i]).length === 0) {
                    obj.splice(i, 1);
                }
            }
        } else if (typeof obj === 'object') {
            // Recursively clean up empty objects in nested objects
            for (const key in obj) {
                if (typeof obj[key] === 'object') {
                    this.cleanUpEmptyObjects(obj[key]);
                }
            }
        }
    }




    get(propPath: string): any {
        if (this.data === null) {
            throw new Error(`Database not initialized. Use initializeDatabase to initialize.`);
        }

        const props = propPath.split('.');
        const nestedProperty = this.findNestedProperty(this.data, props);

        if (nestedProperty === null) {
            throw new Error(`Property '${propPath}' not found in data.`);
        }

        return nestedProperty;
    }

    set(propPath: string, value: any): void {
        if (this.data === null) {
            throw new Error(`Database not initialized. Use initializeDatabase to initialize.`);
        }

        const props = propPath.split('.');
        this.setNestedProperty(this.data, props, value);
    }

    delete(propPath: string): void {
        if (this.data === null) {
            throw new Error(`Database not initialized. Use initializeDatabase to initialize.`);
        }

        const props = propPath.split('.');
        this.deleteNestedProperty(this.data, props);
    }
}
