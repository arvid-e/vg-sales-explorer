import type { IGitHubProfile } from '../user/profiles.js';
import type { IUser } from '../user/user.js';

export interface IAuthService {
  getAuthorizationUrl(): string;
  exchangeCodeForToken(code: string): Promise<string>;
  getProviderProfile(token: string): Promise<IGitHubProfile>;
  syncUserWithApi(profile: IGitHubProfile): Promise<IUser>;
}
