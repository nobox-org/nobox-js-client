import { call } from './call';
import { callResourcesByType } from '../resources';
import { CObject, CallCommandsForGetKeyValues, CallCommandsForSetKeyValues } from '../types';
import { handleSchemaCallErrors } from '../utils';

/**
 * This sets all the group keys in the key group at once
 *
 * @param args
 * @returns
 */

export const _setKeyValues = async <T extends CObject, P extends Partial<T>>(
  args: CallCommandsForSetKeyValues<T, P>,
) => {
  try {
    return await call({ ...args, ...callResourcesByType['_setKeyValues'] });
  } catch (error: any) {
    return handleSchemaCallErrors(
      error,
      'create-key-group-schema:_set, CallCommandsForGetKey, CallCommandsForGetKeys, CallCommandsForSetKey, CallCommandsForSetKeyValues',
      'nobox_setKeyValues',
    );
  }
};

/**
 * This gets all the keys in the keygroup
 *
 * @param args
 * @returns
 */
export const _getKeyValues = async <T extends CObject>(args: CallCommandsForGetKeyValues<T>) => {
  try {
    return await call({ ...args, ...callResourcesByType['_getKeyValues'] });
  } catch (error: any) {
    return handleSchemaCallErrors(error, 'create-key-group-schema:_getKeyValues', 'nobox_getKeyValues');
  }
};
