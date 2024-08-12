import dotenv from 'dotenv';
import path from 'path';
import * as yup from 'yup';

type Config = {
  region: string;
  keyId: string;
  keySecret: string;
};

// Function to load and validate environment variables
function loadConfig(): Config {
  // Determine the environment and set the appropriate .env file
  const env = process.env.NODE_ENV || 'test';
  const envPath = path.resolve(__dirname, `./configs/.env.${env}`);
  dotenv.config({ path: envPath });

  // Define a schema for the environment variables using yup
  const envVarsSchema = yup.object().shape({
    AWS_RIGOIN: yup.string().required(),
    AWS_ACCESS_KEY_ID: yup.string().required(),
    AWS_SICRETKEY: yup.string().required(),
  }).required();

  // Validate the environment variables
  let envVars;
  try {
    envVars = envVarsSchema.validateSync(process.env, { stripUnknown: true });
  } catch (error) {
    throw new Error(`Config validation error: ${error}`);
  }

  return {
    region: envVars.AWS_RIGOIN,
    keyId: envVars.AWS_ACCESS_KEY_ID,
    keySecret: envVars.AWS_SICRETKEY,
  };
}

// Export the loaded configuration
const configsS3 = loadConfig();
export default configsS3;
