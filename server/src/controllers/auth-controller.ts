import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import type { IAuthService } from '../interfaces/auth/auth-service.js';
import { catchAsync } from '../utils/catch-async.js';

export class AuthController {
  constructor(private authService: IAuthService) {}

  login = catchAsync(async (req: Request, res: Response) => {
    const authUrl = this.authService.getAuthorizationUrl();

    res.redirect(authUrl);
  });

  callback = catchAsync(async (req: Request, res: Response) => {
    const { code } = req.query;

    if (!code) {
      throw new Error('No authorization code received from GitHub.');
    }

    const accessToken = await this.authService.exchangeCodeForToken(
      code as string,
    );
    const profile = await this.authService.getProviderProfile(accessToken);
    const user = await this.authService.syncUserWithApi(profile);

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET as string,
      { expiresIn: '24h' },
    );

    res.cookie('app_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    res.redirect(process.env.FRONTEND_URL || 'http://localhost:5173');
  });
}
