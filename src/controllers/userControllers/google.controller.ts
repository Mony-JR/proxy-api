import { Controller, Get, Route, Tags, Res, TsoaResponse,Request } from 'tsoa';
import crypto from 'crypto';
import querystring from 'querystring';
import configs from '../../config';
import { Request as ExRequest } from 'express';
import { RegisterService } from '../../services/userService/register-service';

const COGNITO_DOMAIN1 = 'https://fb-3.auth.us-east-1.amazoncognito.com';

@Route('v4/users')
@Tags('Google')
export class RegisterController_Google extends Controller {
 
    private registerService = new RegisterService()
    @Get("/google")
    public async GoogleConsentScreen(@Res() redirect: TsoaResponse<302, void>): Promise<void> {
        const redirectURI = `http://localhost:3000/v4/users/sigin/google/callback`;
        const state = crypto.randomBytes(16).toString('hex');
        const params = {
            client_id: configs.clientID,
            redirect_uri: redirectURI,
            response_type: "code",
            scope: "profile email openid", // Ensure there are no trailing spaces
            identity_provider: "Google",
            state: state,
        };

        // Add debugging output
        console.log("Redirect URI:", redirectURI);
        console.log("Client ID:", configs.clientID);
        console.log("Params:", params);

        const url = `${COGNITO_DOMAIN1}/oauth2/authorize?${querystring.stringify(params)}`;

        // Log the constructed URL for debugging
        console.log("Constructed URL:", url);

        redirect(302, undefined, { Location: url });
    }

    @Get('/sigin/google/callback')
    public async handleGoogleCallback(
    @Request() req: ExRequest,
    @Res() badRequest: TsoaResponse<400, { message: string }>,
    @Res() internalServerError: TsoaResponse<500, { message: string }>,
    @Res() success: TsoaResponse<200, any>
    ): Promise<any> {
        console.log('Google callback hit');

        const { code } = req.query;
    if (!code) {
      return badRequest(400, { message: "Authorization code is missing." });
    }
    
    try {
      const tokens = await this.registerService.exchangeGoogleAuthCodeForTokens(
        code as string
      );
      return success(200, tokens);
    } catch (error: any) {
      console.error(
        `AuthController - handleGoogleOAuthCallback() error: ${error.message}`,
        error
      );

      if (error.response) {
        // If the error is from Google's API response
        const errorResponse = error.response.data;
        return badRequest(400, {
          message: `Google OAuth error: ${
            errorResponse.error_description || errorResponse.error
          }`,
        });
      }

      return internalServerError(500, {
        message: "Internal server error during Google OAuth callback.",
      });
    }
    }
    

}
