declare class JsonVault {
    private fileName;
    private data;
    constructor(fileName: string, initialData?: any);
    private initializeDatabase;
    private loadData;
    private writeData;
    private findNestedProperty;
    private setNestedProperty;
    private deleteNestedProperty;
    private cleanUpEmptyObjects;
    get(propPath: string): any;
    set(propPath: string, value: any): void;
    delete(propPath: string): void;
}

export { JsonVault };
