import Ajv, { JSONSchemaType } from "ajv";
import AjvJTD, { JTDDataType } from "ajv/dist/jtd";

const ajv = new Ajv();
const ajvJTD = new AjvJTD();

const sources = ["imos", "predictive"] as const;
type sourceType = typeof sources[number];

/** Option 1 - starting with type */

export type Port = {
  name: string;
  locode?: string;
};

const PortSchema: JSONSchemaType<Port> = {
  type: "object",
  properties: {
    name: { type: "string" },
    locode: { type: "string", nullable: true },
  },
  required: ["name"],
  additionalProperties: false,
};

const port = {
  name: "Singapore",
};

const validate = ajv.compile<Port>(PortSchema);
if (validate(port)) {
  // data is MyData here
  console.log("Validate 1", port);
} else {
  console.log(validate.errors);
}

/** Option 2 - starting with JSON Schema */

const PortSchema2 = {
  properties: {
    name: { type: "string" },
  },
  optionalProperties: {
    locode: { type: "string" },
  },
} as const;

export type Port2 = JTDDataType<typeof PortSchema2>;

const validate2 = ajvJTD.compile<Port2>(PortSchema2);
if (validate2(port)) {
  // data is MyData here
  console.log("Validate 1", port);
} else {
  console.log(validate2.errors);
}
