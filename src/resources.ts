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
  _search: {
    slugAppend: 'search',
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
    slugAppend: 'update-by-id',
    callVerb: CallVerb.Post,
  },
  _getTokenOwner: {
    slugAppend: 'get-token-owner',
    callVerb: CallVerb.Get,
  },
};

export const getConnectionInstance = (config: Config) => {
  const { endpoint, project } = config;

  const autoGenUrl = `${endpoint}/${project}`;

  const defaultRequestHeaders = getDefaultHeaders(config);

  const axiosInstance = axios.create({
    baseURL: autoGenUrl,
    headers: defaultRequestHeaders as any,
  });

  return axiosInstance;
};

export const getDefaultHeaders = (config: Config) => {
  const { token, autoCreate: autoCreateProject = true, mutate = true, clear = false } = config;

  const defaultRequestHeaders: Omit<SentHeaders, 'structure'> = {
    //  'content-type': 'application/json',
    authorization: `Bearer ${token}`,
    'auto-create-project': autoCreateProject ? 'true' : 'false',
    'auto-create-record-space': 'true',
    mutate: mutate ? 'true' : 'false',
    'clear-all-spaces': clear ? 'true' : 'false',
  };

  return defaultRequestHeaders;
};
