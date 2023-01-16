export type StructureFieldType = 'TEXT' | 'NUMBER';

export type CObject = Record<string, any>;

export interface StructureItem {
  description?: string;
  required?: boolean;
  type: StructureFieldType;
  unique?: boolean;
  hashed?: boolean;
}

export type Structure<T> = Record<keyof T, StructureItem | StructureFieldType>;

export interface SpaceAuthOptions {
  active?: boolean;
  space: string;
  scope?: ('find' | 'insert' | 'delete' | 'update')[];
  token?: string;
}

export interface SpaceFunctionValues<T> {
  compulsoryParams: Partial<keyof T>[];
}

export interface SpaceFunctionOptions<T> {
  login?: SpaceFunctionValues<T>;
}

export interface Space<T> {
  space: string;
  description: string;
  authOptions?: SpaceAuthOptions;
  structure: Structure<T>;
  functionOptions?: SpaceFunctionOptions<T>;
}

export interface Schema<T, P> {
  find: (params: P) => T;
}

export enum CallVerb {
  Get = 'get',
  Post = 'post',
}

export enum CallType {
  Find = '_find',
  FindOne = '_findOne',
  Insert = '_insert',
  InsertOne = '_insertOne',
  UpdateOne = '_updateOne',
  UpdateOneById = '_updateOneById',
}

export interface CallCommands<T> {
  spaceModel: Space<T>;

  params?: T | Partial<T> | { id: string };

  body?: T | Partial<T> | (T | Partial<T>)[];

  slugAppend?: string;

  callVerb: CallVerb;

  options?: Options<keyof T>;

  config: Config;
}

export interface CallCommandsWithParams<T, P> extends Omit<CallCommands<T>, 'params' | 'callVerb'> {
  params: P;
  options: Options<keyof T>;
  config: Config;
}

export interface CallCommandsWithBody<T extends object> extends Omit<CallCommands<T>, 'body'> {
  body: T;
}

interface CallResources {
  slugAppend?: string;
  callVerb: CallVerb;
}

export type ReturnObject<T extends {}> = T & {
  id: string;
  updatedAt: string;
  createdAt: string;
};

export type CallResourcesByType = Record<CallType, CallResources>;

export interface SentHeaders {
  'content-type': 'application/json';
  authorization: `Bearer ${string}`;
  'auto-create-record-space': 'true' | 'false';
  'auto-create-project': 'true' | 'false';
  structure: string;
  options?: string;
}

export interface Options<T = string> {
  paramRelationship?: 'Or' | 'And';
  token?: string;
  pagination?: {
    limit: number;
    page?: number;
  };
  sort?: {
    by: T;
    order?: 'asc' | 'desc';
  };
  populate?: {
    fields: {
      from: string;
      to: string;
      new: string;
    };
    space: string;
  }[];
}

export interface Config {
  endpoint: string;
  project: string;
  autoCreate: 'true' | 'false';
  token: string;
}
