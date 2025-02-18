/* eslint-disable @typescript-eslint/no-explicit-any */
import { cLogger, Logger } from '../logger';
import { getConnectionInstance } from '../resources';
import { CallVerb, CObject, Config, ReturnObject, Space } from '../types';
import { extractErrorMessage, reMapSpaceStructureForCreation } from '../utils';

export type SendPushNotificationArgs<T extends CObject> = {
  findBy?: Partial<ReturnObject<T>>;
  body: {
    title: string;
    content: string;
    fcmToken?: string;
  };
  space: Space<T>;
  tokenField: keyof T;
  config: Config;
};

export type SendPushNotificationResponse = {
  success: boolean;
};

/**
 * Sends Push Notification
 * @param args
 * @param args.body
 * @param args.findBy
 * - - title: string
 * - - body: string
 * @param args.space
 * - Space to check Email Against
 * @example {body: { title: "Greetings", body: "Good Morning"}, Space: "User"}
 */

export const _sendPushNotification = async <T extends CObject>(
  args: SendPushNotificationArgs<T>,
): Promise<SendPushNotificationResponse> => {
  const { findBy, space, tokenField, config, body } = args;

  const spaceStructure = reMapSpaceStructureForCreation(space, config);

  const connect = getConnectionInstance(args.config);

  try {
    const res = await connect[CallVerb.Post](
      'function/send-push-notification',
      {
        findBy,
        body,
      },
      {
        headers: {
          'function-resources': JSON.stringify({
            mustExistSpaceStructures: [spaceStructure],
            receiverTokenField: tokenField,
          }),
        },
      },
    );
    return res.data;
  } catch (error: any) {
    Logger.log(error, 'functions::sendPushNotification');
    const extractedErrorMessage = extractErrorMessage(error);
    cLogger.log(extractedErrorMessage, 'functions::sendPushNotification');
  }

  return { success: false };
};
