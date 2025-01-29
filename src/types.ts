/* eslint-disable @typescript-eslint/no-explicit-any */
import { getKeyGroupSchemaCreator } from "./create-schema/create-key-group-schema";
import { getRowedSchemaCreator } from "./create-schema/create-rowed-schema";

export type StructureFieldType = typeof String | typeof Number | typeof Boolean | typeof Array | typeof Object;

export type CObject = Record<string, any>;

export type StructureItem<T = any, K = StructureFieldType> = {
  description?: string;
  comment?: string;
  required?: boolean;
  type: K;
  unique?: boolean;
  hashed?: boolean;
  defaultValue?: T;
}

export type Structure<T> = {
  [K in keyof T]: StructureItem<T[K]> | StructureFieldType;
};

export type SpaceAuthOptions = {
  active?: boolean;
  space: string;
  scope?: ("find" | "insert" | "delete" | "update")[];
  token?: string;
}

export type SpaceFunctionValues<T> = {
  compulsoryParams: Partial<keyof T>[];
}

export type SpaceFunctionOptions<T> = {
  login?: SpaceFunctionValues<T>;
}

export type SpaceWebhooks = {
  onInsertUrl: string;
  onUpdateUrl: string;
}

export type Space<T> = {
  space: string;
  description: string;
  webhooks?: SpaceWebhooks;
  initialData?: T[];
  clear?: boolean;
  authOptions?: SpaceAuthOptions;
  structure: Structure<T>;
  functionOptions?: SpaceFunctionOptions<T>;
}

export type Schema<T, P> = {
  find: (params: P) => T;
}

export enum CallVerb {
  Get = "get",
  Post = "post",
  Delete = "delete",
}

export enum CallType {
  Find = "_find",
  FindOne = "_findOne",
  Search = "_search",
  Insert = "_insert",
  InsertOne = "_insertOne",
  UpdateOne = "_updateOne",
  UpdateOneById = "_updateOneById",
  DeleteOneById = "_deleteOneById",
  GetTokenOwner = "_getTokenOwner",
  SetKeyValues = "_setKeyValues",
  GetKeyValues = "_getKeyValues",
}

export type RowedSchemaCreator = ReturnType<typeof getRowedSchemaCreator>;
export type KeyGroupSchemaCreator = ReturnType<typeof getKeyGroupSchemaCreator>;

export type CallCommands<T extends CObject> = {
  spaceModel: Space<T>;

  params?: T | Partial<T> | { id: string } | { searchText: string; searchableFields: (keyof T)[] };

  body?: T | Partial<T> | (T | Partial<T>)[];

  slugAppend?: string;

  callVerb: CallVerb;

  options?: Options<T>;

  config: Config;

  token?: string;

  name?: string;
}

/**
 * @description
 * This is type for KeyGroup Calls
 */
export type CallCommandsForSetKeyValues<T extends CObject, P> = {
  body: P;
} & Omit<CallCommands<T>, "body" | "callVerb">

export type CallCommandsForGetKeyValues<T extends CObject> = Omit<CallCommands<T>, "params" | "callVerb">;

/**
 * @description
 * This is type for rowed calls
 */

export type CallCommandsWithParams<T extends CObject, P> = {
  params: P;
  options: Options<T>;
  config: Config;
} & Omit<CallCommands<T>, "params" | "callVerb">

export type CallCommandsForSearch<T extends CObject, P> = {
  params: { searchableFields: (keyof T)[]; searchText: string };
} & Omit<CallCommandsWithParams<T, P>, "params">

export type CallCommandsWithBody<T extends object> = {
  body: T;
} & Omit<CallCommands<T>, "body">

type CallResources = {
  name: string;
  slugAppend?: string;
  callVerb: CallVerb;
}

export type ReturnObject<T extends CObject> = T & {
  id: string;
  updatedAt: string;
  createdAt: string;
};

export type CallResourcesByType = Record<CallType, CallResources>;

export type SentHeaders = {
  //'content-type': 'application/json';
  authorization: `Bearer ${string}`;
  "auto-create-record-space": "true" | "false";
  "auto-create-project": "true" | "false";
  mutate: "true" | "false";
  "clear-all-spaces": "true" | "false";
  structure: string;
  options?: string;
  token?: string;
}

export type Options<T extends CObject> = {
  paramRelationship?: "Or" | "And";
  token?: string;
  pagination?: {
    limit: number;
    page?: number;
  };
  sort?: {
    by: keyof ReturnObject<T>;
    order?: "asc" | "desc";
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

export type Config = {
  endpoint: string;
  project: string;
  autoCreate?: boolean;
  mutate?: boolean;
  token: string;
  clear?: boolean;
}
