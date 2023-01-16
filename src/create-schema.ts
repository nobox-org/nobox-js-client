import { _find, _findOne, _insert, _insertOne, _updateOne, _updateOneById } from './calls';
import { CObject, Config, Options, ReturnObject, Space } from './types';

export const getSchemaCreator = (config: Config) => {
  return <T extends CObject>(spaceModel: Space<T>) => createSchema(spaceModel, config);
};

const createSchema = <T extends CObject>(spaceModel: Space<T>, config: Config) => {
  return {
    async find(
      params: Partial<T> = {},
      options: Options<keyof T> = {
        paramRelationship: 'And',
      },
    ): Promise<ReturnObject<T>> {
      return _find({ spaceModel, params, options, config });
    },
    async findOne(
      params: Partial<T>,
      options: Options = {
        paramRelationship: 'And',
      },
    ): Promise<ReturnObject<T>> {
      return _findOne({ spaceModel, params, options, config });
    },
    async insert(body: T[], options: Omit<Options, 'pagination'>): Promise<ReturnObject<T>[]> {
      return _insert({ spaceModel, body, options, config });
    },
    async insertOne(body: T, options: Omit<Options, 'pagination'> = {}): Promise<ReturnObject<T>> {
      return _insertOne({ spaceModel, body, options, config });
    },
    async updateOne(
      params: Partial<T>,
      body: Partial<T>,
      options?: Omit<Options, 'pagination'>,
    ): Promise<ReturnObject<T>> {
      return _updateOne({ spaceModel, params, body, options, config });
    },
    async updateOneById(id: string, body: Partial<T>, options: Omit<Options, 'pagination'>): Promise<ReturnObject<T>> {
      const params = { id };
      return _updateOneById({ spaceModel, params, body, options, config });
    },
  };
};
