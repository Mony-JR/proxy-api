import axios from "axios";
import configs from "../../config";


export class FacebookService {
    
    public async exchangeGoogleAuthCodeForTokens(code: string) {
        const tokenURL = "https://fb-3.auth.us-east-1.amazoncognito.com/token";
    
        const params = new URLSearchParams({
          code,
          client_id: '1c4ppbepgkqg2mnji1qiklc7g8',
          client_secret: '10b0orrvu9gmnal6duqvlp4nothiomlde88snkhlfduk4l2ng6ir',
          redirect_uri: `${configs.host}/v5/users/sigin/facebook/callback`,
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