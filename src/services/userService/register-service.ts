import { CognitoIdentityProviderClient, ConfirmSignUpCommand, InitiateAuthCommand, SignUpCommand } from "@aws-sdk/client-cognito-identity-provider";
import { LoginReq, RegisterReq } from "../../Models/register/user-register";
import { RegisterRepo } from "../../user Repo/register/register.repo";
import configs from "../../config";
import * as crypto from "crypto";
import axios from "axios";


export class RegisterService {

    private registerRepo = new RegisterRepo();
    private cognitoClient = new CognitoIdentityProviderClient({ region: configs.region });
    private calculateSecretHash(username: string, clientId: string, clientSecret: string): string {
        const hash = crypto.createHmac("SHA256", clientSecret)
            .update(username + clientId)
            .digest("base64");
        return hash;
    }

    public async Register(data: RegisterReq): Promise<RegisterReq | null> {
        try {
            // Validate data
            if (!data.email || !data.password || !data.name) {
                throw new Error("Missing required registration fields: email, password, name");
            }

            // Save the registration data to your repository
            const register = await this.registerRepo.CreateRegister(data);

            const secretHash = await this.calculateSecretHash(data.email, configs.clientID, configs.clientSecret)

            console.log(`Calculated secret hash for ${data.email}`); // Log the secret hash for debugging

            // Create the SignUpCommand with the necessary parameters
            const command = new SignUpCommand({
                ClientId: configs.clientID,
                SecretHash: secretHash,
                Username: data.email,
                Password: data.password,
                UserAttributes: [
                    { Name: "given_name", Value: `${data.email} ${data.name} ${data.password} ` },
                    { Name: "name", Value: `${data.name} ${data.password}` }, // Add name.formatted attribute
                    { Name: "zoneinfo", Value: `${data.name} ${data.password}` } // Add name.formatted attribute
                ]
            });
            if (command) {
                const response = await this.cognitoClient.send(command);
                console.log("Cognito SignUp Response:", response);
            }

            console.log("Register Data:", register);
            return register

        } catch (error) {
            console.error("Error in RegisterService:", error);
            throw error;
        }
    }

    public async ConfirmCode1(email: string, code: string): Promise<RegisterReq | null> {

        const secretHash = await this.calculateSecretHash(email, configs.clientID, configs.clientSecret)

        const command = new ConfirmSignUpCommand(({
            ClientId: configs.clientID,
            SecretHash: secretHash,
            Username: email,
            ConfirmationCode: code
        }));


        this.cognitoClient.send(command)

        console.log("Token is ", code);
        return null

    }

    public async login(data: LoginReq): Promise<RegisterReq | null> {
        const secretHash = await this.calculateSecretHash(data.email, configs.clientID, configs.clientSecret)
        try {
            if (!data) {
                console.log('Data Not having')
            }
            const command = new InitiateAuthCommand({
                AuthFlow: "USER_PASSWORD_AUTH",
                ClientId: configs.clientID,

                AuthParameters: {
                    USERNAME: data.email,
                    PASSWORD: data.password,
                    SECRET_HASH: secretHash
                }
            });

            const response = await this.cognitoClient.send(command);
            console.log("Cognito InitiateAuth Response:", response);

            const data1 = {
            }
            const user = await this.registerRepo.CreateRegister(data1)
            return user

        } catch (error) {
            console.error("Error in login:", error);
            throw error;
        }
    }

    public async exchangeGoogleAuthCodeForTokens(code: string) {
        const tokenURL = "https://fb-3.auth.us-east-1.amazoncognito.com/token";
    
        const params = new URLSearchParams({
          code,
          client_id: '1c4ppbepgkqg2mnji1qiklc7g8',
          client_secret: '10b0orrvu9gmnal6duqvlp4nothiomlde88snkhlfduk4l2ng6ir',
          redirect_uri: `${configs.host}/v4/users/sigin/google/callback`,
          grant_type: "authorization_code",
        });
    
        try {
          const response = await axios.post(tokenURL, params.toString(), {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          });
          return response.data;
        } catch (error: any) {
          console.error(
            "Error exchanging authorization code:",
            error.response?.data || error.message
          );
          throw error;
        }
      }
    
}

