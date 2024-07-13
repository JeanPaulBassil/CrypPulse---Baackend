import * as Joi from "joi";

export enum Environment {
  DEV = "dev",
  PROD = "prod",
  TEST = "test",
}

export interface IDatabaseConfig {
  user: string;
  password: string;
  db: string;
  host: string;
  port: number;
}

export interface INestConfig {
  appUrl: string;
  port: number;
}

export interface IDocsConfig {
  username: string;
  password: string;
}
export interface IThrottleConfig {
  ttl: number;
  limit: number;
}

export interface IConfig {
  database: IDatabaseConfig;

  nest: INestConfig;

  docs: IDocsConfig;

  throttle: IThrottleConfig;

  environment: Environment;
}

const configSchema = Joi.object({
  database: {
    user: Joi.string().required(),
    password: Joi.string().required(),
    db: Joi.string().required(),
    port: Joi.number().default(5432),
    host: Joi.string().default("localhost"),
  },

  nest: {
    appUrl: Joi.string().required().default("http://localhost:3000"),
    port: Joi.number().default(3200),
  },

  docs: {
    username: Joi.string().required(),
    password: Joi.string().required(),
  },

  throttle: {
    ttl: Joi.number().default(60),
    limit: Joi.number().default(10),
  },

  environment: Joi.string().required(),
});

function transformConfig(config: Record<string, any>) {
  // takes the environment variables in flat format and transforms them into nested format, following the above schema
  return {
    database: {
      user: config.POSTGRES_USER,
      password: config.POSTGRES_PASSWORD,
      db: config.POSTGRES_DB,
      port: config.POSTGRES_PORT,
      host: config.POSTGRES_HOST,
    },
    nest: {
      appUrl: config.APP_URL,
      port: config.NESTJS_PORT,
    },
    docs: {
      username: config.DOCS_USERNAME,
      password: config.DOCS_PASSWORD,
    },
    throttle: {
      ttl: config.THROTTLE_TTL,
      limit: config.THROTTLE_LIMIT,
    },
    environment: config.NODE_ENV,
  };
}

/**
 * Custom function to validate environment variables. It takes an object containing environment variables as input and outputs validated environment variables.
 *
 * @param {Record<string, any>} config - Description of the parameter.
 * @returns {Record<string, any>} Description of the return value.
 * @throws {Error} Description of the exception.
 */
export function validateConfig(config: Record<string, any>) {
  const transformedConfig = transformConfig(config);

  const { error, value } = configSchema.validate(transformedConfig, {
    allowUnknown: false,
    cache: true,
    convert: true,
  });
  if (error) {
    throw new Error(`Config validation error: ${error.message}`);
  }

  return value;
}
