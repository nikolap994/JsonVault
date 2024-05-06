// src/JsonVault.ts
import fs from "fs";
var JsonVault = class {
  fileName;
  data = null;
  // Use null to indicate uninitialized state
  constructor(fileName, initialData = {}) {
    this.fileName = fileName;
    if (!fs.existsSync(this.fileName)) {
      this.initializeDatabase(initialData);
    } else {
      this.loadData();
    }
  }
  initializeDatabase(initialData) {
    fs.writeFileSync(this.fileName, JSON.stringify(initialData, null, 2), "utf8");
    console.log(`JSON file '${this.fileName}' created successfully.`);
    this.data = initialData;
  }
  loadData() {
    try {
      const jsonData = fs.readFileSync(this.fileName, "utf8");
      this.data = JSON.parse(jsonData);
      console.log(`JSON data loaded from file '${this.fileName}'.`);
    } catch (error) {
      console.error(`Error loading JSON data from file '${this.fileName}':`, error);
      this.data = {};
    }
  }
  writeData() {
    if (this.data !== null) {
      const jsonData = JSON.stringify(this.data, null, 2);
      fs.writeFileSync(this.fileName, jsonData, "utf8");
      console.log(`JSON data written to file '${this.fileName}'.`);
    } else {
      console.error(`No data to write to file '${this.fileName}'.`);
    }
  }
  findNestedProperty(obj, props) {
    let current = obj;
    for (const prop of props) {
      if (current && typeof current === "object" && prop in current) {
        current = current[prop];
      } else {
        return null;
      }
    }
    return current;
  }
  setNestedProperty(obj, props, value) {
    let current = obj;
    const lastProp = props.pop();
    if (lastProp === void 0) {
      throw new Error(`Invalid property path: ${props.join(".")}`);
    }
    for (const prop of props) {
      if (current && typeof current === "object" && prop in current) {
        current = current[prop];
      } else {
        throw new Error(`Property '${prop}' not found in path '${props.join(".")}'`);
      }
    }
    current[lastProp] = value;
    this.writeData();
    console.log(`Set property '${lastProp}' in path '${props.join(".")}' to '${value}'.`);
  }
  deleteNestedProperty(obj, props) {
    const lastProp = props.pop();
    if (lastProp === void 0) {
      throw new Error(`Invalid property path: ${props.join(".")}`);
    }
    let current = obj;
    for (const prop of props) {
      if (current && typeof current === "object" && prop in current) {
        current = current[prop];
      } else {
        throw new Error(`Property '${prop}' not found in path '${props.join(".")}'`);
      }
    }
    if (Array.isArray(current)) {
      const index = parseInt(lastProp);
      if (!isNaN(index) && index >= 0 && index < current.length && typeof current[index] === "object" && Object.keys(current[index]).length === 0) {
        current.splice(index, 1);
      }
    } else if (current && typeof current === "object" && lastProp in current) {
      delete current[lastProp];
    } else {
      throw new Error(`Property '${lastProp}' not found in path '${props.join(".")}'`);
    }
    this.cleanUpEmptyObjects(obj);
    if (Object.keys(this.data).length === 0) {
      this.data = {};
      this.writeData();
      console.log(`JSON data reset to empty object.`);
    } else {
      this.writeData();
    }
  }
  cleanUpEmptyObjects(obj) {
    if (Array.isArray(obj)) {
      for (let i = obj.length - 1; i >= 0; i--) {
        if (typeof obj[i] === "object" && Object.keys(obj[i]).length === 0) {
          obj.splice(i, 1);
        }
      }
    } else if (typeof obj === "object") {
      for (const key in obj) {
        if (typeof obj[key] === "object") {
          this.cleanUpEmptyObjects(obj[key]);
        }
      }
    }
  }
  get(propPath) {
    if (this.data === null) {
      throw new Error(`Database not initialized. Use initializeDatabase to initialize.`);
    }
    const props = propPath.split(".");
    const nestedProperty = this.findNestedProperty(this.data, props);
    if (nestedProperty === null) {
      throw new Error(`Property '${propPath}' not found in data.`);
    }
    return nestedProperty;
  }
  set(propPath, value) {
    if (this.data === null) {
      throw new Error(`Database not initialized. Use initializeDatabase to initialize.`);
    }
    const props = propPath.split(".");
    this.setNestedProperty(this.data, props, value);
  }
  delete(propPath) {
    if (this.data === null) {
      throw new Error(`Database not initialized. Use initializeDatabase to initialize.`);
    }
    const props = propPath.split(".");
    this.deleteNestedProperty(this.data, props);
  }
};
export {
  JsonVault
};
