import { resolve } from "path";
import * as TJS from "typescript-json-schema";
import fs from "fs";

const settings: TJS.PartialArgs = {
  required: true,
};
const compilerOptions: TJS.CompilerOptions = {
  strictNullChecks: true,
};

const yupProgram = TJS.getProgramFromFiles(
  [resolve("src/yup/index.ts")],
  compilerOptions
);

const yupSchema = TJS.generateSchema(yupProgram, "*", settings);
fs.writeFileSync(
  "./generated/types/yup.ts",
  "const schema = " +
    JSON.stringify(yupSchema, null, 2) +
    " as const;\nexport default schema.definitions;"
);

console.log("Yup Schema generated.");

const superProgram = TJS.getProgramFromFiles(
  [resolve("src/superstruct/index.ts")],
  compilerOptions
);

const superSchema = TJS.generateSchema(superProgram, "*", settings);
fs.writeFileSync(
  "./generated/types/superstruct.ts",
  "const schema = " +
    JSON.stringify(superSchema, null, 2) +
    " as const;\nexport default schema.definitions;"
);

console.log("Superstruct Schema generated.");

/** View Symbols */
// const generator = TJS.buildGenerator(program, settings);
// if (generator) {
//   const symbols = generator.getMainFileSymbols(program);
//   console.log("Symbols", symbols);
// } else {
//   console.error("File not found");
// }
