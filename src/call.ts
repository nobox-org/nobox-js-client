import { AxiosResponse } from 'axios';
import { getConnectionInstance } from './resources';
import { CallCommands, CallVerb, CObject } from './types';
import { handleCallErrors, prepareData } from './utils';

export const call = async <T extends CObject>({
  spaceModel,
  params,
  body,
  slugAppend,
  callVerb,
  options,
  config,
}: CallCommands<T>) => {
  try {
    const connect = getConnectionInstance(config);

    const {
      headers,
      url,
      body: _body,
      params: _params,
    } = prepareData({ spaceModel, params, body, slugAppend, options }, config);
    let res: AxiosResponse;
    if (callVerb === CallVerb.Get) {
      res = await connect[callVerb](url, { params: _params, headers });
      return res.data;
    }

    if (callVerb === CallVerb.Post) {
      res = await connect[callVerb](url, _body, { params: _params, headers });
      return res.data;
    }
  } catch (error: any) {
    handleCallErrors(error, 'createSchema:wrapCall');
  }
};
