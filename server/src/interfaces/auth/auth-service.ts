import type { IUser } from '../user/user.js';
import type { IGitHubProfile } from './profiles.js';

export interface IAuthService {
  getAuthorizationUrl(): string;
  exchangeCodeForToken(code: string): Promise<string>;
  getProviderProfile(token: string): Promise<IGitHubProfile>;
  syncUserWithApi(profile: IGitHubProfile): Promise<IUser>;
}
