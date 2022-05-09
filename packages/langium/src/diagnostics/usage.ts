import { ExampleWarning } from "./diagnotics";

const warning = new ExampleWarning({name: "Markus"});
console.log(warning.code);    //WARN0001
console.log(warning.message); //This is an example with one parameter Markus

expect(warning.code).toBe("WARN0001")
expect(warning.properties.name).toBe("Markus")