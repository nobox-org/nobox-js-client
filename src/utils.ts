import { cLogger, Logger } from './logger';
import { getDefaultHeaders } from './resources';
import {
  CallCommands,
  Config,
  SentHeaders,
  Space,
  SpaceAuthOptions,
  SpaceFunctionOptions,
  StructureFieldType,
  StructureItem,
} from './types';

export interface CreateRecordSpacePayload<T> {
  name: string;
  description?: string;
  projectSlug: string;
  slug: string;
  recordStructure: StructureItem[];
  authOptions?: SpaceAuthOptions;
  functionOptions?: SpaceFunctionOptions<T>;
}

const extractStructureParams = (value: StructureItem | StructureFieldType): Required<StructureItem> => {
  const paramDefaults = {
    required: false,
    unique: false,
    description: '',
    hashed: false,
  };

  const isObject = (v: any): v is StructureItem => typeof value === 'object' && !Array.isArray(value) && value !== null;

  return isObject(value) ? { ...paramDefaults, ...value } : { ...paramDefaults, type: value };
};

export const reMapSpaceStructureForCreation = <T>(
  { structure, space, description, authOptions, functionOptions }: Space<T>,
  config: Config,
): CreateRecordSpacePayload<T> => {
  const recordStructure = [];
  const structureKeys = Object.keys(structure);
  for (const key of structureKeys) {
    const value = structure[key as keyof T];
    const params = extractStructureParams(value);
    recordStructure.push({
      ...params,
      slug: camelToTrain(key),
      name: camelToTrain(key),
    });
  }
  return {
    name: space,
    description,
    projectSlug: config.project,
    slug: space.toLowerCase(),
    authOptions,
    recordStructure,
    functionOptions,
  };
};

export const camelToTrain = (key: string) => {
  const result = key.replace(/([A-Z])/g, ' $1');
  return key.trim().split(' ').join('-').toLowerCase();
};

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
      const keyInTrainFormat = camelToTrain(key);
      convertedPayload[keyInTrainFormat] = payload[key as keyof T];
    }
    return convertedPayload;
  }
};

export const handleSchemaCallErrors = (error: any, functionTag: string, publicErrorTag: string) => {
  Logger.log(error, functionTag);
  cLogger.log({ error: error || 'An Error Occurred' }, publicErrorTag);
  return undefined;
};

const createPayload = ({ params, body, payload }: any) => {
  return {
    ...(params ? { params: convertPayloadKeysToTrain(payload) } : {}),
    ...(body ? { body: convertPayloadKeysToTrain(body) } : {}),
  } as Record<'params' | 'body', any>;
};
const createHeaders = ({ modelToCreate, options, config }: any): any => {
  const headers: SentHeaders = {
    ...getDefaultHeaders(config),
    structure: JSON.stringify(modelToCreate),
  };

  if (options) headers['options'] = JSON.stringify(options) as any;

  return headers;
};

export const prepareData = <T>(
  { spaceModel, params, body, slugAppend, options }: Omit<CallCommands<T>, 'callVerb' | 'config'>,
  config: Config,
) => {
  const modelToCreate = reMapSpaceStructureForCreation(spaceModel, config);

  const payload = params || body;

  if (!payload) {
    const error = `Please Set body or params for this Call`;
    Logger.error({ structure: modelToCreate.name }, error);
    throw error;
  }

  const payloadObject = createPayload({ params, body, payload });
  const headers = createHeaders({ modelToCreate, options, config });

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
