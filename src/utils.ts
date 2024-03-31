import { cLogger, Logger } from './logger';
import { getDefaultHeaders } from './resources';
import {
  CallCommands,
  CObject,
  Config,
  SentHeaders,
  Space,
  SpaceAuthOptions,
  SpaceFunctionOptions,
  SpaceWebhooks,
  StructureFieldType,
  StructureItem,
} from './types';

export type CompatibleStructureFieldType = 'TEXT' | 'NUMBER' | 'BOOLEAN' | 'ARRAY' | 'OBJECT';

export interface CreateRecordSpacePayload<T> {
  name: string;
  description?: string;
  projectSlug: string;
  slug: string;
  recordFieldStructures: StructureItem<any, CompatibleStructureFieldType>[];
  authOptions?: SpaceAuthOptions;
  functionOptions?: SpaceFunctionOptions<T>;
  webhooks?: SpaceWebhooks;
  clear?: boolean;
  initialData?: T[];
}

export interface CreateHeaders<T> {
  modelToCreate: CreateRecordSpacePayload<T>;
  options?: any;
  config: Config;
  token?: string;
}

const extraCompatibleTypeFromConstructorType = (type: StructureFieldType): CompatibleStructureFieldType => {
  if (type === String) return 'TEXT';
  if (type === Number) return 'NUMBER';
  if (type === Boolean) return 'BOOLEAN';
  if (type === Array) return 'ARRAY';
  if (type === Object) return 'OBJECT';
  throw new Error(`Type ${type} is not supported`);
};

const extractStructureParams = (
  value: StructureItem | StructureFieldType,
): StructureItem<any, CompatibleStructureFieldType> => {
  const paramDefaults = {
    required: false,
    unique: false,
    description: '',
    comment: '',
    hashed: false,
  };

  const isObject = (v: any): v is StructureItem => typeof value === 'object' && !Array.isArray(value) && value !== null;

  const valueIsAndObject = isObject(value);

  const { type, ...rest } = valueIsAndObject ? value : { type: value };

  return {
    ...paramDefaults,
    ...rest,
    type: extraCompatibleTypeFromConstructorType(type),
  };
};

export const reMapSpaceStructureForCreation = <T>(
  { structure, space, description, authOptions, functionOptions, clear, initialData, webhooks }: Space<T>,
  config: Config,
): CreateRecordSpacePayload<T> => {
  const recordFieldStructures = [];
  const structureKeys = Object.keys(structure);
  for (const key of structureKeys) {
    const value = structure[key as keyof T];
    const params = extractStructureParams(value);
    recordFieldStructures.push({
      ...params,
      slug: camelToTrain(key),
      name: key,
    });
  }
  return {
    name: space,
    description,
    projectSlug: config.project,
    slug: space.toLowerCase(),
    authOptions,
    recordFieldStructures,
    functionOptions,
    clear,
    initialData,
    webhooks,
  };
};

export const camelToTrain = (str: string) => str.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);

export const convertPayloadKeysToTrain = <T extends object>(payload: T) => {
  Logger.log({ payload }, 'convertParamsKeysToTrain');

  if (payload && Array.isArray(payload)) {
    return (payload as T[]).map(convertPayload);
  }

  return convertPayload(payload);

  function convertPayload(payload: T) {
    const convertedPayload: Record<string, any> = {};
    const keys = Object.keys(payload);
    for (const key of keys) {
      convertedPayload[key] = payload[key as keyof T];
    }
    return convertedPayload;
  }
};

export const handleSchemaCallErrors = (error: any, functionTag: string, publicErrorTag: string) => {
  Logger.log(error, functionTag);
  cLogger.log({ error: error || 'An Error Occurred' }, publicErrorTag);
  return undefined;
};

const createPayload = ({ params, body }: any) =>
  ({
    ...(params ? { params: convertPayloadKeysToTrain(params) } : {}),
    ...(body ? { body: convertPayloadKeysToTrain(body) } : {}),
  } as Record<'params' | 'body', any>);

const createHeaders = <T>({ modelToCreate, options, config, token }: CreateHeaders<T>): any => {
  const headers: SentHeaders = {
    ...getDefaultHeaders(config),
    structure: JSON.stringify(modelToCreate),
  };

  if (options) headers['options'] = JSON.stringify(options) as any;
  if (token) headers['token'] = token;

  return headers;
};

export const prepareData = <T extends CObject>(
  { spaceModel, params, body, slugAppend = '', options, token }: Omit<CallCommands<T>, 'callVerb' | 'config'>,
  config: Config,
) => {
  const modelToCreate = reMapSpaceStructureForCreation(spaceModel, config);

  const payload = params || body;

  const gettingTokenOwnerOnly = Boolean(token);

  if (!['get-key-values', 'get-token-owner'].includes(slugAppend) && !payload) {
    const error = `Please Set body or params for this Call`;
    Logger.error({ structure: modelToCreate.name }, error);
    throw error;
  }

  const payloadObject: Partial<ReturnType<typeof createPayload>> = gettingTokenOwnerOnly
    ? {}
    : createPayload({ params, body });
  const headers = createHeaders({ modelToCreate, options, config, token });

  const fullPayload = {
    ...payloadObject,
    headers,
    url: `${modelToCreate.slug}${slugAppend ? '/' + slugAppend : ''}`,
  };

  Logger.sLog({ fullPayload }, 'utils:prepareData');

  return fullPayload;
};

export const handleCallErrors = (error: any, tag: string) => {
  Logger.sLog({ error }, tag);
  const extractedErrorMessage = extractErrorMessage(error);
  throw extractedErrorMessage;
};

export const extractErrorMessage = (error: any) => {
  const errorMatchOne = error?.response?.data?.error?.response?.error;
  const errorMatchTwo = error?.response?.data?.error;
  const mappedError = errorMatchOne || errorMatchTwo;
  if (!mappedError) {
    console.log(error.message, 'extractErrorMessage');
    return 'Connection Error';
  }
  return mappedError;
};
