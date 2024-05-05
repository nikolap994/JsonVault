import fs from "fs";

export default class JsonArchitect {
  private fileName: string;

  constructor(fileName: string) {
    this.fileName = fileName;
  }

  // Method to create and write JSON file
  createJsonFile(data: any): void {
    const jsonData = JSON.stringify(data, null, 2); // Convert data to formatted JSON string
    fs.writeFileSync(this.fileName, jsonData); // Write JSON string to file
    console.log(`JSON file '${this.fileName}' created successfully.`);
  }
}
