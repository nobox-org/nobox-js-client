import { cLogger, Logger } from '../logger';
import { getConnectionInstance } from '../resources';
import { CallVerb, Config, Space } from '../types';
import { extractErrorMessage, reMapSpaceStructureForCreation } from '../utils';

export type LoginArgs<T> = {
  body: Partial<T>;
  space: Space<T>;
  config: Config;
};

export type LoginResponse<T> = {
  token: string;
  user: T;
};

/**
 *
 * @param args
 * @returns
 */
export const _login = async <T>(args: LoginArgs<T>): Promise<LoginResponse<T> | null> => {
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
    const extractedErrorMessage = extractErrorMessage(error);
    cLogger.log(extractedErrorMessage, 'functions::login');
  }

  return null;
};
