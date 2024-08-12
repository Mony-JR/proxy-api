import { Controller, Get, Res, Route, Tags, TsoaResponse,Request } from "tsoa"
import configs from "../../config";
import crypto from 'crypto'
import querystring from 'querystring'
import { Request as ExRequest } from 'express';
import { FacebookService } from "../../services/userService/facebook-register";

const COGNITO_DOMAIN1 = 'https://fb-3.auth.us-east-1.amazoncognito.com';

@Route ('v5/users')
@Tags('facebook')
export class RegisterWithFacebook extends Controller {
    private FacebookService =new FacebookService ()


    @Get("/facebook")
    public async FacebookConsentScreen(
        @Res() redirect: TsoaResponse<302, void>
    ): Promise<void> {
        const redirectURI = `http://localhost:3000/v5/users/sigin/facebook/callback`;
        const state = crypto.randomBytes(16).toString('hex');
        const params = {
            client_id: configs.clientID,
            redirect_uri: redirectURI,
            response_type: "code",
            scope: "openid profile ", // Ensure 'email' is included
            identity_provider: "Facebook", // Direct Cognito to use Facebook
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

    @Get('/sigin/facebook/callback')
    public async handleFacebookCallback(
      @Request() req: ExRequest,
      @Res() badRequest: TsoaResponse<400, { message: string }>,
      @Res() internalServerError: TsoaResponse<500, { message: string }>,
      @Res() success: TsoaResponse<200, any>
    ): Promise<any> {
      const { code, error, error_description } = req.query;
  
      if (error) {
        return badRequest(400, { message: `OAuth error: ${error_description}` });
      }
  
      if (!code) {
        return badRequest(400, { message: "Authorization code is missing." });
      }
      
      try {
        const tokens = await this.FacebookService.exchangeGoogleAuthCodeForTokens(
          code as string
        );
        return success(200, tokens);
      } catch (error: any) {
        console.error(
          `AuthController - handleGoogleOAuthCallback() error: ${error.message}`,
          error
        );
  
        if (error.response) {
          const errorResponse = error.response.data;
          return badRequest(400, {
            message: `OAuth error: ${
              errorResponse.error_description || errorResponse.error
            }`,
          });
        }
  
        return internalServerError(500, {
          message: "Internal server error during OAuth callback.",
        });
      }
    }
    }

