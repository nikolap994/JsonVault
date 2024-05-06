"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  JsonVault: () => JsonVault
});
module.exports = __toCommonJS(src_exports);

// src/JsonVault.ts
var import_fs = __toESM(require("fs"));
var JsonVault = class {
  fileName;
  data = null;
  // Use null to indicate uninitialized state
  constructor(fileName, initialData = {}) {
    this.fileName = fileName;
    if (!import_fs.default.existsSync(this.fileName)) {
      this.initializeDatabase(initialData);
    } else {
      this.loadData();
    }
  }
  initializeDatabase(initialData) {
    import_fs.default.writeFileSync(this.fileName, JSON.stringify(initialData, null, 2), "utf8");
    console.log(`JSON file '${this.fileName}' created successfully.`);
    this.data = initialData;
  }
  loadData() {
    try {
      const jsonData = import_fs.default.readFileSync(this.fileName, "utf8");
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
      import_fs.default.writeFileSync(this.fileName, jsonData, "utf8");
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  JsonVault
});
