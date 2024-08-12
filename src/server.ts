// import configs from './utils/config';

import app from './app';
import configs from './config';
import connectDB from './database/connection';

function running(){
  connectDB()
  app.listen(configs.port, () => {
  console.log(`Server is running on port ${configs.port}`);
});
}

running()
