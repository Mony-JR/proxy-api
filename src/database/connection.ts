import mongoose from 'mongoose';
import configs from '../config';
// import configs from '../utils/config';


const connectDB = async () => {
    try {
        await mongoose.connect(configs.mongodbUrl || '');
        // await mongoose.connect('mongodb+srv://mony:8tuL6c4irbVNCYdg@cluster0.7r2ktrw.mongodb.net/Bookstore');
        console.log('MongoDB connected...');
    } catch (err) {
        console.log("failed to connect");
        
    }
};

export default connectDB;
