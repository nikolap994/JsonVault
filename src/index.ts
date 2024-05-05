import JsonArchitect from "./json-class"

const architect = new JsonArchitect("myData.json"); 

// Data to be written to JSON file
const dataToWrite = {
  name: "John Doe",
  age: 30,
  city: "New York",
};


architect.createJsonFile(dataToWrite);
