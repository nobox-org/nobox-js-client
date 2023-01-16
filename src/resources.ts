import axios from 'axios';
import { CallResourcesByType, CallVerb, Config, SentHeaders } from './types';

export const callResourcesByType: CallResourcesByType = {
  _find: {
    callVerb: CallVerb.Get,
  },
  _findOne: {
    slugAppend: '_single_',
    callVerb: CallVerb.Get,
  },
  _insert: {
    callVerb: CallVerb.Post,
  },
  _insertOne: {
    slugAppend: '_single_',
    callVerb: CallVerb.Post,
  },
  _updateOne: {
    slugAppend: 'update',
    callVerb: CallVerb.Post,
  },
  _updateOneById: {
    slugAppend: 'updateById',
    callVerb: CallVerb.Post,
  },
};

export const getConnectionInstance = (config: Config) => {
  const { endpoint, project } = config;

  const autoGenUrl = `${endpoint}/${project}`;

  const defaultRequestHeaders = getDefaultHeaders(config);

  const axiosInstance = axios.create({
    baseURL: autoGenUrl,
    headers: { ...defaultRequestHeaders } as any,
  });

  return axiosInstance;
};

export const getDefaultHeaders = (config: Config) => {
  const { token, autoCreate: autoCreateProject } = config;

  const defaultRequestHeaders: Omit<SentHeaders, 'structure'> = {
    'content-type': 'application/json',
    authorization: `Bearer ${token}`,
    'auto-create-project': autoCreateProject ? 'true' : 'false',
    'auto-create-record-space': 'true',
  };

  return defaultRequestHeaders;
};
