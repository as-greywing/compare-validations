import { object, string, InferType, array, number, ObjectSchema } from "yup";

const sources = ["imos", "predictive"] as const;
type sourceType = typeof sources[number];

const PortSchema = object({
  name: string().required(),
  locode: string().optional(),
});

export type Port = InferType<typeof PortSchema>;

try {
  const v1 = PortSchema.validateSync({
    name: "SGSIN",
  });
  console.log("Validate 1", v1);
} catch (error) {
  console.log("Errors", error);
}

const PortSchemaWithSource = object({
  name: string().required(),
  locode: string().optional(),
  source: string<sourceType>().required(),
  // or
  // source: string().oneOf(sources).required(),
});

export type PortWithSource = InferType<typeof PortSchemaWithSource>;

try {
  const v1 = PortSchemaWithSource.validateSync({
    name: "SGSIN",
    source: "imos",
  });
  console.log("Validate 1", v1);
} catch (error) {
  console.log("Errors", (error as any).errors);
}

const CountrySchema = object({
  name: string().required(),
  ports: array(PortSchemaWithSource).required(),
});

export type Country = InferType<typeof CountrySchema>;

try {
  const v1 = CountrySchema.validateSync({
    name: "Singapore",
    ports: [],
  });
  console.log("Validate 1", v1);

  const v2 = CountrySchema.validateSync({
    name: "Singapore",
    ports: [{ name: "Singapore", source: "imos", locode: "SGSIN" }],
  });
  console.log("Validate 2", v2);
} catch (error) {
  console.log("Errors", (error as any).errors);
}

/**
 * Optional non-primitive
 */

const MetaSchema = object({
  count: number().required(),
});

export type Meta = InferType<typeof MetaSchema>;

type CountryWithMeta = Country & {
  meta?: Meta;
};

const CountrySchemaWithMeta: ObjectSchema<CountryWithMeta> = object({
  name: string().required(),
  ports: array(PortSchemaWithSource).required(),
  meta: MetaSchema.optional().default(undefined),
});

try {
  const countryWithoutPort: CountryWithMeta = {
    name: "Singapore",
    ports: [],
  };
  const v1 = CountrySchemaWithMeta.validateSync(countryWithoutPort);
  console.log("Validate 1", v1);

  const countryWithMeta: CountryWithMeta = {
    name: "Singapore",
    ports: [{ name: "Singapore", source: "imos", locode: "SGSIN" }],
    meta: {
      count: 1,
    },
  };
  const v2 = CountrySchemaWithMeta.validateSync(countryWithMeta);
  console.log("Validate 2", v2);
} catch (error) {
  console.log("Errors", (error as any).errors);
}

/**
 * Empty string, nullable, optional
 */

const AirportSchema = object({
  name: string().required(),
  code: string().defined(),
  nullableCode: string().defined().nullable(),
  optionalCode: string().defined().optional(),
  optionalNullableCode: string().defined().nullable().optional(),
});

export type Airport = InferType<typeof AirportSchema>;

try {
  const airport: Airport = {
    name: "Singapore",
    code: "",
    nullableCode: null,
    optionalCode: undefined,
  };
  const v1 = AirportSchema.validateSync(airport);
  console.log("Validate 1", v1);
} catch (error) {
  console.log("Errors", (error as any).errors);
}

/**
 * Removing unwanted fields
 */

const AirportCleanSchema = object({
  name: string().required(),
  code: string().defined(),
});

try {
  const airport: Airport = {
    name: "Singapore",
    code: "",
    nullableCode: null,
    optionalCode: undefined,
  };
  const v1 = AirportCleanSchema.validateSync(airport, {
    stripUnknown: true,
  });
  console.log("Validate 1", v1);
} catch (error) {
  console.log("Errors", (error as any).errors);
}

/**
 * Transform values to default if failed
 */

const PortSchemaWithSourceTransform = object({
  name: string().required(),
  locode: string().optional(),
  source: string()
    .oneOf(sources)
    .transform((value) => {
      if (!sources.includes(value)) {
        return undefined;
      }
      return value;
    })
    .required()
    .default(sources[0]),
});

export type PortTransform = InferType<typeof PortSchemaWithSourceTransform>;

try {
  const port = {
    name: "Singapore",
    locode: "SGSIN",
    source: "sgsin",
  };
  const v1 = PortSchemaWithSourceTransform.validateSync(port);
  console.log("Validate 1", v1);
} catch (error) {
  console.log("Errors", (error as any).errors);
}
