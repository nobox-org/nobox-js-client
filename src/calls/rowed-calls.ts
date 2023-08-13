import { call } from './call';
import { callResourcesByType } from '../resources';
import { CallCommandsForSearch, CallCommandsWithParams, CObject, Config, Options, Space } from '../types';
import { handleSchemaCallErrors } from '../utils';

export const _find = async <T extends CObject, P extends Partial<T>>(args: CallCommandsWithParams<T, P>) => {
  try {
    return await call({ ...args, ...callResourcesByType['_find'] });
  } catch (error: any) {
    return handleSchemaCallErrors(error, 'create-schema:_find', 'nobox_find');
  }
};

export const _search = async <T extends CObject, P extends Partial<T>>(args: CallCommandsForSearch<T, P>) => {
  try {
    return await call({ ...args, ...callResourcesByType['_search'] });
  } catch (error: any) {
    return handleSchemaCallErrors(error, 'create-schema:_find', 'nobox_find');
  }
};

export const _findOne = async <T extends CObject, P extends Partial<T>>(args: CallCommandsWithParams<T, P>) => {
  try {
    return await call({ ...args, ...callResourcesByType['_findOne'] });
  } catch (error: any) {
    return handleSchemaCallErrors(error, 'create-schema:_findOne', 'nobox:_findOne');
  }
};

export const _insert = async <T extends CObject>(args: {
  spaceModel: Space<T>;
  body: T[];
  options: Options<T>;
  config: Config;
}) => {
  try {
    return await call({ ...args, ...callResourcesByType['_insert'] });
  } catch (error: any) {
    return handleSchemaCallErrors(error, 'create-schema:_insert', 'nobox:_insert');
  }
};

export const _insertOne = async <T extends CObject>(args: {
  spaceModel: Space<T>;
  body: T;
  options: Options<T>;
  config: Config;
}) => {
  try {
    return await call({ ...args, ...callResourcesByType['_insertOne'] });
  } catch (error: any) {
    return handleSchemaCallErrors(error, 'create-schema:_insert', 'nobox:_insertOne');
  }
};

export const _updateOneById = async <T extends CObject, P extends Partial<T>>(args: {
  spaceModel: Space<T>;
  body: P;
  params: { id: string };
  options?: Options<T>;
  config: Config;
}) => {
  try {
    return await call({ ...args, ...callResourcesByType['_updateOneById'] });
  } catch (error: any) {
    return handleSchemaCallErrors(error, 'create-schema:_insert', 'nobox:_updateOneById');
  }
};

export const _updateOne = async <T extends CObject, P extends Partial<T>>(args: {
  spaceModel: Space<T>;
  body: P;
  params: P;
  options?: Options<T>;
  config: Config;
}) => {
  try {
    return await call({ ...args, ...callResourcesByType['_updateOne'] });
  } catch (error: any) {
    return handleSchemaCallErrors(error, 'create-schema:_insert', 'nobox:_updateOne');
  }
};

export const _getTokenOwner = async <T extends CObject>(args: {
  spaceModel: Space<T>;
  token: string;
  config: Config;
}) => {
  try {
    return await call({ ...args, ...callResourcesByType['_getTokenOwner'] });
  } catch (error: any) {
    return handleSchemaCallErrors(error, 'create-schema:_getTokenOwner', 'nobox:_getTokenOwner');
  }
};
