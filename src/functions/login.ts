import { Logger } from '../logger';
import { getConnectionInstance } from '../resources';
import { CallVerb, Config, Space } from '../types';
import { extractErrorMessage, reMapSpaceStructureForCreation } from '../utils';

export interface LoginArgs<T> {
  body: Partial<T>;
  space: Space<T>;
  config: Config;
}

export interface LoginResponse {
  token: string;
}

/**
 *
 * @param args
 * @returns
 */
export const _login = async <T>(args: LoginArgs<T>): Promise<LoginResponse> => {
  const { body, space, config } = args;
  const connect = getConnectionInstance(config);

  const spaceStructure = reMapSpaceStructureForCreation(space, config);

  try {
    const res = await connect[CallVerb.Post]('function/login', body, {
      headers: {
        'function-resources': JSON.stringify({
          mustExistSpaceStructures: [spaceStructure],
        }),
      },
    });
    return res.data;
  } catch (error: any) {
    Logger.log(error, 'functions::login');
    return extractErrorMessage(error);
  }
};
