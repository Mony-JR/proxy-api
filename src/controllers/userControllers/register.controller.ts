import { Body, Controller, Post, Query, Route, Tags} from "tsoa";
import { LoginReq, RegisterReq } from "../../Models/register/user-register";
import { RegisterService } from "../../services/userService/register-service";
// import { Request as ExRequest } from 'express';
// import crypto from 'crypto';
// import querystring from 'querystring';
// import configs from "../../config";
// import axios from "axios";


// const COGNITO_DOMAIN = 'https://new-2.auth.us-east-1.amazoncognito.com';

@Route('/v3/users/register')
@Tags('Authentication')

export class RegisterController extends Controller {

    private RegisterService = new RegisterService();


    @Post()
    public async registerUser(
        @Body() body: RegisterReq
    ): Promise<RegisterReq | null | undefined> {
        try {
            if (!body) {
                console.log("Data not having")
            }
            const user = await this.RegisterService.Register(body)
            return user

        } catch (e) {
            console.log(e);

        }
    }
    @Post('/confirm')
    public async confirmCode(
        @Query() email: string,
        @Query() confirmationCode: string
    ): Promise<RegisterReq | null | undefined> {
        try {
            const result = await this.RegisterService.ConfirmCode1(email, confirmationCode)
            return result;
        } catch (e) {
            console.error("Error in confirming code:", e);
        }
    }
    @Post('/login')
    public async login(
        @Body() body: LoginReq
    ): Promise<RegisterReq | null | undefined> {
        try {
            const result = await this.RegisterService.login(body);
            return result;
        } catch (e) {
            console.error("Error in login:", e);
        }
    }

    // @Get("/google")
    // public async ShowConsenScreen(@Res() redirect: TsoaResponse<302, void>): Promise<void> {
    //     const redirectURI = `${configs.host}/v3/users/register/signin/google/callback`;
    //     const state = crypto.randomBytes(16).toString('hex');
    //     const params = {
    //         client_id: configs.clientID,
    //         redirect_uri: redirectURI,
    //         response_type: "code",
    //         scope: "Profile Email OpenId",  // Removed the trailing space
    //         identity_provider: "Google",
    //         state: state,
    //     };

    //     // Add debugging output
    //     console.log("Redirect URI:", redirectURI);
    //     console.log("Client ID:", configs.clientID);
    //     console.log("Params:", params);

    //     const url = `${COGNITO_DOMAIN}/oauth2/authorize?${querystring.stringify(params)}`;

    //     // Log the constructed URL for debugging
    //     console.log("Constructed URL:", url);

    //     redirect(302, undefined, { Location: url });
    // }




}