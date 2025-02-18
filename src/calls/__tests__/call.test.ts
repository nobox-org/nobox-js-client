/* eslint-disable @typescript-eslint/no-explicit-any */
import { Config, Space } from '../../types';
import { getConnectionInstance } from '../../resources';
import { _find, _insertOne } from '../rowed-calls';
import { CallError } from '../../utils';
// import { Logger } from "../../logger";

export const mockConfig: Config = {
  endpoint: process.env.NOBOX_API || 'https://api.nobox.cloud',
  project: process.env.NOBOX_PROJECT || '',
  token: process.env.NOBOX_TOKEN || '',
};

type Todo = {
  content: string;
  completed?: boolean;
};

const TodoStructure: Space<Todo> = {
  space: 'Todo',
  description: 'A Record Space for Todo list',
  structure: {
    content: {
      description: 'Todo content',
      type: String,
      required: true,
    },
    completed: {
      description: 'Is completed',
      required: true,
      type: Boolean,
    },
  },
};

let args: any;

beforeEach(() => {
  args = {
    spaceModel: TodoStructure,
    params: {},
    options: {
      paramRelationship: 'And',
    },
    config: mockConfig,
  };
});

describe('Async Calls', () => {
  describe('getConnectionInstance', () => {
    it('should create an axios instance with the correct baseURL and headers', () => {
      const instance = getConnectionInstance(mockConfig);

      expect(instance).toBeDefined();
    });
  });

  describe('_find function', () => {
    it('should make a GET request and return array', async () => {
      const result = await _find(args);
      expect(result).toBeInstanceOf(Array);
    });
  });

  describe('_insert function', () => {
    const good_data: Todo = {
      content: 'Tetsing something!',
      completed: false,
    };

    const bad_data: Todo = {
      content: 'Tetsing something!',
    };

    it('should make a insert one item into project', async () => {
      const result = await _insertOne({
        ...args,
        body: good_data,
      });

      expect(result).toBeDefined();
    });

    it('should throw error on insert of bad item into project', async () => {
      await expect(
        _insertOne({
          ...args,
          body: bad_data,
        }),
      ).rejects.toThrow();
    });
    it('should throw error on insert of bad item into project, error type must be CallError', async () => {
      try {
        const result = await _insertOne({
          ...args,
          body: bad_data,
        });
        console.error(result);
        fail("Bad input didn't cause error!");
      } catch (err) {
        expect(err).toBeInstanceOf(CallError);
        expect((err as any).statusCode).toBe(400);
      }
    });
  });
});
