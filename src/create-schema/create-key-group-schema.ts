import { _setKeyValues, _getKeyValues, _clearKeyValues } from '../calls/key-group-calls';
import { CObject, Config, ReturnObject, Space } from '../types';

export const getKeyGroupSchemaCreator =
  (config: Config) =>
  <T extends CObject>(spaceModel: Space<T>) =>
    createKeyGroupSchema(spaceModel, config);

export type KeyGroupSchemaModel<T extends CObject> = ReturnType<typeof createKeyGroupSchema<T>>;

const createKeyGroupSchema = <T extends CObject>(spaceModel: Space<T>, config: Config) => ({
  async setKeys(body: Partial<T>): Promise<Array<ReturnObject<T>>> {
    return _setKeyValues({ spaceModel, body, config });
  },
  async getKeys(): Promise<Array<ReturnObject<T>>> {
    return _getKeyValues({ spaceModel, config });
  },
  async clear(): Promise<void> {
    return _clearKeyValues({ spaceModel, config });
  },
});
