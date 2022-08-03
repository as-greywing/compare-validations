import {
  object,
  string,
  Infer,
  optional,
  validate,
  enums,
  array,
  number,
  assign,
  nullable,
  mask,
  refine,
  coerce,
  create,
  defaulted,
  any,
} from "superstruct";

const sources = ["imos", "predictive"] as const;
type sourceType = typeof sources[number];

const PortSchema = object({
  name: string(),
  locode: optional(string()),
});

export type Port = Infer<typeof PortSchema>;

try {
  const v1 = validate(
    {
      name: "SGSIN",
    },
    PortSchema
  );
  console.log("Validate", v1);
} catch (error) {
  console.log("Errors", error);
}

const PortSchemaWithSource = object({
  name: string(),
  locode: optional(string()),
  source: enums(sources),
});

export type PortWithSource = Infer<typeof PortSchemaWithSource>;

try {
  const v1 = validate(
    {
      name: "SGSIN",
      source: "imos",
    },
    PortSchemaWithSource
  );
  console.log("Validate", v1);
} catch (error) {
  console.log("Errors", error);
}

const CountrySchema = object({
  name: string(),
  ports: array(PortSchemaWithSource),
});

export type Country = Infer<typeof CountrySchema>;

try {
  const v1 = validate(
    {
      name: "Singapore",
      ports: [],
    },
    CountrySchema
  );
  console.log("Validate", v1);

  const v2 = validate(
    {
      name: "Singapore",
      ports: [{ name: "Singapore", source: "imos", locode: "SGSIN" }],
    },
    CountrySchema
  );
  console.log("Validate", v2);
} catch (error) {
  console.log("Errors", error);
}

const MetaSchema = object({
  count: number(),
});

const CountrySchemaWithMeta = assign(
  CountrySchema,
  object({
    meta: optional(MetaSchema),
  })
);

export type CountryWithMeta = Infer<typeof CountrySchemaWithMeta>;

try {
  const countryWithoutPort: CountryWithMeta = {
    name: "Singapore",
    ports: [],
  };

  const v1 = validate(countryWithoutPort, CountrySchemaWithMeta);
  console.log("Validate 1", v1);

  const countryWithMeta: CountryWithMeta = {
    name: "Singapore",
    ports: [{ name: "Singapore", source: "imos", locode: "SGSIN" }],
    meta: {
      count: 1,
    },
  };
  const v2 = validate(countryWithMeta, CountrySchemaWithMeta);
  console.log("Validate 2", v2);
} catch (error) {
  console.log("Errors", error);
}

/**
 * Empty string, nullable, optional
 */

const AirportSchema = object({
  name: string(),
  code: string(),
  nullableCode: nullable(string()),
  optionalCode: optional(string()),
  optionalNullableCode: optional(nullable(string())),
});

export type Airport = Infer<typeof AirportSchema>;

try {
  const airport: Airport = {
    name: "Singapore",
    code: "",
    nullableCode: null,
    optionalCode: undefined,
  };

  const v1 = validate(airport, AirportSchema);
  console.log("Validate 1", v1);
} catch (error) {
  console.log("Errors", error);
}

/**
 * Removing unwanted fields
 */

const AirportCleanSchema = object({
  name: string(),
  code: string(),
});

try {
  const airport: Airport = {
    name: "Singapore",
    code: "",
    nullableCode: null,
    optionalCode: undefined,
  };

  const v1 = validate(mask(airport, AirportCleanSchema), AirportCleanSchema);
  console.log("Validate 1", v1);
} catch (error) {
  console.log("Errors", error);
}

/**
 * Transform values to default if invalid
 */

const PortSchemaWithSourceTransform = object({
  name: string(),
  locode: string(),
  source: coerce(enums(sources), any(), (o: any) => {
    if (!sources.includes(o)) {
      return sources[0];
    }
    return o;
  }),
});

export type PortTransform = Infer<typeof PortSchemaWithSourceTransform>;

try {
  const port = {
    name: "Singapore",
    locode: "SGSIN",
    source: "sgsin",
  };

  const v1 = validate(
    create(port, PortSchemaWithSourceTransform),
    PortSchemaWithSourceTransform
  );
  console.log("Validate 1", v1);

  const port2 = {
    name: "Singapore",
    locode: "SGSIN",
  };

  const v2 = validate(
    create(port2, PortSchemaWithSourceTransform),
    PortSchemaWithSourceTransform
  );
  console.log("Validate 2", v2);
} catch (error) {
  console.log("Errors", error);
}
