import { Config } from '../types';
import { LoginArgs, LoginResponse, _login } from './login';
import { SendOtpArgs, SendOtpResponse, _sendOtp } from './send-otp';

export const getFunctions = (config: Config) => ({
  async sendOtp<T>(args: Omit<SendOtpArgs<T>, 'config'>): Promise<SendOtpResponse> {
    return _sendOtp({ ...args, config });
  },
  async login<T>(args: Omit<LoginArgs<T>, 'config'>): Promise<LoginResponse<T> | null> {
    return _login({ ...args, config });
  },
});
