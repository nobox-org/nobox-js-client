/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosResponse } from "axios";
import { getConnectionInstance } from "../resources";
import { CallCommands, CallVerb, CObject } from "../types";
import { handleCallErrors, prepareData } from "../utils";
import { Logger } from "../logger";

export const call = async <T extends CObject>({
  spaceModel,
  params,
  body,
  slugAppend,
  name,
  callVerb,
  options,
  config,
  token,
}: CallCommands<T>) => {
  try {
    const connect = getConnectionInstance(config);

    const {
      headers,
      url,
      body: _body = null,
      params: _params = null,
    } = prepareData({ spaceModel, params, body, slugAppend, options, token }, config);

    let res: AxiosResponse;

    if (callVerb === CallVerb.Get) {
      res = await connect.get(url, { params: _params, headers });
      return res.data === "" ? (name === "find" ? [] : null) : res.data;
    }

    if (callVerb === CallVerb.Post) {
      res = await connect[callVerb](url, _body, { params: _params, headers });
      return res.data;
    }

    if (callVerb === CallVerb.Delete) {
      res = await connect[callVerb](url, {
        params: _params,
        headers,
      });
      return res.data;
    }
  } catch (error: any) {
    // console.error(error, "createSchema:wrapCall");
    // throw error;
    Logger.log(error, "createSchema:wrapCall");

    handleCallErrors(error, "createSchema:wrapCall")
  }
};
