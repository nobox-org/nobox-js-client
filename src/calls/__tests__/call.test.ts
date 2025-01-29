/* eslint-disable @typescript-eslint/no-explicit-any */
import { Config, Space } from "../../types";
import { getConnectionInstance } from "../../resources";
import { _find, _insertOne } from "../rowed-calls";

export const mockConfig: Config = {
  endpoint: "https://api.nobox.cloud",
  project: "nobox-test",
  token: "b4hgbdmjpma_galnmur_jiddmm4dnmpymo43aigb",
};

type Todo = {
  content: string;
  completed?: boolean;
};

const TodoStructure: Space<Todo> = {
  space: "Todo",
  description: "A Record Space for Todo list",
  structure: {
    content: {
      description: "Todo content",
      type: String,
      required: true,
    },
    completed: {
      description: "Is completed",
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
        paramRelationship: "And",
    },
    config: mockConfig,
    };
});

describe("Axios functions", () => {
    

    describe("getConnectionInstance", () => {
        it("should create an axios instance with the correct baseURL and headers", () => {

            const instance = getConnectionInstance(mockConfig);

            expect(instance).toBeDefined();
        });
    });

    describe("_find function", () => {

        it("should make a GET request and return array", async () => {
            const result = await _find(args);
            expect(result).toBeInstanceOf(Array);
        });
    });

    describe("_insert function", () => {
        const good_data: Todo = {
            content: "Tetsing something!",
            completed: false,
        }

        const bad_data: Todo = {
            content: "Tetsing something!",
        }

        it("should make a insert one item into project", async () => {

            const result = await _insertOne({
                  ...args,
                  body: good_data
              })

            expect(result).toBeDefined();
        });

        it("should not make an insert of bad item into project", async () => {

            const result = await _insertOne({
                  ...args,
                  body: bad_data
              })

            expect(result).toBeUndefined();
        });
    });
});
