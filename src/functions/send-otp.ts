import { cLogger, Logger } from '../logger';
import { getConnectionInstance } from '../resources';
import { CallVerb, Config, Space } from '../types';
import { extractErrorMessage, reMapSpaceStructureForCreation } from '../utils';

export type SendOtpArgs<T> = {
  body: Partial<T>;
  space: Space<T>;
  emailField: keyof T;
  hiNameField: keyof T;
  config: Config;
};

export type SendOtpResponse = {
  success: boolean;
};

/**
 * Sends User OTP Email
 * @param args
 * @param args.body
 * - - The body can only have one field
 * -  The field must be the email field of the space
 * @param args.space
 * - Space to check Email Against
 * @example {body: { email: "mail@example.com"}, Space: "User"}
 */

export const _sendOtp = async <T>(args: SendOtpArgs<T>): Promise<SendOtpResponse> => {
  const { body, space, emailField, hiNameField, config } = args;

  const spaceStructure = reMapSpaceStructureForCreation(space, config);

  const connect = getConnectionInstance(args.config);
  try {
    const res = await connect[CallVerb.Post]('function/send-otp', body, {
      headers: {
        'function-resources': JSON.stringify({
          mustExistSpaceStructures: [spaceStructure],
          receiverEmailField: emailField,
          receiverHiNameField: hiNameField,
        }),
      },
    });
    return res.data;
  } catch (error: any) {
    Logger.log(error, 'functions::sendOtp');
    const extractedErrorMessage = extractErrorMessage(error);
    cLogger.log(extractedErrorMessage, 'functions::sendOtp');
  }

  return { success: false };
};
