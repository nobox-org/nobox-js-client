import { Config, KeyGroupSchemaCreator, RowedSchemaCreator } from '../types';
import { getKeyGroupSchemaCreator } from './create-key-group-schema';
import { getRowedSchemaCreator } from './create-rowed-schema';

export function getSchemaCreator(config: Config, options: { type: 'rowed' }): RowedSchemaCreator;
export function getSchemaCreator(config: Config, options: { type: 'key-group' }): KeyGroupSchemaCreator;

export function getSchemaCreator(
  config: Config,
  options: { type: 'rowed' | 'key-group' },
): RowedSchemaCreator | KeyGroupSchemaCreator {
  const { type = 'rowed' } = options;

  if (type === 'rowed') {
    return getRowedSchemaCreator(config);
  }

  if (type === 'key-group') {
    return getKeyGroupSchemaCreator(config);
  }

  throw new Error('Invalid type');
}
