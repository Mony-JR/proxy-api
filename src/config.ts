import dotenv from 'dotenv';
import path from 'path';
import * as yup from 'yup';

type Config = {
  env: string;
  port: number;
  mongodbUrl: string;
  region: string;
  keyId: string;
  keySecret: string;
  clientID: string;
  clientSecret:string;
  googleID: string;
  googleKey: string;
  host: string;
};

// Function to load and validate environment variables
function loadConfig(): Config {
  // Determine the environment and set the appropriate .env file
  const env = process.env.NODE_ENV || 'development';
  const envPath = path.resolve(__dirname, `./configs/.env.${env}`);
  dotenv.config({ path: envPath });

  // Define a schema for the environment variables using yup
  const envVarsSchema = yup.object().shape({
    NODE_ENV: yup.string().oneOf(['development', 'production', 'test']).default('development'),
    PORT: yup.number().default(3000),
    MONGODB_URL: yup.string().required(),
    AWS_REGOIN: yup.string().required(),
    AWS_ACCESS_KEY_ID: yup.string().required(),
    AWS_SECRETKEY: yup.string().required(),
    Cognito_clientID: yup.string().required(),
    Cognito_secretHash: yup.string().required(),
    COGNITO_APP_CLIENT_ID:yup.string().required(),
    COGNITO_APP_CLIENT_SECRET:yup.string().required(),
    HOST:yup.string().required(),

  }).required();

  // Validate the environment variables
  let envVars;
  try {
    envVars = envVarsSchema.validateSync(process.env, { stripUnknown: true });
  } catch (error) {
    throw new Error(`Config validation error: ${error}`);
  }

  return {
    env: envVars.NODE_ENV,
    port: envVars.PORT,
    mongodbUrl: envVars.MONGODB_URL,
    region: envVars.AWS_REGOIN,
    keyId: envVars.AWS_ACCESS_KEY_ID,
    keySecret: envVars.AWS_SECRETKEY,
    clientSecret:envVars.Cognito_secretHash,
    clientID:envVars.Cognito_clientID,
    googleID: envVars.COGNITO_APP_CLIENT_ID,
    googleKey: envVars.COGNITO_APP_CLIENT_SECRET,
    host: envVars.HOST,


  };
}

// Export the loaded configuration
const configs = loadConfig();
export default configs;