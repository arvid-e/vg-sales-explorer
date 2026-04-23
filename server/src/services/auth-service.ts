import crypto from 'crypto';
import type { IAuthService } from '../interfaces/auth/auth-service.js';
import type { IGitHubProfile } from '../interfaces/auth/profiles.js';
import type { IUser } from '../interfaces/user/user.js';

interface GitHubTokenResponse {
  access_token: string;
  token_type: string;
  scope: string;
}

/**
 * Service which performs the authentication flow using OAuth 2.0 on GitHub.
 */
export class AuthService implements IAuthService {

  /**
   * Get the authorization URL for GitHub and sets the correct parameters
   * containing the Client ID and redirect URI.
   */
  getAuthorizationUrl(): string {
    const rootUrl = 'https://github.com/login/oauth/authorize';
    const state = crypto.randomBytes(16).toString('hex');

    const options = {
      client_id: process.env.GITHUB_CLIENT_ID as string,
      redirect_uri: process.env.GITHUB_REDIRECT_URI as string,
      scope: 'read:user user:email',
      state: state,
    };

    const queryString = new URLSearchParams(options).toString();
    return `${rootUrl}?${queryString}`;
  }

  /**
   * Send the verification code from previous step and exchange it for an access token.
   * @param code - Verification code from GitHub. 
   */
  exchangeCodeForToken = async (code: string): Promise<string> => {
    const response = await fetch(
      'https://github.com/login/oauth/access_token',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code,
        }),
      },
    );

    const data = (await response.json()) as GitHubTokenResponse;

    return data.access_token;
  };

  /**
   * Get the user's GitHub profile information using the access token.
   * @param token - Access token from code exchange.
   */
  getProviderProfile = async (token: string): Promise<IGitHubProfile> => {
    const response = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch GitHub profile');
    }

    return (await response.json()) as IGitHubProfile;
  };

  /**
   * Syncs the profile info with the locally saved user in the database using an
   * internal route on the API.
   * @param profile 
   */
  syncUserWithApi = async (profile: IGitHubProfile): Promise<IUser> => {
    const response = await fetch(
      `${process.env.API_SERVER_URL}/api/v1/internal/sync-user`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-internal-secret': process.env.INTERNAL_API_KEY,
        },
        body: JSON.stringify(profile),
      },
    );

    if (!response.ok) {
      throw new Error(`API Sync failed: ${response.statusText}`);
    }

    return (await response.json()) as IUser;
  };
}
